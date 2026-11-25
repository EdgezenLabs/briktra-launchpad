// Build-time prerender entry (scripts/write-route-pages.mjs). Renders one
// route to HTML so search engines and link previews get the full page and
// its own title, description, canonical and structured data without running
// JavaScript. The browser then hydrates this HTML (src/main.tsx).
import { Writable } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { StaticRouter } from "react-router-dom";
import type { HelmetServerState } from "react-helmet-async";
import { AppFrame, AppRoutes } from "./App";

export interface Rendered {
  html: string;
  head: string;
}

export function render(url: string): Promise<Rendered> {
  const helmetContext: { helmet?: HelmetServerState | null } = {};
  return new Promise((resolve, reject) => {
    let html = "";
    const { pipe } = renderToPipeableStream(
      <AppFrame helmetContext={helmetContext}>
        <StaticRouter location={url}>
          <AppRoutes />
        </StaticRouter>
      </AppFrame>,
      {
        // Wait for every lazy route chunk, so the page is complete, not a fallback.
        onAllReady() {
          const sink = new Writable({
            write(chunk, _encoding, done) {
              html += chunk.toString();
              done();
            },
          });
          sink.on("finish", () => {
            const h = helmetContext.helmet;
            if (!h) return reject(new Error(`${url}: Helmet wrote no head`));
            const head = [h.title, h.meta, h.link, h.script].map((part) => part.toString()).join("\n    ");
            resolve({ html, head });
          });
          pipe(sink);
        },
        onShellError: reject,
        onError: reject,
      },
    );
  });
}
