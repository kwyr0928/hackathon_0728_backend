const express = require('express'); // express
const router = express.Router(); // ルーティング設定
const { users } = require('../db');

// ユーザアイコンを取得
router.get('/user_icon', (req, res) => {
    const icons = users.map(user => {
        const id = user.id;
        const name = user.username;
        const avatar = user.avatar;
        const status = 0;
        return {
            name: name,
            iconUrl: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
            status: status
        };
    });
    res.json(icons);
});
router.post('/user_status', (req, res) => {
    const { userId, newStatus } = req.body;
     // userIdが提供されていない場合はエラーを返す
     if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    // newStatusが提供されていない場合はエラーを返す
    if (newStatus === undefined) {
        return res.status(400).json({ error: 'New status is required' });
    }

    // ユーザーを探す
    const userIndex = users.findIndex(user => user.id === userId);

    // ユーザーが見つからない場合はエラーを返す
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }

    // ユーザーのステータスを更新
    users[userIndex].status = newStatus;

    // 更新されたユーザー情報を返す
    res.json({
        id: users[userIndex].id,
        name: users[userIndex].username,
        status: users[userIndex].status
    });
});


module.exports = router;