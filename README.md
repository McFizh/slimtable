# SlimTable

![Test](https://github.com/mcfizh/slimtable/actions/workflows/test-workflow.yml/badge.svg)

SlimTable is a plugin for jQuery, which creates sortable and pageable tables from existing table data. Plugin is quite lightweight, as it only takes 8kB when minified (3kB gzipped).

Official homepage of slimtable: [https://slimtable.mcfish.org](https://slimtable.mcfish.org)

### Supported jQuery version

- jQuery >= 3.6

### Supported browsers

- FireFox 110+
- Chrome 113+
- IE Edge 113+

Might work with other browsers, but these are the ones that are officially supported.

### Features

- Sorting by multiple columns (shift-click columns to add them to sort list)
- Parse existing table, or fetch data from ajax source
- Preserve selected attributes from TD elements, when parsing existing table
- User definable callbacks before and after sorting
- Optional HTML cleaner for sortable data
- Autodetection of following values:
  ++ Numeral values with/without the following prefixes: % $ € £ e
  ++ Dates in format: dd-mm-yyyy , dd.mm.yyyy , dd/mm/yyyy

### How to build

- npm ci
- npx grunt

---

Pekka Harjamäki
