// ✅ Formats numbers into Singapore Dollar currency
export const sgd = new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  export const formatSGD = (n: number) => sgd.format(n);
  