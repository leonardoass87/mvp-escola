'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, message, Select, Space, Divider } from 'antd';
import { UserOutlined, LockOutlined, TeamOutlined } from '@ant-design/icons';
import { useApp } from '@/contexts/AppContext';
import { UserRole } from '@/types/user';

const { Title, Text } = Typography;
const { Option } = Select;

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { login } = useApp();

  const onFinish = async (values: { email: string; password: string; role: UserRole }) => {
    setLoading(true);
    
    try {
      const success = login(values.email, values.password, values.role);
      
      if (success) {
        message.success('Login realizado com sucesso!');
        // O redirecionamento será feito pelo componente pai
      } else {
        message.error('Email, senha ou tipo de usuário inválidos!');
      }
    } catch (error) {
      message.error('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return '#ff4d4f';
      case 'teacher': return '#52c41a';
      case 'student': return '#1890ff';
      default: return '#666';
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card style={{ width: 450, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
            MVP Escola
          </Title>
          <Text type="secondary">
            Sistema de Check-in Escolar
          </Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
          initialValues={{ role: 'student' }}
        >
          <Form.Item
            label="Tipo de Usuário"
            name="role"
            rules={[{ required: true, message: 'Selecione o tipo de usuário!' }]}
          >
            <Select 
              placeholder="Selecione seu tipo de usuário" 
              size="large"
              suffixIcon={<TeamOutlined />}
            >
              <Option value="student">
                <Space>
                  <span style={{ color: getRoleColor('student') }}>●</span>
                  Aluno
                </Space>
              </Option>
              <Option value="teacher">
                <Space>
                  <span style={{ color: getRoleColor('teacher') }}>●</span>
                  Professor
                </Space>
              </Option>
              <Option value="admin">
                <Space>
                  <span style={{ color: getRoleColor('admin') }}>●</span>
                  Administrador
                </Space>
              </Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Por favor, insira seu email!' },
              { type: 'email', message: 'Email inválido!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Digite seu email" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Senha"
            name="password"
            rules={[{ required: true, message: 'Por favor, insira sua senha!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Digite sua senha" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{ width: '100%' }}
            >
              Entrar
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <div style={{ marginTop: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>
            Usuários de Teste:
          </Text>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <div>👨‍🎓 <strong>Aluno:</strong> aluno@escola.com</div>
            <div>👨‍🏫 <strong>Professor:</strong> prof@escola.com</div>
            <div>👨‍💼 <strong>Admin:</strong> admin@escola.com</div>
            <div style={{ marginTop: 4 }}>
              <strong>Senha:</strong> qualquer senha
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            Desenvolvido para gestão escolar
          </Text>
        </div>
      </Card>
    </div>
  );
}