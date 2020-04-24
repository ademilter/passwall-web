import * as React from 'react'
import { blue, red } from '@ant-design/colors'
import { trimEllip } from '../utils'
import { Table, Input, Popconfirm, Tooltip } from 'antd'
import NewForm from './new-form'
import Highlighter from 'react-highlight-words'
import { CloseOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons'

import PasswordField from './password-field'

function PassTable({
  loading,
  data,
  onDeletePass,
  onUpdatePass,
  isUpdateLoading,
  isDeleteLoading
}) {
  const [searchText, setSearchText] = React.useState('')
  const [dataTable, setDataTable] = React.useState([])
  const [updatedRecord, setUpdatedRecord] = React.useState(null)
  const [deletedRecord, setDeletedRecord] = React.useState(null)

  const onModalClose = React.useCallback(() => {
    setUpdatedRecord(null)
  }, [])

  const isShownUpdateFormModal = Boolean(updatedRecord)

  const columns = React.useMemo(
    () => [
      {
        title: 'Url',
        dataIndex: 'URL',
        ellipsis: true,
        sorter: (a, b) => a.URL.localeCompare(b.URL),
        sortDirections: ['descend', 'ascend'],
        render: (text) => (
          <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={text.toString()}
          />
        )
      },
      {
        title: 'Username',
        dataIndex: 'Username',
        render: (text) => (
          <Typography.Paragraph style={{ marginBottom: 0 }} copyable>
            {trimEllip(text, 12)}
          </Typography.Paragraph>
        )
      },
      {
        title: 'Password',
        dataIndex: 'Password',
        render: (text) => <PasswordField>{text}</PasswordField>
      },
      {
        key: 'action',
        width: 80,
        render: (text, record) => {
          const isDeleteLoadingForRecord =
            deletedRecord && deletedRecord.ID === record.ID && isDeleteLoading

          const visibilityProps = isDeleteLoadingForRecord
            ? { visible: false }
            : {}

          return (
            <>
              <Tooltip title="Edit" placement="bottom">
                <EditOutlined
                  onClick={() => setUpdatedRecord(record)}
                  style={{
                    color: blue.primary
                  }}
                />
              </Tooltip>
              &nbsp;
              <Popconfirm
                {...visibilityProps}
                title="Are you sure delete this pass?"
                onConfirm={() => {
                  setDeletedRecord(record)
                  onDeletePass(record.ID)
                }}
                okText="Yes"
                cancelText="No"
              >
                <Tooltip title="Delete" placement="bottom" {...visibilityProps}>
                  {isDeleteLoadingForRecord ? (
                    <LoadingOutlined
                      style={{
                        color: red.primary
                      }}
                    />
                  ) : (
                    <CloseOutlined
                      style={{
                        color: red.primary
                      }}
                    />
                  )}
                </Tooltip>
              </Popconfirm>
            </>
          )
        }
      }
    ],
    [searchText, deletedRecord, onDeletePass]
  )

  const handleInputChange = React.useCallback((event) => {
    setSearchText(event.target.value)
  }, [])

  const handleUpdatePasswordModalSubmit = React.useCallback(
    (values, actions) => {
      onUpdatePass(updatedRecord.ID, values, () => {
        actions.setSubmitting(false)
        setUpdatedRecord(null)
      })
    },
    [updatedRecord]
  )

  React.useEffect(() => {
    setDataTable(
      searchText.length
        ? data.filter((pass) =>
            pass.URL.toString()
              .toLocaleLowerCase()
              .includes(searchText.toLocaleLowerCase())
          )
        : data
    )
  }, [searchText])

  React.useEffect(() => {
    if (Array.isArray(data)) {
      setDataTable(data)
    }
  }, [data])

  return (
    <div>
      <Input
        allowClear
        style={{ marginBottom: 20 }}
        placeholder="Search"
        value={searchText}
        onChange={handleInputChange}
      />

      <Table
        size="small"
        loading={loading}
        columns={columns}
        rowKey="ID"
        dataSource={dataTable}
      />
      <NewForm
        title="Update Pass"
        submitText="Update"
        visible={isShownUpdateFormModal}
        loading={isUpdateLoading}
        onClose={onModalClose}
        onSubmit={handleUpdatePasswordModalSubmit}
        initialValues={updatedRecord}
      />
    </div>
  )
}

export default PassTable
