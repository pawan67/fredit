import axios from "axios";

export async function GET(reg: Request) {
  const url = new URL(reg.url);
  const href = url.searchParams.get("url");
  if (!href) return new Response("Missing url parameter", { status: 400 });
  const res = await axios.get(href);

  const titleMatch = res.data.match(/<title>(.*?)<\/title>/);
  const title = titleMatch ? titleMatch[1] : "";
  const descriptionMatch = res.data.match(
    /<meta name="description" content="(.*?)">/
  );
  const description = descriptionMatch ? descriptionMatch[1] : "";
  const imageMatch = res.data.match(
    /<meta property="og:image" content="(.*?)">/
  );
  const imageUrl = imageMatch ? imageMatch[1] : "";

  return new Response(
    JSON.stringify({
      success: 1,
      meta: {
        title,
        description,
        image: {
          url: imageUrl,
        },
      },
    })
  );
}
