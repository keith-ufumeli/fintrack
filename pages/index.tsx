import { useEffect, useState } from "react";

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
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">FinTrack</h1>
      <form onSubmit={handleSubmit} className="space-y-2">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2 rounded w-full"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="border p-2 rounded w-full"
          required
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border p-2 rounded w-full"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Add Transaction</button>
      </form>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Transactions</h2>
        {transactions.map((t) => (
          <div key={t._id} className="flex justify-between border-b py-2">
            <span>{t.description || "No description"}</span>
            <span className={t.type === "income" ? "text-green-600" : "text-red-600"}>
              {t.type === "income" ? "+" : "-"}${t.amount}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
