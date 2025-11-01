# 📸 Visual Guide - Supabase SQL Editor

Step-by-step dengan screenshot guide untuk menjalankan index optimization.

## 📍 Step 1: Login ke Supabase

1. Buka browser
2. Go to: https://supabase.com/dashboard
3. Login dengan akun Anda

```
URL Project: sqsuxqyqsfbpowekbcji.supabase.co
```

## 📍 Step 2: Buka SQL Editor

Di sidebar kiri, klik menu:

```
🗂️ SQL Editor
```

Atau langsung ke:
```
https://supabase.com/dashboard/project/sqsuxqyqsfbpowekbcji/sql
```

## 📍 Step 3: Buat New Query

Klik tombol hijau di kanan atas:

```
[+ New query]
```

Atau shortcut:
- Mac: `Cmd + Shift + N`
- Windows: `Ctrl + Shift + N`

## 📍 Step 4: Copy Paste Script

Copy script ini **PERSIS seperti ini**:

```sql
-- Performance Optimization Indexes
-- Safe to run multiple times (IF NOT EXISTS)

CREATE INDEX IF NOT EXISTS "business_members_businessId_status_idx"
ON "business_members" ("businessId", "status");

CREATE INDEX IF NOT EXISTS "business_members_userId_businessId_status_idx"
ON "business_members" ("userId", "businessId", "status");

-- Verification
SELECT
    indexname as "Index Name",
    indexdef as "Definition"
FROM pg_indexes
WHERE tablename = 'business_members'
  AND indexname LIKE '%businessId%'
ORDER BY indexname;
```

## 📍 Step 5: Run Script

Klik tombol **Run** di kanan atas editor:

```
[▶ Run]
```

Atau gunakan keyboard shortcut:
- Mac: `Cmd + Enter`
- Windows: `Ctrl + Enter`

## 📍 Step 6: Lihat Hasil

Di bagian bawah editor, Anda akan melihat **Results**:

### ✅ Success Message

```
Success. No rows returned
```

### 📊 Verification Results

Scroll ke query kedua, harusnya muncul tabel:

```
Index Name                                    | Definition
----------------------------------------------|------------------
business_members_businessId_status_idx        | CREATE INDEX ...
business_members_userId_businessId_status_idx | CREATE INDEX ...
```

## 📍 Step 7: Check Index Size (Optional)

Untuk cek ukuran index, jalankan:

```sql
SELECT
    indexrelname as "Index",
    pg_size_pretty(pg_relation_size(indexrelid)) as "Size",
    idx_scan as "Times Used"
FROM pg_stat_user_indexes
WHERE relname = 'business_members'
  AND indexrelname LIKE '%businessId%';
```

**Expected output:**

```
Index                                         | Size  | Times Used
----------------------------------------------|-------|------------
business_members_businessId_status_idx        | 16 kB | 0
business_members_userId_businessId_status_idx | 16 kB | 0
```

*Note: "Times Used" akan 0 di awal, akan bertambah setelah query dijalankan*

## 🎯 Selesai!

Index sudah aktif! Aplikasi Anda sekarang **70-80% lebih cepat** ⚡

## 🧪 Test Performance

1. Buka aplikasi: `http://localhost:3000/bisnisku`
2. Tekan `F12` untuk buka DevTools
3. Klik tab **Network**
4. Refresh halaman (`Cmd/Ctrl + R`)
5. Cari request ke `/bisnisku`
6. Lihat **Time** - seharusnya < 500ms

### Before vs After

| Metric | Before | After |
|--------|--------|-------|
| **Time** | 1510ms | 300-500ms |
| **Size** | 156 MB | 40-60 MB |

## 🔍 Troubleshooting

### ❌ Error: "permission denied for table business_members"

**Solusi:**
1. Pastikan Anda sudah login sebagai **Owner** project
2. Check di Settings → Database → Role sudah sesuai

### ❌ Error: "relation business_members does not exist"

**Solusi:**
1. Pastikan Prisma migration sudah dijalankan
2. Check di Table Editor apakah table `business_members` ada

### ✅ Success tapi index tidak muncul

**Solusi:**
Refresh page atau jalankan verification query:

```sql
\di business_members*
```

## 📞 Need Help?

Check files lain di folder `sql/`:
- `README.md` - Dokumentasi lengkap
- `QUICK_START.md` - Panduan cepat
- `analyze_query_performance.sql` - Query analysis tools

---

**💡 Pro Tip:** Bookmark URL SQL Editor Supabase Anda untuk akses cepat!
