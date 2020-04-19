import * as React from 'react'
import { Form, FormItem, Input, SubmitButton } from 'formik-antd'
import { Formik } from 'formik'
import { UserOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons'
import * as Yup from 'yup'
import Router from 'next/router'

import fetch from '../libs/fetch'
import { Alert } from 'antd';

const LoginSchema = Yup.object().shape({
  Username: Yup.string().required('Required'),
  Password: Yup.string().required('Required'),
  BaseURL: Yup.string().url().required('Required')
})

function LoginPage() {
  const [errorMessage, setErrorMessage] = React.useState('');
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
      if (e.status === 401) {
        setErrorMessage('The username and password you entered did not match those in our records');
      }
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
      prefix: <GlobalOutlined />
    },
    {
      label: 'Username',
      name: 'Username',
      required: true,
      placeholder: 'Username',
      prefix: <UserOutlined />
    },
    {
      label: 'Password',
      name: 'Password',
      required: true,
      placeholder: 'Password',
      prefix: <LockOutlined />
    }
  ]

  const FormItems = () => {
    return FormItemList.map(
      ({ label, required, name, placeholder, prefix }) => (
        <FormItem label={label} name={name} required={required} key={name}>
          <Input name={name} placeholder={placeholder} prefix={prefix} />
        </FormItem>
      )
    )
  }

  return (
    <div className="container">
      <Formik
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
            {errorMessage && <Alert message={errorMessage} type="error" />}
            <div className="cta">
              <SubmitButton>Login</SubmitButton>
            </div>
          </Form>
        )}
      </Formik>

      <style jsx>{`
        .container {
          max-width: 340px;
          width: 100%;
          margin-left: auto;
          height: 100vh;
          margin-right: auto;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .cta {
          margin-top: 10px;
        }
      `}</style>
    </div>
  )
}

export default LoginPage
