import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { month: "Jan", sales: 400 },
  { month: "Feb", sales: 300 },
  { month: "Mar", sales: 500 },
  { month: "Apr", sales: 700 },
  { month: "May", sales: 600 },
];

export default function SalesLineChart() {
  return (
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-2">📈 Sales Overview</h2>
      <LineChart width={400} height={250} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={3} />
      </LineChart>
    </div>
  );
}
