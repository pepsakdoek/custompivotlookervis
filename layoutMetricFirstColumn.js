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
                newPath.forEach(val => tr.insertCell().textContent = val);
                const rowDimCount = (config.rowDims?.length || 0) + (config.measureLayout.includes('ROW') ? 1 : 0);
                for (let i = newPath.length; i < rowDimCount; i++) tr.insertCell();
                
                // Render metric values for this row
                (tree.colDefs || []).forEach(colDef => {
                    const metricValues = childNode.metrics[colDef.key];
                    if (!metricValues) {
                        tr.insertCell().textContent = '-';
                        return;
                    }

                    const colKeyParts = colDef.key.split('||');
                    const metricName = colKeyParts[0];
                    const metricIndex = config.metrics.findIndex(m => m.name === metricName);

                    const val = getAggregatedValue(metricValues[0], 'SUM');
                    const formatType = config.metricFormats[metricIndex] || 'DEFAULT';
                    const formatted = formatMetricValue(val, formatType);
                    tr.insertCell().textContent = formatted;
                });
            } else {
                // Not a leaf: recurse into children first
                recursiveRender(childNode, newPath);
            }
            
            // Render row subtotal - only if config explicitly requests it and this node has children
            const dimensionLevel = childNode.level;
            const subtotalConfig = config.rowSettings[dimensionLevel];
            if (subtotalConfig && subtotalConfig.subtotal === true && Object.keys(childNode.children).length > 0) {
                // Render subtotal row for this node
                const subtotalRow = tbody.insertRow();
                subtotalRow.style.fontWeight = 'bold';
                // Add dimension labels up to this level, then "Subtotal"
                for (let i = 0; i < dimensionLevel + 1; i++) {
                    if (i === dimensionLevel) {
                        subtotalRow.insertCell().textContent = `Subtotal ${childNode.value}`;
                    } else {
                        subtotalRow.insertCell().textContent = '';
                    }
                }
                // Add empty cells for extra dimensions
                const rowDimCount = (config.rowDims?.length || 0) + (config.measureLayout.includes('ROW') ? 1 : 0);
                for (let i = dimensionLevel + 1; i < rowDimCount; i++) subtotalRow.insertCell();
                
                // Render metric values for this subtotal - aggregate from all leaf descendants
                (tree.colDefs || []).forEach(colDef => {
                    // Aggregate all leaf descendants' metrics for this column
                    let aggregatedMetrics = null;
                    
                    function collectLeafMetrics(leafNode) {
                        if (Object.keys(leafNode.children).length === 0) {
                            // This is a leaf
                            if (leafNode.metrics && leafNode.metrics[colDef.key]) {
                                aggregatedMetrics = aggregateMetrics(aggregatedMetrics, 
                                    leafNode.metrics[colDef.key].map(m => m.sum), 
                                    [{sum: 0, count: 0}]);
                            }
                        } else {
                            // Recurse to leaves
                            Object.values(leafNode.children).forEach(child => collectLeafMetrics(child));
                        }
                    }
                    
                    collectLeafMetrics(childNode);
                    
                    if (!aggregatedMetrics) {
                        subtotalRow.insertCell().textContent = '-';
                        return;
                    }

                    const colKeyParts = colDef.key.split('||');
                    const metricName = colKeyParts[0];
                    const metricIndex = config.metrics.findIndex(m => m.name === metricName);

                    const metricAgg = config.metricSubtotalAggs[metricIndex] || 'NONE';
                    let val = 0;
                    if (metricAgg === 'NONE') {
                        val = '-';
                    } else {
                        val = getAggregatedValue(aggregatedMetrics[0], metricAgg);
                        const formatType = config.metricFormats[metricIndex] || 'DEFAULT';
                        val = formatMetricValue(val, formatType);
                    }
                    subtotalRow.insertCell().textContent = val;
                });
            }
        });
    }
    recursiveRender(tree.rowRoot, []);
    
    // Render Grand Total row if enabled
    if (config.showGrandTotal) {
        const grandTotalRow = tbody.insertRow();
        grandTotalRow.style.fontWeight = 'bold';
        
        // Add "Grand Total" label in the first cell
        grandTotalRow.insertCell().textContent = 'Grand Total';
        
        // Add empty cells for other row dimensions
        const rowDimCount = (config.rowDims?.length || 0) + (config.measureLayout.includes('ROW') ? 1 : 0);
        for (let i = 1; i < rowDimCount; i++) grandTotalRow.insertCell();
        
        // Render metric values for grand total - aggregate all leaf descendants
        (tree.colDefs || []).forEach(colDef => {
            // Aggregate all leaf descendants' metrics for this column
            let aggregatedMetrics = null;
            
            function collectAllLeafMetrics(node) {
                if (Object.keys(node.children).length === 0) {
                    // This is a leaf
                    if (node.metrics && node.metrics[colDef.key]) {
                        aggregatedMetrics = aggregateMetrics(aggregatedMetrics, 
                            node.metrics[colDef.key].map(m => m.sum), 
                            [{sum: 0, count: 0}]);
                    }
                } else {
                    // Recurse to leaves
                    Object.values(node.children).forEach(child => collectAllLeafMetrics(child));
                }
            }
            
            collectAllLeafMetrics(tree.rowRoot);
            
            if (!aggregatedMetrics) {
                grandTotalRow.insertCell().textContent = '-';
                return;
            }

            const colKeyParts = colDef.key.split('||');
            const metricName = colKeyParts[0];
            const metricIndex = config.metrics.findIndex(m => m.name === metricName);

            const metricAgg = config.metricSubtotalAggs[metricIndex] || 'NONE';
            let val = 0;
            if (metricAgg === 'NONE') {
                val = '-';
            } else {
                val = getAggregatedValue(aggregatedMetrics[0], metricAgg);
                const formatType = config.metricFormats[metricIndex] || 'DEFAULT';
                val = formatMetricValue(val, formatType);
            }
            grandTotalRow.insertCell().textContent = val;
        });
    }
}
