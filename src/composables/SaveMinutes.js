const SaveMinutes = (_this, suffix) => {
    
    // get committee name for filename
    let lcCommittee=''
    for(var i=0; i<_this.store.state.oData.committees.length; i++){
        if(_this.store.state.oData.committees[i].name == _this.store.state.oData.agenda.body){
            lcCommittee = _this.store.state.oData.committees[i].shortName
            break
        }
    }
    // before saving the value of isAgenda must be false to ensure output titling
    _this.store.state.oData.agenda.isAgenda=false
    // convert json into text string
    // var target = JSON.stringify(Object.assign({}, _this.oData.agenda))
    var target = JSON.stringify(Object.assign({}, _this.store.state.oData.agenda))
    // Convert the text string to BLOB.
    const textToBLOB = new Blob([target], { type: 'text/plain' });
    // set the output fileName to save
    const sFileName = 'Minutes_' + lcCommittee +'_'+suffix+'_' + _this.$moment().format('YYYYMMDD-HHmmss')  +'.json';
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
    console.log('minutes' +suffix+ ' saved')
}

export default SaveMinutes

