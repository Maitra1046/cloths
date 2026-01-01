export const formatCurrency = (amount: number): string => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

export const formatPrice = (price: number): string => {
  return formatCurrency(price);
};