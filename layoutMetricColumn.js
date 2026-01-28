function renderBodyMetricColumn(tbody, tree, config) {

    function renderTotalsRow(node, isGrandTotal) {
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

                (tree.colDefs || []).forEach(colDef => {
                    const stats = childNode.metrics[colDef.key];
                    config.metrics.forEach((m, i) => {
                        renderMetricCell(tr, stats ? stats[i] : null, i, config);
                    });
                });
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

    if (config.showGrandTotal) {
        renderTotalsRow(tree.rowRoot, true);
    }
}