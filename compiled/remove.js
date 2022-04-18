var docTemplate = app.activeDocument;
var dataMergeFields = docTemplate.dataMergeProperties.dataMergeFields;
var dataMergeTextPlaceholders = docTemplate.dataMergeTextPlaceholders;
var dataMergeFieldsObj = {};
for (var d = 0; d < dataMergeFields.length; d++) {
    var dataMergeField = dataMergeFields[d];
    dataMergeFieldsObj[dataMergeField.fieldName] = dataMergeField;
}
docTemplate.hyperlinkTextSources.everyItem().remove();
var regExFieldName = "[\\w\\s\\uac00-\\ud7a3]+";
// // Replace angled to starred placeholders
// app.findGrepPreferences = app.changeGrepPreferences = null
// app.findChangeGrepOptions = NothingEnum.nothing
// app.findGrepPreferences.findWhat = `<<(${regExFieldName})>>`
// app.changeGrepPreferences.changeTo = "\\*\\*$1\\*\\*"
// doc.changeGrep()
var angledPattern = /<<([\w\s\uac00-\ud7a3]+)>>/;
var starredPattern = /\*\*([\w\s\uac00-\ud7a3]+)\*\*/;
var replacePlaceholders = function (text) {
    var placeholderKeys = [];
    var match;
    while ((match = text.contents.match(angledPattern)) !== null) {
        var oldText = text.contents;
        var placeholder = match[0];
        var fieldName = match[1];
        placeholderKeys.push({
            offset: oldText.search(angledPattern),
            fieldName: fieldName
        });
        text.contents = oldText.replace(placeholder, "**".concat(fieldName, "**"));
    }
    return placeholderKeys;
};
var addPlaceholders = function (textFrame, placeholderKeys) {
    for (var i = placeholderKeys.length - 1; i >= 0; i--) {
        var key = placeholderKeys[i].fieldName;
        docTemplate.dataMergeTextPlaceholders.add(textFrame.parentStory, placeholderKeys[i].offset, dataMergeFieldsObj[key], {});
    }
};
for (var p = 0; p < docTemplate.pages.length; p++) {
    var page = docTemplate.pages[p];
    for (var t_1 = 0; t_1 < page.textFrames.length; t_1++) {
        var textFrame = page.textFrames[t_1];
        var text = textFrame.texts[0];
        addPlaceholders(textFrame, replacePlaceholders(text));
    }
}
// Remove starred placeholders
app.findGrepPreferences = app.changeGrepPreferences = null;
app.findChangeGrepOptions = NothingEnum.nothing;
app.findGrepPreferences.findWhat = "\\*\\*".concat(regExFieldName, "\\*\\*");
app.changeGrepPreferences.changeTo = "";
docTemplate.changeGrep();
