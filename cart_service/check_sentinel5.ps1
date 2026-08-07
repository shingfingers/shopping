Add-Type -AssemblyName "System.IO.Compression.FileSystem"

$jar = "D:\repository\com\alibaba\cloud\spring-cloud-starter-alibaba-sentinel\2025.0.0.0\spring-cloud-starter-alibaba-sentinel-2025.0.0.0.jar"
$tmpDir = [System.IO.Path]::GetTempPath() + "sentinel_classes"
if (!(Test-Path $tmpDir)) { New-Item -ItemType Directory -Path $tmpDir -Force | Out-Null }

$zip = [System.IO.Compression.ZipFile]::OpenRead($jar)

# Extract SentinelWebAutoConfiguration and SentinelWebMvcConfigurer
$entries = $zip.Entries | Where-Object { $_.FullName -match '(SentinelWebAutoConfiguration|SentinelWebMvcConfigurer)\.class$' }
foreach ($entry in $entries) {
    $outPath = [System.IO.Path]::Combine($tmpDir, $entry.Name)
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $outPath, $true)
    Write-Host "Extracted: $($entry.FullName)"
}
$zip.Dispose()

# Also check spring.factories and AutoConfiguration.imports
$zip2 = [System.IO.Compression.ZipFile]::OpenRead($jar)
$configs = $zip2.Entries | Where-Object { $_.FullName -match '(spring.factories|AutoConfiguration.imports)$' }
foreach ($entry in $configs) {
    $outPath = [System.IO.Path]::Combine($tmpDir, $entry.Name.Replace('/','_'))
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $outPath, $true)
    Write-Host "Extracted: $($entry.FullName)"
}
$zip2.Dispose()

# javap the SentinelWebAutoConfiguration
$javap = where.exe javap 2>$null
if ($javap) {
    javap -c "C:\Users\33678\AppData\Local\Temp\sentinel_classes\SentinelWebAutoConfiguration.class" 2>&1 | Select-String -Pattern "BlockExceptionHandler|spring/webmvc" -Context 0,1
    "---"
    javap -c "C:\Users\33678\AppData\Local\Temp\sentinel_classes\SentinelWebMvcConfigurer.class" 2>&1 | Select-String -Pattern "BlockExceptionHandler|spring/webmvc" -Context 0,1
}
