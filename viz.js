dscc.subscribeToData(function(data) {
	if (!data || !data.tables || !data.tables.DEFAULT) {
		document.body.innerHTML = 'No data received';
		return;
	}

	const rows = data.tables.DEFAULT;
	const fields = data.fields || {};

	const rowDims = fields.rowDimensions || [];
	const colDims = fields.columnDimensions || [];
	const metrics = fields.metrics || [];

	if (!rows.length) {
		document.body.innerHTML = 'No rows to display';
		return;
	}

	const allFields = rowDims.concat(colDims, metrics);
	const maxRows = Math.min(rows.length, 10);

	let html = '<table style="border-collapse:collapse;width:100%;font-family:sans-serif;font-size:12px">';
	html += '<thead><tr>';

	allFields.forEach(f => {
		html += `<th style="border:1px solid #ccc;padding:6px;background:#f8f9fa;text-align:left">${f.name}</th>`;
	});

	html += '</tr></thead><tbody>';

	for (let i = 0; i < maxRows; i++) {
		const row = rows[i];
		html += '<tr>';

		allFields.forEach(f => {
			const val = row[f.id];
			html += `<td style="border:1px solid #eee;padding:6px;text-align:right">${val}</td>`;
		});

		html += '</tr>';
	}

	html += '</tbody></table>';
	html += `<div style="margin-top:6px;color:#666">Showing ${maxRows} of ${rows.length} rows</div>`;

	document.body.innerHTML = html;

}, { transform: dscc.tableTransform });
