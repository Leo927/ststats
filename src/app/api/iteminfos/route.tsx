// response from the api 
/**{
  "shortsword": {
    "uid": "shortsword",
    "level": 1,
    "type": "ws",
    "subtype": null,
    "xp": 135,
    "craftXp": 2,
    "value": 50,
    "tradeMinMaxValue": "15,20,30,45,80;800,900,1500,2300,3800",
    "favor": 1,
    "time": 15,
    "atk": 16,
    "def": 0,
    "hp": 0,
    "eva": "0",
    "crit": "0",
    "excl": null,
    "tier": 1,
    "subtier": 0,
    "combo": 10,
    "worker1": "blacksmith",
    "worker2": null,
    "worker3": null,
    "w1BuildingReq": 1,
    "w2BuildingReq": 1,
    "w3BuildingReq": 1,
    "resource1": "iron",
    "r1Qty": 5,
    "resource2": null,
    "r2Qty": 0,
    "resource3": null,
    "r3Qty": 0,
    "component1": null,
    "c1Qty": 0,
    "c1Tags": null,
    "component2": null,
    "c2Qty": 0,
    "c2Tags": null,
    "u1Req": 7,
    "u2Req": 18,
    "u3Req": 32,
    "u4Req": 50,
    "u5Req": 80,
    "upgrade1": "bp:kitchenknife",
    "upgrade2": "bp:longsword",
    "upgrade3": "value*1.5",
    "upgrade4": "quality+1",
    "upgrade5": "quality+2",
    "upgradeBonus": 1,
    "supgrade1": "resource1-4",
    "supgrade2": "multi+0.3",
    "supgrade3": "quality+2",
    "su1Cost": 5,
    "su2Cost": 5,
    "su3Cost": 5,
    "restrict": null,
    "reqTags": null,
    "tagIndex": 0,
    "elements": null,
    "skill": null,
    "lTag2": null,
    "lTag3": null,
    "elementAffinity": null,
    "spiritAffinity": null,
    "tag": null,
    "discount": 5,
    "surcharge": 15,
    "suggest": 5,
    "speedup": 15,
    "buyAnimIdOverride": 0,
    "questAnimIdOverride": 0,
    "slotOverride": null,
    "soundType": "lMetal",
    "unlock": 0,
    "chest": null,
    "firstOfLine": true,
    "prohibited": false,
    "hasChinaTexture": false,
    "nonCraftable": false,
    "releaseAt": null,
    "shardPrice": 0,
    "capriceDelay": 0,
    "EnchantedItemTexturer": false
  } 
}*/
import { sql } from '@vercel/postgres';
import { NextResponse, NextRequest } from 'next/server';
import { SMARTY_TITAN_URL } from '@/configs';


const endPoint = '/assets/gameData/items.json';
const url = SMARTY_TITAN_URL + endPoint;

export async function GET(request: NextRequest) {
    return itemInfoExists().then((exists) => {
        if (exists) {
            return NextResponse.json("table exists", { status: 200 });
        } else {
            return createItemInfoTable()
                .then(getData)
                .then(insertData)
                .then(() => NextResponse.json("table created", { status: 200 }))
                .catch((error) => { throw error; });
        }
    });
}

function getData() {
    return fetch(url)
        .then((res) => res.json())
        .then((data) => Object.values(data));
}

function insertData(data: any) {
    const query = `
        DELETE FROM ItemInfo;
        INSERT INTO ItemInfo (uid, level, type, subtype, xp, craftXp, value, tradeMinMaxValue, favor, time, atk, def, hp, eva, crit, excl, tier, subtier, combo, worker1, worker2, worker3, w1BuildingReq, w2BuildingReq, w3BuildingReq, resource1, r1Qty, resource2, r2Qty, resource3, r3Qty, component1, c1Qty, c1Tags, component2, c2Qty, c2Tags, u1Req, u2Req, u3Req, u4Req, u5Req, upgrade1, upgrade2, upgrade3, upgrade4, upgrade5, upgradeBonus, supgrade1, supgrade2, supgrade3, su1Cost, su2Cost, su3Cost, restrict, reqTags, tagIndex, elements, skill, lTag2, lTag3, elementAffinity, spiritAffinity, tag, discount, surcharge, suggest, speedup, buyAnimIdOverride, questAnimIdOverride, slotOverride, soundType, unlock, chest, firstOfLine, prohibited, hasChinaTexture, nonCraftable, releaseAt, shardPrice, capriceDelay, EnchantedItemTexturer) VALUES
        ${data.map((item: any) => `(
            '${item.uid}',
            '${item.level}',
            '${item.type}',
            '${item.subtype}',
            '${item.xp}',
            '${item.craftXp}',
            '${item.value}',
            '${item.tradeMinMaxValue}',
            '${item.favor}',
            '${item.time}',
            '${item.atk}',
            '${item.def}',
            '${item.hp}',
            '${item.eva}',
            '${item.crit}',
            '${item.excl}',
            '${item.tier}',
            '${item.subtier}',
            '${item.combo}',
            '${item.worker1}',
            '${item.worker2}',
            '${item.worker3}',
            '${item.w1BuildingReq}',
            '${item.w2BuildingReq}',
            '${item.w3BuildingReq}',
            '${item.resource1}',
            '${item.r1Qty}',
            '${item.resource2}',
            '${item.r2Qty}',
            '${item.resource3}',
            '${item.r3Qty}',
            '${item.component1}',
            '${item.c1Qty}',
            '${item.c1Tags}',
            '${item.component2}',
            '${item.c2Qty}',
            '${item.c2Tags}',
            '${item.u1Req}',
            '${item.u2Req}',
            '${item.u3Req}',
            '${item.u4Req}',
            '${item.u5Req}',
            '${item.upgrade1}',
            '${item.upgrade2}',
            '${item.upgrade3}',
            '${item.upgrade4}',
            '${item.upgrade5}',
            '${item.upgradeBonus}',
            '${item.supgrade1}',
            '${item.supgrade2}',
            '${item.supgrade3}',
            '${item.su1Cost}',
            '${item.su2Cost}',
            '${item.su3Cost}',
            '${item.restrict}',
            '${item.reqTags}',
            '${item.tagIndex}',
            '${item.elements}',
            '${item.skill}',
            '${item.lTag2}',
            '${item.lTag3}',
            '${item.elementAffinity}',
            '${item.spiritAffinity}',
            '${item.tag}',
            '${item.discount}',
            '${item.surcharge}',
            '${item.suggest}',
            '${item.speedup}',
            '${item.buyAnimIdOverride}',
            '${item.questAnimIdOverride}',
            '${item.slotOverride}',
            '${item.soundType}',
            '${item.unlock}',
            '${item.chest}',
            '${item.firstOfLine}',
            '${item.prohibited}',
            '${item.hasChinaTexture}',
            '${item.nonCraftable}',
            '${item.releaseAt}',
            '${item.shardPrice}',
            '${item.capriceDelay}',
            '${item.EnchantedItemTexturer}'
        )`)};
    `;

    return sql.query(query);
}

async function itemInfoExists() {
    const query = sql`
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_name = 'iteminfo'
    );
    `;
    return (await (query)).rows[0]['exists'] == 'true';
}

function createItemInfoTable() {
    return sql`
        CREATE TABLE IF NOT EXISTS ItemInfo (
            uid VARCHAR(255) PRIMARY KEY,
            level INT,
            type VARCHAR(255),
            subtype VARCHAR(255),
            xp INT,
            craftXp INT,
            value INT,
            tradeMinMaxValue VARCHAR(255),
            favor INT,
            time INT,
            atk INT,
            def INT,
            hp INT,
            eva VARCHAR(255),
            crit VARCHAR(255),
            excl VARCHAR(255),
            tier INT,
            subtier INT,
            combo INT,
            worker1 VARCHAR(255),
            worker2 VARCHAR(255),
            worker3 VARCHAR(255),
            w1BuildingReq INT,
            w2BuildingReq INT,
            w3BuildingReq INT,
            resource1 VARCHAR(255),
            r1Qty INT,
            resource2 VARCHAR(255),
            r2Qty INT,
            resource3 VARCHAR(255),
            r3Qty INT,
            component1 VARCHAR(255),
            c1Qty INT,
            c1Tags VARCHAR(255),
            component2 VARCHAR(255),
            c2Qty INT,
            c2Tags VARCHAR(255),
            u1Req INT,
            u2Req INT,
            u3Req INT,
            u4Req INT,
            u5Req INT,
            upgrade1 VARCHAR(255),
            upgrade2 VARCHAR(255),
            upgrade3 VARCHAR(255),
            upgrade4 VARCHAR(255),
            upgrade5 VARCHAR(255),
            upgradeBonus INT,
            supgrade1 VARCHAR(255),
            supgrade2 VARCHAR(255),
            supgrade3 VARCHAR(255),
            su1Cost INT,
            su2Cost INT,
            su3Cost INT,
            restrict VARCHAR(255),
            reqTags VARCHAR(255),
            tagIndex INT,
            elements VARCHAR(255),
            skill VARCHAR(255),
            lTag2 VARCHAR(255),
            lTag3 VARCHAR(255),
            elementAffinity VARCHAR(255),
            spiritAffinity VARCHAR(255),
            tag VARCHAR(255),
            discount INT,
            surcharge INT,
            suggest INT,
            speedup INT,
            buyAnimIdOverride INT,
            questAnimIdOverride INT,
            slotOverride VARCHAR(255),
            soundType VARCHAR(255),
            unlock INT,
            chest VARCHAR(255),
            firstOfLine BOOLEAN,
            prohibited BOOLEAN,
            hasChinaTexture BOOLEAN,
            nonCraftable BOOLEAN,
            releaseAt VARCHAR(255),
            shardPrice INT,
            capriceDelay INT,
            EnchantedItemTexturer BOOLEAN
        );
    `;
}