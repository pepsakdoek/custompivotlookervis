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
// Aggregator utility functions for metric calculations and formatting and sorting

function getStyleValue(style, id, defaultValue) {
    return (style[id] && typeof style[id].value !== 'undefined') ? style[id].value : defaultValue;
}
// Enhanced aggregation to support SUM, AVG, etc.
function aggregateMetrics(existing, addition, metrics) {
    if (!existing) {
        // If this is the first run, initialize based on the `metrics` array
        // to ensure `existing` always has the correct length from the start.
        return metrics.map((_, i) => {
            const val = addition[i];
            // Check if a value was actually provided for this metric index
            if (val === undefined || val === null) {
                // No value, so initialize with empty/zero stats
                return { sum: 0, count: 0, min: Infinity, max: -Infinity};
            }
            // A value exists, so create the initial stats object
            return {
                sum: val,
                count: 1,
                min: val,
                max: val
            };
        });
    }

    // On subsequent runs, loop through all configured metrics
    metrics.forEach((metric, i) => {
        const val = addition[i];

        // If no value is provided for this metric in the current data row, skip it.
        if (val === undefined || val === null) {
            return; // Equivalent to 'continue' in a forEach
        }

        let stats = existing[i];

        // This is the key change: If no stats object exists for this metric, create it.
        // This handles the case you described.
        if (!stats) {
            stats = { sum: 0, count: 0, min: Infinity, max: -Infinity };
            existing[i] = stats;
        }

        // Now, safely update the stats
        stats.sum += val;
        stats.count += 1;

        // On the first actual value, min/max are the value itself.
        if (stats.count === 1) {
            stats.min = val;
            stats.max = val;
        } else {
            if (val < stats.min) stats.min = val;
            if (val > stats.max) stats.max = val;
        }
    });

    return existing;
}

function aggregateMetricStats(statsArray) {
    const filteredStats = statsArray.filter(s => s && s.count > 0);
    if (filteredStats.length === 0) {
        // Return a zeroed-out stats object that won't affect calculations
        return { sum: 0, count: 0, min: Infinity, max: -Infinity };
    }

    return filteredStats.reduce((acc, stats) => {
        acc.sum += stats.sum;
        acc.count += stats.count;
        acc.min = Math.min(acc.min, stats.min);
        acc.max = Math.max(acc.max, stats.max);
        return acc;
    }, { sum: 0, count: 0, min: Infinity, max: -Infinity });
}

function getAggregatedValue(metric, aggType) {
    if (!metric) return 0;
    switch (aggType) {
        case 'AVG':
            return metric.count === 0 ? 0 : metric.sum / metric.count;
        case 'COUNT':
            return metric.count;
        case 'MIN':
            return metric.min;
        case 'MAX':
            return metric.max;
        case 'SUM':
        default:
            return metric.sum;
    }
}

function formatMetricValue(value, formatType) {
    if (value === null || value === undefined || value === '-') return '-';
    
    const num = parseFloat(value);
    if (isNaN(num)) return '-';
    
    switch (formatType) {
        case 'COMPACT':
            return formatCompact(num);
        case 'NUMBER_0':
            return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
        case 'NUMBER_1':
            return num.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
        case 'NUMBER_2':
            return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        case 'PERCENT_0':
            return (num * 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + '%';
        case 'PERCENT_1':
            return (num * 100).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
        case 'PERCENT_2':
            return (num * 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '%';
        case 'DEFAULT':
        default:
            return num.toLocaleString();
    }
}

function formatCompact(num) {
    const absNum = Math.abs(num);
    const sign = num < 0 ? '-' : '';
    
    if (absNum >= 1e9) {
        return sign + (absNum / 1e9).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }).replace(/\.?0+$/, '') + 'b';
    } else if (absNum >= 1e6) {
        return sign + (absNum / 1e6).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }).replace(/\.?0+$/, '') + 'm';
    } else if (absNum >= 1e3) {
        return sign + (absNum / 1e3).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 1 }).replace(/\.?0+$/, '') + 'k';
    } else {
        return num.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
    }
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

    // Special sort for METRIC_FIRST_COLUMN: the first level children are metrics
    // and should be sorted by their original index, not name.
    if (config.measureLayout === 'METRIC_FIRST_COLUMN' && node.level === -1 && sortedChildren.length > 1) {
        sortedChildren.sort((a, b) => {
            const idxA = config.metrics.findIndex(m => m.name === a.value);
            const idxB = config.metrics.findIndex(m => m.name === b.value);
            return (idxA === -1 ? Infinity : idxA) - (idxB === -1 ? Infinity : idxB);
        });
    }
    // Otherwise, sort children based on user-defined config
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
        debugLog('Creating subtotal colDef for path:', path);
        finalKeys.push({
            key: path.join('||'),
            isSubtotal: true,
            label: `Subtotal ${path[path.length - 1]}`
        });
    }
    return finalKeys;
}

/**
 * Shared sorting logic for rows and columns
 */
function sortChildren(childrenArray, sortConfig) {
    if (!sortConfig || (sortConfig.sortType !== 'METRIC' && sortConfig.sortType !== 'DIMENSION')) {
        return childrenArray;
    }

    const isAsc = sortConfig.sortDir === 'ASC';

    return childrenArray.sort((a, b) => {
        let valA, valB;
        if (sortConfig.sortType === 'METRIC') {
            const mIdx = sortConfig.sortMetricIndex;
            valA = getAggregatedValue(a.metrics?.[mIdx], sortConfig.sortAgg);
            valB = getAggregatedValue(b.metrics?.[mIdx], sortConfig.sortAgg);
        } else {
            valA = a.value;
            valB = b.value;
        }

        // Handle nulls: always push to the end regardless of direction
        if (valA == null) return 1; 
        if (valB == null) return -1;

        if (valA === valB) return 0;

        // Standard comparison logic
        const comparison = valA < valB ? -1 : 1;
        const dimCorrection = sortConfig.sortType === 'DIMENSION' ? -1 : 1;

        // BECAUSE I RENDER RECURSIVELY THE ORDERING IS REVERSED (DIMENSIONS ARE NOT RENDERED RECURSIVELY)
        return isAsc ? -comparison * dimCorrection : comparison * dimCorrection;
    });
}

/**
 * Shared cell rendering to ensure formatting is identical everywhere
 */
function renderMetricCell(tr, metricStats, metricIndex, config, cellToPopulate) { // Added optional cellToPopulate
    let cell;
    if (cellToPopulate) {
        cell = cellToPopulate;
    } else {
        // If no cell is provided, create a new one in the given table row (tr)
        cell = tr.insertCell();
    }

    if (!metricStats) {
        cell.textContent = '-';
        return;
    }
    const val = getAggregatedValue(metricStats, 'SUM'); // Assuming getAggregatedValue is available
    const formatType = config.metricFormats[metricIndex] || 'DEFAULT'; // Assuming metricFormats is in config
    cell.textContent = formatMetricValue(val, formatType); // Assuming formatMetricValue is available
    cell.classList.add('MC', `MC${metricIndex + 1}`);
}

function getCustomAggregatedValue(aggString, metricStats, config) {
    if (typeof aggString !== 'string') return null;
    let expression = aggString.toUpperCase().trim();

    if (expression === 'NONE') {
        return '';
    }

    const numMetrics = config.metrics.length;
    const numMetricsForCalcs = config.metricsForCalcs.length;

    // Regex to find SUM(M1), AVG(CM2), etc.
    const tokenRegex = /(SUM|AVG|COUNT|MIN|MAX)\((M|CM)([0-9]+)\)/g;

    expression = expression.replace(tokenRegex, (match, aggFunc, metricType, metricIndexStr) => {
        const metricIndex = parseInt(metricIndexStr, 10) - 1;

        if (metricIndex < 0) return 'NaN';

        let stats;
        if (metricType === 'M') {
            if (metricIndex >= numMetrics) return 'NaN';
            stats = metricStats ? metricStats[metricIndex] : null;
        } else { // 'CM'
            if (metricIndex >= numMetricsForCalcs) return 'NaN';
            stats = metricStats ? metricStats[numMetrics + metricIndex] : null;
        }

        if (!stats) return '0';

        return getAggregatedValue(stats, aggFunc);
    });

    // Safe evaluation
    try {
        // Security tightening: Treat the result as a math-only string
        // This ensures that after replacement, ONLY numbers and math symbols remain.
        // We exclude letters entirely here. 
        if (/[a-zA-Z]/.test(expression)) {
            console.error('Security Block: Expression contains unauthorized words/tokens:', expression);
            return 'Error';
        }
        // Updated regex to be more strict. Only allow numbers, operators, and parenthesis.
        if (!/^[0-9.+\-*/()\s]+$/.test(expression)) {
            // throw new Error('Invalid characters in expression');
            // For user-facing element, better to return an error message
            return 'Error: Invalid expression';
        }
        const result = new Function(`return ${expression}`)();
        if (typeof result !== 'number' || !isFinite(result)) {
            return 'Error';
        }
        return result;
    } catch (e) {
        console.error('Error evaluating custom aggregation expression:', expression, e);
        return 'Error';
    }
}

/**
 * Helper to collect and aggregate all metric data from the leaves of a specific node
 */
function getAggregatedNodeMetrics(node, colDefKey, config, isSubtotalCol) {
    let aggregatedStatsArray = []; // Array to hold all leaf stat arrays

    function collect(curr) {
        if (Object.keys(curr.children).length === 0) { // isLeaf
            if (isSubtotalCol) {
                Object.entries(curr.metrics).forEach(([key, stats]) => {
                    if (key.startsWith(colDefKey + '||')) {
                        aggregatedStatsArray.push(stats);
                    }
                });
            } else {
                 if (curr.metrics[colDefKey]) {
                    aggregatedStatsArray.push(curr.metrics[colDefKey]);
                }
            }
        } else {
            Object.values(curr.children).forEach(child => collect(child));
        }
    }

    collect(node);

    if (aggregatedStatsArray.length === 0) {
        return null;
    }
    
    // We now have an array of arrays of stats objects.
    // e.g., [[metric1_stats_leaf1, metric2_stats_leaf1], [metric1_stats_leaf2, metric2_stats_leaf2]]
    // We need to aggregate this into a single array of stats objects: [metric1_total_stats, metric2_total_stats]

    const allMetrics = [...config.metrics, ...config.metricsForCalcs];
    // Let's initialize the result array for the total stats of each metric
    const result = allMetrics.map(() => ({ sum: 0, count: 0, min: Infinity, max: -Infinity }));

    // For each metric...
    for (let i = 0; i < allMetrics.length; i++) {
        // ...create an array of stats for just that metric from all leaves
        const statsForOneMetric = aggregatedStatsArray.map(leafStatsArray => leafStatsArray[i]);
        // ...and aggregate them.
        result[i] = aggregateMetricStats(statsForOneMetric);
    }

    return result;
}

function getAggregatedNodeMetricsAllCols(node, config) {
    let allStats = [];
    function collect(curr) {
        if (Object.keys(curr.children).length === 0) { // isLeaf
            Object.values(curr.metrics).forEach(metricArray => {
                allStats.push(metricArray);
            });
        } else {
            Object.values(curr.children).forEach(child => collect(child));
        }
    }
    collect(node);

    if (allStats.length === 0) return null;

    const allMetrics = [...config.metrics, ...config.metricsForCalcs];
    const result = allMetrics.map(() => ({ sum: 0, count: 0, min: Infinity, max: -Infinity }));

    for (let i = 0; i < allMetrics.length; i++) {
        const statsForOneMetric = allStats.map(leafStatsArray => leafStatsArray[i]);
        if(statsForOneMetric[0] !== undefined) {
            result[i] = aggregateMetricStats(statsForOneMetric);
        }
    }
    return result;
}
function buildDataTree(config, data) {
    const allMetrics = [...config.metrics, ...config.metricsForCalcs];
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
    const colKeys = new Set(); 

    data.forEach(row => {
        // Standardizing Looker Studio inputs
        const rowDims = (row.dimensions || []).map(String);
        const colDims = (row.columnDimensions || []).map(String);
        
        // Correctly combine metrics and metricsForCalcs from the data row
        const combinedMetricData = [...row.metrics, ...(row.metricsForCalcs || [])];
        const metricValues = combinedMetricData.map(val => {
            const raw = Array.isArray(val) ? val[0] : val;
            const v = (raw != null) ? parseFloat(raw) : 0;
            return isNaN(v) ? 0 : v;
        });

        const measureLayout = config.measureLayout;

        // --- UPDATED BRANCHING LOGIC ---
        
        if (measureLayout === 'METRIC_ROW' && allMetrics.length > 0) {
            // METRIC_ROW: The Metric Name is appended to the ROW path
            allMetrics.forEach((metric, i) => {
                // We pass only the single metric value [metricValues[i]] 
                // and the single metric config [metric] to processNode
                processNode(tree, [...rowDims, metric.name], colDims, [metricValues[i]], colKeys, config, [metric]);
            });
        } 
        else if (measureLayout === 'METRIC_FIRST_ROW' && allMetrics.length > 0) {
            // METRIC_FIRST_ROW: Metric Name is the FIRST dimension in the row path
            allMetrics.forEach((metric, i) => {
                processNode(tree, [metric.name, ...rowDims], colDims, [metricValues[i]], colKeys, config, [metric]);
            });
        } 
        else if (measureLayout === 'METRIC_FIRST_COLUMN' && allMetrics.length > 0) {
            // METREC_FIRST_COLUMN: Metric Name is the FIRST dimension in the column path
            allMetrics.forEach((metric, i) => {
                processNode(tree, rowDims, [metric.name, ...colDims], [metricValues[i]], colKeys, config, [metric]);
            });
        } 
        else { 
            // METRIC_COLUMN (Standard): Metrics are bundled at the dimension leaf
            processNode(tree, rowDims, colDims, metricValues, colKeys, config, allMetrics);
        }
    });

    // Phase 2: Finalize Columns and Subtotals
    const finalColDefs = getFinalColKeys(tree.colRoot, [], config);
    if (finalColDefs.length > 0) {
        tree.colDefs = finalColDefs;
    } else {
        tree.colDefs = [{ key: '', isSubtotal: false, label: 'Total' }];
    }
    
    calculateSubtotals(tree, config, allMetrics, colKeys);
    
    return tree;
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
function renderBodyMetricColumn(tbody, tree, config) {

    function renderTotalsRow(node, isGrandTotal) {
        // This is the Subtotal ROW for the COLUMNS
        const tr = tbody.insertRow();
        tr.style.fontWeight = 'bold';

        if (isGrandTotal) {
            tr.classList.add('CGR');
            const labelCell = tr.insertCell()
            labelCell.textContent = 'Grand Total';
            labelCell.classList.add('CGL');
            for (let i = 1; i < config.rowDims.length; i++) {
                tr.insertCell();
            }
        } else {
            tr.classList.add('RSR');
            for (let i = 0; i < node.level; i++) tr.insertCell();
            const labelCell = tr.insertCell()
            labelCell.textContent = 'Subtotal ' + node.value;
            labelCell.classList.add('RSL');
            for (let i = node.level + 1; i < config.rowDims.length; i++) tr.insertCell();
        }

        (tree.colDefs || []).forEach(colDef => {
            const nodeStats = getAggregatedNodeMetrics(node, colDef.key, config, colDef.isSubtotal);
            config.metrics.forEach((m, i) => {
                const aggString = config.metricSubtotalAggs[i] || 'SUM';
                const aggTypeUpper = aggString.toUpperCase().trim();
                const cell = tr.insertCell();
                if (!isGrandTotal) {
                    cell.classList.add('RSV', `RSV${i + 1}`);
                } else {
                    cell.classList.add('CGV', `CGV${i + 1}`);
                }

                let val;
                if (['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', ''].includes(aggTypeUpper)) {
                    val = getAggregatedValue(nodeStats ? nodeStats[i] : null, aggTypeUpper || 'SUM');
                } else {
                    val = getCustomAggregatedValue(aggString, nodeStats, config);
                }

                cell.textContent = formatMetricValue(val, config.metricFormats[i]);
            });
        });

        if (config.showRowGrandTotal) {
            const grandGrandTotalStats = getAggregatedNodeMetricsAllCols(node, config);

            config.metrics.forEach((m, i) => {
                const aggString = config.metricSubtotalAggs[i] || 'SUM';
                const cell = tr.insertCell();
                cell.style.fontWeight = 'bold'; // Grand grand total should be bold

                let val;
                const aggTypeUpper = aggString.toUpperCase().trim();
                if (['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', ''].includes(aggTypeUpper)) {
                    val = getAggregatedValue(grandGrandTotalStats ? grandGrandTotalStats[i] : null, aggTypeUpper || 'SUM');
                } else {
                    val = getCustomAggregatedValue(aggString, grandGrandTotalStats, config);
                }
                cell.textContent = formatMetricValue(val, config.metricFormats[i]);
            });
        }
    }

    function recursiveRender(node, path) {
        // Handle the edge case where there are no row dimensions.
        // The data is on the root node itself.
        if (node.level === -1 && Object.keys(node.children).length === 0) {
            const tr = tbody.insertRow();
            tr.classList.add('DR');

            (tree.colDefs || []).forEach(colDef => {
                const stats = node.metrics[colDef.key];
                config.metrics.forEach((m, i) => {
                    const cellValue = stats ? stats[i] : null;
                    renderMetricCell(tr, cellValue, i, config);
                });
            });
            return; // We're done, no recursion needed.
        }

        let sortedChildren = sortChildren(Object.values(node.children), config.rowSettings[node.level + 1]);

        sortedChildren.forEach(childNode => {
            const newPath = [...path, childNode.value];
            const isLeaf = Object.keys(childNode.children).length === 0;

            if (isLeaf) {
                const tr = tbody.insertRow();
                tr.classList.add('DR');

                newPath.forEach((val, i) => {
                    const cell = tr.insertCell();
                    cell.textContent = val;
                    cell.classList.add('RDC', `RDC${i + 1}`);
                });
                const rowDimCount = config.rowDims?.length || 0;
                for (let i = newPath.length; i < rowDimCount; i++) tr.insertCell();

                let rowTotals = {};
                if (config.showRowGrandTotal) {
                    const allMetrics = [...config.metrics, ...config.metricsForCalcs];
                    allMetrics.forEach(m => {
                        rowTotals[m.name] = [];
                    });
                }

                (tree.colDefs || []).forEach(colDef => {
                    const stats = colDef.isSubtotal 
                        ? getAggregatedNodeMetrics(childNode, colDef.key, config, true) 
                        : childNode.metrics[colDef.key];

                    // Loop through all metrics (primary + forCalcs) to populate rowTotals
                    const allMetrics = [...config.metrics, ...config.metricsForCalcs];
                    allMetrics.forEach((m, i) => {
                        const cellValue = stats ? stats[i] : null;

                        // Only render cells for the primary metrics
                        if (i < config.metrics.length) {
                            renderMetricCell(tr, cellValue, i, config);
                        }
                        
                        if (config.showRowGrandTotal && cellValue !== null && !colDef.isSubtotal) {
                            // Ensure rowTotals is populated for all metrics
                            rowTotals[m.name].push(cellValue);
                        }
                    });
                });

                if (config.showRowGrandTotal) {
                    const combinedStats = [];
                    const allMetrics = [...config.metrics, ...config.metricsForCalcs];

                    // Create a single array of combined stats for all metrics
                    for (let i = 0; i < allMetrics.length; i++) {
                        const metricName = allMetrics[i].name;
                        combinedStats.push(aggregateMetricStats(rowTotals[metricName]));
                    }

                    // Now, calculate and render the grand total for each primary metric
                    config.metrics.forEach((m, i) => {
                        const aggString = config.metricSubtotalAggs[i] || 'SUM';
                        const aggTypeUpper = aggString.toUpperCase().trim();
                        const cell = tr.insertCell();
                        cell.style.fontWeight = 'bold';
                        cell.classList.add('RGV', `RGV${i + 1}`);

                        let val;
                        if (['SUM', 'AVG', 'COUNT', 'MIN', 'MAX', ''].includes(aggTypeUpper)) {
                            val = getAggregatedValue(combinedStats[i], aggTypeUpper || 'SUM');
                        } else {
                            // Pass the full array of combined stats
                            val = getCustomAggregatedValue(aggString, combinedStats, config);
                        }

                        cell.textContent = formatMetricValue(val, config.metricFormats[i]);
                    });
                }
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

    if (config.showColumnGrandTotal) {
        renderTotalsRow(tree.rowRoot, true);
    }
}
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

            // Measure Name
            const measureCell = tr.insertCell();
            measureCell.textContent = metric.name;
            measureCell.classList.add('MNC', `MNC${mIdx + 1}`);

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
                
                // 1. Fill Dimension and Measure Name values from the path
                newPath.forEach((val, i) => {
                    const cell = tr.insertCell();
                    cell.textContent = val;
                    // The last item in the path is the measure name
                    if (i === newPath.length - 1) {
                        const mIdx = config.metrics.findIndex(m => m.name === val);
                        cell.classList.add('MNC', `MNC${mIdx + 1}`);
                    } else {
                        cell.classList.add('RDC', `RDC${i + 1}`);
                    }
                });

                // 2. Pad empty cells if the path is shorter than the full row dimension depth + measure column.
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

    // Column Grand Totals (Bottom of table)
    if (config.showColumnGrandTotal) {
        renderSubtotalRows(tree.rowRoot, 'Grand Total', true);
    }
}

function renderBodyMeasureFirstColumn(tbody, tree, config) {
    function recursiveRender(node, path) {
        // Handle the edge case where there are no row dimensions.
        // The data is on the root node itself.
        if (node.level === -1 && Object.keys(node.children).length === 0) {
            const tr = tbody.insertRow();
            tr.classList.add('DR');

            // When there are no col dims, colDefs needs to be built from metrics
            const colDefs = config.colDims.length === 0
                ? config.metrics.map(m => ({ key: m.name, isSubtotal: false }))
                : (tree.colDefs || []);

            colDefs.forEach(colDef => {
                const metricValues = node.metrics[colDef.key];
                const metricIndex = config.metrics.findIndex(m => m.name === colDef.key);
                const cell = tr.insertCell();
                cell.classList.add('MC', `MC${metricIndex + 1}`);
                const val = getAggregatedValue(metricValues ? metricValues[0] : null, 'SUM');
                const formatType = config.metricFormats[metricIndex] || 'DEFAULT';
                cell.textContent = formatMetricValue(val, formatType);
            });

            return; // We're done.
        }

        const sortConfig = config.rowSettings[node.level + 1];
        let sortedChildren = sortChildren(Object.values(node.children), sortConfig);

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
                (tree.colDefs || []).reverse().forEach(colDef => {
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
                
                // 1. Fill Dimension and Measure Name values from the path
                newPath.forEach((val, i) => {
                    const cell = tr.insertCell();
                    cell.textContent = val;
                    // The first item in the path is the measure name
                    if (i === 0) {
                        const mIdx = config.metrics.findIndex(m => m.name === val);
                        cell.classList.add('MNC', `MNC${mIdx + 1}`);
                    } else {
                        cell.classList.add('RDC', `RDC${i}`);
                    }
                });

                // 2. Pad empty cells if the path is shorter than the full row dimension depth + measure column.
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
                        const measureCell = tr.insertCell();
                        measureCell.textContent = metric.name;
                        measureCell.classList.add('MNC', `MNC${mIdx + 1}`);

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
/**
 * RENDERHEADER.JS
 * Handles the complex multi-row header logic, including nested column dimensions
 * and the specific "Measure" column for METRIC_ROW layout.
 * 
    Meaure layout types: 
    'METRIC_COLUMN' - metrics are shown as columns
       -- Metric names apprear in the column headers, and are on the same row as the row dimension headers
    'METRIC_ROW' - metrics are shown as rows
       -- A "Measure" column is added to the row dimensions, and metric names appear in that column
    'METRIC_FIRST_COLUMN' - Metrics are shown as the highest level column header
      -- The Metric is displayed in the First row of the column headers, and the last column dim headers are on the same row as the dimension headers 
    'METRIC_FIRST_ROW' - first metric is shown as a row, others as columns
      -- The Metric is displayed in the First column of the row headers as an extra column
 */
function renderHeader(table, tree, config) {
    const thead = table.createTHead();
    const { colDims, rowDims, metrics, measureLayout } = config;
    const hasColDims = colDims.length > 0;

    function getLeafCount(node) {
        if (!node || Object.keys(node.children).length === 0) return 1;

        let count = Object.values(node.children).reduce((sum, child) => sum + getLeafCount(child), 0);
        
        const subtotalConfig = config.colSettings[node.level];
        if (subtotalConfig && subtotalConfig.subtotal && node.level >= 0) {
            count += 1; 
        }
        return count;
    }
    
    switch (measureLayout) {
        case 'METRIC_COLUMN': {
            const colHeaderRowCount = hasColDims ? colDims.length + 1 : 1;
            const headerRows = [];
            for (let i = 0; i < colHeaderRowCount; i++) {
                headerRows.push(thead.insertRow());
            }
            const lastHeaderRow = headerRows[headerRows.length - 1];

            if (rowDims.length > 0) {
                rowDims.forEach((d, i) => {
                    const th = document.createElement('th');
                    th.textContent = d.name;
                    th.className = 'row-dim-label';
                    th.classList.add('RDH', `RDH${i + 1}`);
                    lastHeaderRow.appendChild(th);
                });
            }
            if (colHeaderRowCount > 1) {
                const topLeft = document.createElement('th');
                topLeft.colSpan = rowDims.length;
                topLeft.rowSpan = colHeaderRowCount - 1;
                topLeft.classList.add('TLC');
                headerRows[0].appendChild(topLeft);
            }

            if (hasColDims) {
                const metricMultiplier = metrics.length || 1;
                function build(node, level, path) {
                    let sortedChildren = sortChildren(Object.values(node.children), config.colSettings[node.level + 1]);
                    sortedChildren.forEach(child => {
                        const th = document.createElement('th');
                        th.textContent = child.value;
                        th.colSpan = getLeafCount(child) * metricMultiplier;
                        th.classList.add('CDH', `CDH${level + 1}`);
                        headerRows[level].appendChild(th);
                        if (Object.keys(child.children).length > 0) build(child, level + 1, [...path, child.value]);
                    });

                    const subtotalConfig = config.colSettings[node.level];
                    if (subtotalConfig && subtotalConfig.subtotal && path.length > 0) {
                        const th = document.createElement('th');
                        th.textContent = `Subtotal ${path[path.length - 1]}`;
                        th.colSpan = metrics.length;
                        th.classList.add('CSH', `CSH${node.level + 1}`);
                        const rowSpan = colDims.length - level;
                        if (rowSpan > 1) {
                            th.rowSpan = rowSpan;
                        }
                        headerRows[level].appendChild(th);
                    }
                }
                build(tree.colRoot, 0, []);

                if (config.showRowGrandTotal) {
                    const grandTotalTh = document.createElement('th');
                    grandTotalTh.textContent = 'Grand Total';
                    grandTotalTh.colSpan = metrics.length;
                    grandTotalTh.rowSpan = colDims.length;
                    grandTotalTh.classList.add('RGH');
                    headerRows[0].appendChild(grandTotalTh);
                }
            }

            const colDefs = hasColDims ? (tree.colDefs || []) : [[]];
            colDefs.forEach(() => {
                metrics.forEach((m, i) => {
                    const th = document.createElement('th');
                    th.textContent = m.name;
                    th.classList.add('MH', `MH${i + 1}`);
                    lastHeaderRow.appendChild(th);
                });
            });

            if (config.showRowGrandTotal) {
                metrics.forEach((m, i) => {
                    const th = document.createElement('th');
                    th.textContent = m.name;
                    th.classList.add('MH', `MH${i + 1}`);
                    if (!hasColDims) {
                        th.textContent = 'Grand Total ' + m.name;
                    }
                    lastHeaderRow.appendChild(th);
                });
            }
            break;
        }

        case 'METRIC_ROW': {
            // This logic is rebuilt to correctly align row and column headers on the same row.
            const totalHeaderRows = hasColDims ? colDims.length : 1;
            
            const headerRows = [];
            for (let i = 0; i < totalHeaderRows; i++) {
                headerRows.push(thead.insertRow());
            }

            const lastHeaderRow = headerRows[headerRows.length-1];

            // Add row dimension headers and the "Measure" header to the last header row.
            rowDims.forEach((d, i) => {
                const th = document.createElement('th');
                th.textContent = d.name;
                th.classList.add('RDH', `RDH${i + 1}`);
                lastHeaderRow.appendChild(th);
            });
            const measureTh = document.createElement('th');
            measureTh.textContent = 'Measure';
            measureTh.classList.add('MRH');
            lastHeaderRow.appendChild(measureTh);

            if (hasColDims) {
                // If there are multiple levels of column headers, create an empty top-left cell.
                if (totalHeaderRows > 1) {
                    const topLeft = document.createElement('th');
                    topLeft.colSpan = rowDims.length + 1; // Span over row dims and Measure.
                    topLeft.rowSpan = totalHeaderRows - 1;
                    topLeft.classList.add('TLC');
                     headerRows[0].appendChild(topLeft);
                }

                // Build the column dimension header tree.
                function build(node, level, path) {
                    let sortedChildren = sortChildren(Object.values(node.children), config.colSettings[node.level + 1]);
                    const targetRow = headerRows[level];

                    sortedChildren.forEach(child => {
                        const th = document.createElement('th');
                        th.textContent = child.value;
                        th.colSpan = getLeafCount(child);
                        th.classList.add('CDH', `CDH${level + 1}`);
                        // If a branch of the tree is shorter, the last node needs to span downwards.
                        if (Object.keys(child.children).length === 0 && (level < totalHeaderRows - 1)) {
                            th.rowSpan = totalHeaderRows - level;
                        }
                        targetRow.appendChild(th);
                        if (Object.keys(child.children).length > 0) build(child, level + 1, [...path, child.value]);
                    });

                    const subtotalConfig = config.colSettings[node.level];
                    if (subtotalConfig && subtotalConfig.subtotal && path.length > 0) {
                        const th = document.createElement('th');
                        th.textContent = `Subtotal ${path[path.length - 1]}`;
                        th.colSpan = 1;
                        th.classList.add('CSH', `CSH${node.level + 1}`);
                        
                        const rowSpan = totalHeaderRows - level;
                        if (rowSpan > 1) {
                            th.rowSpan = rowSpan;
                        }
                        targetRow.appendChild(th);
                    }
                }
                build(tree.colRoot, 0, []);

            } else { // No colDims
                // Add a "Value" header if there are no column dimensions.
                const valueTh = document.createElement('th');
                valueTh.textContent = 'Value';
                valueTh.classList.add('VH');
                lastHeaderRow.appendChild(valueTh);
            }

            if (config.showRowGrandTotal) {
                const th = document.createElement('th');
                th.textContent = 'Grand Total';
                th.classList.add('RGH');
                th.rowSpan = totalHeaderRows;
                headerRows[0].appendChild(th);
            }
            break;
        }

        case 'METRIC_FIRST_ROW': {
            // This logic is rebuilt to correctly align row and column headers on the same row.
            const totalHeaderRows = hasColDims ? colDims.length : 1;
            
            const headerRows = [];
            for (let i = 0; i < totalHeaderRows; i++) {
                headerRows.push(thead.insertRow());
            }

            const lastHeaderRow = headerRows[headerRows.length-1];

            // Add "Measure" header first
            const measureTh = document.createElement('th');
            measureTh.textContent = 'Measure';
            measureTh.classList.add('MRH');
            lastHeaderRow.appendChild(measureTh);

            // Add row dimension headers
            rowDims.forEach((d, i) => {
                const th = document.createElement('th');
                th.textContent = d.name;
                th.classList.add('RDH', `RDH${i + 1}`);
                lastHeaderRow.appendChild(th);
            });

            if (hasColDims) {
                // If there are multiple levels of column headers, create an empty top-left cell.
                if (totalHeaderRows > 1) {
                    const topLeft = document.createElement('th');
                    topLeft.colSpan = rowDims.length + 1; // Span over row dims and Measure.
                    topLeft.rowSpan = totalHeaderRows - 1;
                    topLeft.classList.add('TLC');
                     headerRows[0].appendChild(topLeft);
                }

                // Build the column dimension header tree.
                function build(node, level, path) {
                    let sortedChildren = sortChildren(Object.values(node.children), config.colSettings[node.level + 1]);
                    const targetRow = headerRows[level];

                    sortedChildren.forEach(child => {
                        const th = document.createElement('th');
                        th.textContent = child.value;
                        th.colSpan = getLeafCount(child);
                        th.classList.add('CDH', `CDH${level + 1}`);
                        // If a branch of the tree is shorter, the last node needs to span downwards.
                        if (Object.keys(child.children).length === 0 && (level < totalHeaderRows - 1)) {
                            th.rowSpan = totalHeaderRows - level;
                        }
                        targetRow.appendChild(th);
                        if (Object.keys(child.children).length > 0) build(child, level + 1, [...path, child.value]);
                    });

                    const subtotalConfig = config.colSettings[node.level];
                    if (subtotalConfig && subtotalConfig.subtotal && path.length > 0) {
                        const th = document.createElement('th');
                        th.textContent = `Subtotal ${path[path.length - 1]}`;
                        th.colSpan = 1;
                        th.classList.add('CSH', `CSH${node.level + 1}`);
                        
                        const rowSpan = totalHeaderRows - level;
                        if (rowSpan > 1) {
                            th.rowSpan = rowSpan;
                        }
                        targetRow.appendChild(th);
                    }
                }
                build(tree.colRoot, 0, []);

            } else { // No colDims
                // Add a "Value" header if there are no column dimensions.
                const valueTh = document.createElement('th');
                valueTh.textContent = 'Value';
                valueTh.classList.add('VH');
                lastHeaderRow.appendChild(valueTh);
            }

            if (config.showRowGrandTotal) {
                const th = document.createElement('th');
                th.textContent = 'Grand Total';
                th.classList.add('RGH');
                th.rowSpan = totalHeaderRows;
                headerRows[0].appendChild(th);
            }
            break;
        }

        case 'METRIC_FIRST_COLUMN': {
            const colHeaderRowCount = (hasColDims ? colDims.length : 0) + 1;
            const headerRows = [];
            for (let i = 0; i < colHeaderRowCount; i++) {
                headerRows.push(thead.insertRow());
            }
            const lastHeaderRow = headerRows[headerRows.length - 1];

            // If there are column headers, add a top-left spacer above the row dimension labels.
            if (colHeaderRowCount > 1) {
                const topLeft = document.createElement('th');
                topLeft.colSpan = rowDims.length;
                topLeft.rowSpan = colHeaderRowCount - 1; // Span all rows except the last one.
                topLeft.classList.add('TLC');
                headerRows[0].appendChild(topLeft);
            }
            
            // Add row dimension headers to the last header row.
            if (rowDims.length > 0) {
                rowDims.forEach((d, i) => {
                    const th = document.createElement('th');
                    th.textContent = d.name;
                    th.className = 'row-dim-label';
                    th.classList.add('RDH', `RDH${i + 1}`);
                    lastHeaderRow.appendChild(th);
                });
            }

            // Recursive function to build the column headers.
            function build(node, level, path) {
                // level 0: metrics, level 1+: colDims
                let sortedChildren = Object.values(node.children);

                // Special sort for METRIC_FIRST_COLUMN: the first level children are metrics
                // and should be sorted by their original index, not name.
                if (level === 0 && sortedChildren.length > 1) {
                    sortedChildren.sort((a, b) => {
                        const idxA = config.metrics.findIndex(m => m.name === a.value);
                        const idxB = config.metrics.findIndex(m => m.name === b.value);
                        return (idxA === -1 ? Infinity : idxA) - (idxB === -1 ? Infinity : idxB);
                    });
                }

                sortedChildren.forEach((child, i) => {
                    const th = document.createElement('th');
                    th.textContent = child.value;
                    th.colSpan = getLeafCount(child);
                    if (level === 0) {
                        th.classList.add('MH', `MH${i + 1}`);
                    } else {
                        th.classList.add('CDH', `CDH${level}`);
                    }

                    headerRows[level].appendChild(th);

                    if (Object.keys(child.children).length > 0) {
                        build(child, level + 1, [...path, child.value]);
                    } else if (hasColDims && level < colDims.length) {
                        // This is a leaf in a column-dimension branch that is not at the lowest level.
                        // It needs to span the remaining rows.
                        th.rowSpan = colDims.length - level + 1;
                    }
                });
                
                const subtotalConfig = config.colSettings[node.level];
                if (subtotalConfig && subtotalConfig.subtotal && path.length > 0) {
                    const th = document.createElement('th');
                    th.textContent = `Subtotal ${path[path.length - 1]}`;
                    th.colSpan = 1; 
                    th.classList.add('CSH', `CSH${node.level + 1}`);
                    const rowSpan = colHeaderRowCount - level;
                    if (rowSpan > 1) {
                        th.rowSpan = rowSpan;
                    }
                    headerRows[level].appendChild(th);
                }
            }

            if (Object.keys(tree.colRoot.children).length > 0) {
                build(tree.colRoot, 0, []);
            } else if (metrics.length > 0) {
                // No colDims, just metrics
                metrics.forEach((m, i) => {
                    const th = document.createElement('th');
                    th.textContent = m.name;
                    th.classList.add('MH', `MH${i + 1}`);
                    lastHeaderRow.appendChild(th);
                });
            } else { // No metrics, no coldims, just have rowdims. Add a value column
                const th = document.createElement('th');
                th.textContent = "Value";
                th.classList.add('VH');
                lastHeaderRow.appendChild(th);
            }

            if (config.showRowGrandTotal) {
                const th = document.createElement('th');
                th.textContent = 'Grand Total';
                th.classList.add('RGH');
                headerRows[0].appendChild(th);
            }
            break;
        }
    }
}

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

    const container = document.getElementById('viz-container');
    container.innerHTML = ''; // Clear only the container in case of re-render
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