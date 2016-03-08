$("#testTable").slimtable({
	keepAttrs: [ "data-id" ]
});

test('Structure creation, paging, sorting', function() {
	var thfound=0, trfound=0;	

	expect(10);

	// Table should have 5 TH elements with attributes 'unselectable'='on'
	$("#testTable").find("thead").each(function(){
		$(this).find("th").each(function(){
			if( $(this).attr("unselectable") === "on" )
				thfound++;
		});
	});
	equal(thfound, 6, "Proper number of th's found");

	// Table should have 10 Tr elements
	$("#testTable").find("tbody").each(function(){
		$(this).find("tr").each(function(){
			if($(this).attr("data-id") == "1")
				trfound++;
		});
	});
	equal(trfound, 10, "Proper number of tr's found, round 1");

	// Table should be inside div with class 'slimtable-container-div'
	ok( $("#testTable").parent().hasClass("slimtable-container-div"),
		"Table is properly enclosed inside div" );

	// Try to change number of items
	var obj = $("#testTable").parent().find("select").first();
	obj.find("option:nth-child(1)").attr("selected","selected");
	obj.find("option:nth-child(2)").removeAttr("selected");
	obj.trigger("change");

	// Table should now have 5 Tr elements
	trfound = 0;
	$("#testTable").find("tbody").each(function(){
		$(this).find("tr").each(function(){
			if($(this).attr("data-id") == "1")
				trfound++;
		});
	});
	equal(trfound, 5, "Proper number of tr's found, round2");		

	// Sort string : ASC
	$("#testTable thead th:nth-child(3)").trigger("click");
	ok( $("#testTable tbody tr:nth-child(1) td:nth-child(3)").text() == "" , "ASC text sorting works" );

	// Sort string : DESC
	$("#testTable thead th:nth-child(3)").trigger("click");
	ok( $("#testTable tbody tr:nth-child(1) td:nth-child(3)").text() == "Young" , "DESC text sorting works" );

	// Sort int : ASC
	$("#testTable thead th:nth-child(4)").trigger("click");
	ok( $("#testTable tbody tr:nth-child(1) td:nth-child(4)").text() == "19" , "ASC int sorting works" );

	// Sort int : DESC
	$("#testTable thead th:nth-child(4)").trigger("click");
	ok( $("#testTable tbody tr:nth-child(1) td:nth-child(4)").text() == "82" , "DESC int sorting works" );

	// Sort float : ASC
	$("#testTable thead th:nth-child(5)").trigger("click");
	ok( $("#testTable tbody tr:nth-child(1) td:nth-child(5)").text() == "-50,2" , "ASC float sorting works" );

	// Sort float : DESC
	$("#testTable thead th:nth-child(5)").trigger("click");
	ok( $("#testTable tbody tr:nth-child(1) td:nth-child(5)").text() == "197,3" , "DESC float sorting works" );
});
