import { useEffect, useState } from 'react';
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  message,
} from 'antd';
import dayjs from 'dayjs';
import type { RecentTransaction } from '../../types/dashboard';
import type { TransactionFormData, TransactionType } from '../../types/transaction';
import { createTransaction, updateTransaction } from '../../services/transactionService';

interface TransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingTransaction?: RecentTransaction | null;
}

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Groceries',
  'Shopping',
  'Housing & Rent',
  'Transportation',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Education',
  'Personal Care',
  'Travel',
  'Other',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Rental Income',
  'Dividends',
  'Gifts',
  'Other',
];

const ACCOUNTS = [
  'Bank Account',
  'Cash',
  'Credit Card',
  'UPI',
  'Savings Account',
  'Digital Wallet',
];

export default function TransactionModal({
  open,
  onClose,
  onSuccess,
  editingTransaction,
}: TransactionModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [transactionType, setTransactionType] = useState<TransactionType>('expense');

  const isEditing = Boolean(editingTransaction);

  useEffect(() => {
    if (open) {
      if (editingTransaction) {
        setTransactionType(editingTransaction.type);
        form.setFieldsValue({
          type: editingTransaction.type,
          amount: editingTransaction.amount,
          category: editingTransaction.category,
          account: editingTransaction.account,
          date: dayjs(editingTransaction.date),
          note: editingTransaction.note || '',
        });
      } else {
        setTransactionType('expense');
        form.resetFields();
        form.setFieldsValue({
          type: 'expense',
          date: dayjs(),
          account: 'Bank Account',
        });
      }
    }
  }, [open, editingTransaction, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload: TransactionFormData = {
        type: values.type,
        amount: Number(values.amount),
        category: values.category,
        account: values.account,
        note: values.note ? values.note.trim() : '',
        date: values.date ? values.date.toISOString() : new Date().toISOString(),
      };

      if (isEditing && editingTransaction) {
        await updateTransaction(editingTransaction._id, payload);
        message.success('Transaction updated successfully');
      } else {
        await createTransaction(payload);
        message.success('Transaction added successfully');
      }

      form.resetFields();
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const errorMsg =
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message || 'Failed to save transaction';
        message.error(errorMsg);
      } else if (err && typeof err === 'object' && 'errorFields' in err) {
        // Form validation error
      } else {
        message.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = transactionType === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <Modal
      title={isEditing ? 'Edit Transaction' : 'Add Transaction'}
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText={isEditing ? 'Update' : 'Add'}
      destroyOnClose
      centered
      width={480}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: 'expense',
          date: dayjs(),
          account: 'Bank Account',
        }}
      >
        <Form.Item
          name="type"
          label="Transaction Type"
          rules={[{ required: true, message: 'Please select type' }]}
        >
          <Radio.Group
            buttonStyle="solid"
            onChange={(e) => setTransactionType(e.target.value)}
            style={{ width: '100%', display: 'flex' }}
          >
            <Radio.Button
              value="expense"
              style={{
                flex: 1,
                textAlign: 'center',
                backgroundColor: transactionType === 'expense' ? '#ef4444' : undefined,
                borderColor: transactionType === 'expense' ? '#ef4444' : undefined,
                color: transactionType === 'expense' ? '#fff' : undefined,
              }}
            >
              Expense
            </Radio.Button>
            <Radio.Button
              value="income"
              style={{
                flex: 1,
                textAlign: 'center',
                backgroundColor: transactionType === 'income' ? '#16a34a' : undefined,
                borderColor: transactionType === 'income' ? '#16a34a' : undefined,
                color: transactionType === 'income' ? '#fff' : undefined,
              }}
            >
              Income
            </Radio.Button>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          name="amount"
          label="Amount"
          rules={[
            { required: true, message: 'Please enter amount' },
            {
              type: 'number',
              min: 0.01,
              message: 'Amount must be greater than 0',
            },
          ]}
        >
          <InputNumber
            prefix="₹"
            placeholder="0.00"
            style={{ width: '100%' }}
            precision={2}
            min={0.01}
            autoFocus
          />
        </Form.Item>

        <Form.Item
          name="category"
          label="Category"
          rules={[{ required: true, message: 'Please choose or enter a category' }]}
        >
          <Select
            showSearch
            placeholder="Select or enter category"
            options={categories.map((cat) => ({ label: cat, value: cat }))}
          />
        </Form.Item>

        <Form.Item
          name="account"
          label="Payment Account"
          rules={[{ required: true, message: 'Please choose an account' }]}
        >
          <Select
            placeholder="Select account"
            options={ACCOUNTS.map((acc) => ({ label: acc, value: acc }))}
          />
        </Form.Item>

        <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: 'Please pick a date' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>

        <Form.Item name="note" label="Note (Optional)">
          <Input.TextArea
            placeholder="Add description or notes"
            rows={2}
            maxLength={500}
            showCount
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

