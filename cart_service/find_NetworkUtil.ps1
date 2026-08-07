Add-Type -AssemblyName "System.IO.Compression.FileSystem"
$jars = @(
    "D:\repository\org\apache\rocketmq\rocketmq-srvutil\4.9.4\rocketmq-srvutil-4.9.4.jar"
    "D:\repository\org\apache\rocketmq\rocketmq-remoting\4.9.4\rocketmq-remoting-4.9.4.jar"
    "D:\repository\org\apache\rocketmq\rocketmq-logging\4.9.4\rocketmq-logging-4.9.4.jar"
    "D:\repository\org\apache\rocketmq\rocketmq-acl\4.9.4\rocketmq-acl-4.9.4.jar"
)
foreach ($jarPath in $jars) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($jarPath)
    $found = $zip.Entries | Where-Object { $_.FullName -match "NetworkUtil" }
    if ($found) { Write-Host "FOUND in $jarPath"; $found | ForEach-Object { Write-Host "  $($_.FullName)" } }
    else { Write-Host "Not found in $jarPath" }
    $zip.Dispose()
}
Write-Host "DONE"
