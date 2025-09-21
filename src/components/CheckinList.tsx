'use client';

import React from 'react';
import { List, Card, Typography, Empty, Avatar } from 'antd';
import { UserOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useApp } from '@/contexts/AppContext';

const { Text } = Typography;

const CheckinList: React.FC = () => {
  const { checkIns } = useApp();

  if (checkIns.length === 0) {
    return (
      <Card 
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <UserOutlined />
            <span>Lista de Presença</span>
          </div>
        }
        style={{ marginTop: 24 }}
      >
        <Empty 
          description="Nenhum aluno fez check-in ainda"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    );
  }

  return (
    <Card 
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserOutlined />
          <span>Lista de Presença ({checkIns.length} check-in{checkIns.length !== 1 ? 's' : ''})</span>
        </div>
      }
      style={{ marginTop: 24 }}
    >
      <List
        dataSource={checkIns}
        renderItem={(checkIn, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Avatar 
                  style={{ backgroundColor: '#1890ff' }}
                  icon={<UserOutlined />}
                />
              }
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Text strong>{checkIn.studentName}</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    #{index + 1}
                  </Text>
                </div>
              }
              description={
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ClockCircleOutlined style={{ color: '#52c41a' }} />
                  <Text type="secondary">{new Date(checkIn.timestamp).toLocaleString('pt-BR')}</Text>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );
};

export default CheckinList;