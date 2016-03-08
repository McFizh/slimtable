/*!
 * slimtable ( http://slimtable.mcfish.org/ )
 *
 * Licensed under MIT license.
 *
 * @version 1.2.7
 * @author Pekka Harjamäki
 */

(function($) {
	$.fn.slimtable = function( options ) {
		//
		var settings = $.extend({
			tableData: null,
			dataUrl: null,

			itemsPerPage: 10,
			ipp_list: [5,10,20],

			keepAttrs: [],
			sortList: [],
			colSettings: [],

			text1: "items/page",
			text2: "Loading...",

			sortStartCB: null,
			sortEndCB: null
		}, options);

		// Private variables
		var col_settings = [],
		    sort_list = [],
		    tbl_data = [],
		    table_thead,
		    table_tbody,
		    table_btn_container,
		    paging_start,
		    items_per_page,
		    show_loading,
		    html_cleaner_div;

		/* ******************************************************************* *
		 * Main part of the plugin
		 * ******************************************************************* */
		return this.each(function() {

			//
			paging_start = 0;
			show_loading = false;
			items_per_page = parseInt(settings.itemsPerPage);
			html_cleaner_div = document.createElement('div');

			//
			table_thead = $(this).find("thead");
			table_tbody = $(this).find("tbody");

			// First we need to find both thead and tbody
			if(table_thead.length === 0 || table_tbody.length === 0)
			{
				showError("thead/tbody missing from table!");
				return;
			}

			// Read table headers + data
			readTable();

			if( show_loading === false && !sanityCheck1() )
			{
				showError("Different number of columns in header and data!");
				return;
			}

			// Add sort bindings & paging buttons
			$(this).addClass("slimtable");
			addSortIcons();
			addPaging( $(this) );

			//
			doSorting();
		} );

		function sanityCheck1() 
		{
			if( tbl_data.length > 0 && col_settings.length != tbl_data[0].data.length )
				return(false);

			return(true);
		}

		/* ******************************************************************* *
		 * Add paging div and sort icons
		 * ******************************************************************* */
		function addPaging( tbl_obj ) {
			var t_obj1, t_obj2, l1 ,
			    selector;

			//
			selector = $("<select></select>").
				addClass('slimtable-paging-select').
				on('change',handle_ipp_change);

			for(l1 = 0 ; l1<settings.ipp_list.length; l1++)
			{
				t_obj1 = settings.ipp_list[l1];
				t_obj2 = $("<option></option>").val(t_obj1).text(t_obj1);

				if( t_obj1 == settings.itemsPerPage )
					t_obj2.attr("selected","selected");

				$(selector).append(t_obj2);
			}
	

			// Create container for paging buttons
			t_obj2 = document.createElement('div');
			$(t_obj2).addClass('slimtable-paging-btnsdiv');
			table_btn_container = t_obj2;

			//
			t_obj1 = $("<div></div>").
				addClass('slimtable-paging-div').
				append(t_obj2);

			// Create container for select
			t_obj2 = $("<div></div>").
				addClass('slimtable-paging-seldiv').
				append(selector).
				append(settings.text1);
			$(t_obj1).append(t_obj2);

			// Move table to container div
			t_obj2 = $("<div></div>").
				addClass('slimtable-container-div').
				append(t_obj1);

			tbl_obj.before(t_obj2);
			tbl_obj.insertBefore(t_obj1);
		}

		function addSortIcons() {
			var t_colSettings;

			table_thead.find("th").each(function(index) {
				$(this).attr('unselectable','on');

				t_colSettings = col_settings[index];

				if(t_colSettings && t_colSettings.sortable)
				{
					var obj = document.createElement("span");
					$(obj).attr('unselectable','on').
						addClass("slimtable-sprites");

					if( t_colSettings.sortDir=="asc" )
					{
						$(obj).addClass("slimtable-sortasc");
					} else if( t_colSettings.sortDir=="desc" ) {
						$(obj).addClass("slimtable-sortdesc");
					} else {
						$(obj).addClass("slimtable-sortboth");
					}

					$(this). prepend(obj).
						 css({ cursor: "pointer" }).
						 on("click",handleHeaderClick);
				} else {
					$(this).addClass("slimtable-unsortable");
				}
			});
		}

		/* ******************************************************************* *
		 * Utils
		 * ******************************************************************* */
		function processData(data)
		{
			var l1, l2,  t_row;
      
			tbl_data = [];

			for(l1=0; l1<data.length; l1++)
			{
				t_row = { data: [] , attrs: [] };
				for(l2=0; l2<data[l1].length; l2++)
					t_row.data.push( { orig: data[l1][l2], attrs: [], clean: null } );
				tbl_data.push(t_row);
			}
		}

		function readTable() 
		{
			var th_list=table_thead.find("th"), 
				l1, l2, t_val, 
				t_row, t_obj, t_attr, match_arr;

			//
			col_settings = [];
			for(l1=0; l1<th_list.length; l1++)
			{
				col_settings[l1]={
					sortable: true,
					classes: [],
					stripHtml: false,
					sortDir: "asc",
					rowType: -1
				};

				// has user set any custom settings to columns?
				for(l2=0; l2<settings.colSettings.length; l2++)
				{
					t_obj = settings.colSettings[l2];
					if( t_obj.colNumber != l1 )
						continue;

					if( t_obj.enableSort === false )
						col_settings[l1].sortable = false;

					if( t_obj.stripHtml === true )
						col_settings[l1].stripHtml = true;

					if( t_obj.sortDir == "asc" || t_obj.sortDir == "desc" )
						col_settings[l1].sortDir = t_obj.sortDir;

					if( t_obj.rowType >= 0 )
						col_settings[l1].rowType = t_obj.rowType;

					if( t_obj.addClasses && t_obj.addClasses.length>0)
						col_settings[l1].classes = t_obj.addClasses;

					break;
				}
			}

			//
			sort_list = ( settings.sortList.length > 0 ) ? settings.sortList : [];

			// Get data either from table, pre defined array or ajax url
			if( settings.dataUrl && settings.dataUrl.length > 2 ) 
			{
				show_loading = true;
				$.ajax({
					url: settings.dataUrl,
					dataType: "json"
				}).done(function(data){
					processData(data);
					show_loading = false;
					createTableBody();
				}).fail(function(par1,par2){
					showError("Ajax error: "+par2);
					return;
				});

			} else if(settings.tableData && settings.tableData.length>=0) {

				processData(settings.tableData);

			} else {
				table_tbody.find("tr").each(function() {
					t_row = { data: [], attrs: [] };

					for(l1=0; l1<settings.keepAttrs.length; l1++)
					{
						t_val = settings.keepAttrs[l1];
						t_attr = $(this).attr(t_val);
						if ( typeof t_attr != "undefined" )
							t_row.attrs.push({ attr: t_val, value: t_attr});
					}

					$(this).find("td").each(function() {
						t_obj = { orig: $(this).html() , attrs: [] , clean: null };

						// Does td contain sort-data  attr?
						t_attr = $(this).attr("sort-data");
						if ( typeof t_attr != "undefined" && t_attr !== null )
							t_obj.clean = t_attr;

						// Find attributes to keep
						for(l1=0; l1<settings.keepAttrs.length; l1++)
						{
							t_val = settings.keepAttrs[l1];
							t_attr = $(this).attr(t_val);
							if ( typeof t_attr != "undefined" )
								t_obj.attrs.push({ attr: t_val, value: t_attr});
						}
						t_row.data.push( t_obj );
					});

					tbl_data.push(t_row);
				});
			}

			//
			if(!sanityCheck1())
				return;

			/*********************** Determine col types ***********************/
 
			for(l1=0; l1<th_list.length; l1++)
			{
				match_arr=[ 0, 0, 0, 0, 0 ];

				if(col_settings[l1].rowType == -1)
				{
					for(l2=0; l2<tbl_data.length; l2++)
					{	
						// Remove HTML, TRIM data and create array with cleaned & original data
						t_obj = tbl_data[l2].data[l1];
            
						if ( t_obj.clean === null )
						{
							t_obj = col_settings[l1].stripHtml ? $(html_cleaner_div).html(t_obj.orig).text() : t_obj.orig;
							t_obj = $.trim(t_obj).toLowerCase();
							tbl_data[l2].data[l1].clean = t_obj;
						} else {
							t_obj = t_obj.clean;
						}

						t_attr = returnRowType( t_obj );
						if(t_attr > 0)
						  match_arr[ t_attr ]++;
					}

					col_settings[l1].rowType = $.inArray( Math.max.apply(this, match_arr) , match_arr );
				}

				// Cleanup data bases on type
				for(l2=0; l2<tbl_data.length; l2++)
				{
					t_attr = col_settings[l1].rowType;
					t_obj = tbl_data[l2].data[l1].clean;

					if ( t_attr === 0 )
					{
						tbl_data[l2].data[l1].clean = String(t_obj);
					}

					// Remove end sign, change , to . and run parsefloat
					if ( t_attr == 2 || t_attr == 3 )
					{
						tbl_data[l2].data[l1].clean = parseFloat(t_obj.replace(",","."));
					}

					// Convert values to dates
					if ( t_attr == 4 )
					{
						t_obj = t_obj.split(/[.\/-]/);
						tbl_data[l2].data[l1].clean = new Date ( t_obj[2], t_obj[1], t_obj[0] );
					}
				}
			}
		}

		/* ******************************************************************* *
		 * 
		 * ******************************************************************* */
		function createTableBody() {
			var end_pos = paging_start+items_per_page,
			    t_cobj, t_obj1, t_obj2,
			    pages = Math.ceil( tbl_data.length / items_per_page ), 
			    l1, l2, l3;

			//
			table_tbody.empty();
			end_pos = end_pos > tbl_data.length ? tbl_data.length : end_pos;

			//
			for(l1=paging_start; l1<end_pos; l1++)
			{
				t_obj1 = $("<tr></tr>");

				// Restore attributes to TR
				for(l3=0; l3<tbl_data[l1].attrs.length; l3++)
					$(t_obj1).attr(tbl_data[l1].attrs[l3].attr, tbl_data[l1].attrs[l3].value);

				// Create TD elements
				for(l2=0; l2<tbl_data[l1].data.length; l2++)
				{
					t_cobj = tbl_data[l1].data[l2];

					// Create TD element
					t_obj2 = $("<td></td>").html(t_cobj.orig);

					// Restore attributes
					for(l3=0; l3<t_cobj.attrs.length; l3++)
						$(t_obj2).attr(t_cobj.attrs[l3].attr, t_cobj.attrs[l3].value);

					// Add extra css classes to td
					for(l3=0; l3<col_settings[l2].classes.length; l3++)
						$(t_obj2).addClass(col_settings[l2].classes[l3]);

					// Add td to tr
					$(t_obj1).append(t_obj2);
				}

				table_tbody.append(t_obj1);
			}

			// Create paging buttons
			$(table_btn_container).empty();
			for(l1=0; l1<pages; l1++)
			{
				t_obj1 = document.createElement("div");
				$(t_obj1).addClass("slimtable-page-btn").
					  on('click',handle_page_change).
					  text(l1+1);

				if( l1*items_per_page == paging_start )
					$(t_obj1).addClass("active");
					
				$(table_btn_container).append( t_obj1 );
			}
		}

		function createTableHead() {
			var l1, t_item1, t_item2;

			for(l1=0; l1<col_settings.length; l1++)
			{
				if( !col_settings[l1] || !col_settings[l1].sortable )
					continue;

				t_item1 = table_thead.find("th:nth-child("+(l1+1)+")");
				t_item2 = t_item1.find("span");

				if( $.inArray(l1,sort_list) < 0 )
				{
					t_item1.removeClass("slimtable-activeth");
					t_item2.removeClass("slimtable-sortasc").
						removeClass("slimtable-sortdesc").
						addClass("slimtable-sortboth");
				} else {
					t_item1.addClass("slimtable-activeth");
					t_item2.removeClass("slimtable-sortboth").
						removeClass("slimtable-sort" + (col_settings[l1].sortDir=="asc"?"desc":"asc") ).
						addClass("slimtable-sort" + col_settings[l1].sortDir );
				}
			}
		}

		/* ******************************************************************* *
		 * 
		 * ******************************************************************* */
		function returnRowType(data)
		{
			var patt_01 = /[^0-9]/g,
			    patt_02 = /^[0-9]+([\.,][0-9]+)?$/,
			    patt_03 = /^([0-9]+([\.,][0-9]+)?)\s*[%$€£e]?$/,
			    patt_04 = /^[0-9]{1,2}[.-\/][0-9]{1,2}[.-\/][0-9]{4}$/;

			// Given element is empy
			if( data.length === 0 )
				return(-1);

			// Given element doesn't containt any other characters than numbers
			if( !patt_01.test(data) )
				return(1);

			// Givent element is most likely float number
			if( patt_02.test(data) )
				return(2);

			// Float with cleanup
			if( patt_03.test(data) )
				return(3);
			
			// Date .. maybe?
			if( patt_04.test(data) )
				return(4);

			// String comparison
			return(0);
		
		}

		function doSorting()
		{
			//
			if(sort_list.length>0)
			tbl_data.sort(function(a,b) {
				var t1, ta, tb, l1,
				    slist_length=sort_list.length,
				    same_item;

				for(l1=0; l1<slist_length; l1++)
				{
					t1 = sort_list[l1];

					// Swap variables, if sortdir = ascending
					if( col_settings[t1].sortDir == 'desc' )
					{
						ta = b.data[t1].clean; 
						tb = a.data[t1].clean;
					} else {
						ta = a.data[t1].clean; 
						tb = b.data[t1].clean;
					}

					// Given variables match, move to next sort parameter
					same_item = false;
					if ( col_settings[t1].rowType === 0 )
					{
						if ( ta.localeCompare(tb) === 0 )
							same_item = true;
					} else if (col_settings[t1].rowType == 4 ) {
						if ( ta - tb === 0 )
							same_item = true;
					} else { 
						if (ta == tb)
							same_item = true;
					}

					//
					if( same_item && l1 < (slist_length-1) )
						continue;

					// Compare values
					if ( col_settings[t1].rowType === 0 )
						return( ta.localeCompare(tb) );
					else
						return( ta - tb );
				}

			});

			//
			createTableHead();
			createTableBody();
		}

		function showError(msg) {
			console.log("Slimtable: "+msg);
		}

		/* ******************************************************************* *
		 * Events
		 * ******************************************************************* */
		function handle_page_change(e) {
			var num = parseInt($(this).text())-1,
			    pages = Math.ceil( tbl_data.length / items_per_page );

			if(num<0 || num>=pages)
				return;

			paging_start = num * parseInt(items_per_page);
			createTableBody();
		}

		function handle_ipp_change(e) {
			items_per_page = parseInt(this.value);
			paging_start = 0;
			createTableBody();
		}

		function handleHeaderClick(e) {
			var idx = $(this).index(),
			    pos = $.inArray(idx,sort_list);

			//
			e.preventDefault();

			// Execute sort start callback, if one is defined
			if(settings.sortStartCB && typeof settings.sortStartCB == 'function')
				settings.sortStartCB.call(this);

			// Shift click
			if( e.shiftKey )
			{
				if( pos < 0 )
				{
					sort_list.push( idx );
					col_settings[idx].sortDir = "asc";
				} else {
					if(col_settings[idx].sortDir=="asc")	col_settings[idx].sortDir = "desc";
					else					col_settings[idx].sortDir = "asc";
				}
			} else {
				sort_list = [ idx ];
				if( pos < 0 )
				{
					col_settings[idx].sortDir = "asc";
				} else {
					if(col_settings[idx].sortDir=="asc")	col_settings[idx].sortDir = "desc";
					else					col_settings[idx].sortDir = "asc";
				}
			}


			//
			doSorting();

			// Execute sort end callback, if one is defined
			if(settings.sortEndCB && typeof settings.sortEndCB == 'function')
				settings.sortEndCB.call(this);
		}

	};
}(jQuery));
