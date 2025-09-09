import { useEffect, useState } from "react";
import Header from "@/components/Header";

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
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Transactions</h1>
      <div className="bg-card border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Transaction</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
            Add Transaction
          </button>
        </form>
      </div>
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        {transactions.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No transactions yet. Add your first transaction above!</p>
        ) : (
          <div className="space-y-3">
            {transactions.map((t) => (
              <div key={t._id} className="flex justify-between items-center p-3 rounded-lg border bg-background/50">
                <div>
                  <p className="font-medium">{t.description || "No description"}</p>
                  <p className="text-sm text-muted-foreground capitalize">{t.type}</p>
                </div>
                <span className={`font-semibold ${t.type === "income" ? "text-green-600" : "text-red-600"}`}>
                  {t.type === "income" ? "+" : "-"}${t.amount}
                </span>
              </div>
            ))}
          </div>
        )}
        </div>
        </div>
      </main>
    </div>
  );
}
