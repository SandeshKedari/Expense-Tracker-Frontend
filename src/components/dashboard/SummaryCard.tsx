import { Card, Statistic } from 'antd';
import type { ReactNode } from 'react';

interface SummaryCardProps {
    title: string;
    amount: number;
    icon: ReactNode;
    color: string;
}

export default function SummaryCard({
    title,
    amount,
    icon,
    color,
}: SummaryCardProps) {
    return (
        <Card className="summary-card">
            <div className="summary-card-icon" style={{ color }}>
                {icon}
            </div>

            <Statistic
                title={title}
                value={amount}
                precision={2}
                prefix="₹"
                valueStyle={{ fontWeight: 600 }}
            />
        </Card>
    );
}