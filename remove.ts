var docTemplate = app.activeDocument
var dataMergeFields = docTemplate.dataMergeProperties.dataMergeFields
var dataMergeTextPlaceholders = docTemplate.dataMergeTextPlaceholders

var dataMergeFieldsObj = {}
for (let d = 0; d < dataMergeFields.length; d++) {
    const dataMergeField = dataMergeFields[d]
    dataMergeFieldsObj[dataMergeField.fieldName] = dataMergeField
}

docTemplate.hyperlinkTextSources.everyItem().remove()

var regExFieldName = "[\\w\\s\\uac00-\\ud7a3]+"

// // Replace angled to starred placeholders
// app.findGrepPreferences = app.changeGrepPreferences = null
// app.findChangeGrepOptions = NothingEnum.nothing
// app.findGrepPreferences.findWhat = `<<(${regExFieldName})>>`
// app.changeGrepPreferences.changeTo = "\\*\\*$1\\*\\*"
// doc.changeGrep()

var angledPattern = /<<([\w\s\uac00-\ud7a3]+)>>/
var starredPattern = /\*\*([\w\s\uac00-\ud7a3]+)\*\*/

type PlaceholderKeysType = { offset: number; fieldName: string }[]

const replacePlaceholders = (text: Text): PlaceholderKeysType => {
    const placeholderKeys: PlaceholderKeysType = []
    let match
    while ((match = (text.contents as string).match(angledPattern)) !== null) {
        const oldText = text.contents as string
        const placeholder = match[0]
        const fieldName = match[1]
        placeholderKeys.push({
            offset: oldText.search(angledPattern),
            fieldName,
        })
        text.contents = oldText.replace(placeholder, `**${fieldName}**`)
    }
    return placeholderKeys
}

const addPlaceholders = (
    textFrame: TextFrame,
    placeholderKeys: PlaceholderKeysType
) => {
    for (let i = placeholderKeys.length - 1; i >= 0; i--) {
        var key = placeholderKeys[i].fieldName
        docTemplate.dataMergeTextPlaceholders.add(
            textFrame.parentStory,
            placeholderKeys[i].offset,
            dataMergeFieldsObj[key],
            {}
        )
    }
}

for (let p = 0; p < docTemplate.pages.length; p++) {
    let page = docTemplate.pages[p]
    for (let t = 0; t < page.textFrames.length; t++) {
        let textFrame = page.textFrames[t]
        var text = textFrame.texts[0]
        addPlaceholders(textFrame, replacePlaceholders(text))
    }
}

// Remove starred placeholders
app.findGrepPreferences = app.changeGrepPreferences = null
app.findChangeGrepOptions = NothingEnum.nothing
app.findGrepPreferences.findWhat = `\\*\\*${regExFieldName}\\*\\*`
app.changeGrepPreferences.changeTo = ""
docTemplate.changeGrep()
