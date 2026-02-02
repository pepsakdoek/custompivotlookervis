function renderBodyMeasureFirstColumn(tbody, tree, config) {
    function recursiveRender(node, path) {
        const sortConfig = config.rowSettings[node.level + 1];
        let sortedChildren = Object.values(node.children);
        if (sortConfig) {
            // TODO : Sorting
        }
        sortedChildren.forEach(childNode => {
            const newPath = [...path, childNode.value];
            const isLeaf = Object.keys(childNode.children).length === 0;

            // Only render a data row if this is a leaf node
            if (isLeaf) {
                const tr = tbody.insertRow();
                tr.classList.add('DR');
                newPath.forEach((val, i) => {
                    const cell = tr.insertCell();
                    cell.textContent = val;
                    cell.classList.add('RDC', `RDC${i + 1}`);
                });

                // Render metric values for this row
                (tree.colDefs || []).forEach(colDef => {
                    const metricValues = childNode.metrics[colDef.key];
                    const cell = tr.insertCell();
                
                    const keyParts = colDef.key.split('||');
                    const metricName = keyParts[0];
                    const metricIndex = config.metrics.findIndex(m => m.name === metricName);
                
                    if (metricIndex === -1) {
                        cell.textContent = '?';
                        return;
                    }
                
                    cell.classList.add('MC', `MC${metricIndex + 1}`);
                
                    if (!metricValues || !metricValues[0]) {
                        cell.textContent = '-';
                    } else {
                        // In METRIC_FIRST_COLUMN, the aggregation happens in the tree builder.
                        // We assume 'SUM' here to extract the value, consistent with other layouts.
                        const val = getAggregatedValue(metricValues[0], 'SUM');
                        const formatType = config.metricFormats[metricIndex] || 'DEFAULT';
                        const formatted = formatMetricValue(val, formatType);
                        cell.textContent = formatted;
                    }
                });
            } else {
                // Not a leaf: recurse into children first
                recursiveRender(childNode, newPath);
            }

            // Render row subtotal
            const dimensionLevel = childNode.level;
            const subtotalConfig = config.rowSettings[dimensionLevel];
            if (subtotalConfig && subtotalConfig.subtotal === true && Object.keys(childNode.children).length > 0) {
                const subtotalRow = tbody.insertRow();
                subtotalRow.style.fontWeight = 'bold';
                subtotalRow.classList.add('RSR');
                
                for (let i = 0; i < dimensionLevel + 1; i++) {
                    if (i === dimensionLevel) {
                        const cell = subtotalRow.insertCell();
                        cell.textContent = `Subtotal ${childNode.value}`;
                        cell.classList.add('RSL');
                    } else {
                        subtotalRow.insertCell().textContent = '';
                    }
                }
                const rowDimCount = (config.rowDims?.length || 0) + (config.measureLayout.includes('ROW') ? 1 : 0);
                for (let i = dimensionLevel + 1; i < rowDimCount; i++) subtotalRow.insertCell();

                // Render metric values for this subtotal
                (tree.colDefs || []).forEach(colDef => {
                    const aggregatedMetricsArray = getAggregatedNodeMetrics(childNode, colDef.key, config, colDef.isSubtotal);
                    const cell = subtotalRow.insertCell();

                    const keyParts = colDef.key.split('||');
                    const metricName = keyParts[0];
                    const metricIndex = config.metrics.findIndex(m => m.name === metricName);

                    if (metricIndex === -1) {
                        cell.textContent = '?';
                        return;
                    }

                    cell.classList.add('RSV', `RSV${metricIndex + 1}`);

                    const aggregatedMetrics = aggregatedMetricsArray ? aggregatedMetricsArray[metricIndex] : null;

                    if (!aggregatedMetrics) {
                        cell.textContent = '-';
                    } else {
                        const metricAgg = config.metricSubtotalAggs[metricIndex] || 'NONE';
                        let val;
                        if (metricAgg === 'NONE') {
                            val = '-';
                        } else {
                            val = getAggregatedValue(aggregatedMetrics, metricAgg);
                            const formatType = config.metricFormats[metricIndex] || 'DEFAULT';
                            val = formatMetricValue(val, formatType);
                        }
                        cell.textContent = val;
                    }
                });
            }
        });
    }
    recursiveRender(tree.rowRoot, []);
}
