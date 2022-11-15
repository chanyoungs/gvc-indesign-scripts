const doc = app.activeDocument
if (doc.saved) {
    const myPath = doc.fullName.parent.fsName.toString().replace(/\\/g, "/")
    eval(`#include '${myPath}/_scripts/_export.js'`)
} else {
    alert("Please save document first")
}
