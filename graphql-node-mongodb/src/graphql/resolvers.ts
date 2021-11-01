import { validateToken } from "./../middlewares/jwt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { ISignup, ILogin, IDeleteUser, IUpdateUser } from "../@types/resolvers";
import { handleError } from "./../helpers/error";
import User from "../models/user";

export default {
  login: async ({ userLoginInput }: { userLoginInput: ILogin }) => {
    try {
      const { password, email } = userLoginInput;
      const user = await User.findOne({ email: email });
      if (!user) return handleError("User Not Found", "User Not Found", 404);
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid)
        return handleError(
          "Authentication Failed",
          "Authentication Failed",
          401
        );
      const { _id, username } = user;
      const token = `bearer ${jwt.sign(
        { _id, username, email },
        process.env.JWT_SECRET_STRING!,
        { expiresIn: "1d" }
      )}`;
      return { _id: _id, token: token };
    } catch (error) {
      throw error;
    }
  },
  signup: async ({ userCreateInput }: { userCreateInput: ISignup }) => {
    try {
      const { username, password, email } = userCreateInput;
      const hashedPassword = await bcrypt.hash(password, 14);
      const user = new User({
        username: username,
        passwordHash: hashedPassword,
        email: email,
      });
      const { _id } = await user.save();
      return _id.toString();
    } catch (error) {
      throw error;
    }
  },
  updateUser: async ({ userUpdateInput }: { userUpdateInput: IUpdateUser }) => {
    try {
      const { id, token, username, password, email } = userUpdateInput;
      const validatedToken: any = await validateToken(token);
      if (validatedToken!._id !== id)
        return handleError(
          "Authentication Failed",
          "Authentication Failed",
          401
        );
      const user = await User.findById(id).select(
        "username email passwordHash"
      );
      const hashedPassword = await bcrypt.hash(password, 14);
      const updatedUser = await User.findByIdAndUpdate(id, {
        username: username || user.username,
        email: email || user.email,
        passwordHash: hashedPassword || user.passwordHash,
      });
      const tokenObj = {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
      };
      const newToken = `bearer ${jwt.sign(
        tokenObj,
        process.env.JWT_SECRET_STRING!,
        { expiresIn: "1d" }
      )}`;
      return { _id: updatedUser._id, token: newToken };
    } catch (error) {
      throw error;
    }
  },
  deleteUser: async ({ userDeleteInput }: { userDeleteInput: IDeleteUser }) => {
    try {
      const { id, token } = userDeleteInput;
      const validatedToken: any = await validateToken(token);
      if (validatedToken!._id !== id)
        return handleError(
          "Authentication Failed",
          "Authentication Failed",
          401
        );
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser)
        return handleError("User Not Found", "User Not Found", 404);
      return id;
    } catch (error) {
      throw error;
    }
  },
};
