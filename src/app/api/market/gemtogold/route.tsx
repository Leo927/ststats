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
        const query = sql`SELECT * FROM 
        (SELECT DISTINCT ON (m.uid, m.tag1) 
            m.tier, 
            m.uid, 
            m.tag1, 
            m.gemsPrice, 
            r.goldPrice, 
            (r.goldPrice / m.gemsPrice)  AS ratio,
            rank() over (partition by m.tier order by r.goldPrice / m.gemsPrice desc) rn,
            REPLACE(t.value, ' Dabbler', '') AS type
        FROM Market m
        LEFT OUTER JOIN Market r ON m.uid = r.uid AND m.tag1 = r.tag1 AND r.tType = 'r' AND r.goldPrice > 0
        LEFT OUTER JOIN iteminfo i ON m.uid = i.uid
        LEFT OUTER JOIN translation t ON CONCAT('ascension_upgrade_', i.type, '_00') = t.key
        WHERE m.tType = 'o' AND m.gemsPrice > 0 AND r.goldPrice > 0
        ) WHERE rn = 1 ORDER BY tier               
        `;
        const data = await query;



        return NextResponse.json(data['rows'], { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
