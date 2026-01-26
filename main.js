function renderBody(table, tree, config) {
    const tbody = table.createTBody();
    
    switch(config.measureLayout) {
        case 'METRIC_ROW':
            console.log('Rendering body with METRIC_ROW layout');
            renderBodyMetricRow(tbody, tree, config);
        case 'METRIC_FIRST_ROW':
            console.log('Rendering body with MEASURE_FIRST_ROW layout');
            break;
        case 'METRIC_FIRST_COLUMN':
            console.log('Rendering body with MEASURE_FIRST_COLUMN layout');
            renderBodyMeasureFirstColumn(tbody, tree, config);
            break;
        case 'METRIC_COLUMN':
        default:
            console.log('Rendering body with METRIC_COLUMN layout');
            renderBodyMetricColumn(tbody, tree, config);
            break;
    }
}

function drawViz(data) {
    console.log('drawViz called with data:', data);
    document.body.innerHTML = '';
    const container = document.createElement('div');
    container.style.fontFamily = data.theme.themeFontFamily;
    container.style.fontSize = data.theme.themeFontSize;
    document.body.appendChild(container);
    if (!data.tables || !data.tables.DEFAULT || data.tables.DEFAULT.length === 0) {
        console.warn('No data found in data.tables.DEFAULT');
        container.textContent = 'No data to display.';
        return;
    }
    console.log('Data tables.DEFAULT:', data.tables.DEFAULT);
    console.log('Fields:', data.fields);
    const {style,fields,tables,theme} = data;
    const config = {
        measureLayout: getStyleValue(style, 'measureLayout', 'METRIC_COLUMN'),
        rowDims: fields.dimensions || [],
        colDims: fields.columnDimensions || [],
        metrics: fields.metrics || [],
        rowSettings: [],
        colSettings: [],
        metricFormats: [],
        metricSubtotalAggs: [],
        showGrandTotal: getStyleValue(style, 'showGrandTotal', false),
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
        // Check if "Use Defaults" is enabled for this dimension
        const rdUseDefaults = getStyleValue(style, `rd_use_defaults_${i + 1}`, true);
        const cdUseDefaults = getStyleValue(style, `cd_use_defaults_${i + 1}`, true);
        
        config.rowSettings.push({
            subtotal: rdUseDefaults ? false : getStyleValue(style, `rd_subtotal_${i + 1}`, false),
            sortType: rdUseDefaults ? 'DIMENSION' : getStyleValue(style, `rd_sort_type_${i + 1}`, 'DIMENSION'),
            sortMetricIndex: rdUseDefaults ? 0 : (parseInt(getStyleValue(style, `rd_sort_metric_index_${i + 1}`, '1'), 10) - 1),
            sortAgg: rdUseDefaults ? 'SUM' : getStyleValue(style, `rd_sort_agg_${i + 1}`, 'SUM'),
            sortDir: rdUseDefaults ? 'ASC' : getStyleValue(style, `rd_sort_dir_${i + 1}`, 'ASC'),
        });
        config.colSettings.push({
            subtotal: cdUseDefaults ? false : getStyleValue(style, `cd_subtotal_${i + 1}`, false),
            sortType: cdUseDefaults ? 'DIMENSION' : getStyleValue(style, `cd_sort_type_${i + 1}`, 'DIMENSION'),
            sortMetricIndex: cdUseDefaults ? 0 : (parseInt(getStyleValue(style, `cd_sort_metric_index_${i + 1}`, '1'), 10) - 1),
            sortAgg: cdUseDefaults ? 'SUM' : getStyleValue(style, `cd_sort_agg_${i + 1}`, 'SUM'),
            sortDir: cdUseDefaults ? 'ASC' : getStyleValue(style, `cd_sort_dir_${i + 1}`, 'ASC'),
        });
    }
    const tree = buildDataTree(config, tables.DEFAULT);
    console.log('Built tree:', tree);
    const table = document.createElement('table');
    table.className = 'pivot-table';
    container.appendChild(table);
    renderHeader(table, tree, config);
    renderBody(table, tree, config);
}
// Subscribe to data changes
dscc.subscribeToData(drawViz, {
    transform: dscc.objectTransform
});