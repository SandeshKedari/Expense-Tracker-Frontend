import { Empty, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { RecentTransaction } from '../../types/dashboard';

interface Props {
  data: RecentTransaction[];
}

export default function RecentTransactions({ data }: Props) {
  const columns: ColumnsType<RecentTransaction> = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (value: string, record) => (
        <div>
          <Typography.Text strong>{value}</Typography.Text>
          <br />
          <Typography.Text type="secondary">
            {record.note || 'No note'}
          </Typography.Text>
        </div>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (value: string) => (
        <Tag color={value === 'income' ? 'success' : 'error'}>
          {value.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      align: 'right',
      render: (value: number, record) => (
        <Typography.Text
          strong
          type={record.type === 'income' ? 'success' : 'danger'}
        >
          {record.type === 'income' ? '+' : '-'}₹
          {value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </Typography.Text>
      ),
    },
  ];

  if (data.length === 0) {
    return <Empty description="No transactions yet" />;
  }

  return (
    <Table<RecentTransaction>
      rowKey="_id"
      columns={columns}
      dataSource={data}
      pagination={false}
      scroll={{ x: 650 }}
    />
  );
}
