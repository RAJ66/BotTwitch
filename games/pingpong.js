import { randomIntFromInterval } from "../utils.js";

export const playPingPong = (userName) => {
  const rndInt = randomIntFromInterval(1, 2);
  if (rndInt == 1) {
    return `!pong @${userName}`;
  } else {
    return `ganhaste @${userName} :( `;
  }
};
