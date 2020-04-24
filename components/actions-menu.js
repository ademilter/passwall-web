import * as React from 'react'
import { Menu } from 'antd'
import {
  ImportOutlined,
  ExportOutlined,
  LogoutOutlined,
  SaveOutlined,
  RollbackOutlined
} from '@ant-design/icons'

const Actions = ({
  onImport = () => {},
  onExport = () => {},
  onLogout = () => {}
}) => {
  const fileInput = React.useRef()

  const handleImport = React.useCallback(() => {
    if (fileInput.current) {
      fileInput.current.click()
    }
  }, [])

  const handleFileChange = React.useCallback(
    (e) => onImport(e.target.files[0]),
    [onImport]
  )

  return (
    <Menu className="dropdown-menu">
      <Menu.Item onClick={handleImport}>
        <ImportOutlined />
        <input
          type="file"
          id="file"
          ref={fileInput}
          style={{ display: 'none' }}
          accept=".csv"
          onChange={(e) => handleFileChange(e)}
        />
        Import
      </Menu.Item>
      <Menu.Item onClick={onExport}>
        <ExportOutlined />
        Export
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item>
        <SaveOutlined />
        Backup
      </Menu.Item>
      <Menu.Item>
        <RollbackOutlined />
        Restore
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={onLogout}>
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  )
}

export default Actions
