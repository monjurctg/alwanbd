<?php
// removecache.php

// Optional: security key
$secret = 'clear'; // change this!
if (!isset($_GET['key']) || $_GET['key'] !== $secret) {
    die('❌ Unauthorized');
}

// Load Composer autoload
require __DIR__.'/vendor/autoload.php';

// Boot the application
$app = require_once __DIR__.'/bootstrap/app.php';

// Bootstrap the console kernel (so we can use Cache)
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Cache;

// Clear caches
try {
    // Flush default cache
    Cache::flush();

    // Flush tagged caches if supported
    if (Cache::supportsTags()) {
        Cache::tags([
            'menus',
            'mega_menus',
            'page_variation',
            'categories',
            'footer',
        ])->flush();
    }

    echo "✅ All caches cleared successfully!";
} catch (\Exception $e) {
    echo "❌ Error clearing cache: " . $e->getMessage();
}
