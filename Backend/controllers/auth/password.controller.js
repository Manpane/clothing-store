const { PrismaClient } = require("@prisma/client");
const { StatusCodes } = require("http-status-codes");
const { forget_password_boilerplate } = require("../boilerplates.data");
const { sendEmail } = require("../../services/email.services");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const generatePin = (req, res) => {
  return Math.floor(100000 + Math.random() * 900000);
};

const sendPin = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide email" });
  }
  try {
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "No user found with this email" });
    }

    const pin = generatePin();

    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const updateUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPin: pin.toString(),
        resetPinExpiration: expirationTime,
      },
    });

    const boilerPlate = forget_password_boilerplate(
      pin.toString(),
      user.username,
    );
    const result = await sendEmail(email, boilerPlate, "Forget Password");
    if (result.success) {
      res.status(StatusCodes.OK).json({
        msg: "Pin sent to your email!",
      });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({
        error: "Error sending email!",
        msg: result.error,
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
};

const verifyPin = async (req, res) => {
  const { pin, email } = req.body;
  const user = await prisma.user.findFirst({
    where: { email, resetPin: pin.toString() },
  });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid pin" });
  }
  const now = Date.now();
  if (user.resetPinExpiration < now) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: "Pin expired" });
  }
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: {
      resetPin: "",
      resetPinExpiration: new Date(0),
    },
  });
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.status(StatusCodes.OK).json({
    msg: "Pin verified",
    token,
  });
};

const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const id = req.userId;
    console.log(id);
    if (!newPassword) {
      res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "Please provide new password" });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await prisma.user.update({
      where: { id: id },
      data: {
        password: hashedPassword,
      },
    });
    console.log(user);
    delete user.password;
    delete user.resetPin;
    delete user.resetPinExpiration;
    delete user.otp;
    res.status(StatusCodes.OK).json({
      msg: "Password changed successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message, msg: "Error changing password" });
  }
};

module.exports = { sendPin, verifyPin, changePassword, generatePin };
