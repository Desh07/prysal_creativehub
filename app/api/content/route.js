import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

function getFileName(request) {
  const url = new URL(request.url);
  const site = url.searchParams.get('site');
  if (site === 'print') return 'print.json';
  return 'design.json';
}

async function getSupabaseClient() {
  const { createClient } = require('@supabase/supabase-js');
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!supabaseUrl || !supabaseKey.startsWith('eyJ')) return null;
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request) {
  try {
    const fileName = getFileName(request);
    const storagePath = `data/${fileName}`;
    const localPath = path.join(process.cwd(), 'data', fileName);

    const noCacheHeaders = {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
    };

    // In development: always use local JSON (clean source of truth)
    // This ensures clean data is used before being pushed to Supabase via Save
    if (process.env.NODE_ENV === 'development' && fs.existsSync(localPath)) {
      const fileContent = fs.readFileSync(localPath, 'utf8');
      console.log(`📁 DEV: Content loaded from local: ${fileName}`);
      return NextResponse.json(JSON.parse(fileContent), { headers: noCacheHeaders });
    }

    // Production (Vercel): read from Supabase
    const supabase = await getSupabaseClient();
    if (supabase) {
      const { data: { publicUrl } } = supabase.storage.from('public-content').getPublicUrl(storagePath);
      // Fetch the public URL with a timestamp to completely bypass Supabase CDN caching
      const res = await fetch(`${publicUrl}?t=${Date.now()}`, { cache: 'no-store' });

      if (res.ok) {
        const json = await res.json();
        console.log(`📥 Content loaded from Supabase Public URL: ${fileName}`);
        return NextResponse.json(json, { headers: noCacheHeaders });
      }
      console.warn(`⚠️ Supabase read failed for ${fileName}:`, res.statusText);
    }

    return NextResponse.json({ error: 'Data not found' }, { status: 404 });
  } catch (error) {
    console.error('Content GET error:', error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const fileName = getFileName(request);
    const storagePath = `data/${fileName}`;
    const jsonString = JSON.stringify(body, null, 2);

    // Only save locally in development (Vercel has a read-only filesystem)
    if (process.env.NODE_ENV === 'development') {
      const localPath = path.join(process.cwd(), 'data', fileName);
      try {
        fs.writeFileSync(localPath, jsonString, 'utf8');
        console.log(`💾 Local file updated: ${fileName}`);
      } catch (err) {
        console.warn(`⚠️ Could not save locally: ${err.message}`);
      }
    }

    // Push to Supabase
    const supabase = await getSupabaseClient();
    if (supabase) {
      const { error } = await supabase.storage.from('public-content').upload(storagePath, jsonString, {
        contentType: 'application/json',
        cacheControl: '0',
        upsert: true
      });
      if (error) {
        console.error('❌ Supabase write failed:', error.message);
      } else {
        console.log(`☁️ Supabase updated: ${fileName}`);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Content POST error:', error);
    return NextResponse.json({ error: 'Failed to save data' }, { status: 500 });
  }
}
