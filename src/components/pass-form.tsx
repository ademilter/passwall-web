import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Modal, Button, Popconfirm } from 'antd';
import { Form, FormItem, Input } from 'formik-antd';
import { Formik, FormikHelpers } from 'formik';
import { GlobalOutlined, UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';

import * as Yup from 'yup';
import { LoginParamter } from '../helpers/Login';

const PassSchema = Yup.object().shape({
  url: Yup.string().trim().required('Required'),
  username: Yup.string().trim().required('Required'),
  password: Yup.string().min(2, 'Too Short!').max(128, 'Too Long!').required('Required'),
});

type PassFormProps = {
  visible: boolean;
  loading: boolean;
  title: string;
  submitText: string;
  onClose: () => void;
  generatePassword?: (cb: (password: string) => void) => void;
  onCheckPassword?: (password: string) => Promise<string[]>;
  initialValues?: LoginParamter;
  isGeneratePasswordLoading?: boolean;
  isCheckPasswordLoading?: boolean;
  onSubmit: (values: LoginParamter, actions: FormikHelpers<LoginParamter>) => void;
};

const PassForm: React.FC<PassFormProps> = ({
  visible,
  loading,
  title = 'Pass Pass',
  submitText = 'Save',
  onClose,
  onSubmit,
  generatePassword,
  isGeneratePasswordLoading,
  onCheckPassword,
  isCheckPasswordLoading,
  initialValues = {
    url: '',
    username: '',
    password: '',
  },
}) => {
  const formRef = useRef<{ handleSubmit: () => void; values: LoginParamter }>();

  const [isVisiblePasswordPopup, setIsVisiblePasswordPopup] = useState(false);
  const [isConfirmationVisible, setisConfirmationVisible] = useState(false);
  const [samePasswordURLs, setsamePasswordURLs] = useState<string[]>([]);

  const [isClosedPopup, setIsClosedPopup] = useState(false);

  const onTriggerSubmit = useCallback(() => {
    if (!formRef.current) return;
    formRef.current.handleSubmit();
  }, []);

  useEffect(() => {
    if (!visible) {
      setIsVisiblePasswordPopup(false);
      setIsClosedPopup(false);
      setisConfirmationVisible(false);
    }
  }, [visible]);

  const onCheckSamePasswordURLs = useCallback(() => {
    if (onCheckPassword && formRef.current) {
      onCheckPassword(formRef.current.values.password).then(urls => {
        if (
          urls.length === 0 ||
          // Checks if the single same password is the current login which is being updated
          (urls.length === 1 &&
            urls[0] === formRef.current?.values.url &&
            initialValues.password === formRef.current.values.password)
        ) {
          onTriggerSubmit();
        } else {
          setisConfirmationVisible(true);
          setsamePasswordURLs(urls);
        }
      });
    } else {
      onTriggerSubmit();
    }
  }, [onCheckPassword, onTriggerSubmit, initialValues]);

  return (
    <Modal
      title={title}
      visible={visible}
      closable={false}
      maskClosable={false}
      destroyOnClose
      footer={
        <>
          <Button key="close" shape="round" onClick={onClose}>
            Cancel
          </Button>
          <Popconfirm
            visible={isConfirmationVisible}
            title={
              <div>
                <div>You have used this password on urls:</div>
                <ul>
                  {samePasswordURLs.slice(0, 5).map(url => (
                    <li>{url}</li>
                  ))}
                </ul>
                <div>Are you sure to use this password again?</div>
              </div>
            }
            onConfirm={() => {
              onTriggerSubmit();
              setisConfirmationVisible(false);
            }}
            onCancel={() => setisConfirmationVisible(false)}
            okText="Yes"
            cancelText="No"
          >
            <Button key="save" shape="round" type="primary" loading={loading} onClick={onCheckSamePasswordURLs}>
              {submitText}
            </Button>
          </Popconfirm>
        </>
      }
    >
      <Formik
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        innerRef={formRef as any}
        initialValues={initialValues}
        validationSchema={PassSchema}
        onSubmit={onSubmit}
      >
        {({ setFieldValue, values: { password } }) => (
          <Form layout="vertical">
            <FormItem label="URL" name="url" required>
              <Input name="url" prefix={<GlobalOutlined />} placeholder="https://example.com" />
            </FormItem>

            <FormItem label="Username" name="username" required>
              <Input name="username" prefix={<UserOutlined />} placeholder="Username or email" />
            </FormItem>

            <FormItem label="Password" name="password" required>
              <Popconfirm
                visible={isVisiblePasswordPopup && !isClosedPopup && generatePassword && !password}
                onVisibleChange={setIsVisiblePasswordPopup}
                onCancel={() => setIsClosedPopup(true)}
                title="Do you want to use a strong auto-generated password?"
                onConfirm={async () => {
                  if (generatePassword) {
                    setIsVisiblePasswordPopup(false);
                    generatePassword(pass => {
                      setFieldValue('password', pass);
                    });
                  }
                }}
                okText="Yes"
                cancelText="No"
              >
                <Input.Password
                  name="password"
                  onFocus={() => {
                    setTimeout(() => {
                      setIsVisiblePasswordPopup(true);
                    }, 500);
                  }}
                  onChange={() => {
                    setIsClosedPopup(true);
                  }}
                  disabled={isGeneratePasswordLoading || isCheckPasswordLoading}
                  prefix={isGeneratePasswordLoading || isCheckPasswordLoading ? <LoadingOutlined /> : <LockOutlined />}
                  placeholder="• • • • • • • •"
                />
              </Popconfirm>
            </FormItem>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default PassForm;
