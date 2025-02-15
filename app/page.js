"use client";

import { useState } from "react";
import Histogram from "./components/Histogram";

export default function Home() {
  const [logData, setLogData] = useState("");
  const [ipStats, setIpStats] = useState(null);
  const [hourlyStats, setHourlyStats] = useState(null);
  const [topIPs, setTopIPs] = useState(null);
  const [topHours, setTopHours] = useState(null); // New state for top hours

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const logContent = e.target.result;
      setLogData(logContent);

      await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logData: logContent }),
      });

      fetchStats();
    };
    reader.readAsText(file);
  };

  const fetchStats = async () => {
    const res = await fetch("/api/stats");
    const data = await res.json();
    console.log(data);
    setIpStats(data.ipCount);
    setHourlyStats(data.hourCount);
    setTopIPs(data.topIPs);
    setTopHours(data.topHours); // Store top contributing hours in state
  };

  return (
    <div className="p-4">
      <input type="file" onChange={handleFileUpload} className="mb-4 border p-2" />

      {ipStats && (
        <Histogram
          title="IP Address Occurrences"
          data={Object.values(ipStats)}
          labels={Object.keys(ipStats)}
        />
      )}

      {hourlyStats && (
        <Histogram
          title="Hourly Traffic"
          data={hourlyStats}
          labels={Array.from({ length: 24 }, (_, i) => i.toString())}
        />
      )}

      {topHours && (
        <Histogram
          title="Top Hours Contributing to 70% of Traffic"
          data={topHours.map((hour) => hourlyStats[hour])}
          labels={topHours.map((hour) => hour.toString())}
        />
      )}

      {topIPs && (
        <Histogram
          title="Top IPs Contributing to 85% of Traffic"
          data={topIPs.map((ipData) => ipData.count)}
          labels={topIPs.map((ipData) => ipData.ip)}
        />
      )}
    </div>
  );
}
