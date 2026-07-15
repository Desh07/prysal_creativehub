import { NextResponse } from 'next/server';


export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get('file');
    const site = data.get('site') || 'general'; // Get site from formData
    const folder = data.get('folder') || 'misc'; // Get folder category from formData
    const oldUrl = data.get('oldUrl'); // Get old URL if replacing an image

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create unique filename to prevent overwriting
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = uniqueSuffix + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '');
    
    // Use site and folder specific structure!
    const storagePath = `uploads/${site}/${folder}/${filename}`;
    
    // Create client dynamically to ensure env vars are read at request time
    const { createClient } = require('@supabase/supabase-js');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    
    if (!supabaseKey.startsWith('eyJ')) {
      console.error('ERROR: Supabase key does not start with eyJ! Key is:', supabaseKey.substring(0, 15) + '...');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // GARBAGE COLLECTION: Delete the old image if replacing
    if (oldUrl) {
      try {
        const urlParts = oldUrl.split('/public-content/');
        if (urlParts.length === 2) {
          const oldStoragePath = urlParts[1];
          const { error: deleteError } = await supabase.storage.from('public-content').remove([oldStoragePath]);
          if (deleteError) {
            console.error('Failed to delete old image:', deleteError.message);
          } else {
            console.log('Successfully deleted old image:', oldStoragePath);
          }
        }
      } catch (err) {
        console.error('Error during garbage collection:', err);
      }
    }
    
    // Upload to Supabase Storage
    const { data: uploadData, error } = await supabase.storage
      .from('public-content')
      .upload(storagePath, buffer, {
        contentType: file.type,
        upsert: true   // Replace existing file if same name
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('public-content')
      .getPublicUrl(storagePath);

    const finalUrl = publicUrlData?.publicUrl || null;
    console.log('✅ Upload success. Public URL:', finalUrl);

    if (!finalUrl) {
      return NextResponse.json({ success: false, error: 'Could not generate public URL' }, { status: 500 });
    }

    return NextResponse.json({ success: true, url: finalUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}
