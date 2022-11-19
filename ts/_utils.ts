const doc = app.activeDocument
let progress: any
if (doc.saved) {
    const myPath = doc.fullName.parent.fsName.toString().replace(/\\/g, "/")

    progress = (steps: number) => {
        const win = new (Window as any)("palette", "Progress", undefined, {
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

    const bulletins = [
        "Central-Kor",
        "Central-Eng",
        "Wimbledon-Kor",
        "Wimbledon-Eng",
    ]
} else {
    alert("Please save document first")
}
