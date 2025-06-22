// app/controllers/stok_log_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import StokLog from '#models/stok_log' // Import model StokLog
import Produk from '#models/produk' // Import model Produk untuk filter

export default class StokLogController {
  async index({ request, view }: HttpContext) {
    const search = request.input('search', '')
    const filterProdukId = request.input('filterProdukId', '') // Filter Produk
    const filterJenis = request.input('filterJenis', '') // Filter Jenis
    const page = request.input('page', 1)
    const limit = 10

    const stokLogsQuery = StokLog.query().preload('produk') // Preload relasi produk

    // Penerapan filter pencarian
    if (search) {
      stokLogsQuery.whereHas('produk', (produkQuery) => {
        produkQuery.where('nama_produk', 'like', `%${search}%`)
      })
    }

    // Penerapan filter produk
    if (filterProdukId) {
      stokLogsQuery.where('produk_id', filterProdukId)
    }

    // Penerapan filter jenis
    if (filterJenis) {
      stokLogsQuery.where('jenis', filterJenis)
    }

    const stokLogs = await stokLogsQuery.orderBy('tanggal', 'desc').paginate(page, limit)

    // Ambil semua produk untuk dropdown filter
    const produks = await Produk.query().orderBy('nama_produk', 'asc')

    return view.render('stok_log/index', {
      stokLogs,
      search,
      filterProdukId,
      filterJenis,
      produks, // Kirim ke view
    })
  }

  async show({ params, view }: HttpContext) {
    const stokLog = await StokLog.query().where('id', params.id).preload('produk').firstOrFail()
    return view.render('stok_log/show', { stokLog })
  }
}
