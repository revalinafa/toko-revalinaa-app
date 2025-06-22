/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
| The routes file is used for defining the HTTP routes.
*/

import router from '@adonisjs/core/services/router' // Pastikan baris ini ada
import { middleware } from './kernel.js'

// Import Controllers
import AuthController from '#controllers/auth_controller'
import KategoriController from '#controllers/kategori_controller'
// Import controller lainnya di sini jika sudah dibuat (Produk, Supplier, Penjualan, StokLog, Laporan)
import ProdukController from '#controllers/produk_controller' // Diasumsikan akan dibuat
import SupplierController from '#controllers/supplier_controller' // Diasumsikan akan dibuat
import PenjualanController from '#controllers/penjualan_controller' // Diasumsikan akan dibuat
import StokLogController from '#controllers/stok_log_controller' // Diasumsikan akan dibuat
import LaporanController from '#controllers/laporan_controller' // Diasumsikan akan dibuat

router.get('/', ({ auth, response }) => {
  if (auth.user) {
    return response.redirect().toRoute('dashboard')
  }
  return response.redirect().toRoute('auth.login')
})

// Guest routes (hanya bisa diakses saat belum terautentikasi)
router
  .group(() => {
    router.get('/login', [AuthController, 'showLogin']).as('login')
    router.post('/login', [AuthController, 'login']).as('check')
    router.get('/register', [AuthController, 'showRegister']).as('register')
    router.post('/register', [AuthController, 'register']).as('checkRegister')
  })
  .as('auth')
  .middleware(middleware.guest())

// Protected routes (membutuhkan autentikasi)
router
  .group(() => {
    router.post('/logout', [AuthController, 'logout']).as('logout')

    // Dashboard Utama Aplikasi Toko Revalina
    router.get('/dashboard', ({ view }) => view.render('dashboard')).as('dashboard')

    // Routes untuk Manajemen Kategori
    router
      .group(() => {
        router.get('/', [KategoriController, 'index']).as('index')
        router.get('/create', [KategoriController, 'create']).as('create')
        router.post('/', [KategoriController, 'store']).as('store')
        router.get('/:id', [KategoriController, 'show']).as('show')
        router.get('/:id/edit', [KategoriController, 'edit']).as('edit')
        router.post('/:id', [KategoriController, 'update']).as('update')
        router.post('/:id/delete', [KategoriController, 'destroy']).as('destroy')
      })
      .prefix('/kategori')
      .as('kategori')

    // Catatan: Anda perlu membuat controller, validator, dan views untuk entitas berikut
    // Saya hanya membuatkan placeholder route-nya di sini.

    // Routes untuk Manajemen Supplier
    router
      .group(() => {
        router.get('/', [SupplierController, 'index']).as('index')
        router.get('/create', [SupplierController, 'create']).as('create')
        router.post('/', [SupplierController, 'store']).as('store')
        router.get('/:id', [SupplierController, 'show']).as('show')
        router.get('/:id/edit', [SupplierController, 'edit']).as('edit')
        router.post('/:id', [SupplierController, 'update']).as('update')
        router.post('/:id/delete', [SupplierController, 'destroy']).as('destroy')
      })
      .prefix('/supplier')
      .as('supplier')

    // Routes untuk Manajemen Produk
    router
      .group(() => {
        router.get('/', [ProdukController, 'index']).as('index')
        router.get('/create', [ProdukController, 'create']).as('create')
        router.post('/', [ProdukController, 'store']).as('store')
        router.get('/:id', [ProdukController, 'show']).as('show')
        router.get('/:id/edit', [ProdukController, 'edit']).as('edit')
        router.post('/:id', [ProdukController, 'update']).as('update')
        router.post('/:id/delete', [ProdukController, 'destroy']).as('destroy')
      })
      .prefix('/produk')
      .as('produk')

    // Routes untuk Penjualan
    router
      .group(() => {
        router.get('/', [PenjualanController, 'index']).as('index')
        router.get('/create', [PenjualanController, 'create']).as('create')
        router.post('/', [PenjualanController, 'store']).as('store')
        router.get('/:id', [PenjualanController, 'show']).as('show')
        router.get('/:id/edit', [PenjualanController, 'edit']).as('edit')
        router.post('/:id', [PenjualanController, 'update']).as('update')
        router.post('/:id/delete', [PenjualanController, 'destroy']).as('destroy')
      })
      .prefix('/penjualan')
      .as('penjualan')

    // Routes untuk Stok Log
    router
      .group(() => {
        router.get('/', [StokLogController, 'index']).as('index')
        router.get('/create', [StokLogController, 'create']).as('create')
        router.post('/', [StokLogController, 'store']).as('store')
        router.get('/:id', [StokLogController, 'show']).as('show')
        router.get('/:id/edit', [StokLogController, 'edit']).as('edit')
        router.post('/:id', [StokLogController, 'update']).as('update')
        router.post('/:id/delete', [StokLogController, 'destroy']).as('destroy')
      })
      .prefix('/stok-log')
      .as('stok_log') // Menggunakan 'stok-log' untuk URL, dan 'stok_log' untuk nama route

    // Routes untuk Laporan
    router
      .group(() => {
        router.get('/harian', [LaporanController, 'harian']).as('harian') // Misalnya method 'harian' di LaporanController
      })
      .prefix('/laporan')
      .as('laporan')
  })
  .middleware(middleware.auth()) // Middleware auth untuk seluruh grup admin
