'use client';

import { useState, useEffect } from 'react';
import { Button, InputNumber, Form, Space, message, Tabs } from 'antd';
import { DownloadOutlined, PrinterOutlined, PlusOutlined } from '@ant-design/icons';
import BarcodeList from '@/components/BarcodeList';
import BarcodeTable from '@/components/BarcodeTable';
import BarcodeSettingsModal from '@/components/BarcodeSettingsModal';
import { BarcodeData, BarcodeSettings } from '@/types/barcode';
import { exportToPDF, printBarcodes } from '@/utils/pdfUtils';
import { generateBarcodes, getBarcodes, deleteBarcode, deleteManyBarcodes, updateBarcodeTitle } from './actions';

export default function Home() {
  const [barcodes, setBarcodes] = useState<BarcodeData[]>([]);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadBarcodes = async () => {
      const data = await getBarcodes();
      setBarcodes(data);
    };
    loadBarcodes();
  }, []);

  const handleGenerate = async (values: { count: number }) => {
    try {
      const { count } = values;
      const newBarcodes = await generateBarcodes(count);
      setBarcodes(prev => [...newBarcodes, ...prev]);
      message.success(`Generated ${count} new barcodes`);
    } catch (error) {
      message.error('Failed to generate barcodes');
      console.error(error);
    }
  };

  const handleDelete = async (ids: string | string[]) => {
    try {
      if (Array.isArray(ids)) {
        await deleteManyBarcodes(ids);
        setBarcodes(prev => prev.filter(barcode => !ids.includes(barcode.id)));
      } else {
        await deleteBarcode(ids);
        setBarcodes(prev => prev.filter(barcode => barcode.id !== ids));
      }
      message.success(Array.isArray(ids) 
        ? `${ids.length} barcodes deleted successfully`
        : 'Barcode deleted successfully'
      );
    } catch (error) {
      message.error('Failed to delete barcode(s)');
      console.error(error);
    }
  };

  const handleTitleChange = async (id: string, newTitle: string) => {
    try {
      await updateBarcodeTitle(id, newTitle);
      setBarcodes(prev => prev.map(barcode => 
        barcode.id === id ? { ...barcode, title: newTitle } : barcode
      ));
    } catch (error) {
      message.error('Failed to update title');
      console.error(error);
    }
  };

  const handleExportPDF = async (settings: BarcodeSettings) => {
    try {
      await exportToPDF(barcodes, {...settings, textyoffset: 5, paperSize: '40mm'});
      message.success('PDF exported successfully');
      setIsExportModalOpen(false);
    } catch (error) {
      message.error('Failed to export PDF');
      console.error(error);
    }
  };

  const handlePrint = async (settings: BarcodeSettings) => {
    try {
      printBarcodes(barcodes, settings);
      setIsPrintModalOpen(false);
    } catch (error) {
      message.error('Failed to print barcodes');
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
      <h1 className="text-2xl font-bold mb-8">Barcode Generator & Print</h1>
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
              icon={<PrinterOutlined />}
              onClick={() => setIsPrintModalOpen(true)}
              disabled={barcodes.length === 0}
            >
              Print Barcodes
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => setIsExportModalOpen(true)}
              disabled={barcodes.length === 0}
            >
              Export to PDF
            </Button>
          </Space>
        </Form.Item>
      </Form>
      
      <Tabs items={items} defaultActiveKey="cards" />
      
      <BarcodeSettingsModal
        open={isPrintModalOpen}
        onCancel={() => setIsPrintModalOpen(false)}
        onSubmit={handlePrint}
        barcodes={barcodes}
        mode="print"
      />

      <BarcodeSettingsModal
        open={isExportModalOpen}
        onCancel={() => setIsExportModalOpen(false)}
        onSubmit={handleExportPDF}
        barcodes={barcodes}
        mode="export"
      />
    </div>
  );
}
