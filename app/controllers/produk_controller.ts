// app/controllers/produk_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import Produk from '#models/produk' // Import model Produk
import Kategori from '#models/kategori' // Import model Kategori untuk dropdown filter
import Supplier from '#models/supplier' // Import model Supplier untuk dropdown filter
import { createProdukValidator, updateProdukValidator } from '#validators/produk' // Import validator produk

export default class ProdukController {
  async index({ request, view }: HttpContext) {
    const search = request.input('search', '')
    const filterKategoriId = request.input('filterKategoriId', '') // Filter kategori
    const filterSupplierId = request.input('filterSupplierId', '') // Filter supplier
    const page = request.input('page', 1)
    const limit = 10

    const produksQuery = Produk.query().preload('kategori').preload('supplier') // Preload relasi untuk menampilkan nama

    // Penerapan filter pencarian
    if (search) {
      produksQuery.where((query) => {
        query
          .where('nama_produk', 'like', `%${search}%`)
          .orWhere('harga', 'like', `%${search}%`)
          .orWhere('stok', 'like', `%${search}%`)
          .orWhereHas('kategori', (kategoriQuery) => {
            // Cari berdasarkan nama kategori
            kategoriQuery.where('nama_kategori', 'like', `%${search}%`)
          })
          .orWhereHas('supplier', (supplierQuery) => {
            // Cari berdasarkan nama supplier
            supplierQuery.where('nama_supplier', 'like', `%${search}%`)
          })
      })
    }

    // Penerapan filter kategori
    if (filterKategoriId) {
      // Hanya filter jika ID kategori dipilih
      produksQuery.where('kategori_id', filterKategoriId)
    }

    // Penerapan filter supplier
    if (filterSupplierId) {
      // Hanya filter jika ID supplier dipilih
      produksQuery.where('supplier_id', filterSupplierId)
    }

    const produks = await produksQuery.orderBy('nama_produk', 'asc').paginate(page, limit)

    // Ambil semua kategori dan supplier untuk dropdown filter
    const kategoris = await Kategori.query().orderBy('nama_kategori', 'asc')
    const suppliers = await Supplier.query().orderBy('nama_supplier', 'asc')

    return view.render('produk/index', {
      produks,
      search,
      filterKategoriId,
      filterSupplierId,
      kategoris, // Kirim ke view
      suppliers, // Kirim ke view
    })
  }

  async create({ view }: HttpContext) {
    const kategoris = await Kategori.all() // Ambil semua kategori untuk dropdown
    const suppliers = await Supplier.all() // Ambil semua supplier untuk dropdown
    return view.render('produk/create', { kategoris, suppliers })
  }

  async store({ request, response, session }: HttpContext) {
    try {
      const payload = await request.validateUsing(createProdukValidator)

      // Cek unikitas nama produk secara manual
      const existingProduk = await Produk.findBy('namaProduk', payload.nama_produk)
      if (existingProduk) {
        session.flash('errors', { nama_produk: 'Nama produk sudah terdaftar!' })
        session.flash('old', request.all())
        return response.redirect().back()
      }

      await Produk.create({
        namaProduk: payload.nama_produk,
        harga: payload.harga,
        stok: payload.stok,
        kategoriId: payload.kategori_id,
        supplierId: payload.supplier_id,
      })

      session.flash('notification', {
        type: 'success',
        message: 'Produk berhasil ditambahkan!',
      })
      return response.redirect().toRoute('produk.index')
    } catch (error) {
      if (error.messages) {
        session.flash('errors', error.messages.fields)
        session.flash('old', request.all())
      }
      session.flash('notification', {
        type: 'error',
        message: 'Gagal menambahkan produk!',
      })
      return response.redirect().back()
    }
  }

  async show({ params, view }: HttpContext) {
    const produk = await Produk.query()
      .where('id', params.id)
      .preload('kategori')
      .preload('supplier')
      .firstOrFail()
    return view.render('produk/show', { produk })
  }

  async edit({ params, view }: HttpContext) {
    const produk = await Produk.query()
      .where('id', params.id)
      .preload('kategori')
      .preload('supplier')
      .firstOrFail()
    const kategoris = await Kategori.all()
    const suppliers = await Supplier.all()
    return view.render('produk/edit', { produk, kategoris, suppliers })
  }

  async update({ params, request, response, session }: HttpContext) {
    try {
      const produk = await Produk.findOrFail(params.id)
      const payload = await request.validateUsing(updateProdukValidator)

      // Cek unikitas nama produk secara manual, kecualikan produk yang sedang diedit
      const existingProduk = await Produk.query()
        .where('namaProduk', payload.nama_produk)
        .where('id', '<>', produk.id)
        .first()

      if (existingProduk) {
        session.flash('errors', { nama_produk: 'Nama produk sudah terdaftar!' })
        session.flash('old', request.all())
        return response.redirect().back()
      }

      await produk
        .merge({
          namaProduk: payload.nama_produk,
          harga: payload.harga,
          stok: payload.stok,
          kategoriId: payload.kategori_id,
          supplierId: payload.supplier_id,
        })
        .save()

      session.flash('notification', {
        type: 'success',
        message: 'Produk berhasil diperbarui!',
      })
      return response.redirect().toRoute('produk.index')
    } catch (error) {
      if (error.messages) {
        session.flash('errors', error.messages.fields)
        session.flash('old', request.all())
      }
      session.flash('notification', {
        type: 'error',
        message: 'Gagal memperbarui produk!',
      })
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const produk = await Produk.findOrFail(params.id)
      await produk.delete()
      session.flash('notification', {
        type: 'success',
        message: 'Produk berhasil dihapus!',
      })
      return response.redirect().toRoute('produk.index')
    } catch (error) {
      session.flash('notification', {
        type: 'error',
        message: 'Gagal menghapus produk!',
      })
      return response.redirect().back()
    }
  }
}
