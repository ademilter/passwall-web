import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { ColumnType as TableColumnType } from 'antd/lib/table';
import { FormikHelpers } from 'formik';
import { blue, red } from '@ant-design/colors';
import { Table, Input, Popconfirm, Tooltip, Typography } from 'antd';
import Highlighter from 'react-highlight-words';
import { CloseOutlined, EditOutlined, LoadingOutlined, BankFilled } from '@ant-design/icons';
import PassForm from './pass-form';
import { trimEllip } from '../utils';
import PasswordField from './password-field';
import { Login, LoginParamter } from '../helpers/Login';

type PassTableProps = {
  loading: boolean;
  data: Login[];
  onDeletePass: (record: Login) => void;
  onUpdatePass: (id: number | string, values: LoginParamter, cb: () => void) => void;
  onCheckPassword?: (password: string) => Promise<string[]>;
  isUpdateLoading: boolean;
  isDeleteLoading: boolean;
  isCheckPasswordLoading?: boolean;
  handleBankAccountSelected: (id: number | string) => void;
};

const PassTable: React.FC<PassTableProps> = ({
  loading,
  data,
  onDeletePass,
  onUpdatePass,
  onCheckPassword,
  isUpdateLoading,
  isDeleteLoading,
  isCheckPasswordLoading,
  handleBankAccountSelected,
}) => {
  const [searchText, setSearchText] = useState('');
  const [dataTable, setDataTable] = useState<Login[]>([]);
  const [updatedRecord, setUpdatedRecord] = useState<Login | undefined>();
  const [deletedRecord, setDeletedRecord] = useState<Login | undefined>();

  const onModalClose = useCallback(() => {
    setUpdatedRecord(undefined);
  }, []);

  const isShownUpdateFormModal = Boolean(updatedRecord);

  const columns = useMemo(() => {
    const urlColumn: TableColumnType<Login> = {
      title: 'Url',
      dataIndex: 'url',
      ellipsis: true,
      sorter: (a, b) => a.url.localeCompare(b.url),
      sortDirections: ['descend', 'ascend'],
      render: (text, record) => (
        <>
          {record.type === 'bankAccount' && <BankFilled />}
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        </>
      ),
    };
    const usernameColumn: TableColumnType<Login> = {
      title: 'Username',
      dataIndex: 'username',
      render: (text, record) => (
        <Typography.Paragraph
          style={{ marginBottom: 0 }}
          copyable={record.type !== 'bankAccount' ? { text } : undefined}
        >
          {trimEllip(text, 12)}
        </Typography.Paragraph>
      ),
    };
    const passwordColumn: TableColumnType<Login> = {
      title: 'Password',
      dataIndex: 'password',
      render: (text, record) => <PasswordField copyable={record.type !== 'bankAccount'}>{text}</PasswordField>,
    };
    const actionColumn: TableColumnType<Login> = {
      key: 'action',
      width: 80,
      render: (text, record) => {
        const isDeleteLoadingForRecord = deletedRecord && deletedRecord.id === record.id && isDeleteLoading;

        const visibilityProps = isDeleteLoadingForRecord ? { visible: false } : {};

        return (
          <>
            <Tooltip title="Edit" placement="bottom">
              <EditOutlined
                onClick={e => {
                  e.stopPropagation();
                  setUpdatedRecord(record);
                }}
                style={{
                  color: blue.primary,
                }}
              />
            </Tooltip>
            &nbsp;
            <Popconfirm
              {...visibilityProps}
              title="Are you sure delete this pass?"
              onConfirm={e => {
                if (e) {
                  e.stopPropagation();
                }
                setDeletedRecord(record);
                onDeletePass(record);
              }}
              onCancel={e => e?.stopPropagation()}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Delete" placement="bottom" {...visibilityProps}>
                {isDeleteLoadingForRecord ? (
                  <LoadingOutlined
                    style={{
                      color: red.primary,
                    }}
                  />
                ) : (
                  <CloseOutlined
                    style={{
                      color: red.primary,
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                )}
              </Tooltip>
            </Popconfirm>
          </>
        );
      },
    };
    return [urlColumn, usernameColumn, passwordColumn, actionColumn];
  }, [searchText, deletedRecord, isDeleteLoading, onDeletePass]);

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  }, []);

  const handleUpdatePasswordModalSubmit = useCallback(
    (values: LoginParamter, actions: FormikHelpers<LoginParamter>) => {
      if (updatedRecord) {
        onUpdatePass(updatedRecord.id, values, () => {
          actions.setSubmitting(false);
          setUpdatedRecord(undefined);
        });
      }
    },
    [onUpdatePass, updatedRecord],
  );

  useEffect(() => {
    setDataTable(
      searchText.length
        ? data.filter(pass => pass.url.toString().toLocaleLowerCase().includes(searchText.toLocaleLowerCase()))
        : data,
    );
  }, [data, searchText]);

  useEffect(() => {
    if (Array.isArray(data)) {
      setDataTable(data);
    }
  }, [data]);

  return (
    <div>
      <Input
        allowClear
        style={{ marginBottom: 20 }}
        placeholder="Search"
        value={searchText}
        onChange={handleInputChange}
      />

      <Table<Login>
        size="small"
        loading={loading}
        columns={columns}
        rowKey="id"
        dataSource={dataTable}
        rowClassName={record => (record.type === 'bankAccount' ? 'clickable-row' : '')}
        onRow={record => {
          return {
            onClick: e => {
              if (record.type === 'bankAccount') {
                e.stopPropagation();
                handleBankAccountSelected(record.id);
              }
            },
          };
        }}
      />
      <PassForm
        title="Update Pass"
        submitText="Update"
        visible={isShownUpdateFormModal}
        loading={isUpdateLoading}
        onClose={onModalClose}
        onSubmit={handleUpdatePasswordModalSubmit}
        onCheckPassword={onCheckPassword}
        initialValues={updatedRecord}
        isCheckPasswordLoading={isCheckPasswordLoading}
      />
    </div>
  );
};

export default PassTable;
