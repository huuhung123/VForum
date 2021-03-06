import jwt from "jsonwebtoken";

export const generateToken = async (
  user: any,
  secretSignature: string,
  tokenLife: string
) => {
  return new Promise((resolve, reject) => {
    const userData = {
      _id: user._id,
      email: user.email,
      role: user.role,
      display_name: user.display_name,
      gender: user.gender,
      avatar: user.avatar,
    };

    jwt.sign(
      userData,
      secretSignature,
      {
        algorithm: "HS256",
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        resolve(token);
      }
    );
  });
};

export const verifyToken = (token: string, secretKey: string) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, (error, decoded) => {
      if (error) {
        return reject(error);
      }
      resolve(decoded);
    });
  });
};
