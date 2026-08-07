Add-Type -AssemblyName "System.IO.Compression.FileSystem"
$clientJar = "D:\repository\org\apache\rocketmq\rocketmq-client\4.9.4\rocketmq-client-4.9.4.jar"
$zip = [System.IO.Compression.ZipFile]::OpenRead($clientJar)
Write-Host "Total entries: $($zip.Entries.Count)"
$sample = $zip.Entries | Select-Object -First 20
$sample | ForEach-Object { Write-Host $_.FullName }
Write-Host "---"
$found = $zip.Entries | Where-Object { $_.FullName -match "ClientConfig" }
$found | ForEach-Object { Write-Host "Found ClientConfig: $($_.FullName)" }
$found2 = $zip.Entries | Where-Object { $_.FullName -match "Network" }
$found2 | ForEach-Object { Write-Host "Found Network: $($_.FullName)" }
$zip.Dispose()
