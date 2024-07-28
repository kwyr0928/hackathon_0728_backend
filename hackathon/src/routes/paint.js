const express = require('express');
const router = express.Router();
const expressWs = require('express-ws');
const path = require('path');
const WebSocket = require('ws');
expressWs(router);

const clients = new Set();
const drawHistory = []; // 描画履歴を保存する配列

router.ws('/draw', (ws, req) => {
  clients.add(ws);

  // 新しいクライアントに描画履歴を送信
  drawHistory.forEach((data) => {
    ws.send(JSON.stringify(data));
  });

  ws.on('message', (msg) => {
    const data = JSON.parse(msg);

    if (data.type === 'reset') {
      // リセットの場合、履歴をクリアする
      drawHistory.length = 0;
    } else {
      // 描画データを履歴に追加
      drawHistory.push(data);
    }

    // 他のクライアントにブロードキャスト
    clients.forEach((client) => {
      if (client !== ws && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  });

  ws.on('close', () => {
    clients.delete(ws);
  });
});

router.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

module.exports = router;