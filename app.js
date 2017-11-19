// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

bot.dialog('turnOn', [
    function (session, args, next) {
        console.log(args.intent);

        if(args.intent != null && args.intent.intent == 'HomeAutomation.TurnOn') {
            if(args.intent.entities != null && args.intent.entities[0].type == 'HomeAutomation.Room') {
                session.endDialog('Ok, j\'allume les lumières de ' + args.intent.entities[0].entity);
            }
            session.endDialog('Ok, j\'allume la lumière');
        }
        session.endDialog('Désole, je n\'ai pas compris');
    }
]).triggerAction({
    matches: 'HomeAutomation.TurnOn'
});

bot.dialog('turnOff', [
    function (session, args, next) {

        console.log(args.intent);

        if(args.intent != null && args.intent.intent == 'HomeAutomation.TurnOff') {
            if(args.intent.entities != null && args.intent.entities[0].type == 'HomeAutomation.Room') {
                session.endDialog('Ok, j\'eteins les lumières de ' + args.intent.entities[0].entity);
            }
            session.endDialog('Ok, j\'eteins la lumière');
        }
        session.endDialog('Désole, je n\'ai pas compris');
    }
]).triggerAction({
    matches: 'HomeAutomation.TurnOff',
    onInterrupted: function (session) {
        session.send('');
    }
});