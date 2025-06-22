// app/validators/kategori.ts

import vine from '@vinejs/vine'

export const createKategoriValidator = vine.compile(
  vine.object({
    nama_kategori: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(255)
      .unique('kategoris', 'nama_kategori'),
  })
)

export const updateKategoriValidator = vine.compile(
  vine.object({
    // Untuk update, unikitas perlu dikecualikan untuk ID kategori yang sedang diedit.
    // Ini akan ditangani di controller saat memvalidasi. Validator ini hanya memberikan aturan dasarnya.
    nama_kategori: vine.string().trim().minLength(3).maxLength(255),
  })
)
