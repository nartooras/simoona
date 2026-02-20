export interface Env {
  API_PORT?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (new URL(request.url).pathname === "/healthz") {
      return new Response(
        JSON.stringify({
          status: "ok",
          service: "simoona-modern-api-container-adapter",
          port: env.API_PORT ?? "3000"
        }),
        {
          status: 200,
          headers: { "content-type": "application/json; charset=utf-8" }
        }
      );
    }

    return new Response("Container adapter artifact ready.", { status: 200 });
  }
};
