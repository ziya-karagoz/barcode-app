import React, { useEffect, forwardRef } from 'react';
import JsBarcode from 'jsbarcode';

interface PrintableBarcodeProps {
  code: string;
}

const PrintableBarcode = forwardRef<HTMLDivElement, PrintableBarcodeProps>(
  ({ code }, ref) => {
    useEffect(() => {
      const container = ref as React.RefObject<HTMLDivElement>;
      if (container.current) {
        // Clear previous content
        container.current.innerHTML = '';
        
        // Create SVG element
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        container.current.appendChild(svg);
        
        // Generate barcode
        JsBarcode(svg, code, {
          format: 'CODE128',
          width: 2,
          height: 40,
          displayValue: true,
          fontSize: 12,
          textMargin: 2,
          margin: 0,
        });
      }
    }, [code, ref]);

    const containerStyle: React.CSSProperties = {
      width: '40mm',
      height: '20mm',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'white',
      padding: '1mm',
      boxSizing: 'border-box',
      overflow: 'hidden',
      pageBreakInside: 'avoid',
    };

    return (
      <div style={{
        width: '40mm',
        height: '20mm',
        pageBreakInside: 'avoid',
      }}>
        <div ref={ref} style={containerStyle} />
      </div>
    );
  }
);

PrintableBarcode.displayName = 'PrintableBarcode';

export default PrintableBarcode;
