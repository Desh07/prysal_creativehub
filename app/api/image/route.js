import fs from 'fs';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const filePath = searchParams.get('path');
  
  if (!filePath) {
    return new NextResponse('Path parameter is required', { status: 400 });
  }

  try {
    const file = fs.readFileSync(filePath);
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    return new NextResponse('Image not found', { status: 404 });
  }
}
