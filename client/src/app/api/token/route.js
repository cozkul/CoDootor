import { NextResponse } from 'next/server';
import { getAccessToken } from '@auth0/nextjs-auth0/edge'; // Note the /edge import

export async function GET() {
  const { accessToken } = await getAccessToken();
  return NextResponse.json({ token: accessToken });
}

export const runtime = 'edge';