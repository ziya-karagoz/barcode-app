import bwipjs from 'bwip-js';
import { BarcodeSettings } from '@/types/barcode';

export function generateBarcode(
  element: HTMLElement,
  code: string,
  settings: BarcodeSettings
) {
  try {
    // Clear any existing content
    element.innerHTML = '';

    // Create a canvas element
    const canvas = document.createElement('canvas');
    element.appendChild(canvas);

    // Generate the barcode
    bwipjs.toCanvas(canvas, {
      bcid: 'code128',      // Using Code 128 which handles numeric data well
      text: code,           // Text to encode
      scale: settings.narrowBarWidth,
      height: settings.height,
      includetext: true,    // Show human-readable text
      textxalign: 'center', // Center the text
      textsize: settings.fontSize,
      textyoffset: settings.textyoffset,
      paddingwidth: settings.quietZone,
      paddingheight: settings.quietZone
    });

    return canvas;
  } catch (error) {
    console.error('Error generating barcode:', error);
    throw error;
  }
}
