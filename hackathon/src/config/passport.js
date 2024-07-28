const passport = require('passport'); // ログイン用モジュール
const DiscordStrategy = require('passport-discord').Strategy; // ログイン用モジュール
require('dotenv').config(); // 環境変数の取得

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
    done(null, user); // ユーザーIDをセッションに保存
});

passport.deserializeUser((obj, done) => {
    done(null, obj);
});

module.exports = passport;