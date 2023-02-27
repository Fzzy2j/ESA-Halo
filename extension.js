const fs = require('fs')

var state = {}

if (fs.existsSync(__dirname + '/state.json')) {
  state = JSON.parse(fs.readFileSync(__dirname + "/state.json"))
}

module.exports = nodecg => {
  function sendDataUpdate(ignoreId) {
    state.socketId = ignoreId
    nodecg.sendMessage('StateUpdate', state)
    delete state.socketId
  }
  nodecg.listenFor('StateRequest', (id) => {
    sendDataUpdate(id)
  });
  nodecg.listenFor('UpdateStateData', (value) => {
    for (key in value) {
      state[key] = value[key]
    }
    sendDataUpdate(state.socketId)
    delete state.socketId
    const jsonString = JSON.stringify(state)
    fs.writeFile(__dirname + '/state.json', jsonString, err => {
      if (err) {
        console.log('Error writing file', err)
      } else {
      }
    })
  })
};