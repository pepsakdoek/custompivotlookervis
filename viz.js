dscc.subscribeToData(function(data) {
  if (!data || !data.tables || !data.tables.DEFAULT) return;

  const rows = data.tables.DEFAULT;
  const fields = data.fields;
  const style = data.style;
  
  // 1. SAFETY CHECK
  const rowCount = rows.length;
  const MAX_SAFE_ROWS = 1000;

  if (rowCount > MAX_SAFE_ROWS) {
    document.body.innerHTML = `<div>Too many rows (${rowCount}). Please filter.</div>`;
    return; 
  }

  // 2. SORTING
  const sortRules = style.sortConfig && style.sortConfig.value;
  if (sortRules && sortRules.includes(',')) {
    const parts = sortRules.split(',').map(s => s.trim());
    const sortFieldName = parts[1] || parts[0]; 
    const order = parts[3] || 'asc';

    const allFields = [].concat(fields.rowDimensions || [], fields.columnDimensions || [], fields.metrics || []);
    const targetField = allFields.find(f => f.name.replace(/\s+/g, '') === sortFieldName.replace(/\s+/g, ''));

    if (targetField && targetField.id) { // Added null check here
      rows.sort((a, b) => {
        let valA = a[targetField.id];
        let valB = b[targetField.id];
        const isNumeric = !isNaN(valA) && !isNaN(valB);
        
        if (order.toLowerCase() === 'desc') {
          return isNumeric ? Number(valB) - Number(valA) : String(valB).localeCompare(String(valA));
        } else {
          return isNumeric ? Number(valA) - Number(valB) : String(valA).localeCompare(String(valB));
        }
      });
    }
  }

  // 3. RENDERING
  const showAsRows = style.showMeasuresAsRows.value;
  const tableStyle = 'width:100%; border-collapse:collapse; font-family:sans-serif; font-size:12px;';
  const headerStyle = 'background:#f8f9fa; border:1px solid #d1d1d1; padding:8px; text-align:left; position:sticky; top:0;';
  const cellStyle = 'border:1px solid #ececec; padding:8px; text-align:right;';

  let html = `<table style="${tableStyle}">`;

  if (showAsRows) {
    // HEADER: Columns are the Sorted Data Points
    html += '<thead><tr><th style="' + headerStyle + '">Metric</th>';
    rows.forEach(row => {
      const colLabel = fields.columnDimensions.map(f => row[f.id]).join(' | ');
      html += `<th style="${headerStyle}">${colLabel}</th>`;
    });
    html += '</tr></thead><tbody>';

    // BODY: Rows are the Metrics in the order they were dragged into the UI
    fields.metrics.forEach(metric => {
      html += `<tr><td style="${headerStyle} font-weight:bold;">${metric.name}</td>`;
      rows.forEach(row => {
        html += `<td style="${cellStyle}">${row[metric.id]}</td>`;
      });
      html += '</tr>';
    });
  } else {
    // STANDARD VIEW
    html += '<thead><tr>';
    const allHeaders = [].concat(fields.columnDimensions || [], fields.metrics || []);
    allHeaders.forEach(f => { html += `<th style="${headerStyle}">${f.name}</th>`; });
    html += '</tr></thead><tbody>';

    rows.forEach(row => {
      html += '<tr>';
      allHeaders.forEach(f => { html += `<td style="${cellStyle}">${row[f.id]}</td>`; });
      html += '</tr>';
    });
  }

  html += '</tbody></table>';
  document.body.innerHTML = html;
}, {transform: dscc.tableTransform});