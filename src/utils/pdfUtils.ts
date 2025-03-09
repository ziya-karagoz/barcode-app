import { jsPDF } from 'jspdf';
import { BarcodeData, BarcodeSettings } from '@/types/barcode';
import { generateBarcode } from './barcodeUtils';

interface ExtendedBarcodeSettings extends Omit<BarcodeSettings, 'paperSize'> {
  isPrintMode?: boolean;
  paperSize: '20mm' | '40mm';
}

export async function exportToPDF(barcodes: BarcodeData[], settings: ExtendedBarcodeSettings) {
  // Create a new PDF document with custom page size
  const paperWidth = settings.paperSize === '20mm' ? 20 : 40;
  const paperHeight = settings.paperSize === '20mm' ? 10 : 15;
  
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: settings.isPrintMode ? [paperWidth, paperHeight] : 'a4'
  });

  const margin = settings.isPrintMode ? 1 : 10; // Smaller margin for print mode

  // Create a temporary container for generating barcodes
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  document.body.appendChild(container);

  try {
    for (let i = 0; i < barcodes.length; i++) {
      // Add a new page for each barcode in print mode
      if (i > 0) {
        doc.addPage(settings.isPrintMode ? [paperWidth, paperHeight] : 'a4');
      }

      const barcode = barcodes[i];
      // Adjust settings based on paper size
      const barcodeSettings = {
        ...settings,
        fontSize: settings.paperSize === '20mm' ? 3 : 4,
        height: settings.paperSize === '20mm' ? 6 : 10,
        textyoffset: settings.paperSize === '20mm' ? 1 : 2,
        narrowBarWidth: settings.paperSize === '20mm' ? 2 : 3
      };
      
      // Generate high-resolution barcode
      const canvas = generateBarcode(container, barcode.code, barcodeSettings);

      // Calculate dimensions for the current mode
      const contentWidth = settings.isPrintMode ? paperWidth - (margin * 2) : (doc.internal.pageSize.getWidth() - margin * 3) / 2;
      const contentHeight = settings.isPrintMode ? paperHeight - (margin * 2) : 40;

      // Calculate position
      let x, y;
      if (settings.isPrintMode) {
        x = margin;
        y = margin;
      } else {
        const row = Math.floor((i % 8) / 2); // 8 items per page in export mode
        const col = i % 2;
        x = margin + col * (contentWidth + margin);
        y = margin + row * (contentHeight + margin);
      }

      // Add the barcode image to the PDF
      doc.addImage(
        canvas.toDataURL('image/png', 1.0),
        'PNG',
        x,
        y,
        contentWidth,
        contentHeight,
        undefined,
        'FAST'
      );
    }

    // Handle output based on mode
    if (settings.isPrintMode) {
      doc.autoPrint();
      doc.output('dataurlnewwindow'); // Opens in new window for printing
    } else {
      doc.save('barcodes.pdf');
    }
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
}

export function printBarcodes(barcodes: BarcodeData[], settings: BarcodeSettings) {
  // Create a temporary container for the print layout
  const printContainer = document.createElement('div');
  printContainer.style.position = 'fixed';
  printContainer.style.top = '0';
  printContainer.style.left = '0';
  printContainer.style.width = '100%';
  printContainer.style.backgroundColor = 'white';
  printContainer.style.zIndex = '9999';
  document.body.appendChild(printContainer);

  // Add print-specific styles
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @media screen {
      .print-only { display: none; }
    }
    @media print {
      body * { visibility: hidden; }
      .print-only, .print-only * { visibility: visible !important; }
      .print-only { position: absolute; left: 0; top: 0; }
      @page {
        size: 40mm 20mm;
        margin: 0;
      }
      .barcode-container {
        width: 40mm;
        height: 20mm;
        page-break-after: always;
        display: flex;
        align-items: center;
        justify-content: center;
        background: white;
      }
      .barcode-container:last-child {
        page-break-after: avoid;
      }
      .barcode-container canvas {
        max-width: 38mm !important;
        height: auto !important;
      }
    }
  `;
  document.head.appendChild(styleSheet);

  try {
    // Create a container for each barcode
    const selectedBarcodes = settings.selectedBarcodes 
      ? barcodes.filter(b => settings.selectedBarcodes?.includes(b.id))
      : barcodes;

    printContainer.className = 'print-only';

    for (const barcode of selectedBarcodes) {
      const barcodeContainer = document.createElement('div');
      barcodeContainer.className = 'barcode-container';
      
      // Generate barcode with optimized settings for printing
      const printSettings = {
        ...settings,
        height: 12,
        fontSize: 3,
        narrowBarWidth: 2,
        textyoffset: 1,
      };
      
      const canvas = generateBarcode(barcodeContainer, barcode.code, printSettings);
      barcodeContainer.appendChild(canvas);
      printContainer.appendChild(barcodeContainer);
    }

    // Open print dialog
    window.print();
  } finally {
    // Clean up after printing
    document.head.removeChild(styleSheet);
    document.body.removeChild(printContainer);
  }
}
