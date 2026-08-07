Add-Type -AssemblyName "System.IO.Compression.FileSystem"

# Check ClientConfig in 5.0.0
$clientJar = "D:\repository\org\apache\rocketmq\rocketmq-client\5.0.0\rocketmq-client-5.0.0.jar"
$zip = [System.IO.Compression.ZipFile]::OpenRead($clientJar)
Write-Host "=== ClientConfig related classes in 5.0.0 client jar ==="
$cc = $zip.Entries | Where-Object { $_.FullName -match "ClientConfig" }
foreach ($c in $cc) {
    Write-Host "  $($c.FullName)"
}
$zip.Dispose()

# Check ClientConfig in 4.9.4
$clientJar494 = "D:\repository\org\apache\rocketmq\rocketmq-client\4.9.4\rocketmq-client-4.9.4.jar"
$zip2 = [System.IO.Compression.ZipFile]::OpenRead($clientJar494)
Write-Host "=== ClientConfig related classes in 4.9.4 client jar ==="
$cc2 = $zip2.Entries | Where-Object { $_.FullName -match "ClientConfig" }
foreach ($c in $cc2) {
    Write-Host "  $($c.FullName)"
}
$zip2.Dispose()

# Now check what the 4.9.4 ClientConfig references - search for NetworkUtil reference
Write-Host "=== Checking entries referencing common/utils in both jars ==="
$zip3 = [System.IO.Compression.ZipFile]::OpenRead($clientJar494)
$refs = $zip3.Entries | Where-Object { $_.FullName -match "^org/apache/rocketmq/client/ClientConfig" -and $_.FullName -match "\.class$" }
foreach ($r in $refs) {
    Write-Host "  Found: $($r.FullName)"
}
$zip3.Dispose()

# Check the common 5.0.0 utils classes
$commonJar = "D:\repository\org\apache\rocketmq\rocketmq-common\5.0.0\rocketmq-common-5.0.0.jar"
$zip4 = [System.IO.Compression.ZipFile]::OpenRead($commonJar)
Write-Host "=== All utils classes in common 5.0.0 ==="
$utils = $zip4.Entries | Where-Object { $_.FullName -match "common/utils" -and $_.FullName -match "\.class$" }
foreach ($u in $utils) {
    Write-Host "  $($u.FullName)"
}
$zip4.Dispose()

# Check the common 4.9.4 utils classes
$commonJar494 = "D:\repository\org\apache\rocketmq\rocketmq-common\4.9.4\rocketmq-common-4.9.4.jar"
$zip5 = [System.IO.Compression.ZipFile]::OpenRead($commonJar494)
Write-Host "=== All utils classes in common 4.9.4 ==="
$utils2 = $zip5.Entries | Where-Object { $_.FullName -match "common/utils" -and $_.FullName -match "\.class$" }
foreach ($u in $utils2) {
    Write-Host "  $($u.FullName)"
}
$zip5.Dispose()
