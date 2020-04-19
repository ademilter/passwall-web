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
  const fileInput = React.useRef();

  const handleImport = () => {
    fileInput.current.click();
  };

  return (
    <Menu className="dropdown-menu">
      <Menu.Item onClick={handleImport}>
        <ImportOutlined />
        <input
          type="file"
          id="file"
          ref={fileInput}
          style={{ display: "none" }}
          accept=".csv"
          onChange={(e) => onImport(e.target.files[0])}
        />
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
