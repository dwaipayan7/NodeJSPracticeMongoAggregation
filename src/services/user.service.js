import User from "../model/user.model.js";

export const createUser = async (payload) => {
  const existingUser = await User.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    name: payload.name,
    email: payload.email,
    city: payload.city,
    age: payload.age,
  });

  return user;
};
