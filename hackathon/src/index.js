// hey.jsのmodule.exportsを呼び出します。
const helloFile = require('./discord/hello.js');
const urlFile = require('./discord/url.js');
require('dotenv').config(); // 環境変数の取得

const { Client, Events, GatewayIntentBits } = require('discord.js');
const token = process.env.TOKEN; // トークン
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, c => {
	console.log(`準備OKです! ${c.user.tag}がログインします。`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
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

// ログイン
client.login(token);