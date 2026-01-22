dscc.subscribeToData(function(data) {
  console.log('Pivot Data version 0.2');

  // Clear the body
  document.body.innerHTML = '';

  const tableData = data.tables.DEFAULT;

  if (!tableData) {
    document.body.innerHTML = 'No data to display.';
    return;
  }

  // Use the field IDs from viz.json
  const dimensionFields = data.fields.rowDimensions || [];
  const metricFields = data.fields.metrics || [];

  if (dimensionFields.length === 0 || metricFields.length === 0) {
    document.body.innerHTML = 'Please add at least one dimension and one metric.';
    return;
  }

  const allFields = [...dimensionFields, ...metricFields];

  // Create table
  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const tbody = document.createElement('tbody');

  table.appendChild(thead);
  table.appendChild(tbody);
  document.body.appendChild(table);

  // Create header row
  const headerRow = document.createElement('tr');
  allFields.forEach(field => {
    const th = document.createElement('th');
    th.textContent = field.name;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);

  // Create data rows
  tableData.forEach(rowData => {
    const tr = document.createElement('tr');
    allFields.forEach(field => {
      const td = document.createElement('td');
      td.textContent = rowData[field.id];
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  // Add footer
  const footer = document.createElement('div');
  footer.classList.add('footer');
  footer.textContent = `Showing ${tableData.length} rows.`;
  document.body.appendChild(footer);
});
