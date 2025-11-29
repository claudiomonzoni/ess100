# 🔧 Solución al Error "installHooks.js"

## 📋 Diagnóstico del Problema

El error **NO** es realmente sobre `installHooks.js`. El problema real es:

1. **El archivo `contact.php` está generando un error de PHP** (probablemente "Fatal error...")
2. **Este error se muestra como texto plano** en lugar de JSON
3. **El JavaScript del frontend intenta parsear este error como JSON** y falla con:
   ```
   Error: SyntaxError: Unexpected token 'F', "Fatal erro"... is not valid JSON
   ```

## ✅ Soluciones Implementadas

He actualizado `contact.php` con las siguientes mejoras:

### 1. **Manejo Robusto de Errores**
- Supresión de errores de PHP que rompen el JSON
- Buffer de salida para capturar errores
- Manejadores personalizados de errores y excepciones
- **Garantía de que SIEMPRE se devuelve JSON válido**

### 2. **Función Centralizada de Respuesta**
- Nueva función `sendJsonResponse()` que:
  - Limpia cualquier salida previa
  - Establece los headers correctos
  - Envía JSON válido
  - Termina la ejecución limpiamente

## 🚀 Pasos para Resolver el Problema

### Paso 1: Reconstruir el proyecto
```bash
yarn build
```

### Paso 2: Subir archivos actualizados al servidor

Sube estos archivos desde la carpeta `dist/` a tu servidor:
- ✅ `contact.php` (actualizado con mejor manejo de errores)
- ✅ `test-php.php` (nuevo archivo de prueba)

### Paso 3: Probar PHP en el servidor

Visita en tu navegador:
```
http://esscrans-montana.ch/100/test-php.php
```

Deberías ver una respuesta JSON como:
```json
{
    "success": true,
    "message": "PHP está funcionando correctamente",
    "php_version": "8.x.x",
    "mail_function": "disponible",
    "server_software": "Apache/2.x.x",
    "timestamp": "2025-11-29 13:30:00"
}
```

**⚠️ IMPORTANTE**: Verifica que `mail_function` diga **"disponible"**. Si dice "NO disponible", el servidor no puede enviar emails.

### Paso 4: Probar el formulario de contacto

1. Ve a tu sitio: `http://esscrans-montana.ch/100/`
2. Llena el formulario de contacto
3. Envía el mensaje
4. Deberías ver un mensaje de éxito o error (pero ya NO el error de JSON)

## 🔍 Posibles Causas del Error Original

### Causa 1: Función `mail()` no disponible
Si la función `mail()` de PHP no está disponible en tu servidor, PHP podría generar un error fatal.

**Solución**: 
- Contacta a tu proveedor de hosting para habilitar la función `mail()`
- O usa una alternativa como PHPMailer o SMTP

### Causa 2: Versión de PHP muy antigua
Si el servidor usa PHP 5.x o anterior, algunas funciones modernas podrían fallar.

**Solución**:
- Verifica la versión con `test-php.php`
- Solicita a tu hosting actualizar a PHP 7.4 o superior

### Causa 3: Headers ya enviados
Si hay espacios o caracteres antes de `<?php`, los headers fallan.

**Solución**: 
- Ya está resuelto con el buffer de salida (`ob_start()`)

### Causa 4: Permisos de archivo
El archivo PHP podría no tener permisos de ejecución.

**Solución**:
- Establece permisos 644 para `contact.php`
- Comando FTP: `chmod 644 contact.php`

## 🐛 Debugging Avanzado

Si el problema persiste, puedes habilitar el modo debug temporalmente:

### Opción 1: Ver errores de PHP (SOLO para debugging)

Edita temporalmente `contact.php` y cambia las líneas 3-4:
```php
// ANTES (producción - oculta errores)
error_reporting(0);
ini_set('display_errors', 0);

// DESPUÉS (debug - muestra errores)
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

**⚠️ IMPORTANTE**: Vuelve a desactivar después de encontrar el error.

### Opción 2: Revisar logs del servidor

Pide a tu proveedor de hosting acceso a:
- `error_log` de PHP
- Logs de Apache/Nginx

### Opción 3: Usar la consola del navegador

1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network" (Red)
3. Envía el formulario
4. Haz clic en la petición a `contact.php`
5. Ve a la pestaña "Response" para ver el error exacto

## 📧 Alternativa: Usar un Servicio de Email

Si `mail()` no funciona, considera usar:

### Opción A: PHPMailer
Librería popular para enviar emails vía SMTP

### Opción B: Servicios de terceros
- SendGrid
- Mailgun
- Amazon SES
- Resend

### Opción C: Formspree o similar
Servicios que manejan formularios sin necesidad de PHP

## ✅ Checklist de Verificación

- [ ] Ejecuté `yarn build` localmente
- [ ] Subí `contact.php` actualizado al servidor
- [ ] Subí `test-php.php` al servidor
- [ ] Probé `test-php.php` en el navegador
- [ ] Verifiqué que PHP funciona correctamente
- [ ] Verifiqué que `mail()` está disponible
- [ ] Probé el formulario de contacto
- [ ] El formulario devuelve JSON válido (éxito o error)
- [ ] Eliminé `test-php.php` del servidor (después de probar)

## 🎯 Resultado Esperado

Después de aplicar estos cambios:

✅ **El error de JSON desaparece**
✅ **Siempre recibes una respuesta JSON válida**
✅ **Los errores se manejan correctamente**
✅ **El formulario funciona o muestra un mensaje de error claro**

## 📞 Siguiente Paso

1. **Reconstruye el proyecto**: `yarn build`
2. **Sube los archivos actualizados** al servidor
3. **Prueba `test-php.php`** para verificar PHP
4. **Prueba el formulario** de contacto
5. **Reporta los resultados** que veas en `test-php.php`

Si después de esto sigues teniendo problemas, necesitaré saber:
- ¿Qué muestra `test-php.php`?
- ¿Qué error exacto aparece en la consola del navegador?
- ¿Qué versión de PHP tiene el servidor?
