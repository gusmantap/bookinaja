# Form Booking Inline Settings (Owner Only)

Catatan fitur untuk ikon "setting" di setiap field form booking. Hanya pemilik bisnis yang melihat ikon ini; klik ikon membuka popup konfigurasi perilaku bisnis (bukan teknis input).

## Strategi Umum
- Satu ikon gear kecil di sisi label setiap field.
- Popup menampilkan pengaturan yang relevan dengan kebutuhan operasional.
- Nilai konfigurasi disimpan per bisnis dan memengaruhi perilaku form publik.

## Pengaturan Per Field

### 1. Nama Lengkap
- `visible`: ON/OFF (hide field jika booking cukup pakai nama panggilan dari catatan).
- `required`: toggled (wajib atau opsional untuk pelanggan lama).
- `internalNote`: catatan khusus owner yang terlampir ke booking (contoh: “ingatkan bawa kartu member”).

### 2. Pilih Layanan
- `visible`: ON/OFF (use case spesial: owner lakukan assignment manual).
- `availableOnline`: pilih layanan mana yang bisa dibooking online.
- `displayPriority`: urutan prioritas (promo, favorit, default).
- `promoBadge`: opsi menampilkan badge promo/happy hour.

### 3. Nomor WhatsApp
- `visible`: ON/OFF (jika owner ingin pakai channel lain).
- `autoConfirmation`: kirim pesan WA otomatis ketika booking diterima.
- `reminderH-1`: toggle pengingat otomatis H-1.
- `customerTag`: label pelanggan (VIP, member baru, dsb.) untuk dashboard.

### 4. Pilih Tanggal
- `visible`: ON/OFF (untuk campaign “walk-in only” atau booking langsung).
- `minBookingLead`: jarak minimal dari hari ini (hari).
- `maxBookingLead`: jarak maksimal (hari).
- `blackoutDates`: daftar tanggal libur/event.
- `memberOnlyDates`: tanggal khusus hanya untuk member (opsional).

### 5. Pilih Waktu
- `visible`: ON/OFF (jika tanggal dipakai tapi slot dipilih manual oleh admin).
- `slotInterval`: interval slot (30 menit / 60 menit).
- `slotCapacity`: maksimal booking per slot.
- `bufferMinutes`: jeda tambahan antar pelanggan.
- `premiumSlots`: daftar slot premium (hanya layanan tertentu / tarif beda).

### 6. Catatan (Opsional)
- `visible`: ON/OFF (hide jika owner tidak ingin catatan pelanggan).
- `requiredForServices`: pilih layanan yang wajib memberi catatan (mis. hair coloring).
- `noteTemplates`: daftar template catatan cepat (owner bisa pilih/edit).
- `maxLength`: batas karakter (untuk menjaga ringkas).

### 7. Metode Pembayaran
- `visible`: toggle master untuk menampilkan blok skema pembayaran.
- `enabledMethods`: onsite / transfer / e-wallet toggle.
- `minDepositPercent`: DP minimal per layanan/metode.
- `refundPolicyNote`: teks kebijakan refund/cancel per metode.

### 8. Upload Bukti Transfer
- `visible`: ON/OFF (mis. gunakan hanya saat DP transfer aktif).
- `requireProof`: kapan bukti wajib (selalu / jika DP >= X / optional).
- `notifyAdmin`: kirim notifikasi internal saat bukti masuk.
- `thanksMessage`: pesan khusus setelah bukti diterima.

## Pengaturan Global (opsional)
- `dailyBookingLimit`: batas total booking per hari.
- `autoCloseWhenFull`: tutup jadwal otomatis jika slot penuh.
- `manualApproval`: booking masuk sebagai draft hingga owner approve.

> TODO berikutnya:
> 1. Tentukan struktur data (mis. tabel `booking_field_settings`).
> 2. Rancang komponen ikon + popup reusable.
> 3. Implementasikan logic di form publik sesuai konfigurasi.
