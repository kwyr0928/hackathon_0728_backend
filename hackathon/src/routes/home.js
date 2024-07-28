const express = require('express'); // express
const router = express.Router(); // ルーティング設定

let userData = [
    {
        "id": "958956729226379294",
        "name": "ux_xu_yr",
        "avatar": "34e0b040d88b3aa4d197a90a2b76aa16",
        "status": 0
    },
    {
        "id": "958956729226379294",
        "name": "ux_xu_yr",
        "avatar": "34e0b040d88b3aa4d197a90a2b76aa16",
        "status": 0
    },
    {
        "id": "958956729226379294",
        "name": "ux_xu_yr",
        "avatar": "34e0b040d88b3aa4d197a90a2b76aa16",
        "status": 0
    },
    {
        "id": "958956729226379294",
        "name": "ux_xu_yr",
        "avatar": "34e0b040d88b3aa4d197a90a2b76aa16",
        "status": 0
    },    
    {
        "id": "958956729226379294",
        "name": "ux_xu_yr",
        "avatar": "34e0b040d88b3aa4d197a90a2b76aa16",
        "status": 0
    },
    {
        "id": "958956729226379294",
        "name": "ux_xu_yr",
        "avatar": "34e0b040d88b3aa4d197a90a2b76aa16",
        "status": 0
    },
    {
        "id": "958956729226379294",
        "name": "ux_xu_yr",
        "avatar": "34e0b040d88b3aa4d197a90a2b76aa16",
        "status": 0
    },
];

// ユーザアイコンを取得
router.get('/user_icon', (req, res) => {
    const icons = userData.map(user => {
        const id = user.id;
        const name = user.name;
        const avatar = user.avatar;
        const status = user.status;
        return {
            name: name,
            iconUrl: `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`,
            status: status
        };
    });
    res.json(icons);
});

module.exports = router;