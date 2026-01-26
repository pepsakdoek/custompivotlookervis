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
            // NOTE: This is the old logic, isolated for debugging. It is known to be buggy.
            console.log(`Rendering header for: ${measureLayout}`, { tree, config }); // Log for debugging
            const otherMetricsAsCols = measureLayout === 'METRIC_FIRST_ROW' && metrics.length > 1;
            const colDimRowCount = hasColDims ? colDims.length : 0;
            const metricRowCount = otherMetricsAsCols ? 1 : 0;
            const totalHeaderRows = Math.max(1, colDimRowCount + metricRowCount);

            const headerRows = [];
            for (let i = 0; i < totalHeaderRows; i++) {
                headerRows.push(thead.insertRow());
            }
            
            const lastHeaderRow = thead.insertRow();
            const rowDimHeaderColCount = rowDims.length + 1; // +1 for the measure column

            const topLeft = document.createElement('th');
            topLeft.colSpan = rowDimHeaderColCount;
            topLeft.rowSpan = totalHeaderRows;
            
            console.log('TopLeft element:', { // Logging TopLeft as requested
                colSpan: topLeft.colSpan,
                rowSpan: topLeft.rowSpan,
                hasColDims: hasColDims,
                colDimCount: colDims.length
            });

            if (headerRows.length > 0) {
                headerRows[0].appendChild(topLeft);
            } else {
                lastHeaderRow.appendChild(topLeft);
            }
            
            rowDims.forEach(d => {
                const th = document.createElement('th');
                th.textContent = d.name;
                lastHeaderRow.appendChild(th);
            });
            const measureTh = document.createElement('th');
            measureTh.textContent = measureLayout === 'METRIC_ROW' ? 'Measure' : (metrics.length > 0 ? metrics[0].name : '');
            lastHeaderRow.appendChild(measureTh);

            const metricMultiplier = otherMetricsAsCols ? (metrics.length - 1 || 1) : 1;
            
            if (hasColDims) {
                function build(node, level) {
                    let sortedChildren = sortChildren(Object.values(node.children), config.colSettings[node.level + 1]);
                    sortedChildren.forEach(child => {
                        const th = document.createElement('th');
                        th.textContent = child.value;
                        const leaves = getLeafCount(child);
                        th.colSpan = leaves * metricMultiplier;
                        if (Object.keys(child.children).length === 0 && totalHeaderRows > level) {
                            th.rowSpan = totalHeaderRows - level - metricRowCount;
                        }
                        headerRows[level].appendChild(th);
                        if (Object.keys(child.children).length > 0) build(child, level + 1);
                    });
                }
                build(tree.colRoot, 0);
            } else {
                // If no coldims, add a 'Value' header
                const valueTh = document.createElement('th');
                valueTh.textContent = 'Value';
                if(headerRows[0]) headerRows[0].appendChild(valueTh);
            }

            if (otherMetricsAsCols) {
                const metricRow = headerRows[colDimRowCount] || headerRows[0];
                const colDefs = hasColDims ? (tree.colDefs || []) : [[]];
                colDefs.forEach(() => {
                    for(let i = 1; i < metrics.length; i++) {
                        const th = document.createElement('th');
                        th.textContent = metrics[i].name;
                        if(metricRow) metricRow.appendChild(th);
                    }
                });
            }
            
            const dataColCount = (tree.colDefs && tree.colDefs.length > 0) ? tree.colDefs.length : (hasColDims? 0 : 1);
            const totalDataCols = dataColCount * metricMultiplier;
            for (let i = 0; i < totalDataCols; i++) {
                lastHeaderRow.appendChild(document.createElement('th'));
            }
            break;
        }

        case 'METRIC_FIRST_COLUMN': {
            console.log('Rendering header for: METRIC_FIRST_COLUMN', { tree, config }); // Log for debugging
            const colHeaderRowCount = colDims.length + 1;
            const headerRows = [];
            for (let i = 0; i < colHeaderRowCount; i++) {
                headerRows.push(thead.insertRow());
            }
            const lastHeaderRow = headerRows[headerRows.length - 1];

            rowDims.forEach(d => {
                const th = document.createElement('th');
                th.textContent = d.name;
                lastHeaderRow.appendChild(th);
            });

            if (colHeaderRowCount > 1) {
                const topLeft = document.createElement('th');
                topLeft.colSpan = rowDims.length;
                topLeft.rowSpan = colHeaderRowCount - 1;
                headerRows[0].appendChild(topLeft);
            }
            
            const totalLeaves = hasColDims ? getLeafCount(tree.colRoot) : 1;
            console.log({totalLeaves}); // Log for debugging
            metrics.forEach(m => {
                const th = document.createElement('th');
                th.textContent = m.name;
                th.colSpan = totalLeaves;
                headerRows[0].appendChild(th);
            });

            if (hasColDims) {
                const buildColsForMetric = () => {
                    console.log('Building columns for a metric'); // Log for debugging
                    const colFragment = document.createDocumentFragment();
                    function build(node, dimLevel, parentFragment) {
                        console.log('build level:', dimLevel, {node}); // Log for debugging
                        let sortedChildren = sortChildren(Object.values(node.children), config.colSettings[dimLevel + 1]);
                        sortedChildren.forEach(child => {
                            const th = document.createElement('th');
                            th.textContent = child.value;
                            th.colSpan = getLeafCount(child);
                            if (Object.keys(child.children).length === 0) {
                               th.rowSpan = colHeaderRowCount - dimLevel - 1;
                            }
                            console.log('Appending child to header row', dimLevel + 1, {child: child.value}); // Log for debugging
                            headerRows[dimLevel + 1].appendChild(th);

                            if (Object.keys(child.children).length > 0) build(child, dimLevel + 1, th);
                        });
                    }
                    build(tree.colRoot, 0, colFragment)
                    return colFragment;
                };
                metrics.forEach((m) => {
                    console.log('Building columns for metric:', m.name); // Log for debugging
                    const newCols = buildColsForMetric();
                });
            }
            break;
        }
    }
}
