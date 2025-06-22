// database/migrations/xxxx_create_stok_logs_table.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'stok_logs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('produk_id').unsigned().references('id').inTable('produks').onDelete('CASCADE')
      table.enum('jenis', ['masuk', 'keluar']).notNullable() // Jenis stok: masuk atau keluar
      table.integer('jumlah').unsigned().notNullable()
      table.date('tanggal').notNullable() // Kolom tanggal
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
