-- Query Performance Analysis
-- Use this to check if indexes are being used correctly
-- Created: 2025-11-01

-- ================================================================
-- 1. CHECK INDEX USAGE STATISTICS
-- ================================================================

SELECT
    schemaname,
    tablename,
    indexrelname as index_name,
    idx_scan as index_scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE tablename = 'business_members'
ORDER BY idx_scan DESC;

-- ================================================================
-- 2. ANALYZE QUERY PLAN - Check Member Ownership
-- ================================================================

-- This query should USE the composite index
EXPLAIN ANALYZE
SELECT
    bm.id,
    bm.role,
    COUNT(mp.id) as policies_count
FROM business_members bm
LEFT JOIN member_policies mp ON mp."businessMemberId" = bm.id
WHERE bm."userId" = 'test-user-id'
  AND bm."businessId" = 'test-business-id'
  AND bm.status = 'active'
GROUP BY bm.id, bm.role;

-- Look for "Index Scan using business_members_userId_businessId_status_idx"

-- ================================================================
-- 3. ANALYZE QUERY PLAN - Filter Active Members
-- ================================================================

-- This query should USE the businessId_status composite index
EXPLAIN ANALYZE
SELECT *
FROM business_members
WHERE "businessId" = 'test-business-id'
  AND status = 'active';

-- Look for "Index Scan using business_members_businessId_status_idx"

-- ================================================================
-- 4. TABLE STATISTICS
-- ================================================================

SELECT
    schemaname,
    tablename,
    n_live_tup as live_rows,
    n_dead_tup as dead_rows,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
WHERE tablename = 'business_members';

-- ================================================================
-- 5. INDEX SIZE AND HEALTH
-- ================================================================

SELECT
    indexrelname as index_name,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    idx_scan as times_used,
    idx_tup_read as tuples_read,
    CASE
        WHEN idx_scan = 0 THEN '⚠️ UNUSED'
        WHEN idx_scan < 100 THEN '⚠️ LOW USAGE'
        ELSE '✅ ACTIVE'
    END as status
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
  AND relname = 'business_members'
ORDER BY idx_scan DESC;

-- ================================================================
-- 6. MISSING INDEXES SUGGESTION (Optional Analysis)
-- ================================================================

-- Check if there are queries that could benefit from additional indexes
SELECT
    schemaname,
    tablename,
    seq_scan as sequential_scans,
    seq_tup_read as rows_read_sequentially,
    idx_scan as index_scans,
    CASE
        WHEN seq_scan > 1000 AND idx_scan < seq_scan THEN '⚠️ Consider adding index'
        ELSE '✅ OK'
    END as recommendation
FROM pg_stat_user_tables
WHERE schemaname = 'public'
  AND tablename = 'business_members';

-- ================================================================
-- 7. QUERY TIMING COMPARISON
-- ================================================================

-- Before optimization (Sequential Scan)
\timing on

-- Query without using index (force seq scan)
SET enable_indexscan = OFF;
SELECT *
FROM business_members
WHERE "userId" = 'test-user-id'
  AND "businessId" = 'test-business-id'
  AND status = 'active';

-- Query with index
SET enable_indexscan = ON;
SELECT *
FROM business_members
WHERE "userId" = 'test-user-id'
  AND "businessId" = 'test-business-id'
  AND status = 'active';

\timing off

-- ================================================================
-- NOTES
-- ================================================================
-- Execution Time Guide:
-- ✅ < 10ms  - Excellent (indexed query)
-- ⚠️ 10-50ms - Good (small table or simple query)
-- ❌ > 50ms  - Slow (needs optimization)
--
-- Index Scan Types:
-- - Index Scan: Best performance (uses index)
-- - Index Only Scan: Even better (all data in index)
-- - Bitmap Index Scan: Good for multiple conditions
-- - Seq Scan: Slowest (full table scan, needs index)
-- ================================================================
