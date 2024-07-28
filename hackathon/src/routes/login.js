const express = require('express'); // express
const router = express.Router(); // ルーティング設定
const passport = require('passport'); // ログイン用モジュール
const DiscordStrategy = require('passport-discord').Strategy; // ログイン用モジュール
require('dotenv').config(); // 環境変数の取得
let groupId; // グループID


router.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), (req, res) => { // ログイン後
    req.user.groupId = groupId; // グループID
    console.log('groupId:', groupId);
    res.redirect(`http://localhost:3000/home/`); // リダイレクト
});

router.get('/logout', (req, res, next) => { // ログアウト
    req.logout(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
});

passport.use(new DiscordStrategy({
    clientID: process.env.CLIENT_ID, // クライアントID
    clientSecret: process.env.CLIENT_SECRET, // シークレットID
    callbackURL: process.env.CALLBACK_URL, // コールバックURL
    scope: ['identify', 'email'] // ユーザーからIDとEmailを取得
}, (accessToken, refreshToken, profile, done) => {
    profile.groupId = profile.groupId || null; // グループIDを設定
    console.log('profile:', profile); // ログイン後の情報を確認
    // addUser(profile);  // ユーザー情報を保存
    return done(null, profile);
}));

passport.serializeUser((user, done) => {
    done(null, user.id); // ユーザーIDをセッションに保存
});

passport.deserializeUser((id, done) => {
    done(null, obj);
});

router.head('/callback', (req, res) => {
    res.sendStatus(200);
});


router.get('/:groupId', (req, res, next) => { // ログインURL
    groupId = req.params.groupId; // 末尾からグループIDを取得
    passport.authenticate('discord')(req, res, next); // ログイン処理
});


module.exports = router;