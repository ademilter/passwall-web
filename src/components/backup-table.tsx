import React, { useMemo } from 'react';
import { Modal, Table, Typography, Button } from 'antd';
import { Backup } from '../helpers/Login';
import { ColumnType as TableColumnType } from 'antd/lib/table';
import moment from 'moment';

type BackupTableProps = {
    data: Backup[];
    visible: boolean,
    onClose: () => void,
    handleBackupSelected: (filename: string) => void,
    loading: boolean
};
const BackupTable: React.FC<BackupTableProps> = ({
    data = [],
    visible = false,
    onClose,
    handleBackupSelected,
    loading = false
}) => {
    const [page, setPage] = React.useState(1);
    const columns = useMemo(() => {
        const backupnameColumn: TableColumnType<Backup> = {
            title: "Backup Name",
            render: (value, item, index) => (
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                    {"Backup " + (data.length - ((page - 1) * 10 + index)).toString()}
                </Typography.Paragraph>
            )
        };
        const createdatColumn: TableColumnType<Backup> = {
            title: "Create Date",
            dataIndex: "created_at",
            render: (value) => (
                <Typography.Paragraph style={{ marginBottom: 0 }}>
                    {moment(value).format("DD.MM.YYYY HH:mm")}
                </Typography.Paragraph>
            )
        };
        return [backupnameColumn, createdatColumn]
    }, [data.length]);
    return (
        <div>

            <Modal
                title={"Restore"}
                closable={false}
                maskClosable={false}
                visible={visible}
                destroyOnClose
                bodyStyle={{ paddingBottom: 0, paddingTop: 4 }}
                footer={
                    <Button shape="round" onClick={onClose}>Cancel</Button>
                }
            >
                <h4>Select a backup to restore</h4>
                <Table<Backup>
                    size="small"
                    columns={columns}
                    rowKey="created_at"
                    rowClassName="clickable-row"
                    loading={loading}
                    pagination={{
                        onChange(current) {
                            setPage(current);
                        }
                    }}
                    onRow={(record) => {
                        return {
                            onClick: event => {
                                debugger;
                                handleBackupSelected(record.name);
                            }
                        }
                    }}

                    dataSource={data.sort((a, b) => moment(a.created_at) < moment(b.created_at) ? 1 : -1)} />
            </Modal>
            <style global jsx>
                {`
                    .clickable-row {
                        cursor: pointer;
                    }
                `}
            </style>
        </div>
    );
}
export default BackupTable;
