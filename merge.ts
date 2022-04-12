var docTemplate = app.activeDocument
const progress = (steps: number) => {
    const win = new Window("palette", "Progress", undefined, {
        closeButton: false,
    })
    let text = win.add("statictext")
    text.preferredSize = [450, -1] // 450 pixels wide, default height.

    let progressBar
    if (steps) {
        progressBar = win.add("progressbar", undefined, 0, steps)
        progressBar.preferredSize = [450, -1] // 450 pixels wide, default height.
    }

    progress.close = () => win.close()
    progress.increment = () => progressBar.value++
    progress.message = (message) => {
        text.text = message
    }
    win.show()
}

var bulletins = ["Central-Kor", "Central-Eng", "Wimbledon-Kor"]
progress(bulletins.length * 2 + 1)
progress.message("Initialising...")

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

for (let b = 0; b < bulletins.length; b++) {
    progress.message(`Merging: (${b + 1}/${bulletins.length})`)

    const bulletin = bulletins[b]
    dataMergeProperties.selectDataSource(
        File(`${myPath}/Indesign-${bulletin}.txt`)
    )
    docTemplate.dataMergeProperties.mergeRecords()
    progress.increment()

    let doc = app.activeDocument
    docIDs[bulletin] = doc.id

    if (b === 0) {
        doc.spreads.itemByRange(2, -1).remove()
        doc.save(File(`${myPath}/${date}.indd`))
        progress.increment()
    } else {
        doc.spreads
            .itemByRange(2 * b + 1, 2 * b)
            .move(
                LocationOptions.AT_END,
                app.documents.itemByID(docIDs[bulletins[0]]).spreads[-1]
            )
        doc.close(SaveOptions.NO)
        progress.increment()
    }

    app.activeDocument = app.documents.itemByID(docIDs["template"])
}

app.activeDocument.close(SaveOptions.NO)
progress.increment()

progress.message(`Saving: "${date}.indd"`)
app.activeDocument.save(File(`${myPath}/${date}.indd`))
progress.increment()
