// app/validators/penjualan.ts

import vine from '@vinejs/vine'

export const createPenjualanValidator = vine.compile(
  vine.object({
    produk_id: vine.number().exists('produks', 'id'),
    jumlah: vine.number().min(1),
    tanggal: vine.date(),
  })
)

export const updatePenjualanValidator = vine.compile(
  vine.object({
    produk_id: vine.number().exists('produks', 'id'),
    jumlah: vine.number().min(1),
    tanggal: vine.date(),
  })
)
export const deletePenjualanValidator = vine.compile(
  vine.object({
    id: vine.number().exists('penjualans', 'id'),
  })
)
