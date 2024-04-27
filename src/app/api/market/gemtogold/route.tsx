// use typescript
// store data for
// use varchar instead of TEXT
import { sql } from '@vercel/postgres';
import { NextResponse, NextRequest } from 'next/server';


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
        const query = sql`SELECT * FROM (
            SELECT DISTINCT ON (uid, tag1) tier, uid, tag1, gemsPrice, goldPrice, max_ratio_per_tier
            FROM (
                SELECT o.uid, o.tag1, o.gemsPrice, r.goldPrice, o.tier,
                       MAX(r.goldPrice / o.gemsPrice) OVER (PARTITION BY o.tier) AS max_ratio_per_tier
                FROM (
                    SELECT uid, tag1, gemsPrice, tier
                    FROM Market
                    WHERE tType='o' AND gemsPrice >0
                ) AS o
                LEFT OUTER JOIN (
                    SELECT uid, tag1, goldPrice
                    FROM Market
                    WHERE tType='r' AND goldPrice >0
                ) AS r ON o.uid = r.uid AND o.tag1 = r.tag1
            ) AS data
            WHERE goldPrice / gemsPrice = max_ratio_per_tier) 
            ORDER BY tier ;                
        `;
        const data = await query;



        return NextResponse.json(data['rows'], { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
