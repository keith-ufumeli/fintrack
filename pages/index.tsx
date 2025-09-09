import { useEffect, useState } from "react";
import Header from "@/components/Header";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Button as StatefulButton } from "@/components/ui/stateful-button";
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState({ type: "income", amount: "", description: "" });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`)
      .then(res => res.json())
      .then(data => setTransactions(data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ type: "income", amount: "", description: "" });
    location.reload();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section with 3D Card */}
          <CardContainer className="inter-var">
            <CardBody className="bg-card border-border backdrop-blur-sm relative group/card hover:shadow-lg dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] w-full sm:w-[30rem] h-auto rounded-xl p-6 border transition-all duration-300">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-foreground flex items-center gap-2"
              >
                <DollarSign className="w-6 h-6" />
                FinTrack Dashboard
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Track your income and expenses with beautiful animations and intuitive design.
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <div className="text-4xl font-bold text-center flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-8 h-8 text-green-600" />
                    <span className="text-green-600">${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)}</span>
                  </div>
                  <span className="text-gray-400">-</span>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-8 h-8 text-red-600" />
                    <span className="text-red-600">${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)}</span>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-500 mt-2">Total Balance</p>
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Add Transaction Form with Spotlight Card */}
          <CardSpotlight className="max-w-2xl mx-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Add Transaction</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Transaction type"
                  >
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:col-span-2 lg:col-span-1"
                  />
                </div>
                <StatefulButton className="w-full">
                  Add Transaction
                </StatefulButton>
              </form>
            </div>
          </CardSpotlight>

          {/* Recent Transactions with Spotlight Card */}
          <CardSpotlight className="max-w-4xl mx-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Recent Transactions</h2>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground text-lg">No transactions yet. Add your first transaction above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((t, index) => (
                    <div 
                      key={t._id} 
                      className="flex justify-between items-center p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center space-x-3">
                        {t.type === "income" ? (
                          <TrendingUp className="w-5 h-5 text-green-500" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium text-foreground">{t.description || "No description"}</p>
                          <p className="text-sm text-muted-foreground capitalize">{t.type}</p>
                        </div>
                      </div>
                      <span className={`font-semibold text-lg ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {t.type === "income" ? "+" : "-"}${t.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardSpotlight>
        </div>
      </main>
    </div>
  );
}
