//@include "_utils.js"
if (doc.saved) {
    progress(bulletins.length * 2 + 1);
    progress.message("Initialising...");
    var docIDs = { template: doc.id };
    var dataMergeProperties = doc.dataMergeProperties;
    $.writeln(myPath);
    $.writeln(doc.name);
    var t = new Date();
    t.setDate(t.getDate() - t.getDay() + 7);
    var yy = String(t.getFullYear() % 100);
    var mm = String(t.getMonth() + 1);
    var dd = String(t.getDate());
    var yymmdd = [yy, mm, dd];
    for (var i = 0; i < yymmdd.length; i++) {
        if (yymmdd[i].length == 1)
            yymmdd[i] = "0" + yymmdd[i];
    }
    var date = "".concat(yymmdd[0], ".").concat(yymmdd[1], ".").concat(yymmdd[2]);
    $.writeln(date);
    for (var b = 0; b < bulletins.length; b++) {
        progress.message("Merging: (".concat(b + 1, "/").concat(bulletins.length, ")"));
        var bulletin = bulletins[b];
        dataMergeProperties.selectDataSource(File("".concat(myPath, "/Indesign-").concat(bulletin, ".txt")));
        dataMergeProperties.mergeRecords();
        progress.increment();
        var docTemp = app.activeDocument;
        docIDs[bulletin] = docTemp.id;
        if (b === 0) {
            ;
            docTemp.spreads.itemByRange(2, -1).remove();
            docTemp.save(File("".concat(myPath, "/").concat(date, ".indd")));
            progress.increment();
        }
        else {
            ;
            docTemp.spreads.itemByRange(2 * b + 1, 2 * b).move(LocationOptions.AT_END, app.documents.itemByID(docIDs[bulletins[0]]).spreads[-1]);
            docTemp.close(SaveOptions.NO);
            progress.increment();
        }
        app.activeDocument = app.documents.itemByID(docIDs["template"]);
        progress.increment();
    }
    app.activeDocument.close(SaveOptions.NO);
    progress.message("Saving: \"".concat(date, ".indd\""));
    app.activeDocument.save(File("".concat(myPath, "/").concat(date, ".indd")));
    progress.increment();
}
