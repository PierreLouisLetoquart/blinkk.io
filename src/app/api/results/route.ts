import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";

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

  const resources = await Promise.all(
    items.map(async (item: any) => {
      const loader = new CheerioWebBaseLoader(item.link);
      return await loader.load();
    }),
  );

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
