Add-Type -AssemblyName "System.IO.Compression.FileSystem"

# Check DefaultBlockExceptionHandler from v6x adapter
$v6x = "D:\repository\com\alibaba\csp\sentinel-spring-webmvc-v6x-adapter\1.8.9\sentinel-spring-webmvc-v6x-adapter-1.8.9.jar"
$tmpDir = [System.IO.Path]::GetTempPath() + "sentinel_classes"

$zip = [System.IO.Compression.ZipFile]::OpenRead($v6x)
$entries = $zip.Entries | Where-Object { $_.FullName -match 'DefaultBlockExceptionHandler' }
foreach ($entry in $entries) {
    $outPath = [System.IO.Path]::Combine($tmpDir, $entry.Name)
    [System.IO.Compression.ZipFileExtensions]::ExtractToFile($entry, $outPath, $true)
    Write-Host "Extracted: $($entry.FullName)"
}
$zip.Dispose()

javap -p "C:\Users\33678\AppData\Local\Temp\sentinel_classes\DefaultBlockExceptionHandler.class" 2>&1

# Also check the actual common JAR to see what class was compiled into it
Write-Host "`n=== Checking compiled MyBlockExceptionHandler in common JAR ==="
$commonJar = "C:\Users\33678\IdeaProjects\shopping\common\target\common-0.0.1-SNAPSHOT.jar"
if (Test-Path $commonJar) {
    $zip2 = [System.IO.Compression.ZipFile]::OpenRead($commonJar)
    $meh = $zip2.Entries | Where-Object { $_.FullName -match 'MyBlockExceptionHandler' }
    foreach ($f in $meh) {
        Write-Host "  $($f.FullName)"
        $outPath = [System.IO.Path]::Combine($tmpDir, $f.Name)
        [System.IO.Compression.ZipFileExtensions]::ExtractToFile($f, $outPath, $true)
        javap -p "C:\Users\33678\AppData\Local\Temp\sentinel_classes\$($f.Name)" 2>&1
    }
    $zip2.Dispose()
} else {
    Write-Host "common JAR not found, checking target/classes"
    $cls = "C:\Users\33678\IdeaProjects\shopping\common\target\classes\com\bk\common\result\MyBlockExceptionHandler.class"
    if (Test-Path $cls) {
        javap -p $cls 2>&1
    }
}
