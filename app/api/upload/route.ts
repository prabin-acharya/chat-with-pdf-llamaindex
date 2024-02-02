import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
const { readdir } = require("fs").promises;

export async function POST(req: NextRequest) {
  console.log("/api/upload================================");

  const data = await req.formData();
  const file: File | null = data.get("file") as unknown as File;

  if (!file) {
    return NextResponse.json({ success: false });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const currentDirectory = process.cwd();
  const tmpDirectory = join(currentDirectory, "tmp");
  const path = join(tmpDirectory, file.name);
  console.log(tmpDirectory, "tmpDirectoryPth");

  await mkdir(tmpDirectory, { recursive: true });
  await writeFile(path, buffer);

  console.log(`open ${path}-------------`);

  const files = await readdir(tmpDirectory);

  console.log("Files in the tmpDirectory:");
  files.forEach((file: any) => {
    console.log(file);
  });

  return NextResponse.json({ success: true });
}
