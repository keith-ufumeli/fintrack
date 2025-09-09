"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/Header"
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
  const [loans, setLoans] = useState<Loan[]>([])
  
  const form = useForm<LoanFormData>({
    resolver: zodResolver(loanFormSchema),
    defaultValues: {
      person: "",
      amount: "",
      type: "lend",
      description: "",
    },
  })

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/loans`)
      .then(res => res.json())
      .then(setLoans)
  }, [])

  const onSubmit = async (data: LoanFormData) => {
    try {
      // Validate and transform data for API
      const validatedData = loanSchema.parse(data)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/loans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData),
      })
      const newLoan = await res.json()
      setLoans([newLoan, ...loans])
      form.reset()
    } catch (error) {
      console.error("Error submitting loan:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section with 3D Card */}
          <CardContainer className="inter-var">
            <CardBody className="bg-card border-border relative group/card hover:shadow-md w-full sm:w-[30rem] h-auto rounded-lg p-6 border transition-all duration-300">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-foreground flex items-center gap-2"
              >
                <CreditCard className="w-6 h-6" />
                Loans & Borrowing
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                Track money you've lent to others and money you've borrowed with detailed records.
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <TrendingUp className="w-6 h-6 text-blue-600 mb-1" />
                    <div className="text-2xl font-bold text-blue-600">
                      ${loans.filter(l => l.type === 'lend').reduce((sum, l) => sum + l.amount, 0)}
                    </div>
                    <p className="text-xs text-gray-500">Lent Out</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <TrendingDown className="w-6 h-6 text-orange-600 mb-1" />
                    <div className="text-2xl font-bold text-orange-600">
                      ${loans.filter(l => l.type === 'borrow').reduce((sum, l) => sum + l.amount, 0)}
                    </div>
                    <p className="text-xs text-gray-500">Borrowed</p>
                  </div>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Add Loan Form with Spotlight Card */}
          <CardSpotlight className="max-w-2xl mx-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6 text-center">Add Loan / Borrow Record</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <StatefulButton type="submit" className="w-full">
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
                  <LoanTable loans={loans} />
                </TabsContent>
                <TabsContent value="lend">
                  <LoanTable loans={loans.filter(l => l.type === "lend")} />
                </TabsContent>
                <TabsContent value="borrow">
                  <LoanTable loans={loans.filter(l => l.type === "borrow")} />
                </TabsContent>
              </Tabs>
            </div>
          </CardSpotlight>
        </div>
      </main>
    </div>
  )
}

function LoanTable({ loans }: { loans: Loan[] }) {
  if (loans.length === 0) {
    return (
      <div className="text-center py-12">
        <HandCoins className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground text-lg">No loan records yet. Add your first record above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {loans.map((loan, index) => (
        <div 
          key={loan._id} 
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-card hover:bg-accent/5 transition-colors shadow-sm"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            {loan.type === "lend" ? (
              <TrendingUp className="w-5 h-5 text-blue-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-orange-500" />
            )}
            <div>
              <p className="font-medium text-foreground">{loan.person}</p>
              <p className="text-sm text-muted-foreground capitalize">{loan.type}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
            <span className="font-semibold text-lg text-foreground">${loan.amount}</span>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                loan.status === 'paid' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
              }`}>
                {loan.status}
              </span>
              <span className="text-sm text-muted-foreground">
                {new Date(loan.date).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
