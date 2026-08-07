Add-Type -AssemblyName "System.IO.Compression.FileSystem"
$baseDir = "D:\repository\org\apache\rocketmq"
$dirs = Get-ChildItem -Path $baseDir -Recurse -Directory | Where-Object { $_.Name -match "5\.0\.0|5\.3\.1" }
foreach ($dir in $dirs) {
    $jars = Get-ChildItem -Path $dir.FullName -Filter "*.jar"
    foreach ($jar in $jars) {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($jar.FullName)
        $found = $zip.Entries | Where-Object { $_.FullName -match "NetworkUtil" }
        if ($found.Count -gt 0) {
            Write-Host "FOUND in $($jar.Name):"
            $found | ForEach-Object { Write-Host "  -> $($_.FullName)" }
        }
        $zip.Dispose()
    }
}
Write-Host "Search complete."
