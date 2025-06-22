// app/controllers/supplier_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import Supplier from '#models/supplier' // Pastikan import model Supplier
import { createSupplierValidator, updateSupplierValidator } from '#validators/supplier' // Import validator supplier

export default class SupplierController {
  async index({ request, view }: HttpContext) {
    const search = request.input('search', '')
    const page = request.input('page', 1)
    const limit = 10

    const suppliers = await Supplier.query()
      .if(search, (query) => {
        query
          .where('nama_supplier', 'like', `%${search}%`)
          .orWhere('alamat', 'like', `%${search}%`)
          .orWhere('telepon', 'like', `%${search}%`)
      })
      .paginate(page, limit)

    return view.render('supplier/index', { suppliers, search })
  }

  async create({ view }: HttpContext) {
    return view.render('supplier/create')
  }

  async store({ request, response, session }: HttpContext) {
    try {
      const payload = await request.validateUsing(createSupplierValidator)

      const existingSupplier = await Supplier.findBy('namaSupplier', payload.nama_supplier)
      if (existingSupplier) {
        session.flash('errors', { nama_supplier: 'Nama supplier sudah terdaftar!' })
        session.flash('old', request.all())
        return response.redirect().back()
      }

      await Supplier.create({
        namaSupplier: payload.nama_supplier,
        alamat: payload.alamat,
        telepon: payload.telepon,
      })

      session.flash('notification', {
        type: 'success',
        message: 'Supplier berhasil ditambahkan!',
      })
      return response.redirect().toRoute('supplier.index')
    } catch (error) {
      if (error.messages) {
        session.flash('errors', error.messages.fields)
        session.flash('old', request.all())
      }
      session.flash('notification', {
        type: 'error',
        message: 'Gagal menambahkan supplier!',
      })
      return response.redirect().back()
    }
  }

  async show({ params, view }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)
    return view.render('supplier/show', { supplier })
  }

  async edit({ params, view }: HttpContext) {
    const supplier = await Supplier.findOrFail(params.id)
    return view.render('supplier/edit', { supplier })
  }

  async update({ params, request, response, session }: HttpContext) {
    try {
      const supplier = await Supplier.findOrFail(params.id)
      const payload = await request.validateUsing(updateSupplierValidator)

      const existingSupplier = await Supplier.query()
        .where('namaSupplier', payload.nama_supplier)
        .where('id', '<>', supplier.id)
        .first()

      if (existingSupplier) {
        session.flash('errors', { nama_supplier: 'Nama supplier sudah terdaftar!' })
        session.flash('old', request.all())
        return response.redirect().back()
      }

      await supplier
        .merge({
          namaSupplier: payload.nama_supplier,
          alamat: payload.alamat,
          telepon: payload.telepon,
        })
        .save()

      session.flash('notification', {
        type: 'success',
        message: 'Supplier berhasil diperbarui!',
      })
      return response.redirect().toRoute('supplier.index')
    } catch (error) {
      if (error.messages) {
        session.flash('errors', error.messages.fields)
        session.flash('old', request.all())
      }
      session.flash('notification', {
        type: 'error',
        message: 'Gagal memperbarui supplier!',
      })
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const supplier = await Supplier.findOrFail(params.id)
      await supplier.delete()
      session.flash('notification', {
        type: 'success',
        message: 'Supplier berhasil dihapus!',
      })
      return response.redirect().toRoute('supplier.index')
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: 'Gagal menghapus supplier!',
      })
      return response.redirect().back()
    }
  }
}
