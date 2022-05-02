//@include "_utils.js"
progress(bulletins.length * (1 + 3));
progress.message("Initialising...");
var getNameWithoutExtension = function (doc) {
    var fullName = doc.name;
    var finalDotPosition = fullName.lastIndexOf(".");
    return finalDotPosition > -1
        ? fullName.substr(0, finalDotPosition)
        : fullName;
};
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
