import { auth } from '@/auth';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from './DashboardNav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const startTime = performance.now();
  let authTime, dbTime;

  console.log('[PERF] === Server Component: Dashboard Layout START ===');

  // Auth (Server-side, no API route)
  const authStart = performance.now();
  const session = await auth();
  authTime = performance.now() - authStart;
  console.log(`[PERF] Auth time: ${authTime.toFixed(2)}ms`);

  let businessData: { slug: string; name: string } | null = null;

  if (session?.user?.id) {
    // Direct Supabase query (no API route!)
    const dbStart = performance.now();
    const supabase = await createClient();

    const { data: member, error } = await supabase
      .from('business_members')
      .select(`
        role,
        business:businesses(id, slug, name)
      `)
      .eq('userId', session.user.id)
      .eq('status', 'active')
      .order('createdAt', { ascending: true })
      .limit(1)
      .single();

    dbTime = performance.now() - dbStart;
    console.log(`[PERF] Supabase eager loading query time: ${dbTime.toFixed(2)}ms`);

    if (!error && member && member.business) {
      businessData = {
        slug: member.business.slug,
        name: member.business.name,
      };
    }
  }

  const totalTime = performance.now() - startTime;
  console.log(`[PERF] === Dashboard Layout TOTAL TIME: ${totalTime.toFixed(2)}ms ===`);
  console.log(`[PERF] Breakdown - Auth: ${authTime.toFixed(2)}ms, DB: ${dbTime?.toFixed(2) || 0}ms, Other: ${(totalTime - authTime - (dbTime || 0)).toFixed(2)}ms`);
  console.log(`[PERF] 🎯 NO API ROUTE OVERHEAD! Direct SSR query`);

  return (
    <div className="relative min-h-screen">
      <DashboardNav businessData={businessData} />

      {/* Content dengan padding top untuk header */}
      <div className="pt-16 pb-32 lg:pb-16">
        {children}
      </div>
    </div>
  );
}
