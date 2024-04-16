const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { StatusCodes } = require("http-status-codes");

function verifyToken(req, res, next) {
  let token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Token not provided" });
  }
  token = token.substring(7);
  jwt.verify(token, process.env.JWT_SECRET, (err, data) => {
    if (err) {
      return res.status(StatusCodes.FORBIDDEN).json({ error: "Invalid token" });
    }
    req.userId = parseInt(data.userId);
    next();
  });
}

const verifyAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
    if (user.role === "admin") {
      next();
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User needs to be admin" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const emailVerified = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
    if (user.emailVerified) {
      next();
    } else {
      return res.status(StatusCodes.FORBIDDEN).json({ error: "Email not verified!" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};
const verifySuperAdmin = async (req, res, next) => {
  try {
    const userId = req.userId;
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });
    if (!user) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "User not found" });
    }
    if (user.role === "super_admin") {
      next();
    } else {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User needs to be super_admin" });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};


module.exports = {
  verifyToken,
  verifyAdmin,
  emailVerified,
  verifySuperAdmin,
};
