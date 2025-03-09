'use client';

import { useState, useEffect } from 'react';
import { Button, InputNumber, Form, Space, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import BarcodeTable from '@/components/BarcodeTable';
import { BarcodeData } from '@/types/barcode';
import { generateBarcodes, getBarcodes, deleteBarcode, deleteManyBarcodes, updateBarcodeTitle } from './actions';

export default function Home() {
  const [barcodes, setBarcodes] = useState<BarcodeData[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    const loadBarcodes = async () => {
      const data = await getBarcodes();
      // Convert Date objects to ISO strings for BarcodeData compatibility
      const formattedData = data.map(barcode => ({
        ...barcode,
        createdAt: new Date(barcode.createdAt).toISOString()
      }));
      setBarcodes(formattedData);
    };
    loadBarcodes();
  }, []);

  const handleGenerate = async (values: { count: number }) => {
    try {
      const { count } = values;
      const newBarcodes = await generateBarcodes(count);
      // Convert Date objects to ISO strings for new barcodes
      const formattedBarcodes = newBarcodes.map(barcode => ({
        ...barcode,
        createdAt: new Date(barcode.createdAt).toISOString()
      }));
      setBarcodes(prev => [...formattedBarcodes, ...prev]);
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
          </Space>
        </Form.Item>
      </Form>
      
      <BarcodeTable barcodes={barcodes} onDelete={handleDelete} onTitleChange={handleTitleChange} />
      
    </div>
  );
}
