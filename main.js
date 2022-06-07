import tmi from "tmi.js";

import { startDb } from "./services/db.js";
import { removeAcento, randomIntFromInterval } from "./utils.js";
("./utils.js");
import { validExistUser } from "./controllers/user.js";
import { playPingPong } from "./games/pingpong.js";
import { playJokenpo } from "./games/jokenpo.js";

const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: process.env.USERBOT,
    password: process.env.PASSBOT,
  },
  channels: [process.env.CHANNEL],
});

// Global variables
const { globalUsers, db } = await startDb();
const userDay = [];

/*
const validExistUser = async (user) => {
  const existUser = globalUsers.find((u) => u.name === user);
  if (existUser) {
    return true;
  } else {
    const tmpUser = {
      name: user,
      points: 50,
    };
    globalUsers.push(tmpUser);
    await db.write();
  }
};*/

client.connect();

client.on("message", async (channel, tags, message, self) => {
  const dic = {
    "!help": "Comandos: !ping, !pong, !help",
    adeus: `Adeus @${tags.username}`,
    ola: `Ola @${tags.username}`,
    oi: `Oi @${tags.username}`,
    tchau: `Tchau @${tags.username}`,
    noite: `Boa noite @${tags.username}`,
    tarde: `Boa tarde @${tags.username}`,
    manha: `Bom dia @${tags.username}`,
    agua: `wasser trinken <3 @${tags.username}`,
    "<3": `<3 @${tags.username}`,
    "!onlyfans": `Já estamos a criar <3 Começa a juntar dinheiro ;) `,
  };

  //give points to user in wirte in chat per day
  const givePoint = async () => {
    await validExistUser(tags.username, globalUsers, db);
    //user write in chat today

    userDay.push(tags.username);
    const user = globalUsers.find((u) => u.name === tags.username);
    user.points += 20;
    db.write();
  };

  if (!userDay.includes(tags.username)) {
    givePoint();
  }
  if (message === "!points") {
    validExistUser(tags.username, globalUsers, db);
    const user = globalUsers.find((u) => u.name === tags.username);
    client.say(channel, `${tags.username} tem ${user.points} pontos :)`);
  }
  //top 10 user points
  if (message === "!top") {
    const top = globalUsers.sort((a, b) => b.points - a.points).slice(0, 3);
    const topString = top.map((u) => `${u.name} ${u.points} <3`).join("\n");
    client.say(channel, topString);
  }

  if (tags.username === "vitor66barbosa") {
    return;
  }

  message = removeAcento(message).toLowerCase();
  let args = message.split(" ");

  if (message === "!ping") {
    client.say(channel, playPingPong(tags.username));
  }

  if (tags.username === "resterino") {
    client.say(channel, `tá calado @${tags.username}, deves ser meio burro <3`);
  }

  /**
   * jokenpo game
   */

  const jokenpo = async (user) => {
    const rndInt = randomIntFromInterval(1, 3);
    const userName = tags.username;

    const trade = {
      1: "pedra",
      2: "papel",
      3: "tesoura",
    };
    await validExistUser(tags.username, globalUsers, db);

    const pcCurrent = trade[rndInt];
    const userCurrent = user;
    let userPoints = globalUsers.find((u) => u.name === userName).points;
    let resultGame = null;

    if (userCurrent === "!pedra") {
      if (pcCurrent === "tesoura") {
        userPoints = userPoints + 5;
        globalUsers.find((u) => u.name === userName).points = userPoints;
        resultGame = 1;
      }
      if (pcCurrent === "papel") {
        userPoints = userPoints - 5;
        globalUsers.find((u) => u.name === userName).points = userPoints;
        await db.write();
        resultGame = -1;
      }
      if (pcCurrent === "pedra") {
        resultGame = 0;
      }
    }

    if (userCurrent === "!papel") {
      if (pcCurrent === "tesoura") {
        userPoints = userPoints - 5;
        globalUsers.find((u) => u.name === userName).points = userPoints;
        resultGame = -1;
      }
      if (pcCurrent === "papel") {
        resultGame = 0;
      }
      if (pcCurrent === "pedra") {
        userPoints = userPoints + 5;
        globalUsers.find((u) => u.name === userName).points = userPoints;
        resultGame = 1;
      }
    }

    if (userCurrent === "!tesoura") {
      if (pcCurrent === "tesoura") {
        resultGame = 0;
      }
      if (pcCurrent === "papel") {
        userPoints = userPoints + 5;
        globalUsers.find((u) => u.name === userName).points = userPoints;
        resultGame = 1;
      }
      if (pcCurrent === "pedra") {
        console.log("perdeste");
        userPoints = userPoints - 5;
        globalUsers.find((u) => u.name === userName).points = userPoints;
        resultGame = -1;
      }
    }
    if (resultGame == 1) {
      client.say(
        channel,
        `Ganhaste @${tags.username} :)  || Tens ${userPoints} pontos`
      );
    } else if (resultGame == -1) {
      client.say(
        channel,
        `Perdeste @${tags.username} :( || Tens ${userPoints} pontos`
      );
    } else {
      client.say(
        channel,
        `Empate @${tags.username} :| || Tens ${userPoints} pontos`
      );
    }
    await db.write();
  };
  if (message === "!pedra" || message === "!papel" || message === "!tesoura") {
    //jokenpo(message);
    //return await playJokenpo(tags.username, message, globalUsers, db);
    client.say(
      channel,
      await playJokenpo(tags.username, message, globalUsers, db)
    );
  }
  args.map((message) => {
    if (dic[message]) {
      client.say(channel, dic[message]);
    }
  });
});
