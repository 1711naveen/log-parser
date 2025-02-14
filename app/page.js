"use client";

import { useState } from "react";
import Histogram from "./components/Histogram";

export default function Home() {
  const [logData, setLogData] = useState("");
  const [ipStats, setIpStats] = useState(null);
  const [hourlyStats, setHourlyStats] = useState(null);
  const [topIPs, setTopIPs] = useState(null); // New state for top IPs

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
    setTopIPs(data.topIPs); // Store top IPs in state
  };

  return (
    <div className="p-4">
      <input type="file" onChange={handleFileUpload} className="mb-4 border p-2" />

      {ipStats && <Histogram title="IP Address Occurrences" data={Object.values(ipStats)} labels={Object.keys(ipStats)} />}
      {hourlyStats && <Histogram title="Hourly Traffic" data={hourlyStats} labels={Array.from({ length: 24 }, (_, i) => i.toString())} />}
      
      {/* New Section for Top IPs Contributing to 85% Traffic */}
      {topIPs && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Top IPs (85% Traffic Contribution)</h2>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">IP Address</th>
                <th className="border p-2">Requests</th>
              </tr>
            </thead>
            <tbody>
              {topIPs.map((ipData, index) => (
                <tr key={index} className="border">
                  <td className="border p-2">{ipData.ip}</td>
                  <td className="border p-2">{ipData.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
