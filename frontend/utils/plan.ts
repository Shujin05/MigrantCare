// utils/plan.ts

export interface Goal {
    name: string;
    monthlyContribution: number;
  }
  
  export interface Plan {
    income: number;
    suggestedSavingsRate: number;
    suggestedMonthlySavings: number;
    emergencyFundTarget: number;
    goalBreakdown: Goal[];
  }
  
  export function computePlan(input: {
    age: number;
    income: number;
    habit?: "Frugal" | "Moderate" | "Spendthrift";
    topSpending?: string;
    currentSavingsPerMonth?: number;
    goals?: { name: string; months: number; target: number }[];
  }): Plan {
    const baseRate =
      input.habit === "Frugal"
        ? 0.35
        : input.habit === "Spendthrift"
        ? 0.15
        : 0.25;
  
    const suggestedSavingsRate = Math.min(0.5, Math.max(0.1, baseRate));
    const suggestedMonthlySavings = Math.round(input.income * suggestedSavingsRate);
    const monthlySpend = input.income * (1 - suggestedSavingsRate);
  
    const emergencyFundTarget = Math.round(monthlySpend * 4.5);
  
    const goalBreakdown: Goal[] = (input.goals || [])
      .filter((g) => g.months > 0)
      .map((g) => ({
        name: g.name,
        monthlyContribution: Math.round(g.target / g.months),
      }))
      .sort((a, b) => b.monthlyContribution - a.monthlyContribution);
  
    return {
      income: input.income,
      suggestedSavingsRate,
      suggestedMonthlySavings,
      emergencyFundTarget,
      goalBreakdown,
    };
  }
  