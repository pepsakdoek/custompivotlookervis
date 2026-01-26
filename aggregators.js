// Aggregator utility functions for metric calculations and formatting and sorting

function getStyleValue(style, id, defaultValue) {
    return (style[id] && typeof style[id].value !== 'undefined') ? style[id].value : defaultValue;
}
// Enhanced aggregation to support SUM, AVG, etc.
function aggregateMetrics(existing, addition, metrics) {
    if (!existing) {
        // If this is the first run, initialize based on the `metrics` array
        // to ensure `existing` always has the correct length from the start.
        return metrics.map((_, i) => {
            const val = addition[i];
            // Check if a value was actually provided for this metric index
            if (val === undefined || val === null) {
                // No value, so initialize with empty/zero stats
                return { sum: 0, count: 0, min: Infinity, max: -Infinity};
            }
            // A value exists, so create the initial stats object
            return {
                sum: val,
                count: 1,
                min: val,
                max: val
            };
        });
    }

    // On subsequent runs, loop through all configured metrics
    metrics.forEach((metric, i) => {
        const val = addition[i];

        // If no value is provided for this metric in the current data row, skip it.
        if (val === undefined || val === null) {
            return; // Equivalent to 'continue' in a forEach
        }

        let stats = existing[i];

        // This is the key change: If no stats object exists for this metric, create it.
        // This handles the case you described.
        if (!stats) {
            stats = { sum: 0, count: 0, min: Infinity, max: -Infinity };
            existing[i] = stats;
        }

        // Now, safely update the stats
        stats.sum += val;
        stats.count += 1;

        // On the first actual value, min/max are the value itself.
        if (stats.count === 1) {
            stats.min = val;
            stats.max = val;
        } else {
            if (val < stats.min) stats.min = val;
            if (val > stats.max) stats.max = val;
        }
    });

    return existing;
}

function getAggregatedValue(metric, aggType) {
    if (!metric) return 0;
    switch (aggType) {
        case 'AVG':
            return metric.count === 0 ? 0 : metric.sum / metric.count;
        case 'COUNT':
            return metric.count;
        case 'MIN':
            return metric.min;
        case 'MAX':
            return metric.max;
        case 'SUM':
        default:
            return metric.sum;
    }
}

function formatMetricValue(value, formatType) {
    if (value === null || value === undefined || value === '-') return '-';
    
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    
    switch (formatType) {
        case 'COMPACT':
            return formatCompact(num);
        case 'NUMBER_0':
            return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        case 'NUMBER_1':
            return num.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        case 'NUMBER_2':
            return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        case 'PERCENT_0':
            return (num * 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '%';
        case 'PERCENT_1':
            return (num * 100).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
        case 'PERCENT_2':
            return (num * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
        case 'DEFAULT':
        default:
            return num.toLocaleString();
    }
}

function formatCompact(num) {
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    
    if (absNum >= 1e9) {
        return sign + (absNum / 1e9).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }).replace(/\.?0+$/, '') + 'b';
    } else if (absNum >= 1e6) {
        return sign + (absNum / 1e6).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }).replace(/\.?0+$/, '') + 'm';
    } else if (absNum >= 1e3) {
        return sign + (absNum / 1e3).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }).replace(/\.?0+$/, '') + 'k';
    } else {
        return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
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

function calculateSubtotals(tree, config, metricsForAgg, colKeys) {
    // PHASE 2: Calculate subtotals from leaf nodes only
    // This prevents double-counting by always aggregating from leaves
    
    function aggregateLeafValues(node, path, targetPath, colKey) {
        // Recursively find all leaf nodes that match the targetPath prefix
        // and aggregate their values for the given colKey
        if (Object.keys(node.children).length === 0) {
            // This is a leaf node
            if (node.metrics && node.metrics[colKey]) {
                return node.metrics[colKey];
            }
            return null;
        }
        
        // Not a leaf, so recurse through children
        let aggregated = null;
        Object.values(node.children).forEach(child => {
            const childAgg = aggregateLeafValues(child, [...path, child.value], targetPath, colKey);
            if (childAgg) {
                aggregated = aggregateMetrics(aggregated, [childAgg.sum, childAgg.count], metricsForAgg);
            }
        });
        return aggregated;
    }
    
    // For each row dimension level, calculate subtotals if enabled
    const rowDims = config.rowDims || [];
    for (let level = 0; level < rowDims.length; level++) {
        const subtotalConfig = config.rowSettings[level];
        if (!subtotalConfig || !subtotalConfig.subtotal) continue;
        
        // Walk the row tree at this level and aggregate children
        function processRowLevel(node, path) {
            if (path.length === level) {
                // We're at the target level - aggregate this node's children
                Object.values(node.children).forEach(child => {
                    // For each column key, aggregate leaf descendants
                    Array.from(colKeys).forEach(colKey => {
                        if (!child.metrics) child.metrics = {};
                        const aggregated = aggregateLeafValuesFromNode(child, colKey, metricsForAgg);
                        if (aggregated) {
                            child.metrics[colKey] = aggregated;
                        }
                    });
                });
            } else {
                // Recurse deeper
                Object.values(node.children).forEach(child => {
                    processRowLevel(child, [...path, child.value]);
                });
            }
        }
        processRowLevel(tree.rowRoot, []);
    }
}

function aggregateLeafValuesFromNode(parentNode, colKey, metricsForAgg) {
    // Find all leaf descendants and aggregate their metrics for this colKey
    let aggregated = null;
    
    function walkToLeaves(node) {
        if (Object.keys(node.children).length === 0) {
            // Leaf node
            if (node.metrics && node.metrics[colKey]) {
                aggregated = aggregateMetrics(aggregated, 
                    [node.metrics[colKey].sum], 
                    [{sum: node.metrics[colKey].sum, count: 1}]);
            }
            return;
        }
        Object.values(node.children).forEach(child => walkToLeaves(child));
    }
    
    walkToLeaves(parentNode);
    return aggregated;
}

function getSortedKeys(node, path, config, settingsKey) {
    if (Object.keys(node.children).length === 0) {
        return path.length > 0 ? [path.join('||')] : [];
    }
    const settings = config[settingsKey];
    const sortConfig = settings[node.level + 1];
    let sortedChildren = Object.values(node.children);
    if (sortConfig && (sortConfig.sortType === 'METRIC' || sortConfig.sortType === 'DIMENSION')) {
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
    return sortedChildren.flatMap(child => getSortedKeys(child, [...path, child.value], config, settingsKey));
}

function getFinalColKeys(node, path, config) {
    const settings = config.colSettings;
    const sortConfig = settings[node.level + 1];
    let sortedChildren = Object.values(node.children);
    // Sort children based on config
    if (sortConfig && (sortConfig.sortType === 'METRIC' || sortConfig.sortType === 'DIMENSION')) {
        sortedChildren.sort((a, b) => {
            let valA, valB;
            if (sortConfig.sortType === 'METRIC') {
                const metricIdx = sortConfig.sortMetricIndex;
                valA = getAggregatedValue(a.metrics?.[metricIdx], sortConfig.sortAgg);
                valB = getAggregatedValue(b.metrics?.[metricIdx], sortConfig.sortAgg);
            } else { // DIMENSION
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
    // Base case: if it's a leaf node.
    if (sortedChildren.length === 0) {
        return path.length > 0 ? [{
            key: path.join('||'),
            isSubtotal: false,
            label: path[path.length - 1]
        }] : [];
    }
    // Recursive step: get keys from children.
    let finalKeys = sortedChildren.flatMap(child => getFinalColKeys(child, [...path, child.value], config));
    // Add subtotal for the current node after its children.
    const subtotalConfig = settings[node.level];
    if (subtotalConfig && subtotalConfig.subtotal && path.length > 0) {
        finalKeys.push({
            key: path.join('||'),
            isSubtotal: true,
            label: `Subtotal ${path[path.length - 1]}`
        });
    }
    return finalKeys;
}

/**
 * Shared sorting logic for rows and columns
 */
function sortChildren(childrenArray, sortConfig) {
    if (!sortConfig || (sortConfig.sortType !== 'METRIC' && sortConfig.sortType !== 'DIMENSION')) {
        return childrenArray;
    }

    return childrenArray.sort((a, b) => {
        let valA, valB;
        if (sortConfig.sortType === 'METRIC') {
            const mIdx = sortConfig.sortMetricIndex;
            valA = getAggregatedValue(a.metrics?.[mIdx], sortConfig.sortAgg);
            valB = getAggregatedValue(b.metrics?.[mIdx], sortConfig.sortAgg);
        } else {
            valA = a.value;
            valB = b.value;
        }
        const order = sortConfig.sortDir === 'ASC' ? 1 : -1;
        if (valA === undefined || valA === null) return 1 * order;
        if (valB === undefined || valB === null) return -1 * order;
        return valA < valB ? -1 * order : 1 * order;
    });
}

/**
 * Shared cell rendering to ensure formatting is identical everywhere
 */
function renderMetricCell(tr, metricStats, metricIndex, config, cellToPopulate) { // Added optional cellToPopulate
    let cell;
    if (cellToPopulate) {
        cell = cellToPopulate;
    } else {
        // If no cell is provided, create a new one in the given table row (tr)
        cell = tr.insertCell();
    }

    if (!metricStats) {
        cell.textContent = '-';
        return;
    }
    const val = getAggregatedValue(metricStats, 'SUM'); // Assuming getAggregatedValue is available
    const formatType = config.metricFormats[metricIndex] || 'DEFAULT'; // Assuming metricFormats is in config
    cell.textContent = formatMetricValue(val, formatType); // Assuming formatMetricValue is available
}

/**
 * Helper to collect and aggregate all metric data from the leaves of a specific node
 */
function getAggregatedNodeMetrics(node, colDefKey, config) {
    let aggregated = null;

    function collect(curr) {
        if (Object.keys(curr.children).length === 0) {
            const leafStats = curr.metrics[colDefKey];
            if (leafStats) {
                // IMPORTANT: leafStats is an array of metric objects [{sum, count...}, {sum, count...}]
                // We extract just the sums to pass to our aggregator
                const sums = leafStats.map(s => s.sum);
                aggregated = aggregateMetrics(aggregated, sums, config.metrics);
            }
        } else {
            Object.values(curr.children).forEach(child => collect(child));
        }
    }

    collect(node);
    return aggregated;
}