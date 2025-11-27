import React, { useEffect, useState } from "react";
import CardEventoPrincipalReact from "./CardEventoPrincipalReact";
import type { EventoProcesado } from "./CardEventoPrincipalReact";
import ModalEventoReact from "./ModalEventoReact";

interface Props {
  apiUrl: string;
}

const DEFAULT_IMAGE = "/100/default-event.jpg";

const EventosPrincipalClient: React.FC<Props> = ({ apiUrl }) => {
  const [eventos, setEventos] = useState<EventoProcesado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seleccionado, setSeleccionado] = useState<EventoProcesado | null>(null);

  useEffect(() => {
    let cancelado = false;

    const cargarEventos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(apiUrl);
        const todos = await response.json();

        const sticky = (todos as any[]).filter(
          (evento) => evento.sticky === true
        );

        const enriquecidos: EventoProcesado[] = await Promise.all(
          sticky.map(async (evento: any) => {
            // Imagen de alta resolución (misma lógica que en Astro)
            let imagenUrl = DEFAULT_IMAGE;
            if (evento.featured_media) {
              try {
                const mediaRes = await fetch(
                  `https://esscrans-montana.ch/wp-json/wp/v2/media/${evento.featured_media}`
                );
                const media = await mediaRes.json();
                imagenUrl =
                  media?.media_details?.sizes?.large?.source_url ??
                  media?.media_details?.sizes?.full?.source_url ??
                  media?.media_details?.sizes?.medium?.source_url ??
                  media?.source_url ??
                  DEFAULT_IMAGE;
              } catch {
                imagenUrl = DEFAULT_IMAGE;
              }
            }

            // Fecha del evento
            const fechaEvento: string | undefined =
              evento.meta?.fecha_evento || undefined;

            // Subcategoría (ID distinto a 45)
            let subcategoria: string | null = null;
            if (evento.categories && Array.isArray(evento.categories)) {
              const subcatId = evento.categories.find(
                (id: number) => id !== 45
              );
              if (subcatId) {
                try {
                  const catRes = await fetch(
                    `https://esscrans-montana.ch/wp-json/wp/v2/categories/${subcatId}`
                  );
                  const categoria = await catRes.json();
                  subcategoria = categoria?.name || null;
                } catch {
                  subcategoria = null;
                }
              }
            }

            return {
              id: evento.id,
              title: evento.title?.rendered || "Sin título",
              excerpt: evento.excerpt?.rendered || "Sin descripción",
              content: evento.content?.rendered || "Sin contenido",
              imagenUrl,
              pdfUrl: evento.acf?.pdf_url || undefined,
              fechaEvento,
              subcategoria,
            };
          })
        );

        if (!cancelado) {
          setEventos(enriquecidos);
        }
      } catch (err) {
        if (!cancelado) {
          setError("Error al cargar eventos.");
          setEventos([]);
        }
      } finally {
        if (!cancelado) {
          setLoading(false);
        }
      }
    };

    void cargarEventos();

    return () => {
      cancelado = true;
    };
  }, [apiUrl]);

  const handleOpen = (evento: EventoProcesado) => {
    setSeleccionado(evento);
    document.body.classList.add("no-scroll");
  };

  const handleClose = () => {
    setSeleccionado(null);
    document.body.classList.remove("no-scroll");
  };

  if (loading) {
    return <p>chargement de données</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!eventos.length) {
    return <p>No hay eventos destacados disponibles.</p>;
  }

  return (
    <>
      {eventos.map((evento) => (
        <CardEventoPrincipalReact
          key={evento.id}
          evento={evento}
          onOpen={() => handleOpen(evento)}
        />
      ))}

      {seleccionado && (
        <ModalEventoReact
          isOpen={!!seleccionado}
          title={seleccionado.title}
          imageUrl={seleccionado.imagenUrl}
          contenidoCompleto={seleccionado.content}
          pdfUrl={seleccionado.pdfUrl}
          fechaEvento={seleccionado.fechaEvento}
          subcategoria={seleccionado.subcategoria ?? undefined}
          onClose={handleClose}
        />
      )}
    </>
  );
};

export default EventosPrincipalClient;


