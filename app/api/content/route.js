import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

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

    // In development: always use local JSON (clean source of truth)
    // This ensures clean data is used before being pushed to Supabase via Save
    if (process.env.NODE_ENV === 'development' && fs.existsSync(localPath)) {
      const fileContent = fs.readFileSync(localPath, 'utf8');
      console.log(`📁 DEV: Content loaded from local: ${fileName}`);
      return NextResponse.json(JSON.parse(fileContent));
    }

    // Production (Vercel): read from Supabase
    const supabase = await getSupabaseClient();
    if (supabase) {
      const { data, error } = await supabase.storage.from('public-content').download(storagePath);
      if (!error && data) {
        const text = await data.text();
        console.log(`📥 Content loaded from Supabase: ${fileName}`);
        return NextResponse.json(JSON.parse(text));
      }
      console.warn(`⚠️ Supabase read failed for ${fileName}:`, error?.message);
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
