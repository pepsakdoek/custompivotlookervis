function renderHeader(table, tree, config) {

  const thead = table.createTHead();
  const colDims = config.colDims || [];
  const rowDims = config.rowDims || [];
  const metrics = config.metrics || [];
  const measureLayout = config.measureLayout;
  const maxColDepth = colDims.length;
  const hasColDims = maxColDepth > 0;

  // One row for each col dimension, plus one for the metric names if they are columns.

  const colHeaderRowCount = maxColDepth + (measureLayout === 'METRIC_COLUMN' && hasColDims ? 1 : 0);
  const rowDimHeaderColCount = rowDims.length + (measureLayout.includes('ROW') ? 1 : 0);
    const headerRows = [];
    for (let i = 0; i < colHeaderRowCount; i++) {
        headerRows.push(thead.insertRow());
    }
    // Create top-left block for row dimension headers
    const topLeft = document.createElement('th');
    topLeft.colSpan = rowDimHeaderColCount;
    topLeft.rowSpan = colHeaderRowCount;
    if (headerRows.length > 0) headerRows[0].appendChild(topLeft);
    // Recursive function to build the column headers
    function buildColumnHeaders(node, level) {
        const sortConfig = config.colSettings[node.level + 1];
        let sortedChildren = Object.values(node.children);
        if (sortConfig && (sortConfig.sortType === 'METRIC' || sortConfig.sortType === 'DIMENSION')) {
            // This sorting logic MUST match getFinalColKeys
            sortedChildren.sort((a, b) => {
                let valA, valB;
                if (sortConfig.sortType === 'METRIC') {
                    const metricIdx = sortConfig.sortMetricIndex;
                    valA = getAggregatedValue(a.metrics?.[metricIdx], sortConfig.sortAgg);
                    valB = getAggregatedValue(b.metrics?.[metricIdx], sortConfig.sortAgg);
                } else {
                    valA = a.value;
                    valB = b.value;
                }
                const order = sortConfig.sortDir === 'ASC' ? 1 : -1;
                if (valA === undefined || valA === null) return 1 * order;
                if (valB === undefined || valB === null) return -1 * order;
                if (valA < valB) return -1 * order;
                if (valA > valB) return 1 * order;
                return 0;
            });
        }
        // Render headers for sorted children
        sortedChildren.forEach(child => {
            const th = document.createElement('th');
            th.textContent = child.value;
            const leafCount = getLeafCount(child);
            const metricMultiplier = (measureLayout === 'METRIC_COLUMN' && metrics.length > 0) ? metrics.length : 1;
            th.colSpan = leafCount * metricMultiplier;
            // If a node has no children, it should span the remaining header rows
            if (Object.keys(child.children).length === 0) {
                th.rowSpan = colHeaderRowCount - level;
            }
            if (level < headerRows.length) {
                headerRows[level].appendChild(th);
            }
            // Recurse if there are more children
            if (Object.keys(child.children).length > 0) {
                buildColumnHeaders(child, level + 1);
            }
        });
        // Render subtotal header for the current level
        const subtotalConfig = config.colSettings[node.level];
        if (subtotalConfig && subtotalConfig.subtotal && node.level > -1) {
            const th = document.createElement('th');
            th.textContent = `Subtotal ${node.value}`;
            th.rowSpan = colHeaderRowCount - level;
            th.colSpan = (measureLayout === 'METRIC_COLUMN' && metrics.length > 0) ? metrics.length : 1;
            if (level < headerRows.length) {
                headerRows[level].appendChild(th);
            }
        }
    }

    function getLeafCount(node) {
        if (Object.keys(node.children).length === 0) return 1;
        let count = Object.values(node.children).reduce((sum, child) => sum + getLeafCount(child), 0);
        const subtotalConfig = config.colSettings[node.level + 1];
        if (subtotalConfig && subtotalConfig.subtotal) {
            // This isn't quite right, but reflects that subtotals add columns
        }
        return count;
    }
    if (hasColDims) {
        buildColumnHeaders(tree.colRoot, 0);
    } else {
        // No column dimensions, just a single header for each metric
        const row = headerRows[0] || thead.insertRow();
        (tree.colDefs || []).forEach(colDef => {
            const th = document.createElement('th');
            th.textContent = colDef.label;
            row.appendChild(th);
        });
    }
    // Final row that contains the row dimension names (and measure names for METRIC_COLUMN)
    const rowDimHeaderRow = thead.insertRow();
    rowDims.forEach(d => rowDimHeaderRow.appendChild(document.createElement('th')).textContent = d.name);
    if (measureLayout.includes('ROW')) {
        const th = document.createElement('th');
        th.textContent = 'Measure';
        rowDimHeaderRow.appendChild(th);
    }
    
    // For METRIC_COLUMN layout, add measure names in this row (aligned under column headers)
    if (measureLayout === 'METRIC_COLUMN' && hasColDims) {
        (tree.colDefs || []).forEach(colDef => {
            metrics.forEach(metric => {
                const th = document.createElement('th');
                th.textContent = metric.name;
                rowDimHeaderRow.appendChild(th);
            });
        });
    } else {
        // For other layouts, add empty cells to match column headers
        (tree.colDefs || []).forEach(colDef => {
            const metricMultiplier = (measureLayout === 'METRIC_COLUMN') ? metrics.length : 1;
            for (let i = 0; i < metricMultiplier; i++) {
                rowDimHeaderRow.appendChild(document.createElement('th'));
            }
        });
    }
}