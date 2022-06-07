import { Low, JSONFile } from "lowdb";
import "dotenv/config";

export const startDb = async () => {
  const adapter = new JSONFile("./db.json");
  const db = new Low(adapter);
  await db.read();
  console.log("start");
  console.log(db.data);
  db.data ||= { users: [] };
  const { users } = db.data;
  const globalUsers = users;

  return { globalUsers, db };
};
