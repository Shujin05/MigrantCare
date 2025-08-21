import { View, Text, ScrollView } from "react-native";
import { useFinance } from "../../../context/FinanceContext";
import QuestionStepper from "../../../components/QuestionStepper";
import PlanCard from "../../../components/PlanCard";
import BudgetProgress from "../../../components/BudgetProgress";
import TransactionForm from "../../../components/TransactionForm";
import TransactionList from "../../../components/TransactionList";
import ReceiptUploader from "../../../components/ReceiptUploader";


export default function FinanceScreen() {
const { plan, profile, transactions } = useFinance();


return (
<ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16 }}>
<Text className="text-2xl font-bold mb-3">Your Financial Planner (SGD)</Text>
<QuestionStepper />
{plan && (
<View className="mt-4">
<PlanCard />
</View>
)}


<View className="mt-6">
<Text className="text-xl font-semibold mb-2">Budgets & Progress</Text>
<BudgetProgress />
</View>


<View className="mt-6">
<Text className="text-xl font-semibold mb-2">Add Income / Expense</Text>
<TransactionForm />
</View>


<View className="mt-6">
<Text className="text-xl font-semibold mb-2">Scan Receipt (Web OCR)</Text>
<ReceiptUploader />
</View>


<View className="mt-6">
<Text className="text-xl font-semibold mb-2">Recent Transactions ({transactions.length})</Text>
<TransactionList />
</View>


<View className="h-8" />
</ScrollView>
);
}