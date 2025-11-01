-- Rollback Performance Indexes
-- Run this if you need to remove the performance indexes
-- Created: 2025-11-01

-- ================================================================
-- DROP PERFORMANCE INDEXES
-- ================================================================

-- Drop composite index for filtering active members
DROP INDEX IF EXISTS "business_members_businessId_status_idx";

-- Drop composite index for check-member optimization
DROP INDEX IF EXISTS "business_members_userId_businessId_status_idx";

-- ================================================================
-- VERIFICATION
-- ================================================================

-- Verify indexes were removed
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'business_members'
ORDER BY indexname;

-- ================================================================
-- NOTES
-- ================================================================
-- After running this rollback:
-- 1. Query performance will decrease by ~100-200ms
-- 2. Original indexes on individual columns remain intact
-- 3. You can re-apply indexes by running add_performance_indexes.sql
-- ================================================================
