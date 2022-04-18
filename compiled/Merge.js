var docTemplate = app.activeDocument;
var progress = function (steps) {
    var win = new Window("palette", "Progress", undefined, {
        closeButton: false
    });
    var text = win.add("statictext");
    text.preferredSize = [450, -1]; // 450 pixels wide, default height.
    var progressBar;
    if (steps) {
        progressBar = win.add("progressbar", undefined, 0, steps);
        progressBar.preferredSize = [450, -1]; // 450 pixels wide, default height.
    }
    progress.close = function () { return win.close(); };
    progress.increment = function () { return progressBar.value++; };
    progress.message = function (message) {
        text.text = message;
    };
    win.show();
};
var bulletins = ["Central-Kor", "Central-Eng", "Wimbledon-Kor"];
progress(bulletins.length * 2 + 1);
progress.message("Initialising...");
var docIDs = { template: docTemplate.id };
var myPath = docTemplate.fullName.parent.fsName.toString().replace(/\\/g, "/");
var dataMergeProperties = docTemplate.dataMergeProperties;
$.writeln(myPath);
$.writeln(docTemplate.name);
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
    docTemplate.dataMergeProperties.mergeRecords();
    progress.increment();
    var doc_1 = app.activeDocument;
    docIDs[bulletin] = doc_1.id;
    if (b === 0) {
        doc_1.spreads.itemByRange(2, -1).remove();
        doc_1.save(File("".concat(myPath, "/").concat(date, ".indd")));
        progress.increment();
    }
    else {
        doc_1.spreads
            .itemByRange(2 * b + 1, 2 * b)
            .move(LocationOptions.AT_END, app.documents.itemByID(docIDs[bulletins[0]]).spreads[-1]);
        doc_1.close(SaveOptions.NO);
        progress.increment();
    }
    app.activeDocument = app.documents.itemByID(docIDs["template"]);
}
app.activeDocument.close(SaveOptions.NO);
progress.increment();
progress.message("Saving: \"".concat(date, ".indd\""));
app.activeDocument.save(File("".concat(myPath, "/").concat(date, ".indd")));
progress.increment();
