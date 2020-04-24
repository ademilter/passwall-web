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
    .min(2, 'Too Short!')
    .max(128, 'Too Long!')
    .required('Required')
})

function NewForm({
  visible,
  loading,
  onClose,
  onSubmit,
  generatePassword,
  isGeneratePasswordLoading
}) {
  const formRef = React.useRef()

  const passwordFieldRef = React.useRef()

  const [isHiddenPasswordPopup, setIsHiddenPasswordPopup] = React.useState(
    false
  )

  const onTriggerSubmit = React.useCallback(() => {
    if (!formRef.current) return
    formRef.current.handleSubmit()
  }, [])

  const initialValues = React.useMemo(
    () => ({ URL: '', Username: '', Password: '' }),
    []
  )

  React.useEffect(() => {
    setIsHiddenPasswordPopup(!visible)
  }, [visible])

  React.useEffect(() => {
    if (isHiddenPasswordPopup && passwordFieldRef.current) {
      passwordFieldRef.current.focus()
    }
  }, [isHiddenPasswordPopup])

  return (
    <Modal
      title="New Pass"
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
            Save
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
        {({ setFieldValue, values: { Password } }) => {
          const passwordField = (
            <Input.Password
              name="Password"
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
          )
          return (
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
                {Password || isHiddenPasswordPopup ? (
                  passwordField
                ) : (
                  <Popconfirm
                    title="Do you want to use a strong auto-generated password?"
                    onCancel={() => {
                      setIsHiddenPasswordPopup(true)
                    }}
                    onConfirm={async () => {
                      setIsHiddenPasswordPopup(true)
                      generatePassword((password) => {
                        setFieldValue('Password', password)
                      })
                    }}
                    okText="Yes"
                    cancelText="No"
                  >
                    {passwordField}
                  </Popconfirm>
                )}
              </FormItem>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

export default NewForm
