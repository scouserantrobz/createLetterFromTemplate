function onOpen(){
  // set up menu here
  const ui = DocumentApp.getUi()
  ui.createMenu("Letter Template")
    .addItem("Create Letter", "showDialog")
    .addToUi();
}
function t(){
  gsSetSP( "autoIncNumber", (Number(11)+1).toFixed() )
}
function showDialog(){
  const html = HtmlService.createTemplateFromFile('dialog').evaluate();
  var dialog = HtmlService.createHtmlOutput( html )
    .setWidth(640)
    .setHeight(480);
  DocumentApp.getUi()
    .showModelessDialog(dialog, 'Create Personalised Letter Based on This Document...');
}
function include(filename) {
  return HtmlService.createTemplateFromFile(filename).evaluate().getContent();
}
function gsGetInputs( sheetId ){
  const t = HtmlService.createTemplateFromFile( "inputs" )
  t.data = getData( sheetId )
  return t.evaluate().getContent()
}
function getData( sheetId ){
  const ss = SpreadsheetApp.openById( sheetId )
  const sh = ss.getSheetByName( "config" )
  const data = sh.getRange("A3").getDataRegion().getDisplayValues()
  const dt = new Date()
  const today = getTodaysDate(dt)
  const timeNow = new Intl.DateTimeFormat( 'en-GB', { timeStyle: "medium" } ).format( dt )
  for( let iR = 0; iR < data.length; iR++ ) {
    Logger.log( `${iR}  ${data[iR][0]}`)
    if ( data[iR][4] === "{{DATE}}" ){
      data[iR][4] = today
    } else if ( data[iR][4] === "{{TIME}}" ){
      data[iR][4] = timeNow
    } else if ( data[iR][4] === "{{AUTOINC}}" ){
      data[iR][4] = gsGetAutoIncNumber()
    } else if ( data[iR][4] === "{{MONTHNUM}}" ){
      data[iR][4] = dt.getMonth() + 1
    } else if ( data[iR][4] === "{{MONTHNAMELONG}}" ){
      data[iR][4] = dt.toLocaleDateString("en-GB", { month: 'long' })
    } else if ( data[iR][4] === "{{MONTHNAMESHORT}}" ){
      data[iR][4] = dt.toLocaleDateString("en-GB", { month: 'short' })
    } else if ( data[iR][4] === "{{DAYNUM}}" ){
      data[iR][4] = dt.getDate()
    } else if ( data[iR][4] === "{{DAYNAMELONG}}" ){
      data[iR][4] = dt.toLocaleDateString("en-GB", { weekday: 'long' });
    } else if ( data[iR][4] === "{{DAYNAMESHORT}}" ){
      data[iR][4] = dt.toLocaleDateString("en-GB", { weekday: 'short' });
    }    
    if ( data[iR][5] == "Required" ) { 
      data[iR][3] = data[iR][3] + "&nbsp;*" 
    }
    if ( data[iR][0] === "Drop down list" ){
      data[iR].push( data[iR][4] === "" ? "" : "selected")
    }
  }
  return data
}
function gsCreateLetter( letterData, opts ){
  try{
    // create a copy of this document
    const templateId = DocumentApp.getActiveDocument().getId()
    const docId = DriveApp.getFileById( templateId ).makeCopy( opts.docName ).getId();
    const newDoc = DocumentApp.openById( docId )
    // increment auto counter if it's set
    if ( letterData["{{AUTOINC}}"] !== "" ) {
      gsSetSP( "autoIncNumber", (Number(letterData["{{AUTOINC}}"])+1).toFixed() )
    }
    // loop through letterData and make replacements
    let bodyText = newDoc.getBody();
    for (const [ phKey, phValue] of Object.entries( letterData )) {
      console.log(`${phKey}: ${phValue}`);
      if ( opts.replacePh === "replace" || phValue !== "" ){
        bodyText.replaceText( phKey, phValue )
      }
  }
  // return document ID
  return docId
  } catch(e){
    Logger.log("Sorry, there was an error creating the new document..." + e.message)
    return "Sorry, there was an error creating the new document.."
  }
}
function getTodaysDate( dt ){
  const formattedDt = new Intl.DateTimeFormat( 'en-GB', 
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }
  ).format( dt );
  const d = dt.getDay()
  const nth = (d > 3 && d < 21) ? 'th': d % 10 === 1 ? "st" : d % 10 == 2 ? "nd" : d % 10 === 3 ? "rd" : "th"
  const dtParts = formattedDt.split(" ");
  const letterDate = dtParts[0] + nth + " " + dtParts[1] + ", " + dtParts[2];
  return letterDate
}
function logAllSPs(){
  const scriptProps = PropertiesService.getScriptProperties().getProperties()
  for ( let k in scriptProps ) {
    Logger.log('Key: %s, Value: %s', k, scriptProps[k]);
  }
}
function gsGetSheetId(){
  return PropertiesService.getScriptProperties().getProperty( "configSheetId" )
}
function gsGetAutoIncNumber(){
  return PropertiesService.getScriptProperties().getProperty( "autoIncNumber" )
}
function deleteAllSPs(){
  PropertiesService.getScriptProperties().deleteAllProperties()
}
function gsSetSP( propName, propValue ){
  const scriptProps = PropertiesService.getScriptProperties()
  scriptProps.setProperty( propName, propValue )
}
function gsSetSheet( sheetId ){
  // does sheet with given Id exist?
  let ssConfig, shConfig
  try{
    ssConfig = SpreadsheetApp.openById( sheetId )
  } catch(e){
    return "Sorry, we can't find a spreadsheet with that ID #"
  }
  // open sheet
  try{
    shConfig = ssConfig.getSheetByName("config")
    Logger.log( shConfig.getName())
  } catch(e){
    return "Sorry, there's no config sheet in that spreadsheet."
  }
  // is sheet in correct format
  const headers = ["Type of Input","Select Group Name","Enter Select Options","Dialog Text","Default"]
  const data = shConfig.getRange("A1:E1").getDisplayValues()[0]
  Logger.log( data )
  const incorrectFormat = data.some( (header, iH) => header !== headers[iH] )
  if ( incorrectFormat ){
    return "Sorry, the config sheet is not in the correct format to use with this script."
  }
  // set sheetId as script property
  gsSetSP( "configSheetId", sheetId )
  return "set"
}
