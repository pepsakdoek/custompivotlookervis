dscc.subscribeToData(function(data) {
  console.log('Pep Custom Pivot v0.3.1');
	if (!data || !data.tables || !data.tables.DEFAULT) return;

	const rows = data.tables.DEFAULT;
	const fields = data.fields;
	const style = data.style;

	if (!fields.metrics || !fields.metrics.length) {
		document.body.innerHTML = 'Add at least one metric';
		return;
	}

	const rowDims = fields.rowDimensions || [];
	const colDims = fields.columnDimensions || [];

	// --- BUILD SORT PLAN (ROWS ONLY) ---
	const sortPlan = [];
	for (let i = 0; i < Math.min(rowDims.length, 5); i++) {
		const mode = style[`sortDim${i + 1}Mode`]?.value;
		if (!mode || mode === 'none') continue;

		sortPlan.push({
			index: i,
			mode: mode,
			metricId: style[`sortDim${i + 1}Metric`]?.value,
			dir: style[`sortDim${i + 1}Direction`]?.value === 'desc' ? -1 : 1
		});
	}

	// --- PRE-AGGREGATE METRICS FOR DIM SORTING ---
	const metricAgg = {};
	sortPlan.forEach(rule => {
		if (rule.mode !== 'metric' || !rule.metricId) return;

		metricAgg[rule.index] = {};
		rows.forEach(r => {
			const key = rowDims.slice(0, rule.index + 1).map(d => r[d.id]).join('|');
			const val = Number(r[rule.metricId]) || 0;
			metricAgg[rule.index][key] = (metricAgg[rule.index][key] || 0) + val;
		});
	});

	// --- STABLE HIERARCHICAL SORT ---
	rows.sort((a, b) => {
		for (const rule of sortPlan) {
			const dim = rowDims[rule.index];
			const aKey = rowDims.slice(0, rule.index + 1).map(d => a[d.id]).join('|');
			const bKey = rowDims.slice(0, rule.index + 1).map(d => b[d.id]).join('|');

			let cmp = 0;

			if (rule.mode === 'dimension') {
				cmp = String(a[dim.id]).localeCompare(String(b[dim.id]));
			} else if (rule.mode === 'metric') {
				const aVal = metricAgg[rule.index][aKey] || 0;
				const bVal = metricAgg[rule.index][bKey] || 0;
				cmp = aVal - bVal;
			}

			if (cmp !== 0) return cmp * rule.dir;
		}
		return 0;
	});

	// --- BASIC RENDER (PLACEHOLDER TABLE) ---
	let html = '<table style="border-collapse:collapse;font-family:sans-serif;font-size:12px;width:100%">';
	html += '<thead><tr>';

	rowDims.concat(colDims, fields.metrics).forEach(f => {
		html += `<th style="border:1px solid #ccc;padding:6px;background:#f8f9fa">${f.name}</th>`;
	});

	html += '</tr></thead><tbody>';

	rows.forEach(r => {
		html += '<tr>';
		rowDims.concat(colDims, fields.metrics).forEach(f => {
			html += `<td style="border:1px solid #eee;padding:6px;text-align:right">${r[f.id]}</td>`;
		});
		html += '</tr>';
	});

	html += '</tbody></table>';
	document.body.innerHTML = html;

}, { transform: dscc.tableTransform });
