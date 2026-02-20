import { NextRequest, NextResponse } from 'next/server';
import { AlAdhanResponse } from '@/lib/types';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const city = searchParams.get('city');
  const country = searchParams.get('country');

  let url = '';

  if (lat && lng) {
    url = `https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=1`;
  } else if (city && country) {
    url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=1`;
  } else {
    return NextResponse.json(
      { error: 'Missing latitude/longitude or city/country parameters' },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`AlAdhan API responded with status: ${res.status}`);
    }

    const data: AlAdhanResponse = await res.json();

    if (data.code !== 200) {
      throw new Error(data.status || 'Failed to fetch prayer times');
    }

    // We only need Fajr (Suhoor end) and Maghrib (Iftar)
    return NextResponse.json({
      fajr: data.data.timings.Fajr,
      maghrib: data.data.timings.Maghrib,
    });
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return NextResponse.json(
      { error: 'Failed to fetch prayer times.' },
      { status: 500 }
    );
  }
}
