import * as React from 'react'
import { Modal, Button, Popconfirm } from 'antd'
import { Form, FormItem, Input } from 'formik-antd'
import { Formik } from 'formik'
import {
  GlobalOutlined,
  UserOutlined,
  LockOutlined,
  LoadingOutlined
} from '@ant-design/icons'

import * as Yup from 'yup'

const NewPassSchema = Yup.object().shape({
  URL: Yup.string().trim().required('Required'),
  Username: Yup.string().trim().required('Required'),
  Password: Yup.string()
    .min(6, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required')
})

function NewForm({
  visible,
  loading,
  title = 'New Pass',
  submitText = 'Save',
  onClose,
  onSubmit,
  generatePassword,
  isGeneratePasswordLoading,
  initialValues = {
    URL: '',
    Username: '',
    Password: ''
  }
}) {
  const formRef = React.useRef()

  const passwordFieldRef = React.useRef()

  const [isVisiblePasswordPopup, setIsVisiblePasswordPopup] = React.useState(
    false
  )

  const [isClosedPopup, setIsClosedPopup] = React.useState(false)

  const onTriggerSubmit = React.useCallback(() => {
    if (!formRef.current) return
    formRef.current.handleSubmit()
  }, [])

  React.useEffect(() => {
    if (!visible) {
      setIsVisiblePasswordPopup(false)
      setIsClosedPopup(false)
    }
  }, [visible])

  return (
    <Modal
      title={title}
      visible={visible}
      closable={false}
      maskClosable={false}
      destroyOnClose={true}
      footer={
        <>
          <Button key="close" shape="round" onClick={onClose}>
            Cancel
          </Button>
          <Button
            key="save"
            shape="round"
            type="primary"
            loading={loading}
            onClick={onTriggerSubmit}
          >
            {submitText}
          </Button>
        </>
      }
    >
      <Formik
        innerRef={formRef}
        initialValues={initialValues}
        validationSchema={NewPassSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values: { Password } }) => (
          <Form layout="vertical">
            <FormItem label="URL" name="URL" required={true}>
              <Input
                name="URL"
                prefix={<GlobalOutlined />}
                placeholder="https://example.com"
              />
            </FormItem>

            <FormItem label="Username" name="Username" required={true}>
              <Input
                name="Username"
                prefix={<UserOutlined />}
                placeholder="Username or email"
              />
            </FormItem>

            <FormItem label="Password" name="Password" required={true}>
              <Popconfirm
                visible={
                  isVisiblePasswordPopup &&
                  !isClosedPopup &&
                  generatePassword &&
                  !Password
                }
                onVisibleChange={setIsVisiblePasswordPopup}
                onCancel={() => setIsClosedPopup(true)}
                title="Do you want to use a strong auto-generated password?"
                onConfirm={async () => {
                  if (generatePassword) {
                    setIsVisiblePasswordPopup(false)
                    generatePassword((password) => {
                      setFieldValue('Password', password)
                    })
                  }
                }}
                okText="Yes"
                cancelText="No"
              >
                <Input.Password
                  name="Password"
                  onFocus={() => {
                    setTimeout(() => {
                      setIsVisiblePasswordPopup(true)
                    }, 500)
                  }}
                  onChange={() => {
                    setIsClosedPopup(true)
                  }}
                  ref={passwordFieldRef}
                  disabled={isGeneratePasswordLoading}
                  prefix={
                    isGeneratePasswordLoading ? (
                      <LoadingOutlined />
                    ) : (
                      <LockOutlined />
                    )
                  }
                  placeholder="• • • • • • • •"
                />
              </Popconfirm>
            </FormItem>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default NewForm
