import { type NextRequest } from "next/server";
import {
  chatWithClaudeStreaming,
  type ChatMessage,
  type ChatAttachment,
} from "@/lib/claude";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface ChatMessageWithAttachments extends ChatMessage {
  attachments?: ChatAttachment[];
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const messages: ChatMessageWithAttachments[] = body.messages ?? [];
    const webSearch: boolean = body.webSearch ?? false;
    const convexAccessToken: string | undefined =
      typeof body.convexAccessToken === "string" && body.convexAccessToken.length > 0
        ? body.convexAccessToken
        : undefined;

    if (!messages.length) {
      return new Response(JSON.stringify({ error: "messages required" }), {
        status: 400,
      });
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of chatWithClaudeStreaming({
            messages,
            webSearch,
            convexAccessToken,
          })) {
            const data = JSON.stringify(chunk);
            controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          }
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err) {
          const errorChunk = JSON.stringify({
            type: "error",
            error: err instanceof Error ? err.message : "Streaming error",
          });
          controller.enqueue(encoder.encode(`data: ${errorChunk}\n\n`));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: err instanceof Error ? err.message : "Bad request",
      }),
      { status: 500 },
    );
  }
}
