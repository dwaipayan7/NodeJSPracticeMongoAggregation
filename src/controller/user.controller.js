import * as UserService from "../services/user.service.js";

export const createUser = async (req, res, next) => {
  try {
    const result = await UserService.createUser(req.body);

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
