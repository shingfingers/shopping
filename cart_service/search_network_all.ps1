Add-Type -AssemblyName "System.IO.Compression.FileSystem"
$baseDir = "D:\repository\org\apache\rocketmq"
$jarFiles = Get-ChildItem -Path $baseDir -Recurse -Filter "*.jar" | Where-Object { $_.FullName -match "5\\." }
foreach ($jar in $jarFiles) {
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($jar.FullName)
        $entries = $zip.Entries
        Write-Host "--- $($jar.Name) ($($entries.Count) entries) ---"
        $found = $entries | Where-Object { $_.FullName -match "Network" }
        if ($found.Count -gt 0) {
            Write-Host "  MATCHES:"
            foreach ($f in $found) {
                Write-Host "    $($f.FullName)"
            }
        }
        $zip.Dispose()
    } catch {
        Write-Host "  Error reading $($jar.Name): $_"
    }
}
Write-Host "Search complete."
