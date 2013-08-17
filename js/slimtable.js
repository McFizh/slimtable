/**
 * SlimTable
 * http://slimtable.mcfish.org/
 * 
 * Licensed under MIT license.
 *
 * Date: 18 / 08 / 2013
 * @version 1.1.3
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
			items_per_page = settings.itemsPerPage;
			html_cleaner_div = document.createElement('div');

			//
			table_thead = $(this).find("thead");
			table_tbody = $(this).find("tbody");

			// First we need to find both thead and tbody
			if(table_thead.length == 0 || table_tbody.length == 0)
			{
				console.log("Slimtable: thead/tbody missing from table!");
				return;
			}

			// Read table headers + data
			readTable();

			if( show_loading==false && !sanity_check_1() )
				return;

			// Add sort bindings & paging buttons
			$(this).addClass("slimtable");
			addSortIcons();
			addPaging( $(this) );

			//
			createTable();
		} );

		function sanity_check_1() 
		{
			if(tbl_data.length>0 && col_settings.length != tbl_data[0].length)
			{
				console.log("Slimtable: Different number of columns in header and data!");
				return(false);
			}
			return(true);
		}

		/* ******************************************************************* *
		 * Add paging div and sort icons
		 * ******************************************************************* */
		function addPaging( tbl_obj ) {
			var t_obj1, t_obj2,
			    option, l1 ,
			    selector = document.createElement('select');

			//
			t_obj1 = document.createElement('div');
			$(t_obj1).addClass('slimtable-paging-div');

			//
			for(l1 = 0 ; l1<settings.ipp_list.length; l1++)
			{
				option = document.createElement('option');
				option.value=settings.ipp_list[l1];
				option.text=settings.ipp_list[l1];

				if(option.value == settings.itemsPerPage)
					option.selected = true;

				$(selector).append(option);
			}
	
			$(selector).on('change',handle_ipp_change).
				    addClass('slimtable-paging-select');

			// Create container for paging buttons
			t_obj2 = document.createElement('div');
			$(t_obj2).addClass('slimtable-paging-btnsdiv');
			$(t_obj1).append(t_obj2);
			table_btn_container = t_obj2;

			// Create container for select
			t_obj2 = document.createElement('div');
			$(t_obj2).addClass('slimtable-paging-seldiv');

			$(t_obj2).append(selector);
			$(t_obj2).append(settings.text1);
			$(t_obj1).append(t_obj2);

			// Move table to container div
			t_obj2 = document.createElement('div');
			$(t_obj2).addClass('slimtable-container-div');

			$(t_obj2).append(t_obj1);
			tbl_obj.before(t_obj2);
			tbl_obj.insertBefore(t_obj1);
		}

		function addSortIcons() {
			table_thead.find("th").each(function(index) {
				$(this).attr('unselectable','on');

				if(col_settings[index] && col_settings[index].sortable)
				{
					var obj = document.createElement("span");

					$(obj).addClass("slimtable-sprites");
					$(obj).attr('unselectable','on');

					if( col_settings[index].sordir=="asc" )
					{
						$(obj).addClass("slimtable-sortasc");
					} else if( col_settings[index].sordir=="desc" ) {
						$(obj).addClass("slimtable-sortdesc");
					} else {
						$(obj).addClass("slimtable-sortboth");
					}

					$(this). prepend(obj).
						 css({ cursor: "pointer" }).
						 on("click",handleHeaderClick);
				}
			});
		}

		/* ******************************************************************* *
		 * Utils
		 * ******************************************************************* */
		function readTable() 
		{
			var th_list=table_thead.find("th"), l1, l2;

			//
			col_settings = new Array();
			for(l1=0; l1<th_list.length; l1++)
			{
				var val_sortable = true,
				    val_strip_html = false,
				    val_rowtype = -1,
				    val_xtraclasses = [];

				// has user set any custom settings to columns?
				for(l2=0; l2<settings.colSettings.length; l2++)
				if( settings.colSettings[l2].colNumber == l1 )
				{
					if( settings.colSettings[l2].enableSort==false )
						val_sortable = false;

					if( settings.colSettings[l2].stripHtml==true )
						val_strip_html = true;

					if( settings.colSettings[l2].rowType>=0 )
						val_rowtype = settings.colSettings[l2].rowType;

					if( settings.colSettings[l2].addClasses && settings.colSettings[l2].addClasses.length>0)
						val_xtraclasses = settings.colSettings[l2].addClasses;

					break;
				}

				//
				col_settings[l1]={
					sortable: val_sortable,
					classes: val_xtraclasses,
					strip_html: val_strip_html,
					sortdir: "asc",
					rowtype: val_rowtype
				};
			}

			// Get data either from table, pre defined array or ajax url
			if(settings.dataUrl && settings.dataUrl.length>2) 
			{
				show_loading = true;
				$.ajax({
					url: settings.dataUrl,
					dataType: "json"
				}).done(function(data){
					tbl_data = data;
					show_loading = false;
					determine_col_types();
					createTable();
				}).fail(function(par1,par2){
					console.log("Slimtable: Ajax error: "+par2);
				});

			} else if(settings.tableData && settings.tableData.length>=0) {
		    		tbl_data = settings.tableData;
				determine_col_types();
			} else {
				table_tbody.find("tr").each(function() {
					var t_row=new Array();
					$(this).find("td").each(function() {
						t_row.push( $(this).html() );
					});
					tbl_data.push(t_row);
				});
				determine_col_types();
			}
		}

		function determine_col_types()
		{
			var th_list=table_thead.find("th");

			// Determine col types
			for(var l1=0; l1<th_list.length; l1++)
			if(col_settings[l1].rowtype == -1)
			{
				var match_arr=[ 0, 0, 0, 0 ], t_retval;

				for(l2=0; l2<tbl_data.length; l2++)
				{
					t_retval = return_row_type(tbl_data[l2][l1], col_settings[l1].strip_html);
					match_arr[ t_retval ]++;
				}

				col_settings[l1].rowtype = $.inArray( Math.max.apply(this, match_arr) , match_arr );
			}
		}

		function createTable() {
			var end_pos = parseInt(paging_start)+parseInt(items_per_page),
			    t_obj1,t_obj2,pages, l1, l2, l3;

			//
			table_tbody.empty();
			end_pos = end_pos > tbl_data.length ? tbl_data.length : end_pos;
			pages = Math.ceil( tbl_data.length / items_per_page );

			//
			for(l1=paging_start; l1<end_pos; l1++)
			{
				t_obj1 = document.createElement("tr");
				for(l2=0; l2<tbl_data[l1].length; l2++)
				{
					// Create TD element
					t_obj2 = document.createElement("td");
					$(t_obj2).html( tbl_data[l1][l2] );

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
		/* ******************************************************************* *
		 * 
		 * ******************************************************************* */
		function remove_html(data)
		{
			return( $(html_cleaner_div).html(data).text() );
		}

		function return_row_type(data, rm_html)
		{
			var patt_01 = /[^0-9]/g,
			    patt_02 = /[^0-9,\.]/g,
			    patt_03 = /^([0-9]+([\.,][0-9]+)?)\s*[%$€£e]?$/;

			if(rm_html)
				data = remove_html(data);

			// Given element doesn't containt any other characters than numbers
			if( !patt_01.test(data) )
				return(1);

			// Givent element contains only: 0-9 , .
			if( !patt_02.test(data) )
				return(2);

			// Float with cleanup
			if( patt_03.test(data) )
				return(3);

			// String comparison
			return(0);
		
		}

		/* ******************************************************************* *
		 * Events
		 * ******************************************************************* */
		function handle_page_change(e) {
			var num = parseInt($(this).text())-1,
			    pages = Math.ceil( tbl_data.length / items_per_page );

			if(num<0 || num>=pages)
				return;

			paging_start = num*items_per_page;

			createTable();
		}

		function handle_ipp_change(e) {
			var ipp = this.value;

			items_per_page = this.value;
			paging_start = 0;
			createTable();
		}

		function handleHeaderClick(e) {
			var idx = $(this).index(),
			    t_item1, t_item2,
			    l1,
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
					col_settings[idx].sortdir = "asc";
				} else {
					if(col_settings[idx].sortdir=="asc")	col_settings[idx].sortdir = "desc";
					else					col_settings[idx].sortdir = "asc";
				}
			} else {
				sort_list = [ idx ];
				if( pos < 0 )
				{
					col_settings[idx].sortdir = "asc";
				} else {
					if(col_settings[idx].sortdir=="asc")	col_settings[idx].sortdir = "desc";
					else					col_settings[idx].sortdir = "asc";
				}
			}

			// 
			for(l1=0; l1<col_settings.length; l1++)
			{
				if( !col_settings[l1] || !col_settings[l1].sortable )
					continue;

				t_item1 = table_thead.find("th:nth-child("+(l1+1)+")");
				t_item2 = t_item1.find("span");

				if( $.inArray(l1,sort_list) < 0 )
				{
					t_item1.removeClass("slimtable-activeth");
					t_item2.removeClass("slimtable-sortasc");
					t_item2.removeClass("slimtable-sortdesc");
					t_item2.addClass("slimtable-sortboth");
				} else {
					t_item2.removeClass("slimtable-sortboth");
					t_item2.removeClass("slimtable-sort" + (col_settings[l1].sortdir=="asc"?"desc":"asc") );
					t_item2.addClass("slimtable-sort" + col_settings[l1].sortdir );
					t_item1.addClass("slimtable-activeth");
				}
			}

			//
			if(sort_list.length>0)
			tbl_data.sort(function(a,b) {
				var t1,ta,tb,l1,
				    slist_length=sort_list.length;

				for(l1=0; l1<slist_length; l1++)
				{
					t1 = sort_list[l1];
					ta = a[t1]; 
					tb = b[t1];

					// Given variables match, move to next sort parameter 
					if( ta == tb && l1 < (slist_length-1) )
						continue;

					// Swap variables, if sortdir = ascending
					if( col_settings[t1].sortdir == 'desc' )
					{
						ta = b[t1]; 
						tb = a[t1];
					} 

					// Strip html, if requested
					if( col_settings[t1].strip_html )
					{
						 ta = remove_html(ta);
						 tb = remove_html(tb);
					}

					// Compare values
					switch( col_settings[t1].rowtype )
					{
						// Pure numeric comparison
						case 1: 
							return( ta - tb );

						// Float value comparison
						case 2: 
						case 3:
							ta = parseFloat(ta.replace(",","."));
							tb = parseFloat(tb.replace(",","."));
							return( ta - tb );

						// String comparison
						default: 
							ta = new String ( ta.toLowerCase() );
							tb = new String ( tb.toLowerCase() );
							return ( ta.localeCompare(tb) );
					}
				}

			});

			//
			createTable();

			// Execute sort end callback, if one is defined
			if(settings.sortEndCB && typeof settings.sortEndCB == 'function')
				settings.sortEndCB.call(this);
		}

	}
}(jQuery));
