import { List, Card, Dropdown, Modal, Input } from 'antd';
import { BarcodeData } from '@/types/barcode';
import { generateBarcode } from '@/utils/barcodeUtils';
import { EllipsisOutlined, DeleteOutlined } from '@ant-design/icons';
import { useState } from 'react';

interface BarcodeListProps {
  barcodes: BarcodeData[];
  onDelete: (id: string) => void;
  onTitleChange: (id: string, newTitle: string) => void;
}

export default function BarcodeList({ barcodes, onDelete, onTitleChange }: BarcodeListProps) {
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [selectedBarcode, setSelectedBarcode] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState<string | null>(null);
  const [tempTitle, setTempTitle] = useState('');

  const handleDeleteClick = (id: string) => {
    setSelectedBarcode(id);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedBarcode) {
      onDelete(selectedBarcode);
      setDeleteModalVisible(false);
      setSelectedBarcode(null);
    }
  };

  const handleTitleClick = (barcode: BarcodeData) => {
    setEditingTitle(barcode.id);
    setTempTitle(barcode.title);
  };

  const handleTitleBlur = () => {
    if (editingTitle && tempTitle.trim()) {
      onTitleChange(editingTitle, tempTitle.trim());
    }
    setEditingTitle(null);
  };

  return (
    <>
      <List
        grid={{ gutter: 16, xs: 1, sm: 2, md: 3, lg: 4 }}
        dataSource={barcodes}
        renderItem={(barcode) => (
          <List.Item>
            <Card
              title={
                editingTitle === barcode.id ? (
                  <Input
                    value={tempTitle}
                    onChange={(e) => setTempTitle(e.target.value)}
                    onBlur={handleTitleBlur}
                    onPressEnter={handleTitleBlur}
                    autoFocus
                  />
                ) : (
                  <div
                    onClick={() => handleTitleClick(barcode)}
                    style={{ cursor: 'pointer' }}
                  >
                    {barcode.title}
                  </div>
                )
              }
              extra={
                <Dropdown
                  menu={{
                    items: [
                      {
                        key: 'delete',
                        icon: <DeleteOutlined />,
                        label: 'Delete',
                        onClick: () => handleDeleteClick(barcode.id),
                        danger: true,
                      },
                    ],
                  }}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <EllipsisOutlined style={{ fontSize: '20px' }} />
                </Dropdown>
              }
            >
              <div
                id={`barcode-${barcode.id}`}
                className="flex justify-center"
                ref={(el) => {
                  if (el) {
                    generateBarcode(el, barcode.code, {
                      fixedSize: true,
                      narrowBarWidth: 2,
                      height: 10,
                      textyoffset: 4,
                      quietZone: 5,
                      fontSize: 7,
                    });
                  }
                }}
              />
              <p className="text-sm text-gray-500 mt-2">
                Created: {new Date(barcode.createdAt).toLocaleString()}
              </p>
            </Card>
          </List.Item>
        )}
      />
      <Modal
        title="Delete Barcode"
        open={deleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={() => {
          setDeleteModalVisible(false);
          setSelectedBarcode(null);
        }}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <p>Are you sure you want to delete this barcode? This action cannot be undone.</p>
      </Modal>
    </>
  );
}
