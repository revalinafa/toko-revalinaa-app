// app/controllers/kategori_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import Kategori from '#models/kategori' // Pastikan import model Kategori
import { createKategoriValidator, updateKategoriValidator } from '#validators/kategori' // Import validator kategori
import db from '@adonisjs/lucid/services/db' // Import DB untuk validasi unik kustom

export default class KategoriController {
  async index({ request, view }: HttpContext) {
    const search = request.input('search', '')
    const page = request.input('page', 1)
    const limit = 10

    const kategoris = await Kategori.query()
      .if(search, (query) => {
        query.where('nama_kategori', 'like', `%${search}%`)
      })
      .paginate(page, limit)

    return view.render('kategori/index', { kategoris, search })
  }

  async create({ view }: HttpContext) {
    return view.render('kategori/create')
  }

  async store({ request, response, session }: HttpContext) {
    try {
      // Validasi awal
      const payload = await request.validateUsing(createKategoriValidator)

      // Cek unikitas secara manual untuk menghindari duplikasi
      const existingKategori = await Kategori.findBy('namaKategori', payload.nama_kategori)
      if (existingKategori) {
        session.flash('errors', { nama_kategori: 'Nama kategori sudah terdaftar!' }) // Pesan error spesifik
        session.flash('old', request.all())
        return response.redirect().back()
      }

      await Kategori.create({ namaKategori: payload.nama_kategori }) // Pastikan 'namaKategori' sesuai dengan model
      session.flash('notification', {
        type: 'success',
        message: 'Kategori berhasil ditambahkan!',
      })
      return response.redirect().toRoute('kategori.index')
    } catch (error) {
      if (error.messages) {
        session.flash('errors', error.messages.fields) // Gunakan .fields untuk mendapatkan pesan error validasi
        session.flash('old', request.all())
      }
      session.flash('notification', {
        type: 'error',
        message: 'Gagal menambahkan kategori!',
      })
      return response.redirect().back()
    }
  }

  async show({ params, view }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    return view.render('kategori/show', { kategori })
  }

  async edit({ params, view }: HttpContext) {
    const kategori = await Kategori.findOrFail(params.id)
    return view.render('kategori/edit', { kategori })
  }

  async update({ params, request, response, session }: HttpContext) {
    try {
      const kategori = await Kategori.findOrFail(params.id)
      const payload = await request.validateUsing(updateKategoriValidator)

      // Cek unikitas secara manual, kecualikan kategori yang sedang diedit
      const existingKategori = await Kategori.query()
        .where('namaKategori', payload.nama_kategori)
        .where('id', '<>', kategori.id) // Kecualikan kategori ini
        .first()

      if (existingKategori) {
        session.flash('errors', { nama_kategori: 'Nama kategori sudah terdaftar!' })
        session.flash('old', request.all())
        return response.redirect().back()
      }

      await kategori.merge({ namaKategori: payload.nama_kategori }).save() // Pastikan 'namaKategori' sesuai dengan model
      session.flash('notification', {
        type: 'success',
        message: 'Kategori berhasil diperbarui!',
      })
      return response.redirect().toRoute('kategori.index')
    } catch (error) {
      if (error.messages) {
        session.flash('errors', error.messages.fields)
        session.flash('old', request.all())
      }
      session.flash('notification', {
        type: 'error',
        message: 'Gagal memperbarui kategori!',
      })
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const kategori = await Kategori.findOrFail(params.id)
      await kategori.delete()
      session.flash('notification', {
        type: 'success',
        message: 'Kategori berhasil dihapus!',
      })
      return response.redirect().toRoute('kategori.index')
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: 'Gagal menghapus kategori!',
      })
      return response.redirect().back()
    }
  }
}
