import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const data = [
  { name: "Jan", users: 40 },
  { name: "Feb", users: 80 },
  { name: "Mar", users: 50 },
  { name: "Apr", users: 90 },
  { name: "May", users: 120 },
];

export default function UserBarChart() {
  return (
    <div className="p-4 bg-white shadow-lg rounded-lg">
      <h2 className="text-lg font-bold mb-2">📊 User Registrations</h2>
      <BarChart width={300} height={200} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="users" fill="#10B981" />
      </BarChart>
    </div>
  );
}
