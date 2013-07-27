/**
 * SlimTable
 * http://slimtable.mcfish.org/
 * 
 * Licensed under MIT license.
 *
 * Date: 28 / 07 / 2013
 * @version 1.1.1
 * @author Pekka Harjamäki
 */

(function($) {
	$.fn.slimtable = function( options ) {
		//
		var settings = $.extend({
			tableData: null,
			itemsPerPage: 10,
			ipp_list: [5,10,20],
			colSettings: []
		}, options);

		var col_settings = [],
		    sort_list = [],
		    tbl_data = [],
		    table_thead,
		    table_tbody,
		    table_btn_container,
		    paging_start,
		    items_per_page;

		/* ******************************************************************* *
		 * Main part of the plugin
		 * ******************************************************************* */
		return this.each(function() {

			//
			paging_start = 0;
			items_per_page = settings.itemsPerPage;

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

			if(tbl_data.length>0 && col_settings.length != tbl_data[0].length)
			{
				console.log("Slimtable: Different number of columns in header and data!");
				return;
			}

			// Add sort bindings
			addSortIcons();

			//
			$(this).addClass("slimtable");
			addPaging( $(this) );

			//
			createTable();
		} );

		/* ******************************************************************* *
		 * Add paging div and sort icons
		 * ******************************************************************* */
		function addPaging( tbl_obj ) {
			var t_obj1, t_obj2,
			    selector = document.createElement('select');

			//
			t_obj1 = document.createElement('div');
			$(t_obj1).addClass('slimtable-paging-div');

			//
			for(var l1 = 0 ; l1<settings.ipp_list.length; l1++)
			{
				var option = document.createElement('option');
				option.value=settings.ipp_list[l1];
				option.text=settings.ipp_list[l1];

				if(option.value == settings.itemsPerPage)
					option.selected = true;

				$(selector).append(option);
			}
	
			$(selector).on('change',handle_ipp_change);
			$(selector).addClass('slimtable-paging-select');

			// Create container for paging buttons
			t_obj2 = document.createElement('div');
			$(t_obj2).addClass('slimtable-paging-btnsdiv');
			$(t_obj1).append(t_obj2);
			table_btn_container = t_obj2;

			// Create container for select
			t_obj2 = document.createElement('div');
			$(t_obj2).addClass('slimtable-paging-seldiv');

			$(t_obj2).append(selector);
			$(t_obj2).append("items/page");
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
		function readTable() {
			var th_list=table_thead.find("th");

			//
			col_settings = new Array();
			for(var l1=0; l1<th_list.length; l1++)
			{
				var val_sortable = true,
				    val_xtraclasses = [];

				// has user set any custom settings to columns?
				for(var l2=0; l2<settings.colSettings.length; l2++)
				if( settings.colSettings[l2].colNumber == l1 )
				{
					if( settings.colSettings[l2].enableSort==false)
						val_sortable = false;

					if( settings.colSettings[l2].addClasses && settings.colSettings[l2].addClasses.length>0)
						val_xtraclasses = settings.colSettings[l2].addClasses;

					break;
				}

				//
				col_settings[l1]={
					sortable: val_sortable,
					classes: val_xtraclasses,
					sortdir: "asc"
				};
			}

			// Get data either from table on from array
			if(!settings.tableData || settings.tableData.length<=0)
			{
				table_tbody.find("tr").each(function() {
					var t_row=new Array();
					$(this).find("td").each(function() {
						t_row.push( $(this).html() );
					});
					tbl_data.push(t_row);
				});
			} else {
		    		tbl_data = settings.tableData
			}		
		}

		function createTable() {
			var end_pos = parseInt(paging_start)+parseInt(items_per_page),
			    t_obj1,t_obj2,pages;

			//
			table_tbody.empty();
			end_pos = end_pos > tbl_data.length ? tbl_data.length : end_pos;


			//
			for(var l1=paging_start; l1<end_pos; l1++)
			{
				t_obj1 = document.createElement("tr");
				for(var l2=0; l2<tbl_data[l1].length; l2++)
				{
					// Create TD element
					t_obj2 = document.createElement("td");
					$(t_obj2).html( tbl_data[l1][l2] );

					// Add extra css classes to td
					for(var l3=0; l3<col_settings[l2].classes.length; l3++)
						$(t_obj2).addClass(col_settings[l2].classes[l3]);

					// Add td to tr
					$(t_obj1).append(t_obj2);
				}

				table_tbody.append(t_obj1);
			}

			// Create paging buttons
			$(table_btn_container).empty();
			pages = Math.ceil( tbl_data.length / items_per_page );
			for(var l1=0; l1<pages; l1++)
			{
				t_obj1 = document.createElement("div");
				$(t_obj1).addClass("slimtable-page-btn");
				$(t_obj1).on('click',handle_page_change);
				$(t_obj1).text(l1+1);

				if( l1*items_per_page == paging_start )
					$(t_obj1).addClass("active");
					
				$(table_btn_container).append( t_obj1 );
			}
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
			    pos = $.inArray(idx,sort_list);

			//
			e.preventDefault();

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
			for(var l1=0; l1<col_settings.length; l1++)
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
				var t1, t2;

				for(var l1=0; l1<sort_list.length; l1++)
				{
					t1 = sort_list[l1];

					if( a[t1] == b[t1] )
					if( l1 < (sort_list.length-1) )
					{
						t2 = sort_list[l1+1];
						return( compare_rows(a[t2] , b[t2] , col_settings[t2].sortdir ) );
					}

					return( compare_rows(a[t1] , b[t1] , col_settings[t1].sortdir ) );
				}
			});

			//
			createTable();
			
		}

		/* ******************************************************************* *
		 * Compare functions
		 * ******************************************************************* */
		function compare_rows(a,b,dir)
		{
			var patt_01 = /[^0-9]/g,
			    patt_02 = /[^0-9,\.]/g,
			    patt_03 = /^([0-9]+([\.,][0-9]+)?)\s*[%$€£e]?$/,
			    tmp_1, tmp_2;

			// Only numbers?
			if( !patt_01.test(a) )
				return( compare_numbers(a,b,dir) );

			// Float values?
			if( !patt_02.test(a) )
				return( compare_floats(a,b,dir) );

			// Percentage values or prices?
			if( patt_03.test(a) )
			{	
				tmp_1 = RegExp.$1;
				patt_03.test(b);
				tmp_2 = RegExp.$1;

				return( compare_floats(tmp_1,tmp_2,dir) );
			}

			return( compare_strings(a,b,dir) );
		}

		function compare_floats(a,b,dir)
		{
			var a1 = parseFloat(a.replace(",",".")),
			    b1 = parseFloat(b.replace(",","."));

			if(dir == "asc") 
				return(a1-b1);

			return(b1-a1);
		}

		function compare_numbers(a,b,dir)
		{
			if(dir == "asc") 
				return(a-b);

			return(b-a);
		}

		function compare_strings(a,b,dir)
		{
			var s1 = new String ( a.toLowerCase() ),
			    s2 = new String ( b.toLowerCase() );

			if(dir == "asc" ) 
				return ( s1.localeCompare(s2) );

			return ( s2.localeCompare(s1) );
		}
	}
}(jQuery));
