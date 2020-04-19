import * as React from 'react'
import { Typography, Alert } from 'antd'
import { Form, FormItem, Input, SubmitButton } from 'formik-antd'
import { Formik } from 'formik'
import { UserOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons'
import * as Yup from 'yup'
import Router from 'next/router'

import fetch from '../libs/fetch'

const { Title, Paragraph } = Typography

const LoginSchema = Yup.object().shape({
  Username: Yup.string().required('Required'),
  Password: Yup.string().required('Required'),
  BaseURL: Yup.string().url().required('Required')
})

function LoginPage() {
  const [errorMessage, setErrorMessage] = React.useState("");
  const onSubmit = async (values, actions) => {
    try {
      localStorage.setItem('BASE_URL', values.BaseURL)
      const { token } = await fetch('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(values)
      })
      localStorage.setItem('TOKEN', token)
      Router.push('/')
    } catch (e) {
      setErrorMessage(e.message)
    } finally {
      actions.setSubmitting(false)
    }
  }
  const FormItemList = [
    {
      label: 'Base URL',
      name: 'BaseURL',
      required: true,
      placeholder: process.env.BASE_URL,
      prefix: <GlobalOutlined />,
      type: "text"
    },
    {
      label: 'Username',
      name: 'Username',
      required: true,
      placeholder: 'Username',
      prefix: <UserOutlined />,
      type: "text"
    },
    {
      label: 'Password',
      name: 'Password',
      required: true,
      placeholder: 'Password',
      prefix: <LockOutlined />,
      type: "password",
    }
  ]

  const FormItems = () => {
    return FormItemList.map(
      ({ label, required, name, placeholder, prefix, type }) => (
        <FormItem label={label} name={name} required={required} key={name}>
          <Input name={name} placeholder={placeholder} prefix={prefix} type={type}/>
        </FormItem>
      )
    )
  }

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
            initialValues={{
              Username: '',
              Password: '',
              BaseURL: process.env.BASE_URL
            }}
            validationSchema={LoginSchema}
            onSubmit={onSubmit}
          >
            {() => (
              <Form layout="vertical">
                <FormItems />
                {errorMessage && <Alert style={{marginBottom: 15}} showIcon message={errorMessage} type="error"/>}
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
    // <div className="container">

    //   <style jsx>{`
    //     .container {
    //       max-width: 340px;
    //       width: 100%;
    //       margin-left: auto;
    //       height: 100vh;
    //       margin-right: auto;
    //       display: flex;
    //       flex-direction: column;
    //       justify-content: center;
    //     }
    //     .cta {
    //       margin-top: 10px;
    //     }
    //   `}</style>
    // </div>
  )
}

export default LoginPage
