// app/controllers/auth_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import User from '/models/user' // Pastikan path ini sesuai dengan struktur folder Anda
import { loginValidator, registerValidator } from '#validators/auth' // Kita akan membuat validator ini selanjutnya

export default class AuthController {
  async showLogin({ view }: HttpContext) {
    return view.render('auth/login')
  }

  async showRegister({ view }: HttpContext) {
    return view.render('auth/register')
  }

  async login({ request, auth, response, session }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await auth.use('web').verifyCredentials(email, password)
      await auth.use('web').login(user)
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash('error', 'Email atau password salah!')
      return response.redirect().back()
    }
  }

  async register({ request, auth, response, session }: HttpContext) {
    try {
      const data = await request.validateUsing(registerValidator)
      const existingUser = await User.findBy('email', data.email)

      if (existingUser) {
        session.flash('error', 'Email sudah terdaftar!')
        return response.redirect().back()
      }

      const user = await User.create({
        fullName: data.fullName, // Sesuaikan dengan nama kolom di tabel 'users' Anda (misal: 'name' atau 'full_name')
        email: data.email,
        password: data.password,
      })

      await auth.use('web').login(user)
      session.flash('success', 'Registrasi berhasil!')
      return response.redirect().toRoute('dashboard')
    } catch (error) {
      session.flash('error', 'Terjadi kesalahan saat registrasi!')
      return response.redirect().back()
    }
  }

  async logout({ auth, response, session }: HttpContext) {
    await auth.use('web').logout()
    session.flash('success', 'Logout berhasil!')
    return response.redirect().toRoute('auth.login')
  }
}
