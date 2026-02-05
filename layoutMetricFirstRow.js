
function renderBodyMetricFirstRow(tbody, tree, config) {
    function recursiveRender(node, path) {
        let sortedChildren = Object.values(node.children);

        // For METRIC_FIRST_ROW, the first level's children are the metrics.
        // They should be sorted by their original index, not by dimension/metric value.
        if (node.level === -1 && sortedChildren.length > 1) {
            sortedChildren.sort((a, b) => {
                const idxA = config.metrics.findIndex(m => m.name === a.value);
                const idxB = config.metrics.findIndex(m => m.name === b.value);
                return (idxA === -1 ? Infinity : idxA) - (idxB === -1 ? Infinity : idxB);
            });
        } else {
            // Use the shared helper for consistent sorting on deeper dimension levels
            sortedChildren = sortChildren(sortedChildren, config.rowSettings[node.level + 1]);
        }

        sortedChildren.forEach(childNode => {
            const newPath = [...path, childNode.value];
            const isLeaf = Object.keys(childNode.children).length === 0;

            if (isLeaf) {
                // In METRIC_ROW, the leaf represents a single metric's value for a given dimension combination.
                const tr = tbody.insertRow();
                tr.classList.add('DR');
                
                // 1. Fill Dimension and metric Name values from the path
                newPath.forEach((val, i) => {
                    const cell = tr.insertCell();
                    cell.textContent = val;
                    // The first item in the path is the metric name
                    if (i === 0) {
                        const mIdx = config.metrics.findIndex(m => m.name === val);
                        cell.classList.add('MNC', `MNC${mIdx + 1}`);
                    } else {
                        cell.classList.add('RDC', `RDC${i}`);
                    }
                });

                // 2. Pad empty cells if the path is shorter than the full row dimension depth + metric column.
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
                    const metricName = newPath[0];
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
                        tr.classList.add('RSR');
                        tr.style.fontWeight = 'bold';

                        for (let i = 0; i < childNode.level; i++) tr.insertCell().textContent = '';
                        const labelCell = tr.insertCell();
                        labelCell.textContent = 'Subtotal ' + childNode.value;
                        labelCell.classList.add('RSL');
                        
                        const remainingDims = config.rowDims.length - (childNode.level + 1);
                        for (let i = 0; i < remainingDims; i++) tr.insertCell();
                        const metricCell = tr.insertCell();
                        metricCell.textContent = metric.name;
                        metricCell.classList.add('MNC', `MNC${mIdx + 1}`);

                        (tree.colDefs || []).forEach(colDef => {
                            const nodeStats = getAggregatedNodeMetrics(childNode, colDef.key, config);
                            const aggType = config.metricSubtotalAggs[mIdx] || 'SUM';
                            const val = getAggregatedValue(nodeStats ? nodeStats[mIdx] : null, aggType);
                            const cell = tr.insertCell();
                            cell.textContent = formatMetricValue(val, config.metricFormats[mIdx]);
                            cell.classList.add('RSV', `RSV${mIdx + 1}`);
                        });
                    });
                }
            }
        });
    }
    recursiveRender(tree.rowRoot, []);
}