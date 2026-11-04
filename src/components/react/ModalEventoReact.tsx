import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import bikeIcon from "../../icons/bike.svg?url";
import skiIcon from "../../icons/ski.svg?url";
import snowboardIcon from "../../icons/snowboard.svg?url";
import kidsIcon from "../../icons/kids.svg?url";

interface Props {
  isOpen: boolean;
  title: string;
  imageUrl?: string;
  contenidoCompleto: string;
  pdfUrl?: string;
  fechaEvento?: string;
  subcategoria?: string;
  onClose: () => void;
}

const ModalEventoReact: React.FC<Props> = ({
  isOpen,
  title,
  imageUrl,
  contenidoCompleto,
  pdfUrl,
  fechaEvento,
  subcategoria,
  onClose,
}) => {
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

  if (!isOpen) return null;

  // Lógica equivalente a `Fecha.astro` pero en React
  let diaNumero = "";
  let nombreDia = "";
  let nombreMes = "";

  if (fechaEvento) {
    const idioma = window.location.pathname.startsWith("/en/") ? "en" : "fr";

    const meses: Record<string, string[]> = {
      fr: [
        "janv.",
        "févr.",
        "mars",
        "avr.",
        "mai",
        "juin",
        "juil.",
        "août",
        "sept.",
        "oct.",
        "nov.",
        "déc.",
      ],
      en: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
    };

    const dias: Record<string, string[]> = {
      fr: ["dim.", "lun.", "mar.", "mer.", "jeu.", "ven.", "sam."],
      en: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    };

    const dateObj = new Date(fechaEvento);
    diaNumero = dateObj.getDate().toString();
    nombreDia = dias[idioma][dateObj.getDay()];
    nombreMes = meses[idioma][dateObj.getMonth()];
  }

  // Mapear subcategoría al icono SVG local (igual que en CardEventoSecReact)
  const getIconSrc = (cat: string | null | undefined): string => {
    if (!cat) return bikeIcon; // default
    const catLower = cat.toLowerCase();
    if (catLower.includes("bike")) return bikeIcon;
    if (catLower.includes("ski")) return skiIcon;
    if (catLower.includes("snow")) return snowboardIcon;
    if (catLower.includes("kids")) return kidsIcon;
    return bikeIcon; // default
  };

  const iconSrc = getIconSrc(subcategoria);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div className="modal modal-react" onClick={handleBackdropClick}>
      <div className="modal-contenido" data-lenis-prevent>
        <span className="cerrar" onClick={onClose}>
          &times;
        </span>

        <div className="encabezado">
          {(fechaEvento || subcategoria) && (
            <div className="modal-meta">
              {fechaEvento ? (
                <div id="fecha">
                  {diaNumero ? (
                    <>
                      <div className="Numerodia">{diaNumero}</div>
                      <div className="mes">{nombreMes}</div>
                      <div className="nombredia">{nombreDia}</div>
                    </>
                  ) : (
                    <div>Fecha no disponible</div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          <div className="thetitle">
            <h2>{title}</h2>
            <div className="sub">
              <img src={iconSrc} alt={subcategoria || "event"} className="icon" />
              {subcategoria && <span className="categoria"> {subcategoria}</span>}
            </div>
          </div>
        </div>

        <div className="bandeja">
          <div className="laimg">
            {imageUrl && <img src={imageUrl} alt={title} />}
          </div>
          <div className="elp">
            {contenidoCompleto && (
              <div
                // Contenido HTML de WordPress
                dangerouslySetInnerHTML={{ __html: contenidoCompleto }}
              />
            )}
          </div>
        </div>

        {pdfUrl && (
          <div className="modal-pdf">
            <a href={pdfUrl} target="_blank" rel="noreferrer" download>
              📄 Descargar PDF
            </a>
          </div>
        )}
      </div>
    </div>,
    document.body
  );

  // Usar Portal para renderizar el modal directamente en el body
  return createPortal(modalContent, document.body);
};

export default ModalEventoReact;
