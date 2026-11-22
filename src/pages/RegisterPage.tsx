import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { register } from '../features/auth/authSlice';

interface RegisterValues { name: string; email: string; password: string; }

export function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const error = useAppSelector((state) => state.auth.error);

  const onFinish = async (values: RegisterValues) => {
    try {
      await dispatch(register(values)).unwrap();
      navigate('/dashboard', { replace: true });
    } catch { /* Error is rendered from Redux state. */ }
  };

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <Typography.Title level={2}>Create account</Typography.Title>
        <Typography.Paragraph type="secondary">Start tracking your money.</Typography.Paragraph>
        {error && <Alert type="error" message={error} showIcon className="form-alert" />}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Name" rules={[{ required: true }, { min: 2 }]}>
            <Input autoComplete="name" />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
            <Input autoComplete="email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }, { min: 8 }]}>
            <Input.Password autoComplete="new-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Create account</Button>
        </Form>
        <Typography.Paragraph className="auth-footer">
          Already registered? <Link to="/login">Sign in</Link>
        </Typography.Paragraph>
      </Card>
    </main>
  );
}
