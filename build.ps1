# 1. Delete the existing bundle if it exists
if (Test-Path "./viz.js") { Remove-Item "./viz.js" }

# 2. Concatenate files in order
# We use -Raw to ensure no extra newlines are injected between files
$files = @(
    "./vizbuildnote.text.js",
    "./dscc.min.js",
    "./aggregators.js", 
    "./treeBuilder.js", 
    "./layoutMetricColumn.js",
    "./layoutMetricRow.js",
    "./layoutMetricFirstColumn.js",
    "./layoutMetricFirstRow.js"
    "./headerRenderer.js",
    "./main.js"
)

Get-Content $files -Raw | Out-File -FilePath "./viz.js" -Encoding utf8

Write-Host "Build Complete: viz.js created in root." -ForegroundColor Green