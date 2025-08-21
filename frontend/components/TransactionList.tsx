import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useFinance } from "../context/FinanceContext"; 
import { Colors } from "../constants/Colors";

export default function TransactionList() {
  const { transactions } = useFinance();

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Recent Transactions</Text>
      <FlatList
        data={transactions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={[styles.amount, item.type === "expense" ? styles.expense : styles.income]}>
              {item.type === "expense" ? "-" : "+"}${item.amount}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  heading: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  name: { fontSize: 14 },
  amount: { fontSize: 14, fontWeight: "500" },
  expense: { color: "red" },
  income: { color: "green" },
});
