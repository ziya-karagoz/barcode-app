import { Modal, Form, Switch, InputNumber, Table } from 'antd';
import { BarcodeSettings, BarcodeData } from '@/types/barcode';

interface BarcodeSettingsModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (settings: BarcodeSettings) => void;
  barcodes: BarcodeData[];
  mode: 'print' | 'export';
}

export default function BarcodeSettingsModal({
  open,
  onCancel,
  onSubmit,
  barcodes,
  mode,
}: BarcodeSettingsModalProps) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  const columns = [
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
    },
  ];

  const initialValues = mode === 'print' ? {
    fixedSize: true,
    narrowBarWidth: 2,
    height: 12,
    quietZone: 1,
    fontSize: 3,
  } : {
    fixedSize: true,
    narrowBarWidth: 2,
    height: 100,
    quietZone: 10,
    fontSize: 12,
  };

  return (
    <Modal
      title={mode === 'print' ? "Print Barcodes" : "Export Barcodes"}
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          label="Fixed Size"
          name="fixedSize"
          valuePropName="checked"
        >
          <Switch />
        </Form.Item>

        <Form.Item
          label="Narrow Bar Width (X Value)"
          name="narrowBarWidth"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} max={10} />
        </Form.Item>

        <Form.Item
          label="Height"
          name="height"
          rules={[{ required: true }]}
        >
          <InputNumber min={mode === 'print' ? 8 : 50} max={mode === 'print' ? 16 : 300} />
        </Form.Item>

        <Form.Item
          label="Quiet Zone (Margin)"
          name="quietZone"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} max={mode === 'print' ? 2 : 50} />
        </Form.Item>

        <Form.Item
          label="Font Size"
          name="fontSize"
          rules={[{ required: true }]}
        >
          <InputNumber min={mode === 'print' ? 2 : 8} max={mode === 'print' ? 4 : 24} />
        </Form.Item>

        <Form.Item
          label="Select Barcodes"
          name="selectedBarcodes"
          rules={[{ required: true, message: 'Please select at least one barcode' }]}
        >
          <Table
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys) => {
                form.setFieldValue('selectedBarcodes', selectedRowKeys);
              },
            }}
            columns={columns}
            dataSource={barcodes.map(b => ({ ...b, key: b.id }))}
            size="small"
            pagination={false}
            scroll={{ y: 240 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
