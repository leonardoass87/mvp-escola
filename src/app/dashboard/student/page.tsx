'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Typography, Space, message, List, Tag, Avatar } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function StudentDashboard() {
  const { currentUser, checkIns, addCheckIn, logout } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'student') {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleCheckIn = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      addCheckIn({
        studentId: currentUser.id,
        studentName: currentUser.name,
        status: 'pending'
      });
      message.success('Check-in realizado com sucesso! Aguarde a aprovação do professor.');
    } catch (error) {
      message.error('Erro ao fazer check-in. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Filtrar check-ins do aluno atual
  const myCheckIns = checkIns.filter(checkIn => checkIn.studentId === currentUser?.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Aprovado';
      case 'rejected': return 'Rejeitado';
      case 'pending': return 'Pendente';
      default: return 'Desconhecido';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircleOutlined />;
      case 'rejected': return <CloseCircleOutlined />;
      case 'pending': return <ClockCircleOutlined />;
      default: return null;
    }
  };

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
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            MVP Escola - Aluno
          </Title>
        </div>
        <Space>
          <Avatar icon={<UserOutlined />} />
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
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Card de Check-in */}
          <Card 
            style={{ marginBottom: 24 }}
            title={
              <Space>
                <CheckCircleOutlined style={{ color: '#52c41a' }} />
                Fazer Check-in
              </Space>
            }
          >
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                Clique no botão abaixo para registrar sua presença na aula de hoje.
              </Text>
              <Button 
                type="primary" 
                size="large"
                loading={loading}
                onClick={handleCheckIn}
                style={{ 
                  height: 60,
                  fontSize: 18,
                  fontWeight: 'bold',
                  borderRadius: 8
                }}
              >
                Registrar Presença
              </Button>
              <Text type="secondary" style={{ display: 'block', marginTop: 12, fontSize: 12 }}>
                Seu check-in será enviado para aprovação do professor
              </Text>
            </div>
          </Card>

          {/* Histórico de Check-ins */}
          <Card 
            title={
              <Space>
                <ClockCircleOutlined style={{ color: '#1890ff' }} />
                Meu Histórico de Check-ins
              </Space>
            }
          >
            {myCheckIns.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Text type="secondary">
                  Você ainda não fez nenhum check-in.
                </Text>
              </div>
            ) : (
              <List
                dataSource={myCheckIns.sort((a, b) => 
                  new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
                )}
                renderItem={(checkIn) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          icon={getStatusIcon(checkIn.status)} 
                          style={{ 
                            backgroundColor: 
                              checkIn.status === 'approved' ? '#52c41a' :
                              checkIn.status === 'rejected' ? '#ff4d4f' : '#faad14'
                          }}
                        />
                      }
                      title={
                        <Space>
                          <Text strong>
                            {new Date(checkIn.timestamp).toLocaleDateString('pt-BR')}
                          </Text>
                          <Tag color={getStatusColor(checkIn.status)}>
                            {getStatusText(checkIn.status)}
                          </Tag>
                        </Space>
                      }
                      description={
                        <div>
                          <Text type="secondary">
                            {new Date(checkIn.timestamp).toLocaleTimeString('pt-BR')}
                          </Text>
                          {checkIn.notes && (
                            <div style={{ marginTop: 4 }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                Observação: {checkIn.notes}
                              </Text>
                            </div>
                          )}
                          {checkIn.approvedAt && (
                            <div style={{ marginTop: 4 }}>
                              <Text type="secondary" style={{ fontSize: 12 }}>
                                {checkIn.status === 'approved' ? 'Aprovado' : 'Rejeitado'} em:{' '}
                                {new Date(checkIn.approvedAt).toLocaleString('pt-BR')}
                              </Text>
                            </div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </div>
      </Content>
    </Layout>
  );
}