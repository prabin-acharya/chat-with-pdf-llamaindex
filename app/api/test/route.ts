import {
  IngestionPipeline,
  SimpleDirectoryReader,
  SimpleNodeParser,
  VectorStoreIndex,
  storageContextFromDefaults,
} from "llamaindex";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  console.log("==============================================================");

  const documents = await new SimpleDirectoryReader().loadData({
    directoryPath:
      "/home/prabina/code/projects/replit/llamaindex-ask-pdf-nextjs/tmp",
  });

  const storageContext = await storageContextFromDefaults({
    persistDir: "./storage",
  });

  //   const index = await VectorStoreIndex.fromDocuments(documents, {
  //     storageContext,
  //   });
  const loadedIndex = await VectorStoreIndex.init({
    storageContext: storageContext,
  });

  const pipeline = new IngestionPipeline({
    transformations: [
      new SimpleNodeParser({ chunkSize: 512, chunkOverlap: 20 }),
    ],
  });

  const nodes = await pipeline.run({ documents });

  // print out the result of the pipeline run
  //   for (const node of nodes) {
  //     console.log(node.getContent(MetadataMode.NONE));
  //   }

  // index.insert_nodes(nodes)
  // # Save the index to disk
  // index.storage_context.persist(persist_dir="storage")

  loadedIndex.insertNodes(nodes);

  const queryEngine = loadedIndex.asQueryEngine();
  const response = await queryEngine.query({
    query: "What are End-to-end memory networks based on ?",
  });

  return NextResponse.json({ success: true, response: response.toString() });
}
