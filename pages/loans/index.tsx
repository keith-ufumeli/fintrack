"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Header from "@/components/Header"
import { CardSpotlight } from "@/components/ui/card-spotlight"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"
import { Button as StatefulButton } from "@/components/ui/stateful-button"
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation"
import { CreditCard, HandCoins, TrendingUp, TrendingDown, Receipt } from "lucide-react"

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
  const [form, setForm] = useState({ person: "", amount: "", type: "lend", description: "" })

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/loans`)
      .then(res => res.json())
      .then(setLoans)
  }, [])

  const handleSubmit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/loans`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    })
    const newLoan = await res.json()
    setLoans([newLoan, ...loans])
    setForm({ person: "", amount: "", type: "lend", description: "" })
  }

  return (
    <BackgroundGradientAnimation
      gradientBackgroundStart="rgb(0, 17, 82)"
      gradientBackgroundEnd="rgb(108, 0, 162)"
      firstColor="59, 130, 246"
      secondColor="139, 92, 246"
      thirdColor="100, 220, 255"
      fourthColor="200, 50, 50"
      fifthColor="180, 180, 50"
      pointerColor="140, 100, 255"
      size="80%"
      blendingValue="hard-light"
      className="min-h-screen"
      containerClassName="min-h-screen"
    >
      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-8 pb-16">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Hero Section with 3D Card */}
          <CardContainer className="inter-var">
            <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-blue-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full sm:w-[30rem] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white flex items-center gap-2"
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
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Input 
                    placeholder="Person" 
                    value={form.person} 
                    onChange={e => setForm({ ...form, person: e.target.value })} 
                  />
                  <Input 
                    placeholder="Amount" 
                    type="number" 
                    value={form.amount} 
                    onChange={e => setForm({ ...form, amount: e.target.value })} 
                  />
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground" 
                    value={form.type} 
                    onChange={e => setForm({ ...form, type: e.target.value as "lend" | "borrow" })}
                  >
                    <option value="lend" className="bg-background text-foreground">Lend</option>
                    <option value="borrow" className="bg-background text-foreground">Borrow</option>
                  </select>
                </div>
                <Input 
                  placeholder="Description (optional)" 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                />
                <StatefulButton className="w-full" onClick={handleSubmit}>
                  Save Record
                </StatefulButton>
              </div>
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
    </BackgroundGradientAnimation>
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
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border bg-background/50 hover:bg-background/80 transition-colors"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center space-x-3 mb-2 sm:mb-0">
            {loan.type === "lend" ? (
              <TrendingUp className="w-5 h-5 text-blue-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-orange-500" />
            )}
            <div>
              <p className="font-medium">{loan.person}</p>
              <p className="text-sm text-muted-foreground capitalize">{loan.type}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
            <span className="font-semibold text-lg">${loan.amount}</span>
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
