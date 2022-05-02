//@include "Utils.js"

progress(bulletins.length * 2 + 1)
progress.message("Initialising...")

const docIDs = { template: doc.id }

var dataMergeProperties = doc.dataMergeProperties as any

$.writeln(myPath)
$.writeln(doc.name)

var t = new Date()
t.setDate(t.getDate() - t.getDay() + 7)

var yy = String(t.getFullYear() % 100)
var mm = String(t.getMonth() + 1)
var dd = String(t.getDate())

var yymmdd = [yy, mm, dd]

for (let i = 0; i < yymmdd.length; i++) {
    if (yymmdd[i].length == 1) yymmdd[i] = "0" + yymmdd[i]
}

var date = `${yymmdd[0]}.${yymmdd[1]}.${yymmdd[2]}`
$.writeln(date)

for (let b = 0; b < bulletins.length; b++) {
    progress.message(`Merging: (${b + 1}/${bulletins.length})`)

    const bulletin = bulletins[b]
    dataMergeProperties.selectDataSource(
        File(`${myPath}/Indesign-${bulletin}.txt`)
    )
    dataMergeProperties.mergeRecords()
    progress.increment()

    const docTemp = app.activeDocument
    docIDs[bulletin] = docTemp.id

    if (b === 0) {
        ;(docTemp.spreads.itemByRange(2, -1) as any).remove()
        docTemp.save(File(`${myPath}/${date}.indd`))
        progress.increment()
    } else {
        ;(docTemp.spreads.itemByRange(2 * b + 1, 2 * b) as any).move(
            LocationOptions.AT_END,
            app.documents.itemByID(docIDs[bulletins[0]]).spreads[-1]
        )
        docTemp.close(SaveOptions.NO)
        progress.increment()
    }

    app.activeDocument = app.documents.itemByID(docIDs["template"])
    progress.increment()
}

app.activeDocument.close(SaveOptions.NO)
progress.message(`Saving: "${date}.indd"`)
app.activeDocument.save(File(`${myPath}/${date}.indd`))
progress.increment()
