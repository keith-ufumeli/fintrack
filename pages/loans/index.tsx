"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import Header from "@/components/Header"

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold">Loans & Borrowing</h1>
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Add Loan / Borrow Record</h2>
        <div className="flex gap-2 mb-2">
          <Input placeholder="Person" value={form.person} onChange={e => setForm({ ...form, person: e.target.value })} />
          <Input placeholder="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          <select 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-foreground" 
            value={form.type} 
            onChange={e => setForm({ ...form, type: e.target.value as "lend" | "borrow" })}
          >
            <option value="lend" className="bg-background text-foreground">Lend</option>
            <option value="borrow" className="bg-background text-foreground">Borrow</option>
          </select>
        </div>
        <Input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <Button className="mt-3" onClick={handleSubmit}>Save</Button>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="lend">Lent</TabsTrigger>
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
      </main>
    </div>
  )
}

function LoanTable({ loans }: { loans: Loan[] }) {
  return (
    <Card>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th className="text-left">Person</th>
              <th className="text-left">Type</th>
              <th className="text-left">Amount</th>
              <th className="text-left">Status</th>
              <th className="text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan._id}>
                <td className="text-left">{loan.person}</td>
                <td className="text-left">{loan.type}</td>
                <td className="text-left">${loan.amount}</td>
                <td className="text-left">{loan.status}</td>
                <td className="text-left">{new Date(loan.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
