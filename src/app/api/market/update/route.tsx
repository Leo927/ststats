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
import { SMARTY_TITAN_URL } from '@/configs';


export async function GET(request: NextRequest) {
    if (request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const url = `${SMARTY_TITAN_URL}/api/item/last/all`;
    try {
        await create_db();
        // do nothing if the most recent data is less than 5 minutes old
        // request from url and store in db
        const response = await fetch(url);
        const data = (await response.json())['data'];

        const query = `
DELETE from MARKET;
INSERT INTO MARKET (
id,
tType,
uid,
tag1,
tag2,
tag3,
goldQty,
gemsQty,
created,
tier,
"order",
cityId,
goldPrice,
gemsPrice,
requestCycleLast,
createdAt,
updatedAt
)
VALUES ${data.map((i: any) => formatRow(i))};
`.replaceAll('\n', '');
        const result = sql.query(query);
        return NextResponse.json({ result }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

function formatRow(data: any) {
    return `(
'${data.id}',
'${data.tType}',
'${data.uid}',
'${data.tag1}',
'${data.tag2}',
'${data.tag3}',
'${data.goldQty}',
'${data.gemsQty}',
'${data.created}',
'${data.tier}',
'${data.order}',
'${data.cityId}',
'${data.goldPrice}',
'${data.gemsPrice}',
'${data.requestCycleLast}',
'${data.createdAt}',
'${data.updatedAt}'
)`.replaceAll("'null'", 'NULL');
}

function create_db() {
    return sql`
CREATE TABLE IF NOT EXISTS MARKET (
id VARCHAR PRIMARY KEY NOT NULL,
tType VARCHAR,
uid VARCHAR NOT NULL,
tag1 VARCHAR,
tag2 VARCHAR,
tag3 VARCHAR,
goldQty INT ,
gemsQty INT,
created VARCHAR,
tier INT,
"order" INT ,
cityId INT ,
goldPrice INT ,
gemsPrice INT ,
requestCycleLast INT ,
createdAt TIMESTAMP NOT NULL,
updatedAt TIMESTAMP NOT NULL
);
`;
}