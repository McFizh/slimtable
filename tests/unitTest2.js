QUnit.test("basic test", (assert) => {
  const done1=assert.async();
  let thfound=0, trfound=0;

  //
  $.ajax({ url: "test.json", dataType: "json" })
    .done(function(data) {
      $("#testTable").slimtable({ tableData: data });
      assert.ok(true, "Test resumed after ajax call");

      // Table should have 8 TH elements with attributes 'unselectable'='on'
      $("#testTable").find("thead").each(function(){
        $(this).find("th").each(function(){
          if( $(this).attr("unselectable") === "on" )
            thfound++;
        });
      });
      assert.equal(thfound, 8, "Proper number of th's found");

      // Table should have 9 Tr elements
      $("#testTable").find("tbody").each(function(){
        $(this).find("tr").each(function(){ trfound++; });
      });
      assert.equal(trfound, 9, "Proper number of tr's found");

      // GetState command should return sane values
      const state = $("#testTable").slimtable("getState");
      assert.propContains(state, { itemsPerPage: 10, pagingStart: 0 });

      done1();
    })
    .fail(function(param1,param2) {
      console.log("Error: "+param2);
    });
});
