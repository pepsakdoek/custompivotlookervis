function renderBodyMetricRow(tbody, tree, config) {
    function recursiveRender(node, path) {
        // Use the shared helper for consistent sorting
        let sortedChildren = sortChildren(Object.values(node.children), config.rowSettings[node.level + 1]);

        sortedChildren.forEach(childNode => {
            const newPath = [...path, childNode.value];
            const isLeaf = Object.keys(childNode.children).length === 0;

            if (isLeaf) {
                // In METRIC_ROW, the leaf is the last dimension.
                // We now iterate through the actual metrics for this dimension leaf.
                config.metrics.forEach((metric, mIdx) => {
                    const tr = tbody.insertRow();
                    
                    // 1. Fill Dimension Values
                    newPath.forEach(val => tr.insertCell().textContent = val);
                    
                    // 2. The "Measure" Column (This is the one that was likely double-counting)
                    tr.insertCell().textContent = metric.name;

                    // 3. Fill Metric Values across the Column Groups
                    (tree.colDefs || []).forEach(colDef => {
                        const stats = childNode.metrics[colDef.key];
                        // We pass mIdx to pick the correct metric from the stats array
                        renderMetricCell(tr, stats ? stats[mIdx] : null, mIdx, config);
                    });
                });
            } else {
                recursiveRender(childNode, newPath);

                // FIXED SUBTOTALS: Loop through ALL metrics
                const settings = config.rowSettings[childNode.level];
                if (settings && settings.subtotal) {
                    config.metrics.forEach((metric, mIdx) => {
                        const tr = tbody.insertRow();
                        tr.className = 'subtotal-row';
                        tr.style.fontWeight = 'bold';

                        // Fill dimensions up to subtotal level
                        for (let i = 0; i < childNode.level; i++) tr.insertCell().textContent = '';
                        tr.insertCell().textContent = 'Subtotal ' + childNode.value;
                        
                        // Fill remaining dimension slots + the "Measure" slot
                        const remainingDims = config.rowDims.length - childNode.level;
                        for (let i = 0; i < remainingDims; i++) tr.insertCell();

                        // Render aggregated data for this specific metric
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