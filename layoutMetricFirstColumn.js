function renderBodyMetricFirstColumn(tbody, tree, config) {
    // debugLog('=== renderBodymetricFirstColumn START ===');

    function renderTotalsRow(node, isGrandTotal) {
        // debugLog(`--- renderTotalsRow called: isGrandTotal=${isGrandTotal}, node.value=${node.value}, node.level=${node.level}`);
        const tr = tbody.insertRow();
        tr.style.fontWeight = 'bold';

        if (isGrandTotal) {
            tr.classList.add('CGR');
            const labelCell = tr.insertCell();
            labelCell.textContent = 'Grand Total';
            labelCell.classList.add('CGL');
            for (let i = 1; i < config.rowDims.length; i++) {
                tr.insertCell();
            }
        } else {
            tr.classList.add('RSR');
            for (let i = 0; i < node.level; i++) tr.insertCell();
            const labelCell = tr.insertCell();
            labelCell.textContent = 'Subtotal ' + node.value;
            labelCell.classList.add('RSL');
            for (let i = node.level + 1; i < config.rowDims.length; i++) tr.insertCell();
        }

        (tree.colDefs || []).forEach(colDef => {
            const nodeStats = getAggregatedNodeMetrics(node, colDef.key, config, colDef.isSubtotal);
            
            const keyParts = colDef.key.split('||');
            const metricName = keyParts[0];
            const metricIndex = config.metrics.findIndex(m => m.name === metricName);

            if (metricIndex === -1) {
                tr.insertCell().textContent = '?';
                return;
            }

            const aggString = config.metricSubtotalAggs[metricIndex] || 'SUM';
            const aggTypeUpper = aggString.toUpperCase().trim();
            const cell = tr.insertCell();
            if (!isGrandTotal) {
                cell.classList.add('RSV', `RSV${metricIndex + 1}`);
            } else {
                cell.classList.add('CGV', `CGV${metricIndex + 1}`);
            }

            let val;
            if (['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', ''].includes(aggTypeUpper)) {
                val = getAggregatedValue(nodeStats ? nodeStats[metricIndex] : null, aggTypeUpper || 'SUM');
            } else {
                val = getCustomAggregatedValue(aggString, nodeStats, config);
            }
            
            cell.textContent = formatMetricValue(val, config.metricFormats[metricIndex]);
        });

        if (config.showRowGrandTotal) {
            // For METRIC_FIRST_COLUMN, the grand total is a single value per metric.
            // We can iterate through metrics and calculate their total.
            const grandTotalStats = getAggregatedNodeMetricsAllCols(node, config);

            config.metrics.forEach((m, i) => {
                const aggString = config.metricSubtotalAggs[i] || 'SUM';
                const cell = tr.insertCell();
                cell.style.fontWeight = 'bold';
                if (isGrandTotal) {
                    cell.classList.add('RGV', `RGV${i + 1}`);
                } else {
                    // This is for the subtotal's row grand total cell
                    cell.classList.add('RGV', `RGV${i + 1}`);
                }

                let val;
                const aggTypeUpper = aggString.toUpperCase().trim();
                if (['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', ''].includes(aggTypeUpper)) {
                    val = getAggregatedValue(grandTotalStats ? grandTotalStats[i] : null, aggTypeUpper || 'SUM');
                } else {
                    val = getCustomAggregatedValue(aggString, grandTotalStats, config);
                }
                cell.textContent = formatMetricValue(val, config.metricFormats[i]);
            });
        }
    }

    function recursiveRender(node, path) {
        // debugLog(`>>> recursiveRender: path=[${path}], node.level=${node.level}, children count=${Object.keys(node.children).length}`);
        
        // EDGE CASE for no row dims
        if (config.rowDims.length === 0 && path.length === 0 && node.level === -1) {
            // debugLog(`  >> Special case: 0 row dims, rendering single row from rowRoot`);
            const tr = tbody.insertRow();
            tr.classList.add('DR');

            renderMetricCellsForRow(tr, node, config);

            if (config.showRowGrandTotal) {
                renderRowGrandTotal(tr, node, config, true);
            }
            return;
        }

        let sortedChildren = sortChildren(Object.values(node.children), config.rowSettings[node.level + 1]);
        sortedChildren.forEach(childNode => {
            const newPath = [...path, childNode.value];
            const isLeaf = Object.keys(childNode.children).length === 0;
            
            // debugLog(`  > Child: value="${childNode.value}", isLeaf=${isLeaf}, newPath=[${newPath}]`);
            if (isLeaf) {
                const tr = tbody.insertRow();
                tr.classList.add('DR');

                newPath.forEach((val, i) => {
                    const cell = tr.insertCell();
                    cell.textContent = val;
                    cell.classList.add('RDC', `RDC${i + 1}`);
                });
                const rowDimCount = config.rowDims?.length || 0;
                for (let i = newPath.length; i < rowDimCount; i++) tr.insertCell();

                renderMetricCellsForRow(tr, childNode, config);

                if (config.showRowGrandTotal) {
                    renderRowGrandTotal(tr, childNode, config);
                }
            } else {
                recursiveRender(childNode, newPath);

                const settings = config.rowSettings[childNode.level];
                // debugLog(`  >> Checking subtotal for level ${childNode.level}:`, settings);
                if (settings && settings.subtotal) {
                    renderTotalsRow(childNode, false);
                }
            }
        });
    }

    function renderMetricCellsForRow(tr, node, config) {
        (tree.colDefs || []).forEach(colDef => {
            const stats = colDef.isSubtotal 
                ? getAggregatedNodeMetrics(node, colDef.key, config, true) 
                : node.metrics[colDef.key];
            
            const keyParts = colDef.key.split('||');
            const metricName = keyParts[0];
            const metricIndex = config.metrics.findIndex(m => m.name === metricName);

            let cellValue = null;
            if (stats) {
                cellValue = stats[metricIndex];
            }
            renderMetricCell(tr, cellValue, metricIndex, config);
        });
    }

    function renderRowGrandTotal(tr, node, config, isZeroRowDimCase = false) {
        const grandTotalStats = getAggregatedNodeMetricsAllCols(node, config);

        config.metrics.forEach((m, i) => {
            const aggString = config.metricSubtotalAggs[i] || 'SUM';
            const aggTypeUpper = aggString.toUpperCase().trim();
            const cell = tr.insertCell();
            cell.style.fontWeight = 'bold';
            cell.classList.add('RGV', `RGV${i + 1}`);

            // The `grandTotalStats` array holds the aggregated stats for each metric (at index i).
            const metricStats = grandTotalStats ? grandTotalStats[i] : null;

            let val;
            if (!metricStats) {
                val = null;
            } else if (['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', ''].includes(aggTypeUpper)) {
                val = getAggregatedValue(metricStats, aggTypeUpper || 'SUM');
            } else {
                // Custom aggregations operate on the full array of metric stats.
                val = getCustomAggregatedValue(aggString, grandTotalStats, config);
            }

            cell.textContent = formatMetricValue(val, config.metricFormats[i]);
        });
    }


    recursiveRender(tree.rowRoot, []);

    if (config.showColumnGrandTotal && config.rowDims.length > 0) {
        renderTotalsRow(tree.rowRoot, true);
    }
}
