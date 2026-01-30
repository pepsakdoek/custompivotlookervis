function renderBodyMetricColumn(tbody, tree, config) {

    function renderTotalsRow(node, isGrandTotal) {
        // This is the Subtotal ROW for the COLUMNS
        const tr = tbody.insertRow();
        tr.style.fontWeight = 'bold';

        if (isGrandTotal) {
            tr.insertCell().textContent = 'Grand Total';
            for (let i = 1; i < config.rowDims.length; i++) {
                tr.insertCell();
            }
        } else {
            for (let i = 0; i < node.level; i++) tr.insertCell();
            tr.insertCell().textContent = 'Subtotal ' + node.value;
            for (let i = node.level + 1; i < config.rowDims.length; i++) tr.insertCell();
        }

        (tree.colDefs || []).forEach(colDef => {
            const nodeStats = getAggregatedNodeMetrics(node, colDef.key, config, colDef.isSubtotal);
            config.metrics.forEach((m, i) => {
                const aggString = config.metricSubtotalAggs[i] || 'SUM';
                const aggTypeUpper = aggString.toUpperCase().trim();
                const cell = tr.insertCell();

                let val;
                if (['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', ''].includes(aggTypeUpper)) {
                    val = getAggregatedValue(nodeStats ? nodeStats[i] : null, aggTypeUpper || 'SUM');
                } else {
                    val = getCustomAggregatedValue(aggString, nodeStats, config);
                }

                cell.textContent = formatMetricValue(val, config.metricFormats[i]);
            });
        });

        if (isGrandTotal && config.showRowGrandTotal) {
            const grandGrandTotalStats = getAggregatedNodeMetricsAllCols(tree.rowRoot, config);

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
        let sortedChildren = sortChildren(Object.values(node.children), config.rowSettings[node.level + 1]);

        sortedChildren.forEach(childNode => {
            const newPath = [...path, childNode.value];
            const isLeaf = Object.keys(childNode.children).length === 0;

            if (isLeaf) {
                const tr = tbody.insertRow();

                newPath.forEach(val => tr.insertCell().textContent = val);
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
                    const stats = colDef.isSubtotal 
                        ? getAggregatedNodeMetrics(childNode, colDef.key, config, true) 
                        : childNode.metrics[colDef.key];

                    // Loop through all metrics (primary + forCalcs) to populate rowTotals
                    const allMetrics = [...config.metrics, ...config.metricsForCalcs];
                    allMetrics.forEach((m, i) => {
                        const cellValue = stats ? stats[i] : null;

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
                recursiveRender(childNode, newPath);

                // SUBTOTAL LOGIC FOR METRIC_COLUMN
                const settings = config.rowSettings[childNode.level];
                if (settings && settings.subtotal) {
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