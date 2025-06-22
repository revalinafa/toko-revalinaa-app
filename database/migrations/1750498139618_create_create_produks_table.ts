// database/migrations/xxxx_create_produks_table.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'produks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama_produk', 255).notNullable().unique() // Tambahkan unique
      table.integer('harga').unsigned().notNullable() // unsigned() untuk harga positif
      table.integer('stok').unsigned().defaultTo(0) // unsigned() untuk stok positif, default 0

      // Foreign key ke kategori
      table
        .integer('kategori_id')
        .unsigned()
        .references('id')
        .inTable('kategoris')
        .onDelete('CASCADE')
      // Foreign key ke supplier
      table
        .integer('supplier_id')
        .unsigned()
        .references('id')
        .inTable('suppliers')
        .onDelete('CASCADE')

      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
