import { Card, Empty } from 'antd';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import type { CategoryExpense } from '../../types/dashboard';

interface Props {
    data: CategoryExpense[];
}

const COLORS = [
    '#2563eb',
    '#16a34a',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#0891b2',
    '#db2777',
];

export default function CategoryBreakdown({ data }: Props) {
    return (
        <Card title="Expense Categories" className="dashboard-card">
            {data.length === 0 ? (
                <Empty description="No expense categories available" />
            ) : (
                <ResponsiveContainer width="100%" height={280}>
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="amount"
                            nameKey="category"
                            cx="50%"
                            cy="50%"
                            outerRadius={90}
                            label
                        >
                            {data.map((item, index) => (
                                <Cell
                                    key={item.category}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip formatter={(value) => `₹${value}`} />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            )}
        </Card>
    );
}