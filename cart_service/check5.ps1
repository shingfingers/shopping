Add-Type -AssemblyName "System.IO.Compression.FileSystem"
$clientJar = "D:\repository\org\apache\rocketmq\rocketmq-client\5.0.0\rocketmq-client-5.0.0.jar"
$zip = [System.IO.Compression.ZipFile]::OpenRead($clientJar)
Write-Host "Total entries: $($zip.Entries.Count)"
$found = $zip.Entries | Where-Object { $_.FullName -match "NetworkUtil" }
if ($found.Count -gt 0) {
    Write-Host "SUCCESS: NetworkUtil found! Count: $($found.Count)"
    $found | ForEach-Object { Write-Host "  -> $($_.FullName)" }
} else {
    Write-Host "FAIL: NetworkUtil NOT found in 5.0.0 jar"
}
$zip.Dispose()
