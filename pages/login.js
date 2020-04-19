import * as React from 'react'
import { Form, FormItem, Input, SubmitButton } from 'formik-antd'
import { Alert } from 'antd'
import { Formik } from 'formik'
import { UserOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons'
import * as Yup from 'yup'
import Router from 'next/router'

import fetch from '../libs/fetch'

const LoginSchema = Yup.object().shape({
  Username: Yup.string().required('Required'),
  Password: Yup.string().required('Required'),
  BaseURL: Yup.string().url().required('Required')
})

function LoginPage() {
  const [state, setState] = React.useState({
    error: null
  })

  const onSubmit = async (values, actions) => {
    try {
      localStorage.setItem('BASE_URL', values.BaseURL)
      const data = await fetch('/auth/signin', {
        method: 'POST',
        body: JSON.stringify(values)
      })

      if (data.token) {
        localStorage.setItem('TOKEN', data.token)
        Router.push('/')
        return
      }

      setState({ error: data.message })
    } catch (e) {
      console.log(e)
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
      {state.error && <Alert message={state.error} type="error" />}

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
