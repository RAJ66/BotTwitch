import { randomIntFromInterval } from "../utils.js";
import { validExistUser } from "../controllers/user.js";
const trade = {
  1: "pedra",
  2: "papel",
  3: "tesoura",
};

export const playJokenpo = async (userName, userPlay, globalUsers, db) => {
  const rndInt = randomIntFromInterval(1, 3);
  const pcCurrent = trade[rndInt];
  const userCurrent = userPlay;
  let userPoints = globalUsers.find((u) => u.name === userName).points;
  let resultGame = null;
  await validExistUser(userName, globalUsers, db);

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
  await db.write();

  if (resultGame == 1) {
    return `Ganhaste @${userName} :)  || Tens ${userPoints} pontos`;
  } else if (resultGame == -1) {
    return `Perdeste @${userName} :( || Tens ${userPoints} pontos`;
  } else {
    return `Empate @${userName} :| || Tens ${userPoints} pontos`;
  }
};
