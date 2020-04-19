import * as React from "react";
import { Menu } from "antd";
import {
  ImportOutlined,
  ExportOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

const Actions = ({ onLogout = () => {} }) => {
  return (
    <Menu className="dropdown-menu">
      <Menu.Item>
        <ImportOutlined />
        Import
      </Menu.Item>
      <Menu.Item>
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
