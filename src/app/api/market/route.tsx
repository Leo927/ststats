// use typescript
// store data for
// use varchar instead of TEXT
import { sql } from '@vercel/postgres';
import { NextResponse, NextRequest } from 'next/server';
import { SMARTY_TITAN_URL } from '@/configs';


export async function GET(request: NextRequest) {
    const endPoint = '/api/item/last/all';
    const url = SMARTY_TITAN_URL + endPoint;
    try {
        // do nothing if the most recent data is less than 5 minutes old
        // request from url and store in db
        const response = await fetch(url);
        const data = (await response.json())['data'];

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
