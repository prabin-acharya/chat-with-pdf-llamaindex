import {
  IngestionPipeline,
  MetadataMode,
  SimpleDirectoryReader,
  SimpleNodeParser,
  VectorStoreIndex,
  storageContextFromDefaults,
} from "llamaindex";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  console.log("==============================================================");

  const { query, fileId } = await req.json();

  const documents = await new SimpleDirectoryReader().loadData({
    directoryPath: `/tmp/${fileId}`,
  });

  const storageContext = await storageContextFromDefaults({
    persistDir: "./storage",
  });

  // const loadedIndex = await VectorStoreIndex.fromDocuments(documents, {
  //   storageContext,
  // });
  const loadedIndex = await VectorStoreIndex.fromDocuments(documents);

  // const loadedIndex = await VectorStoreIndex.init({
  //   storageContext: storageContext,
  // });

  const pipeline = new IngestionPipeline({
    transformations: [
      new SimpleNodeParser({ chunkSize: 512, chunkOverlap: 20 }),
    ],
  });

  const nodes = await pipeline.run({ documents });

  for (const node of nodes) {
    console.log(node.getContent(MetadataMode.NONE));
  }

  // index.insert_nodes(nodes)
  // # Save the index to disk
  // index.storage_context.persist(persist_dir="storage")

  loadedIndex.insertNodes(nodes);

  const queryEngine = loadedIndex.asQueryEngine();
  const response = await queryEngine.query({
    query,
  });

  return NextResponse.json({ success: true, response: response.toString() });
}
