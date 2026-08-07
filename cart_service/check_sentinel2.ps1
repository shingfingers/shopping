Add-Type -AssemblyName "System.IO.Compression.FileSystem"

# Check sentinel-web-adapter-common
$common = "D:\repository\com\alibaba\csp\sentinel-web-adapter-common\1.8.9\sentinel-web-adapter-common-1.8.9.jar"
if (Test-Path $common) {
    Write-Host "=== sentinel-web-adapter-common-1.8.9 ==="
    $zip = [System.IO.Compression.ZipFile]::OpenRead($common)
    $found = $zip.Entries | Where-Object { $_.FullName -match "BlockExceptionHandler" }
    foreach ($f in $found) {
        Write-Host "  $($f.FullName)"
    }
    $zip.Dispose()
}

# Find spring-cloud-alibaba-sentinel jar to check auto-config
Write-Host "=== searching for sentinel auto-configuration jars ==="
$dir = "D:\repository\com\alibaba\cloud"
Get-ChildItem -Path $dir -Filter "*.jar" -Recurse | Where-Object { $_.Name -match "spring-cloud-alibaba-sentinel" } | ForEach-Object { Write-Host "  $($_.FullName)" }

# Also check for spring.factories or auto-config imports
$sentinelStarter = Get-ChildItem -Path "D:\repository\com\alibaba\cloud" -Filter "spring-cloud-alibaba-sentinel*.jar" -Recurse | Select-Object -First 1
if ($sentinelStarter) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($sentinelStarter.FullName)
    $entries = $zip.Entries | Where-Object { $_.FullName -match "(spring.factories|BlockExceptionHandler|AutoConfiguration)" }
    foreach ($f in $entries) {
        Write-Host "  $($f.FullName)"
    }
    $zip.Dispose()
}

# Check for sentinel-spring-webmvc-6x-adapter (not v6x, but 6x)
$old6x = "D:\repository\com\alibaba\csp\sentinel-spring-webmvc-6x-adapter\1.8.6\sentinel-spring-webmvc-6x-adapter-1.8.6.jar"
if (Test-Path $old6x) {
    Write-Host "=== sentinel-spring-webmvc-6x-adapter-1.8.6 (old 6x, not v6x) ==="
    $zip = [System.IO.Compression.ZipFile]::OpenRead($old6x)
    $found = $zip.Entries | Where-Object { $_.FullName -match "BlockExceptionHandler" }
    foreach ($f in $found) {
        Write-Host "  $($f.FullName)"
    }
    $zip.Dispose()
}

# Check sentinel-spring-webmvc-adapter 1.8.8 (the old v5 adapter)
$old5 = "D:\repository\com\alibaba\csp\sentinel-spring-webmvc-adapter\1.8.8\sentinel-spring-webmvc-adapter-1.8.8.jar"
if (Test-Path $old5) {
    Write-Host "=== sentinel-spring-webmvc-adapter-1.8.8 (old v5) ==="
    $zip = [System.IO.Compression.ZipFile]::OpenRead($old5)
    $found = $zip.Entries | Where-Object { $_.FullName -match "BlockExceptionHandler" }
    foreach ($f in $found) {
        Write-Host "  $($f.FullName)"
    }
    $zip.Dispose()
}
