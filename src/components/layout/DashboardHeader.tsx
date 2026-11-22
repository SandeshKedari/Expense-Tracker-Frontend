import { Avatar, Button, Layout, Space, Typography } from 'antd';
import { BellOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

interface DashboardHeaderProps {
    onAddTransaction: () => void;
}

export default function DashboardHeader({
    onAddTransaction,
}: DashboardHeaderProps) {
    return (
        <Header className="dashboard-header">
            <div>
                <Typography.Title level={4}>Dashboard</Typography.Title>
                <Typography.Text type="secondary">
                    Manage your personal finances
                </Typography.Text>
            </div>

            <Space size="middle">
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={onAddTransaction}
                >
                    Add Transaction
                </Button>

                <Button type="text" icon={<BellOutlined />} />

                <Avatar icon={<UserOutlined />} />
            </Space>
        </Header>
    );
}