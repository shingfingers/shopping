Add-Type -AssemblyName "System.IO.Compression.FileSystem"

$commonJar = "D:\repository\org\apache\rocketmq\rocketmq-common\5.0.0\rocketmq-common-5.0.0.jar"
if (Test-Path $commonJar) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($commonJar)
    Write-Host "=== rocketmq-common-5.0.0.jar ==="
    Write-Host "Total entries: $($zip.Entries.Count)"
    $found = $zip.Entries | Where-Object { $_.FullName -match "NetworkUtil" }
    if ($found.Count -gt 0) {
        Write-Host "SUCCESS: NetworkUtil found!"
        $found | ForEach-Object { Write-Host "  -> $($_.FullName)" }
    } else {
        Write-Host "NetworkUtil NOT in common jar"
        $commonClasses = $zip.Entries | Where-Object { $_.FullName -match "^org/apache/rocketmq/common/" -and $_.FullName -match "\.class$" } | Select-Object -First 30
        Write-Host "Sample common classes:"
        $commonClasses | ForEach-Object { Write-Host "  $($_.FullName)" }
    }
    $zip.Dispose()
} else {
    Write-Host "rocketmq-common-5.0.0.jar not found at $commonJar"
}

$clientJar = "D:\repository\org\apache\rocketmq\rocketmq-client\5.0.0\rocketmq-client-5.0.0.jar"
$zip = [System.IO.Compression.ZipFile]::OpenRead($clientJar)
$clientClasses = $zip.Entries | Where-Object { $_.FullName -match "^org/apache/rocketmq/common/" -and $_.FullName -match "\.class$" }
Write-Host "=== Classes in client jar under common/ ==="
Write-Host "Count: $($clientClasses.Count)"
$clientClasses | ForEach-Object { Write-Host "  $($_.FullName)" }
$zip.Dispose()
