import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", sales: 400 },
  { name: "Feb", sales: 300 },
  { name: "Mar", sales: 500 },
];

function SalesChart() {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-2">Sales Overview</h2>
      <LineChart width={300} height={200} data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" />
        <Line type="monotone" dataKey="sales" stroke="#4F46E5" strokeWidth={2} />
      </LineChart>
    </div>
  );
}
export default SalesChart;
