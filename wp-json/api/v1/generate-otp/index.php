<?php
/**
 * /wp-json/api/v1/generate-otp
 * Stub — OTP flow is bypassed in form.js; this endpoint exists so the
 * JS does not throw a network error if it is ever called.
 */
header('Content-Type: application/json; charset=utf-8');
echo json_encode(['status' => 0, 'message' => 'OTP service not available']);
