import React from "react";
import type { EventoProcesado } from "./CardEventoPrincipalReact";
import bikeIcon from "../../icons/bike.svg?url";
import skiIcon from "../../icons/ski.svg?url";
import snowboardIcon from "../../icons/snowboard.svg?url";
import kidsIcon from "../../icons/kids.svg?url";

interface Props {
  evento: EventoProcesado;
  onOpen: () => void;
}

const CardEventoSecReact: React.FC<Props> = ({ evento, onOpen }) => {
  const { id, title, excerpt, subcategoria } = evento;

  // Mapear subcategoría al icono SVG local
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

  return (
    <div
      className="cardEventoSec"
      data-post-id={id}
      data-post-cat={subcategoria ?? ""}
    >
      <div className="info">
        <h3>{title}</h3>
        <div className="sub">
          {subcategoria && <span className="categoria">{subcategoria}</span>}
        </div>
        <p dangerouslySetInnerHTML={{ __html: excerpt }} />
      </div>

      <div className="der">
        <div className="ico">
          <img src={iconSrc} alt={subcategoria || "event"} className="icon" />
        </div>
        <div className="elbtn">
          <button
            type="button"
            className="btn"
            onClick={(e) => {
              e.preventDefault();
              onOpen();
            }}
          >
            détails
            <span className="icon" aria-hidden="true">
              ›
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardEventoSecReact;


