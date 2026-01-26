function renderBodyMetricRow(tbody, tree, config) {
    function recursiveRender(node, path) {
        // Use the shared helper for consistent sorting
        let sortedChildren = sortChildren(Object.values(node.children), config.rowSettings[node.level + 1]);

        sortedChildren.forEach(childNode => {
            const newPath = [...path, childNode.value];
            const isLeaf = Object.keys(childNode.children).length === 0;

            if (isLeaf) {
                // In METRIC_ROW, the leaf represents a single metric's value for a given dimension combination.
                const tr = tbody.insertRow();
                
                // 1. Fill Dimension and Measure Name values from the path
                newPath.forEach(val => tr.insertCell().textContent = val);

                // 2. Pad empty cells if the path is shorter than the full row dimension depth + measure column.
                const expectedDimCols = (config.rowDims.length || 0) + 1;
                for (let i = newPath.length; i < expectedDimCols; i++) {
                    tr.insertCell();
                }

                // 3. Fill Metric Values across the Column Groups
                (tree.colDefs || []).forEach(colDef => {
                    const valueCell = tr.insertCell();
                    const stats = childNode.metrics[colDef.key];
                    
                    // The tree builder ensures that for METRIC_ROW, each leaf node path has one metric.
                    // The metric's data is thus the first (and only) element in the stats array.
                    // We need to find the original index of this metric to get its format settings.
                    const metricName = newPath[newPath.length - 1];
                    const mIdx = config.metrics.findIndex(m => m.name === metricName);

                    renderMetricCell(tr, stats ? stats[0] : null, mIdx, config, valueCell);
                });
            } else {
                recursiveRender(childNode, newPath);

                // SUBTOTALS: For METRIC_ROW, we show a subtotal row FOR EACH metric under a dimension.
                const settings = config.rowSettings[childNode.level];
                if (settings && settings.subtotal) {
                    config.metrics.forEach((metric, mIdx) => {
                        const tr = tbody.insertRow();
                        tr.className = 'subtotal-row';
                        tr.style.fontWeight = 'bold';

                        for (let i = 0; i < childNode.level; i++) tr.insertCell().textContent = '';
                        tr.insertCell().textContent = 'Subtotal ' + childNode.value;
                        
                        const remainingDims = config.rowDims.length - (childNode.level + 1);
                        for (let i = 0; i < remainingDims; i++) tr.insertCell();
                        tr.insertCell().textContent = metric.name;

                        (tree.colDefs || []).forEach(colDef => {
                            const nodeStats = getAggregatedNodeMetrics(childNode, colDef.key, config);
                            const aggType = config.metricSubtotalAggs[mIdx] || 'SUM';
                            const val = getAggregatedValue(nodeStats ? nodeStats[mIdx] : null, aggType);
                            const cell = tr.insertCell();
                            cell.textContent = formatMetricValue(val, config.metricFormats[mIdx]);
                        });
                    });
                }
            }
        });
    }
    recursiveRender(tree.rowRoot, []);
}