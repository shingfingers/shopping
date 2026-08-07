$ErrorActionPreference = "Stop"
$commonJar = "D:\repository\org\apache\rocketmq\rocketmq-common\4.9.4\rocketmq-common-4.9.4.jar"
$clientJar = "D:\repository\org\apache\rocketmq\rocketmq-client\4.9.4\rocketmq-client-4.9.4.jar"

Write-Host "=== Checking rocketmq-common-4.9.4.jar ==="
Add-Type -AssemblyName "System.IO.Compression.FileSystem"
$zip = [System.IO.Compression.ZipFile]::OpenRead($commonJar)
$foundCommon = $zip.Entries | Where-Object { $_.FullName -match "NetworkUtil" }
if ($foundCommon) { $foundCommon | ForEach-Object { Write-Host $_.FullName } } else { Write-Host "NetworkUtil NOT found in rocketmq-common" }
$zip.Dispose()

Write-Host "=== Checking rocketmq-client-4.9.4.jar ==="
$zip2 = [System.IO.Compression.ZipFile]::OpenRead($clientJar)
$foundClient = $zip2.Entries | Where-Object { $_.FullName -match "NetworkUtil" }
if ($foundClient) { $foundClient | ForEach-Object { Write-Host $_.FullName } } else { Write-Host "NetworkUtil NOT found in rocketmq-client" }
$zip2.Dispose()

Write-Host "=== DONE ==="
