import * as React from 'react'
import { Typography, Button, Space, Tooltip } from 'antd'
import { EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons'

const { Paragraph } = Typography

const paragraphStyle = { marginBottom: 0 }

function PasswordField({ children }: { children: string }) {
  const [show, setShow] = React.useState(false)

  const showToggle = React.useCallback(() => setShow((prev) => !prev), [])

  const copyConfig = React.useMemo(() => ({ text: children }), [children])

  return (
    <Space size={0}>
      <Paragraph style={paragraphStyle} copyable={copyConfig}>
        {show ? children : '• • • • • • • •'}
      </Paragraph>
      <Tooltip title={show ? 'Hide' : 'Show'}>
        <Button type="link" size="small" onClick={showToggle}>
          {show ? <EyeInvisibleOutlined /> : <EyeOutlined />}
        </Button>
      </Tooltip>
    </Space>
  )
}

export default PasswordField
