# Check 2025.0.0.0 sentinel starter POM and content
Write-Host "=== Checking spring-cloud-starter-alibaba-sentinel:2025.0.0.0 ==="
$pom = "D:\repository\com\alibaba\cloud\spring-cloud-starter-alibaba-sentinel\2025.0.0.0\spring-cloud-starter-alibaba-sentinel-2025.0.0.0.pom"
$content = Get-Content $pom -Raw
Write-Host $content

Write-Host "`n=== Checking spring-cloud-starter-alibaba-sentinel:2025.0.0.0 jar ==="
$jar = "D:\repository\com\alibaba\cloud\spring-cloud-starter-alibaba-sentinel\2025.0.0.0\spring-cloud-starter-alibaba-sentinel-2025.0.0.0.jar"
Add-Type -AssemblyName "System.IO.Compression.FileSystem"
$zip = [System.IO.Compression.ZipFile]::OpenRead($jar)
$entries = $zip.Entries | ForEach-Object { $_.FullName }
Write-Host ($entries -join "`n")
$zip.Dispose()
