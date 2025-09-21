'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Typography, Space, message, Table, Modal, Form, Input, Select, Tag, Avatar, Tabs, Statistic } from 'antd';
import { UserOutlined, LogoutOutlined, PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { SystemUser, UserRole } from '@/types/user';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function AdminDashboard() {
  const { currentUser, users, checkIns, addUser, updateUser, deleteUser, logout } = useApp();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<SystemUser | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'admin') {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleAddUser = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditUser = (user: SystemUser) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setModalVisible(true);
  };

  const handleDeleteUser = (userId: string) => {
    Modal.confirm({
      title: 'Confirmar exclusão',
      content: 'Tem certeza que deseja excluir este usuário?',
      okText: 'Sim',
      cancelText: 'Não',
      onOk: () => {
        deleteUser(userId);
        message.success('Usuário excluído com sucesso!');
      }
    });
  };

  const handleSubmit = (values: Omit<SystemUser, 'id'>) => {
    if (editingUser) {
      updateUser(editingUser.id, values);
      message.success('Usuário atualizado com sucesso!');
    } else {
      addUser(values);
      message.success('Usuário criado com sucesso!');
    }
    setModalVisible(false);
    form.resetFields();
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'red';
      case 'teacher': return 'green';
      case 'student': return 'blue';
      default: return 'default';
    }
  };

  const getRoleText = (role: UserRole) => {
    switch (role) {
      case 'admin': return 'Administrador';
      case 'teacher': return 'Professor';
      case 'student': return 'Aluno';
      default: return 'Desconhecido';
    }
  };

  // Estatísticas
  const totalUsers = users.length;
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalTeachers = users.filter(u => u.role === 'teacher').length;
  const totalAdmins = users.filter(u => u.role === 'admin').length;
  const totalCheckIns = checkIns.length;
  const pendingCheckIns = checkIns.filter(c => c.status === 'pending').length;
  const approvedCheckIns = checkIns.filter(c => c.status === 'approved').length;

  const userColumns = [
    {
      title: 'Nome',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: SystemUser) => (
        <Space>
          <Avatar icon={<UserOutlined />} />
          <Text strong>{text}</Text>
        </Space>
      )
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Tipo',
      dataIndex: 'role',
      key: 'role',
      render: (role: UserRole) => (
        <Tag color={getRoleColor(role)}>
          {getRoleText(role)}
        </Tag>
      )
    },
    {
      title: 'Ações',
      key: 'actions',
      render: (_: any, record: SystemUser) => (
        <Space>
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditUser(record)}
          >
            Editar
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />} 
            onClick={() => handleDeleteUser(record.id)}
            disabled={record.id === currentUser?.id} // Não pode deletar a si mesmo
          >
            Excluir
          </Button>
        </Space>
      )
    }
  ];

  const checkInColumns = [
    {
      title: 'Aluno',
      dataIndex: 'studentName',
      key: 'studentName'
    },
    {
      title: 'Data/Hora',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp: string) => new Date(timestamp).toLocaleString('pt-BR')
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning';
        const text = status === 'approved' ? 'Aprovado' : status === 'rejected' ? 'Rejeitado' : 'Pendente';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Observações',
      dataIndex: 'notes',
      key: 'notes',
      render: (notes: string) => notes || '-'
    }
  ];

  if (!currentUser) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        background: '#fff', 
        padding: '0 24px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <Title level={3} style={{ margin: 0, color: '#ff4d4f' }}>
            MVP Escola - Administrador
          </Title>
        </div>
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#ff4d4f' }} />
          <Text strong>{currentUser.name}</Text>
          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            onClick={handleLogout}
          >
            Sair
          </Button>
        </Space>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Estatísticas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <Card>
              <Statistic
                title="Total de Usuários"
                value={totalUsers}
                prefix={<TeamOutlined />}
              />
            </Card>
            <Card>
              <Statistic
                title="Alunos"
                value={totalStudents}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
            <Card>
              <Statistic
                title="Professores"
                value={totalTeachers}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
            <Card>
              <Statistic
                title="Administradores"
                value={totalAdmins}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
            <Card>
              <Statistic
                title="Check-ins Pendentes"
                value={pendingCheckIns}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
            <Card>
              <Statistic
                title="Check-ins Aprovados"
                value={approvedCheckIns}
                prefix={<CheckCircleOutlined />}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </div>

          {/* Tabs */}
          <Card>
            <Tabs defaultActiveKey="users" items={[
              {
                key: 'users',
                label: (
                  <Space>
                    <TeamOutlined />
                    Gerenciar Usuários
                  </Space>
                ),
                children: (
                  <div>
                    <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Title level={4} style={{ margin: 0 }}>
                        Lista de Usuários
                      </Title>
                      <Button 
                        type="primary" 
                        icon={<PlusOutlined />} 
                        onClick={handleAddUser}
                      >
                        Adicionar Usuário
                      </Button>
                    </div>
                    <Table
                      columns={userColumns}
                      dataSource={users}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
                )
              },
              {
                key: 'checkins',
                label: (
                  <Space>
                    <CheckCircleOutlined />
                    Relatório de Check-ins
                  </Space>
                ),
                children: (
                  <div>
                    <Title level={4} style={{ marginBottom: 16 }}>
                      Histórico de Check-ins
                    </Title>
                    <Table
                      columns={checkInColumns}
                      dataSource={checkIns.sort((a, b) => 
                        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                      )}
                      rowKey="id"
                      pagination={{ pageSize: 10 }}
                    />
                  </div>
                )
              }
            ]} />
          </Card>
        </div>
      </Content>

      {/* Modal de adicionar/editar usuário */}
      <Modal
        title={editingUser ? 'Editar Usuário' : 'Adicionar Usuário'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Nome"
            rules={[{ required: true, message: 'Por favor, insira o nome!' }]}
          >
            <Input placeholder="Nome completo" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Por favor, insira o email!' },
              { type: 'email', message: 'Email inválido!' }
            ]}
          >
            <Input placeholder="email@exemplo.com" />
          </Form.Item>

          <Form.Item
            name="role"
            label="Tipo de Usuário"
            rules={[{ required: true, message: 'Por favor, selecione o tipo!' }]}
          >
            <Select placeholder="Selecione o tipo de usuário">
              <Option value="student">Aluno</Option>
              <Option value="teacher">Professor</Option>
              <Option value="admin">Administrador</Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Cancelar
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Atualizar' : 'Criar'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}