var doc = app.activeDocument

const getNameWithoutExtension = (doc: Document) => {
    const fullName = doc.name
    const finalDotPosition = fullName.lastIndexOf(".")
    return finalDotPosition > -1
        ? fullName.substr(0, finalDotPosition)
        : fullName
}

var myPath = doc.fullName.parent.fsName.toString().replace(/\\/g, "/")
var pdfExfortPreset = app.pdfExportPresets.add({})
var bulletins = ["Central-Kor", "Central-Eng", "Wimbledon-Eng"]

// Export Web view
pdfExfortPreset.exportReaderSpreads = false
for (let b = 0; b < bulletins.length; b++) {
    app.pdfExportPreferences.pageRange = `${b * 4 + 1}-${b * 4 + 4}`
    doc.exportFile(
        ExportFormat.PDF_TYPE,
        File(
            `${myPath}/${getNameWithoutExtension(doc)}-Web-${bulletins[b]}.pdf`
        ),
        false,
        pdfExfortPreset
    )
}

// // Export Print view
pdfExfortPreset.exportReaderSpreads = true

const flipSpread = (leftPageIndex: number) => {
    doc.pages[leftPageIndex].move(
        LocationOptions.AFTER,
        doc.pages[leftPageIndex + 1],
        BindingOptions.RIGHT_ALIGN
    )
    doc.pages[leftPageIndex].move(
        LocationOptions.BEFORE,
        doc.pages[leftPageIndex],
        BindingOptions.LEFT_ALIGN
    )
}

for (let b = 0; b < bulletins.length; b++) {
    flipSpread(b * 4)
    app.pdfExportPreferences.pageRange = `${b * 4 + 1}-${b * 4 + 4}`
    doc.exportFile(
        ExportFormat.PDF_TYPE,
        File(
            `${myPath}/${getNameWithoutExtension(doc)}-Print-${
                bulletins[b]
            }.pdf`
        ),
        false,
        pdfExfortPreset
    )
    flipSpread(b * 4)
}
