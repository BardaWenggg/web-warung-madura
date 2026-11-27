import promptSync from 'prompt-sync';

const prompt = promptSync({ sigint: true });

// 1. Cetakan Tipe Data (Interface)
interface Barang {
  kode: string;
  nama: string;
  harga: number;
  stok: number;
}

interface ItemBelanja {
  barang: Barang;
  jumlah: number;
  subtotal: number;
}

interface Transaksi {
  id: string;
  waktu: string;
  items: ItemBelanja[];
  totalBayar: number;
  uangDiterima: number;
  kembalian: number;
}

// 2. Data Barang Awal Toko Madura (Array of Objects)
const daftarBarang: Barang[] = [
  { kode: 'B01', nama: 'Beras Ramos 5kg', harga: 72000, stok: 10 },
  { kode: 'B02', nama: 'Minyak Goreng Kita 1L', harga: 17500, stok: 4 },
  { kode: 'B03', nama: 'Mie Instan Goreng', harga: 3500, stok: 40 },
  { kode: 'B04', nama: 'Telur Ayam 1kg', harga: 28000, stok: 8 },
  { kode: 'B05', nama: 'Gula Pasir 1kg', harga: 17000, stok: 3 },
  { kode: 'B06', nama: 'Kopi Kapal Api Sachet', harga: 2000, stok: 50 },
  { kode: 'B07', nama: 'Gas LPG 3kg', harga: 21000, stok: 6 },
];

const riwayatTransaksi: Transaksi[] = [];

// Fungsi 1: Tampilkan Daftar & Stok Barang
function tampilkanDaftarBarang(data: Barang[]): void {
  console.log('\n=== DAFTAR BARANG TOKO MADURA ===');
  console.log('Kode | Nama Barang             | Harga      | Stok | Status');
  console.log('------------------------------------------------------------------');
  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const status = item.stok <= 5 ? '⚠️ STOK MENIPIS' : 'Aman';
    console.log(
      `${item.kode.padEnd(4)} | ${item.nama.padEnd(23)} | Rp${item.harga
        .toLocaleString('id-ID')
        .padEnd(8)} | ${String(item.stok).padEnd(4)} | ${status}`
    );
  }
}

// Fungsi 2: Cari Barang Berdasarkan Kode
function cariBarangByKode(data: Barang[], kodeInput: string): Barang | undefined {
  const target = kodeInput.trim().toUpperCase();
  for (const item of data) {
    if (item.kode === target) {
      return item;
    }
  }
  return undefined;
}

// Fungsi 3: Cari Barang Berdasarkan Nama / Kode
function cariBarangInteraktif(data: Barang[], kataKunci: string): void {
  const keyword = kataKunci.trim().toLowerCase();
  const hasil = data.filter(
    (b) => b.nama.toLowerCase().includes(keyword) || b.kode.toLowerCase().includes(keyword)
  );

  console.log(`\n=== HASIL PENCARIAN: "${kataKunci}" ===`);
  if (hasil.length === 0) {
    console.log('❌ Barang tidak ditemukan.');
    return;
  }

  hasil.forEach((b) => {
    console.log(`- [${b.kode}] ${b.nama} | Harga: Rp${b.harga.toLocaleString('id-ID')} | Stok: ${b.stok}`);
  });
}

// Fungsi 4: Hitung Total Belanja
function hitungTotalBelanja(keranjang: ItemBelanja[]): number {
  let total = 0;
  for (const item of keranjang) {
    total += item.subtotal;
  }
  return total;
}

// Fungsi 5: Transaksi Kasir & Cetak Struk
function prosesTransaksi(dataBarang: Barang[], riwayat: Transaksi[]): void {
  const keranjang: ItemBelanja[] = [];
  let tambahLagi = true;

  console.log('\n=== KASIR TOKO MADURA ===');
  while (tambahLagi) {
    const kode = prompt('Masukkan Kode Barang (ketik "selesai" untuk bayar): ');
    if (kode.trim().toLowerCase() === 'selesai') {
      break;
    }

    const barangDitemukan = cariBarangByKode(dataBarang, kode);
    if (!barangDitemukan) {
      console.log('❌ Kode barang tidak ditemukan! Silakan cek daftar barang.');
      continue;
    }

    if (barangDitemukan.stok <= 0) {
      console.log(`❌ Maaf, stok ${barangDitemukan.nama} sedang habis!`);
      continue;
    }

    const qtyInput = Number(prompt(`Jumlah beli (${barangDitemukan.nama} - Stok: ${barangDitemukan.stok}): `));
    if (isNaN(qtyInput) || qtyInput <= 0 || !Number.isInteger(qtyInput)) {
      console.log('❌ Jumlah beli harus berupa angka bulat positif!');
      continue;
    }

    const itemDiKeranjang = keranjang.find((k) => k.barang.kode === barangDitemukan.kode);
    const totalQtyDiminta = (itemDiKeranjang ? itemDiKeranjang.jumlah : 0) + qtyInput;

    if (totalQtyDiminta > barangDitemukan.stok) {
      console.log(`❌ Stok tidak mencukupi! Sisa stok tersedia: ${barangDitemukan.stok}`);
      continue;
    }

    if (itemDiKeranjang) {
      itemDiKeranjang.jumlah += qtyInput;
      itemDiKeranjang.subtotal = itemDiKeranjang.jumlah * barangDitemukan.harga;
    } else {
      keranjang.push({
        barang: barangDitemukan,
        jumlah: qtyInput,
        subtotal: qtyInput * barangDitemukan.harga,
      });
    }

    console.log(`✅ Ditambahkan: ${barangDitemukan.nama} x${qtyInput}`);
    const lanjut = prompt('Tambah barang lain? (y/n): ');
    if (lanjut.trim().toLowerCase() !== 'y') {
      tambahLagi = false;
    }
  }

  if (keranjang.length === 0) {
    console.log('⚠️ Transaksi dibatalkan (keranjang kosong).');
    return;
  }

  const totalBayar = hitungTotalBelanja(keranjang);
  console.log(`\nTotal Belanja: Rp${totalBayar.toLocaleString('id-ID')}`);

  let uangDiterima = 0;
  while (true) {
    uangDiterima = Number(prompt('Masukkan Uang Pembayaran (Rp): '));
    if (isNaN(uangDiterima) || uangDiterima < totalBayar) {
      console.log(`❌ Uang tidak valid atau kurang! Minimal bayar Rp${totalBayar.toLocaleString('id-ID')}`);
    } else {
      break;
    }
  }

  const kembalian = uangDiterima - totalBayar;

  for (const item of keranjang) {
    item.barang.stok -= item.jumlah;
  }

  const transaksiBaru: Transaksi = {
    id: `TRX-${riwayat.length + 1}`,
    waktu: new Date().toLocaleTimeString('id-ID'),
    items: keranjang,
    totalBayar,
    uangDiterima,
    kembalian,
  };
  riwayat.push(transaksiBaru);

  console.log('\n=========== STRUK PEMBELIAN ===========');
  console.log(`ID Transaksi : ${transaksiBaru.id} | Jam: ${transaksiBaru.waktu}`);
  keranjang.forEach((item) => {
    console.log(
      `${item.barang.nama} (${item.jumlah} x Rp${item.barang.harga.toLocaleString('id-ID')}) = Rp${item.subtotal.toLocaleString('id-ID')}`
    );
  });
  console.log('---------------------------------------');
  console.log(`TOTAL     : Rp${totalBayar.toLocaleString('id-ID')}`);
  console.log(`TUNAI     : Rp${uangDiterima.toLocaleString('id-ID')}`);
  console.log(`KEMBALIAN : Rp${kembalian.toLocaleString('id-ID')}`);
  console.log('=======================================\n');
}

// Fungsi 6: Restock Barang
function tambahStokBarang(dataBarang: Barang[]): void {
  console.log('\n=== RESTOCK BARANG ===');
  const kode = prompt('Masukkan Kode Barang yang akan ditambah stoknya: ');
  const barang = cariBarangByKode(dataBarang, kode);

  if (!barang) {
    console.log('❌ Kode barang tidak ditemukan.');
    return;
  }

  const tambahan = Number(prompt(`Stok saat ini (${barang.nama}): ${barang.stok}. Tambah berapa? `));
  if (isNaN(tambahan) || tambahan <= 0 || !Number.isInteger(tambahan)) {
    console.log('❌ Jumlah tambahan stok harus angka bulat positif.');
    return;
  }

  barang.stok += tambahan;
  console.log(`✅ Stok ${barang.nama} berhasil diperbarui menjadi ${barang.stok}.`);
}

// Fungsi 7: Laporan Omzet Shift
function tampilkanLaporanShift(riwayat: Transaksi[]): void {
  console.log('\n=== LAPORAN OMZET SHIFT ===');
  if (riwayat.length === 0) {
    console.log('Belum ada transaksi pada shift ini.');
    return;
  }

  let totalOmzet = 0;
  riwayat.forEach((trx) => {
    console.log(`- [${trx.id}] Pukul ${trx.waktu} | Total: Rp${trx.totalBayar.toLocaleString('id-ID')}`);
    totalOmzet += trx.totalBayar;
  });
  console.log('---------------------------------------');
  console.log(`Jumlah Transaksi : ${riwayat.length}`);
  console.log(`Total Pemasukan  : Rp${totalOmzet.toLocaleString('id-ID')}`);
}

// Menu Utama
function main(): void {
  let berjalan = true;

  while (berjalan) {
    console.log('\n=========================================');
    console.log('  SISTEM KASIR & STOK TOKO MADURA 24 JAM ');
    console.log('=========================================');
    console.log('1. Lihat Daftar & Stok Barang');
    console.log('2. Cari Harga / Kode Barang');
    console.log('3. Transaksi Kasir');
    console.log('4. Tambah Stok Barang (Restock)');
    console.log('5. Laporan Omzet Shift');
    console.log('0. Keluar Program');

    const pilihan = prompt('Pilih menu (0-5): ');

    switch (pilihan.trim()) {
      case '1':
        tampilkanDaftarBarang(daftarBarang);
        break;
      case '2':
        const kataKunci = prompt('Masukkan nama atau kode barang: ');
        cariBarangInteraktif(daftarBarang, kataKunci);
        break;
      case '3':
        prosesTransaksi(daftarBarang, riwayatTransaksi);
        break;
      case '4':
        tambahStokBarang(daftarBarang);
        break;
      case '5':
        tampilkanLaporanShift(riwayatTransaksi);
        break;
      case '0':
        console.log('Terima kasih! Program selesai.');
        berjalan = false;
        break;
      default:
        console.log('❌ Pilihan menu tidak valid. Masukkan angka 0-5.');
    }
  }
}

main();
