// WebSocket通信 ハンドラー
//require('dotenv').config(); // 環境変数

// モジュールインポート
const express = require('express')
const expressws = require('express-ws')(app)
const { getUserData, getAllUser, getState } = require('./server');

// クライアント(参加者)
const clients = new Map();// ユーザIDと接続を結び付ける 

// WebSocket接続
app.ws('/ws', function (ws, req) {
    console.log("")

    // 接続が切れたら
    ws.on('close', function () {

    })
})


// WebSocketエンドポイント定義
// 入室 (配列格納後)  入室者の情報をみんなに通知
app.post('/ws/enter/:sertNum', (req, res) => {
    // sertNumが範囲外の時、not found
    if (isNaN(seatNum) | seatNum < 0 || crients.size < seatNum) return res.status(404).json({ message: 'data not found' });

    clients.set(we, getUserData(req.params.seatNum)[1]); // クライアント登録

    clients.forEach(client => { // 全員に通知
        // MEMO: client.Key() == ws
        if (client.Key().readyState === ws.OPEN) { // クライアントの接続が続いていたら
            res.status(200).json(getUserName(req.params.seatNum)); // 入室者のユーザ情報
        }
    })
    console.log("入室したよ")
});


// 退室　退室した人の席を埋めるようみんなに通知
app.delete('/ws/leave/:sertNum', (req, res) => {
    // sertNumが範囲外の時、not found
    if (isNaN(seatNum) | seatNum < 0 || crients.size - 1 < seatNum) return res.status(404).json({ message: 'data not found' });

    clients.delate(ws) // クライアント削除

    clients.forEach(client => { // 全員に通知
        // MEMO: client.Key() == ws
        if (client.Key().readyState === ws.OPEN) { // クライアントの接続が続いていたら
            for (let i = req.params.sertNum; i < clients.size; i++) { // 消去した配列より後ろがずれる
                res.status(200).json(getAllUser()); // ユーザ情報配列(JSON)
            }
        }
    })
    console.log("退室したよ")
});

// ステータス変更  変更されたステータスをみんなに通知
app.put('/ws/status/:sertNum', (req, res) => {
    // sertNumが範囲外の時、not found
    if (isNaN(seatNum) | seatNum < 0 || crients.size - 1 < seatNum) return res.status(404).json({ message: 'data not found' });

    clients.forEach(client => { // 全員に通知
        if (client.Key().readyState === ws.OPEN) { // クライアントの接続が続いていたら
            res.json(getStatus(req.params.sertNum)); // ステータス
        }
    })
    console.log("ステータス変更したよ")
});


// SE通知  SE識別番号を送る
app.get('/ws/se/:seNum', (req, res) => {
    clients.forEach(client => { // 全員に通知
        if (client.Key().readyState === ws.OPEN) { // クライアントの接続が続いていたら
            res.send(req.params.seNum); // SE識別番号を送る
        }
    })
    console.log("ES鳴らすよ")
});


// 乾杯の通知　(seatNumはステータス押された側の席番号！！)
app.get('/ws/cheers/:seatNum', (req, res) => {
    // sertNumが範囲外の時、not found
    if (isNaN(seatNum) | seatNum < 0 || crients.size - 1 < seatNum) return res.status(404).json({ message: 'data not found' });

    clients.forEach(client => {
        // crientsに登録しているユーザIDと一致 & クライアントの接続が続いていたら
        if (client.Value() === getUserData[req.params.sertNum][1] && client.Key().readyState === ws.OPEN) {
            res.send(seatNum); // 乾杯を押されたのがわかる通知を送る
        }
    })
    console.log("乾杯！")
});

app.listen(3000, () => {
    console.log('Server is listening on port 3000');
});

// ルーターのエクスポート
module.exports = router;
