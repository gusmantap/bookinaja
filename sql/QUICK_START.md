# 🚀 Quick Start - Database Performance Optimization

Panduan cepat untuk menjalankan index di Supabase.

## ⚡ 3 Langkah Cepat

### 1️⃣ Buka Supabase SQL Editor

```
https://supabase.com/dashboard/project/sqsuxqyqsfbpowekbcji/sql
```

### 2️⃣ Copy Script Ini

```sql
-- Performance Indexes for business_members table
CREATE INDEX IF NOT EXISTS "business_members_businessId_status_idx"
ON "business_members" ("businessId", "status");

CREATE INDEX IF NOT EXISTS "business_members_userId_businessId_status_idx"
ON "business_members" ("userId", "businessId", "status");
```

### 3️⃣ Paste & Run

1. Klik **New Query**
2. Paste script di atas
3. Klik **Run** (atau Cmd/Ctrl + Enter)
4. ✅ Done!

## ✅ Verifikasi

Jalankan query ini untuk cek index berhasil dibuat:

```sql
SELECT indexname FROM pg_indexes
WHERE tablename = 'business_members'
AND indexname LIKE '%businessId%';
```

**Expected output:**
```
business_members_businessId_status_idx
business_members_userId_businessId_status_idx
```

## 📊 Hasil yang Diharapkan

| Metrik | Before | After |
|--------|--------|-------|
| Page Load | 1.51s | 300-500ms |
| Memory | 156 MB | 40-60 MB |

## 🧪 Test

1. Buka: `http://localhost:3000/bisnisku`
2. F12 → Network tab
3. Check timing untuk route `/[slug]`
4. Seharusnya **< 500ms** ✅

## ❌ Rollback (jika perlu)

```sql
DROP INDEX IF EXISTS "business_members_businessId_status_idx";
DROP INDEX IF EXISTS "business_members_userId_businessId_status_idx";
```

## 📚 Dokumentasi Lengkap

Baca `README.md` untuk detail lengkap tentang:
- Index yang dibuat
- Query optimization
- Troubleshooting
- Performance metrics

---

**💡 Tip:** Index creation tidak akan mengganggu aplikasi yang sedang running. Safe untuk dijalankan kapan saja!
