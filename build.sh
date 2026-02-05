#!/bin/bash

# This script is the Linux/macOS equivalent of build.ps1

# 1. Define the list of files to be concatenated in the correct order.
files=(
    "./vizbuildnote.text.js"
    "./dscc.min.js"
    "./aggregators.js"
    "./treeBuilder.js"
    "./layoutMetricColumn.js"
    "./layoutMetricRow.js"
    "./layoutMetricFirstColumn.js"
    "./layoutMetricFirstRow.js"
    "./headerRenderer.js"
    "./main.js"
)

# 2. Concatenate the files into viz.js.
# The > operator will create or overwrite viz.js with the first file.
cat "${files[0]}" > ./viz.js
for file in "${files[@]:1}"; do
    echo "" >> ./viz.js # Add a newline
    cat "$file" >> ./viz.js
done

echo "Build Complete: viz.js created in root."