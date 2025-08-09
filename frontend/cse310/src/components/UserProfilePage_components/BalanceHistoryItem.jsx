export default function BalanceHistoryItem({ item }) {
  const amount = Number(item.amount) || 0;
  const isPositive = amount > 0;
  const isNegative = amount < 0;

  const colorClass = isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-700";

  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    // prevent automatic sign so we can control "+" for positives
    signDisplay: "never",
  });

  const formatted = formatter.format(Math.abs(amount));
  const display = isPositive ? `+${formatted}` : isNegative ? `-${formatted}` : formatted;

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow rounded-lg mb-4">
      <p className={colorClass}>{display}</p>
      <p className="text-gray-700">{item.description}</p>
      <p className="text-gray-700">{item.date}</p>
    </div>
  );
}
