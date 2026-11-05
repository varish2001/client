const BACKEND_URL = "https://server-5yzz.onrender.com";

export default async function handler(request, response) {
  const requestUrl = request.url || "";
  const queryIndex = requestUrl.indexOf("?");
  const pathname = queryIndex === -1 ? requestUrl : requestUrl.slice(0, queryIndex);
  const query = queryIndex === -1 ? "" : requestUrl.slice(queryIndex);
  const path = pathname.replace(/^\/api/, "");
  const backendUrl = `${BACKEND_URL}/api${path}${query}`;
  const headers = new Headers();

  for (const [name, value] of Object.entries(request.headers)) {
    if (value !== undefined && !["host", "content-length"].includes(name.toLowerCase())) {
      headers.set(name, Array.isArray(value) ? value.join(", ") : String(value));
    }
  }

  try {
    const hasBody = !["GET", "HEAD"].includes(request.method?.toUpperCase());
    const body = hasBody ? await readRequestBody(request) : undefined;
    const upstream = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      redirect: "follow"
    });
    const data = Buffer.from(await upstream.arrayBuffer());

    upstream.headers.forEach((value, name) => {
      if (!["content-length", "content-encoding", "transfer-encoding"].includes(name.toLowerCase())) {
        response.setHeader(name, value);
      }
    });
    response.status(upstream.status).send(data);
  } catch (error) {
    console.error("Backend proxy failed:", error);
    response.status(502).json({ message: "Unable to reach the backend service." });
  }
}

async function readRequestBody(request) {
  const chunks = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}
