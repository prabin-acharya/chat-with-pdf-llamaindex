import fs from "fs";
import { mkdir, writeFile } from "fs/promises";
import { Document, SimpleDirectoryReader, VectorStoreIndex } from "llamaindex";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
const { readdir } = require("fs").promises;

// export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  console.log("/api/upload================================");

  // const data = await req.formData();
  // const file: File | null = data.get("file") as unknown as File;

  // if (!file) {
  //   return NextResponse.json({ success: false });
  // }

  // const bytes = await file.arrayBuffer();
  // const buffer = Buffer.from(bytes);

  // const currentDirectory = process.cwd();
  // const tmpDirectory = join("/", "tmp");
  // const path = join(tmpDirectory, file.name);
  // console.log(tmpDirectory, "tmpDirectoryPth", currentDirectory);

  // try {
  //   await mkdir(tmpDirectory, { recursive: true });
  // } catch (error) {
  //   console.error("Error creating directory:", error);
  // }
  // await writeFile(path, buffer);

  // console.log(`open ${path}-------------`);

  // const files = await readdir(tmpDirectory);

  // console.log("Files in the tmpDirectory:");
  // files.forEach((file: any) => {
  //   console.log(file);
  // });

  // const dataBuffer = fs.readFileSync(
  //   "/home/prabina/code/projects/replit/llamaindex-ask-pdf-nextjs/tmp/turing.pdf"
  // );

  // pdf(buffer);
  // .then((data) => {
  //   // 'data.text' contains the text content of the PDF
  //   console.log(data.text);
  // })
  // .catch((error) => {
  //   console.error("Error reading PDF:", error);
  // });

  console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$");

  // // const path2 = "node_modules/llamaindex/examples/abramov.txt";
  // const path2 =
  //   "/home/prabina/code/projects/replit/llamaindex-ask-pdf-nextjs/tmp/paulg.txt";

  // const essay = fs.readFile(path2, "utf-8");

  // // Create Document object with essay
  // const document = new Document({ text: essay, id_: path2 });

  // // Split text and create embeddings. Store them in a VectorStoreIndex
  // const index = await VectorStoreIndex.fromDocuments([document]);

  // // Query the index
  // const queryEngine = index.asQueryEngine();
  // const response = await queryEngine.query({
  //   query: "What does Y combinator encourages founders to focus on?",
  // });

  // Output response
  // console.log(response.toString());

  const reader = new SimpleDirectoryReader().loadData(
    "/home/prabina/code/projects/replit/llamaindex-ask-pdf-nextjs/tmp/turing.md"
  );

  console.log(reader);
  return NextResponse.json({ success: true });
}
