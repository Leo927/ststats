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

function renderItem(uidWithTag1: { uid: string, tag1: string; }) {
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
  return (
    <div style={{ borderRadius: '5px', overflow: 'hidden', backgroundColor: color }}>
      <Image src={`https://playshoptitans.com/_next/image?url=%2Fassets%2Fitems%2F${uidWithTag1.uid}.png&w=100&q=100`} alt={uidWithTag1.uid} width={50} height={50} />
      <div className={styles.outline}></div>
    </div>
  );
}

const columns: GridColDef[] = [
  { field: 'tier', headerName: 'Tier', width: 20 },
  { field: 'uidTag1', headerName: 'Item', width: 70, renderCell: (params) => (renderItem(params.value)) },
  { field: 'type', headerName: 'Type', width: 130 },
  { field: 'gemsprice', headerName: 'Gems Price', width: 50, renderHeader: () => (<Image src="/assets/Currencies/icon_global_gem.png" alt="Gem Icon" width={25} height={25} />) },
  { field: 'goldprice', headerName: 'Gold Price', width: 150, renderHeader: () => (<Image src="/assets/Currencies/icon_global_gold.png" alt="Gold Icon" width={25} height={25} />) },
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
      item.uidTag1 = { uid: item.uid, tag1: item.tag1 };
      return item;
    });
  }

  useEffect(() => {
    fetch("/api/market/gemtogold")
      .then((res) => res.json())
      .then(getQualities)
      .then(groupUidWithTag1)
      .then((data) => setGemToGold(data));
    fetch("/api/market/update").then(() => fetch("/api/market/gemtogold"))
      .then((res) => res.json())
      .then(getQualities)
      .then(groupUidWithTag1)
      .then((data) => setGemToGold(data)).finally(() => console.log("Updated"));
  }, []);


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <AppRouterCacheProvider>
        <DataGrid rows={gemToGold} columns={columns} getRowId={i => i.uid}>
        </DataGrid>
      </AppRouterCacheProvider>
    </main>
  );
}
