(async()=>{
    // default imports
    const events = require('events');
    const { exec } = require("child_process")
    const logs = require("discord-logs")
    const Discord = require("discord.js")
    const { 
        MessageEmbed, 
        MessageButton, 
        MessageActionRow, 
        Intents, 
        Permissions, 
        MessageSelectMenu 
    }= require("discord.js")
    const fs = require('fs');
    let process = require('process');
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // block imports
    const os = require("os-utils");
    let Invite = require("discord-inviter-tracker")
    let URL = require('url')
    const ms = require("ms")
    let https = require("https")
    const synchronizeSlashCommands = require('@frostzzone/discord-sync-commands');
    
    // define s4d components (pretty sure 90% of these arnt even used/required)
    let s4d = {
        Discord,
        fire:null,
        joiningMember:null,
        reply:null,
        player:null,
        manager:null,
        Inviter:null,
        message:null,
        notifer:null,
        checkMessageExists() {
            if (!s4d.client) throw new Error('You cannot perform message operations without a Discord.js client')
            if (!s4d.client.readyTimestamp) throw new Error('You cannot perform message operations while the bot is not connected to the Discord API')
        }
    };

    // check if d.js is v13
    if (!require('./package.json').dependencies['discord.js'].startsWith("^13.")) {
      let file = JSON.parse(fs.readFileSync('package.json'))
      file.dependencies['discord.js'] = '^13.16.0'
      fs.writeFileSync('package.json', JSON.stringify(file, null, 4))
      exec('npm i')
      throw new Error("Seems you arent using v13. Please re-run or run `npm i discord.js@13.16.0`");
    }

    // check if discord-logs is v2
    if (!require('./package.json').dependencies['discord-logs'].startsWith("^2.")) {
      let file = JSON.parse(fs.readFileSync('package.json'))
      file.dependencies['discord-logs'] = '^2.0.0'
      fs.writeFileSync('package.json', JSON.stringify(file, null, 4))
      exec('npm i')
      throw new Error("The package 'discord-logs' must be 2.0.0. Please re-run, or if that fails, run `npm i discord-logs@2.0.0` then re-run");
    }

    // create a new discord client
    s4d.client = new s4d.Discord.Client({
        intents: [
            Object.values(s4d.Discord.Intents.FLAGS).reduce((acc, p) => acc | p, 0)
        ],
        partials: [
            "REACTION", 
            "CHANNEL"
        ]
    });

    // when the bot is connected say so
    s4d.client.on('ready', () => {
        console.log(s4d.client.user.tag + " is online.")
    })

    // upon error print "Error!" and the error
    process.on('uncaughtException', function (err) {
        console.log('Error!');
        console.log(err);
    });

    // give the new client to discord-logs
    logs(s4d.client);

    // pre blockly code
    s4d.Inviter = new Invite(s4d.client)
    s4d.Inviter.on("WARN",function(e){
        console.log('WARN: '+e)
    })

    // blockly code
    var member, server;
    
    // Check for if the member is a admin or moderator
    function is_member_administrator(member, server) {
      server.roles.cache.forEach(async (ro) =>{
         if (((ro).permissions.has('MODERATE_MEMBERS')) && (member._roles.includes((ro).id)) || member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
          return true;
        }
    
      })
      return false;
    }
    
    function colourRgb(r, g, b) {
      r = Math.max(Math.min(Number(r), 100), 0) * 2.55;
      g = Math.max(Math.min(Number(g), 100), 0) * 2.55;
      b = Math.max(Math.min(Number(b), 100), 0) * 2.55;
      r = ('0' + (Math.round(r) || 0).toString(16)).slice(-2);
      g = ('0' + (Math.round(g) || 0).toString(16)).slice(-2);
      b = ('0' + (Math.round(b) || 0).toString(16)).slice(-2);
      return '#' + r + g + b;
    }
    
    
    synchronizeSlashCommands(s4d.client, [
      {
          name: 'help',
      		description: 'This command will show you the list of the bot\'s commands.',
      		options: [
    
          ]
      },{
          name: 'usdtorobux',
      		description: 'This command will convert USD to Robux.',
      		options: [
              {
            type: 10,
        	name: 'amount',
            required: true,
        	description: 'The amount you are converting into Robux.',
            choices: [
    
            ]
        },
          ]
      },{
          name: 'robuxtousd',
      		description: 'This command will convert Robux to USD.',
      		options: [
              {
            type: 10,
        	name: 'amount',
            required: true,
        	description: 'The amount you are converting into USD.',
            choices: [
    
            ]
        },
          ]
      },{
          name: 'cat',
      		description: 'Find some cute cat pictures.',
      		options: [
    
          ]
      },{
          name: 'dog',
      		description: 'Find some cute dog pictures.',
      		options: [
    
          ]
      },{
              name: 'capybara',
                description: 'Find some cute capybara pictures.',
                options: [

              ]
          },
    ],{
        debug: false,
    
    });
    
    s4d.client.on('ready', async () => {
      s4d.client.user.setPresence({status: "dnd",activities:[{name:'Warp Inc. Labs',type:"PLAYING"}]});
    
    });
    
    s4d.client.on('interactionCreate', async (interaction) => {
              if ((interaction.commandName) == 'usdtorobux') {
        let robux = ((interaction.options.getInteger('amount')) * 80);
        var resultsembed = new Discord.MessageEmbed();
           resultsembed.setColor((colourRgb(0, 120, 190)));
          resultsembed.setTitle(String('USD to Robux'))
           resultsembed.setURL(String());
          resultsembed.addField(String('__Requested by__'), String((interaction.member)), false);
          resultsembed.addField(String('__Robux Converted__'), String(robux), false);
                 
    
        await interaction.reply({embeds: [resultsembed], ephemeral: false, components: [] });
      } else if ((interaction.commandName) == 'robuxtousd') {
        let usd = ((interaction.options.getInteger('amount')) / 80);
        var resultsembed = new Discord.MessageEmbed();
           resultsembed.setColor((colourRgb(0, 120, 190)));
          resultsembed.setTitle(String('Robux to USD'))
           resultsembed.setURL(String());
          resultsembed.addField(String('__Requested by__'), String((interaction.member)), false);
          resultsembed.addField(String('__Robux Converted__'), String(robux), false);
    
        await interaction.reply({embeds: [resultsembed], ephemeral: false, components: [] });
      } else if ((interaction.commandName) == 'cat') {
        eval(`const API_KEY = process.env[String("CATAPI_KEY")]
                           const url = "https://api.thecatapi.com/v1/images/search";
                               fetch(url,{headers: {
                                 'x-api-key': API_KEY
                               }})
                               .then((response) => {
                                 return response.json();
                               })
                               .then((data) => {
                                      data.map(function(finaldata) {
                                          interaction.reply({ content: ("Meow! Here's a picture of a cat: " + String(finaldata.url)), ephemeral: false, components: [] })
                                      })
                               .catch(function(error) {
                                    interaction.reply({ content: "Oops! Something went wrong while getting the cat image.", ephemeral: false, components: [] });
                               })
                             })`);
            } else if ((interaction.commandName) == 'dog') {
                  const url = fetch("https://dog.ceo/api/breeds/image/random")
                    .then(function(response) {
                       return response.json();
                    })
                    .then(function(data) {
                                interaction.reply({ content: (`Woof Woof! Heres a picture of a dog [Woof!](${data.message}) :`), ephemeral: false, components: [] })
                    })
                    .catch(function (err) {
                        console.error(err)
                    })
            } else if ((interaction.commandName) == 'capybara'){
                  const url = fetch("https://api.capy.lol/v1/capybara?json=true")
                    .then(function(response) {
                       return response.json();
                    })
                    .then(function(data) {
                                interaction.reply({ content: (`Here's a picture of a capybara [Original Image!](${data.data.url}) :`), ephemeral: false, components: [] })
                    })
                    .catch(function (err) {
                        console.error(err)
                    })
            } else if ((interaction.commandName) == 'help') {
        var embed1 = new Discord.MessageEmbed();
           embed1.setColor((colourRgb(0, 120, 190)));
          embed1.setTitle(String('Commands'));
            embed1.setDescription(String("Here's the list of the bot's commands. \n If a command doesn't show up, try restarting your Discord app."))
           embed1.setURL(String());
          embed1.addField(String('Meta'), String((['/robuxtousd', '/usdtorobux', '/rules', '/image'].join('\n'))), true);
          embed1.addField(String('Animals'), String((['/capybara', '/dog', '/cat'].join('\n'))), true);
    
        await interaction.reply({embeds: [embed1], ephemeral: true, components: [] });
      }
    
        });
    
    s4d.Inviter.on('UserInvited', async function(member, uses, inviter, invite) {
        if (((member.guild).id) == '1052390237701152888') {
            var welcomerdms = new Discord.MessageEmbed();
            welcomerdms.setColor('#6666cc');
            welcomerdms.setTitle(String('Welcome'))
            welcomerdms.setURL(String());
            welcomerdms.setDescription(String((['Welcome to the Warp Inc. Server,', (member).username, '! Make sure to read the rules and have a good time! -Berge99075 \n -# (This message was sent automatically)'].join(''))));

            var welcomerserver = new Discord.MessageEmbed();
            welcomerserver.setColor('#6666cc');
            welcomerserver.setTitle(String('Welcome'))
            welcomerserver.setURL(String());
            welcomerserver.setDescription(String((['<@', (member).id, '> has joined the server. Make sure to read the <#1179859922020732978> and have fun!'].join(''))));

            (member).send({
                embeds: [welcomerdms]
            }).then(msg => {
                msg.channel.awaitMessages(response => response.content, {
                    time: (5 * 60 * 1000),
                    max: 1,
                    errors: ['time']
                }).then(async (collected) => {
                    s4d.reply = collected.first().content;

                    s4d.reply = null;
                }).catch(async (e) => {
                    console.error(e);
                })
            });
            s4d.client.channels.cache.get('1179859395706884286').send({
                embeds: [welcomerserver]
            });
        }

    });
    
    await s4d.client.login((process.env[String('token')])).catch((e) => {
            const tokenInvalid = true;
            const tokenError = e;
            if (e.toString().toLowerCase().includes("token")) {
                throw new Error("An invalid bot token was provided!")
            } else {
                throw new Error("Privileged Gateway Intents are not enabled! Please go to https://discord.com/developers and turn on all of them.")
            }
        });
    
    return s4d
})();
