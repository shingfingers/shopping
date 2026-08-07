Add-Type -AssemblyName "System.IO.Compression.FileSystem"

# 1. Find spring-cloud-starter-alibaba-sentinel main jar
Write-Host "=== Finding spring-cloud-starter-alibaba-sentinel jars ==="
$dir = "D:\repository\com\alibaba\cloud"
Get-ChildItem -Path $dir -Filter "*.jar" -Recurse | Where-Object { $_.Name -match "spring-cloud-starter-alibaba-sentinel" } | ForEach-Object { Write-Host "  $($_.FullName)" }

# 2. Find spring-cloud-alibaba-sentinel core jar (not datasource)
Write-Host "=== Finding spring-cloud-alibaba-sentinel core jars ==="
Get-ChildItem -Path $dir -Filter "*.jar" -Recurse | Where-Object { $_.Name -match "spring-cloud-alibaba-sentinel\b" -and $_.Name -notmatch "datasource" } | ForEach-Object { Write-Host "  $($_.FullName)" }

# 3. Check if any pom references the old 6x adapter
Write-Host "=== Searching for sentinel-spring-webmvc-6x-adapter in POMs ==="
$poms = Get-ChildItem -Path "D:\repository\com\alibaba" -Filter "*.pom" -Recurse | Where-Object { $_.Name -match "spring-cloud-alibaba-sentinel|spring-cloud-starter-alibaba-sentinel" }
foreach ($pom in $poms) {
    $content = Get-Content $pom.FullName -Raw
    if ($content -match "sentinel-spring-webmvc-6x") {
        Write-Host "  FOUND in $($pom.FullName): sentinel-spring-webmvc-6x"
    }
    if ($content -match "BlockExceptionHandler") {
        Write-Host "  FOUND in $($pom.FullName): BlockExceptionHandler reference"
    }
}
