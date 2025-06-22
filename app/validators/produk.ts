// app/validators/produk.ts

import vine from '@vinejs/vine'

export const createProdukValidator = vine.compile(
  vine.object({
    nama_produk: vine.string().trim().minLength(3).maxLength(255).unique('produks', 'nama_produk'),
    harga: vine.number().min(0),
    stok: vine.number().min(0),
    kategori_id: vine.number().exists('kategoris', 'id'), // Memastikan kategori_id ada di tabel kategoris
    supplier_id: vine.number().exists('suppliers', 'id'), // Memastikan supplier_id ada di tabel suppliers
  })
)

export const updateProdukValidator = vine.compile(
  vine.object({
    nama_produk: vine.string().trim().minLength(3).maxLength(255), // Uniqueness handled in controller
    harga: vine.number().min(0),
    stok: vine.number().min(0),
    kategori_id: vine.number().exists('kategoris', 'id'),
    supplier_id: vine.number().exists('suppliers', 'id'),
  })
)
