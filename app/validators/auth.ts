// app/validators/auth.ts

import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().normalizeEmail(),
    password: vine.string().minLength(6),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    fullName: vine.string().minLength(2).maxLength(50),
    email: vine.string().email().normalizeEmail().unique('users', 'email'),
    password: vine.string().minLength(6).maxLength(32).confirmed({
      confirmationField: 'passwordConfirmation',
    }),
    passwordConfirmation: vine.string(),
  })
)
