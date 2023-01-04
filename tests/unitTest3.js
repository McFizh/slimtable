$(function() {
  run_qunit();
});

function run_qunit() {

  test("basic test", function(assert) {
    var done1=assert.async(),
      thfound=0,
      trfound=0;

    expect(5);

    //
    $.ajax({
      url: "test.json",
      dataType: "json"
    }).done(function(data) {

      $("#testTable").slimtable({
        tableData: data,
        sortList: [2],
        colSettings: [
          { colNumber: 2, sortDir: "desc" },
          { colNumber: 3, enableSort: false, addClasses: ["text-right"] }
        ]
      });

      ok(true, "Test resumed after ajax call");

      // Table should have 5 TH elements with attributes 'unselectable'='on'
      $("#testTable").find("thead").each(function(){
        $(this).find("th").each(function(){
          if( $(this).attr("unselectable") === "on" )
            thfound++;
        });
      });

      equal(thfound, 8, "Proper number of th's found");

      // Table should have 10 Tr elements
      $("#testTable").find("tbody").each(function(){
        $(this).find("tr").each(function(){
          trfound++;
        });
      });
      equal(trfound, 9, "Proper number of tr's found");

      // Third field should have ex_h as first value, if sort settings work
      ok( $("#testTable tbody tr:nth-child(1) td:nth-child(3)").text() === "ex_h" , "DESC text sorting works" );

      // Fourth header column should have "text-right" class and
      ok( $("#testTable thead th:nth-child(4)").hasClass("slimtable-unsortable") , "addClass option works" );

      done1();

    }).fail(function(param1,param2) {
      console.log("Error: "+param2);
    });


  });

}
