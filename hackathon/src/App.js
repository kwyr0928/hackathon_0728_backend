const express = require('express'); // express
const session = require('express-session'); // セッション管理
const passport = require('./config/passport'); // ログイン管理
const http = require('http'); // http通信
const socketIo = require('socket.io'); // webSocket

const app = express(); // expressアプリケーション作成
const server = http.createServer(app); // サーバー作成
const io = socketIo(server); // webSocket

// ルーティング設定
const websocket = require('./routes/webSocket');
const loginRoutes = require('./routes/login'); // ログイン
const homeRoutes = require('./routes/home'); // ホーム
const chatRoutes = require('./routes/chat'); // 掲示板
const paintRoutes = require('./routes/paint'); // ペイント
const rouletteRoutes = require('./routes/roulette'); // ルーレット

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

// ルーティング(接続処理)
app.use('/ws', websocket);
app.use('/auth', loginRoutes); // ログイン
app.use('/home', homeRoutes); // ホーム
app.use('/chat', chatRoutes); // 掲示板
app.use('/paint', paintRoutes); // ペイント
app.use('/roulette', rouletteRoutes); // ルーレット

// WebSocketの設定
io.on('connection', (socket) => {
    socket.on('joinRoom', (groupId) => { // グループに参加
        socket.join(groupId);
        console.log(`User joined room: ${groupId}`);
    })
    socket.on('message', (msg) => { // メッセージ送信
        const groupId = socket.handshake.query.groupId;
        io.to(groupId).emit('message', msg);
    });

    socket.on('disconnect', () => { // 通信切断
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000; // ポート指定
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
