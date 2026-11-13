$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path $PSScriptRoot -Parent
$packages = Join-Path $projectRoot 'tools/office-assets'
$target = Join-Path $projectRoot 'public/office/vendor'
& npm ci --prefix $packages --ignore-scripts --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { throw 'Office assets dependency install failed' }
$ocr = Join-Path $target 'ocr'
$qr = Join-Path $target 'qr'
New-Item -ItemType Directory -Path $ocr,$qr -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $packages 'node_modules/tesseract.js/dist/tesseract.min.js') -Destination $ocr
Copy-Item -LiteralPath (Join-Path $packages 'node_modules/tesseract.js/dist/worker.min.js') -Destination $ocr
Copy-Item -LiteralPath (Join-Path $packages 'node_modules/tesseract.js/LICENSE.md') -Destination $ocr
Get-ChildItem -LiteralPath (Join-Path $packages 'node_modules/tesseract.js-core') -Filter 'tesseract-core*' -File | ForEach-Object { Copy-Item -LiteralPath $_.FullName -Destination $ocr }
Copy-Item -LiteralPath (Join-Path $packages 'node_modules/qrcode-generator/qrcode.js') -Destination $qr
Copy-Item -LiteralPath (Join-Path $packages 'node_modules/qrcode-generator/README.md') -Destination $qr
$manifest = Get-Content -LiteralPath (Join-Path $projectRoot 'tools/office-assets/model.json') -Raw | ConvertFrom-Json
$model = Join-Path $ocr 'eng.traineddata.gz'
if (!(Test-Path -LiteralPath $model)) { Invoke-WebRequest $manifest.url -OutFile $model }
if ((Get-FileHash -LiteralPath $model -Algorithm SHA256).Hash.ToLower() -ne $manifest.sha256) { throw 'OCR model checksum mismatch' }
Write-Output 'Office OCR and QR assets ready. No image or inventory data transmitted.'
