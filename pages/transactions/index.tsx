import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Header from "@/components/Header";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { Button as StatefulButton } from "@/components/ui/stateful-button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { transactionFormSchema, transactionSchema, type TransactionFormData, type TransactionData } from "@/lib/validations";

interface Transaction {
  _id: string;
  type: "income" | "expense";
  amount: number;
  description: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      type: "income",
      amount: "",
      description: "",
    },
  });

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`)
      .then(res => res.json())
      .then(data => setTransactions(data));
  }, []);

  const onSubmit = async (data: TransactionFormData) => {
    try {
      // Validate and transform data for API
      const validatedData = transactionSchema.parse(data);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      form.reset();
      // Refresh transactions
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`)
        .then(res => res.json())
        .then(data => setTransactions(data));
      return true; // Success
    } catch (error) {
      console.error("Error submitting transaction:", error);
      return false; // Failure
    }
  };

  const handleFormSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    // Trigger form validation
    const isValid = await form.trigger();
    
    if (!isValid) {
      return false; // Form validation failed
    }
    
    // Get form data and submit
    const formData = form.getValues();
    return await onSubmit(formData);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-16">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Hero Section with 3D Card */}
          <CardContainer className="inter-var">
            <CardBody className="bg-card border-border relative group/card w-full sm:w-[30rem] h-auto rounded-lg p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-card-foreground flex items-center gap-2"
              >
                <DollarSign className="w-6 h-6" />
                FinTrack Dashboard
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-foreground text-sm max-w-sm mt-2 opacity-70"
              >
                Track your income and expenses with beautiful animations and intuitive design.
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <div className="text-4xl font-bold text-center flex items-center justify-center gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-8 h-8 text-primary" />
                    <span className="text-primary">${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0)}</span>
                  </div>
                  <span className="text-foreground opacity-50">-</span>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-8 h-8 text-secondary" />
                    <span className="text-secondary">${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0)}</span>
                  </div>
                </div>
                <p className="text-center text-sm text-foreground opacity-70 mt-2">Total Balance</p>
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Add Transaction Form with Spotlight Card */}
          <CardSpotlight className="max-w-2xl mx-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Add Transaction</h2>
              <Form {...form}>
                <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                              <SelectItem value="income">Income</SelectItem>
                              <SelectItem value="expense">Expense</SelectItem>
                            </SelectContent>
                          </Select>
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
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Transaction description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                  />
                </div>
                  <StatefulButton 
                    type="button" 
                    className="w-full"
                    onFormSubmit={handleFormSubmit}
                  >
                  Add Transaction
                </StatefulButton>
              </form>
              </Form>
            </div>
          </CardSpotlight>

          {/* Recent Transactions with Spotlight Card */}
          <CardSpotlight className="max-w-4xl mx-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Recent Transactions</h2>
              {transactions.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-foreground opacity-50" />
                  <p className="text-foreground text-lg opacity-70">No transactions yet. Add your first transaction above!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {transactions.map((t, index) => (
                    <div 
                      key={t._id} 
                      className="flex justify-between items-center p-4 rounded-lg border border-border bg-card shadow-sm animate-in slide-in-from-bottom-4 fade-in"
                    >
                      <div className="flex items-center space-x-3">
                        {t.type === "income" ? (
                          <TrendingUp className="w-5 h-5 text-primary" />
                        ) : (
                          <TrendingDown className="w-5 h-5 text-secondary" />
                        )}
                        <div>
                          <p className="font-medium text-card-foreground">{t.description || "No description"}</p>
                          <p className="text-sm text-foreground opacity-70 capitalize">{t.type}</p>
                        </div>
                      </div>
                      <span className={`font-semibold text-lg ${t.type === "income" ? "text-primary" : "text-secondary"}`}>
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
