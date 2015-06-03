SlimTable
=========

SlimTable is a plugin for jQuery, which creates sortable and pageable tables from existing table data. Plugin is quite lightweight, as it only takes 6kB when minified (3kB gzipped). 

Official homepage of slimtable: [http://slimtable.mcfish.org](http://slimtable.mcfish.org)

### Supported jQuery version

+ jQuery >= 1.8

### Supported browsers

+ FireFox 21+
+ Chrome 24+
+ IE 10+
+ Opera 15+
+ Safari 6+

Might work with other browsers, but these are the ones that are officially supported.

### Features

+ Sorting by multiple columns (shift-click columns to add them to sort list)
+ Parse existing table, or fetch data from ajax source
+ Preserve selected attributes from TD elements, when parsing existing table
+ User definable callbacks before and after sorting
+ Optional HTML cleaner for sortable data
+ Autodetection of following values:
++ Numeral values with/without the following prefixes: % $ € £ e
++ Dates in format: dd-mm-yyyy , dd.mm.yyyy , dd/mm/yyyy

### How to build

+ npm install -g grunt-cli
+ npm install
+ grunt

* * *

Pekka Harjamäki
