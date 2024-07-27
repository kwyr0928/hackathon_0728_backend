// WebSocket通信 ハンドラー


// モジュールインポート
const express = require('express')
const expressws = require('express-ws')
// const websocket = require('./websocket')

// ルーティング定義
const router = express.Router()
expressws(router)

// WebSocket接続
router.ws('/test', (ws, req) => {
    ws.send('接続成功')
    console.log('接続成功');
    let interval
    interval = setInterval(() => {
        if (ws.readyState === ws.OPEN) {
            console.log('test')
            ws.send(Math.random().toFixed(2))
            ws.send('test')
        } else {
            clearInterval(interval)
        }
    }, 1000)

    ws.on('message', msg => {
        ws.send(msg)
        console.log(msg)
    })
})

module.exports = router;
