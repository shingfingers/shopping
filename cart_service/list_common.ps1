Add-Type -AssemblyName "System.IO.Compression.FileSystem"
$zip = [System.IO.Compression.ZipFile]::OpenRead("D:\repository\org\apache\rocketmq\rocketmq-common\4.9.4\rocketmq-common-4.9.4.jar")
$entries = $zip.Entries | Where-Object { $_ -isnot [System.IO.Compression.ZipArchiveEntry] -or $_.FullName -match '\.class$' } 
Write-Host "=== Total entries: $($zip.Entries.Count) ==="
$classes = $zip.Entries | Where-Object { $_.FullName -match '\.class$' }
$classes | ForEach-Object { Write-Host $_.FullName }
$zip.Dispose()
