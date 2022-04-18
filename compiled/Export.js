var doc = app.activeDocument;
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
progress(bulletins.length * (1 + 3));
progress.message("Initialising...");
var getNameWithoutExtension = function (doc) {
    var fullName = doc.name;
    var finalDotPosition = fullName.lastIndexOf(".");
    return finalDotPosition > -1
        ? fullName.substr(0, finalDotPosition)
        : fullName;
};
var myPath = doc.fullName.parent.fsName.toString().replace(/\\/g, "/");
var pdfExfortPreset = app.pdfExportPresets.add({});
// Export Web PDFs
pdfExfortPreset.exportReaderSpreads = false;
for (var b = 0; b < bulletins.length; b++) {
    progress.message("Exporting Web PDFs: (".concat(b + 1, "/").concat(bulletins.length, ")"));
    app.pdfExportPreferences.pageRange = "".concat(b * 4 + 1, "-").concat(b * 4 + 4);
    doc.exportFile(ExportFormat.PDF_TYPE, File("".concat(myPath, "/").concat(getNameWithoutExtension(doc), "-Web-").concat(bulletins[b], ".pdf")), false, pdfExfortPreset);
    progress.increment();
}
// // Export Print view
pdfExfortPreset.exportReaderSpreads = true;
var flipSpread = function (leftPageIndex) {
    doc.pages[leftPageIndex].move(LocationOptions.AFTER, doc.pages[leftPageIndex + 1], BindingOptions.RIGHT_ALIGN);
    doc.pages[leftPageIndex].move(LocationOptions.BEFORE, doc.pages[leftPageIndex], BindingOptions.LEFT_ALIGN);
};
for (var b = 0; b < bulletins.length; b++) {
    progress.message("Exporting Print PDFs: (".concat(b + 1, "/").concat(bulletins.length, ")"));
    flipSpread(b * 4);
    progress.increment();
    app.pdfExportPreferences.pageRange = "".concat(b * 4 + 1, "-").concat(b * 4 + 4);
    doc.exportFile(ExportFormat.PDF_TYPE, File("".concat(myPath, "/").concat(getNameWithoutExtension(doc), "-Print-").concat(bulletins[b], ".pdf")), false, pdfExfortPreset);
    progress.increment();
    flipSpread(b * 4);
    progress.increment();
}
