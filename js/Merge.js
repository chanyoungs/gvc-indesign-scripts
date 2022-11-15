var doc = app.activeDocument;
if (doc.saved) {
    var myPath = doc.fullName.parent.fsName.toString().replace(/\\/g, "/");
    eval("#include '".concat(myPath, "/_scripts/Export.js'"));
}
else {
    alert("Please save document first");
}
