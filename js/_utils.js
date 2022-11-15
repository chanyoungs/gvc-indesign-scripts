var doc = app.activeDocument;
if (doc.saved) {
    var myPath = doc.fullName.parent.fsName.toString().replace(/\\/g, "/");
    var progress_1 = function (steps) {
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
        progress_1.close = function () { return win.close(); };
        progress_1.increment = function () { return progressBar.value++; };
        progress_1.message = function (message) {
            text.text = message;
        };
        win.show();
    };
    var bulletins = [
        "Central-Kor",
        "Central-Eng",
        "Wimbledon-Kor",
        "Wimbledon-Eng",
    ];
}
else {
    alert("Please save document first");
}
