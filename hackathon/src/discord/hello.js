const { SlashCommandBuilder } = require('discord.js'); // コマンドビルダー

module.exports = {
	data: new SlashCommandBuilder()
		.setName('こんにちは') // コマンドの名前
		.setDescription('あいさつに反応してbotが返事します'), // コマンドの説明
	execute: async function(interaction) {
		await interaction.reply('こんにちは！今日もいい天気ですね'); // コマンドに対する応答
	},
};