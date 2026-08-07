Add-Type -AssemblyName "System.IO.Compression.FileSystem"

$v6x = "D:\repository\com\alibaba\csp\sentinel-spring-webmvc-v6x-adapter\1.8.9\sentinel-spring-webmvc-v6x-adapter-1.8.9.jar"

$zip = [System.IO.Compression.ZipFile]::OpenRead($v6x)

# Extract BlockExceptionHandler.class to temp dir
$tmpDir = [System.IO.Path]::GetTempPath() + "sentinel_check"
if (!(Test-Path $tmpDir)) { New-Item -ItemType Directory -Path $tmpDir -Force | Out-Null }

$entry = $zip.Entries | Where-Object { $_.FullName -eq "com/alibaba/csp/sentinel/adapter/spring/webmvc_v6x/callback/BlockExceptionHandler.class" }
if ($entry) {
    $outPath = [System.IO.Path]::Combine($tmpDir, "BlockExceptionHandler.class")
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $outPath, $true)
    Write-Host "Extracted to $outPath"
}
$zip.Dispose()

# Use javap if available
$javap = where.exe javap 2>$null
if ($javap) {
    javap -p "C:\Users\33678\AppData\Local\Temp\sentinel_check\BlockExceptionHandler.class" 2>&1
} else {
    Write-Host "javap not found, trying java -jar..."
    java -version 2>&1
}
