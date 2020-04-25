import * as React from 'react';
import { Modal, Button, Popconfirm } from 'antd';
import { Form, FormItem, Input } from 'formik-antd';
import { Formik, FormikHelpers } from 'formik';
import { GlobalOutlined, UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';

import * as Yup from 'yup';
import { LoginParamter } from '../helpers/Login';

const PassSchema = Yup.object().shape({
  URL: Yup.string().trim().required('Required'),
  Username: Yup.string().trim().required('Required'),
  Password: Yup.string().min(2, 'Too Short!').max(128, 'Too Long!').required('Required'),
});

type PassFormProps = {
  visible: boolean;
  loading: boolean;
  title: string;
  submitText: string;
  onClose: () => void;
  generatePassword?: (cb: (password: string) => void) => void;
  checkPassword?: (password: string) => Promise<string[]>;
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
  checkPassword,
  isCheckPasswordLoading,
  initialValues = {
    URL: '',
    Username: '',
    Password: '',
  },
}) => {
  const formRef = React.useRef<{ handleSubmit: () => void; values: LoginParamter }>();

  const [isVisiblePasswordPopup, setIsVisiblePasswordPopup] = React.useState(false);
  const [samePasswordURLs, setsamePasswordURLs] = React.useState<string[]>([]);

  const [isClosedPopup, setIsClosedPopup] = React.useState(false);

  const onTriggerSubmit = React.useCallback(() => {
    if (!formRef.current) return;
    formRef.current.handleSubmit();
  }, []);

  React.useEffect(() => {
    if (!visible) {
      setIsVisiblePasswordPopup(false);
      setIsClosedPopup(false);
    }
  }, [visible]);

  const onCheckSamePasswordURLs = React.useCallback(() => {
    if (checkPassword && formRef.current) {
      checkPassword(formRef.current.values.Password).then(urls => {
        console.log(typeof urls);
        console.log(urls);
        if (urls.length == 0) {
          onTriggerSubmit();
        } else {
          setsamePasswordURLs(urls);
        }
      });
    }
  }, []);

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
              // setDeletedRecord(record);
              // onDeletePass(record);
              onTriggerSubmit();
            }}
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
        {({ setFieldValue, values: { Password } }) => (
          <Form layout="vertical">
            <FormItem label="URL" name="URL" required>
              <Input name="URL" prefix={<GlobalOutlined />} placeholder="https://example.com" />
            </FormItem>

            <FormItem label="Username" name="Username" required>
              <Input name="Username" prefix={<UserOutlined />} placeholder="Username or email" />
            </FormItem>

            <FormItem label="Password" name="Password" required>
              <Popconfirm
                visible={isVisiblePasswordPopup && !isClosedPopup && generatePassword && !Password}
                onVisibleChange={setIsVisiblePasswordPopup}
                onCancel={() => setIsClosedPopup(true)}
                title="Do you want to use a strong auto-generated password?"
                onConfirm={async () => {
                  if (generatePassword) {
                    setIsVisiblePasswordPopup(false);
                    generatePassword(password => {
                      setFieldValue('Password', password);
                    });
                  }
                }}
                okText="Yes"
                cancelText="No"
              >
                <Input.Password
                  name="Password"
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
