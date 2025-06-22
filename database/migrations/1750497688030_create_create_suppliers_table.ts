// database/migrations/xxxx_create_suppliers_table.ts

import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'suppliers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('nama_supplier', 255).notNullable().unique() // Tambahkan unique
      table.string('alamat').nullable()
      table.string('telepon', 50).nullable()
      table.timestamps(true, true)
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
