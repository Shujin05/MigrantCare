import { View, Text, ScrollView } from "react-native";
import { useFinance } from "../../context/FinanceContext";
import QuestionStepper from "../../components/QuestionStepper";
import PlanCard from "../../components/PlanCard";
import BudgetProgress from "../../components/BudgetProgress";
import TransactionForm from "../../components/TransactionForm";
import TransactionList from "../../components/TransactionList";
import ReceiptUploader from "../../components/ReceiptUploader";
import { ThemedText } from "@/components/ThemedText";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

export default function Finance() {
    const { plan, profile, transactions } = useFinance();
    const router = useRouter()


    return (
        <ScrollView className="flex-1 bg-white" style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.push("/")}>
                <Ionicons name="home" size={28} color={Colors.light.text} />
                </TouchableOpacity>

            <ThemedText type="title" style={styles.headerTitle}>Your Financial Planner (SGD)</ThemedText>
            <View style={{ width: 28 }} /> 
        </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, 
  },
  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.tabIconDefault,
  },
});
