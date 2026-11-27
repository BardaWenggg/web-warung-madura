# Sistem Kasir & Manajemen Stok CLI - Warung Madura 24 Jam

Proyek UAS Mata Kuliah Dasar Pemrograman menggunakan **TypeScript** berbasis *Command Line Interface* (CLI) untuk membantu digitalisasi pencatatan transaksi dan pemantauan stok harian pada warung kelontong.

## Anggota Kelompok
1. **Toriqul Irfani Barda** (`263140707111136`) – Perancangan struktur data barang, fitur pencarian, fitur *restock*, dan laporan omzet *shift*.
2. **Dheandra Natha Adyantara** (`263140707111137`) – Implementasi logika transaksi kasir, validasi pembayaran, cetak struk, dan pengujian program.

*(Catatan: Pastikan NIM anggota kedua sudah sesuai jika berbeda).*

## Profil Mitra
- **Nama Toko:** Toko Firzan
- **Alamat:** Jl. Semanggi Timur No. 01, Malang
- **Jam Operasional:** 24 Jam (2 Shift)
- **Permasalahan Mitra:** Pencatatan transaksi dan pengecekan sisa stok masih dilakukan secara manual sehingga rawan terjadi selisih hitung kembalian dan keterlambatan *restock* barang kebutuhan pokok.

## Fitur Utama
- **Daftar & Monitoring Stok Barang:** Menampilkan seluruh katalog produk, harga, sisa stok, serta peringatan otomatis (`STOK MENIPIS`) jika jumlah stok $\le 5$.
- **Pencarian Cepat Barang:** Mencari harga dan ketersediaan barang berdasarkan kode maupun kata kunci nama barang.
- **Transaksi Kasir & Cetak Struk:** Menghitung total belanja secara otomatis, memvalidasi uang tunai pembayaran, menghitung kembalian, memotong stok barang, dan mencetak rincian struk transaksi.
- **Manajemen Restock & Laporan Shift:** Menambah jumlah stok barang masuk dan merekap total transaksi beserta omzet pemasukan pada *shift* berjalan.

## Struktur Proyek
```text
├── index.ts          # Kode sumber utama aplikasi kasir (TypeScript)
├── tsconfig.json     # Konfigurasi compiler TypeScript
├── package.json      # Informasi proyek dan dependensi (prompt-sync)
├── .gitignore        # Daftar file/folder yang diabaikan Git (node_modules, index.js)
└── README.md         # Dokumentasi proyek dan panduan penggunaan


## Cara Menjalankan Program
1. Instal dependensi:
   ```bash
   npm install
2. Kompilasi kode TypeScript (index.ts) ke JavaScript (index.js):
   ```bash 
   npx tsc
3. Jalankan aplikasi kasir di terminal:
   ```bash
   node index.js
4. Pilih menu angka 0–5 sesuai kebutuhan (1 Cek Stok, 2 Cari Barang, 3 Transaksi Kasir, 4 Restock Barang, 5 Laporan Shift, 0 Keluar).
