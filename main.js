// Main.js This is the entry to the community visualization

function renderBody(table, tree, config) {
    const tbody = table.createTBody();
    
    switch(config.metricLayout) {
        case 'METRIC_ROW':
            debugLog('Rendering body with METRIC_ROW layout');
            renderBodyMetricRow(tbody, tree, config);
            break;
        case 'METRIC_FIRST_ROW':
            debugLog('Rendering body with metric_FIRST_ROW layout');
            renderBodyMetricFirstRow(tbody, tree, config);
            break;
        case 'METRIC_FIRST_COLUMN':
            debugLog('Rendering body with metric_FIRST_COLUMN layout');
            renderBodymetricFirstColumn(tbody, tree, config);
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
let loadingOverlay;

function drawViz(data) {


    const container = document.getElementById('viz-container');
    container.innerHTML = ''; // Clear only the container in case of re-render
    if (loadingOverlay) loadingOverlay.style.display = 'none';
    container.style.fontFamily = data.theme.themeFontFamily;
    container.style.fontSize = data.theme.themeFontSize;
    container.style.height = '100vh';
    container.style.width = '100vw';
    container.style.overflow = 'auto';

    debugLog('Fields:', data.fields);
    const { style, fields, tables, theme } = data;

    const advcss = getStyleValue(style, 'advcss', '');
    let styleEl = document.getElementById('adv-css');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'adv-css';
        document.head.appendChild(styleEl);
    }
    styleEl.textContent = advcss;
    // Currently not used, but TODO: implement conditional formatting
    const conditionalFormatting = getStyleValue(style, 'conditionalFormatting', '');
    
    const config = {
        metricLayout: getStyleValue(style, 'metricLayout', 'METRIC_COLUMN'),
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

    for (let i = 0; i < 10; i++) {
        config.metricFormats.push(getStyleValue(style, `metric_format_${i + 1}`, 'DEFAULT'));
    }
    for (let i = 0; i < 10; i++) {
        config.metricSubtotalAggs.push(getStyleValue(style, `metric_subtotal_agg_${i + 1}`, 'NONE'));
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
    
    //const bgColor = (theme.themeFillColor && theme.themeFillColor.color) ? theme.themeFillColor.color : '#ffffff';
    
    // 1. Sticky Header Rows (Top)
    const headerRows = Array.from(table.tHead.rows);
    let currentTop = 0;
    
    headerRows.forEach(row => {
        const rowRect = row.getBoundingClientRect();
        Array.from(row.cells).forEach(cell => {
            cell.style.position = 'sticky';
            cell.style.top = currentTop + 'px';
            cell.style.zIndex = '10';
        });
        currentTop += rowRect.height;
    });

    // 2. Sticky Columns (Left)
    let stickyColCount = config.rowDims.length;
    if (config.metricLayout === 'METRIC_ROW' || config.metricLayout === 'METRIC_FIRST_ROW') {
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
            // cell.style.backgroundColor = bgColor;
            
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

function renderShellAndSubscribe() {
    document.body.innerHTML = '';

    const loadingOverlay = document.createElement('div');
    loadingOverlay.id = 'loading-overlay';
    loadingOverlay.style.position = 'fixed';
    loadingOverlay.style.top = '0';
    loadingOverlay.style.left = '0';
    loadingOverlay.style.width = '100%';
    loadingOverlay.style.height = '100%';
    loadingOverlay.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    loadingOverlay.style.display = 'flex';
    loadingOverlay.style.justifyContent = 'center';
    loadingOverlay.style.alignItems = 'center';
    loadingOverlay.style.zIndex = '9999';
    loadingOverlay.innerHTML = '<h2>Loading...</h2>';
    document.body.appendChild(loadingOverlay);

    const vizContainer = document.createElement('div');
    vizContainer.id = 'viz-container';
    document.body.appendChild(vizContainer);

    dscc.subscribeToData((data) => {
        // Use setTimeout to allow the browser to render the shell/loader
        // before starting the heavy work of drawing the visualization.
        setTimeout(() => {
            drawViz(data);
            loadingOverlay.style.display = 'none';
        }, 1);
    }, {
        transform: dscc.objectTransform
    });
}

renderShellAndSubscribe();