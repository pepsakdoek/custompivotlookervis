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

function aggregateMetricStats(statsArray) {
    const filteredStats = statsArray.filter(s => s && s.count > 0);
    if (filteredStats.length === 0) {
        // Return a zeroed-out stats object that won't affect calculations
        return { sum: 0, count: 0, min: Infinity, max: -Infinity };
    }

    return filteredStats.reduce((acc, stats) => {
        acc.sum += stats.sum;
        acc.count += stats.count;
        acc.min = Math.min(acc.min, stats.min);
        acc.max = Math.max(acc.max, stats.max);
        return acc;
    }, { sum: 0, count: 0, min: Infinity, max: -Infinity });
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



function calculateSubtotals(tree, config, metricsForAgg, colKeys) {
    // debugLog('=== calculateSubtotals START ===');
    // debugLog('metricsForAgg length:', metricsForAgg.length);
    // debugLog('colKeys:', Array.from(colKeys));
    
    // PHASE 2: Calculate subtotals from leaf nodes only
    // This prevents double-counting by always aggregating from leaves
    
    // For each row dimension level, calculate subtotals if enabled
    const rowDims = config.rowDims || [];
    // debugLog('rowDims:', rowDims);
    
    for (let level = 0; level < rowDims.length; level++) {
        const subtotalConfig = config.rowSettings[level];
        // debugLog(`Checking level ${level}:`, subtotalConfig);
        
        if (!subtotalConfig || !subtotalConfig.subtotal) continue;
        
        // debugLog(`>>> SUBTOTAL ENABLED for level ${level} <<<`);
        
        // Walk the row tree at this level and aggregate children
        function processRowLevel(node, path) {
            if (path.length === level) {
                // debugLog(`  At target level ${level}, processing children of path: [${path}]`);
                
                // We're at the target level - aggregate this node's children
                Object.values(node.children).forEach(child => {
                    const childrenCount = Object.keys(child.children).length;
                    // debugLog(`    Child "${child.value}": has ${childrenCount} children, isLeaf=${childrenCount === 0}`);
                    
                    // CRITICAL FIX: Only calculate subtotals for non-leaf nodes
                    // If this child has no children, it's already a leaf and doesn't need subtotals
                    if (childrenCount === 0) {
                        // debugLog(`    >> SKIPPING leaf node "${child.value}" - no subtotal needed`);
                        // This is a leaf node - skip subtotal calculation
                        return;
                    }
                    
                    // debugLog(`    >> CALCULATING subtotals for non-leaf node "${child.value}"`);
                    
                    // For each column key, aggregate leaf descendants
                    Array.from(colKeys).forEach(colKey => {
                        if (!child.metrics) child.metrics = {};
                        const aggregated = aggregateLeafValuesFromNode(child, colKey, metricsForAgg);
                        if (aggregated) {
                            // debugLog(`      Aggregated for colKey "${colKey}":`, aggregated);
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
    // debugLog('=== calculateSubtotals END ===');
}

function aggregateLeafValuesFromNode(parentNode, colKey, metricsForAgg) {
    // debugLog(`  >> aggregateLeafValuesFromNode: parentNode="${parentNode.value}", colKey="${colKey}"`);
    
    // Find all leaf descendants and aggregate their metrics for this colKey
    let aggregated = null;
    
    function walkToLeaves(node) {
        if (Object.keys(node.children).length === 0) {
            // debugLog(`    >> Found leaf: "${node.value}"`);
            // Leaf node - aggregate its metrics
            if (node.metrics && node.metrics[colKey]) {
                // CRITICAL FIX: We need to aggregate the entire stats array, not just the sum
                // The original code was incorrectly passing individual values
                const leafStats = node.metrics[colKey];
                // debugLog(`    >> Leaf stats for colKey "${colKey}":`, leafStats);
                
                // leafStats is already an array of stats objects (one per metric)
                // We need to convert this to the format aggregateMetrics expects
                const valuesArray = leafStats.map(stat => stat.sum);
                // debugLog(`    >> Values array to aggregate:`, valuesArray);
                
                aggregated = aggregateMetrics(aggregated, valuesArray, metricsForAgg);
                // debugLog(`    >> Aggregated result so far:`, aggregated);
            } else {
                // debugLog(`    >> Leaf has no metrics for colKey "${colKey}"`);
            }
            return;
        }
        Object.values(node.children).forEach(child => walkToLeaves(child));
    }
    
    walkToLeaves(parentNode);
    // debugLog(`  >> Final aggregated result:`, aggregated);
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
        // debugLog('Creating subtotal colDef for path:', path);
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

    const isAsc = sortConfig.sortDir === 'ASC';

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

        // Handle nulls: always push to the end regardless of direction
        if (valA == null) return 1; 
        if (valB == null) return -1;

        if (valA === valB) return 0;

        // Standard comparison logic
        const comparison = valA < valB ? -1 : 1;
        const dimCorrection = sortConfig.sortType === 'DIMENSION' ? -1 : 1;

        // BECAUSE I RENDER RECURSIVELY THE ORDERING IS REVERSED (DIMENSIONS ARE NOT RENDERED RECURSIVELY)
        return isAsc ? -comparison * dimCorrection : comparison * dimCorrection;
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
    cell.classList.add('MC', `MC${metricIndex + 1}`);
}

function getCustomAggregatedValue(aggString, metricStats, config) {
    if (typeof aggString !== 'string') return null;
    let expression = aggString.toUpperCase().trim();

    if (expression === 'NONE') {
        return '';
    }

    const numMetrics = config.metrics.length;
    const numMetricsForCalcs = config.metricsForCalcs.length;

    // Regex to find SUM(M1), AVG(CM2), etc.
    const tokenRegex = /(SUM|AVG|COUNT|MIN|MAX)\((M|CM)([0-9]+)\)/g;

    expression = expression.replace(tokenRegex, (match, aggFunc, metricType, metricIndexStr) => {
        const metricIndex = parseInt(metricIndexStr, 10) - 1;

        if (metricIndex < 0) return 'NaN';

        let stats;
        if (metricType === 'M') {
            if (metricIndex >= numMetrics) return 'NaN';
            stats = metricStats ? metricStats[metricIndex] : null;
        } else { // 'CM'
            if (metricIndex >= numMetricsForCalcs) return 'NaN';
            stats = metricStats ? metricStats[numMetrics + metricIndex] : null;
        }

        if (!stats) return '0';

        return getAggregatedValue(stats, aggFunc);
    });

    // Safe evaluation
    try {
        // Security tightening: Treat the result as a math-only string
        // This ensures that after replacement, ONLY numbers and math symbols remain.
        // We exclude letters entirely here. 
        if (/[a-zA-Z]/.test(expression)) {
            console.error('Security Block: Expression contains unauthorized words/tokens:', expression);
            return 'Error';
        }
        // Updated regex to be more strict. Only allow numbers, operators, and parenthesis.
        if (!/^[0-9.+\-*/()\s]+$/.test(expression)) {
            // throw new Error('Invalid characters in expression');
            // For user-facing element, better to return an error message
            return 'Error: Invalid expression';
        }
        const result = new Function(`return ${expression}`)();
        if (typeof result !== 'number' || !isFinite(result)) {
            return 'Error';
        }
        return result;
    } catch (e) {
        console.error('Error evaluating custom aggregation expression:', expression, e);
        return 'Error';
    }
}

/**
 * Helper to collect and aggregate all metric data from the leaves of a specific node
 */
function getAggregatedNodeMetrics(node, colDefKey, config, isSubtotalCol) {
    let aggregatedStatsArray = []; // Array to hold all leaf stat arrays

    function collect(curr) {
        if (Object.keys(curr.children).length === 0) { // isLeaf
            if (isSubtotalCol) {
                Object.entries(curr.metrics).forEach(([key, stats]) => {
                    if (key.startsWith(colDefKey + '||')) {
                        aggregatedStatsArray.push(stats);
                    }
                });
            } else {
                 if (curr.metrics[colDefKey]) {
                    aggregatedStatsArray.push(curr.metrics[colDefKey]);
                }
            }
        } else {
            Object.values(curr.children).forEach(child => collect(child));
        }
    }

    collect(node);

    if (aggregatedStatsArray.length === 0) {
        return null;
    }
    
    // We now have an array of arrays of stats objects.
    // e.g., [[metric1_stats_leaf1, metric2_stats_leaf1], [metric1_stats_leaf2, metric2_stats_leaf2]]
    // We need to aggregate this into a single array of stats objects: [metric1_total_stats, metric2_total_stats]

    const allMetrics = [...config.metrics, ...config.metricsForCalcs];
    // Let's initialize the result array for the total stats of each metric
    const result = allMetrics.map(() => ({ sum: 0, count: 0, min: Infinity, max: -Infinity }));

    // For each metric...
    for (let i = 0; i < allMetrics.length; i++) {
        // ...create an array of stats for just that metric from all leaves
        const statsForOneMetric = aggregatedStatsArray.map(leafStatsArray => leafStatsArray[i]);
        // ...and aggregate them.
        result[i] = aggregateMetricStats(statsForOneMetric);
    }

    return result;
}

function getAggregatedNodeMetricsAllCols(node, config) {
    let allStats = [];
    function collect(curr) {
        if (Object.keys(curr.children).length === 0) { // isLeaf
            Object.values(curr.metrics).forEach(metricArray => {
                allStats.push(metricArray);
            });
        } else {
            Object.values(curr.children).forEach(child => collect(child));
        }
    }
    collect(node);

    if (allStats.length === 0) return null;

    const allMetrics = [...config.metrics, ...config.metricsForCalcs];
    const result = allMetrics.map(() => ({ sum: 0, count: 0, min: Infinity, max: -Infinity }));

    for (let i = 0; i < allMetrics.length; i++) {
        const statsForOneMetric = allStats.map(leafStatsArray => leafStatsArray[i]);
        if(statsForOneMetric[0] !== undefined) {
            result[i] = aggregateMetricStats(statsForOneMetric);
        }
    }
    return result;
}