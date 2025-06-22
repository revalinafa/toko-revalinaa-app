// app/Models/StokLog.ts

import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm' // Tambahkan belongsTo
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Produk from './Produk.js' // Import model Produk

export default class StokLog extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare produkId: number // Kolom produk_id

  @column()
  declare jenis: 'masuk' | 'keluar' // Kolom jenis dengan tipe enum

  @column()
  declare jumlah: number

  @column.date() // Menggunakan @column.date() untuk tipe data DATE
  declare tanggal: DateTime // Atau `string` jika Anda tidak ingin menggunakan objek DateTime

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relasi: StokLog belongsTo Produk
  @belongsTo(() => Produk)
  declare produk: BelongsTo<typeof Produk>
}
