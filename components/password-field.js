import * as React from "react";
import { Typography, Button, Space, Tooltip } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

const { Paragraph } = Typography;

function PasswordField({ children }) {
  const [show, setShow] = React.useState(false);

  return (
    <Space size={0}>
      <Paragraph style={{ marginBottom: 0 }} copyable={{ text: children }}>
        {show ? children : "• • • • • • • •"}
      </Paragraph>
      <Tooltip title={show ? "Hide" : "Show"}>
        <Button type="link" size="small" onClick={() => setShow(!show)}>
          {show ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </Button>
      </Tooltip>
    </Space>
  );
}

export default PasswordField;
