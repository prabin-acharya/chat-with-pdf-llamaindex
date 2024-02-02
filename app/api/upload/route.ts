import { mkdir, readdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

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
  const tmpDirectory = join("/", "tmp");
  const fileNamePrefix = file.name.slice(0, 10);
  const uniqueFolderName = `${uuidv4()}_${fileNamePrefix}`;
  const path = join(tmpDirectory, uniqueFolderName, file.name);
  console.log(tmpDirectory, "tmpDirectoryPth", currentDirectory);

  // try {
  //   await mkdir(tmpDirectory, { recursive: true });
  // } catch (error) {
  //   console.error("Error creating directory:", error);
  // }
  // await writeFile(path, buffer);

  try {
    await mkdir(join(tmpDirectory, uniqueFolderName), { recursive: true });
  } catch (error) {
    console.error("Error creating directory:", error);
  }

  await writeFile(path, buffer);

  console.log(`open ${path}-------------`);

  const files = await readdir(tmpDirectory);

  console.log("Files in the tmpDirectory:");
  files.forEach((file: any) => {
    console.log(file);
  });

  return NextResponse.json({ success: true });
}
