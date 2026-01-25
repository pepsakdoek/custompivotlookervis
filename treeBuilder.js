function buildDataTree(config, data) {
    const tree = {
        rowRoot: {
            children: {},
            level: -1,
            metrics: {}
        },
        colRoot: {
            children: {},
            level: -1
        }
    };
    const colKeys = new Set(); // Keep track of all leaf column keys
    data.forEach(row => {
        // Looker Studio provides dimensions and metrics as arrays of arrays.
        // We'll take the first value for each.
        const rowDims = (row.dimensions || []).map(String);
        const colDims = (row.columnDimensions || []).map(String);
        const metricValues = row.metrics.map(val => {
            // Handle both array format [value] and direct number format
            const raw = Array.isArray(val) ? val[0] : val;
            const v = (raw != null) ? parseFloat(raw) : 0;
            return isNaN(v) ? 0 : v;
        }); // Assuming single value per metric
        const measureLayout = config.measureLayout;
        if (measureLayout === 'METRIC_ROW' && config.metrics.length > 0) {
            config.metrics.forEach((metric, i) => {
                processNode(tree, [...rowDims, metric.name], colDims, [metricValues[i]], colKeys, config, [metric]);
            });
        } else if (measureLayout === 'MEASURE_FIRST_ROW' && config.metrics.length > 0) {
            config.metrics.forEach((metric, i) => {
                processNode(tree, [metric.name, ...rowDims], colDims, [metricValues[i]], colKeys, config, [metric]);
            });
        } else if (measureLayout === 'MEASURE_FIRST_COLUMN' && config.metrics.length > 0) {
            config.metrics.forEach((metric, i) => {
                processNode(tree, rowDims, [metric.name, ...colDims], [metricValues[i]], colKeys, config, [metric]);
            });
        } else { // METRIC_COLUMN (standard)
            processNode(tree, rowDims, colDims, metricValues, colKeys, config, config.metrics);
        }
    });
    const finalColDefs = getFinalColKeys(tree.colRoot, [], config);
    if (finalColDefs.length > 0) {
        tree.colDefs = finalColDefs;
    } else if (colKeys.size > 0) {
        // Fallback for when there are no col dims, just metrics.
        tree.colDefs = Array.from(colKeys).sort().map(k => ({
            key: k,
            isSubtotal: false,
            label: 'Total'
        }));
    } else {
        tree.colDefs = [{
            key: '',
            isSubtotal: false,
            label: 'Total'
        }];
    }
    
    // PHASE 2: Calculate subtotals from leaf nodes only (prevents double-counting)
    calculateSubtotals(tree, config, config.metrics, colKeys);
    
    return tree;
}
