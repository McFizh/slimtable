
QUnit.test("basic test", (assert) => {
  const done1 = assert.async();
  let thfound = 0, trfound = 0;

  $("#testTable").slimtable({
    dataUrl: "test.json",
    sortList: [0],
    colSettings: [
      { colNumber: 0, sortDir: "desc" },
    ]
  });

  // Wait 0.5s for the table to load
  setTimeout(() => {
    // No TH should have the deprecated 'unselectable' attribute
    assert.equal($("#testTable").find("thead th[unselectable]").length, 0, "No th has unselectable attribute");

    // All 8 sortable TH elements should have aria-sort attribute
    $("#testTable").find("thead").each(function () {
      $(this).find("th").each(function () {
        if ($(this).attr("aria-sort") !== undefined)
          thfound++;
      });
    });
    assert.equal(thfound, 8, "Proper number of th's found");

    $("#testTable").find("tbody").each(function () {
      $(this).find("tr").each(function () {
        trfound++;
      });
    });
    assert.equal(trfound, 9, "Proper number of tr's found");

    // First row, first field should have ex_h as first value, if sort settings work
    assert.equal($("#testTable tbody tr:nth-child(1) td:nth-child(1)").text(), "9", "DESC text sorting works")

    done1();
  }, 500);
});
