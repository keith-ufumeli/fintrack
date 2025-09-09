import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Header from "@/components/Header";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function TestAPIPage() {
  const { data: session } = useSession();
  const [testResults, setTestResults] = useState<any>({});

  const runTests = async () => {
    const results: any = {};
    
    // Test 1: Basic server connectivity
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test/test`);
      const data = await response.json();
      results.serverTest = { status: response.status, data };
    } catch (error) {
      results.serverTest = { error: error instanceof Error ? error.message : String(error) };
    }

    // Test 2: JWT Token generation
    if (session?.user) {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            githubId: session.user.id,
            username: session.user.name,
            email: session.user.email,
            name: session.user.name,
            avatar: session.user.image,
          }),
        });
        const data = await response.json();
        results.jwtTest = { status: response.status, data };
        
        // Test 3: API call with JWT
        if (data.token) {
          try {
            const apiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions?t=${Date.now()}`, {
              headers: {
                'Authorization': `Bearer ${data.token}`,
                'Content-Type': 'application/json',
              },
              cache: 'no-cache',
            });
            const apiData = await apiResponse.json();
            results.apiTest = { status: apiResponse.status, data: apiData };
          } catch (error) {
            results.apiTest = { error: error instanceof Error ? error.message : String(error) };
          }
        }
      } catch (error) {
        results.jwtTest = { error: error instanceof Error ? error.message : String(error) };
      }
    }

    setTestResults(results);
  };

  const runMigration = async () => {
    if (!session?.user) return;
    
    try {
      // Get JWT token first
      const signinResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          githubId: session.user.id,
          username: session.user.name,
          email: session.user.email,
          name: session.user.name,
          avatar: session.user.image,
        }),
      });
      
      const signinData = await signinResponse.json();
      
      if (signinData.token) {
        // Run migration
        const migrationResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/test/migrate-data`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${signinData.token}`,
            'Content-Type': 'application/json',
          },
        });
        
        const migrationData = await migrationResponse.json();
        setTestResults((prev: any) => ({ ...prev, migration: migrationData }));
      }
    } catch (error) {
      setTestResults((prev: any) => ({ ...prev, migration: { error: error instanceof Error ? error.message : String(error) } }));
    }
  };

  useEffect(() => {
    runTests();
  }, [session]);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">API Test Results</h1>
            
            <div className="space-y-6">
              <div className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Session Data</h2>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>

              <div className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Server Test</h2>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults.serverTest, null, 2)}
                </pre>
              </div>

              <div className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-2">JWT Token Test</h2>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults.jwtTest, null, 2)}
                </pre>
              </div>

              <div className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-2">API Test</h2>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults.apiTest, null, 2)}
                </pre>
              </div>

              <div className="p-4 border rounded-lg">
                <h2 className="text-xl font-semibold mb-2">Migration Test</h2>
                <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                  {JSON.stringify(testResults.migration, null, 2)}
                </pre>
              </div>

              <div className="flex gap-4">
                <button 
                  onClick={runTests}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Run Tests Again
                </button>
                
                <button 
                  onClick={runMigration}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  Migrate Existing Data
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
