"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

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
    <div className="p-6 space-y-6">
      <Card className="p-4">
        <h2 className="text-xl font-semibold mb-4">Add Loan / Borrow Record</h2>
        <div className="flex gap-2 mb-2">
          <Input placeholder="Person" value={form.person} onChange={e => setForm({ ...form, person: e.target.value })} />
          <Input placeholder="Amount" type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          <select className="border rounded px-2 py-1" value={form.type} onChange={e => setForm({ ...form, type: e.target.value as "lend" | "borrow" })}>
            <option value="lend">Lend</option>
            <option value="borrow">Borrow</option>
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
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {loans.map(loan => (
              <tr key={loan._id}>
                <td>{loan.person}</td>
                <td>{loan.type}</td>
                <td>${loan.amount}</td>
                <td>{loan.status}</td>
                <td>{new Date(loan.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
