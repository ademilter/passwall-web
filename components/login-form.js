import * as React from 'react'
import { Typography, Alert } from 'antd'
import { Form, FormItem, Input, SubmitButton } from 'formik-antd'
import { Formik } from 'formik'
import { UserOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons'
import * as Yup from 'yup'

const { Title, Paragraph } = Typography

const urlRegExp = /^(?:([a-z0-9+.-]+):\/\/)(?:\S+(?::\S*)?@)?(?:(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/

const LoginSchema = Yup.object().shape({
  Username: Yup.string().required('Required'),
  Password: Yup.string().required('Required'),
  BaseURL: Yup.string().matches(urlRegExp, 'BaseURL must be a valid URL')
})

const FormItemList = [
  {
    label: 'Base URL',
    name: 'BaseURL',
    required: true,
    placeholder: process.env.BASE_URL,
    prefix: <GlobalOutlined />,
    type: 'text'
  },
  {
    label: 'Username',
    name: 'Username',
    required: true,
    placeholder: 'Username',
    prefix: <UserOutlined />,
    type: 'text'
  },
  {
    label: 'Password',
    name: 'Password',
    required: true,
    placeholder: 'Password',
    prefix: <LockOutlined />,
    type: 'password'
  }
]

function LoginForm({
  initialValues = {
    Username: '',
    Password: '',
    BaseURL: process.env.BASE_URL
  },
  onSubmit,
  errorMessage
}) {
  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="image-box">
          <img src="/images/login-illustration.svg" alt="Login" />
        </div>
        <div className="form-box">
          <Title level={3}>PassWall</Title>
          <Paragraph>Login to the Dashboard</Paragraph>
          <Formik
            className="login-form"
            initialValues={initialValues}
            validationSchema={LoginSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form layout="vertical">
                {FormItemList.map(
                  ({ label, required, name, placeholder, prefix, type }) => (
                    <FormItem
                      label={label}
                      name={name}
                      required={required}
                      key={name}
                    >
                      <Input
                        name={name}
                        placeholder={placeholder}
                        prefix={prefix}
                        type={type}
                      />
                    </FormItem>
                  )
                )}
                {errorMessage && (
                  <Alert
                    style={{ marginBottom: 15 }}
                    showIcon
                    message={errorMessage}
                    type="error"
                  />
                )}
                <div className="cta">
                  <SubmitButton className="btn-submit">Login</SubmitButton>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <style jsx>
        {`
          .login-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: calc(100vh - 60px);
          }
          .login-card {
            display: -webkit-box;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-direction: row-reverse;
            max-width: 1000px;
            background-color: white;
            box-shadow: 0 0 40px rgba(0, 0, 0, 0.16);
            overflow: hidden;
            margin: 0 auto;
            border-radius: 12px;
          }
          .form-box {
            -webkit-box-flex: 1;
            flex: 1 0 100%;
            max-width: 480px;
            width: 100%;
            padding: 60px;
          }
          .image-box {
            display: flex;
            align-items: flex-end;
            max-width: 800px;
            min-height: 100%;
            padding: 30px 30px 30px 0;
          }
          .image-box img {
            display: block;
            width: 100%;
          }
        `}
      </style>
    </div>
  )
}

export default LoginForm
