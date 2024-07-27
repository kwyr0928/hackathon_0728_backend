// Expressアプリケーション作成、サーバーのセットアップ

// モジュールインポート
const express = require('express')
const expressws = require('express-ws')
const session = require('express-session');
require('dotenv').config(); // 環境変数の取得
const passport = require('passport');

// ルーティング設定
const websocket = require('./routes/webSocket');
const loginRoutes = require('./routes/login'); // ログイン
const homeRoutes = require('./routes/home'); // ホーム
const chatRoutes = require('./routes/chat'); // 掲示板
const paintRoutes = require('./routes/paint'); // ペイント
const rouletteRoutes = require('./routes/roulette'); // ルーレット

// discord コマンド
const helloFile = require('./discord/hello.js'); // こんにちは
const urlFile = require('./discord/url.js'); // パーティー
const { Client, Events, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const token = process.env.TOKEN; // トークン

client.once(Events.ClientReady, c => { // 準備完了通知
	console.log(`準備OKです! ${c.user.tag}がログインします。`);
});

// Expressアプリケーションを作成

const app = express() // Webサーバー作成
expressws(app); // ExpressとWebSocketを結合

// 静的ファイル提供（使い道わからない）
//app.use(express.static('public'))

// セッション設定
app.use(session({
    secret: process.env.SESSION_SECRET, // セッションの署名に使用される秘密鍵
    resave: false,             // セッションが変更されない場合でも再保存するかどうか
    saveUninitialized: false,   // 新しいセッションが作成される際に、初期化されていないセッションを保存するかどうか
    cookie: { secure: false }  // 開発中は false に設定、本番環境では true に設定
}));

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs'); // ejsの設定

// ルーティング(接続処理)
app.use('/websocket', websocket);
app.use('/auth', loginRoutes); // ログイン
app.use('/home', homeRoutes); // ホーム
app.use('/chat', chatRoutes); // 掲示板
app.use('/paint', paintRoutes); // ペイント
app.use('/roulette', rouletteRoutes); // ルーレット

// サーバー起動
const PORT = process.env.PORT || 3000; // ポート指定
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })

client.on(Events.InteractionCreate, async interaction => { // コマンドに対する応答
  if (!interaction.isChatInputCommand()) return; // コマンドが規定外の場合は処理を中止

  // こんにちは
  if (interaction.commandName === helloFile.data.name) {
    try {
        await helloFile.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
        } else {
            await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
        }
    }
} else 

// パーティー
if (interaction.commandName === urlFile.data.name) {
    try {
        await urlFile.execute(interaction);
    } catch (error) {
        console.error(error);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
        } else {
            await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true });
        }
    }
} else {
    console.error(`${interaction.commandName}というコマンドには対応していません。`);
}
});

client.login(token); // ログイン