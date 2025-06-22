// app/validators/supplier.ts

import vine from '@vinejs/vine'

export const createSupplierValidator = vine.compile(
  vine.object({
    nama_supplier: vine
      .string()
      .trim()
      .minLength(3)
      .maxLength(255)
      .unique('suppliers', 'nama_supplier'),
    alamat: vine.string().trim().nullableAndOptional(),
    telepon: vine.string().trim().maxLength(20).nullableAndOptional(),
  })
)

export const updateSupplierValidator = vine.compile(
  vine.object({
    nama_supplier: vine.string().trim().minLength(3).maxLength(255), // Uniqueness handled in controller
    alamat: vine.string().trim().nullableAndOptional(),
    telepon: vine.string().trim().maxLength(20).nullableAndOptional(),
  })
)
