function buildDataTree(config, data) {
    const allMetrics = [...config.metrics, ...config.metricsForCalcs];
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
        
        // Correctly combine metrics and metricsForCalcs from the data row
        const combinedMetricData = [...row.metrics, ...(row.metricsForCalcs || [])];
        const metricValues = combinedMetricData.map(val => {
            const raw = Array.isArray(val) ? val[0] : val;
            const v = (raw != null) ? parseFloat(raw) : 0;
            return isNaN(v) ? 0 : v;
        });

        const measureLayout = config.measureLayout;

        // --- UPDATED BRANCHING LOGIC ---
        
        if (measureLayout === 'METRIC_ROW' && allMetrics.length > 0) {
            // METRIC_ROW: The Metric Name is appended to the ROW path
            allMetrics.forEach((metric, i) => {
                // We pass only the single metric value [metricValues[i]] 
                // and the single metric config [metric] to processNode
                processNode(tree, [...rowDims, metric.name], colDims, [metricValues[i]], colKeys, config, [metric]);
            });
        } 
        else if (measureLayout === 'METRIC_FIRST_ROW' && allMetrics.length > 0) {
            // METRIC_FIRST_ROW: Metric Name is the FIRST dimension in the row path
            allMetrics.forEach((metric, i) => {
                processNode(tree, [metric.name, ...rowDims], colDims, [metricValues[i]], colKeys, config, [metric]);
            });
        } 
        else if (measureLayout === 'METRIC_FIRST_COLUMN' && allMetrics.length > 0) {
            // METREC_FIRST_COLUMN: Metric Name is the FIRST dimension in the column path
            allMetrics.forEach((metric, i) => {
                processNode(tree, rowDims, [metric.name, ...colDims], [metricValues[i]], colKeys, config, [metric]);
            });
        } 
        else { 
            // METRIC_COLUMN (Standard): Metrics are bundled at the dimension leaf
            processNode(tree, rowDims, colDims, metricValues, colKeys, config, allMetrics);
        }
    });

    // Phase 2: Finalize Columns and Subtotals
    const finalColDefs = getFinalColKeys(tree.colRoot, [], config);
    if (finalColDefs.length > 0) {
        tree.colDefs = finalColDefs;
    } else {
        tree.colDefs = [{ key: '', isSubtotal: false, label: 'Total' }];
    }
    
    calculateSubtotals(tree, config, allMetrics, colKeys);
    
    return tree;
}

function processNode(tree, rowDims, colDims, metricValues, colKeys, config, metricsForAgg) {
    const leafColKey = colDims.join('||');
    colKeys.add(leafColKey);
    
    // PHASE 1: Store only at leaf nodes (no recursion)
    // Store in rowRoot with full row path as leaf
    let rowNode = tree.rowRoot;
    rowDims.forEach((dimValue, i) => {
        if (!rowNode.children[dimValue]) {
            rowNode.children[dimValue] = {
                value: dimValue,
                level: i,
                children: {},
                metrics: {}
            };
        }
        rowNode = rowNode.children[dimValue];
    });
    
    // Store metrics only at the leaf row node
    if (!rowNode.metrics) rowNode.metrics = {};
    rowNode.metrics[leafColKey] = aggregateMetrics(rowNode.metrics[leafColKey], metricValues, metricsForAgg);
    
    // PHASE 1: Build column hierarchy (same as before - needed for sorting)
    let colNode = tree.colRoot;
    if (!colNode.metrics) colNode.metrics = null;
    colNode.metrics = aggregateMetrics(colNode.metrics, metricValues, metricsForAgg);
    colDims.forEach((dimValue, i) => {
        if (!colNode.children[dimValue]) {
            colNode.children[dimValue] = {
                value: dimValue,
                level: i,
                children: {},
                metrics: null
            };
        }
        colNode = colNode.children[dimValue];
        if (!colNode.metrics) colNode.metrics = null;
        colNode.metrics = aggregateMetrics(colNode.metrics, metricValues, metricsForAgg);
    });
}