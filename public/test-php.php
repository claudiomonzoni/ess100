<?php
// Archivo de prueba para verificar que PHP funciona correctamente
header('Content-Type: application/json');

$phpVersion = phpversion();
$mailFunction = function_exists('mail') ? 'disponible' : 'NO disponible';

$response = [
    'success' => true,
    'message' => 'PHP está funcionando correctamente',
    'php_version' => $phpVersion,
    'mail_function' => $mailFunction,
    'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Desconocido',
    'timestamp' => date('Y-m-d H:i:s')
];

echo json_encode($response, JSON_PRETTY_PRINT);
