/**
 * RENDERHEADER.JS
 * Handles the complex multi-row header logic, including nested column dimensions
 * and the specific "Measure" column for METRIC_ROW layout.
 */
function renderHeader(table, tree, config) {
    const thead = table.createTHead();
    const { colDims, rowDims, metrics, measureLayout } = config;
    const hasColDims = colDims.length > 0;

    // 1. Calculate header dimensions
    // For METRIC_COLUMN, we need an extra row at the bottom for metric names
    const colHeaderRowCount = colDims.length + (measureLayout === 'METRIC_COLUMN' ? 1 : 0);
    // For METRIC_ROW, the "Measure" column counts as a row dimension
    const rowDimHeaderColCount = rowDims.length + (measureLayout === 'METRIC_ROW' ? 1 : 0);
    
    // Create the required number of header rows
    const headerRows = [];
    const totalHeaderRows = Math.max(1, colHeaderRowCount);
    for (let i = 0; i < totalHeaderRows; i++) {
        headerRows.push(thead.insertRow());
    }

    // 2. Create the top-left corner (the empty box above row dimensions)
    const topLeft = document.createElement('th');
    topLeft.colSpan = rowDimHeaderColCount;
    topLeft.rowSpan = totalHeaderRows;
    headerRows[0].appendChild(topLeft);

    /**
     * Helper to find how many leaf columns exist under a node to set colSpan
     */
    function getLeafCount(node) {
        if (Object.keys(node.children).length === 0) return 1;
        return Object.values(node.children).reduce((sum, child) => sum + getLeafCount(child), 0);
    }

    /**
     * Recursively build the column dimension headers
     */
    function buildColumnHeaders(node, level) {
        // Use the shared helper to ensure sorting matches the body
        let sortedChildren = sortChildren(Object.values(node.children), config.colSettings[node.level + 1]);

        sortedChildren.forEach(child => {
            const th = document.createElement('th');
            th.textContent = child.value;
            
            const leaves = getLeafCount(child);
            // If Metrics are in columns, each leaf needs space for all metrics
            const metricMultiplier = (measureLayout === 'METRIC_COLUMN') ? metrics.length : 1;
            th.colSpan = leaves * metricMultiplier;
            
            // If this is a leaf dimension and we aren't adding a metric row below it, 
            // stretch this cell to the bottom of the header
            if (Object.keys(child.children).length === 0 && measureLayout !== 'METRIC_COLUMN') {
                th.rowSpan = totalHeaderRows - level;
            }

            headerRows[level].appendChild(th);
            
            if (Object.keys(child.children).length > 0) {
                buildColumnHeaders(child, level + 1);
            }
        });
    }

    // 3. Process Column Dimensions
    if (hasColDims) {
        buildColumnHeaders(tree.colRoot, 0);
    } else if (measureLayout === 'METRIC_COLUMN') {
        // If no column dims, but layout is METRIC_COLUMN, we still need 1 row for metric names
        metrics.forEach(m => {
            const th = document.createElement('th');
            th.textContent = m.name;
            headerRows[0].appendChild(th);
        });
    }

    // 4. Handle the specific METRIC_COLUMN metric name row
    if (measureLayout === 'METRIC_COLUMN' && hasColDims) {
        const metricNameRow = headerRows[headerRows.length - 1];
        // We repeat the metric names for every unique combination of column dimensions
        (tree.colDefs || []).forEach(() => {
            metrics.forEach(m => {
                const th = document.createElement('th');
                th.textContent = m.name;
                metricNameRow.appendChild(th);
            });
        });
    }

    // 5. Create the Labels Row (The very bottom of the header)
    // This row displays "Dimension 1", "Dimension 2", "Measure", and identifies column splits
    const labelsRow = thead.insertRow();
    
    // Row Dimension Labels
    rowDims.forEach(d => {
        const th = document.createElement('th');
        th.textContent = d.name;
        th.className = 'row-dim-label';
        labelsRow.appendChild(th);
    });
    
    // The "Measure" label for METRIC_ROW layout
    if (measureLayout === 'METRIC_ROW') {
        const th = document.createElement('th');
        th.textContent = 'Measure';
        th.className = 'measure-label';
        labelsRow.appendChild(th);
    }

    // Fill the rest of the labels row with empty cells (or column info)
    // This ensures the <thead> width matches the <tbody> width exactly
    const dataColCount = (tree.colDefs || []).length * (measureLayout === 'METRIC_COLUMN' ? metrics.length : 1);
    for (let i = 0; i < dataColCount; i++) {
        labelsRow.appendChild(document.createElement('th'));
    }
}