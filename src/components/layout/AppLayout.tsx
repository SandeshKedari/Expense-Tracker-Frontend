import { Layout } from 'antd';
import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

interface AppLayoutProps {
    children: ReactNode;
    onAddTransaction: () => void;
}

export default function AppLayout({
    children,
    onAddTransaction,
}: AppLayoutProps) {
    return (
        <Layout className="app-layout">
            <Sidebar />

            <Layout>
                <DashboardHeader onAddTransaction={onAddTransaction} />

                <Layout.Content className="dashboard-content">
                    {children}
                </Layout.Content>
            </Layout>
        </Layout>
    );
}