import * as React from "react";
import { Menu } from "antd";
import {
  ImportOutlined,
  ExportOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const Actions = ({
  onImport = () => {},
  onExport = () => {},
  onLogout = () => {},
}) => {
  return (
    <Menu className="dropdown-menu">
      <Menu.Item onClick={onImport}>
        <ImportOutlined />
        Import
      </Menu.Item>
      <Menu.Item onClick={onExport}>
        <ExportOutlined />
        Export
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={onLogout}>
        <LogoutOutlined />
        Logout
      </Menu.Item>
    </Menu>
  );
};

export default Actions;
