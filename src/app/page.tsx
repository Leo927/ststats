'use client';
import Image from "next/image";
import { useState, useEffect } from "react";
import GemToGoldCard from "@/components/gemtogoldcard";

export default function Home() {
  const [translation, setTranslation] = useState({});
  const [language, setLanguage] = useState("en");
  const [gemToGold, setGemToGold] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/market/gemtogold").then((res) => res.json()).then((data) => setGemToGold(data));
    fetch("/api/market/update").then(() => fetch("/api/market/gemtogold")).then((res) => res.json()).then((data) => setGemToGold(data));
  }, []);

  useEffect(() => {
    fetch("/api/translation/en").then((res) => res.json()).then((data) => setTranslation(data.result));
  }, [language]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {gemToGold.map((item, index) => (
        <GemToGoldCard key={index} item={item} />
      ))}
    </main>
  );
}
