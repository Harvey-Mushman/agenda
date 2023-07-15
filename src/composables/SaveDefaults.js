//import defaults from '../store/defaults.json'

export default function SaveDefaults(){

    function saveDefaults(){

        console.log(this.$defaults)

        let tData = JSON.parse(JSON.stringify(this.store.state.defaults))
        // only update following two objects
        tData.ncDescription = this.store.state.defaults.ncDescription
        tData.ncMembers = this.store.state.defaults.ncMembers
        tData.ncCommittees = this.store.state.defaults.ncCommittees

        // tData.ncMembers = this.store.state.oData.members
        // tData.ncCommittees = this.store.state.oData.committees

        // convert json into text string
        // var target = JSON.stringify(Object.assign({}, _this.oData.agenda))
        var target = JSON.stringify(Object.assign({}, tData))
        // Convert the text string to BLOB.
        const textToBLOB = new Blob([target], { type: 'text/plain' });
        // set the output fileName to save
        const sFileName = '_defaults_' + this.$moment().format('YYYYMMDD-HHmmss')  +'.json';
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
        this.$defaults = tData
        this.store.state.LoadDefaults()
        console.log('defaults saved')
    }
    return{saveDefaults}
    // export default function SaveDefaults(saveMe)
}