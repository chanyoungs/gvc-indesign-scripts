//@include "Utils.js"

progress(bulletins.length * (1 + 3))
progress.message("Initialising...")

const getNameWithoutExtension = (doc: Document) => {
    const fullName = doc.name
    const finalDotPosition = fullName.lastIndexOf(".")
    return finalDotPosition > -1
        ? fullName.substr(0, finalDotPosition)
        : fullName
}

const pdfExfortPreset = app.pdfExportPresets.add({})

// Export Web PDFs
pdfExfortPreset.exportReaderSpreads = false
for (let b = 0; b < bulletins.length; b++) {
    progress.message(`Exporting Web PDFs: (${b + 1}/${bulletins.length})`)
    app.pdfExportPreferences.pageRange = `${b * 4 + 1}-${b * 4 + 4}`
    doc.exportFile(
        ExportFormat.PDF_TYPE,
        File(
            `${myPath}/${getNameWithoutExtension(doc)}-Web-${bulletins[b]}.pdf`
        ),
        false,
        pdfExfortPreset
    )
    progress.increment()
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
    progress.message(`Exporting Print PDFs: (${b + 1}/${bulletins.length})`)
    flipSpread(b * 4)
    progress.increment()

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
    progress.increment()

    flipSpread(b * 4)
    progress.increment()
}
