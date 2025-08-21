import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { useFinance } from "../context/FinanceContext";

const CATEGORIES = [
  "Salary",
  "Bonus",
  "Investment",
  "Housing",
  "Food",
  "Transport",
  "Utilities",
  "Health",
  "Insurance",
  "Education",
  "Entertainment",
  "Shopping",
  "Travel",
  "Others",
];

export default function TransactionForm() {
  const { addTransaction } = useFinance();
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [note, setNote] = useState("");

  const submit = () => {
    const value = Number(amount);
    if (!value) return;
    addTransaction({
      date: new Date().toISOString(),
      type,
      amount: value,
      category,
      note,
      source: "manual",
    });
    setAmount("");
    setNote("");
  };

  return (
    <View className="bg-white rounded-2xl border border-zinc-200 p-4">
      {/* Toggle Income/Expense */}
      <View className="flex-row gap-2 mb-2">
        {(["expense", "income"] as const).map((v) => (
          <Pressable
            key={v}
            onPress={() => setType(v)}
            className={`px-3 py-2 rounded-xl border ${
              type === v ? "bg-zinc-900 border-zinc-900" : "border-zinc-300"
            }`}
          >
            <Text
              className={`text-sm ${
                type === v ? "text-white" : "text-zinc-800"
              }`}
            >
              {v}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Amount */}
      <Text className="mb-1">Amount (SGD)</Text>
      <TextInput
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="e.g., 12.90"
        className="border rounded-xl px-3 py-2 mb-2"
      />

      {/* Category */}
      <Text className="mb-1">Category</Text>
      <View className="flex-row flex-wrap gap-2 mb-2">
        {CATEGORIES.map((c) => (
          <Pressable
            key={c}
            onPress={() => setCategory(c)}
            className={`px-3 py-2 rounded-xl border ${
              category === c ? "bg-zinc-900 border-zinc-900" : "border-zinc-300"
            }`}
          >
            <Text
              className={`${category === c ? "text-white" : "text-zinc-800"}`}
            >
              {c}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Note */}
      <Text className="mb-1">Note</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        placeholder="optional"
        className="border rounded-xl px-3 py-2 mb-3"
      />

      <Pressable onPress={submit} className="bg-emerald-600 rounded-xl px-4 py-3">
        <Text className="text-white text-center font-semibold">Add</Text>
      </Pressable>
    </View>
  );
}
