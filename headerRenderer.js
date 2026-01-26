/**
 * RENDERHEADER.JS
 * Handles the complex multi-row header logic, including nested column dimensions
 * and the specific "Measure" column for METRIC_ROW layout.
 * 
    Meaure layout types: 
    'METRIC_COLUMN' - metrics are shown as columns
       -- Metric names apprear in the column headers, and are on the same row as the row dimension headers
    'METRIC_ROW' - metrics are shown as rows
       -- A "Measure" column is added to the row dimensions, and metric names appear in that column
    'METRIC_FIRST_COLUMN' - Metrics are shown as the highest level column header
      -- The Metric is displayed in the First row of the column headers, and the last column dim headers are on the same row as the dimension headers 
    'METRIC_FIRST_ROW' - first metric is shown as a row, others as columns
      -- The Metric is displayed in the First column of the row headers as an extra column
 */
function renderHeader(table, tree, config) {
    const thead = table.createTHead();
    const { colDims, rowDims, metrics, measureLayout } = config;
    const hasColDims = colDims.length > 0;

    function getLeafCount(node) {
        if (!node || Object.keys(node.children).length === 0) return 1;
        return Object.values(node.children).reduce((sum, child) => sum + getLeafCount(child), 0);
    }
    
    switch (measureLayout) {
        case 'METRIC_COLUMN': {
            const colHeaderRowCount = hasColDims ? colDims.length + 1 : 1;
            const headerRows = [];
            for (let i = 0; i < colHeaderRowCount; i++) {
                headerRows.push(thead.insertRow());
            }
            const lastHeaderRow = headerRows[headerRows.length - 1];

            rowDims.forEach(d => {
                const th = document.createElement('th');
                th.textContent = d.name;
                th.className = 'row-dim-label';
                lastHeaderRow.appendChild(th);
            });
            if (colHeaderRowCount > 1) {
                const topLeft = document.createElement('th');
                topLeft.colSpan = rowDims.length;
                topLeft.rowSpan = colHeaderRowCount - 1;
                headerRows[0].appendChild(topLeft);
            }

            if (hasColDims) {
                const metricMultiplier = metrics.length || 1;
                function build(node, level) {
                    let sortedChildren = sortChildren(Object.values(node.children), config.colSettings[node.level + 1]);
                    sortedChildren.forEach(child => {
                        const th = document.createElement('th');
                        th.textContent = child.value;
                        th.colSpan = getLeafCount(child) * metricMultiplier;
                        headerRows[level].appendChild(th);
                        if (Object.keys(child.children).length > 0) build(child, level + 1);
                    });
                }
                build(tree.colRoot, 0);
            }
            
            const colDefs = hasColDims ? (tree.colDefs || []) : [[]];
            colDefs.forEach(() => {
                metrics.forEach(m => {
                    const th = document.createElement('th');
                    th.textContent = m.name;
                    lastHeaderRow.appendChild(th);
                });
            });
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

            // Add row dimension headers and the "Measure" header to the last header row.
            rowDims.forEach(d => {
                const th = document.createElement('th');
                th.textContent = d.name;
                lastHeaderRow.appendChild(th);
            });
            const measureTh = document.createElement('th');
            measureTh.textContent = 'Measure';
            lastHeaderRow.appendChild(measureTh);

            if (hasColDims) {
                // If there are multiple levels of column headers, create an empty top-left cell.
                if (totalHeaderRows > 1) {
                    const topLeft = document.createElement('th');
                    topLeft.colSpan = rowDims.length + 1; // Span over row dims and Measure.
                    topLeft.rowSpan = totalHeaderRows - 1;
                     headerRows[0].appendChild(topLeft);
                }

                // Build the column dimension header tree.
                function build(node, level) {
                    let sortedChildren = sortChildren(Object.values(node.children), config.colSettings[node.level + 1]);
                    const targetRow = headerRows[level];

                    sortedChildren.forEach(child => {
                        const th = document.createElement('th');
                        th.textContent = child.value;
                        th.colSpan = getLeafCount(child);
                        // If a branch of the tree is shorter, the last node needs to span downwards.
                        if (Object.keys(child.children).length === 0 && (level < totalHeaderRows - 1)) {
                            th.rowSpan = totalHeaderRows - level;
                        }
                        targetRow.appendChild(th);
                        if (Object.keys(child.children).length > 0) build(child, level + 1);
                    });
                }
                build(tree.colRoot, 0);

            } else { // No colDims
                // Add a "Value" header if there are no column dimensions.
                const valueTh = document.createElement('th');
                valueTh.textContent = 'Value';
                lastHeaderRow.appendChild(valueTh);
            }
            break;
        }

        case 'METRIC_FIRST_ROW': {
            
        }

        case 'METRIC_FIRST_COLUMN': {
            console.log('Rendering header with METRIC_FIRST_COLUMN new');
            const colHeaderRowCount = hasColDims ? 2 : 1;
            console.log('colHeaderRowCount:', colHeaderRowCount);
            const headerRows = [];
            for (let i = 0; i < colHeaderRowCount; i++) {
                headerRows.push(thead.insertRow());
            }
            console.log('headerRows created:', headerRows); 
            const lastHeaderRow = headerRows[headerRows.length];
            if (hasColDims) {
                // Two-row header
                const firstHeaderRow = headerRows[0];

                // Top-left empty cell
                const topLeft = document.createElement('th');
                topLeft.colSpan = rowDims.length;
                firstHeaderRow.appendChild(topLeft);
                console.log('Added top-left empty cell');

                // Metric names in first row
                const colSpan = tree.colDefs.length || 1;
                metrics.forEach(m => {
                    const th = document.createElement('th');
                    th.textContent = m.name;
                    th.colSpan = colSpan;
                    firstHeaderRow.appendChild(th);
                });
                console.log('Added metric name headers in first row');

                // Row dimension names in second row
                rowDims.forEach(d => {
                    const th = document.createElement('th');
                    th.textContent = d.name;
                    lastHeaderRow.appendChild(th);
                });
                console.log('Added row dimension headers in second row');

                

                // Last column dimension values in second row, repeated for each metric
                if (tree.colDefs && tree.colDefs.length > 0) {
                    metrics.forEach(() => {
                        tree.colDefs.forEach(colDef => {
                            const th = document.createElement('th');
                            th.textContent = colDef[colDef.length - 1];
                            lastHeaderRow.appendChild(th);
                        });
                    });
                }

            } else {
                // One-row header
                // Row dimension names
                rowDims.forEach(d => {
                    const th = document.createElement('th');
                    th.textContent = d.name;
                    lastHeaderRow.appendChild(th);
                });

                // Metric names
                metrics.forEach(m => {
                    const th = document.createElement('th');
                    th.textContent = m.name;
                    lastHeaderRow.appendChild(th);
                });
            }
            break;
        }
    }
}
