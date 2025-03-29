const WebSocket = require('ws')

let websocket = new WebSocket('ws:/localhost:4000/wsserver')
websocket.onopen = () => {
    console.log('Websocket open');
    
    let n = 0
    //let sendStr = `10-02-client: ${n}`
    let intervalId = setInterval(() => {
        websocket.send(`10-02-client: ${++n}`)
    }, 3000)
    setTimeout(() => {
        clearInterval(intervalId)
        websocket.close()
    }, 25000)
}
websocket.onclose = () => {
    console.log('Web socket close');
}
websocket.onmessage = (msg) => {
    console.log(`Web socket message: ${msg.data}`);
}
websocket.onerror = (err) => {
    console.log(`Web socket error: ${err}`);
}
