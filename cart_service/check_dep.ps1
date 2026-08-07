# Check dependency tree for sentinel adapter references
Write-Host "=== Dependency tree for cart_service - sentinel adapters ==="
Set-Location "C:\Users\33678\IdeaProjects\shopping\cart_service"
mvn dependency:tree -Dincludes="com.alibaba.csp:*webmvc*" 2>&1
