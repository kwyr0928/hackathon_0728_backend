// JSON配列値の受けわたし

// 変数定義
// 配列の要素数の最大値（最大参加者人数）
const maxUser = 12;

// モジュール
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

/*
    ユーザ情報配列　JSON形式
    {groupID, userID, userAvatar, status} string, string, string, number
    seatNumはindex
    ０．なし　１．酒　　２．ゲーム　３．パソコン　４．離席　５. 音楽　６. ご飯　７. チル ……　
*/
let userData = [];


// 全てのユーザ情報を取得(画面読み込み時)
app.get('/server/data', (req, res) => {
    res.json(userData);
});
function getAllUser(){
    return userData;
}

// 一人のユーザ情報を取得
// app.get('/data/:seatNum', (req, res) => {
//     const seatNum = parseInt(req.params.seatNum, 10);
//     if (isNaN(seatNum) | seatNum < 0 || maxUser - 1 < seatNum) return res.status(404).json({ message: 'data not found' });
//     sendUserData(serData[seatNum]);
//     res.json(userData[seatNum]);
// });
function getUserData(seatNum){
    return userData[seatNum];
}

// 入室者を配列に登録
app.post('/server/enter', (req, res, next) => {
    const newData = {
        groupID: req.body.groupID,
        userID: req.body.userID,
        userAvatar: req.body.userAvatar,
        status: 0,
    };
    userData.push(newData);
    res.status(201).json(userData); // 全員の情報を得る
});

// 退室者を配列から消去
app.delete('/server/leave/:seatNum', (req, res) => { // 席番号を受け取る
    const seatNum = parseInt(req.params.seatNum, 10);
    if (isNaN(seatNum) | seatNum < 0 || maxUser - 1 < seatNum) return res.status(404).json({ message: 'data not found' });
    const data = userData[seatNum];

    userData.splice(seatNum, 1);
    res.status(204).send();
});

// ステータスを取得
// app.get('/status/:seatNum', (req, res) => { // 席番号を受け取る
//     const seatNum = parseInt(req.params.seatNum, 10);
//     if (isNaN(seatNum) | seatNum < 0 || maxUser - 1 < seatNum) return res.status(404).json({ message: 'data not found' });
//     const status = userData[seatNum].status
//     res.json(status); // ステータスを返す
// });
function getState(seatNum){
    return userData[seatNum].status;
}

// ステータスを更新
app.put('/server/status/:seatNum', (req, res) => { // 席番号を受け取る
    const seatNum = parseInt(req.params.seatNum, 10);
    if (isNaN(seatNum) | seatNum < 0 || maxUser - 1 < seatNum) return res.status(404).json({ message: 'data not found' });
    const data = userData[seatNum]

    data.status = req.body.newStatus || data.status;
    userData.put(seatNum, data)
});

// 特定のユーザアイコンを取得
app.get('/server/icon/:seatNum', (req, res) => { // 席番号を受け取る
    const seatNum = parseInt(req.params.seatNum, 10);
    if (isNaN(seatNum) | seatNum < 0 || maxUser - 1 < seatNum) return res.status(404).json({ message: 'data not found' });
    const id = userData[seatNum].userID
    const avatar = userData[req.params.seatNum].userAvater
    res.json("https://cdn.discordapp.com/avatars/" + id + "/" + avatar + ".png");
}); // 画像を返す

// 参加者全員のユーザ名取得
app.get('/server/userID', (req, res) => { // 席番号を受け取る
    const userArray = [];
    userData.forEach(user => {
        userArray.push(user.userID);
    })
    res.send(userArray);
});

module.exports = { getUserData, getAllUser, getState };