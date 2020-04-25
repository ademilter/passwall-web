import * as React from 'react';
import { Space, Button, Typography, Dropdown, Menu } from 'antd';
import {
  ReloadOutlined,
  PlusOutlined,
  EllipsisOutlined,
  ImportOutlined,
  ExportOutlined,
  SaveOutlined,
  RollbackOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Title } = Typography;

type HeaderProps = {
  loading: boolean;
  onModalOpen?: () => void;
  onDataRefresh?: () => void;
  onLogout?: () => void;
  onExport?: () => void;
  onImport?: (file: File) => void;
  onBackup?: () => void;
  onRestore?: () => void;
};

const Header: React.FC<HeaderProps> = ({
  loading,
  onModalOpen,
  onDataRefresh,
  onLogout,
  onExport,
  onImport,
  onBackup,
  onRestore,
}) => {
  const fileInput = React.useRef<HTMLInputElement>();

  const handleImport = React.useCallback(() => {
    if (fileInput.current) {
      fileInput.current.click();
    }
  }, []);

  const handleFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onImport && e.target.files) {
        onImport(e.target.files[0]);
      }
    },
    [onImport],
  );

  const handleDataRefresh = React.useCallback(() => {
    if (onDataRefresh) {
      onDataRefresh();
    }
  }, [onDataRefresh]);

  const handleModalOpen = React.useCallback(() => {
    if (onModalOpen) {
      onModalOpen();
    }
  }, [onModalOpen]);

  const ActionsMenu = (
    <Menu className="header-dropdown-menu">
      <Menu.Item onClick={handleImport}>
        <ImportOutlined />
        <input
          type="file"
          id="file"
          ref={fileInput as any} // eslint-disable-line @typescript-eslint/no-explicit-any
          style={{ display: 'none' }}
          accept=".csv"
          onChange={handleFileChange}
        />
        Import
      </Menu.Item>
      <Menu.Item onClick={onExport}>
        <ExportOutlined />
        Export
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={onBackup}>
        <SaveOutlined />
        Backup
      </Menu.Item>
      <Menu.Item onClick={onRestore}>
        <RollbackOutlined />
        Restore
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={onLogout}>
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <header className="header">
      <Space>
        <Title style={{ marginBottom: 0 }} level={2}>
          PassWall
        </Title>

        <Button shape="circle" loading={loading} icon={<ReloadOutlined />} onClick={handleDataRefresh} />
      </Space>

      <Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleModalOpen}>
          New Pass
        </Button>

        <Dropdown overlay={ActionsMenu} placement="bottomCenter">
          <Button shape="circle" loading={loading} icon={<EllipsisOutlined />} />
        </Dropdown>
      </Space>

      <style jsx>
        {`
          .header {
            display: flex;
            justify-content: space-between;
          }
        `}
      </style>
    </header>
  );
};

export default Header;
