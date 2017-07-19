const Discord = require("discord.js");
const client = new Discord.Client();
const token = 'MzM0NDAyOTEwNDQ2Mjg4ODk3.DEasiA.ziRt2DUs6CQV0l1w7MAYkwnPmrs';
const Cleverbot = require('cleverbot');

// Instantiating cleverbot
let clev = new Cleverbot({
    key: 'CC38sHJeBRODed_jnLlwNzCX-AA'
});

// Commands with predefined answers
const myMessages = JSON.parse(JSON.stringify(require('./mensagens.json')));
const masterID = '91284150237016064';
const masterCompliment = / ola | bem | oi /gi;

// Bot logs to server
client.login(token);

client.on("ready", () => {
    console.log("Tudo certo chefia. Estou conectado!");
    client.user.setGame('Comendo ração');
    setRandomStatus(25000, myMessages);
});

client.on("message", message => {

    // Set the prefix
    let prefix = "$";

    // if someone mentions bot, answer with cleverbot
    if (message.isMentioned('334402910446288897')) {
        clev.query(message.content).then(response => {
            message.channel.send(response.output);
        });
    }

    // Exit and stop if prefix is not there
    if (!message.content.startsWith(prefix))
        return;

    // bots check for master ID
    if (message.member.id == masterID) {
        if (message.content.search(masterCompliment) != -1) {
            message.channel.send('Olá mestre! Tudo ótimo e com o senhor?');
            return;
        }
    } else if (message.member.id != masterID && message.content.search(masterCompliment) != -1) {
        message.channel.send('Vai toma no seu cu! Você não é o mestre!');
        return;
    }

    // If bot has answer in db, it will send back based on the question
    answerClient(message, myMessages);

});

function answerClient(clientMessage, db) {
    let filteredMessage = clientMessage.content.replace('$', '');

    // check if it is a function
    if (db.functions.hasOwnProperty(filteredMessage))
        eval(db.functions[filteredMessage]);

    // or an audio
    else if (db.functions.audios.hasOwnProperty(filteredMessage))
        eval(db.functions.audios[filteredMessage]);

    // check if there is a answer for that command
    else if (db.predefined.hasOwnProperty(filteredMessage))
        clientMessage.channel.send(db.predefined[filteredMessage]);

    // not a function not predefined message
    else
        clientMessage.channel.send('Não entendi esse comando.');


    function allComands() {
        let comandos = [];
        let audios = [];

        for (let prop in db.functions) {
            comandos.push(prop);
        }

        for (let prop in db.functions.audios) {
            audios.push(prop);
        }

        let stringComandos = comandos.sort().reduce(function(total, next) {
            return total.concat('\t' + next);
        });

        let stringAudios = audios.sort().reduce(function(total, next) {
            return total.concat('\t' + next);
        });

        clientMessage.channel.send('Comandos disponiveis: ');
        clientMessage.channel.send(outputFormatCode(stringComandos));

        clientMessage.channel.send('Áudios disponiveis: ');
        clientMessage.channel.send(outputFormatCode(stringAudios));
        clientMessage.channel.send(outputFormatCode('\nVocê também pode fazer perguntas para a Lana, basta mencioná-la.'));
    }

    function allMessages() {
        let messages = [];
        for (let prop in db.predefined) {
            messages.push(prop);
        }
        let string = messages.sort().reduce(function(total, next) {
            return total.concat('\t' + next);
        });
        clientMessage.channel.send('Mensagens Disponíveis: ');
        clientMessage.channel.send(outputFormatCode(string));
    }

    // play sound at the location of the user that sent message
    function playSoundOnChannel(location, time) {
        const channel = clientMessage.member.voiceChannel;
        const broadcast = client.createVoiceBroadcast();

        channel.join()
            .then(connection => {
                broadcast.playFile(location);
                const dispatcher = connection.playBroadcast(broadcast);
                setTimeout(function() {
                    broadcast.end();
                    channel.leave();
                }, time);
            })
            .catch(console.error);
    }

    // takes random picture and description and send on channel
    function selfie() {
        let totalAmountOfLanaSelfies = Object.keys(db.lana).length;
        let randomNumber = getRandomInt(1, totalAmountOfLanaSelfies);

        clientMessage.channel.send(outputFormatCode(db.lana[randomNumber]['descricao']), {
            "file": db.lana[randomNumber]['file']
        });
    }
}

function setRandomStatus(miliseconds, db) {
    let totalAmountOfLanaSelfies = Object.keys(db.lanaActions).length;

    client.setInterval(function() {
        // get random number at each function call
        let randomNumber = getRandomInt(1, totalAmountOfLanaSelfies);

        console.log(db.lanaActions[randomNumber]);
        client.user.setGame(db.lanaActions[randomNumber]);
    }, miliseconds);
}

///////////////////////////////////////////////////////////////////////////////
//                              Helper Functions                             //
///////////////////////////////////////////////////////////////////////////////

function outputFormatCode(string) {
    let newString = '```' + string + '```';
    return newString;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
