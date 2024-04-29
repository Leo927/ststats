// response from the api 
/**{
 * text: {key:value}
  } 
}*/
import { sql } from '@vercel/postgres';
import { NextResponse, NextRequest } from 'next/server';
import { SMARTY_TITAN_URL } from '@/configs';


const endPoint = '/assets/gameData/texts_en.json';
const url = SMARTY_TITAN_URL + endPoint;

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', {
            status: 401,
        });
    }

    return createItemInfoTable()
        .then(getData)
        .then(insertData)
        .then(() => NextResponse.json("table created", { status: 200 }))
        .catch((error) => { throw error; });
}

function getData() {
    return fetch(url)
        .then((res) => res.json())
        .then((texts) => texts['texts']);
}

function insertData(data: any) {
    const query = `
        DELETE FROM translation;
        INSERT INTO translation (key, value) VALUES ${Object.entries(data).map(([key, value]) => `('${key}', '${escapeSingleQuotes(value)}')`).join(', ')};
    `;
    console.log(query);
    return sql.query(query);
}

function createItemInfoTable() {
    return sql`
        CREATE TABLE IF NOT EXISTS translation (
            key VARCHAR(255) PRIMARY KEY,
            value VARCHAR(500)
        );
    `;
}

function escapeSingleQuotes(str: any) {
    return str.replace(/'/g, "''").slice(0, 500);
}