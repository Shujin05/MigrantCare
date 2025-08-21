import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { nanoid } from "nanoid";
import { differenceInMonths } from "date-fns";
import { computePlan } from "../utils/plan"; // adjust path
import { formatSGD } from "../utils/currency";
import { DEFAULT_BUDGETS } from "../constants/Budgets"; // or define here

// Define types
type Goal = { name: string; target: number; by: string };
export type Profile = {
  age?: number;
  monthlyIncome?: number;
  topSpending?: string;
  habit?: "Frugal" | "Moderate" | "Spendthrift";
  goals?: Goal[];
};

export type Txn = {
  id: string;
  date: string;
  type: "income" | "expense";
  category: string;
  amount: number;
  note?: string;
  source?: "manual" | "ocr";
};

export type GoalBreakdown = {
    name: string;
    monthlyContribution: number;
  };
  
  export type Plan = {
    suggestedSavingsRate: number;
    emergencyFundTarget: number;
    suggestedMonthlySavings: number;
    goalBreakdown: GoalBreakdown[];
  };

const STORAGE_KEY = "finance_ctx_v1";

const FinanceCtx = createContext<any>(null);

export const FinanceProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, _setProfile] = useState<Profile>({});
  const [transactions, setTransactions] = useState<Txn[]>([]);
  const [budgets, setBudgets] = useState<Record<string, number>>(DEFAULT_BUDGETS);

  // Load from storage
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { profile, transactions, budgets } = JSON.parse(raw);
        _setProfile(profile || {});
        setTransactions(transactions || []);
        setBudgets(budgets || DEFAULT_BUDGETS);
      }
    })();
  }, []);

  // Persist to storage
  useEffect(() => {
    AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ profile, transactions, budgets })
    );
  }, [profile, transactions, budgets]);

  const setProfile = (updater: (p: Profile) => Profile) =>
    _setProfile(prev => updater({ ...prev }));

  const addTransaction = (t: Omit<Txn, "id">) =>
    setTransactions(prev => [{ id: nanoid(), ...t }, ...prev]);

  const removeTransaction = (id: string) =>
    setTransactions(prev => prev.filter(t => t.id !== id));

  const plan = useMemo(() => {
    if (!profile.monthlyIncome || !profile.age) return null;
    const monthlySavings =
      transactions
        .filter(t => t.type === "income")
        .reduce((s, t) => s + t.amount, 0) -
      transactions
        .filter(t => t.type === "expense")
        .reduce((s, t) => s + t.amount, 0);

    const monthsToGoals = (profile.goals || []).map(g => ({
      name: g.name,
      months: Math.max(1, differenceInMonths(new Date(g.by), new Date())),
      target: g.target,
    }));

    return computePlan({
      age: profile.age!,
      income: profile.monthlyIncome!,
      habit: profile.habit,
      topSpending: profile.topSpending,
      currentSavingsPerMonth: Math.max(0, monthlySavings),
      goals: monthsToGoals,
    });
  }, [profile, transactions]);

  return (
    <FinanceCtx.Provider
      value={{
        profile,
        setProfile,
        transactions,
        addTransaction,
        removeTransaction,
        budgets,
        setBudgets,
        plan,
      }}
    >
      {children}
    </FinanceCtx.Provider>
  );
};

export const useFinance = () => useContext(FinanceCtx);
