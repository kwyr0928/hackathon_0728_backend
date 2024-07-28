const { SlashCommandBuilder } = require('discord.js'); // コマンドビルダー

module.exports = {
	data: new SlashCommandBuilder()
		.setName('パーティー')  // コマンドの名前
		.setDescription('パーティー用のURLを発行します'), // コマンドの説明
	execute: async function(interaction) {
    const roomNumber = Math.floor(Math.random() * 100000); // ランダムな部屋番号を生成
    const uniqueURL = `https://hackathon-0728-backend.onrender.com/auth/${roomNumber}`; // 固有URLを生成（ここのURLをReact側に揃える）
    await interaction.reply(`パーティー用のURLを発行しました！：${uniqueURL}`); // 生成した固有URLを返す
	},
};