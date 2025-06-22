// database/migrations/xxxx_create_kategoris_table.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'kategoris'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama_kategori', 255).notNullable().unique() // Tambahkan unique
      table.timestamps(true, true) // created_at dan updated_at
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
