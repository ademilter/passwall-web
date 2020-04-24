import * as React from 'react'
import { Space, Button, Typography, Dropdown } from 'antd'
import {
  ReloadOutlined,
  PlusOutlined,
  EllipsisOutlined
} from '@ant-design/icons'

import Actions from './actions-menu'

const { Title } = Typography

function Header({
  loading,
  onModalOpen,
  onDataRefresh,
  onLogout,
  onExport,
  onImport,
  onBackup,
  onRestore
}) {
  const ActionsMenu = (
    <Actions
      onLogout={onLogout}
      onExport={onExport}
      onImport={onImport}
      onBackup={onBackup}
      onRestore={onRestore}
    />
  )

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

      <Space>
        <Button
          shape="round"
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleModalOpen}
        >
          New Pass
        </Button>

        <Dropdown overlay={ActionsMenu}>
          <Button
            shape="circle"
            loading={loading}
            icon={<EllipsisOutlined />}
          />
        </Dropdown>
      </Space>

      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
        }
      `}</style>
    </header>
  )
}

export default Header
