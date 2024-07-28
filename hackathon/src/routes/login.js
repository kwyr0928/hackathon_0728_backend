const express = require('express'); // express
const router = express.Router(); // ルーティング設定
const passport = require('passport'); // ログイン用モジュール
const DiscordStrategy = require('passport-discord').Strategy; // ログイン用モジュール
require('dotenv').config(); // 環境変数の取得
let groupId; // グループID

router.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => { // ログイン後
    req.user.groupId = groupId; // グループID
    console.log('groupId:', groupId);
    res.redirect(`http://localhost:5173/`); // リダイレクト
});

router.get('/logout', (req, res, next) => { // ログアウト
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

router.head('/callback', (req, res) => {
    res.sendStatus(200);
});

router.get('/:groupId', (req, res, next) => { // ログインURL
    groupId = req.params.groupId; // 末尾からグループIDを取得
    passport.authenticate('discord')(req, res, next); // ログイン処理
});

module.exports = router;