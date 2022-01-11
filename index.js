                                    //** */ // Musical WarioBOT //** */ //
                                    //** */ // Created by: Ulti
//** */ //                          My Discord: Ultimate Strength#2307 //** */ // 
                                    //** */ // Github: https://github.com/UltimateStrength
//** */ //                          If you use the Scripts Credit it with:
                                    //** */ // "Made by Ulti" or "FINISAUTEMPOTENTIAE ©" 
                                        //** */ // End Title //** */ //





                                    //** */ // Area de Constantes //** */ //





        //Constantes de Requerimento

const Discord = require('discord.js'); //Biblioteca do Discord.js
const ytdl = require('ytdl-core'); //Biblioteca de Download para Video do Youtube
const configs = require('./config.json'); //Requerimentos de Dados do JSON Config
const google = require('googleapis'); //Biblioteca de API da Google
const fs = require('fs');
const lib = require('lib');

        //Constante de Login da Extensão da API do Google

const youtube = new google.youtube_v3.Youtube({
    version: 'v3', 
    auth: configs.GOOGLE_KEY

});

        //Constante Cliente, Gera Login do BOT

const client = new Discord.Client();

        //Constantes de Conexão

const servidores = [];





                                    //** */ // Area de Consoles //** */ //





        //Console Mensageiro ao ser Adicionado à um Server

client.on("guildCreate", (guild) => {
    console.log('Musical WarioBOT acaba de Entrar em um Novo Servidor!!!');
    console.log('Nome do Servidor: ' + guild.name);
    console.log('ID do Servidor: ' + guild.id);
    console.log('Quantidade de Membros: ' + guild.memberCount);
    console.log('Com Isso o Musical WarioBOT ficará em: ' + client.guilds.cache.size);

    servidores[guild.id] = {
        connection: null,
        dispatcher: null,
        fila: [],
        estouTocando: false

    }

    saveServer(guild.id);

});

        //Console Mensageiro ao Levar Shutdown de um Server

client.on("guildDelete", (guild) => {
    console.log('Musical WarioBOT acaba de Sair de um Servidor!!!');
    console.log('Nome do Servidor: ' + guild.name);
    console.log('ID do Servidor: ' + guild.id);
    console.log('Quantidade de Membros: ' + guild.memberCount);
    console.log('Com Isso o Musical WarioBOT ficará em: ' + client.guilds.cache.size);

});

        //Console Mensageiro ao Ligar

client.on("ready", () => {
    let activities = [
        `| Meu Prefixo é "w="`
],
    i = 0;
    setInterval( () =>
    client.user.setActivity(`${activities[i++ % activities.length]}`, {
            type: "PLAYING"
        }), 1000 * 60);
    client.user
        .setStatus("dnd")
        .catch(console.error);
    console.log('Musical WarioBOT está Online, e Pronto para ser Utilizado!!!');
    loadServers();

});





                                    //** */ // Area de Comandos //** */ //





client.on("message", async (msg) => {

        //Filter of Processing

    if (!msg.guild) return;





//** *///** *///** *///** *///** *///** *///** *///** *///** *//
        //Comandos de Musica
//** *///** *///** *///** *///** *///** *///** *///** *///** *//





    if (msg.content === 'w=join') {

        if (!msg.member.voice.channel) {
            msg.channel.send('**:x: | Parece que Você não está em uma Call, entre em uma Para que eu Possa lhe Ajudar!!!**');
            
                }

        }

    if (msg.content === 'w=join') {         
           
        if (msg.member.voice.channel) {
            try {
                    servidores[msg.guild.id].connection = await msg.member.voice.channel.join();

                }
                    catch (err) {
                console.log('Ocorreu um Erro ao Entrar no Canal de Voz!!!');
                console.log(err);
        }

            msg.channel.send('**:white_check_mark: | Call Conectada**');

                }
        }

    if (msg.content.startsWith('w=play')) {
        let oQueTocar = msg.content.slice(7);

        if (oQueTocar.length === 0) {
            msg.channel.send('**:x: | Digite o Nome de uma Musica ou um Link para que eu Possa Tocar!!!**');
            return;

        }

        if (servidores[msg.guild.id].connection === null) {
            try {
                servidores[msg.guild.id].connection = await msg.member.voice.channel.join();

                }
                    catch (err) {
                console.log('Ocorreu um Erro ao Entrar no Canal de Voz!!!');
                console.log(err);

                }

        }

        if (ytdl.validateURL(oQueTocar)) {
            msg.channel.send('**:headphones: | Musica Tocando**');
            servidores[msg.guild.id].fila.push(oQueTocar);
            console.log('Foi Adicionado à Fila a Musica: ' + oQueTocar);
            tocaMusicas(msg);

                }

    else {
        youtube.search.list({
            q: oQueTocar,
            part: 'snippet',
            fields: 'items(id(videoId),snippet(title,channelTitle))',
            type: 'video'

    }, function (err, resultado) {
    
        if (err) {
            console.log(err);

    }

        if (resultado) {
            const listaResultados = [];

        //Organizador de Pesquisa

            for (let i in resultado.data.items) {
                const montaItem = {
                    'tituloVideo': resultado.data.items[i].snippet.title,
                    'nomeCanal': resultado.data.items[i].channelTitle,
                    'id': 'https://www.youtube.com/watch?v=' + resultado.data.items[i].id.videoId

                    }

                    listaResultados.push(montaItem);

            }
        
        //Constante que Cria Embed

            const embed = new Discord.MessageEmbed()
                .setColor([210, 199, 60])
                .setTitle('Escolha sua Musica com as Reações de 1 a 5!!!');

            for (let i in listaResultados) {
                embed.addField(
                    `${parseInt(i) + 1} ▸ ${listaResultados[i].tituloVideo}`,
                    '⠀'

                    );
            }

            msg.channel.send(embed)
                .then((embedMessage) => {
                    const possiveisReacoes = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣'];
                    
        //Botões de Reação

                    for (let i = 0; i < possiveisReacoes.length; i++) {
                        embedMessage.react(possiveisReacoes[i]);

                            }

                    const filter = (reaction, user) => {
                        return possiveisReacoes.includes(reaction.emoji.name)
                            && user.id === msg.author.id;

                            }

                    embedMessage.awaitReactions(filter, { max: 1, time: 20000, errors: ['time']})
                        .then((collected) => {
                            const reaction = collected.first();
                            const idOpcaoEscolhida = possiveisReacoes.indexOf(reaction.emoji.name);

                            msg.channel.send(`**Você Selecionou ${listaResultados[idOpcaoEscolhida].tituloVideo}**`);
                            console.log(`Foi Adicionado à Fila a Musica: ${listaResultados[idOpcaoEscolhida].tituloVideo}`);

                            servidores[msg.guild.id].fila.push(listaResultados[idOpcaoEscolhida].id);
                            tocaMusicas(msg);

                        })
                        .catch((error) => {
                            msg.channel.send('**Sua Seleção não foi Valida!!!**');
                            console.log(error);
                        });

                });

    }

});

                }

         }

    if (msg.content === 'w=pause') {         
           
        if (msg.member.voice.channel) {
            servidores[msg.guild.id].dispatcher.pause();
            msg.channel.send('**:pause_button: | Musica Pausada**');
    
                }
        }

    if (msg.content === 'w=resume') {         
           
        if (msg.member.voice.channel) {
            servidores[msg.guild.id].dispatcher.resume();
            msg.channel.send('**:arrow_forward: | Musica Despausada**');
            
                }
        }

        if (msg.content === 'w=reset') {

            if (!msg.member.voice.channel) {
                msg.channel.send('**:x: | Parece que Você não está em uma Call, entre em uma Para que eu Possa lhe Ajudar!!!**');
                
                }
    
        }

        if (msg.content === 'w=reset') {
            if (msg.member.voice.channel) {
            msg.member.voice.channel.leave();
            servidores[msg.guild.id].connection = null;
            servidores[msg.guild.id].dispatcher = null;
            servidores[msg.guild.id].estouTocando = false;
            servidores[msg.guild.id].fila = [];
            msg.channel.send('**:white_check_mark: | Call Desconectada**');

                }
        }

        if (msg.content === 'w=stop') {

            if (!msg.member.voice.channel) {
                msg.channel.send('**:x: | Parece que Você não está em uma Call, entre em uma Para que eu Possa lhe Ajudar!!!**');
                
                }
    
        }

        if (msg.content === 'w=stop') {
            if (msg.member.voice.channel) {
            msg.member.voice.channel.leave();
            servidores[msg.guild.id].connection = null;
            servidores[msg.guild.id].dispatcher = null;
            servidores[msg.guild.id].estouTocando = false;
            servidores[msg.guild.id].fila = [];
            msg.channel.send('**:white_check_mark: | Call Desconectada**');

                }
        }

        if (msg.content === 'w=disconnect') {

            if (!msg.member.voice.channel) {
                msg.channel.send('**:x: | Parece que Você não está em uma Call, entre em uma Para que eu Possa lhe Ajudar!!!**');
                
                }
    
        }

        if (msg.content === 'w=disconnect') {
            if (msg.member.voice.channel) {
            msg.member.voice.channel.leave();
            servidores[msg.guild.id].connection = null;
            servidores[msg.guild.id].dispatcher = null;
            servidores[msg.guild.id].estouTocando = false;
            servidores[msg.guild.id].fila = [];
            msg.channel.send('**:white_check_mark: | Call Desconectada**');

                }
        }

        if (msg.content === 'w=dc') {

            if (!msg.member.voice.channel) {
                msg.channel.send('**:x: | Parece que Você não está em uma Call, entre em uma Para que eu Possa lhe Ajudar!!!**');
                
                }
    
        }

        if (msg.content === 'w=dc') {
            if (msg.member.voice.channel) {
            msg.member.voice.channel.leave();
            servidores[msg.guild.id].connection = null;
            servidores[msg.guild.id].dispatcher = null;
            servidores[msg.guild.id].estouTocando = false;
            servidores[msg.guild.id].fila = [];
            msg.channel.send('**:white_check_mark: | Call Desconectada**');

                }
        }

        if (msg.content === 'w=leave') {

            if (!msg.member.voice.channel) {
                msg.channel.send('**:x: | Parece que Você não está em uma Call, entre em uma Para que eu Possa lhe Ajudar!!!**');
                
                }
    
        }

        if (msg.content === 'w=leave') {
            if (msg.member.voice.channel) {
            msg.member.voice.channel.leave();
            servidores[msg.guild.id].connection = null;
            servidores[msg.guild.id].dispatcher = null;
            servidores[msg.guild.id].estouTocando = false;
            servidores[msg.guild.id].fila = [];
            msg.channel.send('**:white_check_mark: | Call Desconectada**');

                }
        }





//** *///** *///** *///** *///** *///** *///** *///** *///** *//        
        //Comandos de Informações
//** *///** *///** *///** *///** *///** *///** *///** *///** *//





    if (msg.content === 'w=ping') {
        msg.channel.send('**:ping_pong: Pong!!!**').then (async (msg) =>{
          msg.delete()
          msg.channel.send(`**:ping_pong: Pong!!!**\n**:satellite: Latência = ${Math.round(client.ws.ping)}ms**`);

                })

        }

    if (msg.content === 'w=avatar') {

        if (!msg.mentions.users.size) {
            const user = msg.mentions.users.first() || msg.author;
            const avatarAuthor = new Discord.MessageEmbed()
            .setColor([210, 199, 60])
            .setTitle('**Avatar do Usuario**')
            .setImage(msg.author.displayAvatarURL())
            .setFooter('(Comando Enviado por ' + msg.author.username + ')')
                msg.channel.send(avatarAuthor);

                }

        }





//** *///** *///** *///** *///** *///** *///** *///** *///** *//
        //Comandos Gerais do BOT
//** *///** *///** *///** *///** *///** *///** *///** *///** *//





        if (msg.content === '<@!884451726839648256>') {
            const mentionCommand = new Discord.MessageEmbed()
            .setColor([210, 199, 60])
            .setTitle('**Alguém me Chamou???**')
            .setDescription('**Olá <@!' + msg.author.id + '>, sou Musical WarioBOT, um BOT Auxiliar do Melhor BOT da Plataforma!!!**\n\n**:small_orange_diamond: | Meu Prefixo é **`w=`\n**:small_blue_diamond: | Para ver Minhas Funcionalidades de **`w=help`\n**:small_orange_diamond: | Utilize **`w=play <Musica>`** para me Fazer Tocar no seu Canal de Voz!!!**\n\n**Fique de Olho no **[**Site Oficial do WarioBOT**](https://wariobot.webnode.com/)** e Caso queira, Deixe um Feedback para o BOT Principal da Casa. ou um Voto que Ajudará-o a Crescer, para isso **[**Clique Aqui**](https://top.gg/bot/709448420548673536/)**!!!**')
            .setFooter('')
            .setImage('https://media.discordapp.net/attachments/714115136499220503/884211231064461342/Wallpaper_10.jpg?width=768&height=432')
                msg.channel.send(mentionCommand);

        }

        if (msg.content === 'w=help') {
                const helpCommand = new Discord.MessageEmbed()
                .setColor([210, 199, 60])
                .setTitle('**Comandos do Musical WarioBOT**')
                .setDescription('**:bookmark_tabs: | Informações (1)**\n\n`w=ping` `w=avatar`\n\n**:robot: | BOT - (1)**\n\n`w=help` `w=site` `w=invite` `w=suporte`\n\n**:rofl: | Diversão - (1)**\n\n`w=say`\n\n**:notes: | Musica - (2)**\n\n`w=join` `w=play` `w=resume` `w=pause` `w=reset`')
                .setFooter('(Comando Enviado por ' + msg.author.username + ')')
                    msg.channel.send(helpCommand);

        }

        if (msg.content === 'w=suporte') {
            const inviteCommand = new Discord.MessageEmbed()
            .setColor([210, 199, 60])
            .setTitle('Suporte para Consultar Duvidas, e Destacar Bugs :interrobang:')
            .setDescription('**:gear: | Para entrar no Servidor do meu Criador **[**Clique Aqui**](https://discord.gg/xTWvpSX)**!!!**\n\n**:robot: | Meu Servidor Suporte (Em Breve) **[**Clique Aqui**](https://www.youtube.com/watch?v=dQw4w9WgXcQ)**!!!**')
            .setImage('https://media.discordapp.net/attachments/714115136499220503/906981709080317962/FaixaW.jpg?width=964&height=48')
            .setFooter('(Dê w.help para Ver meus Comandos)')
                msg.channel.send(inviteCommand);

        }

        if (msg.content === 'w=site') {
            const inviteCommand = new Discord.MessageEmbed()
            .setColor([210, 199, 60])
            .setTitle('Olá, Entre em Meu Site e Receba mais Informações Minhas')
            .setDescription('**:robot: | Para ir ao Site Oficial do WarioBOT **[**Clique Aqui**](https://wariobot.webnode.com/)**!!!**\n\n**:gear: | Para ir ao Site Oficial do Meu Criador **[**Clique Aqui**](https://migatte-no-ultizin.webnode.com/)**!!!**')
            .setImage('https://media.discordapp.net/attachments/714115136499220503/906981709080317962/FaixaW.jpg?width=964&height=48')
            .setFooter('(Dê w.help para Ver meus Comandos)')
                msg.channel.send(inviteCommand);

        }

        if (msg.content === 'w=botinfo') {
            const inviteCommand = new Discord.MessageEmbed()
            .setColor([210, 199, 60])
            .setTitle('Info do Bot')
            .setDescription('**:link: | Versão:**\n`V. 1.02 (Alpha)`\n\n**:robot: │ Nickname:**\n`WarioBOT Musical#5055`\n\n**:gear: │ Criador:**\n`(Dev) Ultimate Strength#2307`\n\n**:pushpin: │ Prefixo:**\n`w= - Use w=help para Minhas Funcionalidades`')
            .setImage('')
            .setFooter('')
                msg.channel.send(inviteCommand);

        }
        




//** *///** *///** *///** *///** *///** *///** *///** *///** *//
        //Comandos de Diversão
//** *///** *///** *///** *///** *///** *///** *///** *///** *//





    if (msg.content.startsWith('w=say')) {
        let FalaCopiada = msg.content.slice(6);
        msg.channel.send(FalaCopiada + '\n\n**:upside_down: | (Comando Enviado por ' + msg.author.username + ')**');
    
                }

        });

        //Constante Geradora de Fila

        const tocaMusicas = (msg) => {
            if (servidores[msg.guild.id].estouTocando === false) {
                const tocando = servidores[msg.guild.id].fila[0];
                servidores[msg.guild.id].estouTocando = true;
                servidores[msg.guild.id].dispatcher = servidores[msg.guild.id].connection.play(ytdl(tocando, configs.YTDL));

                servidores[msg.guild.id].dispatcher.on('finish', () => {
                    servidores[msg.guild.id].fila.shift();
                    servidores[msg.guild.id].estouTocando = false;
                    if (servidores[msg.guild.id].fila.length > 0) {
                        tocaMusicas();

                                }

                    else {
                        servidores[msg.guild.id].dispatcher = null;

                                }
                        });

                }

        }

        const loadServers = () => {
            fs.readFile('serverList.json', 'utf8', (err, data) => {
                if (err) {
                    console.log('Ocorreu um Erro ao Ler o Registro de Server');
                    console.log(err);
                }
                else {
                    const objLe = JSON.parse(data);
                    for (let i in objLe.servers) {
                        servidores[objLe.servers[i]] = {
                            connection: null,
                            dispatcher: null,
                            fila: [],
                            estouTocando: false

                                        }
                                }

                        }

                });

        }

        const saveServer = (idNovoServidor) => {
            fs.readFile('serverList.json', 'utf8', (err, data) => {
                if (err) {
                    console.log('Ocorreu um Erro ao Salvar um Novo Server');
                    console.log(err);
                }
                else {
                    const objLe = JSON.parse(data);
                    objLe.servers.push(idNovoServidor);
                    const objEscreve = JSON.stringify(objLe);

                    fs.writeFile('serverList.json', objEscreve, 'utf8', () => {});

                }

            });

        }





        //Login de TOKEN





client.login(configs.TOKEN_DISCORD);