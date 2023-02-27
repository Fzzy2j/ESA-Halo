const fs = require('fs')

var state = {}

if (fs.existsSync('./state.json')) {
  state = JSON.parse(fs.readFileSync("./state.json"))
}

module.exports = nodecg => {
  function sendDataUpdate(ignoreId) {
    state.socketId = ignoreId
    nodecg.sendMessage('OnevsOneUpdate', state)
    delete state.socketId
  }
  nodecg.listenFor('OnevsOneStateRequest', (id) => {
    sendDataUpdate(id)
  });
  nodecg.listenFor('UpdateOnevsOneData', (value) => {
    for (key in value) {
      state[key] = value[key]
    }
    sendDataUpdate(state.socketId)
    delete state.socketId
    const jsonString = JSON.stringify(state)
    fs.writeFile('./OnevsOneState.json', jsonString, err => {
      if (err) {
        console.log('Error writing file', err)
      } else {
      }
    })
  })
};