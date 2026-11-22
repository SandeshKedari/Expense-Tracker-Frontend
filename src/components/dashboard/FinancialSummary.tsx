import { Col, Row } from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  CreditCardOutlined,
  WalletOutlined,
} from '@ant-design/icons';
import SummaryCard from './SummaryCard';
import type { DashboardSummary } from '../../types/dashboard';

interface FinancialSummaryProps {
  summary: DashboardSummary;
}

export default function FinancialSummary({ summary }: FinancialSummaryProps) {
  // Total Balance = Total Income - Total Expenses
  const balance = summary.totalBalance ?? (summary.totalIncome - summary.totalExpenses);

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} xl={6}>
        <SummaryCard
          title="Total Balance"
          amount={balance}
          icon={<WalletOutlined />}
          color={balance >= 0 ? '#2563eb' : '#ef4444'}
        />
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <SummaryCard
          title="Total Income"
          amount={summary.totalIncome ?? 0}
          icon={<ArrowUpOutlined />}
          color="#16a34a"
        />
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <SummaryCard
          title="Total Expenses"
          amount={summary.totalExpenses ?? 0}
          icon={<ArrowDownOutlined />}
          color="#ef4444"
        />
      </Col>

      <Col xs={24} sm={12} xl={6}>
        <SummaryCard
          title="Monthly Budget"
          amount={summary.monthlyBudget ?? 0}
          icon={<CreditCardOutlined />}
          color="#8b5cf6"
        />
      </Col>
    </Row>
  );
}

