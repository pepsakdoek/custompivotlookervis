# Advanced Styling with Custom CSS

This document explains how to use the "Advanced CSS" feature to apply your own custom styles to the pivot table visualization.

## How to Use

In the Looker Studio property panel, under the "Style" tab, you will find a text area labeled "Advanced CSS". You can write or paste any valid CSS code into this field. The styles you define here will be injected directly into the visualization, allowing you to override the default styles.

## CSS Class Reference

The following CSS classes are available for you to target specific parts of the pivot table.

### General

| Class         | Description                            |
|---------------|----------------------------------------|
| `.pivot-table`| The main `<table>` element for the entire pivot table. |

### Table Header (`<thead>`)

| Class         | Description                            |
|---------------|----------------------------------------|
| `.RDH`        | All Row Dimension headers.             |
| `.RDH1` - `.RDH5` | A specific Row Dimension header by level (e.g., `.RDH1` for the first dimension). |
| `.CDH`        | All Column Dimension headers.          |
| `.CDH1` - `.CDH5` | A specific Column Dimension header by level. |
| `.CSH`        | All Column Subtotal headers.           |
| `.CSH1` - `.CSH5` | A specific Column Subtotal header by level. |
| `.MH`         | All Metric headers.                    |
| `.MH1` - `.MH10`  | A specific Metric header by index (e.g., `.MH1` for the first metric). |
| `.RGH`        | The "Row Grand Total" header cell.     |
| `.MRH`        | The "Measure" header (in 'Metric Row' layouts). |
| `.VH`         | The "Value" header (used when no column dimensions exist in some layouts). |
| `.TLC`        | The empty top-left corner cell.        |

### Table Body (`<tbody>`)

#### Data Rows and Cells

| Class         | Description                            |
|---------------|----------------------------------------|
| `.DR`         | All data rows (`<tr>`) in the table body. |
| `.RDC`        | All Row Dimension value cells (`<td>`). |
| `.RDC1` - `.RDC5` | A specific Row Dimension value cell by level. |
| `.MC`         | All Metric value cells.                |
| `.MC1` - `.MC10`  | A specific Metric value cell by index. |
| `.MNC`        | "Measure Name" cells (in 'Metric Row' layouts). |
| `.MNC1` - `.MNC10` | A specific "Measure Name" cell by metric index. |

#### Subtotal and Grand Total Rows

| Class         | Description                            |
|---------------|----------------------------------------|
| `.RSR`        | A Row Subtotal row (`<tr>`).           |
| `.RSL`        | The label cell within a Row Subtotal row (e.g., "Subtotal..."). |
| `.RSV`        | All value cells within a Row Subtotal row. |
| `.RSV1` - `.RSV10`| A specific value cell in a Row Subtotal row by metric index. |
| `.CGR`        | The Column Grand Total row (`<tr>`) at the bottom. |
| `.CGL`        | The "Grand Total" label cell in the Column Grand Total row. |
| `.CGV`        | All value cells within the Column Grand Total row. |
| `.CGV1` - `.CGV10`| A specific value cell in the Column Grand Total row by metric index. |
| `.RGV`        | All value cells within the Row Grand Total column (on the right). |
| `.RGV1` - `.RGV10`| A specific value cell in the Row Grand Total column by metric index. |

## Example

Here is a simple example of how you could use these classes to change the styling:

```css
/* Make all metric headers and cells blue */
.MH, .MC {
  color: blue;
}

/* Make the first row dimension bold */
.RDC1 {
  font-weight: bold;
}

/* Give the column grand total row a light grey background */
.CGR {
  background-color: #f0f0f0;
}
```
