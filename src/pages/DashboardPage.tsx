
import { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Progress,
  Row,
  Space,
  Spin,
  Typography,
} from 'antd';
import {
  ArrowDownOutlined,
  ArrowUpOutlined,
  WalletOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';

import AppLayout from '../components/layout/AppLayout';
import SummaryCard from '../components/dashboard/SummaryCard';
import IncomeExpenseChart from '../components/dashboard/IncomeExpenseChart';
import CategoryBreakdown from '../components/dashboard/CategoryBreakdown';
import RecentTransactions from '../components/dashboard/RecentTransactions';
import TransactionModal from '../components/dashboard/TransactionModal';

import { getDashboardSummary } from '../services/dashboardService';
import type { DashboardData } from '../types/dashboard';

const { Title, Text } = Typography;

export function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getDashboardSummary();
      setDashboard(response);
    } catch {
      setError('Unable to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  const handleAddTransaction = () => {
    setShowTransactionModal(true);
  };

  const handleCloseTransactionModal = () => {
    setShowTransactionModal(false);
  };

  const handleTransactionSuccess = () => {
    void loadDashboard();
  };

  const summary = dashboard?.summary;

  return (
    <AppLayout onAddTransaction={handleAddTransaction}>
      <div className="dashboard-page">
        <div className="dashboard-welcome">
          <div>
            <Title level={3}>Welcome back!</Title>
            <Text type="secondary">
              Here's an overview of your finances.
            </Text>
          </div>

          <Text type="secondary">
            {new Date().toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </Text>
        </div>

        {error && (
          <Alert
            type="error"
            showIcon
            message={error}
            action={
              <Button size="small" onClick={() => void loadDashboard()}>
                Retry
              </Button>
            }
          />
        )}

        {loading ? (
          <div className="dashboard-loading">
            <Spin size="large" />
          </div>
        ) : dashboard ? (
          <>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} xl={6}>
                <SummaryCard
                  title="Total Balance"
                  amount={summary?.totalBalance ?? 0}
                  icon={<WalletOutlined />}
                  color="#2563eb"
                />
              </Col>

              <Col xs={24} sm={12} xl={6}>
                <SummaryCard
                  title="Total Income"
                  amount={summary?.totalIncome ?? 0}
                  icon={<ArrowUpOutlined />}
                  color="#16a34a"
                />
              </Col>

              <Col xs={24} sm={12} xl={6}>
                <SummaryCard
                  title="Total Expenses"
                  amount={summary?.totalExpenses ?? 0}
                  icon={<ArrowDownOutlined />}
                  color="#ef4444"
                />
              </Col>

              <Col xs={24} sm={12} xl={6}>
                <SummaryCard
                  title="Monthly Budget"
                  amount={summary?.monthlyBudget ?? 0}
                  icon={<CreditCardOutlined />}
                  color="#8b5cf6"
                />
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="dashboard-section">
              <Col xs={24} lg={16}>
                <IncomeExpenseChart data={dashboard.monthlyOverview} />
              </Col>

              <Col xs={24} lg={8}>
                <CategoryBreakdown data={dashboard.categoryBreakdown} />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col xs={24} lg={16}>
                <Card
                  title="Recent Transactions"
                  className="dashboard-card"
                  extra={
                    <Button type="link" href="/transactions">
                      View All
                    </Button>
                  }
                >
                  <RecentTransactions
                    data={dashboard.recentTransactions}
                  />
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card title="Monthly Budget" className="dashboard-card">
                  <Title level={3}>
                    ₹
                    {(summary?.remainingBudget ?? 0).toLocaleString('en-IN')}
                  </Title>

                  <Text type="secondary">Remaining budget</Text>

                  <Progress
                    percent={Math.min(
                      100,
                      Math.max(0, summary?.budgetUsedPercentage ?? 0)
                    )}
                    status={
                      (summary?.budgetUsedPercentage ?? 0) >= 100
                        ? 'exception'
                        : 'active'
                    }
                  />

                  <Space direction="vertical" className="budget-details">
                    <Text>
                      Budget: ₹
                      {(summary?.monthlyBudget ?? 0).toLocaleString('en-IN')}
                    </Text>

                    <Text>
                      Spent: ₹
                      {(summary?.totalExpenses ?? 0).toLocaleString('en-IN')}
                    </Text>
                  </Space>
                </Card>
              </Col>
            </Row>
          </>
        ) : (
          <Alert
            type="info"
            showIcon
            message="Dashboard data is not available yet."
            description="Once your dashboard API is connected, your financial summary will appear here."
          />
        )}
      </div>

      <TransactionModal
        open={showTransactionModal}
        onClose={handleCloseTransactionModal}
        onSuccess={handleTransactionSuccess}
        editingTransaction={null}
      />
    </AppLayout>
  );
}
