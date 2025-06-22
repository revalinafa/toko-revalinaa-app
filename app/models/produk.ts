// app/Models/Produk.ts

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm' // Tambahkan belongsTo dan hasMany
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations' // Import typings
import Kategori from './kategori.js' // Import model Kategori
import Supplier from './Supplier.js' // Import model Supplier
import Penjualan from './Penjualan.js' // Import model Penjualan
import StokLog from './StokLog.js' // Import model StokLog

export default class Produk extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare namaProduk: string // Kolom nama_produk

  @column()
  declare harga: number

  @column()
  declare stok: number

  @column()
  declare kategoriId: number // Kolom kategori_id

  @column()
  declare supplierId: number // Kolom supplier_id

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relasi: Produk belongsTo Kategori
  @belongsTo(() => Kategori)
  declare kategori: BelongsTo<typeof Kategori>

  // Relasi: Produk belongsTo Supplier
  @belongsTo(() => Supplier)
  declare supplier: BelongsTo<typeof Supplier>

  // Relasi: Produk hasMany Penjualan
  @hasMany(() => Penjualan)
  declare penjualans: HasMany<typeof Penjualan>

  // Relasi: Produk hasMany StokLog
  @hasMany(() => StokLog)
  declare stokLogs: HasMany<typeof StokLog>
}
