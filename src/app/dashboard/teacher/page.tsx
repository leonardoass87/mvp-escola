'use client';

import React, { useState, useEffect } from 'react';
import { Layout, Card, Button, Typography, Space, message, List, Tag, Avatar, Modal, Input, Tabs } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useApp } from '@/contexts/AppContext';
import { useRouter } from 'next/navigation';
import { CheckIn } from '@/types/user';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

export default function TeacherDashboard() {
  const { currentUser, checkIns, approveCheckIn, rejectCheckIn, logout } = useApp();
  const router = useRouter();
  const [selectedCheckIn, setSelectedCheckIn] = useState<CheckIn | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [notes, setNotes] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'teacher') {
      router.push('/');
    }
  }, [currentUser, router]);

  const handleAction = (checkIn: CheckIn, action: 'approve' | 'reject') => {
    setSelectedCheckIn(checkIn);
    setActionType(action);
    setNotes('');
    setModalVisible(true);
  };

  const confirmAction = () => {
    if (!selectedCheckIn || !currentUser) return;

    if (actionType === 'approve') {
      approveCheckIn(selectedCheckIn.id, notes);
      message.success('Check-in aprovado com sucesso!');
    } else {
      rejectCheckIn(selectedCheckIn.id, notes);
      message.success('Check-in rejeitado.');
    }

    setModalVisible(false);
    setSelectedCheckIn(null);
    setNotes('');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Filtrar check-ins por status
  const pendingCheckIns = checkIns.filter(checkIn => checkIn.status === 'pending');
  const approvedCheckIns = checkIns.filter(checkIn => checkIn.status === 'approved');
  const rejectedCheckIns = checkIns.filter(checkIn => checkIn.status === 'rejected');

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

  const renderCheckInList = (checkInList: CheckIn[], showActions = false) => (
    <List
      dataSource={checkInList.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )}
      renderItem={(checkIn) => (
        <List.Item
          actions={showActions ? [
            <Button 
              key="approve"
              type="primary" 
              size="small" 
              icon={<CheckCircleOutlined />}
              onClick={() => handleAction(checkIn, 'approve')}
            >
              Aprovar
            </Button>,
            <Button 
              key="reject"
              danger 
              size="small" 
              icon={<CloseCircleOutlined />}
              onClick={() => handleAction(checkIn, 'reject')}
            >
              Rejeitar
            </Button>
          ] : []}
        >
          <List.Item.Meta
            avatar={
              <Avatar 
                icon={<UserOutlined />} 
                style={{ backgroundColor: '#1890ff' }}
              />
            }
            title={
              <Space>
                <Text strong>{checkIn.studentName}</Text>
                <Tag color={getStatusColor(checkIn.status)}>
                  {getStatusText(checkIn.status)}
                </Tag>
              </Space>
            }
            description={
              <div>
                <Text type="secondary">
                  {new Date(checkIn.timestamp).toLocaleString('pt-BR')}
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
  );

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
          <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
            MVP Escola - Professor
          </Title>
        </div>
        <Space>
          <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#52c41a' }} />
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
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Estatísticas */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <ClockCircleOutlined style={{ fontSize: 24, color: '#faad14', marginBottom: 8 }} />
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{pendingCheckIns.length}</div>
                <Text type="secondary">Pendentes</Text>
              </div>
            </Card>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a', marginBottom: 8 }} />
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{approvedCheckIns.length}</div>
                <Text type="secondary">Aprovados</Text>
              </div>
            </Card>
            <Card>
              <div style={{ textAlign: 'center' }}>
                <CloseCircleOutlined style={{ fontSize: 24, color: '#ff4d4f', marginBottom: 8 }} />
                <div style={{ fontSize: 24, fontWeight: 'bold' }}>{rejectedCheckIns.length}</div>
                <Text type="secondary">Rejeitados</Text>
              </div>
            </Card>
          </div>

          {/* Tabs com listas de check-ins */}
          <Card>
            <Tabs defaultActiveKey="pending" items={[
              {
                key: 'pending',
                label: (
                  <Space>
                    <ClockCircleOutlined />
                    Pendentes ({pendingCheckIns.length})
                  </Space>
                ),
                children: pendingCheckIns.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">
                      Não há check-ins pendentes para aprovação.
                    </Text>
                  </div>
                ) : (
                  renderCheckInList(pendingCheckIns, true)
                )
              },
              {
                key: 'approved',
                label: (
                  <Space>
                    <CheckCircleOutlined />
                    Aprovados ({approvedCheckIns.length})
                  </Space>
                ),
                children: approvedCheckIns.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">
                      Nenhum check-in foi aprovado ainda.
                    </Text>
                  </div>
                ) : (
                  renderCheckInList(approvedCheckIns)
                )
              },
              {
                key: 'rejected',
                label: (
                  <Space>
                    <CloseCircleOutlined />
                    Rejeitados ({rejectedCheckIns.length})
                  </Space>
                ),
                children: rejectedCheckIns.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">
                      Nenhum check-in foi rejeitado.
                    </Text>
                  </div>
                ) : (
                  renderCheckInList(rejectedCheckIns)
                )
              }
            ]} />
          </Card>
        </div>
      </Content>

      {/* Modal de confirmação */}
      <Modal
        title={actionType === 'approve' ? 'Aprovar Check-in' : 'Rejeitar Check-in'}
        open={modalVisible}
        onOk={confirmAction}
        onCancel={() => setModalVisible(false)}
        okText={actionType === 'approve' ? 'Aprovar' : 'Rejeitar'}
        cancelText="Cancelar"
        okButtonProps={{ 
          type: actionType === 'approve' ? 'primary' : 'default',
          danger: actionType === 'reject'
        }}
      >
        {selectedCheckIn && (
          <div>
            <Text strong>Aluno: </Text>
            <Text>{selectedCheckIn.studentName}</Text>
            <br />
            <Text strong>Data/Hora: </Text>
            <Text>{new Date(selectedCheckIn.timestamp).toLocaleString('pt-BR')}</Text>
            
            <div style={{ marginTop: 16 }}>
              <Text strong>Observações (opcional):</Text>
              <TextArea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Adicione uma observação sobre esta decisão..."
                rows={3}
                style={{ marginTop: 8 }}
              />
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
}