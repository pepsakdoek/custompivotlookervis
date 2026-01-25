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
    const colKeys = new Set(); 

    data.forEach(row => {
        // Standardizing Looker Studio inputs
        const rowDims = (row.dimensions || []).map(String);
        const colDims = (row.columnDimensions || []).map(String);
        const metricValues = row.metrics.map(val => {
            const raw = Array.isArray(val) ? val[0] : val;
            const v = (raw != null) ? parseFloat(raw) : 0;
            return isNaN(v) ? 0 : v;
        });

        const measureLayout = config.measureLayout;

        // --- UPDATED BRANCHING LOGIC ---
        
        if (measureLayout === 'METRIC_ROW' && config.metrics.length > 0) {
            // METRIC_ROW: The Metric Name is appended to the ROW path
            config.metrics.forEach((metric, i) => {
                // We pass only the single metric value [metricValues[i]] 
                // and the single metric config [metric] to processNode
                processNode(tree, [...rowDims, metric.name], colDims, [metricValues[i]], colKeys, config, [metric]);
            });
        } 
        else if (measureLayout === 'MEASURE_FIRST_ROW' && config.metrics.length > 0) {
            // MEASURE_FIRST_ROW: Metric Name is the FIRST dimension in the row path
            config.metrics.forEach((metric, i) => {
                processNode(tree, [metric.name, ...rowDims], colDims, [metricValues[i]], colKeys, config, [metric]);
            });
        } 
        else if (measureLayout === 'MEASURE_FIRST_COLUMN' && config.metrics.length > 0) {
            // MEASURE_FIRST_COLUMN: Metric Name is the FIRST dimension in the column path
            config.metrics.forEach((metric, i) => {
                processNode(tree, rowDims, [metric.name, ...colDims], [metricValues[i]], colKeys, config, [metric]);
            });
        } 
        else { 
            // METRIC_COLUMN (Standard): Metrics are bundled at the dimension leaf
            // This is the version that was likely returning 0 because it couldn't find the bundled array
            processNode(tree, rowDims, colDims, metricValues, colKeys, config, config.metrics);
        }
    });

    // Phase 2: Finalize Columns and Subtotals
    const finalColDefs = getFinalColKeys(tree.colRoot, [], config);
    if (finalColDefs.length > 0) {
        tree.colDefs = finalColDefs;
    } else {
        tree.colDefs = [{ key: '', isSubtotal: false, label: 'Total' }];
    }
    
    calculateSubtotals(tree, config, config.metrics, colKeys);
    
    return tree;
}