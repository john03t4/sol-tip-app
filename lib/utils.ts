// Helper functions to keep UI components clean and readable
export function truncateAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatAmount(amount: number, token: string): string {
  // USDC uses 6 decimals, SOL uses 9. We store human-readable values in DB.
  return `${amount.toFixed(token === "USDC" ? 2 : 4)} ${token}`;
}
