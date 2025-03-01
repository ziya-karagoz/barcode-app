# Barcode Generator & PDF Export

A Next.js application for generating unique barcodes and exporting them to PDF with customizable settings.

## Features

- Generate multiple unique barcodes
- Customize barcode appearance:
  - Fixed/Variable size
  - Narrow bar width
  - Height
  - Quiet zone (margin)
  - Font size
  - DPI resolution
- Export barcodes to PDF
- Persistent storage using localStorage
- Responsive design with Ant Design and Tailwind CSS

## Technologies Used

- Next.js 15+
- TypeScript
- Ant Design
- Tailwind CSS
- bwip-js (barcode generation)
- jsPDF (PDF export)
- localStorage (data persistence)

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Enter the number of barcodes you want to generate (1-100)
2. Click "Generate Barcodes" to create unique barcodes
3. View the generated barcodes in the grid layout
4. Click "Export to PDF" to customize barcode settings and download the PDF

## Barcode Settings

- **Fixed Size**: Toggle between fixed and variable barcode width
- **Narrow Bar Width**: Width of the narrowest bar (1-10)
- **Height**: Barcode height in pixels (50-300)
- **Quiet Zone**: Margin around the barcode (0-50)
- **Font Size**: Size of the text below the barcode (8-24)
- **DPI**: Resolution of the barcode image (72-600)
