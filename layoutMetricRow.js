function renderBodyMetricRow(tbody, tree, config) {
    // Helper to aggregate data for a specific metric under a node
    // This is needed because METRIC_ROW splits metrics into separate leaf nodes
    function getMetricRowStats(node, metricName, colKey, isSubtotalCol) {
        let stats = [];
        function collect(curr) {
            if (Object.keys(curr.children).length === 0) {
                // Leaf node: Check if it matches the metric we are looking for
                if (curr.value === metricName) {
                    if (isSubtotalCol) {
                        Object.entries(curr.metrics).forEach(([k, s]) => {
                            if (k === colKey || k.startsWith(colKey + '||')) stats.push(s[0]);
                        });
                    } else {
                        if (curr.metrics[colKey]) stats.push(curr.metrics[colKey][0]);
                    }
                }
            } else {
                Object.values(curr.children).forEach(c => collect(c));
            }
        }
        collect(node);
        return aggregateMetricStats(stats);
    }

    // Helper to aggregate data across ALL columns for a specific metric under a node (for Row Grand Total)
    function getMetricRowGrandTotalStats(node, metricName) {
        let stats = [];
        function collect(curr) {
            if (Object.keys(curr.children).length === 0) {
                if (curr.value === metricName) {
                    Object.values(curr.metrics).forEach(s => stats.push(s[0]));
                }
            } else {
                Object.values(curr.children).forEach(c => collect(c));
            }
        }
        collect(node);
        return aggregateMetricStats(stats);
    }

    function renderSubtotalRows(node, label, isGrandTotal) {
        config.metrics.forEach((metric, mIdx) => {
            const tr = tbody.insertRow();
            if (isGrandTotal) {
                tr.classList.add('CGR');
                tr.style.fontWeight = 'bold';
                
                const labelCell = tr.insertCell();
                labelCell.textContent = label;
                labelCell.classList.add('CGL');
                // Span all dimension columns
                labelCell.colSpan = config.rowDims.length; 
                
            } else {
                tr.classList.add('RSR');
                tr.style.fontWeight = 'bold';
                
                // Indent
                for (let i = 0; i < node.level; i++) tr.insertCell().textContent = '';
                const labelCell = tr.insertCell();
                labelCell.textContent = label;
                labelCell.classList.add('RSL');
                
                // Pad remaining dims
                const remainingDims = config.rowDims.length - (node.level + 1);
                for (let i = 0; i < remainingDims; i++) tr.insertCell();
            }

            // metric Name
            const metricCell = tr.insertCell();
            metricCell.textContent = metric.name;
            metricCell.classList.add('MNC', `MNC${mIdx + 1}`);

            // Values
            (tree.colDefs || []).forEach(colDef => {
                const aggStats = getMetricRowStats(node, metric.name, colDef.key, colDef.isSubtotal);
                const aggType = (config.metricSubtotalAggs[mIdx] || 'SUM').toUpperCase();
                const val = getAggregatedValue(aggStats, aggType);
                const cell = tr.insertCell();
                cell.textContent = formatMetricValue(val, config.metricFormats[mIdx]);
                cell.classList.add(isGrandTotal ? 'CGV' : 'RSV', isGrandTotal ? `CGV${mIdx + 1}` : `RSV${mIdx + 1}`);
            });

            // Row Grand Total for Subtotal/GrandTotal Row
            if (config.showRowGrandTotal) {
                const aggStats = getMetricRowGrandTotalStats(node, metric.name);
                const aggType = (config.metricSubtotalAggs[mIdx] || 'SUM').toUpperCase();
                const val = getAggregatedValue(aggStats, aggType);
                const cell = tr.insertCell();
                cell.textContent = formatMetricValue(val, config.metricFormats[mIdx]);
                cell.classList.add('RGV', `RGV${mIdx + 1}`);
                cell.style.fontWeight = 'bold';
            }
        });
    }

    function recursiveRender(node, path) {
        let sortedChildren = Object.values(node.children);
        
        // Check if children are metrics (leaves)
        // In METRIC_ROW, the last level (leaves) are the metrics.
        if (node.level === config.rowDims.length - 1) {
             // Sort metrics by config index to fix "Reversed" issue
             sortedChildren.sort((a, b) => {
                 const idxA = config.metrics.findIndex(m => m.name === a.value);
                 const idxB = config.metrics.findIndex(m => m.name === b.value);
                 return idxA - idxB;
             });
        } else {
             // Use standard sorting for dimensions
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
                    // The last item in the path is the metric name
                    if (i === newPath.length - 1) {
                        const mIdx = config.metrics.findIndex(m => m.name === val);
                        cell.classList.add('MNC', `MNC${mIdx + 1}`);
                    } else {
                        cell.classList.add('RDC', `RDC${i + 1}`);
                    }
                });

                // 2. Pad empty cells if the path is shorter than the full row dimension depth + metric column.
                const expectedDimCols = (config.rowDims.length || 0) + 1;
                for (let i = newPath.length; i < expectedDimCols; i++) {
                    tr.insertCell();
                }

                // 3. Fill Metric Values across the Column Groups
                const metricName = newPath[newPath.length - 1];
                const mIdx = config.metrics.findIndex(m => m.name === metricName);

                (tree.colDefs || []).forEach(colDef => {
                    const valueCell = tr.insertCell();
                    let stats;
                    
                    if (colDef.isSubtotal) {
                        // Column Subtotal for a leaf row
                        stats = getMetricRowStats(childNode, metricName, colDef.key, true);
                    } else {
                        // Standard value
                        // The tree builder ensures that for METRIC_ROW, each leaf node path has one metric.
                        // The metric's data is thus the first (and only) element in the stats array.
                        stats = childNode.metrics[colDef.key] ? childNode.metrics[colDef.key][0] : null;
                    }

                    renderMetricCell(tr, stats, mIdx, config, valueCell);
                });

                // 4. Row Grand Total
                if (config.showRowGrandTotal) {
                    const valueCell = tr.insertCell();
                    valueCell.classList.add('RGV', `RGV${mIdx + 1}`);
                    valueCell.style.fontWeight = 'bold';
                    
                    // Aggregate all columns for this metric leaf
                    const stats = getMetricRowGrandTotalStats(childNode, metricName);
                    renderMetricCell(tr, stats, mIdx, config, valueCell);
                }

            } else {
                recursiveRender(childNode, newPath);

                // SUBTOTALS: For METRIC_ROW, we show a subtotal row FOR EACH metric under a dimension.
                const settings = config.rowSettings[childNode.level];
                if (settings && settings.subtotal) {
                    renderSubtotalRows(childNode, 'Subtotal ' + childNode.value, false);
                }
            }
        });
    }
    recursiveRender(tree.rowRoot, []);

    // Column Grand Totals (Bottom of table) - only show if there are row dimensions.
    // Otherwise, it's just a total of the metrics which may not be useful.
    if (config.showColumnGrandTotal && config.rowDims.length > 0) {
        renderSubtotalRows(tree.rowRoot, 'Grand Total', true);
    }
}
