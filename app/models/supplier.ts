// app/Models/Supplier.ts

import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm' // Tambahkan hasMany
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Produk from './Produk.js' // Import model Produk

export default class Supplier extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare namaSupplier: string // Kolom nama_supplier

  @column()
  declare alamat: string | null

  @column()
  declare telepon: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relasi ke Produk
  @hasMany(() => Produk)
  declare produks: HasMany<typeof Produk>
}
