// Main.js This is the entry to the community visualization

function renderBody(table, tree, config) {
    const tbody = table.createTBody();
    
    switch(config.measureLayout) {
        case 'METRIC_ROW':
            debugLog('Rendering body with METRIC_ROW layout');
            renderBodyMetricRow(tbody, tree, config);
            break;
        case 'METRIC_FIRST_ROW':
            debugLog('Rendering body with MEASURE_FIRST_ROW layout');
            renderBodyMetricFirstRow(tbody, tree, config);
            break;
        case 'METRIC_FIRST_COLUMN':
            debugLog('Rendering body with MEASURE_FIRST_COLUMN layout');
            renderBodyMeasureFirstColumn(tbody, tree, config);
            break;
        case 'METRIC_COLUMN':
        default:
            debugLog('Rendering body with METRIC_COLUMN layout');
            renderBodyMetricColumn(tbody, tree, config);
            break;
    }
}

function debugLog(...args) {
    if (devMode) {
        console.log(...args);
    }
}
const devMode = true;


function drawViz(data) {

    debugLog('drawViz called with data:', data);
    document.body.innerHTML = '';
    const container = document.createElement('div');
    container.style.fontFamily = data.theme.themeFontFamily;
    container.style.fontSize = data.theme.themeFontSize;
    container.style.height = '100vh';
    container.style.width = '100vw';
    container.style.overflow = 'auto';
    document.body.appendChild(container);

    debugLog('Fields:', data.fields);
    const {style,fields,tables,theme} = data;

    const advcss = getStyleValue(style, 'advcss', '');
    if (advcss) {
        const styleEl = document.createElement('style');
        styleEl.textContent = advcss;
        document.head.appendChild(styleEl);
    }

    const config = {
        measureLayout: getStyleValue(style, 'measureLayout', 'METRIC_COLUMN'),
        rowDims: fields.dimensions || [],
        colDims: fields.columnDimensions || [],
        metrics: fields.metrics || [],
        metricsForCalcs: fields.metricsForCalcs || [],
        rowSettings: [],
        colSettings: [],
        metricFormats: [],
        metricSubtotalAggs: [],
        showRowGrandTotal: getStyleValue(style, 'showRowGrandTotal', false),
        showColumnGrandTotal: getStyleValue(style, 'showColumnGrandTotal', false),
    };
    
    // Load metric formatting options (up to 10 metrics)
    for (let i = 0; i < 10; i++) {
        config.metricFormats.push(
            getStyleValue(style, `metric_format_${i + 1}`, 'DEFAULT')
        );
    }
    
    // Load per-metric subtotal aggregation options (up to 10 metrics)
    for (let i = 0; i < 10; i++) {
        config.metricSubtotalAggs.push(
            getStyleValue(style, `metric_subtotal_agg_${i + 1}`, 'NONE')
        );
    }
    
    for (let i = 0; i < 5; i++) {
        config.rowSettings.push({
            subtotal: getStyleValue(style, `rd_subtotal_${i + 1}`, false),
            sortType: getStyleValue(style, `rd_sort_type_${i + 1}`, 'DIMENSION'),
            sortMetricIndex: (parseInt(getStyleValue(style, `rd_sort_metric_index_${i + 1}`, '1'), 10) - 1),
            sortAgg: getStyleValue(style, `rd_sort_agg_${i + 1}`, 'SUM'),
            sortDir: getStyleValue(style, `rd_sort_dir_${i + 1}`, 'ASC'),
        });
        config.colSettings.push({
            subtotal: getStyleValue(style, `cd_subtotal_${i + 1}`, false),
            sortType: getStyleValue(style, `cd_sort_type_${i + 1}`, 'DIMENSION'),
            sortMetricIndex: (parseInt(getStyleValue(style, `cd_sort_metric_index_${i + 1}`, '1'), 10) - 1),
            sortAgg: getStyleValue(style, `cd_sort_agg_${i + 1}`, 'SUM'),
            sortDir: getStyleValue(style, `cd_sort_dir_${i + 1}`, 'ASC'),
        });
    }
    const tree = buildDataTree(config, tables.DEFAULT);
    debugLog('Built tree:', tree);
    const table = document.createElement('table');
    table.className = 'pivot-table';
    container.appendChild(table);
    renderHeader(table, tree, config);
    renderBody(table, tree, config);
    applyStickyHeaders(table, config, theme);
}

function applyStickyHeaders(table, config, theme) {
    const bgColor = (theme.themeFillColor && theme.themeFillColor.color) ? theme.themeFillColor.color : '#ffffff';
    
    // 1. Sticky Header Rows (Top)
    const headerRows = Array.from(table.tHead.rows);
    let currentTop = 0;
    
    headerRows.forEach(row => {
        const rowRect = row.getBoundingClientRect();
        Array.from(row.cells).forEach(cell => {
            cell.style.position = 'sticky';
            cell.style.top = currentTop + 'px';
            cell.style.zIndex = '10';
            cell.style.backgroundColor = bgColor;
        });
        currentTop += rowRect.height;
    });

    // 2. Sticky Columns (Left)
    let stickyColCount = config.rowDims.length;
    if (config.measureLayout === 'METRIC_ROW' || config.measureLayout === 'METRIC_FIRST_ROW') {
        stickyColCount += 1;
    }

    const allRows = Array.from(table.rows);
    allRows.forEach(row => {
        let currentLeft = 0;
        let logicalColIndex = 0;
        const cells = Array.from(row.cells);
        
        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (logicalColIndex >= stickyColCount) break;

            cell.style.position = 'sticky';
            cell.style.left = currentLeft + 'px';
            cell.style.backgroundColor = bgColor;
            
            // Intersection z-index (Top Left Corner)
            if (row.parentElement.tagName === 'THEAD') {
                cell.style.zIndex = '12';
            } else {
                cell.style.zIndex = '9';
            }

            currentLeft += cell.getBoundingClientRect().width;
            logicalColIndex += (cell.colSpan || 1);
        }
    });
}

// Subscribe to data changes
dscc.subscribeToData(drawViz, {
    transform: dscc.objectTransform
});