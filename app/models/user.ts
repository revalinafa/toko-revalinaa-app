// app/Models/User.ts

import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fullName: string // Kolom untuk nama lengkap user

  @column({
    serializeAs: null, // Jangan tampilkan password saat diserialisasi
  })
  declare password: string

  @column({
    serializeAs: null, // Jangan tampilkan remember_me_token saat diserialisasi
  })
  declare rememberMeToken: string | null

  @column()
  declare email: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
