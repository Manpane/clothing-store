const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function deleteUser(req, res) {
  try {
    const userId = parseInt(req.params.id);
    await prisma.user.delete({
      where: { id: userId },
    });
    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

async function updateUser(req, res) {
  try {
    const userId = req.params.id;
    let { username, email, password } = req.body;
    
    if (!username && !email && !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "No fields provided for update" });
    }
    if (password)
    {
      const salt = bcrypt.genSaltSync(10);
      password = bcrypt.hashSync(password, salt);
    }
    const data = {};
    if (username) data.username = username;
    if (email) data.email = email;
    if (password) data.password = password;

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(userId) },
      data,
    });

    return res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

async function getProfileById(req, res) {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "User not found" });
    }
    delete newUser.password;
    delete newUser.resetPin;
    delete newUser.resetPinExpiration;
    delete newUser.otp;

    return res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    console.error("Error getting user profile by ID:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

async function getProfilesAll(req, res) {
  try {
    const users = await prisma.user.findMany();
    return res.json(users);
  } catch (error) {
    console.error("Error getting all user profiles:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}


const getMyProfile = async (req, res) => {
  const userId = req.userId;
  const user = await prisma.user.findUnique({

    where: { id: userId },
  });
  if (!user) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json({ error: "User not found" });
  }

  delete user.password;
  delete user.resetPin;
  delete user.resetPinExpiration;
  delete user.otp;

  return res.status(StatusCodes.OK).json({ profile: user });
}

const updateMyProfile = async (req, res) => {
  const { username, profilePicture, contact, address } = req.body;
  const updated = await prisma.user.update({
    where: { id: req.userId },
    data: {
      username,
      profilePicture,
      contact,
      address,
    }
  });

  delete updated.password;
  delete updated.resetPin;
  delete updated.resetPinExpiration;
  delete updated.otp;

  return res.status(StatusCodes.OK).json({ profile: updated });
}

module.exports = { getProfileById, updateUser, deleteUser, getProfilesAll, getMyProfile, updateMyProfile };
