
QUnit.test("basic test", (assert) => {
  const done1 = assert.async();
  let thfound = 0, trfound = 0;

  $("#testTable").slimtable({
    dataUrl: "test.json"
  });

  // Wait 0.5s for the table to load
  setTimeout(() => {
    $("#testTable").find("thead").each(function () {
      $(this).find("th").each(function () {
        if ($(this).attr("unselectable") === "on")
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

    done1();
  }, 500);
});
