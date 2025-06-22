# 🛒 Manajemen Produk Toko

Project ini adalah aplikasi manajemen produk toko sederhana yang dibangun menggunakan:

- **AdonisJS 6** (Node.js Framework)
- **Bootstrap 5** (untuk tampilan UI)
  
## 📦 Fitur Utama

- Autentikasi (Login & Register)
- CRUD Data:
  - Produk
  - Kategori
  - Supplier
- Filter produk berdasarkan:
  - Kategori
  - Supplier
- Laporan:
  - Total nilai penjualan harian
  - Stok tersisa
- Validasi stok: penjualan tidak bisa dilakukan jika stok habis

---

## 🧱 Struktur Tabel Database

| Tabel         | Kolom                                                                 |
|---------------|------------------------------------------------------------------------|
| `produk`      | id, nama_produk, harga, stok, kategori_id, supplier_id                |
| `kategori`    | id, nama_kategori                                                      |
| `supplier`    | id, nama_supplier, alamat, telepon                                     |
| `penjualan`   | id, produk_id, jumlah, tanggal                                         |
| `stok_log`    | id, produk_id, jenis, jumlah, tanggal                                  |

### 🔗 Relasi Antar Tabel
- `produk` → belongsTo `kategori`, `supplier`
- `penjualan` → belongsTo `produk`
- `stok_log` → belongsTo `produk`

---

## 🚀 Cara Menjalankan Project

1. **Clone repository**
   ```bash
   git clone https://github.com/username/toko-revalinaa-app.git
   cd toko-revalinaa-app
