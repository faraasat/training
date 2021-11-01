import { handleError } from "./../helpers/error";
import jwt from "jsonwebtoken";

export const validateToken = async (token: string) => {
  try {
    token = token.split(" ")[1];
    const isTokenVerified = await jwt.verify(
      token,
      process.env.JWT_SECRET_STRING!
    );
    return isTokenVerified;
  } catch (error) {
    handleError(error, "Token is Invalid", 401);
  }
};
