import { Table, Dropdown, Modal, Input, Button } from 'antd';
import { BarcodeData } from '@/types/barcode';
import { EllipsisOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useCallback, useMemo } from 'react';
import type { ColumnsType } from 'antd/es/table';
import type { TablePaginationConfig } from 'antd/es/table';

interface BarcodeTableProps {
  barcodes: BarcodeData[];
  onDelete: (id: string | string[]) => void;
  onTitleChange: (id: string, newTitle: string) => void;
}

export default function BarcodeTable({ barcodes, onDelete, onTitleChange }: BarcodeTableProps) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isMultiDelete, setIsMultiDelete] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    showSizeChanger: true,
    showTotal: (total) => `Total ${total} items`,
  });

  const handleSearch = useCallback((value: string) => {
    setSearchText(value);
    setPagination(prev => ({ ...prev, current: 1 }));
  }, []);

  const filteredBarcodes = useMemo(() => {
    const searchLower = searchText.toLowerCase();
    return searchText
      ? barcodes.filter(barcode => 
          barcode.title.toLowerCase().includes(searchLower) ||
          barcode.code.toLowerCase().includes(searchLower)
        )
      : barcodes;
  }, [barcodes, searchText]);

  const handleSingleDeleteClick = useCallback((id: string) => {
    setSelectedRows([id]);
    setIsMultiDelete(false);
    setDeleteModalVisible(true);
  }, []);

  const handleMultiDeleteClick = useCallback(() => {
    setIsMultiDelete(true);
    setDeleteModalVisible(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    onDelete(isMultiDelete ? selectedRows : selectedRows[0]);
    setDeleteModalVisible(false);
    setSelectedRows([]);
    setIsMultiDelete(false);

    // Calculate current page item count
    const startIndex = ((pagination.current || 1) - 1) * (pagination.pageSize || 10);
    const currentPageItemCount = filteredBarcodes.slice(startIndex, startIndex + (pagination.pageSize || 10)).length;

    if (currentPageItemCount <= (isMultiDelete ? selectedRows.length : 1) && pagination.current! > 1) {
      setPagination(prev => ({ ...prev, current: 1 }));
    }
  }, [filteredBarcodes, isMultiDelete, onDelete, pagination.current, pagination.pageSize, selectedRows]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModalVisible(false);
    if (isMultiDelete) {
      setSelectedRows([]);
    }
    setIsMultiDelete(false);
  }, [isMultiDelete]);

  const handleTableChange = useCallback((newPagination: TablePaginationConfig) => {
    setPagination(newPagination);
  }, []);

  const handleTitleClick = useCallback((barcode: BarcodeData) => {
    setEditingTitle(barcode.id);
    setTempTitle(barcode.title);
  }, []);

  const handleTitleBlur = useCallback(() => {
    if (editingTitle && tempTitle.trim()) {
      onTitleChange(editingTitle, tempTitle.trim());
    }
    setEditingTitle(null);
  }, [editingTitle, onTitleChange, tempTitle]);

  const rowSelection = useMemo(() => ({
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedRows(selectedRowKeys as string[]);
    },
  }), [selectedRows]);

  const columns: ColumnsType<BarcodeData> = useMemo(() => [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (title: string, record) => (
        editingTitle === record.id ? (
          <Input
            value={tempTitle}
            onChange={(e) => setTempTitle(e.target.value)}
            onBlur={handleTitleBlur}
            onPressEnter={handleTitleBlur}
            autoFocus
          />
        ) : (
          <div
            onClick={() => handleTitleClick(record)}
            style={{ cursor: 'pointer' }}
          >
            {title}
          </div>
        )
      ),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <Dropdown
          menu={{
            items: [
              {
                key: 'delete',
                icon: <DeleteOutlined />,
                label: 'Delete',
                onClick: () => handleSingleDeleteClick(record.id),
                danger: true,
              },
            ],
          }}
          trigger={['click']}
          placement="bottomRight"
        >
          <EllipsisOutlined style={{ fontSize: '20px', cursor: 'pointer' }} />
        </Dropdown>
      ),
    },
  ], [editingTitle, handleSingleDeleteClick, handleTitleBlur, handleTitleClick, tempTitle]);

  return (
    <>
      <div style={{ marginBottom: 16, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Input
          placeholder="Search by title or code"
          prefix={<SearchOutlined />}
          onChange={e => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
        {selectedRows.length > 0 && (
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
            onClick={handleMultiDeleteClick}
          >
            Delete Selected ({selectedRows.length})
          </Button>
        )}
      </div>
      <Table 
        rowSelection={rowSelection}
        columns={columns} 
        dataSource={filteredBarcodes}
        rowKey="id"
        pagination={pagination}
        onChange={handleTableChange}
      />
      <Modal
        title={isMultiDelete ? "Delete Multiple Barcodes" : "Delete Barcode"}
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>
          {isMultiDelete
            ? `Are you sure you want to delete ${selectedRows.length} selected barcodes? This action cannot be undone.`
            : "Are you sure you want to delete this barcode? This action cannot be undone."
          }
        </p>
      </Modal>
    </>
  );
}
