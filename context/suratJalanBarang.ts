import { create } from "zustand";

/** Single item for widget-detail-barang (detail barang per Surat Jalan) */
export interface SuratJalanBarangItem {
  name: string;
  details?: string;
  quantity: number | string;
  unit?: string;
}

/** Sample barang (items) by Surat Jalan referenceId */
const SAMPLE_BARANG_BY_REFERENCE_ID: Record<string, SuratJalanBarangItem[]> = {
  "SJLED/d4e56f11-xyz4-7zzk-a1b2-1234567890ab": [
    {
      name: "Kabel LAN 100M",
      details: "Kabel Data • LAN100M",
      quantity: 5,
      unit: "UNIT",
    },
    {
      name: "Switch 24 Port",
      details: "Networking • 24-Port",
      quantity: 2,
      unit: "UNIT",
    },
  ],
  "SJLED/e5f67g22-yza5-8aal-b2c3-2345678901bc": [
    {
      name: "Genset 45kva",
      details: "Power • 45kVA",
      quantity: 1,
      unit: "UNIT",
    },
    {
      name: "Kabel Roll 50M",
      details: "Kabel Power • 3x2.5mm",
      quantity: 3,
      unit: "ROLL",
    },
  ],
  "SJLED/f6g78h33-azb6-9bbm-c3d4-3456789012cd": [
    {
      name: "Riser 50cm",
      details: "Staging • Tinggi 50cm",
      quantity: 4,
      unit: "UNIT",
    },
  ],
};

const DEFAULT_BARANG: SuratJalanBarangItem[] = [];

interface SuratJalanBarangState {
  /** Get barang (item) list for a Surat Jalan by referenceId */
  getBarang: (referenceId: string) => SuratJalanBarangItem[];
}

export const useSuratJalanBarangStore = create<SuratJalanBarangState>()(() => ({
  getBarang: (referenceId: string) => {
    return SAMPLE_BARANG_BY_REFERENCE_ID[referenceId] ?? DEFAULT_BARANG;
  },
}));
