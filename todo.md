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

FROZEN HEADERS

Frozen behaviour not 100% in general, but here are specific bugs:

* vertical scrolling seems to move the text 1px up, horizontal scrolling seems to move text 1px left
 * Probably related, there is a bit of an transparent border that you can see the table scrolling 'behind' likely if that is fixed above will also be fixed
 * This behaviour still happens with 2 frozen columns, but only the first column is affected (by the text moving), the 2nd column looks fixed (see test 8: Metric as rows and Metric as Rows 1st)
* Column headers 'flies over' the topleft cell, when scrolling horizontally, this only seem to happen when the 'frozen' rows are 3 or more, and the top left cell has a rowspan of 2 or more
* add show as % of row / column / grand total as display options

