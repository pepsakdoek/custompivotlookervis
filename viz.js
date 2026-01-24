// REMEMBER TO IMPORT THE DSCC LIBRARY
// ============================================

!function(e,R){"object"==typeof exports&&"object"==typeof module?module.exports=R():"function"==typeof define&&define.amd?define("dscc",[],R):"object"==typeof exports?exports.dscc=R():e.dscc=R()}(window,function(){return t={},n.m=C={"./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */function(e,N,R){"use strict";var i=this&&this.__assign||function(){return(i=Object.assign||function(e){for(var R,C=1,t=arguments.length;C<t;C++)for(var n in R=arguments[C])Object.prototype.hasOwnProperty.call(R,n)&&(e[n]=R[n]);return e}).apply(this,arguments)};Object.defineProperty(N,"__esModule",{value:!0});
/*!
  @license
  Copyright 2019 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
var _=R(/*! ./types */"./src/types.ts");!function(e){for(var R in e)N.hasOwnProperty(R)||(N[R]=e[R])}(R(/*! ./types */"./src/types.ts")),N.getWidth=function(){return document.body.clientWidth},N.getHeight=function(){return document.documentElement.clientHeight},N.getComponentId=function(){var e=new URLSearchParams(window.location.search);if(null!==e.get("dscId"))return e.get("dscId");throw new Error("dscId must be in the query parameters. This is a bug in ds-component, please file a bug: https://github.com/googledatastudio/ds-component/issues/new")};function E(e){return e.type===_.ConfigDataElementType.DIMENSION||e.type===_.ConfigDataElementType.METRIC}function r(e){return e===_.ConfigDataElementType.DIMENSION?-1:1}function a(e){var R=[];e.config.data.forEach(function(e){e.elements.filter(E).forEach(function(e){R.push(e)})});var C,t=(C=function(e,R){return r(e.type)-r(R.type)},R.map(function(e,R){return{item:e,index:R}}).sort(function(e,R){return C(e.item,R.item)||e.index-R.index}).map(function(e){return e.item})),n=[];return t.forEach(function(e){e.value.forEach(function(){return n.push(e.id)})}),n}function o(R){return function(e){var C,t,n={};return t=R,((C=e).length<t.length?C.map(function(e,R){return[e,t[R]]}):t.map(function(e,R){return[C[R],e]})).forEach(function(e){var R=e[0],C=e[1];void 0===n[C]&&(n[C]=[]),n[C].push(R)},{}),n}}N.fieldsByConfigId=function(e){var R=e.fields.reduce(function(e,R){return e[R.id]=R,e},{}),C={};return e.config.data.forEach(function(e){e.elements.filter(E).forEach(function(e){C[e.id]=e.value.map(function(e){return R[e]})})}),C};function U(e){var R={};return(e.config.style||[]).forEach(function(e){e.elements.forEach(function(e){if(void 0!==R[e.id])throw new Error("styleIds must be unique. Your styleId: '"+e.id+"' is used more than once.");R[e.id]={value:e.value,defaultValue:e.defaultValue}})},{}),R}function Y(e){return e.config.themeStyle}function n(e){switch(e){case _.DSInteractionType.FILTER:return _.InteractionType.FILTER}}function s(e){var R=e.config.interactions;return void 0===R?{}:R.reduce(function(e,R){var C=R.supportedActions.map(n),t={type:n(R.value.type),data:R.value.data};return e[R.id]={value:t,supportedActions:C},e},{})}N.tableTransform=function(e){return{tables:(R=e,t=N.fieldsByConfigId(R),n=a(R),E={},r=n.map(function(e){void 0===E[e]?E[e]=0:E[e]++;var R=E[e],C=t[e][R];return i(i({},C),{configId:e})}),(C={})[_.TableType.DEFAULT]={headers:[],rows:[]},o=C,R.dataResponse.tables.forEach(function(e){o[e.id]={headers:r,rows:e.rows}}),o),fields:N.fieldsByConfigId(e),style:U(e),theme:Y(e),interactions:s(e)};var R,C,t,n,E,r,o},N.objectTransform=function(e){return{tables:(t=a(R=e),(C={})[_.TableType.DEFAULT]=[],n=C,R.dataResponse.tables.forEach(function(e){var R=e.rows.map(o(t));e.id===_.TableType.DEFAULT?n[e.id]=R:(void 0===n[e.id]&&(n[e.id]=[]),n[e.id]=n[e.id].concat(R))}),n),fields:N.fieldsByConfigId(e),style:U(e),theme:Y(e),interactions:s(e)};var R,C,t,n};function u(e){var R,C=!1;return e===N.tableTransform||e===N.objectTransform?C=!0:(R=!1,"identity"===e("identity")&&(R=!0,console.warn("This is an unsupported data format. Please use one of the supported transforms:\n       dscc.objectFormat or dscc.tableFormat.")),R&&(C=!0)),C}N.subscribeToData=function(R,C){if(u(C.transform)){var e=function(e){e.data.type===_.MessageType.RENDER?R(C.transform(e.data)):console.error("MessageType: "+e.data.type+" is not supported by this version of the library.")};window.addEventListener("message",e);var t={componentId:N.getComponentId(),type:_.ToDSMessageType.VIZ_READY};return window.parent.postMessage(t,"*"),function(){return window.removeEventListener("message",e)}}throw new Error("Only the built in transform functions are supported.")},N.sendInteraction=function(e,R,C){var t=N.getComponentId(),n={type:_.ToDSMessageType.INTERACTION,id:e,data:C,componentId:t};window.parent.postMessage(n,"*")},N.clearInteraction=function(e,R){N.sendInteraction(e,R,void 0)}},"./src/types.ts":
/*!**********************!*\
  !*** ./src/types.ts ***!
  \**********************/
/*! no static exports found */function(e,R,C){"use strict";var t,n,E,r,o,N;Object.defineProperty(R,"__esModule",{value:!0}),(t=R.ConceptType||(R.ConceptType={})).METRIC="METRIC",t.DIMENSION="DIMENSION",(R.MessageType||(R.MessageType={})).RENDER="RENDER",(n=R.FieldType||(R.FieldType={})).YEAR="YEAR",n.YEAR_QUARTER="YEAR_QUARTER",n.YEAR_MONTH="YEAR_MONTH",n.YEAR_WEEK="YEAR_WEEK",n.YEAR_MONTH_DAY="YEAR_MONTH_DAY",n.YEAR_MONTH_DAY_HOUR="YEAR_MONTH_DAY_HOUR",n.QUARTER="QUARTER",n.MONTH="MONTH",n.WEEK="WEEK",n.MONTH_DAY="MONTH_DAY",n.DAY_OF_WEEK="DAY_OF_WEEK",n.DAY="DAY",n.HOUR="HOUR",n.MINUTE="MINUTE",n.DURATION="DURATION",n.COUNTRY="COUNTRY",n.COUNTRY_CODE="COUNTRY_CODE",n.CONTINENT="CONTINENT",n.CONTINENT_CODE="CONTINENT_CODE",n.SUB_CONTINENT="SUB_CONTINENT",n.SUB_CONTINENT_CODE="SUB_CONTINENT_CODE",n.REGION="REGION",n.REGION_CODE="REGION_CODE",n.CITY="CITY",n.CITY_CODE="CITY_CODE",n.METRO_CODE="METRO_CODE",n.LATITUDE_LONGITUDE="LATITUDE_LONGITUDE",n.NUMBER="NUMBER",n.PERCENT="PERCENT",n.TEXT="TEXT",n.BOOLEAN="BOOLEAN",n.URL="URL",n.IMAGE="IMAGE",n.CURRENCY_AED="CURRENCY_AED",n.CURRENCY_ALL="CURRENCY_ALL",n.CURRENCY_ARS="CURRENCY_ARS",n.CURRENCY_AUD="CURRENCY_AUD",n.CURRENCY_BDT="CURRENCY_BDT",n.CURRENCY_BGN="CURRENCY_BGN",n.CURRENCY_BOB="CURRENCY_BOB",n.CURRENCY_BRL="CURRENCY_BRL",n.CURRENCY_CAD="CURRENCY_CAD",n.CURRENCY_CDF="CURRENCY_CDF",n.CURRENCY_CHF="CURRENCY_CHF",n.CURRENCY_CLP="CURRENCY_CLP",n.CURRENCY_CNY="CURRENCY_CNY",n.CURRENCY_COP="CURRENCY_COP",n.CURRENCY_CRC="CURRENCY_CRC",n.CURRENCY_CZK="CURRENCY_CZK",n.CURRENCY_DKK="CURRENCY_DKK",n.CURRENCY_DOP="CURRENCY_DOP",n.CURRENCY_EGP="CURRENCY_EGP",n.CURRENCY_ETB="CURRENCY_ETB",n.CURRENCY_EUR="CURRENCY_EUR",n.CURRENCY_GBP="CURRENCY_GBP",n.CURRENCY_HKD="CURRENCY_HKD",n.CURRENCY_HRK="CURRENCY_HRK",n.CURRENCY_HUF="CURRENCY_HUF",n.CURRENCY_IDR="CURRENCY_IDR",n.CURRENCY_ILS="CURRENCY_ILS",n.CURRENCY_INR="CURRENCY_INR",n.CURRENCY_IRR="CURRENCY_IRR",n.CURRENCY_ISK="CURRENCY_ISK",n.CURRENCY_JMD="CURRENCY_JMD",n.CURRENCY_JPY="CURRENCY_JPY",n.CURRENCY_KRW="CURRENCY_KRW",n.CURRENCY_LKR="CURRENCY_LKR",n.CURRENCY_LTL="CURRENCY_LTL",n.CURRENCY_MNT="CURRENCY_MNT",n.CURRENCY_MVR="CURRENCY_MVR",n.CURRENCY_MXN="CURRENCY_MXN",n.CURRENCY_MYR="CURRENCY_MYR",n.CURRENCY_NOK="CURRENCY_NOK",n.CURRENCY_NZD="CURRENCY_NZD",n.CURRENCY_PAB="CURRENCY_PAB",n.CURRENCY_PEN="CURRENCY_PEN",n.CURRENCY_PHP="CURRENCY_PHP",n.CURRENCY_PKR="CURRENCY_PKR",n.CURRENCY_PLN="CURRENCY_PLN",n.CURRENCY_RON="CURRENCY_RON",n.CURRENCY_RSD="CURRENCY_RSD",n.CURRENCY_RUB="CURRENCY_RUB",n.CURRENCY_SAR="CURRENCY_SAR",n.CURRENCY_SEK="CURRENCY_SEK",n.CURRENCY_SGD="CURRENCY_SGD",n.CURRENCY_THB="CURRENCY_THB",n.CURRENCY_TRY="CURRENCY_TRY",n.CURRENCY_TWD="CURRENCY_TWD",n.CURRENCY_TZS="CURRENCY_TZS",n.CURRENCY_UAH="CURRENCY_UAH",n.CURRENCY_USD="CURRENCY_USD",n.CURRENCY_UYU="CURRENCY_UYU",n.CURRENCY_VEF="CURRENCY_VEF",n.CURRENCY_VND="CURRENCY_VND",n.CURRENCY_YER="CURRENCY_YER",n.CURRENCY_ZAR="CURRENCY_ZAR",(E=R.TableType||(R.TableType={})).DEFAULT="DEFAULT",E.COMPARISON="COMPARISON",E.SUMMARY="SUMMARY",(r=R.ConfigDataElementType||(R.ConfigDataElementType={})).METRIC="METRIC",r.DIMENSION="DIMENSION",r.MAX_RESULTS="MAX_RESULTS",(o=R.ConfigStyleElementType||(R.ConfigStyleElementType={})).TEXTINPUT="TEXTINPUT",o.SELECT_SINGLE="SELECT_SINGLE",o.CHECKBOX="CHECKBOX",o.FONT_COLOR="FONT_COLOR",o.FONT_SIZE="FONT_SIZE",o.FONT_FAMILY="FONT_FAMILY",o.FILL_COLOR="FILL_COLOR",o.BORDER_COLOR="BORDER_COLOR",o.AXIS_COLOR="AXIS_COLOR",o.GRID_COLOR="GRID_COLOR",o.OPACITY="OPACITY",o.LINE_WEIGHT="LINE_WEIGHT",o.LINE_STYLE="LINE_STYLE",o.BORDER_RADIUS="BORDER_RADIUS",o.INTERVAL="INTERVAL",o.SELECT_RADIO="SELECT_RADIO",(R.DSInteractionType||(R.DSInteractionType={})).FILTER="FILTER",(N=R.ToDSMessageType||(R.ToDSMessageType={})).VIZ_READY="vizReady",N.INTERACTION="vizAction",(R.InteractionType||(R.InteractionType={})).FILTER="FILTER"}},n.c=t,n.d=function(e,R,C){n.o(e,R)||Object.defineProperty(e,R,{enumerable:!0,get:C})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(R,e){if(1&e&&(R=n(R)),8&e)return R;if(4&e&&"object"==typeof R&&R&&R.__esModule)return R;var C=Object.create(null);if(n.r(C),Object.defineProperty(C,"default",{enumerable:!0,value:R}),2&e&&"string"!=typeof R)for(var t in R)n.d(C,t,function(e){return R[e]}.bind(null,t));return C},n.n=function(e){var R=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(R,"a",R),R},n.o=function(e,R){return Object.prototype.hasOwnProperty.call(e,R)},n.p="",n(n.s="./src/index.ts");function n(e){if(t[e])return t[e].exports;var R=t[e]={i:e,l:!1,exports:{}};return C[e].call(R.exports,R,R.exports,n),R.l=!0,R.exports}var C,t});

// VIZ CODE STARTS HERE
// ============================================
// Helper Functions
// ============================================
function getStyleValue(style, id, defaultValue) {
    return (style[id] && typeof style[id].value !== 'undefined') ? style[id].value : defaultValue;
}
// Enhanced aggregation to support SUM, AVG, etc.
function aggregateMetrics(existing, addition, metrics) {
    if (!existing) {
        // Initialize with all required aggregation stats for each metric value
        return addition.map(val => ({
            sum: val,
            count: 1,
            min: val,
            max: val,
            distinctValues: new Set([val])
        }));
    }
    metrics.forEach((metric, i) => {
        const val = addition[i] || 0;
        const stats = existing[i];
        stats.sum += val;
        stats.count += 1;
        if (val < stats.min) stats.min = val;
        if (val > stats.max) stats.max = val;
        stats.distinctValues.add(val);
    });
    return existing;
}

function getAggregatedValue(metric, aggType) {
    if (!metric) return 0;
    switch (aggType) {
        case 'AVG':
            return metric.count === 0 ? 0 : metric.sum / metric.count;
        case 'COUNT':
            return metric.count;
        case 'COUNT_DISTINCT':
            return metric.distinctValues.size;
        case 'MIN':
            return metric.min;
        case 'MAX':
            return metric.max;
        case 'SUM':
        default:
            return metric.sum;
    }
}
function processNode(tree, rowDims, colDims, metricValues, colKeys, config, metricsForAgg) {
    const leafColKey = colDims.join('||');
    colKeys.add(leafColKey);
    
    // PHASE 1: Store only at leaf nodes (no recursion)
    // Store in rowRoot with full row path as leaf
    let rowNode = tree.rowRoot;
    rowDims.forEach((dimValue, i) => {
        if (!rowNode.children[dimValue]) {
            rowNode.children[dimValue] = {
                value: dimValue,
                level: i,
                children: {},
                metrics: {}
            };
        }
        rowNode = rowNode.children[dimValue];
    });
    
    // Store metrics only at the leaf row node
    if (!rowNode.metrics) rowNode.metrics = {};
    rowNode.metrics[leafColKey] = aggregateMetrics(rowNode.metrics[leafColKey], metricValues, metricsForAgg);
    
    // PHASE 1: Build column hierarchy (same as before - needed for sorting)
    let colNode = tree.colRoot;
    if (!colNode.metrics) colNode.metrics = null;
    colNode.metrics = aggregateMetrics(colNode.metrics, metricValues, metricsForAgg);
    colDims.forEach((dimValue, i) => {
        if (!colNode.children[dimValue]) {
            colNode.children[dimValue] = {
                value: dimValue,
                level: i,
                children: {},
                metrics: null
            };
        }
        colNode = colNode.children[dimValue];
        if (!colNode.metrics) colNode.metrics = null;
        colNode.metrics = aggregateMetrics(colNode.metrics, metricValues, metricsForAgg);
    });
}

function calculateSubtotals(tree, config, metricsForAgg, colKeys) {
    // PHASE 2: Calculate subtotals from leaf nodes only
    // This prevents double-counting by always aggregating from leaves
    
    function aggregateLeafValues(node, path, targetPath, colKey) {
        // Recursively find all leaf nodes that match the targetPath prefix
        // and aggregate their values for the given colKey
        if (Object.keys(node.children).length === 0) {
            // This is a leaf node
            if (node.metrics && node.metrics[colKey]) {
                return node.metrics[colKey];
            }
            return null;
        }
        
        // Not a leaf, so recurse through children
        let aggregated = null;
        Object.values(node.children).forEach(child => {
            const childAgg = aggregateLeafValues(child, [...path, child.value], targetPath, colKey);
            if (childAgg) {
                aggregated = aggregateMetrics(aggregated, [childAgg.sum, childAgg.count], metricsForAgg);
            }
        });
        return aggregated;
    }
    
    // For each row dimension level, calculate subtotals if enabled
    const rowDims = config.rowDims || [];
    for (let level = 0; level < rowDims.length; level++) {
        const subtotalConfig = config.rowSettings[level];
        if (!subtotalConfig || !subtotalConfig.subtotal) continue;
        
        // Walk the row tree at this level and aggregate children
        function processRowLevel(node, path) {
            if (path.length === level) {
                // We're at the target level - aggregate this node's children
                Object.values(node.children).forEach(child => {
                    // For each column key, aggregate leaf descendants
                    Array.from(colKeys).forEach(colKey => {
                        if (!child.metrics) child.metrics = {};
                        const aggregated = aggregateLeafValuesFromNode(child, colKey, metricsForAgg);
                        if (aggregated) {
                            child.metrics[colKey] = aggregated;
                        }
                    });
                });
            } else {
                // Recurse deeper
                Object.values(node.children).forEach(child => {
                    processRowLevel(child, [...path, child.value]);
                });
            }
        }
        processRowLevel(tree.rowRoot, []);
    }
}

function aggregateLeafValuesFromNode(parentNode, colKey, metricsForAgg) {
    // Find all leaf descendants and aggregate their metrics for this colKey
    let aggregated = null;
    
    function walkToLeaves(node) {
        if (Object.keys(node.children).length === 0) {
            // Leaf node
            if (node.metrics && node.metrics[colKey]) {
                aggregated = aggregateMetrics(aggregated, 
                    [node.metrics[colKey].sum], 
                    [{sum: node.metrics[colKey].sum, count: 1}]);
            }
            return;
        }
        Object.values(node.children).forEach(child => walkToLeaves(child));
    }
    
    walkToLeaves(parentNode);
    return aggregated;
}

function getSortedKeys(node, path, config, settingsKey) {
    if (Object.keys(node.children).length === 0) {
        return path.length > 0 ? [path.join('||')] : [];
    }
    const settings = config[settingsKey];
    const sortConfig = settings[node.level + 1];
    let sortedChildren = Object.values(node.children);
    if (sortConfig && (sortConfig.sortType === 'METRIC' || sortConfig.sortType === 'DIMENSION')) {
        sortedChildren.sort((a, b) => {
            let valA, valB;
            if (sortConfig.sortType === 'METRIC') {
                const metricIdx = sortConfig.sortMetricIndex;
                valA = getAggregatedValue(a.metrics?.[metricIdx], sortConfig.sortAgg);
                valB = getAggregatedValue(b.metrics?.[metricIdx], sortConfig.sortAgg);
            } else {
                valA = a.value;
                valB = b.value;
            }
            const order = sortConfig.sortDir === 'ASC' ? 1 : -1;
            if (valA === undefined || valA === null) return 1 * order;
            if (valB === undefined || valB === null) return -1 * order;
            if (valA < valB) return -1 * order;
            if (valA > valB) return 1 * order;
            return 0;
        });
    }
    return sortedChildren.flatMap(child => getSortedKeys(child, [...path, child.value], config, settingsKey));
}

function getFinalColKeys(node, path, config) {
    const settings = config.colSettings;
    const sortConfig = settings[node.level + 1];
    let sortedChildren = Object.values(node.children);
    // Sort children based on config
    if (sortConfig && (sortConfig.sortType === 'METRIC' || sortConfig.sortType === 'DIMENSION')) {
        sortedChildren.sort((a, b) => {
            let valA, valB;
            if (sortConfig.sortType === 'METRIC') {
                const metricIdx = sortConfig.sortMetricIndex;
                valA = getAggregatedValue(a.metrics?.[metricIdx], sortConfig.sortAgg);
                valB = getAggregatedValue(b.metrics?.[metricIdx], sortConfig.sortAgg);
            } else { // DIMENSION
                valA = a.value;
                valB = b.value;
            }
            const order = sortConfig.sortDir === 'ASC' ? 1 : -1;
            if (valA === undefined || valA === null) return 1 * order;
            if (valB === undefined || valB === null) return -1 * order;
            if (valA < valB) return -1 * order;
            if (valA > valB) return 1 * order;
            return 0;
        });
    }
    // Base case: if it's a leaf node.
    if (sortedChildren.length === 0) {
        return path.length > 0 ? [{
            key: path.join('||'),
            isSubtotal: false,
            label: path[path.length - 1]
        }] : [];
    }
    // Recursive step: get keys from children.
    let finalKeys = sortedChildren.flatMap(child => getFinalColKeys(child, [...path, child.value], config));
    // Add subtotal for the current node after its children.
    const subtotalConfig = settings[node.level];
    if (subtotalConfig && subtotalConfig.subtotal && path.length > 0) {
        finalKeys.push({
            key: path.join('||'),
            isSubtotal: true,
            label: `Subtotal ${path[path.length - 1]}`
        });
    }
    return finalKeys;
}

function buildDataTree(config, data) {
    const tree = {
        rowRoot: {
            children: {},
            level: -1,
            metrics: {}
        },
        colRoot: {
            children: {},
            level: -1
        }
    };
    const colKeys = new Set(); // Keep track of all leaf column keys
    data.forEach(row => {
        // Looker Studio provides dimensions and metrics as arrays of arrays.
        // We'll take the first value for each.
        const rowDims = (row.dimensions || []).map(String);
        const colDims = (row.columnDimensions || []).map(String);
        const metricValues = row.metrics.map(val => {
            // Handle both array format [value] and direct number format
            const raw = Array.isArray(val) ? val[0] : val;
            const v = (raw != null) ? parseFloat(raw) : 0;
            return isNaN(v) ? 0 : v;
        }); // Assuming single value per metric
        const measureLayout = config.measureLayout;
        if (measureLayout === 'METRIC_ROW' && config.metrics.length > 0) {
            config.metrics.forEach((metric, i) => {
                processNode(tree, [...rowDims, metric.name], colDims, [metricValues[i]], colKeys, config, [metric]);
            });
        } else if (measureLayout === 'MEASURE_FIRST_ROW' && config.metrics.length > 0) {
            config.metrics.forEach((metric, i) => {
                processNode(tree, [metric.name, ...rowDims], colDims, [metricValues[i]], colKeys, config, [metric]);
            });
        } else if (measureLayout === 'MEASURE_FIRST_COLUMN' && config.metrics.length > 0) {
            config.metrics.forEach((metric, i) => {
                processNode(tree, rowDims, [metric.name, ...colDims], [metricValues[i]], colKeys, config, [metric]);
            });
        } else { // METRIC_COLUMN (standard)
            processNode(tree, rowDims, colDims, metricValues, colKeys, config, config.metrics);
        }
    });
    const finalColDefs = getFinalColKeys(tree.colRoot, [], config);
    if (finalColDefs.length > 0) {
        tree.colDefs = finalColDefs;
    } else if (colKeys.size > 0) {
        // Fallback for when there are no col dims, just metrics.
        tree.colDefs = Array.from(colKeys).sort().map(k => ({
            key: k,
            isSubtotal: false,
            label: 'Total'
        }));
    } else {
        tree.colDefs = [{
            key: '',
            isSubtotal: false,
            label: 'Total'
        }];
    }
    
    // PHASE 2: Calculate subtotals from leaf nodes only (prevents double-counting)
    calculateSubtotals(tree, config, config.metrics, colKeys);
    
    return tree;
}

function renderHeader(table, tree, config) {

  const thead = table.createTHead();
  const colDims = config.colDims || [];
  const rowDims = config.rowDims || [];
  const metrics = config.metrics || [];
  const measureLayout = config.measureLayout;
  const maxColDepth = colDims.length;
  const hasColDims = maxColDepth > 0;

  // One row for each col dimension, plus one for the metric names if they are columns.

  const colHeaderRowCount = maxColDepth + (measureLayout === 'METRIC_COLUMN' && hasColDims ? 1 : 0);
  const rowDimHeaderColCount = rowDims.length + (measureLayout.includes('ROW') ? 1 : 0);
    const headerRows = [];
    for (let i = 0; i < colHeaderRowCount; i++) {
        headerRows.push(thead.insertRow());
    }
    // Create top-left block for row dimension headers
    const topLeft = document.createElement('th');
    topLeft.colSpan = rowDimHeaderColCount;
    topLeft.rowSpan = colHeaderRowCount;
    if (headerRows.length > 0) headerRows[0].appendChild(topLeft);
    // Recursive function to build the column headers
    function buildColumnHeaders(node, level) {
        const sortConfig = config.colSettings[node.level + 1];
        let sortedChildren = Object.values(node.children);
        if (sortConfig && (sortConfig.sortType === 'METRIC' || sortConfig.sortType === 'DIMENSION')) {
            // This sorting logic MUST match getFinalColKeys
            sortedChildren.sort((a, b) => {
                let valA, valB;
                if (sortConfig.sortType === 'METRIC') {
                    const metricIdx = sortConfig.sortMetricIndex;
                    valA = getAggregatedValue(a.metrics?.[metricIdx], sortConfig.sortAgg);
                    valB = getAggregatedValue(b.metrics?.[metricIdx], sortConfig.sortAgg);
                } else {
                    valA = a.value;
                    valB = b.value;
                }
                const order = sortConfig.sortDir === 'ASC' ? 1 : -1;
                if (valA === undefined || valA === null) return 1 * order;
                if (valB === undefined || valB === null) return -1 * order;
                if (valA < valB) return -1 * order;
                if (valA > valB) return 1 * order;
                return 0;
            });
        }
        // Render headers for sorted children
        sortedChildren.forEach(child => {
            const th = document.createElement('th');
            th.textContent = child.value;
            const leafCount = getLeafCount(child);
            const metricMultiplier = (measureLayout === 'METRIC_COLUMN' && metrics.length > 0) ? metrics.length : 1;
            th.colSpan = leafCount * metricMultiplier;
            // If a node has no children, it should span the remaining header rows
            if (Object.keys(child.children).length === 0) {
                th.rowSpan = colHeaderRowCount - level;
            }
            if (level < headerRows.length) {
                headerRows[level].appendChild(th);
            }
            // Recurse if there are more children
            if (Object.keys(child.children).length > 0) {
                buildColumnHeaders(child, level + 1);
            }
        });
        // Render subtotal header for the current level
        const subtotalConfig = config.colSettings[node.level];
        if (subtotalConfig && subtotalConfig.subtotal && node.level > -1) {
            const th = document.createElement('th');
            th.textContent = `Subtotal ${node.value}`;
            th.rowSpan = colHeaderRowCount - level;
            th.colSpan = (measureLayout === 'METRIC_COLUMN' && metrics.length > 0) ? metrics.length : 1;
            if (level < headerRows.length) {
                headerRows[level].appendChild(th);
            }
        }
    }

    function getLeafCount(node) {
        if (Object.keys(node.children).length === 0) return 1;
        let count = Object.values(node.children).reduce((sum, child) => sum + getLeafCount(child), 0);
        const subtotalConfig = config.colSettings[node.level + 1];
        if (subtotalConfig && subtotalConfig.subtotal) {
            // This isn't quite right, but reflects that subtotals add columns
        }
        return count;
    }
    if (hasColDims) {
        buildColumnHeaders(tree.colRoot, 0);
    } else {
        // No column dimensions, just a single header for each metric
        const row = headerRows[0] || thead.insertRow();
        (tree.colDefs || []).forEach(colDef => {
            const th = document.createElement('th');
            th.textContent = colDef.label;
            row.appendChild(th);
        });
    }
    // Final row that contains the row dimension names (and measure names for METRIC_COLUMN)
    const rowDimHeaderRow = thead.insertRow();
    rowDims.forEach(d => rowDimHeaderRow.appendChild(document.createElement('th')).textContent = d.name);
    if (measureLayout.includes('ROW')) {
        const th = document.createElement('th');
        th.textContent = 'Measure';
        rowDimHeaderRow.appendChild(th);
    }
    
    // For METRIC_COLUMN layout, add measure names in this row (aligned under column headers)
    if (measureLayout === 'METRIC_COLUMN' && hasColDims) {
        (tree.colDefs || []).forEach(colDef => {
            metrics.forEach(metric => {
                const th = document.createElement('th');
                th.textContent = metric.name;
                rowDimHeaderRow.appendChild(th);
            });
        });
    } else {
        // For other layouts, add empty cells to match column headers
        (tree.colDefs || []).forEach(colDef => {
            const metricMultiplier = (measureLayout === 'METRIC_COLUMN') ? metrics.length : 1;
            for (let i = 0; i < metricMultiplier; i++) {
                rowDimHeaderRow.appendChild(document.createElement('th'));
            }
        });
    }
}

function renderBody(table, tree, config) {
    const tbody = table.createTBody();

    function recursiveRender(node, path) {
        const sortConfig = config.rowSettings[node.level + 1];
        let sortedChildren = Object.values(node.children);
        if (sortConfig) {
            // TODO : Sorting
        }
        sortedChildren.forEach(childNode => {
            const newPath = [...path, childNode.value];
            const tr = tbody.insertRow();
            newPath.forEach(val => tr.insertCell().textContent = val);
            const rowDimCount = (config.rowDims?.length || 0) + (config.measureLayout.includes('ROW') ? 1 : 0);
            for (let i = newPath.length; i < rowDimCount; i++) tr.insertCell();
            
            if (config.measureLayout === 'METRIC_COLUMN') {
                (tree.colDefs || []).forEach(colDef => {
                    const metricValues = childNode.metrics[colDef.key];
                    if (!metricValues) {
                        config.metrics.forEach((m) => {
                            tr.insertCell().textContent = '-';
                        });
                        return;
                    }
                    config.metrics.forEach((m, i) => {
                        const val = getAggregatedValue(metricValues[i], 'SUM');
                        tr.insertCell().textContent = typeof val === 'number' ? val.toLocaleString() : '-';
                    });
                });
            } else {
                const metricValues = childNode.metrics[''] || (Object.keys(childNode.metrics).length > 0 ? childNode.metrics[Object.keys(childNode.metrics)[0]] : null);
                if (!metricValues || metricValues.length === 0) {
                    tr.insertCell().textContent = '-';
                } else {
                    const val = getAggregatedValue(metricValues[0], 'SUM');
                    tr.insertCell().textContent = typeof val === 'number' ? val.toLocaleString() : '-';
                }
            }
            recursiveRender(childNode, newPath);
            // Render row subtotal - only if config explicitly requests it
            const dimensionLevel = childNode.level;
            const subtotalConfig = config.rowSettings[dimensionLevel];
            if (subtotalConfig && subtotalConfig.subtotal === true && Object.keys(childNode.children).length > 0) {
                // Render subtotal row for this node
                const subtotalRow = tbody.insertRow();
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
                
                // Render metric values for this subtotal
                if (config.measureLayout === 'METRIC_COLUMN') {
                    (tree.colDefs || []).forEach(colDef => {
                        const metricValues = childNode.metrics[colDef.key];
                        if (!metricValues) {
                            config.metrics.forEach((m) => {
                                subtotalRow.insertCell().textContent = '-';
                            });
                            return;
                        }
                        config.metrics.forEach((m, i) => {
                            const val = getAggregatedValue(metricValues[i], 'SUM');
                            subtotalRow.insertCell().textContent = typeof val === 'number' ? val.toLocaleString() : '-';
                        });
                    });
                } else {
                    const metricValues = childNode.metrics[''] || (Object.keys(childNode.metrics).length > 0 ? childNode.metrics[Object.keys(childNode.metrics)[0]] : null);
                    if (!metricValues || metricValues.length === 0) {
                        subtotalRow.insertCell().textContent = '-';
                    } else {
                        const val = getAggregatedValue(metricValues[0], 'SUM');
                        subtotalRow.insertCell().textContent = typeof val === 'number' ? val.toLocaleString() : '-';
                    }
                }
            }
        });
    }
    recursiveRender(tree.rowRoot, []);
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
    };
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