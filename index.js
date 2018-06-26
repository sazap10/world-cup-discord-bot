const got = require('got');
const _ = require("lodash")
const moment = require("moment")
const bugsnag = require('bugsnag')
const Discord = require('discord.js')
const Table = require("ascii-table")
const cron = require('cron');

// Live Updates Cron Job
let liveStatChannelIds = [];
let liveMatchStats = [];
var cronJob = cron.job("0 */1 * * * *", async function () {
  try {
    console.info('Poll for goll..');
    const response = await got('http://worldcup.sfg.io/matches/current', {
      json: true
    })
    let message = ""
    const responseMatches = response.body
    responseMatches.forEach(newMatchStats => {
      let matchId = newMatchStats.home_team.code + newMatchStats.away_team.code
      let oldMatchStats = liveMatchStats.find(liveMatch => { return liveMatch.id == matchId })
      if (oldMatchStats) {
        // Check if score has changed to update feed
        if (oldMatchStats.homeGoals !== newMatchStats.home_team.goals || oldMatchStats.awayGoals !== newMatchStats.away_team.goals) {
          oldMatchStats.homeGoals = newMatchStats.home_team.goals
          oldMatchStats.awayGoals = newMatchStats.away_team.goals
          message += `Score Update: ${newMatchStats.time === "half-time" ? "HT" : newMatchStats.time} ${newMatchStats.home_team.country} ${newMatchStats.home_team.goals} - ${newMatchStats.away_team.goals} ${newMatchStats.away_team.country}\n`
        }
      } else {
        liveMatchStats.push({ id: matchId, homeGoals: newMatchStats.home_team.goals, awayGoals: newMatchStats.away_team.goals })
        message += `Match Started: ${newMatchStats.time === "half-time" ? "HT" : newMatchStats.time} ${newMatchStats.home_team.country} ${newMatchStats.home_team.goals} - ${newMatchStats.away_team.goals} ${newMatchStats.away_team.country}\n`
      }
    });

    if (message.length > 0) {
      liveStatChannelIds.forEach(channelId => {
        client.channels.get(channelId).send(message.substr(0, 1000) + "...");
      })
    }
  } catch (error) {
    bugsnag.notify(error)
    return ""
  }
});


const client = new Discord.Client()

bugsnag.register('798eae4f2af02969a3415e42d361600c')

const token = process.env.DISCORD_TOKEN
const prefix = process.env.DISCORD_BOT_PREFIX || "!world-cup"

let cache = {
  "matches": null,
  "today": null,
  "tomorrow": null,
  "groupResults": null,
  "current": null
}

async function dateMatches(date, title) {
  try {
    let url = "http://worldcup.sfg.io/matches"
    let cacheIndex = "matches"
    if (date === "today") {
      url = "http://worldcup.sfg.io/matches/today"
      cacheIndex = "today"
    } else if (date === "tomorrow") {
      url = "http://worldcup.sfg.io/matches/tomorrow"
      cacheIndex = "tomorrow"
    }
    let responseMatches = null
    if (!cache[cacheIndex] || moment().diff(cache[cacheIndex].lastUpdated, 'minutes') >= 1){
      const response = await got(url, {
        json: true
      })
      responseMatches = response.body
      cache[cacheIndex] = { data: responseMatches, lastUpdated: moment()}
    } else {
      console.log("Using cache")
      responseMatches = cache[cacheIndex].data
    }

    let message = `Matches ${title}:\n`
    if (responseMatches.length === 0) {
      message = `No matches on ${title}\n`
    } else {
      const parsedDate = moment(date, "DD-MM-YYYY")

      if (parsedDate.isValid()) {
        responseMatches = _.filter(responseMatches, o => moment(o.dateime).isSame(parsedDate, "day"))
      }

      matchesMessage = generateDateMatchesMessage(responseMatches)
      message += matchesMessage
    }

    return message
  } catch (error) {
    bugsnag.notify(error)
    return ""
  }
}

function generateDateMatchesMessage(matches) {
  let message = ""
  matches.forEach(match => {
    startTime = moment(match.datetime).format("HH:mm")
    score_message = ""
    switch (match.status) {
      case "in progress":
        score_message = `, currently playing: ${match.time === "half-time" ? "HT" : match.time} ${match.home_team.goals} - ${match.away_team.goals}`
        break
      case "completed":
        score_message = ` FT ${match.home_team.goals} - ${match.away_team.goals}`
        break
      default:
        break
    }
    message += `${startTime}: ${match.home_team.country} vs ${match.away_team.country} @ ${match.location}, ${match.venue}${score_message}\n`
  });
  return message
}

async function currentMatches() {
  try {
    message = ""
    let responseMatches = null
    if (!cache["current"] || moment().diff(cache["current"].lastUpdated, 'minutes') >= 1){
      const response = await got('http://worldcup.sfg.io/matches/current', {
        json: true
      })
      responseMatches = response.body
      cache["current"] = { data:responseMatches, lastUpdated: moment()}
    } else {
      console.log("Using cache")
      responseMatches = cache["current"].data
    }
    
    responseMatches.forEach(match => {
      message += `${match.time === "half-time" ? "HT" : match.time} ${match.home_team.country} ${match.home_team.goals} - ${match.away_team.goals} ${match.away_team.country}\n`
    });

    if (message === "") {
      message = "No matches currently."
    }
    return message
  } catch (error) {
    bugsnag.notify(error)
    return ""
  }
}

async function countrySchedule(countryOrCode) {
  return "WIP"
}

async function groups() {
  try {
    messages = []

    let responseBody = null
    if (!cache["groupResults"] || moment().diff(cache["groupResults"].lastUpdated, 'minutes') >= 1){
      const response = await got('http://worldcup.sfg.io/teams/group_results', {
        json: true
      })
      responseBody = response.body
      cache["groupResults"] = { data:responseBody, lastUpdated: moment()}
    } else {
      console.log("Using cache")
      responseBody = cache["groupResults"].data
    }

    responseBody.forEach(item => {
      const group = item.group.teams.map(g => [
        g.team.country,
        g.team.points,
        g.team.goal_differential
      ])

      const json = {
        title: `Group ${item.group.letter}`,
        heading: ["Team", "Points", "Goal Difference"],
        rows: group
      }
      var table = new Table().fromJSON(json)
      messages.push("```" + table.toString() + "```")
    })
    return messages
  } catch (error) {
    bugsnag.notify(error)
    return []
  }
}

client.on("ready", () => {
  // This event will run if the bot starts, and logs in, successfully.
  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
  // Example of changing the bot's playing game to something useful. `client.user` is what the
  // docs refer to as the "ClientUser".
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildCreate", guild => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});

client.on("guildDelete", guild => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`Serving ${client.guilds.size} servers`);
});


client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length + 1).split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === 'today') {
    (async function () {
      todayMatches = await dateMatches("today", "today");
      message.channel.send(todayMatches);
    })();
  } else if (command === 'tomorrow') {
    (async function () {
      matchesTomorrow = await dateMatches("tomorrow", "tomorrow");
      message.channel.send(matchesTomorrow);
    })();
  } else if (command === 'current') {
    (async function () {
      matchesCurrentlyPlayed = await currentMatches();
      message.channel.send(matchesCurrentlyPlayed);
    })();
  } else if (command === 'groups') {
    (async function () {
      groupsOutput = await groups();
      groupsOutput.forEach(groupMessage => {
        message.channel.send(groupMessage);
      })
    })();
  } else if (command === 'country') {
    (async function () {
      countryOrCode = args.shift().toLowerCase()
      if (countryOrCode == null) {
        message.channel.send("Please enter a country name or FIFA code(3 letter)");
      } else {
        countryOutput = await countrySchedule(countryOrCode);
        message.channel.send(countryOutput);
      }
    })();
  } else if (command === 'live') {
      let thisChannel = liveStatChannelIds.find(channelId => { return channelId == message.channel.id });

      if (thisChannel) {
        liveStatChannelIds.splice(liveStatChannelIds.indexOf(liveStatChannelIds.find(channelId => { return channelId == thisChannel.id })))
        message.channel.send("Live updates disabled.");
      } else {
        liveStatChannelIds.push(message.channel.id);
        message.channel.send("Live updates enabled!");
      }
      console.log("Live update channel update...")
      console.log(JSON.stringify(liveStatChannelIds, null, 2))
  }
});

client.login(token);
cronJob.start();

const http = require('http');
const requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Hello, World!\n');
}

var server = http.createServer(requestListener);
server.listen(8080);
