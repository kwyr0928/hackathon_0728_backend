// モジュールインポート
const express = require('express');
const expressws = require('express-ws')
const { getUserData, getAllUser, getStatus } = require('./server');
const router = express.Router()
expressws(router)

// クライアント(参加者)
const clients = new Map(); // ユーザIDと接続を結び付ける 

// WebSocket接続
router.ws('/ws', function (ws, req) {
    let userId = null; // ユーザIDを保持

    ws.on('message', function (msg) {
        console.log(`Message from ${userId}: ${msg}`);
    });

    // 接続が切れたら
    ws.on('close', function () {
        console.log(`${userId} disconnected`);
        clients.delete(ws); // クライアント削除
    });
});

// WebSocketエンドポイント定義
// 入室 (配列格納後) 入室者の情報をみんなに通知
router.post('/ws/enter/:seatNum', (req, res) => {
    const seatNum = parseInt(req.params.seatNum);
    
    if (isNaN(seatNum) || seatNum < 0 || clients.size < seatNum) {
        return res.status(404).json({ message: 'data not found' });
    }

    const userData = getUserData(seatNum);
    if (userData) {
        clients.set(req.ws, userData[1]); // クライアント登録

        clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify(userData[1])); // 入室者のユーザ情報
            }
        });

        console.log("入室したよ");
        res.status(200).json(userData[1]); // クライアントにユーザ情報を返す
    } else {
        res.status(404).json({ message: 'user data not found' });
    }
});

// 退室 退室した人の席を埋めるようみんなに通知
router.delete('/ws/leave/:seatNum', (req, res) => {
    const seatNum = parseInt(req.params.seatNum);

    if (isNaN(seatNum) || seatNum < 0 || clients.size - 1 < seatNum) {
        return res.status(404).json({ message: 'data not found' });
    }

    clients.delete(req.ws); // クライアント削除

    clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(JSON.stringify(getAllUser())); // ユーザ情報配列(JSON)
        }
    });

    console.log("退室したよ");
    res.status(200).json({ message: 'user left' });
});

// ステータス変更 変更されたステータスをみんなに通知
router.put('/ws/status/:seatNum', (req, res) => {
    const seatNum = parseInt(req.params.seatNum);

    if (isNaN(seatNum) || seatNum < 0 || clients.size - 1 < seatNum) {
        return res.status(404).json({ message: 'data not found' });
    }

    const status = getStatus(seatNum);
    clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            res.json({seatNum: seatNum, state: getState(seatNum)}); // ステータス
        }
    });

    console.log("ステータス変更したよ");
    res.json(status);
});

// SE通知 SE識別番号を送る
router.get('/ws/se/:seNum', (req, res) => {
    const seNum = req.params.seNum;
    clients.forEach(client => {
        if (client.readyState === ws.OPEN) {
            client.send(seNum); // SE識別番号を送る
        }
    });

    console.log("ES鳴らすよ");
    res.send(seNum);
});

// 乾杯の通知 (seatNumはステータス押された側の席番号)
router.get('/ws/cheers/:seatNum', (req, res) => {
    const seatNum = parseInt(req.params.seatNum);

    if (isNaN(seatNum) || seatNum < 0 || clients.size - 1 < seatNum) {
        return res.status(404).json({ message: 'data not found' });
    }

    const userData = getUserData(seatNum);
    if (userData) {
        clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(JSON.stringify({ cheers: seatNum })); // 乾杯通知
            }
        });

        console.log("乾杯！");
        res.status(200).json({ cheers: seatNum });
    } else {
        res.status(404).json({ message: 'user data not found' });
    }
});


module.exports = router;