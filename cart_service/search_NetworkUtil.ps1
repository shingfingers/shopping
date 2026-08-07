$ErrorActionPreference = "Stop"
$basePath = "D:\repository\org\apache\rocketmq"
$targetClass = "NetworkUtil"

$dirs = Get-ChildItem -Path $basePath -Directory
foreach ($dir in $dirs) {
    $jars = Get-ChildItem -Path $dir.FullName -Recurse -Filter "*.jar" -Depth 2
    foreach ($jar in $jars) {
        try {
            $zip = [System.IO.Compression.ZipFile]::OpenRead($jar.FullName)
            $found = $zip.Entries | Where-Object { $_.FullName -match $targetClass }
            if ($found) {
                Write-Host "FOUND in: $($jar.FullName)"
                $found | ForEach-Object { Write-Host "  -> $($_.FullName)" }
            }
            $zip.Dispose()
        } catch {
            Write-Host "Error reading $($jar.FullName): $_"
        }
    }
}
Write-Host "=== SEARCH COMPLETE ==="
