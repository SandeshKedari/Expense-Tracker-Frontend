import { Layout, Menu } from 'antd';
import {
    AppstoreOutlined,
    BarChartOutlined,
    CreditCardOutlined,
    FundOutlined,
    SettingOutlined,
    SwapOutlined,
    WalletOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;

export default function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            key: '/dashboard',
            icon: <AppstoreOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/transactions',
            icon: <SwapOutlined />,
            label: 'Transactions',
        },
        {
            key: '/accounts',
            icon: <WalletOutlined />,
            label: 'Accounts',
            disabled: true,
        },
        {
            key: '/budgets',
            icon: <CreditCardOutlined />,
            label: 'Budgets',
            disabled: true,
        },
        {
            key: '/analytics',
            icon: <BarChartOutlined />,
            label: 'Analytics',
            disabled: true,
        },
        {
            key: '/goals',
            icon: <FundOutlined />,
            label: 'Savings Goals',
            disabled: true,
        },
        {
            key: '/settings',
            icon: <SettingOutlined />,
            label: 'Settings',
            disabled: true,
        },
    ];

    return (
        <Sider
            breakpoint="lg"
            collapsedWidth="0"
            width={240}
            theme="light"
            className="app-sidebar"
        >
            <div className="sidebar-logo">
                <WalletOutlined />
                <span>SpendWise</span>
            </div>

            <Menu
                mode="inline"
                selectedKeys={[location.pathname]}
                items={menuItems}
                onClick={({ key }) => navigate(key)}
            />
        </Sider>
    );
}