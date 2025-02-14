import fs from "fs";
import path from "path";

const parseLogs = (data) => {
  const ipCount = {};
  const hourCount = Array(24).fill(0);
  const lines = data.split("\n");

  lines.forEach((line) => {
    const ipMatch = line.match(/^(\d+\.\d+\.\d+\.\d+)/);
    const timeMatch = line.match(/\[(\d{2})\/\w+\/\d{4}:(\d{2}):/);

    if (ipMatch && timeMatch) {
      const ip = ipMatch[1];
      const hour = parseInt(timeMatch[2]);

      ipCount[ip] = (ipCount[ip] || 0) + 1;
      hourCount[hour]++;
    }
  });

  // Calculate top IPs contributing to 85% of traffic
  const totalRequests = Object.values(ipCount).reduce((sum, count) => sum + count, 0);
  const sortedIPs = Object.entries(ipCount).sort((a, b) => b[1] - a[1]);

  let cumulativeTraffic = 0;
  let topIPs = [];

  for (const [ip, count] of sortedIPs) {
    cumulativeTraffic += count;
    topIPs.push({ ip, count });

    if ((cumulativeTraffic / totalRequests) >= 0.85) {
      break;
    }
  }

  return { ipCount, hourCount, topIPs };
};

export async function GET() {
  const logPath = path.join(process.cwd(), "public", "sample.log");
  if (!fs.existsSync(logPath)) return Response.json({ error: "Log file not found" }, { status: 404 });

  const logData = fs.readFileSync(logPath, "utf-8");
  const { ipCount, hourCount, topIPs } = parseLogs(logData);

  return Response.json({ ipCount, hourCount, topIPs });
}
