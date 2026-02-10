/**
 * RENDERHEADER.JS
 * Handles the complex multi-row header logic, including nested column dimensions
 * and the specific "metric" column for METRIC_ROW layout.
 * 
    Meaure layout types: 
    'METRIC_COLUMN' - metrics are shown as columns
       -- Metric names apprear in the column headers, and are on the same row as the row dimension headers
    'METRIC_ROW' - metrics are shown as rows
       -- A "metric" column is added to the row dimensions, and metric names appear in that column
    'METRIC_FIRST_COLUMN' - Metrics are shown as the highest level column header
      -- The Metric is displayed in the First row of the column headers, and the last column dim headers are on the same row as the dimension headers 
    'METRIC_FIRST_ROW' - first metric is shown as a row, others as columns
      -- The Metric is displayed in the First column of the row headers as an extra column
 */
function renderHeader(table, tree, config) {
    const thead = table.createTHead();
    const { colDims, rowDims, metrics, metricLayout } = config;
    const hasColDims = colDims.length > 0;

    function getLeafCount(node) {
        if (!node || Object.keys(node.children).length === 0) return 1;

        let count = Object.values(node.children).reduce((sum, child) => sum + getLeafCount(child), 0);
        
        const subtotalConfig = config.colSettings[node.level];
        if (subtotalConfig && subtotalConfig.subtotal && node.level >= 0) {
            count += 1; 
        }
        return count;
    }
    
    switch (metricLayout) {
        case 'METRIC_COLUMN': {
            const colHeaderRowCount = hasColDims ? colDims.length + 1 : 1;
            const headerRows = [];
            for (let i = 0; i < colHeaderRowCount; i++) {
                headerRows.push(thead.insertRow());
            }
            const lastHeaderRow = headerRows[headerRows.length - 1];

            if (rowDims.length > 0) {
                rowDims.forEach((d, i) => {
                    const th = document.createElement('th');
                    th.textContent = d.name;
                    th.className = 'row-dim-label';
                    th.classList.add('RDH', `RDH${i + 1}`);
                    lastHeaderRow.appendChild(th);
                });
            }
            if (colHeaderRowCount > 1 && rowDims.length > 0) {
                const topLeft = document.createElement('th');
                topLeft.colSpan = rowDims.length;
                topLeft.rowSpan = colHeaderRowCount - 1;
                topLeft.classList.add('TLC');
                headerRows[0].appendChild(topLeft);
            }

            if (hasColDims) {
                const metricMultiplier = metrics.length || 1;
                function build(node, level, path) {
                    let sortedChildren = sortChildren(Object.values(node.children), config.colSettings[node.level + 1]);
                    sortedChildren.forEach(child => {
                        const th = document.createElement('th');
                        th.textContent = child.value;
                        th.colSpan = getLeafCount(child) * metricMultiplier;
                        th.classList.add('CDH', `CDH${level + 1}`);
                        headerRows[level].appendChild(th);
                        if (Object.keys(child.children).length > 0) build(child, level + 1, [...path, child.value]);
                    });

                    const subtotalConfig = config.colSettings[node.level];
                    if (subtotalConfig && subtotalConfig.subtotal && path.length > 0) {
                        const th = document.createElement('th');
                        th.textContent = `Subtotal ${path[path.length - 1]}`;
                        th.colSpan = metrics.length;
                        th.classList.add('CSH', `CSH${node.level + 1}`);
                        const rowSpan = colDims.length - level;
                        if (rowSpan > 1) {
                            th.rowSpan = rowSpan;
                        }
                        headerRows[level].appendChild(th);
                    }
                }
                build(tree.colRoot, 0, []);

                if (config.showRowGrandTotal) {
                    const grandTotalTh = document.createElement('th');
                    grandTotalTh.textContent = 'Grand Total';
                    grandTotalTh.colSpan = metrics.length;
                    grandTotalTh.rowSpan = colDims.length;
                    grandTotalTh.classList.add('RGH');
                    headerRows[0].appendChild(grandTotalTh);
                }
            }

            const colDefs = hasColDims ? (tree.colDefs || []) : [[]];
            colDefs.forEach(() => {
                metrics.forEach((m, i) => {
                    const th = document.createElement('th');
                    th.textContent = m.name;
                    th.classList.add('MH', `MH${i + 1}`);
                    lastHeaderRow.appendChild(th);
                });
            });

            if (config.showRowGrandTotal) {
                metrics.forEach((m, i) => {
                    const th = document.createElement('th');
                    th.textContent = m.name;
                    th.classList.add('MH', `MH${i + 1}`);
                    if (!hasColDims) {
                        th.textContent = 'Grand Total ' + m.name;
                    }
                    lastHeaderRow.appendChild(th);
                });
            }
            break;
        }

        case 'METRIC_ROW': {
            // This logic is rebuilt to correctly align row and column headers on the same row.
            const totalHeaderRows = hasColDims ? colDims.length : 1;
            
            const headerRows = [];
            for (let i = 0; i < totalHeaderRows; i++) {
                headerRows.push(thead.insertRow());
            }

            const lastHeaderRow = headerRows[headerRows.length-1];

            // Add row dimension headers and the "metric" header to the last header row.
            rowDims.forEach((d, i) => {
                const th = document.createElement('th');
                th.textContent = d.name;
                th.classList.add('RDH', `RDH${i + 1}`);
                lastHeaderRow.appendChild(th);
            });
            const metricTh = document.createElement('th');
            metricTh.textContent = 'Metric';
            metricTh.classList.add('MRH');
            lastHeaderRow.appendChild(metricTh);

            if (hasColDims) {
                // If there are multiple levels of column headers, create an empty top-left cell.
                if (totalHeaderRows > 1) {
                    const topLeft = document.createElement('th');
                    topLeft.colSpan = rowDims.length + 1; // Span over row dims and metric.
                    topLeft.rowSpan = totalHeaderRows - 1;
                    topLeft.classList.add('TLC');
                     headerRows[0].appendChild(topLeft);
                }

                // Build the column dimension header tree.
                function build(node, level, path) {
                    let sortedChildren = sortChildren(Object.values(node.children), config.colSettings[node.level + 1]);
                    const targetRow = headerRows[level];

                    sortedChildren.forEach(child => {
                        const th = document.createElement('th');
                        th.textContent = child.value;
                        th.colSpan = getLeafCount(child);
                        th.classList.add('CDH', `CDH${level + 1}`);
                        // If a branch of the tree is shorter, the last node needs to span downwards.
                        if (Object.keys(child.children).length === 0 && (level < totalHeaderRows - 1)) {
                            th.rowSpan = totalHeaderRows - level;
                        }
                        targetRow.appendChild(th);
                        if (Object.keys(child.children).length > 0) build(child, level + 1, [...path, child.value]);
                    });

                    const subtotalConfig = config.colSettings[node.level];
                    if (subtotalConfig && subtotalConfig.subtotal && path.length > 0) {
                        const th = document.createElement('th');
                        th.textContent = `Subtotal ${path[path.length - 1]}`;
                        th.colSpan = 1;
                        th.classList.add('CSH', `CSH${node.level + 1}`);
                        
                        const rowSpan = totalHeaderRows - level;
                        if (rowSpan > 1) {
                            th.rowSpan = rowSpan;
                        }
                        targetRow.appendChild(th);
                    }
                }
                build(tree.colRoot, 0, []);

            } else { // No colDims
                // Add a "Value" header if there are no column dimensions.
                const valueTh = document.createElement('th');
                valueTh.textContent = 'Value';
                valueTh.classList.add('VH');
                lastHeaderRow.appendChild(valueTh);
            }

            if (config.showRowGrandTotal) {
                const th = document.createElement('th');
                th.textContent = 'Grand Total';
                th.classList.add('RGH');
                th.rowSpan = totalHeaderRows;
                headerRows[0].appendChild(th);
            }
            break;
        }

        case 'METRIC_FIRST_ROW': {
            // This logic is rebuilt to correctly align row and column headers on the same row.
            const totalHeaderRows = hasColDims ? colDims.length : 1;
            
            const headerRows = [];
            for (let i = 0; i < totalHeaderRows; i++) {
                headerRows.push(thead.insertRow());
            }

            const lastHeaderRow = headerRows[headerRows.length-1];

            // Add "metric" header first
            const metricTh = document.createElement('th');
            metricTh.textContent = 'Metric';
            metricTh.classList.add('MRH');
            lastHeaderRow.appendChild(metricTh);

            // Add row dimension headers
            rowDims.forEach((d, i) => {
                const th = document.createElement('th');
                th.textContent = d.name;
                th.classList.add('RDH', `RDH${i + 1}`);
                lastHeaderRow.appendChild(th);
            });

            if (hasColDims) {
                // If there are multiple levels of column headers, create an empty top-left cell.
                if (totalHeaderRows > 1) {
                    const topLeft = document.createElement('th');
                    topLeft.colSpan = rowDims.length + 1; // Span over row dims and metric.
                    topLeft.rowSpan = totalHeaderRows - 1;
                    topLeft.classList.add('TLC');
                     headerRows[0].appendChild(topLeft);
                }

                // Build the column dimension header tree.
                function build(node, level, path) {
                    let sortedChildren = sortChildren(Object.values(node.children), config.colSettings[node.level + 1]);
                    const targetRow = headerRows[level];

                    sortedChildren.forEach(child => {
                        const th = document.createElement('th');
                        th.textContent = child.value;
                        th.colSpan = getLeafCount(child);
                        th.classList.add('CDH', `CDH${level + 1}`);
                        // If a branch of the tree is shorter, the last node needs to span downwards.
                        if (Object.keys(child.children).length === 0 && (level < totalHeaderRows - 1)) {
                            th.rowSpan = totalHeaderRows - level;
                        }
                        targetRow.appendChild(th);
                        if (Object.keys(child.children).length > 0) build(child, level + 1, [...path, child.value]);
                    });

                    const subtotalConfig = config.colSettings[node.level];
                    if (subtotalConfig && subtotalConfig.subtotal && path.length > 0) {
                        const th = document.createElement('th');
                        th.textContent = `Subtotal ${path[path.length - 1]}`;
                        th.colSpan = 1;
                        th.classList.add('CSH', `CSH${node.level + 1}`);
                        
                        const rowSpan = totalHeaderRows - level;
                        if (rowSpan > 1) {
                            th.rowSpan = rowSpan;
                        }
                        targetRow.appendChild(th);
                    }
                }
                build(tree.colRoot, 0, []);

            } else { // No colDims
                // Add a "Value" header if there are no column dimensions.
                const valueTh = document.createElement('th');
                valueTh.textContent = 'Value';
                valueTh.classList.add('VH');
                lastHeaderRow.appendChild(valueTh);
            }

            if (config.showRowGrandTotal) {
                const th = document.createElement('th');
                th.textContent = 'Grand Total';
                th.classList.add('RGH');
                th.rowSpan = totalHeaderRows;
                headerRows[0].appendChild(th);
            }
            break;
        }

        case 'METRIC_FIRST_COLUMN': {
            const colHeaderRowCount = (hasColDims ? colDims.length : 0) + 1;
            const headerRows = [];
            for (let i = 0; i < colHeaderRowCount; i++) {
                headerRows.push(thead.insertRow());
            }
            const lastHeaderRow = headerRows[headerRows.length - 1];

            // If there are column headers, add a top-left spacer above the row dimension labels.
            if (colHeaderRowCount > 1 && rowDims.length > 0) {
                const topLeft = document.createElement('th');
                topLeft.colSpan = rowDims.length;
                topLeft.rowSpan = colHeaderRowCount - 1; // Span all rows except the last one.
                topLeft.classList.add('TLC');
                headerRows[0].appendChild(topLeft);
            }
            
            // Add row dimension headers to the last header row.
            if (rowDims.length > 0) {
                rowDims.forEach((d, i) => {
                    const th = document.createElement('th');
                    th.textContent = d.name;
                    th.className = 'row-dim-label';
                    th.classList.add('RDH', `RDH${i + 1}`);
                    lastHeaderRow.appendChild(th);
                });
            }

            // Recursive function to build the column headers.
            function build(node, level, path) {
                // level 0: metrics, level 1+: colDims
                let sortedChildren = Object.values(node.children);

                // Special sort for METRIC_FIRST_COLUMN: the first level children are metrics
                // and should be sorted by their original index, not name.
                if (level === 0 && sortedChildren.length > 1) {
                    sortedChildren.sort((a, b) => {
                        const idxA = config.metrics.findIndex(m => m.name === a.value);
                        const idxB = config.metrics.findIndex(m => m.name === b.value);
                        return (idxA === -1 ? Infinity : idxA) - (idxB === -1 ? Infinity : idxB);
                    });
                } else if (level > 0) {
                    // For subsequent levels (column dimensions), use the standard sorting function
                    sortedChildren = sortChildren(sortedChildren, config.colSettings[node.level + 1]);
                }

                sortedChildren.forEach(child => {
                    const th = document.createElement('th');
                    th.textContent = child.value;
                    th.colSpan = getLeafCount(child);
                    // For level 0 (metrics), find the original index for stable CSS classes
                    const metricIndex = level === 0 ? config.metrics.findIndex(m => m.name === child.value) : -1;
                    const i = metricIndex !== -1 ? metricIndex : 0;
                    if (level === 0) {
                        th.classList.add('MH', `MH${i + 1}`);
                    } else {
                        th.classList.add('CDH', `CDH${level}`);
                    }

                    headerRows[level].appendChild(th);

                    if (Object.keys(child.children).length > 0) {
                        build(child, level + 1, [...path, child.value]);
                    } else if (hasColDims && level < colDims.length) {
                        // This is a leaf in a column-dimension branch that is not at the lowest level.
                        // It needs to span the remaining rows.
                        th.rowSpan = colDims.length - level + 1;
                    }
                });
                
                const subtotalConfig = config.colSettings[node.level];
                if (subtotalConfig && subtotalConfig.subtotal && path.length > 0) {
                    const th = document.createElement('th');
                    th.textContent = `Subtotal ${path[path.length - 1]}`;
                    th.colSpan = 1; 
                    th.classList.add('CSH', `CSH${node.level + 1}`);
                    const rowSpan = colHeaderRowCount - level;
                    if (rowSpan > 1) {
                        th.rowSpan = rowSpan;
                    }
                    headerRows[level].appendChild(th);
                }
            }

            if (Object.keys(tree.colRoot.children).length > 0) {
                build(tree.colRoot, 0, []);
            } else if (metrics.length > 0) {
                // No colDims, just metrics
                metrics.forEach((m, i) => {
                    const th = document.createElement('th');
                    th.textContent = m.name;
                    th.classList.add('MH', `MH${i + 1}`);
                    lastHeaderRow.appendChild(th);
                });
            } else { // No metrics, no coldims, just have rowdims. Add a value column
                const th = document.createElement('th');
                th.textContent = "Value";
                th.classList.add('VH');
                lastHeaderRow.appendChild(th);
            }

            if (config.showRowGrandTotal) {
                const th = document.createElement('th');
                // Instead of a single "Grand Total" spanning all metrics,
                // create a "Grand Total <Metric Name>" for each metric.
                metrics.forEach((m, i) => {
                    const grandTotalMetricTh = document.createElement('th');
                    grandTotalMetricTh.textContent = `Grand Total ${m.name}`;
                    grandTotalMetricTh.rowSpan = colHeaderRowCount;
                    grandTotalMetricTh.classList.add('RGH', `RGH${i + 1}`);
                    headerRows[0].appendChild(grandTotalMetricTh);
                });
            }
            break;
        }
    }
}
