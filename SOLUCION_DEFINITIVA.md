# 🎯 SOLUCIÓN DEFINITIVA - Error installHooks.js

## 🔍 PROBLEMA ENCONTRADO

El error NO era por `contact.php` en sí, sino por la **URL incorrecta**.

### Lo que estaba pasando:

1. ❌ El formulario enviaba a `/contact.php`
2. ❌ Pero tu sitio está en `/100/`, así que debería ser `/100/contact.php`
3. ❌ La petición a `/contact.php` era interceptada por un **plugin de traducción** (qtrans)
4. ❌ Ese plugin devolvía HTML en lugar de JSON
5. ❌ JavaScript intentaba parsear HTML como JSON → **ERROR**

### La evidencia:

En la pestaña Response viste:
- `set-cookie: qtrans_front_language=en` ← Plugin de traducción
- `content-type: text/html` ← HTML en lugar de JSON
- `server: nginx` ← Servidor nginx (no Apache)

## ✅ SOLUCIÓN APLICADA

He corregido la URL en `Contact.astro`:

**ANTES** (incorrecto):
```javascript
const response = await fetch("/contact.php", {
```

**DESPUÉS** (correcto):
```javascript
const response = await fetch("/100/contact.php", {
```

## 🚀 PASOS FINALES (IMPORTANTE)

### 1. Reconstruir el proyecto

Ejecuta en tu terminal:

```bash
yarn build
```

Esto generará los archivos actualizados en `dist/`

### 2. Subir archivos al servidor

Sube estos archivos desde `dist/` a tu servidor (carpeta `/100/`):

**Archivos que DEBES subir**:
- ✅ `index.html` (actualizado con la URL correcta)
- ✅ `en/index.html` (versión en inglés)
- ✅ `contact.php` (con mejor manejo de errores)
- ✅ Carpeta `_astro/` completa (JavaScript actualizado)

**IMPORTANTE**: No solo subas `contact.php`, también necesitas subir los archivos HTML y JS actualizados.

### 3. Limpiar caché del navegador

**MUY IMPORTANTE** - El navegador tiene en caché el JavaScript antiguo:

- **Windows/Linux**: `Ctrl + Shift + R`
- **Mac**: `Cmd + Shift + R`

O desde las herramientas de desarrollador:
1. F12 → Clic derecho en recargar
2. "Vaciar caché y recargar de forma forzada"

### 4. Probar el formulario

1. Ve a: `http://esscrans-montana.ch/100/`
2. Abre herramientas de desarrollador (F12)
3. Pestaña "Network" (Red)
4. Envía el formulario
5. Verifica que la petición va a `/100/contact.php`

## 🎯 RESULTADO ESPERADO

Después de estos pasos:

✅ La petición irá a `/100/contact.php` (no a `/contact.php`)
✅ `contact.php` devolverá JSON válido
✅ El error de "installHooks.js" desaparecerá
✅ El formulario funcionará correctamente

## 📋 CHECKLIST COMPLETO

- [ ] Ejecuté `yarn build`
- [ ] Subí `index.html` actualizado
- [ ] Subí `en/index.html` actualizado
- [ ] Subí `contact.php` actualizado
- [ ] Subí la carpeta `_astro/` completa
- [ ] Limpié la caché del navegador (Ctrl + Shift + R)
- [ ] Probé el formulario
- [ ] Verifiqué en Network que va a `/100/contact.php`

## 🔧 VERIFICACIÓN

En las herramientas de desarrollador (F12), pestaña Network:

**ANTES** (incorrecto):
```
Request URL: http://esscrans-montana.ch/contact.php
```

**DESPUÉS** (correcto):
```
Request URL: http://esscrans-montana.ch/100/contact.php
```

## ⚡ COMANDO RÁPIDO

```bash
yarn build
```

Luego sube TODO el contenido de `dist/` al servidor (reemplazando los archivos existentes).

---

**NOTA**: El problema era que el sitio está en `/100/` pero el formulario enviaba a `/contact.php` (raíz), 
por lo que era interceptado por el plugin de traducción del sitio principal.
