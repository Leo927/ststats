'use client';
import { useState, useEffect } from "react";
import GemToGoldCard from "@/components/gemtogoldcard";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import './globals.css';
import { ThemeProvider } from '@mui/material/styles';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { The_Nautigal } from "next/font/google";
import Image from 'next/image';
import styles from '@/app/styles.module.css';
import Link from 'next/link';

// force dynamic
export const dynamic = 'force-dynamic';
export const revalidate = 0;

function renderItem(uidWithTag1: { uid: string, tag1: string, tier: number; }) {
  let color = "";
  if (uidWithTag1.tag1 === null) {
    color = "white";
  } else if (uidWithTag1.tag1 === "uncommon") {
    color = "green";
  } else if (uidWithTag1.tag1 === "flawless") {
    color = "blue";
  } else if (uidWithTag1.tag1 === "epic") {
    color = "purple";
  } else if (uidWithTag1.tag1 === "legendary") {
    color = "gold";
  }
  const tier = uidWithTag1.tier;
  const uid = uidWithTag1.uid;
  return (
    <Link href={`https://playshoptitans.com/blueprints/armor/ah/${uid}`}>
      <div style={{ overflow: 'hidden', backgroundColor: color }} className="relative">
        <Image className="relative h-full w-full left-0 top-0" src={`https://playshoptitans.com/_next/image?url=%2Fassets%2Fitems%2F${uid}.png&w=100&q=100`} alt={uid} width={100} height={100} />
        <div className={styles.BlueprintCard_specialAttributes___8e1A}>
          <div className={styles.CardAttribute_attributeImage__rzy9Z}>
            <div className={styles.CardAttribute_attributeImage__rzy9Z} title="">
              <Image alt="" src="/assets/Misc Icons/icon_global_level_item_s_r.png" width="25" height="25" decoding="async" data-nimg="1" loading="lazy" />
            </div>
            <div className={styles.CardAttribute_tierValue__FHWkO}>{tier}
            </div>
          </div>
        </div>
      </div >
    </Link>
  );
}

const columns: GridColDef[] = [
  { field: 'uidTag1', headerName: 'Item', width: 70, renderCell: (params) => (renderItem(params.value)) },
  { field: 'type', headerName: 'Type', width: 130 },
  { field: 'gemsprice', headerName: 'Gems Price', width: 100, renderHeader: () => (<Image src="/assets/Currencies/icon_global_gem.png" alt="Gem Icon" width={25} height={25} />) },
  { field: 'goldprice', headerName: 'Gold Price', width: 100, renderHeader: () => (<Image src="/assets/Currencies/icon_global_gold.png" alt="Gold Icon" width={25} height={25} />) },
  { field: 'ratio', headerName: 'Ratio', width: 150, renderHeader: () => (<div className="flex"><Image src="/assets/Currencies/icon_global_gold.png" alt="Gold Icon" width={25} height={25} />/<Image src="/assets/Currencies/icon_global_gem.png" alt="Gem Icon" width={25} height={25} /> </div>) },
];


export default function Home() {
  const [gemToGold, setGemToGold] = useState<any[]>([]);

  function getQualities(data: any) {
    return data.map((item: any) => {
      item.quality = item.tag1 == null ? "Common" : item.tag1;
      item.quality = item.quality.charAt(0).toUpperCase() + item.quality.slice(1).toLowerCase();
      return item;
    });
  }

  function groupUidWithTag1(data: any) {
    return data.map((item: any) => {
      item.uidTag1 = { uid: item.uid, tag1: item.tag1, tier: item.tier };
      return item;
    });
  }

  useEffect(() => {
    fetch("/api/market/gemtogold")
      .then((res) => res.json())
      .then(getQualities)
      .then(groupUidWithTag1)
      .then((data) => setGemToGold(data)).finally(() => console.log("Updated"));
  }, []);


  return (
    <main className="flex items-center">
      <AppRouterCacheProvider>
        <DataGrid className="w-full h-full" rows={gemToGold} columns={columns} getRowId={i => i.uid}>
        </DataGrid>
      </AppRouterCacheProvider>
    </main>
  );
}
