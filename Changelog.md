### Changelog

+ **v1.2.3** - 3.6.2015
  - Library target size increased from 5kB to 6kB :(
  - Added preserve td attributes functionality
  - HTML cleaning function had typo in it, so it failed to work
  - Initial Column sort direction and sorted fields list can be set
  - Data parser can be overridden using attribute 'sort-data' in TD element
  - Multiple column sorting was broken in some cases

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
