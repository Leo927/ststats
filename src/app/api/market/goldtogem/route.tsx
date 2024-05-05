// use typescript
// store data for
// use varchar instead of TEXT
import { sql } from '@vercel/postgres';
import { NextResponse, NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
    try {

        /**
         * in table Market, Group by uid and tag1, 
         * find row with tType='o' and get the gemsPrice
         * find row with tType='r' and get the goldPrice
         * calculate the  goldPrice/gemsPrice 
         * Then group by tier and fine the highest goldPrice over gemsPrice ratio and the uid and tag1 
         * 
         * */
        const query = sql`SELECT * FROM goldtogem;`;
        const data = await query;



        return NextResponse.json(data['rows'], { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
