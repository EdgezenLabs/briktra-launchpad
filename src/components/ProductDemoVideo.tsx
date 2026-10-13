import { useState } from "react";
import { Play } from "lucide-react";
import { PRODUCT_VIDEO } from "@/lib/site-config";

const thumbnailUrl = `https://i.ytimg.com/vi/${PRODUCT_VIDEO.id}/maxresdefault.jpg`;

interface ProductDemoVideoProps {
  id?: string;
  className?: string;
}

const ProductDemoVideo = ({ id = "product-demo", className = "" }: ProductDemoVideoProps) => {
  const [playing, setPlaying] = useState(false);

  return (
    <figure id={id} className={`w-full max-w-2xl scroll-mt-24 ${className}`}>
      <figcaption className="mb-3 text-center">
        <p className="font-display text-lg font-bold text-foreground md:text-xl">
          See how to register and use the Briktra app
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Registration, login, and day-to-day use
        </p>
      </figcaption>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-lg">
        <div className={`relative w-full bg-muted ${playing ? "aspect-video" : "aspect-[3/2]"}`}>
          {playing ? (
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`${PRODUCT_VIDEO.embedUrl}?autoplay=1&rel=0&modestbranding=1`}
              title={PRODUCT_VIDEO.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              className="group absolute inset-0 block h-full w-full overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              aria-label={`Play ${PRODUCT_VIDEO.title}`}
            >
              <img
                src={thumbnailUrl}
                alt=""
                className="h-full w-full object-cover"
              />
              <span
                className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-black/20"
                aria-hidden="true"
              />
              <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-105">
                <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
              </span>
            </button>
          )}
        </div>
      </div>

      <p className="mt-2 text-center text-sm text-muted-foreground">
        <a
          href={PRODUCT_VIDEO.watchUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-primary hover:underline"
        >
          Watch on YouTube
        </a>
      </p>
    </figure>
  );
};

export default ProductDemoVideo;
