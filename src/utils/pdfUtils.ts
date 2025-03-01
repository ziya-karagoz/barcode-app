import { jsPDF } from 'jspdf';
import { BarcodeData, BarcodeSettings } from '@/types/barcode';
import { generateBarcode } from './barcodeUtils';

export async function exportToPDF(barcodes: BarcodeData[], settings: BarcodeSettings) {
  // Create a new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
  });

  // Calculate dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 10;
  const barcodeWidth = (pageWidth - margin * 3) / 2;
  const barcodeHeight = 40; // Increased height to accommodate larger text
  const itemsPerPage = Math.floor((pageHeight - margin) / (barcodeHeight + margin));

  // Create a temporary container for generating barcodes
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  try {
    for (let i = 0; i < barcodes.length; i++) {
      // Add a new page if needed
      if (i > 0 && i % itemsPerPage === 0) {
        doc.addPage();
      }

      const barcode = barcodes[i];
      // Adjust settings for PDF export
      const pdfSettings = {
        ...settings,
        fontSize: 4, // Increased font size
        height: 10, // Match the barcodeHeight
        textyoffset: 2, // Adjusted text offset
        narrowBarWidth: 3 // Increased for better resolution
      };
      
      // Generate high-resolution barcode with 3x scale
      const canvas = generateBarcode(container, barcode.code, pdfSettings);

      // Calculate position
      const row = Math.floor((i % itemsPerPage) / 2);
      const col = i % 2;
      const x = margin + col * (barcodeWidth + margin);
      const y = margin + row * (barcodeHeight + margin);

      // Add the barcode image to the PDF with high quality
      doc.addImage(
        canvas.toDataURL('image/png', 1.0), // Use maximum quality
        'PNG',
        x,
        y,
        barcodeWidth,
        barcodeHeight,
        undefined,
        'FAST'
      );
    }

    // Save the PDF
    doc.save('barcodes.pdf');
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}
