// app/validators/stok_log.ts

import vine from '@vinejs/vine'

// Validator untuk membuat entri Stok Log baru
export const createStokLogValidator = vine.compile(
  vine.object({
    produk_id: vine.number().exists('produks', 'id'), // Memastikan produk_id ada di tabel produks
    jenis: vine.enum(['masuk', 'keluar']), // Memastikan jenis adalah 'masuk' atau 'keluar'
    jumlah: vine.number().min(1), // Jumlah harus angka positif
    tanggal: vine.date(), // Tanggal harus format tanggal yang valid
  })
)

// Validator untuk memperbarui entri Stok Log (jika ada fitur edit manual)
// Aturan mirip dengan create, tetapi tidak ada validasi unik untuk ID log.
export const updateStokLogValidator = vine.compile(
  vine.object({
    produk_id: vine.number().exists('produks', 'id'),
    jenis: vine.enum(['masuk', 'keluar']),
    jumlah: vine.number().min(1),
    tanggal: vine.date(),
  })
)
