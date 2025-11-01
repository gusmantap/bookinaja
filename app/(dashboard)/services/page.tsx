import { auth } from '@/auth';
import { createClient } from '@/lib/supabase/server';
import ServicesClient from './ServicesClient';

type Service = {
  id: string;
  name: string;
  duration: string;
  price: number;
  isActive: boolean;
};

export default async function ServicesPage() {
  const startTime = performance.now();
  let authTime, dbTime, transformTime;

  console.log('[PERF] === Server Component: Services Page START ===');

  // Auth (Server-side, no API route)
  const authStart = performance.now();
  const session = await auth();
  authTime = performance.now() - authStart;
  console.log(`[PERF] Auth time: ${authTime.toFixed(2)}ms`);

  if (!session?.user?.id) {
    return (
      <div className="bg-zinc-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-600">Tidak ada akses</p>
        </div>
      </div>
    );
  }

  // Direct Supabase query (no API route!)
  const dbStart = performance.now();
  const supabase = await createClient();

  // Laravel-style eager loading: Query services dengan filter business_members
  // Mirip: Service::with('business')->whereHas('business.members', ...)
  const { data: services, error: servicesError } = await supabase
    .from('services')
    .select(`
      id,
      name,
      duration,
      price,
      isActive,
      createdAt,
      business:businesses!inner(
        business_members!inner(userId, status)
      )
    `)
    .eq('business.business_members.userId', session.user.id)
    .eq('business.business_members.status', 'active')
    .order('createdAt', { ascending: true });

  dbTime = performance.now() - dbStart;
  console.log(`[PERF] Supabase eager loading query time: ${dbTime.toFixed(2)}ms`);

  if (servicesError) {
    console.error('[PERF] Error fetching services:', servicesError);
  }

  // Transform to match frontend expectation
  const transformStart = performance.now();
  const transformedServices: Service[] = (services || []).map((service: any) => ({
    id: service.id,
    name: service.name,
    duration: service.duration,
    price: service.price,
    isActive: service.isActive,
  }));
  transformTime = performance.now() - transformStart;
  console.log(`[PERF] Transform time: ${transformTime.toFixed(2)}ms`);

  const totalTime = performance.now() - startTime;
  console.log(`[PERF] === Server Component TOTAL TIME: ${totalTime.toFixed(2)}ms ===`);
  console.log(`[PERF] Breakdown - Auth: ${authTime.toFixed(2)}ms, DB: ${dbTime.toFixed(2)}ms, Transform: ${transformTime.toFixed(2)}ms, Other: ${(totalTime - authTime - dbTime - transformTime).toFixed(2)}ms`);
  console.log(`[PERF] 🎯 NO API ROUTE OVERHEAD! Direct SSR query`);

  return <ServicesClient initialServices={transformedServices} />;
}
