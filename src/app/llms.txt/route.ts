import { llmsTxt } from "@/lib/llms";

/** Markdown summary of the store for AI assistants (https://llmstxt.org) */
export async function GET() {
  return new Response(await llmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
