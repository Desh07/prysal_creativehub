import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    const validUsername = process.env.ADMIN_USERNAME;
    const validPassword = process.env.ADMIN_PASSWORD;
    const token = process.env.ADMIN_TOKEN;

    if (username === validUsername && password === validPassword) {
      // Create the response object so we can set a cookie on it
      const response = NextResponse.json({ success: true });
      
      // Set an HttpOnly cookie with the secure token
      response.cookies.set({
        name: 'auth_token',
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
        // Removed maxAge to create a strict Session Cookie (expires on browser close)
      });

      return response;
    }

    return NextResponse.json(
      { success: false, error: 'Invalid username or password' }, 
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Server error' }, 
      { status: 500 }
    );
  }
}
