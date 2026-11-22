import { useState, useEffect } from 'react';
import { Form, InputNumber, Modal, message } from 'antd';
import { setMonthlyBudget } from '../../services/transactionService';

interface BudgetModalProps {
  open: boolean;
  currentBudget: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BudgetModal({
  open,
  currentBudget,
  onClose,
  onSuccess,
}: BudgetModalProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        amount: currentBudget > 0 ? currentBudget : undefined,
      });
    }
  }, [open, currentBudget, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      await setMonthlyBudget(Number(values.amount));
      message.success('Monthly budget updated successfully');
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const errorMsg =
          (err as { response?: { data?: { message?: string } } }).response?.data
            ?.message || 'Failed to update budget';
        message.error(errorMsg);
      } else {
        message.error('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Set Monthly Budget"
      open={open}
      onCancel={onClose}
      onOk={handleSubmit}
      confirmLoading={loading}
      okText="Save Budget"
      destroyOnClose
      centered
      width={400}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="amount"
          label="Budget Amount (₹)"
          rules={[
            { required: true, message: 'Please enter budget amount' },
            { type: 'number', min: 0, message: 'Budget cannot be negative' },
          ]}
        >
          <InputNumber
            prefix="₹"
            placeholder="e.g. 25000"
            style={{ width: '100%' }}
            precision={2}
            min={0}
            autoFocus
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

