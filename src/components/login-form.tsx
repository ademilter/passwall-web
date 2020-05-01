import * as React from 'react';
import { Typography, Alert } from 'antd';
import { Form, FormItem, Input, SubmitButton } from 'formik-antd';
import { Formik, FormikHelpers } from 'formik';
import { UserOutlined, LockOutlined, GlobalOutlined } from '@ant-design/icons';
import * as Yup from 'yup';
import { SingInParameter } from '../helpers/Login';
import PassTitle from './title';

const { Paragraph } = Typography;

const LoginSchema = Yup.object().shape({
  Username: Yup.string().required('Required'),
  Password: Yup.string().required('Required'),
  BaseURL: Yup.string().url('BaseURL must be a valid URL').required('Required'),
});

const FormItemList = [
  {
    label: 'Base URL',
    name: 'BaseURL',
    required: true,
    placeholder: process.env.BASE_URL,
    prefix: <GlobalOutlined />,
    type: 'text',
  },
  {
    label: 'Username',
    name: 'Username',
    required: true,
    placeholder: 'Username',
    prefix: <UserOutlined />,
    type: 'text',
  },
  {
    label: 'Password',
    name: 'Password',
    required: true,
    placeholder: 'Password',
    prefix: <LockOutlined />,
    type: 'password',
  },
];
type LoginFormProps = {
  initialValues?: SingInParameter;
  errorMessage?: string;
  onSubmit: (values: SingInParameter, actions: FormikHelpers<SingInParameter>) => void;
};
const LoginForm: React.FC<LoginFormProps> = ({ initialValues, onSubmit, errorMessage }) => (
  <div className="login-wrapper">
    <div className="login-card">
      <div className="image-box">
        <img src="/images/login-illustration.svg" alt="Login" />
      </div>
      <div className="form-box">
        <PassTitle level={2} />
        <Paragraph>Login to the Dashboard</Paragraph>
        <Formik
          className="login-form"
          initialValues={initialValues as SingInParameter}
          validationSchema={LoginSchema}
          onSubmit={onSubmit}
        >
          {() => (
            <Form layout="vertical">
              {FormItemList.map(({ label, required, name, placeholder, prefix, type }) => (
                <FormItem label={label} name={name} required={required} key={name}>
                  <Input name={name} placeholder={placeholder} prefix={prefix} type={type} />
                </FormItem>
              ))}
              {errorMessage && <Alert style={{ marginBottom: 15 }} showIcon message={errorMessage} type="error" />}
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
);

LoginForm.defaultProps = {
  initialValues: {
    Username: '',
    Password: '',
    BaseURL: process.env.BASE_URL || '',
  },
};

export default LoginForm;
