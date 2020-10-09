

const http = require('http');
const express = require('express');
const app = express();
var server = http.createServer(app);

app.get("/", (request, response) => {
  console.log(`Ping Received.`);
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end("FORTNITE WORKING")
});

const listener = server.listen(process.env.PORT, function() {
  console.log(`Your app is listening on port ` + listener.address().port);
});
setInterval(() => {
  http.get(`http://fortnite-bot.dbdandand.repl.co`);
}, 280000);


const { TOKEN, PREFIX } = require("./config.json");
const discord = require("discord.js")
const fortnite = require("fortnite-9812")
const bot = new discord.Client()
const canvas = require("discord-canvas")
sho = new canvas.FortniteShop();
const db = require("quick.db")
const prefix = PREFIX";

const langdb = require("./language.json")

const client = new fortnite.Client({
  fnbrToken: "531e12b6-4ab4-417d-9eb1-39ca2789229d",
  TRN: "3533192f-66bc-48b2-8df9-c03bfeb75958"
})

bot.on("ready", async () => {
  let data = await client.fnbrShop()
  var array = data.data.date;
  

  bot.user.setActivity("f!help | " + bot.guilds.cache.size + " Servers")
  setInterval(function() {


    bot.user.setActivity("f!help | " + bot.guilds.cache.size + " Servers")
    client.fnbrShop()
      .then(async shop => {
        

        if (shop.data.date !== array) {

          let shopdb = db.get("shopdb")
          const image = await sho
            .setToken("531e12b6-4ab4-417d-9eb1-39ca2789229d")
            .setText("footer", "")
            .toAttachment();

          let attachment = new discord.MessageAttachment(image, "FortniteShop.png");

          shopdb.forEach(m => {
            let channel = bot.channels.cache.get(m.channel)

            if(!channel) return;
           channel.send(attachment).catch(m => console.log("SHOP ERROR : " + m.id))
          })
          array = shop.data.date;
        }
      })
  }, 60000)

})


bot.on("message", async message => {


  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === "shop") {
    let tar;

    if (args[0] === "daily" || args[0] === "d") {
      tar = "daily"
    } else if (args[0] === "featured" || args[0] === "f") {
      tar = "featured"
    } else if (args[0] === "upcoming" || args[0] === "u") {
      tar = "upcoming"
    } else {
      return send(giveLang(message, "SHOP_WARNING_1"), message, "BLUE")
    }


    let data;

    if (tar !== "upcoming") {
      data = await client.fnbrShop()
      data = data.data[tar]
    } else {
      data = await client.fnbrUpcoming()
      data = data.data;
    }


    if (!data) {
      return send(giveLang(message, "SHOP_WARNING_2"), message, "YELLOW")
    }
    let limit = Math.floor(data.length / 1)
    var pg = 0;


    var funemb = new discord.MessageEmbed()
      .setAuthor(data[pg].name, data[pg].priceIconLink)
      .setThumbnail(data[pg].images.icon)
      .setDescription(data[pg].description)

      .addField(giveLang(message, "PRICE"), "**" + data[pg].price + "** " + data[pg].priceIcon)
      .addField(giveLang(message, "RARITY"), data[pg].rarity)
      .addField(giveLang(message, "TYPE"), data[pg].type)
      .setColor("BLUE");
    if (data[pg].bannerText) funemb.setFooter(data[pg].bannerText)
    const msg = await message.channel.send(funemb);


    msg.react("⬅️");
    await msg.react("➡️");

    const collector = msg.createReactionCollector(
      // only collect left and right arrow reactions from the message author
      (reaction, user) =>
        ["⬅️", "➡️"].includes(reaction.emoji.name) &&
        user.id === message.author.id,
      // time out after a minute
      { time: 60000 }
    );

    collector.on("collect", reaction => {

      msg.reactions.removeAll().then(async () => {
        if (reaction.emoji.name === "➡️") {


          if (!data[pg + 1]) {
            pg = pg
          } else {
            pg = pg + 1
          }
          funemb = new discord.MessageEmbed()
            .setAuthor(data[pg].name, data[pg].priceIconLink)
            .setThumbnail(data[pg].images.icon)
            .setDescription(data[pg].description)

            .addField(giveLang(message, "PRICE"), "**" + data[pg].price + "** " + data[pg].priceIcon)
            .addField(giveLang(message, "RARITY"), data[pg].rarity)
            .addField(giveLang(message, "TYPE"), data[pg].type)
            .setColor("BLUE")
          if (data[pg].bannerText) funemb.setFooter(data[pg].bannerText)

          msg.edit(funemb)

          msg.react("⬅️");
          await msg.react("➡️");
        }

        else if (reaction.emoji.name === "⬅️") {


          if (!data[pg - 1]) {

            pg = pg
          } else {
            pg = pg - 1
          }

          funemb = new discord.MessageEmbed()
            .setAuthor(data[pg].name, data[pg].priceIconLink)
            .setThumbnail(data[pg].images.icon)
            .setDescription(data[pg].description)

            .addField(giveLang(message, "PRICE"), "**" + data[pg].price + "** " + data[pg].priceIcon)
            .addField(giveLang(message, "RARITY"), data[pg].rarity)
            .addField(giveLang(message, "TYPE"), data[pg].type)
            .setColor("BLUE")
          if (data[pg].bannerText) funemb.setFooter(data[pg].bannerText)
          msg.edit(funemb)

          msg.react("⬅️");
          await msg.react("➡️");
        }
      })

    })


    collector.on('end', collected => {
      if (msg) {
        msg.reactions.removeAll()
      }
    });

  } else if (command === "stats") {


    if (!args[0]) {
      return send(giveLang(message, "STATS_WARNING_1"), message, "BLUE")
    }

    stats = new canvas.FortniteStats();

    const user = args.join(" "),
      platform = "pc";
    let image = await stats
      .setToken("3533192f-66bc-48b2-8df9-c03bfeb75958")
      .setUser(user)
      .setPlatform(platform)
      .setText("footer", "")
      .toAttachment();



    if (platform !== "pc" && platform !== "xbl" && platform !== "psn") return send(giveLang(message, "STATS_WARNING_2"), message, "BLUE")

    let msg = await message.channel.send({ embed: { "description": giveLang(message, "STATS_WAITING"), "color": "BLUE" } })
    if (!image) return msg.edit({ embed: { "description": giveLang(message, "STATS_ERROR"), "color": "BLUE" } })

    let attachment = new discord.MessageAttachment(image.toBuffer(), "FortniteStats.png");
    msg.delete()

    message.channel.send(attachment);




  } else if (command === "lang") {

    if (args[0]) {

      if (langdb[args[0].toLowerCase()]) {

        send("Changed bot language to **" + args[0].toLowerCase() + "**", message, "BLUE")
        db.set(`lang_${message.guild.id}`, args[0].toLowerCase())

      } else {
        return send("Given langauge is not availabe, the langauge that we have is : `english`, `german`, `hindi`, `japanese`, `polish`, `swedish`", message, "BLUE")
      }

    } else {
      let languages = db.get(`lang_${message.guild.id}`)

      if (!languages) {
        return send("You did not seted any language yet so its english as default, to set language use `f!lang <name>`", message, "BLUE")
      }

      return send("Your current language is **" + languages + "**", message, "BLUE")

    }
  } else if (command === "addshop") {


    if(!message.member.hasPermission("ADMINISTRATOR")) {
      return send(giveLang(message, "ADMIN_ONLY"), message, "BLUE")
    }
    let shopdb = db.get("shopdb")
    if (!shopdb) shopdb = []

    let person = shopdb.find(x => x.id === message.guild.id)
    if (person) {
      let value = shopdb.indexOf(person)
      let mention = message.mentions.channels.first()
      if (!mention) {
        return send(giveLang(message, "ADD_SHOP_1"), message, "BLUE")
      }
      shopdb[value].channel = mention.id

      db.set("shopdb", shopdb)
      return send(giveLang(message, "ADD_SHOP_2"), message, "BLUE")

    }

    let mention = message.mentions.channels.first()
    if (!mention) {
      return send(giveLang(message, "ADD_SHOP_1"), message, "BLUE")
    }

    db.push("shopdb", { id: message.guild.id, channel: mention.id })

    return send(giveLang(message, "ADD_SHOP_2"), message, "BLUE")
  } else if (command === "invite") {
    return send(giveLang(message, "INVITE") + ": **[FORTNITE BOT](https://discord.com/api/oauth2/authorize?client_id=747698978765668355&permissions=8&scope=bot)**", message, 'BLUE')
  } else if(command === "help") {
    return send(giveLang(message, "HELP") + ": `f!help`, `f!shop`, `f!lang`, `f!stats`, `f!addshop`, `f!invite`", message, "BLUE")
  }

})





bot.login(TOKEN)


//---------------------------------- F U N C T I O N S ----------------------------------------------

function send(content, message, color) {

  if (!color) color = "RED";

  return message.channel.send({ embed: { "description": content, "color": color } })

}

function giveLang(message, content) {
  let lang = db.get(`lang_${message.guild.id}`)

  if (!lang) lang = "english";

  return langdb[lang][content];
}
