'use client';

import { useState, useEffect } from 'react';
import { Button, InputNumber, Form, Space, message, Tabs } from 'antd';
import { DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import BarcodeList from '@/components/BarcodeList';
import BarcodeTable from '@/components/BarcodeTable';
import BarcodeSettingsModal from '@/components/BarcodeSettingsModal';
import { BarcodeData, BarcodeSettings } from '@/types/barcode';
import { exportToPDF } from '@/utils/pdfUtils';
import { generateNumericCode, formatNumericCode } from '@/utils/numericCodeUtils';

export default function Home() {
  const [barcodes, setBarcodes] = useState<BarcodeData[]>([]);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const savedBarcodes = localStorage.getItem('barcodes');
    if (savedBarcodes) {
      setBarcodes(JSON.parse(savedBarcodes));
    }
  }, []);

  const saveBarcodes = (newBarcodes: BarcodeData[]) => {
    setBarcodes(newBarcodes);
    localStorage.setItem('barcodes', JSON.stringify(newBarcodes));
  };

  const handleGenerate = async (values: { count: number }) => {
    const { count } = values;
    const newBarcodes: BarcodeData[] = [];
    const startIndex = barcodes.length;

    for (let i = 0; i < count; i++) {
      const code = generateNumericCode();
      newBarcodes.push({
        id: `${Date.now()}-${i}`,
        code: formatNumericCode(code),
        title: `Title ${startIndex + i + 1}`,
        createdAt: new Date().toISOString(),
      });
    }

    saveBarcodes([...barcodes, ...newBarcodes]);
    message.success(`Generated ${count} new barcodes`);
  };

  const handleDelete = (ids: string | string[]) => {
    const newBarcodes = barcodes.filter(barcode => 
      Array.isArray(ids) ? !ids.includes(barcode.id) : barcode.id !== ids
    );
    saveBarcodes(newBarcodes);
    message.success(Array.isArray(ids) 
      ? `${ids.length} barcodes deleted successfully`
      : 'Barcode deleted successfully'
    );
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setBarcodes(prevBarcodes => {
      const newBarcodes = prevBarcodes.map(barcode => 
        barcode.id === id ? { ...barcode, title: newTitle } : barcode
      );
      localStorage.setItem('barcodes', JSON.stringify(newBarcodes));
      return newBarcodes;
    });
  };

  const handleExportPDF = async (settings: BarcodeSettings) => {
    try {
      await exportToPDF(barcodes, {...settings, textyoffset: 5});
      message.success('PDF exported successfully');
      setIsSettingsModalOpen(false);
    } catch (error) {
      message.error('Failed to export PDF');
      console.error(error);
    }
  };

  const items = [
    {
      key: 'cards',
      label: 'Card View',
      children: <BarcodeList barcodes={barcodes} onDelete={handleDelete} onTitleChange={handleTitleChange} />,
    },
    {
      key: 'table',
      label: 'Table View',
      children: <BarcodeTable barcodes={barcodes} onDelete={handleDelete} onTitleChange={handleTitleChange} />,
    },
  ];

  return (
    <div className="p-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold mb-8">Barcode Generator & PDF Export</h1>
      <Form form={form} onFinish={handleGenerate} layout="inline" className="mb-8">
        <Form.Item
          name="count"
          rules={[{ required: true, message: 'Please enter the number of barcodes' }]}
        >
          <InputNumber min={1} max={100} placeholder="Number of barcodes" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} htmlType="submit">
              Generate Barcodes
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => setIsSettingsModalOpen(true)}
              disabled={barcodes.length === 0}
            >
              Export to PDF
            </Button>
          </Space>
        </Form.Item>
      </Form>
      
      <Tabs items={items} defaultActiveKey="cards" />
      
      <BarcodeSettingsModal
        open={isSettingsModalOpen}
        onCancel={() => setIsSettingsModalOpen(false)}
        onSubmit={handleExportPDF}
      />
    </div>
  );
}
