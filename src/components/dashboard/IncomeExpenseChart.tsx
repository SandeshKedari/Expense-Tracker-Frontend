import { Card, Empty } from 'antd';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import type { MonthlyOverview } from '../../types/dashboard';

interface Props {
    data: MonthlyOverview[];
}

export default function IncomeExpenseChart({ data }: Props) {
    return (
        <Card title="Income vs Expenses" className="dashboard-card">
            {data.length === 0 ? (
                <Empty description="No monthly data available" />
            ) : (
                <ResponsiveContainer width="100%" height={280}>
                    <BarChart data={data}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value}`} />
                        <Legend />
                        <Bar dataKey="income" name="Income" fill="#16a34a" radius={[5, 5, 0, 0]} />
                        <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[5, 5, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </Card>
    );
}