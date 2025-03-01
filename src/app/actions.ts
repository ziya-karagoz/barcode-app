'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { generateNumericCode, formatNumericCode } from '@/utils/numericCodeUtils';

export async function generateBarcodes(count: number) {
  const newBarcodes = [];
  
  for (let i = 0; i < count; i++) {
    const code = generateNumericCode();
    const barcode = await prisma.barcode.create({
      data: {
        code: formatNumericCode(code),
        title: `Title ${i + 1}`,
      },
    });
    newBarcodes.push(barcode);
  }

  revalidatePath('/');
  return newBarcodes;
}

export async function getBarcodes() {
  return await prisma.barcode.findMany({
    orderBy: { createdAt: 'desc' },
  });
}

export async function deleteBarcode(id: string) {
  await prisma.barcode.delete({
    where: { id },
  });
  revalidatePath('/');
}

export async function deleteManyBarcodes(ids: string[]) {
  await prisma.barcode.deleteMany({
    where: {
      id: { in: ids },
    },
  });
  revalidatePath('/');
}

export async function updateBarcodeTitle(id: string, title: string) {
  await prisma.barcode.update({
    where: { id },
    data: { title },
  });
  revalidatePath('/');
}
