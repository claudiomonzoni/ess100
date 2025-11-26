import React from "react";

export interface EventoProcesado {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imagenUrl: string;
  pdfUrl?: string;
  fechaEvento?: string;
  subcategoria?: string | null;
}

interface Props {
  evento: EventoProcesado;
  onOpen: () => void;
}

const CardEventoPrincipalReact: React.FC<Props> = ({ evento, onOpen }) => {
  const { id, title, excerpt, imagenUrl } = evento;

  return (
    <div className="CartaEventoPrincipal" data-post-id={id}>
      <div id="elh">
        <h3>{title}</h3>
      </div>
      <div id="eltxt">
        <p dangerouslySetInnerHTML={{ __html: excerpt }} />
      </div>

      <div id="elbtn">
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

      <img src={imagenUrl} alt={title} />
    </div>
  );
};

export default CardEventoPrincipalReact;


