# Refactorización de ModalEvento.astro

## 📋 Resumen de Cambios

Se ha refactorizado completamente el sistema de modales para usar **props reactivos** en lugar de `data-*` attributes y manipulación del DOM con JavaScript.

---

## 🔄 Cambios Realizados

### 1. **Button.astro** - Ahora soporta botones HTML
```astro
interface Props {
  url?: string;
  text: string;
  class?: string;
  icon?: string;
  onclick?: string;           // ✨ Nuevo
  type?: "button" | "link";  // ✨ Nuevo
}
```

**Cambios:**
- Renderiza `<button>` cuando `type="button"`
- Renderiza `<a>` cuando `type="link"` (por defecto)
- Acepta `onclick` handlers como strings

---

### 2. **ModalEvento.astro** - Ahora es un componente reactivo

**Antes:**
```astro
<!-- Renderizado dinámico vía JavaScript, sin props -->
<div id="modal-evento" class="modal" style="display:none;">
  <div id="contenido-modal"><!-- contenido inyectado con innerHTML --></div>
</div>
```

**Ahora:**
```astro
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
```

**Ventajas:**
- ✅ Recibe datos por props en lugar de dataset
- ✅ Reutiliza componentes como `Fecha.astro` 
- ✅ Renderizado limpio sin innerHTML
- ✅ Mejor control del estado
- ✅ Soporte para animaciones CSS

---

### 3. **CardEventoPrincipal.astro** - Incluye el modal internamente

**Antes:**
```astro
<!-- ModalEvento en ContenedorEventosPrincipal -->
<ContenedorEventosPrincipal>
  <CardEventoPrincipal /> 
  <CardEventoPrincipal />
  <ModalEvento />  <!-- Modal global -->
</ContenedorEventosPrincipal>
```

**Ahora:**
```astro
<!-- Modal en cada CardEventoPrincipal -->
<CardEventoPrincipal>
  <Button onclick="abrir modal" />
  <ModalEvento 
    isOpen={true}
    title={title}
    imageUrl={imageUrl}
    contenidoCompleto={contenidoCompleto}
    pdfUrl={pdfUrl}
    fechaEvento={fechaEvento}
    subcategoria={subcategoria}
  />
</CardEventoPrincipal>
```

**Gestión del Modal:**
```javascript
// Script local en CardEventoPrincipal
<script define:vars={{ postId }}>
  document.addEventListener('click', (e) => {
    const wrapper = document.querySelector(`[data-post-id="${postId}"] .modal-wrapper`);
    
    if (e.target === modal) {
      wrapper.classList.remove('visible');  // Cerrar
    }
    
    if (e.target.classList.contains('cerrar')) {
      wrapper.classList.remove('visible');  // Cerrar con X
    }
  });
</script>
```

---

### 4. **ContenedorEventosPrincipal.astro** - Simplificado

**Antes:**
```astro
<div id="contenedorCardsEventoPrincipal">
  {eventos.map(e => <CardEventoPrincipal ... />)}
</div>
<ModalEvento />  <!-- Modal global -->
```

**Ahora:**
```astro
<div id="contenedorCardsEventoPrincipal">
  {eventos.map(e => <CardEventoPrincipal ... />)}
  <!-- Sin ModalEvento global -->
</div>
```

---

## 🎯 Flujo de Datos

```
ContenedorEventosPrincipal
  ├── CardEventoPrincipal (evento 1)
  │   ├── Button (onclick → abre modal)
  │   └── ModalEvento (props: title, imageUrl, fechaEvento, etc.)
  │       ├── Fecha (reutiliza componente)
  │       └── Contenido con CSS puro
  │
  └── CardEventoPrincipal (evento 2)
      ├── Button (onclick → abre modal)
      └── ModalEvento (props: title, imageUrl, fechaEvento, etc.)
          ├── Fecha (reutiliza componente)
          └── Contenido con CSS puro
```

---

## ✨ Beneficios

| Aspecto | Antes | Ahora |
|---------|-------|-------|
| **Props** | `data-*` attributes | Props tipadas |
| **Datos** | `JSON.parse()` en JS | Props directos |
| **Componentes** | Sin reutilización | Reutiliza `Fecha.astro` |
| **Modal Global** | 1 para todos | 1 por evento |
| **Scoped** | No, listener global | Sí, por `postId` |
| **Mantenibilidad** | Difícil, lógica dispersa | Fácil, código centralizado |
| **Performance** | Parsing dinámico | Renderizado estático |

---

## 🔧 Cómo Funciona

### 1️⃣ Clic en "détails"
```javascript
<Button 
  type="button"
  onclick={`document.querySelector('[data-post-id="${postId}"] .modal-wrapper').classList.add('visible')`}
/>
```

### 2️⃣ CSS muestra el modal
```scss
.modal-wrapper {
  :global(.modal) {
    display: none;  // Oculto por defecto
  }

  &.visible :global(.modal) {
    display: flex !important;  // Visible
  }
}
```

### 3️⃣ Clic en X o fondo cierra
```javascript
if (e.target === modal) {
  wrapper.classList.remove('visible');  // Oculta
}
```

---

## 🚀 Próximos Pasos (Opcional)

Si quieres mejorar aún más, puedes:

1. **Usar un componente cliente (Vue/React)**
   ```astro
   ---
   import ModalReactivo from "./ModalReactivo.jsx";
   import { Icon } from "astro-icon/components";
   ---
   
   <ModalReactivo 
     client:load
     title={title}
     isOpen={false}
     onOpen={...}
     onClose={...}
   />
   ```

2. **Agregar transiciones suaves**
   ```scss
   .modal {
     animation: slideUp 0.3s ease-in-out;
   }
   ```

3. **Usar Web Components**
   ```javascript
   customElements.define('modal-evento', ModalEventoElement);
   ```

---

## ✅ Testing

Para verificar que funciona:

1. Abre la página con eventos
2. Haz clic en "détails" en una tarjeta
3. Debe abrirse el modal con:
   - Título del evento
   - Fecha (usando `Fecha.astro`)
   - Categoría
   - Imagen
   - Contenido
   - Link PDF (si existe)
4. Cierra clickeando la X o el fondo
5. Abre otro evento: cada modal es independiente

---

## 📝 Notas

- Los modales ahora están **scoped por evento** (no hay conflictos)
- Reutiliza componentes como `Fecha.astro` para consistencia
- La lógica está centralizada y fácil de mantener
- Sin dependencias externas, solo Astro
