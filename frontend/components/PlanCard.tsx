import { View, Text } from "react-native";
import { useFinance, Plan } from "../context/FinanceContext"; // ✅ import Plan type
import { formatSGD } from "../utils/currency";

export default function PlanCard() {
  const { plan } = useFinance();
  if (!plan) return null;

  return (
    <View className="rounded-2xl border border-zinc-200 p-4 bg-white">
      <Text className="text-lg font-semibold mb-2">Personalized Plan</Text>
      <View className="gap-1">
        <Text>
          Suggested savings rate:{" "}
          <Text className="font-semibold">
            {Math.round(plan.suggestedSavingsRate * 100)}%
          </Text>
        </Text>
        <Text>
          Emergency fund target:{" "}
          <Text className="font-semibold">
            {formatSGD(plan.emergencyFundTarget)}
          </Text>
        </Text>
        <Text>
          Suggested monthly savings:{" "}
          <Text className="font-semibold">
            {formatSGD(plan.suggestedMonthlySavings)}
          </Text>
        </Text>
      </View>
      {plan.goalBreakdown?.length ? (
        <View className="mt-3">
          <Text className="font-semibold mb-1">Goal Contributions</Text>
          {plan.goalBreakdown.map((g: Plan["goalBreakdown"][number]) => (
            <Text key={g.name}>
              • {g.name}: {formatSGD(g.monthlyContribution)} / mo
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
