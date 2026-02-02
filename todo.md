TODO list:

METRIC_COLUMN:
* Sorting is wonky, it should use the grand totals to sort on. It looks like it's currently sorting on the first coldim's metrics

METRIC_ROW:
* Requires more in depth testing
* Sorting

METRIC_FIRST_COLUMN:
* BODY-RENDER: It seems there are duplicates of the metrics (it's output 3x - with the current test data)
* Row Subtotals are not correct
* Column Subtotals
* Grand Total
* Sorting

METRIC_FIRST_ROW:
* Metrics are reversed
* Row Subtotals not working correctly (maybe check excel how they subtotal), also they seem to aggregate all SUM (ie not respect metric settings)
* Column Subtotals
* Grand Total
* Sorting

