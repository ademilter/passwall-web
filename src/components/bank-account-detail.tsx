import React from 'react';
import { Modal, Button, Form, Typography } from 'antd';
import FormItem from 'antd/lib/form/FormItem';
import { FormLabelAlign } from 'antd/lib/form/interface';
import { BankAccount } from '../helpers/Login';
import PasswordField from './password-field';
// import { Form, FormItem, Input } from ;

type BankAccountDetailProps = {
  visible: boolean;
  onClose: () => void;
  bankAccount?: BankAccount;
};

const BankAccountDetail: React.FC<BankAccountDetailProps> = ({ visible = false, onClose, bankAccount }) => {
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
    labelAlign: 'left' as FormLabelAlign,
  };
  return (
    <Modal
      title="Bank Account Detail"
      visible={visible}
      closable={false}
      maskClosable={false}
      destroyOnClose
      footer={
        <>
          <Button key="close" shape="round" onClick={onClose}>
            Ok
          </Button>
        </>
      }
    >
      <Form>
        <FormItem label="Bank" {...layout}>
          <Typography.Paragraph style={{ marginBottom: 0 }} copyable>
            {bankAccount?.bankName}
          </Typography.Paragraph>
        </FormItem>
        <FormItem label="Account Name" {...layout}>
          <Typography.Paragraph style={{ marginBottom: 0 }} copyable>
            {bankAccount?.accountName}
          </Typography.Paragraph>
        </FormItem>
        <FormItem label="Account Number" {...layout}>
          <PasswordField>{bankAccount?.accountNumber ?? ''}</PasswordField>
        </FormItem>
        <FormItem label="IBAN" {...layout}>
          <Typography.Paragraph style={{ marginBottom: 0 }} copyable>
            {bankAccount?.iban}
          </Typography.Paragraph>
        </FormItem>
        <FormItem label="Currency" {...layout}>
          <Typography.Paragraph style={{ marginBottom: 0 }} copyable>
            {bankAccount?.currency}
          </Typography.Paragraph>
        </FormItem>
        <FormItem label="Password" {...layout}>
          <PasswordField>{bankAccount?.password ?? ''}</PasswordField>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default BankAccountDetail;
