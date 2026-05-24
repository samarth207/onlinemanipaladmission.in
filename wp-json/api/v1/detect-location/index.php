<?php
/**
 * /wp-json/api/v1/detect-location
 * Returns India as the default country so the phone flag dropdown
 * initialises correctly without needing a third-party geolocation service.
 */
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

echo json_encode([
    'country_code' => 'IN',
    'country'      => 'India',
    'city'         => '',
]);
