<?php
$secret = "MyStrongPassword123";
if (!isset($_GET['key']) || $_GET['key'] !== $secret) {
    http_response_code(403);
    die("<div style='font-family: Arial, sans-serif; padding: 20px; background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; border-radius: 5px; max-width: 600px; margin: 50px auto;'>Access Denied - Invalid or missing key</div>");
}

$publicDir = '/home/alamagro/public_html/alwanbd.alamagro.com';
$gitRepo   = 'https://github.com/monjurctg/alwan.git';

chdir($publicDir);

function runCommand($cmd) {
    echo "<div style='background: #2d3748; color: #e2e8f0; padding: 10px 15px; border-radius: 5px; margin: 10px 0; font-family: monospace; white-space: pre-wrap;'>";
    echo "<span style='color: #81e6d9'>$</span> <span style='color: #fff'>".htmlspecialchars($cmd)."</span>\n";

    $proc = popen($cmd . ' 2>&1', 'r');
    while (!feof($proc)) {
        $line = fgets($proc);
        if ($line !== false) {
            echo htmlspecialchars($line);
            flush();
        }
    }
    pclose($proc);
    echo "</div>";
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deployment Script</title>
    <style>
        body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background: #f5f7fa; }
        .header { background: #4a5568; color: white; padding: 20px; border-radius: 5px 5px 0 0; margin-bottom: 20px; }
        .container { background: white; border-radius: 5px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 20px; margin-bottom: 20px; }
        .success { background: #48bb78; color: white; padding: 15px; border-radius: 5px; text-align: center; font-weight: bold; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Laravel Git Deployment</h1>
        <p>Deploying to: <?php echo htmlspecialchars($publicDir); ?></p>
    </div>

    <div class="container">
        <?php
        // Git setup
        if (!is_dir($publicDir . '/.git')) {
            echo "<h2>Initializing Git Repository</h2>";
            runCommand("git init");
            runCommand("git remote add origin $gitRepo");
            runCommand("git fetch origin");
            runCommand("git reset --hard origin/main");
        } else {
            echo "<h2>Updating Repository</h2>";
            runCommand("git pull origin main");
        }

        // Laravel setup
        echo "<h2>Installing Dependencies</h2>";
        runCommand("composer install --no-dev --optimize-autoloader");

        echo "<h2>Clearing Cache</h2>";
        runCommand("php artisan config:clear");
        runCommand("php artisan cache:clear");
        runCommand("php artisan route:clear");
        runCommand("php artisan view:clear");

        echo "<h2>Database Migration</h2>";
        runCommand("php artisan migrate --force");

        echo "<h2>Setting Permissions</h2>";
        runCommand("chmod -R 775 storage bootstrap/cache");
        ?>


        <div class="success">
            Deployment completed successfully!
        </div>
    </div>
</body>
</html>
