// use typescript
// store data for
// use varchar instead of TEXT
/**
 *  {
      "id": 0,
      "tType": "string",
      "uid": "string",
      "tag1": "string",
      "tag2": "string",
      "tag3": "string",
      "goldQty": 0,
      "gemsQty": 0,
      "created": "string",
      "tier": 0,
      "order": 0,
      "cityId": 0,
      "goldPrice": 0,
      "gemsPrice": 0,
      "requestCycleLast": 0,
      "createdAt": "string",
      "updatedAt": "string"
    }
 */
import { sql } from '@vercel/postgres';
import { NextResponse, NextRequest } from 'next/server';


export async function GET(request: NextRequest) {

    try {
        const result = sql`SELECT * FROM MARKET LIMIT 1;`;

        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}



function create_db() {
    return sql`
    CREATE TABLE IF NOT EXISTS MARKET (
        key SERIAL PRIMARY KEY,
        id VARCHAR NOT NULL,
        tType VARCHAR NOT NULL,
        uid VARCHAR NOT NULL,
        tag1 VARCHAR NOT NULL,
        tag2 VARCHAR NOT NULL,
        tag3 VARCHAR NOT NULL,
        goldQty INT NOT NULL,
        gemsQty INT NOT NULL,
        created VARCHAR NOT NULL,
        tier INT NOT NULL,
        "order" INT NOT NULL,
        cityId INT NOT NULL,
        goldPrice INT NOT NULL,
        gemsPrice INT NOT NULL,
        requestCycleLast INT NOT NULL,
        createdAt VARCHAR NOT NULL,
        updatedAt VARCHAR NOT NULL
    );
    `;
}