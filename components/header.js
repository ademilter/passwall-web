import * as React from 'react'
import { Space, Button, Typography } from 'antd'
import { ReloadOutlined, PlusOutlined } from '@ant-design/icons'

const { Title } = Typography

function Header({ loading, onModalOpen, onDataRefresh }) {
  const handleDataRefresh = React.useCallback(() => {
    if (onDataRefresh) {
      onDataRefresh()
    }
  }, [onDataRefresh])

  const handleModalOpen = React.useCallback(() => {
    if (onModalOpen) {
      onModalOpen()
    }
  }, [onModalOpen])

  return (
    <header className="header">
      <Space>
        <Title style={{ marginBottom: 0 }} level={2}>
          PassWall
        </Title>

        <Button
          shape="circle"
          loading={loading}
          icon={<ReloadOutlined />}
          onClick={handleDataRefresh}
        />
      </Space>

      <Button
        shape="round"
        type="primary"
        icon={<PlusOutlined />}
        onClick={handleModalOpen}
      >
        New Pass
      </Button>

      <style jsx>{`
        .header {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
        }
      `}</style>
    </header>
  )
}

export default Header
