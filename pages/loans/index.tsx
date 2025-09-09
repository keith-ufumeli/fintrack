"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/Header"
import ProtectedRoute from "@/components/ProtectedRoute"
import { CardSpotlight } from "@/components/ui/card-spotlight"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"
import { Button as StatefulButton } from "@/components/ui/stateful-button"
import { CreditCard, HandCoins, TrendingUp, TrendingDown, Receipt } from "lucide-react"
import { loanFormSchema, loanSchema, type LoanFormData, type LoanData } from "@/lib/validations"

type Loan = {
  _id: string
  person: string
  amount: number
  type: "lend" | "borrow"
  description?: string
  date: string
  status: "unpaid" | "paid"
}

export default function LoansPage() {
  const { data: session } = useSession();
  const [loans, setLoans] = useState<Loan[]>([])
  
  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      person: "",
      amount: "",
      type: "lend",
      description: "",
    },
  });

  // Helper function to get JWT token from backend
  const getJWTToken = async () => {
    if (!session?.user) return null;
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          githubId: session.user.id,
          username: session.user.name,
          email: session.user.email,
          name: session.user.name,
          avatar: session.user.image,
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.token;
      }
    } catch (error) {
      console.error('Error getting JWT token:', error);
    }
    
    return null;
  };

  // Helper function to get auth headers
  const getAuthHeaders = async () => {
    const token = await getJWTToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  };

  useEffect(() => {
    const fetchLoans = async () => {
      if (!session?.user) return;
      
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/loans`, {
          headers,
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Ensure data is an array
        if (Array.isArray(data)) {
          setLoans(data);
        } else {
          console.error('Expected array but got:', data);
          setLoans([]);
        }
      } catch (error) {
        console.error('Error fetching loans:', error);
        setLoans([]);
      }
    };

    fetchLoans();
  }, [session])

  const onSubmit = async (data: LoanFormData) => {
    try {
      // Validate and transform data for API
      const validatedData = loanSchema.parse(data);
      const headers = await getAuthHeaders();
      
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/loans`, {
        method: "POST",
        headers,
        body: JSON.stringify(validatedData),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const newLoan = await res.json();
      setLoans([newLoan, ...loans]);
      form.reset();
      return true; // Success
    } catch (error) {
      console.error("Error submitting loan:", error);
      return false; // Failure
    }
  }

  const handleFormSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger form validation
    const isValid = await form.trigger()
    
    if (!isValid) {
      return false // Form validation failed
    }
    
    // Get form data and submit
    const formData = form.getValues()
    return await onSubmit(formData)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section with 3D Card */}
          <CardContainer className="inter-var">
            <CardBody className="bg-card border-border relative group/card w-full sm:w-[30rem] h-auto rounded-lg p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-card-foreground flex items-center gap-2"
              >
                <CreditCard className="w-6 h-6" />
                Loans & Borrowing
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-foreground text-sm max-w-sm mt-2 opacity-70"
              >
                Track money you've lent to others and money you've borrowed with detailed records.
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <TrendingUp className="w-6 h-6 text-primary mb-1" />
                    <div className="text-2xl font-bold text-primary">
                      ${Array.isArray(loans) ? loans.filter(l => l.type === 'lend').reduce((sum, l) => sum + l.amount, 0) : 0}
                    </div>
                    <p className="text-xs text-foreground opacity-70">Lent Out</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <TrendingDown className="w-6 h-6 text-secondary mb-1" />
                    <div className="text-2xl font-bold text-secondary">
                      ${Array.isArray(loans) ? loans.filter(l => l.type === 'borrow').reduce((sum, l) => sum + l.amount, 0) : 0}
                    </div>
                    <p className="text-xs text-foreground opacity-70">Borrowed</p>
                  </div>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Add Loan Form with Spotlight Card */}
          <CardSpotlight className="max-w-2xl mx-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Add Loan / Borrow Record</h2>
              <Form {...form}>
                <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="person"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Person</FormLabel>
                          <FormControl>
                  <Input 
                              placeholder="Person name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                  <Input 
                    type="number" 
                              placeholder="0.00"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="lend">Lend</SelectItem>
                              <SelectItem value="borrow">Borrow</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Description"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <StatefulButton 
                    type="button" 
                    className="w-full"
                    onFormSubmit={handleFormSubmit}
                  >
                  Save Record
                </StatefulButton>
                </form>
              </Form>
            </div>
          </CardSpotlight>

          {/* Loans Table with Spotlight Card */}
          <CardSpotlight className="max-w-6xl mx-auto">
            <div className="p-6">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="all">All Loans</TabsTrigger>
                  <TabsTrigger value="lend">Lent Out</TabsTrigger>
                  <TabsTrigger value="borrow">Borrowed</TabsTrigger>
                </TabsList>

                <TabsContent value="all">
                  <LoanTable loans={Array.isArray(loans) ? loans : []} />
                </TabsContent>
                <TabsContent value="lend">
                  <LoanTable loans={Array.isArray(loans) ? loans.filter(l => l.type === "lend") : []} />
                </TabsContent>
                <TabsContent value="borrow">
                  <LoanTable loans={Array.isArray(loans) ? loans.filter(l => l.type === "borrow") : []} />
                </TabsContent>
              </Tabs>
            </div>
          </CardSpotlight>
        </div>
      </main>
    </div>
    </ProtectedRoute>
  )
}

function LoanTable({ loans }: { loans: Loan[] }) {
  if (loans.length === 0) {
    return (
      <div className="text-center py-12">
        <HandCoins className="w-16 h-16 mx-auto mb-4 text-foreground opacity-50" />
        <p className="text-foreground text-lg opacity-70">No loan records yet. Add your first record above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {loans.map((loan, index) => (
        <div 
          key={loan._id} 
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-card shadow-sm animate-in slide-in-from-bottom-4 fade-in"
        >
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            {loan.type === "lend" ? (
              <TrendingUp className="w-5 h-5 text-primary" />
            ) : (
              <TrendingDown className="w-5 h-5 text-secondary" />
            )}
            <div>
              <p className="font-medium text-card-foreground">{loan.person}</p>
              <p className="text-sm text-foreground opacity-70 capitalize">{loan.type}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
            <span className="font-semibold text-lg text-card-foreground">${loan.amount}</span>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                loan.status === 'paid' 
                  ? 'bg-primary/20 text-primary' 
                  : 'bg-secondary/20 text-secondary'
              }`}>
                {loan.status}
              </span>
              <span className="text-sm text-foreground opacity-70">
                {new Date(loan.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
