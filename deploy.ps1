# Сборка архива для Netlify Drop: https://app.netlify.com/drop
$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$website = Join-Path $root "website"
$zip = Join-Path $root "qsfm-website.zip"

if (Test-Path $zip) { Remove-Item $zip -Force }

Compress-Archive -Path (Join-Path $website "*") -DestinationPath $zip -Force

Write-Host ""
Write-Host "  Архив готов: $zip" -ForegroundColor Green
Write-Host ""
Write-Host "  Netlify Drop (самый быстрый способ):" -ForegroundColor Cyan
Write-Host "  1. Откройте https://app.netlify.com/drop"
Write-Host "  2. Перетащите файл qsfm-website.zip в окно браузера"
Write-Host "  3. Сайт получит адрес вида https://random-name.netlify.app"
Write-Host ""
Start-Process "https://app.netlify.com/drop"
Start-Process explorer.exe -ArgumentList "/select,`"$zip`""
