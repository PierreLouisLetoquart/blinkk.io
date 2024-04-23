import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { StringOutputParser } from "@langchain/core/output_parsers";

const ollama = new ChatOllama({
  baseUrl: "http://localhost:11434",
  model: "llama3",
});

const embeddings = new OllamaEmbeddings({
  model: "nomic-embed-text",
  maxConcurrency: 5,
});

export async function POST(req: Request) {
  const { query } = await req.json();

  if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_SE_CX) {
    return new Response("Missing Google API Key or Custom Search Engine ID", {
      status: 500,
    });
  }

  const url = new URL("https://www.googleapis.com/customsearch/v1");

  url.searchParams.append("cx", process.env.GOOGLE_SE_CX);
  url.searchParams.append("key", process.env.GOOGLE_API_KEY);
  url.searchParams.append("q", query);
  url.searchParams.append("lr", "lang_en");
  url.searchParams.append("filter", "1");

  const response = await fetch(url.toString());
  const body = await response.json();

  const items = body.items.map((item: any) => ({
    title: item.title,
    link: item.link,
    displayLink: item.displayLink,
    imgUrl: item.pagemap.cse_image[0].src
      ? item.pagemap.cse_image[0].src
      : item.pagemap.cse_thumbnail[0].src || "",
  }));

  console.log(items);

  const resources = await Promise.all(
    items.map(async (item: any) => {
      const loader = new CheerioWebBaseLoader(item.link);
      const docs = await loader.load();

      const splitter = new RecursiveCharacterTextSplitter();
      const splitDocs = await splitter.splitDocuments(docs);

      const outputParser = new StringOutputParser();

      const vectorstore = await MemoryVectorStore.fromDocuments(
        splitDocs,
        embeddings,
      );

      const prompt = ChatPromptTemplate.fromTemplate(`
          As a search pro, use the web to find info for every user question. Use all the search results to give more info and help in your response. If there are related images, add them too. Answer the user's question directly and make your response better with info from the search results. Always give the source URL when using info from a specific website. Make sure to use the same language as the user in your response.

          !!Answer the following question based only on the provided context:

      <context>
      {context}
      </context>

      Question: {input}`);

      const documentChain = (
        await createStuffDocumentsChain({
          llm: ollama,
          prompt,
        })
      ).pipe(outputParser);

      const retriever = vectorstore.asRetriever();

      const retrievalChain = await createRetrievalChain({
        combineDocsChain: documentChain,
        retriever,
      });

      return await retrievalChain.invoke({
        input: query,
      });
    }),
  );

  console.log(resources);

  return new Response(
    JSON.stringify(
      {
        query: query,
        items: items,
        resources: resources,
      },
      null,
      2,
    ),
    {
      status: 200,
    },
  );
}
