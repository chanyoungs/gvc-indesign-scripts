var docTemplate = app.activeDocument
var docIDs = { template: docTemplate.id }

var myPath = docTemplate.fullName.parent.fsName.toString().replace(/\\/g, "/")

var dataMergeProperties = docTemplate.dataMergeProperties

$.writeln(myPath)
$.writeln(docTemplate.name)

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

var bulletins = ["ck", "ce", "wk"]

for (let b = 0; b < bulletins.length; b++) {
    const bulletin = bulletins[b]
    dataMergeProperties.selectDataSource(
        File(`${myPath}/Indesign_${bulletin}.txt`)
    )
    docTemplate.dataMergeProperties.mergeRecords()

    let doc = app.activeDocument
    docIDs[bulletin] = doc.id

    if (b === 0) {
        doc.spreads.itemByRange(2, -1).remove()
        doc.save(File(`${myPath}/${date}.indd`))
    } else {
        doc.spreads
            .itemByRange(2 * b + 1, 2 * b)
            .move(
                LocationOptions.AT_END,
                app.documents.itemByID(docIDs[bulletins[0]]).spreads[-1]
            )
        doc.close(SaveOptions.NO)
    }

    app.activeDocument = app.documents.itemByID(docIDs["template"])
}

app.activeDocument.close(SaveOptions.NO)

app.activeDocument.save(File(`${myPath}/${date}.indd`))
