import React, { useEffect, useRef, useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Profile, useFinance } from "../context/FinanceContext";

/** Visual tag for “chips” (habits) */
function Chip({
  selected,
  label,
  onPress,
  color = "indigo",
}: {
  selected: boolean;
  label: string;
  onPress: () => void;
  color?: "indigo" | "emerald" | "amber" | "rose";
}) {
  const active =
    color === "emerald"
      ? "bg-emerald-600"
      : color === "amber"
      ? "bg-amber-500"
      : color === "rose"
      ? "bg-rose-500"
      : "bg-indigo-600";

  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 rounded-2xl ${
        selected ? `${active} shadow-sm` : "bg-gray-100"
      }`}
    >
      <Text className={`text-sm font-medium ${selected ? "text-white" : "text-gray-800"}`}>
        {label}
      </Text>
    </Pressable>
  );
}

type Habit = "Frugal" | "Moderate" | "Spendthrift";

type LocalState = {
  age: string;
  income: string;
  habit: Habit;
  topSpending: string;
  goalName: string;
  goalTarget: string;
  goalBy: string; // YYYY-MM-DD
};

const TOTAL_STEPS = 5; // 0..4

export default function QuestionStepper() {
  const { setProfile } = useFinance();
  const [step, setStep] = useState(0);

  const [local, setLocal] = useState<LocalState>({
    age: "",
    income: "",
    habit: "Moderate",
    topSpending: "Food",
    goalName: "Emergency Fund",
    goalTarget: "3000",
    goalBy: "2026-12-31",
  });

  // Refs for accessibility focus management (web)
  const ageRef = useRef<TextInput>(null);
  const incomeRef = useRef<TextInput>(null);
  const topSpendingRef = useRef<TextInput>(null);
  const goalNameRef = useRef<TextInput>(null);
  const goalTargetRef = useRef<TextInput>(null);
  const goalByRef = useRef<TextInput>(null);

  useEffect(() => {
    if (step === 0 && ageRef.current) ageRef.current.focus();
    if (step === 1 && incomeRef.current) incomeRef.current.focus();
    if (step === 3 && topSpendingRef.current) topSpendingRef.current.focus();
    if (step === 4 && goalNameRef.current) goalNameRef.current.focus();
  }, [step]);

  const next = () => setStep((s) => Math.min(4, s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  // Disable Next until required fields are valid
  const ageOK = Number(local.age) > 0;
  const incomeOK = Number(local.income) > 0;
  const goalOK =
    local.goalName.trim().length > 0 &&
    Number(local.goalTarget) >= 0 &&
    /^\d{4}-\d{2}-\d{2}$/.test(local.goalBy);

  const canNext =
    (step === 0 && ageOK) ||
    (step === 1 && incomeOK) ||
    step === 2 ||
    step === 3 ||
    (step === 4 && goalOK);

  const save = () => {
    // Final validation guard
    if (!ageOK || !incomeOK) return;
    setProfile((p: Profile): Profile => ({
      ...p,
      age: Number(local.age) || undefined,
      monthlyIncome: Number(local.income) || undefined,
      habit: local.habit,
      topSpending: local.topSpending,
      goals: [
        {
          name: local.goalName.trim(),
          target: Number(local.goalTarget) || 0,
          by: local.goalBy,
        },
      ],
    }));
  };

  return (
    <View className="bg-white rounded-3xl shadow-lg p-6">
      {/* Header */}
      <View className="mb-4">
        <Text className="text-xl font-extrabold text-indigo-700">
          Your Financial Planner (SGD)
        </Text>
        <Text className="text-sm text-gray-500">✨ Quick Diagnostics</Text>
      </View>

      {/* Step counter */}
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-xs font-semibold text-gray-500">
          Step {step + 1} of {TOTAL_STEPS}
        </Text>
        <Text className="text-xs text-gray-400">Answer honestly for the best plan</Text>
      </View>

      {/* Progress bar */}
      <View className="w-full h-2 bg-gray-200 rounded-full mb-5 overflow-hidden">
        <View
          className="h-2 bg-indigo-500"
          style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }}
        />
      </View>

      {/* Step 0 - Age */}
      {step === 0 && (
        <View>
          <Text className="mb-2 text-gray-700 font-medium text-base">🎂 How old are you?</Text>
          <TextInput
            ref={ageRef}
            keyboardType="numeric"
            value={local.age}
            onChangeText={(t) => setLocal({ ...local, age: t })}
            className="border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 shadow-sm text-base text-gray-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
            placeholder="e.g., 23"
            placeholderTextColor="#9CA3AF"
            returnKeyType="next"
            onSubmitEditing={() => setStep(1)}
          />
          {!ageOK && local.age !== "" && (
            <Text className="text-xs text-rose-500 mt-1">Please enter a valid age.</Text>
          )}
        </View>
      )}

      {/* Step 1 - Income */}
      {step === 1 && (
        <View>
          <Text className="mb-2 text-gray-700 font-medium text-base">💵 Monthly take-home salary (SGD)?</Text>
          <TextInput
            ref={incomeRef}
            keyboardType="numeric"
            value={local.income}
            onChangeText={(t) => setLocal({ ...local, income: t })}
            className="border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 shadow-sm text-base text-gray-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300"
            placeholder="e.g., 2800"
            placeholderTextColor="#9CA3AF"
            returnKeyType="next"
            onSubmitEditing={() => setStep(2)}
          />
          {!incomeOK && local.income !== "" && (
            <Text className="text-xs text-rose-500 mt-1">Enter a number greater than 0.</Text>
          )}
        </View>
      )}

      {/* Step 2 - Habit */}
      {step === 2 && (
        <View>
          <Text className="mb-3 text-gray-700 font-medium text-base">🛍️ Spending habits</Text>
          <View className="flex-row gap-2 flex-wrap">
            {(["Frugal", "Moderate", "Spendthrift"] as const).map((h) => (
              <Chip
                key={h}
                label={h}
                selected={local.habit === h}
                onPress={() => setLocal({ ...local, habit: h })}
                color={h === "Frugal" ? "emerald" : h === "Moderate" ? "indigo" : "rose"}
              />
            ))}
          </View>
          <Text className="text-xs text-gray-400 mt-2">
            We’ll suggest a savings rate based on this.
          </Text>
        </View>
      )}

      {/* Step 3 - Top Spending */}
      {step === 3 && (
        <View>
          <Text className="mb-2 text-gray-700 font-medium text-base">🍔 Most money is spent on</Text>
          <TextInput
            ref={topSpendingRef}
            value={local.topSpending}
            onChangeText={(t) => setLocal({ ...local, topSpending: t })}
            className="border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 shadow-sm text-base text-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-300"
            placeholder="e.g., Food / Transport / Shopping"
            placeholderTextColor="#9CA3AF"
            returnKeyType="next"
            onSubmitEditing={() => setStep(4)}
          />
        </View>
      )}

      {/* Step 4 - Goals */}
      {step === 4 && (
        <View>
          <Text className="mb-2 text-gray-700 font-medium text-base">🎯 Primary goal</Text>
          <TextInput
            ref={goalNameRef}
            value={local.goalName}
            onChangeText={(t) => setLocal({ ...local, goalName: t })}
            className="border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 shadow-sm text-base text-gray-800 mb-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-300"
            placeholder="e.g., Emergency Fund"
            placeholderTextColor="#9CA3AF"
            returnKeyType="next"
            onSubmitEditing={() => goalTargetRef.current?.focus()}
          />
          <Text className="mb-2 text-gray-700 font-medium text-base">💰 Target Amount (SGD)</Text>
          <TextInput
            ref={goalTargetRef}
            keyboardType="numeric"
            value={local.goalTarget}
            onChangeText={(t) => setLocal({ ...local, goalTarget: t })}
            className="border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 shadow-sm text-base text-gray-800 mb-3 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-300"
            placeholder="e.g., 3000"
            placeholderTextColor="#9CA3AF"
            returnKeyType="next"
            onSubmitEditing={() => goalByRef.current?.focus()}
          />
          <Text className="mb-2 text-gray-700 font-medium text-base">📅 Target Date</Text>
          <TextInput
            ref={goalByRef}
            value={local.goalBy}
            onChangeText={(t) => setLocal({ ...local, goalBy: t })}
            className="border border-gray-300 rounded-2xl px-4 py-3 bg-gray-50 shadow-sm text-base text-gray-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-300"
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9CA3AF"
          />
          {!goalOK && (
            <Text className="text-xs text-rose-500 mt-1">
              Please fill all goal fields (valid date format).
            </Text>
          )}
        </View>
      )}

      {/* Navigation */}
      <View className="flex-row items-center justify-between mt-8">
        <Pressable
          onPress={back}
          disabled={step === 0}
          className={`flex-1 py-3 rounded-2xl mr-2 ${
            step === 0 ? "bg-gray-200" : "bg-rose-500"
          }`}
        >
          <Text
            className={`text-center font-semibold ${
              step === 0 ? "text-gray-400" : "text-white"
            }`}
          >
            ⬅ Back
          </Text>
        </Pressable>

        {step < 4 ? (
          <Pressable
            onPress={next}
            disabled={!canNext}
            className={`flex-1 py-3 rounded-2xl ml-2 ${
              canNext ? "bg-indigo-600" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                canNext ? "text-white" : "text-gray-500"
              }`}
            >
              Next ➡
            </Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={save}
            disabled={!goalOK || !ageOK || !incomeOK}
            className={`flex-1 py-3 rounded-2xl ml-2 ${
              goalOK && ageOK && incomeOK ? "bg-emerald-600" : "bg-gray-300"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                goalOK && ageOK && incomeOK ? "text-white" : "text-gray-500"
              }`}
            >
              ✅ Save
            </Text>
          </Pressable>
        )}
      </View>

      {/* Footer */}
      <Text className="text-center text-xs text-gray-400 mt-4">
        Budgets & Progress
      </Text>
    </View>
  );
}
