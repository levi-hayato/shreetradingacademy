import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Product A", value: 400 },
  { name: "Product B", value: 300 },
  { name: "Product C", value: 200 },
  { name: "Product D", value: 100 },
];

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

export default function RevenuePieChart() {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-2">💰 Revenue Distribution</h2>
      <PieChart width={300} height={200}>
        <Pie data={data} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}
