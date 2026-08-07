Add-Type -AssemblyName "System.IO.Compression.FileSystem"
$jars = @(
    "D:\repository\org\apache\rocketmq\rocketmq-common\4.9.4\rocketmq-common-4.9.4.jar",
    "D:\repository\org\apache\rocketmq\rocketmq-client\4.9.4\rocketmq-client-4.9.4.jar",
    "D:\repository\org\apache\rocketmq\rocketmq-remoting\4.9.4\rocketmq-remoting-4.9.4.jar",
    "D:\repository\org\apache\rocketmq\rocketmq-acl\4.9.4\rocketmq-acl-4.9.4.jar",
    "D:\repository\org\apache\rocketmq\rocketmq-logging\4.9.4\rocketmq-logging-4.9.4.jar",
    "D:\repository\org\apache\rocketmq\rocketmq-srvutil\4.9.4\rocketmq-srvutil-4.9.4.jar"
)
foreach ($jar in $jars) {
    try {
        $zip = [System.IO.Compression.ZipFile]::OpenRead($jar)
        $found = $zip.Entries | Where-Object { $_.FullName -match "Network" }
        if ($found.Count -gt 0) {
            Write-Host "FOUND in $(Split-Path $jar -Leaf):"
            foreach ($f in $found) {
                Write-Host "  $($f.FullName)"
            }
        } else {
            Write-Host "NOT found in $(Split-Path $jar -Leaf)"
        }
        $zip.Dispose()
    } catch {
        Write-Host "Error: $_"
    }
}
Write-Host "========================"
Write-Host "Searching ALL 4.9.4 jars for NetworkUtil"
