// app/controllers/penjualan_controller.ts

import type { HttpContext } from '@adonisjs/core/http'
import Penjualan from '#models/penjualan' // Import model Penjualan
import Produk from '#models/produk' // Import model Produk untuk stok
import StokLog from '#models/stok_log' // Import model StokLog
import { createPenjualanValidator, updatePenjualanValidator } from '#validators/penjualan' // Import validator penjualan
import db from '@adonisjs/lucid/services/db' // Import DB untuk transaksi

export default class PenjualanController {
  async index({ request, view }: HttpContext) {
    const search = request.input('search', '')
    const page = request.input('page', 1)
    const limit = 10

    const penjualansQuery = Penjualan.query().preload('produk') // Preload relasi produk

    // Penerapan filter pencarian
    if (search) {
      penjualansQuery.where((query) => {
        query
          .whereHas('produk', (produkQuery) => {
            produkQuery.where('nama_produk', 'like', `%${search}%`)
          })
          .orWhere('jumlah', 'like', `%${search}%`)
          .orWhere('tanggal', 'like', `%${search}%`)
      })
    }

    const penjualans = await penjualansQuery.orderBy('tanggal', 'desc').paginate(page, limit)

    return view.render('penjualan/index', { penjualans, search })
  }

  async create({ view }: HttpContext) {
    const produks = await Produk.query().orderBy('nama_produk', 'asc') // Ambil semua produk untuk dropdown
    return view.render('penjualan/create', { produks })
  }

  async store({ request, response, session }: HttpContext) {
    try {
      const payload = await request.validateUsing(createPenjualanValidator)
      const produk = await Produk.findOrFail(payload.produk_id) // Dapatkan produk berdasarkan ID

      // Validasi Stok
      if (produk.stok < payload.jumlah) {
        session.flash('errors', {
          jumlah: `Stok produk ${produk.namaProduk} tidak mencukupi. Tersedia: ${produk.stok}`,
        })
        session.flash('old', request.all())
        return response.redirect().back()
      }

      const totalHarga = produk.harga * payload.jumlah // Hitung total harga

      await db.transaction(async (trx) => {
        // Gunakan transaksi database
        // 1. Buat catatan penjualan
        const penjualan = await Penjualan.create(
          {
            produkId: payload.produk_id,
            jumlah: payload.jumlah,
            tanggal: payload.tanggal,
            totalHarga: totalHarga,
          },
          { client: trx }
        ) // Kaitkan dengan transaksi

        // 2. Kurangi stok produk
        produk.stok -= payload.jumlah
        await produk.useTransaction(trx).save() // Gunakan transaksi untuk update produk

        // 3. Buat log stok keluar
        await StokLog.create(
          {
            produkId: payload.produk_id,
            jenis: 'keluar',
            jumlah: payload.jumlah,
            tanggal: payload.tanggal,
          },
          { client: trx }
        ) // Kaitkan dengan transaksi
      })

      session.flash('notification', {
        type: 'success',
        message: 'Penjualan berhasil ditambahkan dan stok diperbarui!',
      })
      return response.redirect().toRoute('penjualan.index')
    } catch (error) {
      console.error(error) // Untuk debugging
      if (error.messages) {
        session.flash('errors', error.messages.fields)
        session.flash('old', request.all())
      }
      session.flash('notification', {
        type: 'error',
        message: 'Gagal menambahkan penjualan: ' + (error.message || 'Terjadi kesalahan.'),
      })
      return response.redirect().back()
    }
  }

  async show({ params, view }: HttpContext) {
    const penjualan = await Penjualan.query().where('id', params.id).preload('produk').firstOrFail()
    return view.render('penjualan/show', { penjualan })
  }

  async edit({ params, view }: HttpContext) {
    const penjualan = await Penjualan.query().where('id', params.id).preload('produk').firstOrFail()
    const produks = await Produk.query().orderBy('nama_produk', 'asc')
    return view.render('penjualan/edit', { penjualan, produks })
  }

  async update({ params, request, response, session }: HttpContext) {
    try {
      const penjualan = await Penjualan.findOrFail(params.id)
      const oldJumlah = penjualan.jumlah // Simpan jumlah lama
      const oldProdukId = penjualan.produkId // Simpan produk ID lama

      const payload = await request.validateUsing(updatePenjualanValidator)

      // Dapatkan produk baru dan lama untuk penyesuaian stok jika produk/jumlah berubah
      const newProduk = await Produk.findOrFail(payload.produk_id)

      // Logika penyesuaian stok saat update lebih kompleks:
      // Memerlukan pembatalan efek penjualan lama dan penerapan efek penjualan baru.
      // Untuk menjaga ini tetap sederhana, update di sini hanya akan mengubah data penjualan
      // tanpa secara otomatis mempengaruhi stok produk atau membuat log stok baru.
      // Penyesuaian stok untuk update yang mengubah jumlah/produk harus dilakukan manual melalui Stok Log.

      // Jika produk_id berubah DAN jumlah tidak 0
      if (oldProdukId !== payload.produk_id && oldJumlah > 0) {
        session.flash('notification', {
          type: 'warning',
          message:
            'Perubahan produk pada penjualan memerlukan penyesuaian stok manual untuk produk lama dan baru melalui menu Stok Log.',
        })
      }
      // Jika produk_id sama tetapi jumlah berubah
      else if (oldProdukId === payload.produk_id && oldJumlah !== payload.jumlah) {
        session.flash('notification', {
          type: 'warning',
          message:
            'Perubahan jumlah penjualan memerlukan penyesuaian stok manual melalui menu Stok Log (jumlah lama: ' +
            oldJumlah +
            ', jumlah baru: ' +
            payload.jumlah +
            ').',
        })
      }

      // Hitung ulang total harga dengan harga produk baru (jika produk berubah) atau harga produk yang sama
      const newTotalHarga = newProduk.harga * payload.jumlah

      await penjualan
        .merge({
          produkId: payload.produk_id,
          jumlah: payload.jumlah,
          tanggal: payload.tanggal,
          totalHarga: newTotalHarga, // Perbarui total harga
        })
        .save()

      session.flash('notification', {
        type: 'success',
        message: 'Penjualan berhasil diperbarui!',
      })
      return response.redirect().toRoute('penjualan.index')
    } catch (error) {
      console.error(error) // Untuk debugging
      if (error.messages) {
        session.flash('errors', error.messages.fields)
        session.flash('old', request.all())
      }
      session.flash('notification', {
        type: 'error',
        message: 'Gagal memperbarui penjualan: ' + (error.message || 'Terjadi kesalahan.'),
      })
      return response.redirect().back()
    }
  }

  async destroy({ params, response, session }: HttpContext) {
    try {
      const penjualan = await Penjualan.findOrFail(params.id)
      const produk = await Produk.findOrFail(penjualan.produkId) // Dapatkan produk terkait

      await db.transaction(async (trx) => {
        // Gunakan transaksi database
        // 1. Tambahkan kembali stok produk
        produk.stok += penjualan.jumlah
        await produk.useTransaction(trx).save() // Gunakan transaksi untuk update produk

        // 2. Buat log stok masuk (sebagai pengembalian dari penjualan yang dihapus)
        await StokLog.create(
          {
            produkId: penjualan.produkId,
            jenis: 'masuk', // Karena stok kembali
            jumlah: penjualan.jumlah,
            tanggal: new Date(), // Tanggal pengembalian
            // keterangan: 'Pengembalian stok dari penjualan dihapus ID: ' + penjualan.id // Opsional jika ada kolom keterangan
          },
          { client: trx }
        ) // Kaitkan dengan transaksi

        // 3. Hapus catatan penjualan
        await penjualan.useTransaction(trx).delete() // Gunakan transaksi untuk delete penjualan
      })

      session.flash('notification', {
        type: 'success',
        message: 'Penjualan berhasil dihapus dan stok dikembalikan!',
      })
      return response.redirect().toRoute('penjualan.index')
    } catch (error) {
      console.error(error) // Untuk debugging
      session.flash('notification', {
        type: 'error',
        message: 'Gagal menghapus penjualan: ' + (error.message || 'Terjadi kesalahan.'),
      })
      return response.redirect().back()
    }
  }
}
