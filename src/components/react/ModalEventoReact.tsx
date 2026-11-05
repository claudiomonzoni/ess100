import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  isOpen: boolean;
  title: string;
  contenidoCompleto: string;
  onClose: () => void;
}

const ModalEventoReact: React.FC<Props> = ({
  isOpen,
  title,
  contenidoCompleto,
  onClose,
}) => {
  const [galleryImages, setGalleryImages] = useState<
    Array<{ src: string; alt: string }>
  >([]);
  const galleryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    document.documentElement.classList.add("no-scroll");
    document.body.classList.add("no-scroll");
    window.dispatchEvent(new CustomEvent("modal-scroll-lock", { detail: true }));

    return () => {
      document.documentElement.classList.remove("no-scroll");
      document.body.classList.remove("no-scroll");
      window.dispatchEvent(
        new CustomEvent("modal-scroll-lock", { detail: false })
      );
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const parsedContent = new DOMParser().parseFromString(
      contenidoCompleto,
      "text/html"
    );
    const images = Array.from(
      parsedContent.querySelectorAll(
        ".wp-block-gallery img, .gallery img"
      )
    );
    const uniqueImages = new Map<string, { src: string; alt: string }>();

    images.forEach((image) => {
      const srcset =
        image.getAttribute("srcset") ?? image.getAttribute("data-srcset");
      const largestSrcsetImage = srcset
        ?.split(",")
        .map((candidate) => {
          const match = candidate.trim().match(/^(\S+)\s+(\d+)w$/);
          return match ? { src: match[1], width: Number(match[2]) } : null;
        })
        .filter((candidate): candidate is { src: string; width: number } =>
          Boolean(candidate)
        )
        .sort((a, b) => b.width - a.width)[0]?.src;
      const src =
        image.getAttribute("data-orig-file") ??
        image.getAttribute("data-large-file") ??
        largestSrcsetImage ??
        image.getAttribute("data-src") ??
        image.getAttribute("src");

      if (src && !uniqueImages.has(src)) {
        uniqueImages.set(src, { src, alt: image.getAttribute("alt") ?? title });
      }
    });

    setGalleryImages(Array.from(uniqueImages.values()));
  }, [contenidoCompleto, isOpen, title]);

  if (!isOpen) return null;

  const scrollGallery = (direction: -1 | 1) => {
    const gallery = galleryRef.current;
    if (!gallery) return;

    gallery.scrollBy({
      left: gallery.clientWidth * 0.35 * direction,
      behavior: "smooth",
    });
  };

  return createPortal(
    <div className="modal modal-react">
      <div
        className="modal-contenido"
        data-lenis-prevent
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <button
          type="button"
          className="cerrar"
          onClick={onClose}
          aria-label="Cerrar"
        >
          &times;
        </button>

        <div className="encabezado">
          <div className="thetitle">
            <h2>{title}</h2>
          </div>
        </div>

        <div className="modal-galeria" ref={galleryRef}>
          <div className="modal-galeria-pista">
            {galleryImages.map((image, index) => (
              <img
                key={`${image.src}-${index}`}
                src={image.src}
                alt={image.alt}
                className="modal-galeria-imagen"
              />
            ))}
          </div>
        </div>

        {galleryImages.length > 1 && (
          <div className="modal-galeria-controles">
            <button
              type="button"
              aria-label="Imagen anterior"
              onClick={() => scrollGallery(-1)}
            >
              &lsaquo;
            </button>
            <button
              type="button"
              aria-label="Imagen siguiente"
              onClick={() => scrollGallery(1)}
            >
              &rsaquo;
            </button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};

export default ModalEventoReact;
