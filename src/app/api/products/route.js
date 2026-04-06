// app/api/products/route.js
import { NextResponse } from 'next/server';
import { FetchData } from '@/services/useServerFetch';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const limit = searchParams.get('limit') || '12';
    
    const products = await FetchData(`product?page=${page}&limit=${limit}`);
    
    return NextResponse.json({
      success: true,
      data: products
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}