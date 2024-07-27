const { REST, Routes } = require('discord.js');
const helloFile = require('./hello.js'); // こんにちは
const urlFile = require('./url.js'); // パーティー
require('dotenv').config(); // 環境変数の取得

const applicationId = process.env.APPLICATION_ID; // アプリケーションID
const guildId = process.env.GUILD_ID; // サーバーID
const token = process.env.TOKEN; // トークン

const commands = [helloFile.data.toJSON(), urlFile.data.toJSON()]; // コマンドをリスト形式で登録
const rest = new REST({ version: '10' }).setToken(token); // APIのversionを指定

(async () => {
    try {
        console.log('コマンドを登録しています...');
        await rest.put(
            Routes.applicationGuildCommands(applicationId, guildId),
            { body: commands },
        );
        console.log('コマンドが登録されました！');
    } catch (error) {
        console.error('コマンドの登録中にエラーが発生しました:', error);
    }
})(); // 即時実行関数を呼び出す
