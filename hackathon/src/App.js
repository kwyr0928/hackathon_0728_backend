const express = require('express'); // express
const session = require('express-session'); // セッション管理
const passport = require('./config/passport'); // ログイン管理
const http = require('http'); // http通信
const expressWs = require('express-ws');

const app = express(); // expressアプリケーション作成
const server = http.createServer(app); // サーバー作成
expressWs(app, server);

// ルーティング設定
const websocket = require('./routes/webSocket');
const loginRoutes = require('./routes/login'); // ログイン
const homeRoutes = require('./routes/home'); // ホーム
const chatRoutes = require('./routes/chat'); // 掲示板
const paintRoutes = require('./routes/paint'); // ペイント
const rouletteRoutes = require('./routes/roulette'); // ルーレット
const cors = require('cors');

// ミドルウェア
app.use(session({ 
    secret: process.env.SESSION_SECRET,
    resave: false, 
    saveUninitialized: false,
    cookie: { secure: false }  // 開発中は false に設定、本番環境では true に設定
}));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs'); // ejsの設定
app.use(cors());

// ルーティング(接続処理)
app.use('/ws', websocket);
app.use('/auth', loginRoutes); // ログイン
app.use('/home', homeRoutes); // ホーム
app.use('/chat', chatRoutes); // 掲示板
app.use('/paint', paintRoutes); // ペイント
app.use('/roulette', rouletteRoutes); // ルーレット

// WebSocketの設定
app.ws('/ws', (ws, req) => {
    ws.on('message', (msg) => {
        const data = JSON.parse(msg);
        
        if (data.type === 'joinRoom') {
            // グループに参加のロジック
            // ここではグループの概念を実装していないので、単純にメッセージをブロードキャストします
            console.log(`User joined room: ${data.groupId}`);
        } else if (data.type === 'message') {
            // メッセージ送信
            // 全てのクライアントにブロードキャスト
            app.getWss().clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify(data));
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
