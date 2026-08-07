Add-Type -AssemblyName "System.IO.Compression.FileSystem"

$jars = @(
    "D:\repository\org\apache\rocketmq\rocketmq-client\5.3.1\rocketmq-client-5.3.1.jar",
    "D:\repository\org\apache\rocketmq\rocketmq-common\5.3.1\rocketmq-common-5.3.1.jar",
    "D:\repository\org\apache\rocketmq\rocketmq-remoting\5.3.1\rocketmq-remoting-5.3.1.jar"
)

foreach ($jar in $jars) {
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($jar)
        $found = $zip.Entries | Where-Object { $_.FullName -match "Network" }
        Write-Host "=== $(Split-Path $jar -Leaf) ==="
        if ($found.Count -gt 0) {
            Write-Host "Network* found:"
            foreach ($f in $found) {
                Write-Host "  $($f.FullName)"
            }
        } else {
            Write-Host "No Network* classes"
        }
        $zip.Dispose()
    } catch {
        Write-Host "Error: $_"
    }
}

# Also check if ClientConfig references NetworkUtil by looking at its constant pool
$client531 = "D:\repository\org\apache\rocketmq\rocketmq-client\5.3.1\rocketmq-client-5.3.1.jar"
$zip = [System.IO.Compression.ZipFile]::OpenRead($client531)
$cc = $zip.Entries | Where-Object { $_.FullName -eq "org/apache/rocketmq/client/ClientConfig.class" }
Write-Host "=== ClientConfig in 5.3.1 ==="
$cc | ForEach-Object { Write-Host "  Found: $($_.FullName), Length: $($_.Length)" }
$zip.Dispose()
