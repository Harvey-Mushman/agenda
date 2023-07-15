const SaveAgenda = (_this) => {

    // get committee name for filename
    let lcCommittee=''
    for(var i=0; i<_this.store.state.oData.committees.length; i++){
        if(_this.store.state.oData.committees[i].name == _this.store.state.oData.agenda.body){
            lcCommittee = _this.store.state.oData.committees[i].shortName
            break
        }
    }
    // before saving the value of isAgenda must be true to ensure output titling
    _this.store.state.oData.agenda.isAgenda=true
    // convert json into text string
    // var target = JSON.stringify(Object.assign({}, _this.oData.agenda))
    var target = JSON.stringify(Object.assign({}, _this.store.state.oData.agenda))

    // filter string properties to strip out unicode
    // line and paragraph seperators U+2028, U+2029 with "\u2028", "\u2029"
    // the filter is: <string>.replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
    let regXLine = /\u2028/gi
    let regXParagraph = /\u2029/gi
    for(var i=0; i<_this.store.state.oData.agenda.agendaItems.length; i++){
        let oItem = _this.store.state.oData.agenda.agendaItems[i]
        // title
        oItem.title = oItem.title.replace(regXLine, "\r").replace(regXParagraph, "\n")
        if([5,6,7].includes(oItem.itemFmt)){
            // item description in paragraph property
            oItem.itemData.paragraph = oItem.itemData.paragraph.replace(regXLine, "\r").replace(regXParagraph, "\n")
            if([6,7].includes(oItem.itemFmt)){
                // item includes motion or alternate motion that has body property
                for(var j=0; j<oItem.itemData.motion.length; j++){
                    // bug if motion is undefuined causes error
                    if(!oItem.itemData.motion[j].body==undefined){
                        oItem.itemData.motion[j].body = oItem.itemData.motion[j].body.replace(regXLine, "\r").replace(regXParagraph, "\n")
                    }
                }
            }
        }
    }


    // Convert the text string to BLOB.
    const textToBLOB = new Blob([target], { type: 'text/plain' });
    // set the output fileName to save
    const sFileName = 'Agenda_' + lcCommittee +'_' + _this.$moment().format('YYYYMMDD-HHmmss')  +'.json';
    // create a dummy anchor element
    let oTempAnchor = document.createElement("a");
    oTempAnchor.download = sFileName;
    if (window.webkitURL != null) {
         oTempAnchor.href = window.webkitURL.createObjectURL(textToBLOB);
    }
    else {
         oTempAnchor.href = window.URL.createObjectURL(textToBLOB);
         oTempAnchor.style.display = "none";
         document.body.appendChild(oTempAnchor);
    }
    // invoke the click event on the anchor element to write the file
    oTempAnchor.click();
    // end save file
    console.log('agenda saved')
}

export default SaveAgenda

