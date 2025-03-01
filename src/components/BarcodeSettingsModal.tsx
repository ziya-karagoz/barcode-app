import { Modal, Form, Switch, InputNumber } from 'antd';
import { BarcodeSettings } from '@/types/barcode';

interface BarcodeSettingsModalProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (settings: BarcodeSettings) => void;
}

export default function BarcodeSettingsModal({
  open,
  onCancel,
  onSubmit,
}: BarcodeSettingsModalProps) {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title="Barcode PDF Settings"
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fixedSize: true,
          narrowBarWidth: 2,
          height: 100,
          quietZone: 10,
          fontSize: 12,
          dpi: 300,
        }}
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
          <InputNumber min={50} max={300} />
        </Form.Item>

        <Form.Item
          label="Quiet Zone (Margin)"
          name="quietZone"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} max={50} />
        </Form.Item>

        <Form.Item
          label="Font Size"
          name="fontSize"
          rules={[{ required: true }]}
        >
          <InputNumber min={8} max={24} />
        </Form.Item>

        <Form.Item
          label="DPI"
          name="dpi"
          rules={[{ required: true }]}
        >
          <InputNumber min={72} max={600} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
