function renderBodyMetricRow(tbody, tree, config) {
    function recursiveRender(node, path) {
        const sortConfig = config.rowSettings[node.level + 1];
        let sortedChildren = Object.values(node.children);
        if (sortConfig) {
            // TODO : Sorting
        }
        sortedChildren.forEach(childNode => {
            const newPath = [...path, childNode.value];
            const isLeaf = Object.keys(childNode.children).length === 0;
            
            // Only render data rows if this is a leaf node (which represents metric name in METRIC_ROW)
            if (isLeaf) {
                const tr = tbody.insertRow();
                newPath.forEach(val => tr.insertCell().textContent = val);
                const rowDimCount = (config.rowDims?.length || 0) + (config.measureLayout.includes('ROW') ? 1 : 0);
                for (let i = newPath.length; i < rowDimCount; i++) tr.insertCell();
                
                // Find which metric this row represents by matching the metric name in the path
                const metricName = newPath[newPath.length - 1];
                const metricIndex = config.metrics.findIndex(m => m.name === metricName);
                
                // Render metric values for this row (each column dimension gets one value)
                (tree.colDefs || []).forEach(colDef => {
                    const metricValues = childNode.metrics[colDef.key];
                    if (!metricValues) {
                        // In METRIC_ROW, each cell represents one metric value
                        tr.insertCell().textContent = '-';
                        return;
                    }
                    // In METRIC_ROW layout, there's typically only one value per cell (the metric itself)
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
            // In METRIC_ROW, render one subtotal row per metric
            const dimensionLevel = childNode.level;
            const subtotalConfig = config.rowSettings[dimensionLevel];
            if (subtotalConfig && subtotalConfig.subtotal === true && Object.keys(childNode.children).length > 0) {
                // Render one subtotal row for each metric
                config.metrics.forEach((metric, metricIndex) => {
                    const subtotalRow = tbody.insertRow();
                    subtotalRow.style.fontWeight = 'bold';
                    
                    // Add empty cells for ALL row dimensions
                    const rowDimCount = config.rowDims?.length || 0;
                    for (let i = 0; i < rowDimCount; i++) {
                        if (i === dimensionLevel) {
                            subtotalRow.insertCell().textContent = `Subtotal ${childNode.value}`;
                        } else {
                            subtotalRow.insertCell().textContent = '';
                        }
                    }
                    
                    // Add metric name cell in the measure column
                    subtotalRow.insertCell().textContent = metric.name;
                    
                    // Render metric values for this subtotal
                    (tree.colDefs || []).forEach(colDef => {
                        // Aggregate leaf descendants that match the metric at this dimension level
                        let aggregatedMetrics = null;
                        
                        function collectLeafMetrics(node) {
                            if (Object.keys(node.children).length === 0) {
                                // This is a leaf - in METRIC_ROW it's a metric node
                                if (node.metrics && node.metrics[colDef.key]) {
                                    // Check if this leaf's metric matches our target metric
                                    if (node.value === metric.name) {
                                        aggregatedMetrics = aggregateMetrics(aggregatedMetrics, 
                                            node.metrics[colDef.key].map(m => m.sum), 
                                            [metric]);
                                    }
                                }
                            } else {
                                // Recurse to children
                                Object.values(node.children).forEach(child => collectLeafMetrics(child));
                            }
                        }
                        
                        collectLeafMetrics(childNode);
                        
                        if (!aggregatedMetrics) {
                            subtotalRow.insertCell().textContent = '-';
                            return;
                        }
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
                });
            }
        });
    }
    recursiveRender(tree.rowRoot, []);
    
    // Render Grand Total rows if enabled
    // In METRIC_ROW, render one grand total row per metric
    if (config.showGrandTotal) {
        config.metrics.forEach((metric, metricIndex) => {
            const grandTotalRow = tbody.insertRow();
            grandTotalRow.style.fontWeight = 'bold';
            
            // Add "Grand Total" label in first dimension cell, empty cells for others
            const rowDimCount = config.rowDims?.length || 0;
            for (let i = 0; i < rowDimCount; i++) {
                if (i === 0) {
                    grandTotalRow.insertCell().textContent = 'Grand Total';
                } else {
                    grandTotalRow.insertCell().textContent = '';
                }
            }
            
            // Add metric name cell
            grandTotalRow.insertCell().textContent = metric.name;
            
            // Render metric values for grand total
            (tree.colDefs || []).forEach(colDef => {
                // Aggregate all leaf descendants that match this metric
                let aggregatedMetrics = null;
                
                function collectAllLeafMetrics(node) {
                    if (Object.keys(node.children).length === 0) {
                        // This is a leaf
                        if (node.metrics && node.metrics[colDef.key]) {
                            // Check if this leaf belongs to the target metric
                            const leafMetricName = node.value;
                            if (leafMetricName === metric.name) {
                                aggregatedMetrics = aggregateMetrics(aggregatedMetrics, 
                                    node.metrics[colDef.key].map(m => m.sum), 
                                    [metric]);
                            }
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
        });
    }
}
