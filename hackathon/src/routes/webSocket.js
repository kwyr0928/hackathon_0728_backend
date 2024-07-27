// WebSocket通信 ハンドラー
//require('dotenv').config(); // 環境変数

// モジュールインポート
const express = require('express')
const expressws = require('express-ws')(app)
const { getUserData, getAllUser, getState } = require('./server');

// クライアント(参加者)
const clients = new Set();

// WebSocketエンドポイント定義
// 入室 (配列格納後)  入室者の情報をみんなに通知
app.ws('/ws/enter/:sertNum', function (ws, req) {
    clients.add(ws);

    ws.on(' message ', function (msg) {
        clients.forEach(client => { // 全員に通知
            if (client.readyState === ws.OPEN) { // クライアントの接続が続いていたら
                ws.send(getUserName(req.params.seatNum)); // 入室者のユーザ情報
            }
        })
        console.log("入室したよ")
    });
});


// 退室　退室した人の席を埋めるようみんなに通知
app.ws('/ws/leave/:sertNum', function (ws, req) {
    clients.delete(ws);

    ws.on(' message ', function (msg) {
        clients.forEach(client => { // 全員に通知
            if (client.readyState === ws.OPEN) { // クライアントの接続が続いていたら
                for (let i = req.params.sertNum; i < clients.size; i++) { // 消去した配列より後ろがずれる
                    ws.send(getAllUser()); // ユーザ情報配列
                }
            }
        })
        console.log("退室したよ")
    });
});

// ステータス変更  変更されたステータスをみんなに通知
app.ws('/ws/status/:sertNum', function (ws, req) {
    ws.on(' message ', function (msg) {
        clients.forEach(client => { // 全員に通知
            if (client.readyState === ws.OPEN) { // クライアントの接続が続いていたら
                ws.send(getStatus(req.params.sertNum)); // ステータス
            }
        })
    });
    console.log("ステータス変更したよ")
});


// ルーターのエクスポート
module.exports = router;
