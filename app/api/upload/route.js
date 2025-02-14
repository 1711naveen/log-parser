import fs from "fs";
import path from "path";

export async function POST(req) {
  const { logData } = await req.json();
  if (!logData) return Response.json({ error: "No log data provided" }, { status: 400 });

  const logPath = path.join(process.cwd(), "public", "sample.log");
  fs.writeFileSync(logPath, logData);

  return Response.json({ message: "Log file uploaded successfully" });
}
