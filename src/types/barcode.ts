export interface BarcodeData {
  id: string;
  code: string;
  createdAt: Date;
  title: string;
}

export interface BarcodeSettings {
  fixedSize: boolean;
  narrowBarWidth: number;
  height: number;
  quietZone: number;
  fontSize: number;
  textyoffset: number;
}
