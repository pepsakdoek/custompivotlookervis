TODO list:

METRIC_COLUMN:
* Sorting is wonky, it should use the grand totals to sort on. It looks like it's currently sorting on the first coldim's metrics

METRIC_ROW:
* Requires more in depth testing
* Sorting

METRIC_FIRST_COLUMN:
* Row Subtotals are not correct
* Column Subtotals
* Grand Total
* Sorting

METRIC_FIRST_ROW:
* Row Subtotals
* Row Subtotals not working correctly (maybe check excel how they subtotal), also they seem to aggregate all SUM (ie not respect metric settings)
* Column Subtotals
* Grand Total
* Sorting

GENERAL
* Conditional formatting, will probably use the M1-10 and R1-5 and C1-5 'thinking'
* See if we can save a 'cached' version of the data to show the 'last' version, which will hopefully improve loading speed and render on pdfs?
 * Just make loading faster. Customtable loads quite a lot faster, even though it's 5x the size of this viz.
