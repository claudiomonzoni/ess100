<?php
// Suprimir errores de PHP para evitar que rompan el JSON
error_reporting(0);
ini_set('display_errors', 0);

// Iniciar buffer de salida para capturar cualquier error
ob_start();

// Función para enviar respuesta JSON
function sendJsonResponse($response, $httpCode = 200) {
    // Limpiar cualquier salida previa
    if (ob_get_length()) ob_clean();
    
    http_response_code($httpCode);
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
    
    echo json_encode($response);
    exit;
}

// Manejador de errores personalizado
set_error_handler(function($errno, $errstr, $errfile, $errline) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Erreur serveur.',
        'debug' => "Error: $errstr en $errfile:$errline"
    ], 500);
});

// Manejador de excepciones
set_exception_handler(function($exception) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Erreur serveur.',
        'debug' => $exception->getMessage()
    ], 500);
});

try {
    // Respuesta por defecto
    $response = [
        'success' => false,
        'message' => 'Erreur inconnue'
    ];

// Verificar que sea una petición POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = 'Méthode non autorisée';
    sendJsonResponse($response, 405);
}

// Obtener los datos del formulario
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validar campos requeridos
if (empty($name) || empty($email) || empty($message)) {
    $response['message'] = 'Tous les champs sont obligatoires';
    sendJsonResponse($response, 400);
}

// Validar formato de email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = 'L\'email n\'est pas valide';
    sendJsonResponse($response, 400);
}

// Sanitizar datos
$name = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Configurar el email
$to = 'claudiomonzoni@hotmail.com'; // Email de destino
// $to = 'info@esscrans-montana.ch'; // Email de destino
$subject = 'Nouveau message d\'Ess pour ses 100 ans';

// Crear el cuerpo del email en HTML
$email_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #C8A882; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #C8A882; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h2>Nouveau message d'Ess pour ses 100 ans</h2>
        </div>
        <div class='content'>
            <div class='field'>
                <span class='label'>Nom:</span><br>
                {$name}
            </div>
            <div class='field'>
                <span class='label'>Email:</span><br>
                {$email}
            </div>
            <div class='field'>
                <span class='label'>Message:</span><br>
                " . nl2br($message) . "
            </div>
        </div>
        <div class='footer'>
            <p>Ce message a été envoyé depuis le formulaire de contact de École suisse de ski Crans-Montana</p>
        </div>
    </div>
</body>
</html>
";

// Headers del email
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: " . $email . "\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Intentar enviar el email
if (mail($to, $subject, $email_body, $headers)) {
    $response['success'] = true;
    $response['message'] = 'Message envoyé avec succès ! Nous vous contacterons prochainement.';
    sendJsonResponse($response, 200);
} else {
    $response['message'] = 'Erreur lors de l\'envoi du message. Veuillez réessayer.';
    sendJsonResponse($response, 500);
}

} catch (Exception $e) {
    sendJsonResponse([
        'success' => false,
        'message' => 'Erreur serveur.',
        'debug' => $e->getMessage()
    ], 500);
}

