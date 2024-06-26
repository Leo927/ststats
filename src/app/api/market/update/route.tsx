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


export const dynamic = 'force-dynamic';
export const revalidate = 0;

const url = `${SMARTY_TITAN_URL}/api/item/last/all`;

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', {
            status: 401,
        });
    }

    try {
        return create_db()
            .then(deleteOldMarketData)
            .then(fetchListingDatas)
            .then(insertData)
            .then(dropGemToGold)
            .then(updateGemToGold)
            .then(dropGoldToGem)
            .then(updateGoldToGem)
            .then(() => NextResponse.json("Update Sucessful", { status: 200 }));
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}

function dropGemToGold() {
    return sql.query(`DROP table IF EXISTS gemtogold;`).catch((error) => { console.log(`Error while dropping gemtogold`); throw error; });
}

function fetchListingDatas(): Response | PromiseLike<Response> {
    return fetch(url).catch((error) => { console.log("Error while trying to fetch marekt info"); throw error; })
        .then((response) => response.json()).catch((error) => { console.log("Error while trying to fetch marekt info"); throw error; })
        .then((data) => data['data']).catch((error) => { console.log("Error while trying to fetch marekt info"); throw error; });
}

function deleteOldMarketData() {
    return sql.query(`DELETE FROM Market;`).catch((error) => { console.log("Error while deleting from market"); throw error; });
}

function updateGemToGold() {
    return sql.query(
        `CREATE TABLE gemtogold AS (SELECT * FROM 
            (SELECT DISTINCT ON (m.uid, m.tag1) 
                m.tier, 
                m.uid, 
                m.tag1, 
                m.gemsPrice, 
                r.goldPrice, 
                longname,
                (r.goldPrice / m.gemsPrice)  AS ratio,
                rank() over (partition by m.tier order by r.goldPrice / m.gemsPrice desc) rn,
                t.value as displayname
            FROM Market m
            LEFT OUTER JOIN Market r ON m.uid = r.uid AND m.tag1 = r.tag1 AND r.tType = 'r' AND r.goldPrice > 0
            LEFT OUTER JOIN iteminfo i ON m.uid = i.uid
            LEFT OUTER JOIN typeinfos ON i.type = typeinfos.shortname
            LEFT OUTER JOIN translation t ON CONCAT('item_type_', typeinfos.longname) = t.key
            WHERE m.tType = 'o' AND m.gemsPrice > 0 AND r.goldPrice > 0
            ) WHERE rn = 1 ORDER BY tier);`).catch((error) => { console.log(`Error while upating gemtogold`); throw error; });
}

function dropGoldToGem() {
    return sql.query(`DROP table IF EXISTS goldtogem;`).catch((error) => { console.log(`Error while dropping goldToGem`); throw error; });
}

function updateGoldToGem() {
    return sql.query(
        `CREATE TABLE goldtogem AS (SELECT * FROM 
        (SELECT DISTINCT ON (m.uid, m.tag1) 
            m.tier, 
            m.uid, 
            m.tag1, 
            m.goldPrice, 
            r.gemsPrice, 
            longname,
            (m.goldPrice / r.gemsPrice )  AS ratio,
            rank() over (partition by m.tier order by m.goldPrice / r.gemsPrice ASC ) rn,
            t.value as displayname
        FROM Market m
        LEFT OUTER JOIN Market r ON m.uid = r.uid AND m.tag1 = r.tag1 AND r.tType = 'r' AND r.gemsPrice > 0
        LEFT OUTER JOIN iteminfo i ON m.uid = i.uid
        LEFT OUTER JOIN typeinfos ON i.type = typeinfos.shortname
        LEFT OUTER JOIN translation t ON CONCAT('item_type_', typeinfos.longname) = t.key
        WHERE m.tType = 'o' AND m.goldPrice > 0 AND r.gemsPrice > 0
        ) where rn <= 3 ORDER BY ratio);`).catch((error) => { console.log(`Error while upating gemtogold`); throw error; });
}



function insertData(data: any) {
    const query = `
    INSERT INTO Market (
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
    return sql.query(query).catch((error) => { console.log("Error while inserting into market"); throw error; });
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
CREATE TABLE IF NOT EXISTS Market (
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
`.catch((error) => { console.log("Error while creating market table"); throw error; });
}