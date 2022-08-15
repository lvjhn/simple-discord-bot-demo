require('dotenv').config(); //initialize dotenv
const { REST } = require('@discordjs/rest');
const { 
    Client, 
    EmbedBuilder, 
    Routes, 
    GatewayIntentBits, 
    Partials, 
    SlashCommandBuilder, 
    DMChannel} = require('discord.js'); //import discord.js

/** Create Client */
(async() => { 

    /** Slash Commands */
    const commands = [
        new SlashCommandBuilder()
            .setName('ping')
            .setDescription('Replies with pong!'),
        new SlashCommandBuilder()
            .setName('beep')
            .setDescription('Replies with boop!'), 
        new SlashCommandBuilder()
            .setName('hello-what')
            .setDescription('Replies with Hello, world!!'), 
        new SlashCommandBuilder()
            .setName('hello-sth')
            .setDescription('Replies with Hello, sth!') 
            .addStringOption(option =>
                option
                    .setName('sth')
                    .setDescription('Someone or something to say hello to.')
                    .setRequired(true)
            ),
        new SlashCommandBuilder()
            .setName('llama')
            .setDescription('Sends you back a picture of a llama.'),
        new SlashCommandBuilder()
            .setName('lorem-ipsum-pdf')
            .setDescription('Sends you back a pdf file with lorem ipsum content.'),
    new SlashCommandBuilder()
            .setName('enlist')
            .setDescription('Begins the process of enlisting you as a regular member.') 
    ].map(command => command.toJSON());

    const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

    /** Register Commands */
    console.log("@ Registering commands...")
    await rest.put(
        Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), 
        { body: commands }
    );
       
    console.log('@ Successfully registered application commands.');
    
    /** Create Client */
    const client = new Client({ 
        intents: [ 
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildBans,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent
        ],
        partials: [Partials.Channel]
    });

    // Monitor booting state
    client.on('ready', async () => {
        console.log("@ Bot is ready!");
        const channels = client.channels.cache;
        channels.forEach(async (channel, event) => {
            if(channel.type != 0) return;
            await channel.send("Hello, I've just booted up!");
        });
    })

    // Receive commands
    client.on('interactionCreate', async interaction => {
        if (!interaction.isChatInputCommand()) return;
    
        const { commandName } = interaction;
    
        if (commandName === 'ping') {
            await interaction.reply('Pong!');
        } else if (commandName === 'beep') {
            await interaction.reply('Boop!');
        } else if (commandName === 'hello-what') {
            await interaction.reply('Hello, **world**!')
        } else if (commandName === 'hello-sth') {
            await interaction.reply('Hello, ' + interaction.options.getString('sth') + '!')
        } else if (commandName === 'llama') {
            await interaction.reply(
                { content: 'Here is your llama!', files: ['images/llama.jpeg'] 
            });
        } else if (commandName === 'lorem-ipsum-pdf') {
            await interaction.reply.send({ files: ['files/lorem-ipsum.pdf'] });
        } else if (commandName === 'enlist') {
            await interaction.reply(`Noted, <@${interaction.user.id}>`);
            await interaction.user.send(`Hi, <@${interaction.user.id}>! You are about to be enlisted! Reply with 'Noted' to confirming.`)
        } 
    });

    // Receive commands
    client.on('messageCreate', async message => {
        if(message.guild === null) {
            console.log("@ Received message: " + message.content)
            if(message.content == 'Noted') {
                message.reply('Thanks for confirming!')
            }
        } 
    });
    
    client.login(process.env.BOT_TOKEN)
})();