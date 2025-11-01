import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { auth } from '@/auth';

export async function GET() {
  const startTime = performance.now();
  let authTime, dbTime;

  try {
    console.log('[PERF] === GET /api/user/business START ===');

    const authStart = performance.now();
    const session = await auth();
    authTime = performance.now() - authStart;
    console.log(`[PERF] Auth time: ${authTime.toFixed(2)}ms`);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // OPTIMIZED: Laravel-style eager loading dengan Supabase
    // Mirip: BusinessMember::with('business')->where(...)->first()
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

    if (error || !member || !member.business) {
      console.log(`[PERF] No business found or error:`, error);
      return NextResponse.json(
        { business: null, message: 'No business found' },
        { status: 200 }
      );
    }

    const totalTime = performance.now() - startTime;
    console.log(`[PERF] === TOTAL TIME: ${totalTime.toFixed(2)}ms ===`);
    console.log(`[PERF] Breakdown - Auth: ${authTime.toFixed(2)}ms, DB: ${dbTime.toFixed(2)}ms, Other: ${(totalTime - authTime - dbTime).toFixed(2)}ms`);

    return NextResponse.json(
      {
        business: member.business,
        role: member.role,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching user business:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
