import { ref } from 'vue'

const loadFile = () => {

    let oJson = ref({})

    const getFile = (oEvent,oData) => {

        const input = oEvent.target
        
        if ('files' in input && input.files.length > 0) {
            placeFileContent(oData,input.files[0])
        }
        function placeFileContent(oData, file) {
            var fileName = file.name;
            readFileContent(file).then(content => {
              //   target = content
              if (fileName.length < 5 || fileName.substr(fileName.length - 4, 4).toLowerCase() == 'json') {
                // process saved agenda
                oJson.Data = JSON.parse(content);
                // var items = oJson.agenda.agendaItems;
    
                // items.sort(function (a, b) {
                //   return a.itemIndex - b.itemIndex;
                // });

              } else {
                alert('data file error, JSON required ==> ' + fileName);
              }
    
            }).catch(error => console.log(error))

          }
    
          function readFileContent(file) {
            const reader = new FileReader()
            return new Promise((resolve, reject) => {
              reader.onload = event => resolve(event.target.result)
              reader.onerror = error => reject(error)
              reader.readAsText(file)
            })
          }
      

    }
  
    return { getFile, oJson:oJson.Data }

}
export default loadFile


