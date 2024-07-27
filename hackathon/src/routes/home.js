const express = require('express'); // express
const router = express.Router(); // ルーティング設定

router.get('/:groupId', (req, res) => {
    const groupId = req.user.groupId; // グループID
    if (!req.isAuthenticated()) return res.redirect(`/login/${groupId}`); // エラー
    if (!groupId) {
        return res.redirect('/login'); // エラー
    }
    // const groupUsers = getUsersByGroupId(groupId);
    // res.render('dashboard', { user: req.user, groupUsers, groupId });
});

module.exports = router;