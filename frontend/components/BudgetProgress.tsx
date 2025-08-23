import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useFinance, Txn } from "../context/FinanceContext";
import { formatSGD } from "../utils/currency";
import { Colors } from "../constants/Colors";

const categoryColors = [
  "#3b82f6", // blue
  "#22c55e", // green
  "#f97316", // orange
  "#e11d48", // red
  "#a855f7", // purple
];

export default function BudgetProgress() {
  const { budgets, transactions } = useFinance();

  const spentByCategory: Record<string, number> = {};
  (transactions as Txn[]).forEach((t) => {
    spentByCategory[t.category] =
      (spentByCategory[t.category] || 0) + t.amount;
  });

  return (
    <View style={styles.card}>
      <Text style={styles.heading}>💰 Budget Progress</Text>
      {Object.entries(budgets).map(([category, budget], idx) => {
        const spent = spentByCategory[category] || 0;
        const progress = budget > 0 ? Math.min(spent / budget, 1) : 0;
        const barColor = categoryColors[idx % categoryColors.length];

        return (
          <View key={category} style={styles.row}>
            <View style={styles.rowHeader}>
              <Text style={styles.category}>{category}</Text>
              <Text style={styles.amount}>
                {formatSGD(spent)} / {formatSGD(budget)}
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progress,
                  { flex: progress, backgroundColor: barColor },
                ]}
              />
              <View style={{ flex: 1 - progress }} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginVertical: 12,
  },
  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    color: "#111827",
  },
  row: {
    marginBottom: 14,
  },
  rowHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  category: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
  },
  amount: {
    fontSize: 13,
    color: "#6b7280",
    fontWeight: "500",
  },
  progressBar: {
    flexDirection: "row",
    height: 10,
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    overflow: "hidden",
  },
  progress: {
    borderRadius: 8,
  },
});
