// database/migrations/xxxx_create_penjualans_table.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'penjualans'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('produk_id').unsigned().references('id').inTable('produks').onDelete('CASCADE')
      table.integer('jumlah').unsigned().notNullable()
      table.integer('total_harga').unsigned().notNullable() // Tambahkan kolom total_harga
      table.date('tanggal').notNullable() // Kolom tanggal
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
