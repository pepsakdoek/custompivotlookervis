function renderBodyMetricColumn(tbody, tree, config) {
    debugLog('=== renderBodyMetricColumn START ===');
    debugLog('Tree structure:', JSON.stringify(tree, null, 2));
    debugLog('Config rowSettings:', config.rowSettings);
    debugLog('Config showColumnGrandTotal:', config.showColumnGrandTotal);

    function renderTotalsRow(node, isGrandTotal) {
        debugLog(`--- renderTotalsRow called: isGrandTotal=${isGrandTotal}, node.value=${node.value}, node.level=${node.level}`);
        // This is the Subtotal ROW for the COLUMNS
        const tr = tbody.insertRow();
        tr.style.fontWeight = 'bold';

        if (isGrandTotal) {
            tr.classList.add('CGR');
            const labelCell = tr.insertCell()
            labelCell.textContent = 'Grand Total';
            labelCell.classList.add('CGL');
            for (let i = 1; i < config.rowDims.length; i++) {
                tr.insertCell();
            }
        } else {
            tr.classList.add('RSR');
            for (let i = 0; i < node.level; i++) tr.insertCell();
            const labelCell = tr.insertCell()
            labelCell.textContent = 'Subtotal ' + node.value;
            labelCell.classList.add('RSL');
            for (let i = node.level + 1; i < config.rowDims.length; i++) tr.insertCell();
        }

        (tree.colDefs || []).forEach(colDef => {
            const nodeStats = getAggregatedNodeMetrics(node, colDef.key, config, colDef.isSubtotal);
            config.metrics.forEach((m, i) => {
                const aggString = config.metricSubtotalAggs[i] || 'SUM';
                const aggTypeUpper = aggString.toUpperCase().trim();
                const cell = tr.insertCell();
                if (!isGrandTotal) {
                    cell.classList.add('RSV', `RSV${i + 1}`);
                } else {
                    cell.classList.add('CGV', `CGV${i + 1}`);
                }

                let val;
                if (['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', ''].includes(aggTypeUpper)) {
                    val = getAggregatedValue(nodeStats ? nodeStats[i] : null, aggTypeUpper || 'SUM');
                } else {
                    val = getCustomAggregatedValue(aggString, nodeStats, config);
                }

                cell.textContent = formatMetricValue(val, config.metricFormats[i]);
            });
        });

        if (config.showRowGrandTotal) {
            const grandGrandTotalStats = getAggregatedNodeMetricsAllCols(node, config);

            config.metrics.forEach((m, i) => {
                const aggString = config.metricSubtotalAggs[i] || 'SUM';
                const cell = tr.insertCell();
                cell.style.fontWeight = 'bold'; // Grand grand total should be bold

                let val;
                const aggTypeUpper = aggString.toUpperCase().trim();
                if (['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', ''].includes(aggTypeUpper)) {
                    val = getAggregatedValue(grandGrandTotalStats ? grandGrandTotalStats[i] : null, aggTypeUpper || 'SUM');
                } else {
                    val = getCustomAggregatedValue(aggString, grandGrandTotalStats, config);
                }
                cell.textContent = formatMetricValue(val, config.metricFormats[i]);
            });
        }
    }

    function recursiveRender(node, path) {
        debugLog(`>>> recursiveRender: path=[${path}], node.level=${node.level}, children count=${Object.keys(node.children).length}`);
        
        let sortedChildren = sortChildren(Object.values(node.children), config.rowSettings[node.level + 1]);
        // EDGE CASE for no dim tables
        if (sortedChildren.length === 0 && path.length === 0) {
            debugLog(`  >> Special case: 0 row dims, rendering single row from rowRoot`);
            const tr = tbody.insertRow();
            tr.classList.add('DR');

            // No dimension cells to add since there are 0 row dims

            (tree.colDefs || []).forEach(colDef => {
                debugLog(`  >> Processing colDef: key="${colDef.key}", isSubtotal=${colDef.isSubtotal}`);
                
                const stats = node.metrics[colDef.key];
                debugLog(`  >> Stats for colDef "${colDef.key}":`, stats);

                // Loop through all metrics (primary only, no calcs needed for display)
                config.metrics.forEach((m, i) => {
                    const cellValue = stats ? stats[i] : null;
                    debugLog(`  >> Metric ${i} (${m.name}): cellValue=`, cellValue);
                    renderMetricCell(tr, cellValue, i, config);
                });
            });
            
            // No row grand total for 0 row dims case
            return;
        }

        sortedChildren.forEach(childNode => {
            const newPath = [...path, childNode.value];
            const isLeaf = Object.keys(childNode.children).length === 0;
            
            debugLog(`  > Child: value="${childNode.value}", isLeaf=${isLeaf}, newPath=[${newPath}]`);

            if (isLeaf) {
                // debugLog(`  >> RENDERING LEAF NODE: ${childNode.value}`);
                // debugLog(`  >> childNode.metrics keys:`, Object.keys(childNode.metrics || {}));
                
                const tr = tbody.insertRow();
                tr.classList.add('DR');

                newPath.forEach((val, i) => {
                    const cell = tr.insertCell();
                    cell.textContent = val;
                    cell.classList.add('RDC', `RDC${i + 1}`);
                });
                const rowDimCount = config.rowDims?.length || 0;
                for (let i = newPath.length; i < rowDimCount; i++) tr.insertCell();

                let rowTotals = {};
                if (config.showRowGrandTotal) {
                    const allMetrics = [...config.metrics, ...config.metricsForCalcs];
                    allMetrics.forEach(m => {
                        rowTotals[m.name] = [];
                    });
                }

                (tree.colDefs || []).forEach(colDef => {
                    debugLog(`  >> Processing colDef: key="${colDef.key}", isSubtotal=${colDef.isSubtotal}`);
                    
                    const stats = colDef.isSubtotal 
                        ? getAggregatedNodeMetrics(childNode, colDef.key, config, true) 
                        : childNode.metrics[colDef.key];
                    
                    // debugLog(`  >> Stats for colDef "${colDef.key}":`, stats);

                    // Loop through all metrics (primary + forCalcs) to populate rowTotals
                    const allMetrics = [...config.metrics, ...config.metricsForCalcs];
                    allMetrics.forEach((m, i) => {
                        const cellValue = stats ? stats[i] : null;
                        
                        // debugLog(`  >> Metric ${i} (${m.name}): cellValue=`, cellValue);

                        // Only render cells for the primary metrics
                        if (i < config.metrics.length) {
                            renderMetricCell(tr, cellValue, i, config);
                        }
                        
                        if (config.showRowGrandTotal && cellValue !== null && !colDef.isSubtotal) {
                            // Ensure rowTotals is populated for all metrics
                            rowTotals[m.name].push(cellValue);
                        }
                    });
                });

                if (config.showRowGrandTotal) {
                    const combinedStats = [];
                    const allMetrics = [...config.metrics, ...config.metricsForCalcs];

                    // Create a single array of combined stats for all metrics
                    for (let i = 0; i < allMetrics.length; i++) {
                        const metricName = allMetrics[i].name;
                        combinedStats.push(aggregateMetricStats(rowTotals[metricName]));
                    }

                    // Now, calculate and render the grand total for each primary metric
                    config.metrics.forEach((m, i) => {
                        const aggString = config.metricSubtotalAggs[i] || 'SUM';
                        const aggTypeUpper = aggString.toUpperCase().trim();
                        const cell = tr.insertCell();
                        cell.style.fontWeight = 'bold';
                        cell.classList.add('RGV', `RGV${i + 1}`);

                        let val;
                        if (['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', ''].includes(aggTypeUpper)) {
                            val = getAggregatedValue(combinedStats[i], aggTypeUpper || 'SUM');
                        } else {
                            // Pass the full array of combined stats
                            val = getCustomAggregatedValue(aggString, combinedStats, config);
                        }

                        cell.textContent = formatMetricValue(val, config.metricFormats[i]);
                    });
                }
            } else {
                // debugLog(`  >> RECURSING into non-leaf node: ${childNode.value}`);
                recursiveRender(childNode, newPath);

                // SUBTOTAL LOGIC FOR METRIC_COLUMN
                const settings = config.rowSettings[childNode.level];
                debugLog(`  >> Checking subtotal for level ${childNode.level}:`, settings);
                if (settings && settings.subtotal) {
                    // debugLog(`  >> RENDERING SUBTOTAL for node: ${childNode.value}`);
                    renderTotalsRow(childNode, false);
                }
            }
        });
    }

    recursiveRender(tree.rowRoot, []);

    if (config.showColumnGrandTotal) {
        renderTotalsRow(tree.rowRoot, true);
    }
}