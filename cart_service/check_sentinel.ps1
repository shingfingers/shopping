Add-Type -AssemblyName "System.IO.Compression.FileSystem"

$v6x = "D:\repository\com\alibaba\csp\sentinel-spring-webmvc-v6x-adapter\1.8.9\sentinel-spring-webmvc-v6x-adapter-1.8.9.jar"
if (Test-Path $v6x) {
    Write-Host "=== v6x adapter jar ==="
    $zip = [System.IO.Compression.ZipFile]::OpenRead($v6x)
    $found = $zip.Entries | Where-Object { $_.FullName -match "BlockExceptionHandler" }
    foreach ($f in $found) {
        Write-Host "  $($f.FullName)"
    }
    $zip.Dispose()
} else {
    Write-Host "v6x jar NOT found at $v6x"
}

# Also check the old adapter if exists
$old = "D:\repository\com\alibaba\csp\sentinel-spring-webmvc-adapter\1.8.9\sentinel-spring-webmvc-adapter-1.8.9.jar"
if (Test-Path $old) {
    Write-Host "=== old adapter jar ==="
    $zip = [System.IO.Compression.ZipFile]::OpenRead($old)
    $found = $zip.Entries | Where-Object { $_.FullName -match "BlockExceptionHandler" }
    foreach ($f in $found) {
        Write-Host "  $($f.FullName)"
    }
    $zip.Dispose()
} else {
    Write-Host "old adapter jar NOT found at $old"
}

# Check what sentinel jars exist
Write-Host "=== sentinel jars in repository ==="
$dir = "D:\repository\com\alibaba\csp"
Get-ChildItem -Path $dir -Filter "*.jar" -Recurse | Where-Object { $_.Name -match "sentinel" } | ForEach-Object { Write-Host "  $($_.FullName)" }
