<?php
/**
 * /wp-json/api/v1/verify-otp
 * Stub — OTP flow is bypassed in form.js.
 */
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['status' => 0, 'message' => 'OTP service not available']);
