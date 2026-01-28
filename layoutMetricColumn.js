function renderBodyMetricColumn(tbody, tree, config) {

    // let rowSubtotalMetrics = {};
    // let rowGrandTotalMetrics = {};
    // config.metrics.forEach((m, i) => {
    //     rowGrandTotalMetrics[m.name] = 0;
    // });


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
            const nodeStats = getAggregatedNodeMetrics(node, colDef.key, config);
            config.metrics.forEach((m, i) => {
                const aggType = config.metricSubtotalAggs[i] || 'SUM';
                const cell = tr.insertCell();
                const val = getAggregatedValue(nodeStats ? nodeStats[i] : null, aggType);
                cell.textContent = formatMetricValue(val, config.metricFormats[i]);
            });
        });
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
                    config.metrics.forEach(m => {
                        rowTotals[m.name] = [];
                    });
                }

                (tree.colDefs || []).forEach(colDef => {
                    const stats = childNode.metrics[colDef.key];
                    config.metrics.forEach((m, i) => {
                        const cellValue = stats ? stats[i] : null;
                        renderMetricCell(tr, cellValue, i, config);
                        if (config.showRowGrandTotal && cellValue !== null) {
                            rowTotals[m.name].push(cellValue);
                        }
                    });
                });

                if (config.showRowGrandTotal) {
                    config.metrics.forEach((m, i) => {
                        const combinedStats = aggregateMetricStats(rowTotals[m.name]);
                        const aggType = config.metricSubtotalAggs[i] || 'SUM';
                        console.log('Calculating row grand total for metric', m.name, 'with aggType', aggType, 'and combinedStats', combinedStats);
                        const cell = tr.insertCell();
                        const val = getAggregatedValue(combinedStats, aggType);
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