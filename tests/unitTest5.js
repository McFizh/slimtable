QUnit.test("Date column sorting (regression test)", (assert) => {
  $("#testTable").slimtable({});

  // --- ASC sort (first click) ---
  $("#testTable thead th:nth-child(3)").trigger("click");

  const dateCol = (n) =>
    $("#testTable tbody tr:nth-child(" + n + ") td:nth-child(3)").text();

  // Row 1: Dec 1 2019 is the earliest date
  assert.equal(dateCol(1), "01-12-2019", "ASC row 1: Dec 1 2019 is earliest");

  // Row 2: Jan 1 2020 follows Dec 1 2019
  assert.equal(dateCol(2), "01-01-2020", "ASC row 2: Jan 1 2020");

  // Rows 3+4: Jan 31 must precede Feb 1 — this is what the bug broke
  assert.equal(dateCol(3), "31-01-2020", "ASC row 3: Jan 31 precedes Feb 1");
  assert.equal(dateCol(4), "01-02-2020", "ASC row 4: Feb 1 follows Jan 31");

  // Row 5: Jun 15 2020 is the latest date
  assert.equal(dateCol(5), "15-06-2020", "ASC row 5: Jun 15 2020 is latest");

  // --- DESC sort (second click) ---
  $("#testTable thead th:nth-child(3)").trigger("click");

  // Rows 2+3 are the mirror of the bug: Feb 1 must precede Jan 31 in DESC
  assert.equal(dateCol(2), "01-02-2020", "DESC row 2: Feb 1 precedes Jan 31");
  assert.equal(dateCol(3), "31-01-2020", "DESC row 3: Jan 31 follows Feb 1");
});
