'/// <reference types="types-for-adobe/Illustrator/2015.3"/>\nalert(String(app));\n';

const doc = app.activeDocument;
doc.dataMergeProperties.dataMergeFields.firstItem().fieldName;
$.writeln("Hello My name is Chan");
// alert(String(doc.dataMergeTextPlaceholders.firstItem().field));
