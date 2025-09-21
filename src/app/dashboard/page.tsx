'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Layout, 
  Card, 
  Button, 
  Input, 
  Form, 
  Typography, 
  message,
  Divider
} from 'antd';
import { 
  UserAddOutlined, 
  LogoutOutlined, 
  CheckCircleOutlined,
  UserOutlined
} from '@ant-design/icons';
import { useApp } from '@/contexts/AppContext';
import CheckinList from '@/components/CheckinList';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

interface CheckinFormValues {
  studentName: string;
}

const Dashboard: React.FC = () => {
  const { currentUser, addCheckIn, logout } = useApp();
  const router = useRouter();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleCheckin = async (values: CheckinFormValues) => {
    if (!values.studentName.trim()) {
      message.error('Por favor, insira o nome do aluno!');
      return;
    }

    setLoading(true);
    
    try {
      addCheckIn({
        studentId: 'temp-id',
        studentName: values.studentName.trim(),
        status: 'pending'
      });
      message.success(`Check-in realizado para ${values.studentName}!`);
      form.resetFields();
    } catch (error) {
      message.error('Erro ao realizar check-in!');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    message.info('Logout realizado com sucesso!');
    router.push('/');
  };

  if (!currentUser) {
    return null; // Evita flash de conteúdo antes do redirect
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header 
        style={{ 
          background: '#fff', 
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />
          <div>
            <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
              MVP Escola
            </Title>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Sistema de Check-in
            </Text>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Text>Olá, {currentUser.email}</Text>
          <Button 
            type="text" 
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Sair
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '24px', background: '#f0f2f5' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                <span>Fazer Check-in</span>
              </div>
            }
            style={{ marginBottom: 24 }}
          >
            <Form
              form={form}
              onFinish={handleCheckin}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="studentName"
                label="Nome do Aluno"
                rules={[
                  { required: true, message: 'Por favor, insira o nome do aluno!' },
                  { min: 2, message: 'O nome deve ter pelo menos 2 caracteres!' }
                ]}
              >
                <Input 
                  placeholder="Digite o nome completo do aluno"
                  prefix={<UserAddOutlined />}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0 }}>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<CheckCircleOutlined />}
                  size="large"
                  style={{ width: '100%' }}
                >
                  Registrar Check-in
                </Button>
              </Form.Item>
            </Form>

            <Divider />
            
            <div style={{ textAlign: 'center' }}>
              <Text type="secondary">
                Digite o nome do aluno e clique em &quot;Registrar Check-in&quot; para marcar presença
              </Text>
            </div>
          </Card>

          <CheckinList />
        </div>
      </Content>
    </Layout>
  );
};

export default Dashboard;