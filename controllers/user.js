export const validExistUser = async (user,globalUsers,db) => {
    const existUser = globalUsers.find((u) => u.name === user);
    if (!existUser) {
       await createUser(user,globalUsers,db);
    }
    return true 
}

export const createUser = async (user,globalUsers,db) => {
    const tmpUser = {
        name: user,
        points: 50,
      };
      globalUsers.push(tmpUser);
      await db.write();
      return true;
}