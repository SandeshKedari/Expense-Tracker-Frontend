import { useCallback, useEffect, useState } from 'react';
import {
    message,
    Button,
    Card,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Modal,
    Popconfirm,
    Row,
    Select,
    Space,
    Table,
    Tag,
    Typography,
} from 'antd';
import {
    DeleteOutlined,
    EditOutlined,
    PlusOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';

import AppLayout from '../components/layout/AppLayout';

import {
    createTransaction,
    deleteTransaction,
    getTransactions,
    updateTransaction,
} from '../services/transactionService';

import type {
    Transaction,
    TransactionPayload,
    TransactionType,
} from '../types/transaction';

const { Title, Text } = Typography;
const { TextArea } = Input;

const expenseCategories = [
    'Food',
    'Travel',
    'Shopping',
    'Bills',
    'Rent',
    'Entertainment',
    'Health',
    'Education',
    'Subscription',
    'Other',
];

const incomeCategories = [
    'Salary',
    'Freelance',
    'Business',
    'Investment',
    'Gift',
    'Other',
];

const accountOptions = [
    'Cash',
    'Bank Account',
    'Credit Card',
    'Wallet',
    'Savings',
];

interface FormValues {
    type: TransactionType;
    amount: number;
    category: string;
    account: string;
    note: string;
    date: dayjs.Dayjs;
}

export function TransactionsPage() {

    const [form] = Form.useForm<FormValues>();

    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null);

    const [typeFilter, setTypeFilter] = useState<string>();
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [pageSize, setPageSize] = useState(10);

    const selectedType = Form.useWatch('type', form) ?? 'expense';

    const loadTransactions = useCallback(async () => {
        try {
            setLoading(true);

            const response = await getTransactions({
                page,
                limit: pageSize,
                type: typeFilter,
                search: search.trim() || undefined,
            });

            setTransactions(response.data);
            setTotal(response.pagination.total);
        } catch {
            message.error('Unable to load transactions');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, typeFilter, search, message]);

    useEffect(() => {
        void loadTransactions();
    }, [loadTransactions]);

    const openAddModal = () => {
        setEditingTransaction(null);

        form.setFieldsValue({
            type: 'expense',
            amount: undefined as unknown as number,
            category: undefined as unknown as string,
            account: undefined as unknown as string,
            note: '',
            date: dayjs(),
        });

        setModalOpen(true);
    };

    const openEditModal = (record: Transaction) => {
        setEditingTransaction(record);

        form.setFieldsValue({
            type: record.type,
            amount: record.amount,
            category: record.category,
            account: record.account,
            note: record.note,
            date: dayjs(record.date),
        });

        setModalOpen(true);
    };

    const handleSubmit = async (values: FormValues) => {
        try {
            setSaving(true);

            const payload: TransactionPayload = {
                type: values.type,
                amount: values.amount,
                category: values.category,
                account: values.account,
                note: values.note || '',
                date: values.date.toISOString(),
            };

            if (editingTransaction) {
                await updateTransaction(editingTransaction._id, payload);
                message.success('Transaction updated successfully');
            } else {
                await createTransaction(payload);
                message.success('Transaction created successfully');
            }

            setModalOpen(false);
            form.resetFields();
            await loadTransactions();
        } catch {
            message.error('Unable to save transaction');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTransaction(id);

            message.success('Transaction deleted successfully');

            if (transactions.length === 1 && page > 1) {
                setPage((current) => current - 1);
            } else {
                await loadTransactions();
            }
        } catch {
            message.error('Unable to delete transaction');
        }
    };

    const columns: ColumnsType<Transaction> = [
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            render: (value: string, record) => (
                <Space direction="vertical" size={0}>
                    <Text strong>{value}</Text>
                    <Text type="secondary">{record.note || 'No note'}</Text>
                </Space>
            ),
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            render: (value: string) => dayjs(value).format('DD MMM YYYY'),
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
            render: (value: TransactionType) => (
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
                <Text strong type={record.type === 'income' ? 'success' : 'danger'}>
                    {record.type === 'income' ? '+' : '-'}
                    ₹{value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            align: 'center',
            render: (_, record) => (
                <Space>
                    <Button
                        type="text"
                        icon={<EditOutlined />}
                        onClick={() => openEditModal(record)}
                    />

                    <Popconfirm
                        title="Delete transaction?"
                        description="This transaction will be permanently deleted."
                        okText="Delete"
                        cancelText="Cancel"
                        okButtonProps={{ danger: true }}
                        onConfirm={() => handleDelete(record._id)}
                    >
                        <Button
                            danger
                            type="text"
                            icon={<DeleteOutlined />}
                        />
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <AppLayout onAddTransaction={openAddModal}>
            <div className="dashboard-page">
                <Row justify="space-between" align="middle" className="mb-4">
                    <Col>
                        <Title level={3}>Transactions</Title>
                        <Text type="secondary">
                            Manage your income and expenses
                        </Text>
                    </Col>

                    <Col>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={openAddModal}
                        >
                            Add Transaction
                        </Button>
                    </Col>
                </Row>

                <Card className="dashboard-card">
                    <Row gutter={[12, 12]} className="mb-4">
                        <Col xs={24} md={12}>
                            <Input
                                placeholder="Search category or note..."
                                allowClear
                                value={search}
                                onChange={(event) => {
                                    setSearch(event.target.value);
                                    setPage(1);
                                }}
                            />
                        </Col>

                        <Col xs={24} md={6}>
                            <Select
                                placeholder="All Types"
                                allowClear
                                style={{ width: '100%' }}
                                value={typeFilter}
                                options={[
                                    { label: 'Income', value: 'income' },
                                    { label: 'Expense', value: 'expense' },
                                ]}
                                onChange={(value) => {
                                    setTypeFilter(value);
                                    setPage(1);
                                }}
                            />
                        </Col>

                        <Col xs={24} md={6}>
                            <Button
                                block
                                onClick={() => {
                                    setSearch('');
                                    setTypeFilter(undefined);
                                    setPage(1);
                                }}
                            >
                                Clear Filters
                            </Button>
                        </Col>
                    </Row>

                    <Table<Transaction>
                        rowKey="_id"
                        columns={columns}
                        dataSource={transactions}
                        loading={loading}
                        scroll={{ x: 850 }}
                        pagination={{
                            current: page,
                            pageSize,
                            total,
                            showSizeChanger: true,
                            showTotal: (count) => `Total ${count} transactions`,
                            onChange: (nextPage, nextPageSize) => {
                                setPage(nextPage);
                                setPageSize(nextPageSize);
                            },
                        }}
                    />
                </Card>
            </div>

            <Modal
                title={editingTransaction ? 'Edit Transaction' : 'Add Transaction'}
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                onOk={() => form.submit()}
                confirmLoading={saving}
                okText={editingTransaction ? 'Update' : 'Save'}
                destroyOnHidden
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleSubmit}
                >
                    <Form.Item
                        label="Transaction Type"
                        name="type"
                        rules={[{ required: true }]}
                    >
                        <Select
                            options={[
                                { label: 'Expense', value: 'expense' },
                                { label: 'Income', value: 'income' },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Amount"
                        name="amount"
                        rules={[{ required: true, message: 'Enter amount' }]}
                    >
                        <InputNumber
                            min={0.01}
                            precision={2}
                            prefix="₹"
                            style={{ width: '100%' }}
                            placeholder="Enter amount"
                        />
                    </Form.Item>

                    <Form.Item
                        label="Category"
                        name="category"
                        rules={[{ required: true, message: 'Select category' }]}
                    >
                        <Select
                            showSearch
                            options={(selectedType === 'income'
                                ? incomeCategories
                                : expenseCategories
                            ).map((category) => ({
                                label: category,
                                value: category,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Account"
                        name="account"
                        rules={[{ required: true, message: 'Select account' }]}
                    >
                        <Select
                            options={accountOptions.map((account) => ({
                                label: account,
                                value: account,
                            }))}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{ required: true, message: 'Select date' }]}
                    >
                        <DatePicker style={{ width: '100%' }} />
                    </Form.Item>

                    <Form.Item label="Note" name="note">
                        <TextArea
                            rows={3}
                            maxLength={500}
                            placeholder="Add transaction note"
                        />
                    </Form.Item>
                </Form>
            </Modal>
        </AppLayout>
    );
}