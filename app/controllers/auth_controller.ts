// app/controllers/auth_controller.ts

import type { HttpContext } from '@adonisjs/core/http' [cite: 31]
import User from '#models/user' // Pastikan model User sudah ada dan terkonfigurasi 
import { loginValidator, registerValidator } from '#validators/auth' // Pastikan validator ini sudah Anda buat 

export default class AuthController {
  async showLogin({ view }: HttpContext) { [cite: 32]
    return view.render('auth/login') [cite: 32]
  }

  async showRegister({ view }: HttpContext) { [cite: 32]
    return view.render('auth/register') [cite: 32]
  }

  async login({ request, auth, response, session }: HttpContext) { [cite: 32]
    try {
      const { email, password } = await request.validateUsing(loginValidator) [cite: 32, 39]
      const user = await auth.use('web').verifyCredentials(email, password) // Perubahan di sini, gunakan verifyCredentials dari auth 
      await auth.use('web').login(user) [cite: 32]
      return response.redirect().toRoute('dashboard') [cite: 32]
    } catch (error) {
      session.flash('error', 'Email atau password salah!') [cite: 32]
      return response.redirect().back() [cite: 32]
    }
  }

  async register({ request, auth, response, session }: HttpContext) { [cite: 32, 33]
    try {
      const data = await request.validateUsing(registerValidator) [cite: 33, 39]
      const existingUser = await User.findBy('email', data.email) [cite: 33]

      if (existingUser) { [cite: 33]
        session.flash('error', 'Email sudah terdaftar!') [cite: 33]
        return response.redirect().back() [cite: 33]
      }

      const user = await User.create({ [cite: 33]
        fullName: data.fullName, // Sesuaikan dengan kolom nama user Anda, misal 'name' atau 'full_name' 
        email: data.email, [cite: 33]
        password: data.password [cite: 33]
      })

      await auth.use('web').login(user) [cite: 33]
      session.flash('success', 'Registrasi berhasil!') [cite: 33]
      return response.redirect().toRoute('dashboard') [cite: 33]
    } catch (error) {
      session.flash('error', 'Terjadi kesalahan saat registrasi!') [cite: 33]
      return response.redirect().back() [cite: 33]
    }
  }

  async logout({ auth, response, session }: HttpContext) { [cite: 33]
    await auth.use('web').logout() [cite: 33]
    session.flash('success', 'Logout berhasil!') [cite: 33]
    return response.redirect().toRoute('auth.login') [cite: 33]
  }
}