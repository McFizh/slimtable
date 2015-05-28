SlimTable
=========

SlimTable is a plugin for jQuery, which creates sortable and pageable tables from existing table data. Plugin is quite lightweight, as it only takes 5kB when minified (2kB gzipped). 

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

### How to build

+ npm install -g grunt-cli
+ npm install
+ grunt

### Changelog

+ **v1.2.2** - 28.05.2015
  - Speeded up sorting in some cases
  - Autodetection for date types (accepted formats: dd.mm.yyyy / dd-mm-yyyy / dd/mm/yyyy )
  - Columns with sorting disabled get 'slimtable-unsortable' class for header th

+ **v1.2.1** - 27.05.2015
  - Small fixes to packaging files

+ **v1.2.0** - 27.05.2015
  - Added to bower repository
  - Grunt is now used to build script

+ **v1.1.3** - 18.08.2013
  - More ajax loading options

+ **v1.1.2** - 11.8.2013
  - Sort start/end callbacks
  - Option for html stripping content before sorting
  - Localizable string ( items/page ) 
  - More accurate column type detection

+ **v1.1.1** - 28.7.2013
  - Script crashed if column count differed between headers and data
  - Float, percentage and currency detection added to sort (see updated example 4)

+ **v1.1.0** - 26.7.2013
  - Creating table from ajax data now works
  - Lowered jQuery requirement to jQuery 1.8

+ **v1.0** - 25.7.2013
  - Public release

* * *

Pekka Harjamäki
