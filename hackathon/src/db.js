let users = [];

const addUser = (user) => { // ユーザーの追加
    users.push(user);
};

module.exports = {
    users,
    addUser,
};
