# Configuración del Formulario de Contacto

## Archivos creados

1. **`public/contact.php`** - Script PHP que procesa el formulario
2. **Modificaciones en `Contact.astro`** - Formulario con JavaScript para envío AJAX

## Instrucciones de instalación en servidor Apache

### 1. Subir archivos al servidor

Después de hacer el build de tu proyecto Astro, sube los archivos generados a tu servidor Apache:

```bash
npm run build
# o
yarn build
```

Los archivos estarán en la carpeta `dist/`. Sube todo el contenido de esta carpeta a tu servidor.

### 2. Configurar PHP mail()

El script usa la función nativa `mail()` de PHP. Para que funcione correctamente:

#### En el servidor Apache:

1. Asegúrate de que PHP esté instalado y configurado
2. Verifica que la función `mail()` esté habilitada (no esté en `disable_functions`)
3. Configura el servidor SMTP en `php.ini`:

```ini
[mail function]
SMTP = localhost
smtp_port = 25
sendmail_from = noreply@tudominio.com
```

### 3. Personalizar el email de destino

En el archivo `contact.php`, línea 51, cambia el email de destino:

```php
$to = 'info@esscrans-montana.ch'; // Cambia esto a tu email
```

### 4. Probar el formulario

1. Accede a tu sitio web
2. Llena el formulario de contacto
3. Haz clic en "Send"
4. Deberías ver un mensaje de éxito o error
5. Verifica que el email llegue a la bandeja de entrada

## Características implementadas

✅ **Validación de campos** - Todos los campos son obligatorios
✅ **Validación de email** - Verifica formato correcto
✅ **Sanitización de datos** - Previene inyección de código
✅ **Mensajes de éxito/error** - Feedback visual para el usuario
✅ **Limpieza del formulario** - Se limpia automáticamente después del envío exitoso
✅ **Prevención de múltiples envíos** - El botón se deshabilita durante el envío
✅ **Email HTML formateado** - El email se envía con formato profesional
✅ **Responsive** - Funciona en todos los dispositivos

## Solución de problemas

### El email no llega

1. **Verifica los logs de PHP**: Revisa `/var/log/apache2/error.log` o el log de errores de PHP
2. **Verifica la configuración SMTP**: Asegúrate de que el servidor tenga un servidor SMTP configurado
3. **Revisa la carpeta de spam**: Los emails enviados con `mail()` a veces van a spam
4. **Usa un servicio SMTP externo**: Si el servidor no tiene SMTP configurado, considera usar servicios como SendGrid, Mailgun, o SMTP de Gmail

### Error CORS

Si recibes errores de CORS en desarrollo local, es normal. El formulario funcionará correctamente en producción cuando esté en el mismo dominio.

### El formulario no envía

1. Abre la consola del navegador (F12) y busca errores
2. Verifica que la ruta `/contact.php` sea correcta
3. Asegúrate de que PHP esté procesando archivos `.php`

## Mejoras opcionales

### Usar un servicio SMTP externo

Si `mail()` no funciona bien, puedes usar PHPMailer o SwiftMailer con un servicio SMTP externo. Esto requeriría instalar bibliotecas adicionales, pero es más confiable.

### Agregar CAPTCHA

Para prevenir spam, considera agregar Google reCAPTCHA v3.

### Guardar mensajes en base de datos

Además de enviar por email, podrías guardar los mensajes en una base de datos MySQL.
