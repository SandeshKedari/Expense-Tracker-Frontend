import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { login } from '../features/auth/authSlice';

interface LoginValues { email: string; password: string; }

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const error = useAppSelector((state) => state.auth.error);

  const onFinish = async (values: LoginValues) => {
    try {
      await dispatch(login(values)).unwrap();
      const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    } catch { /* Error is rendered from Redux state. */ }
  };

  return (
    <main className="auth-page">
      <Card className="auth-card">
        <Typography.Title level={2}>Welcome back</Typography.Title>
        <Typography.Paragraph type="secondary">Sign in to manage your expenses.</Typography.Paragraph>
        {error && <Alert type="error" message={error} showIcon className="form-alert" />}
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email" rules={[{ required: true }, { type: 'email' }]}>
            <Input autoComplete="email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>
          <Button type="primary" htmlType="submit" block>Sign in</Button>
        </Form>
        <Typography.Paragraph className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </Typography.Paragraph>
      </Card>
    </main>
  );
}
