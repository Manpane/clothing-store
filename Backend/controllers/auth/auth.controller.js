const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { sendEmail } = require("../../services/email.services");
const { StatusCodes } = require("http-status-codes");
const { verify_account_boilerplate } = require("../boilerplates.data");

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000);
};

async function createUser(req, res) {
  try {
    const { username, email, password, role } = req.body;
    const alreadyExists = await prisma.user.findFirst({
      where: { email },
    });
    if (alreadyExists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User already exists" });
    }

    if (role?.toLowerCase().trim() === "super_admin") {
      const superAdmin = await prisma.user.findFirst({
        where: { role: "super_admin" },
      });
      if (superAdmin) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ error: "Super Admin already exist" });
      }
    }
    const otp = generateOTP();
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        otp: "",
        password: hashedPassword,
        role,
        emailVerified: true,
      },
    });
    delete newUser.password;
    delete newUser.resetPin;
    delete newUser.resetPinExpiration;
    delete newUser.otp;

    // const emailResponse = await sendEmail(
    //   newUser.email,
    //   verify_account_boilerplate(otp, newUser.username),
    //   "Verify your account",
    // );
    const emailResponse = { success: true };
    if (emailResponse.success) {
      return res.json({ newUser, message: "Verificaion Email sent" });
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: emailResponse.error, msg: "Error sending email" });
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error: "Email required" });
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "User not found" });
    }
    if (user.verified) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "User is already verified" });
    }

    const result = await sendEmail(
      user.email,
      verify_account_boilerplate(user.otp, user.username),
      "Verify your account",
    );
    if (result.success) {
      return res.json({ message: "Email sent" });
    } else {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: result.error, msg: "Error sending email" });
    }
  } catch (error) {
    console.error("Error resending verification email:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message });
  }
}

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const user = await prisma.user.findUnique({
    where: { email, otp: otp.toString() },
  });
  if (!user) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: "Invalid OTP" });
  }
  const verifiedUser = await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true, otp: "" },
  });

  delete verifiedUser.password;
  delete verifiedUser.resetPin;
  delete verifiedUser.resetPinExpiration;
  delete verifiedUser.otp;

  return res
    .status(StatusCodes.OK)
    .json({ message: "User verified", verifiedUser });
};

async function loginUser(req, res) {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ error: "Invalid email or password" });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    return res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

const isAdmin = async (req,res) => {
  const {email} = req.body;
  const user = await prisma.user.findFirst({
    where: {email}
  });
  if(!user){
    return res.status(StatusCodes.BAD_REQUEST).json({error: "User not found"})
  }
  if(user.role.toLowerCase().trim()!=="admin"){
    return res.status(StatusCodes.UNAUTHORIZED).json({error: "User is not an admin"})
  }
  return res.status(StatusCodes.OK).json({message: "User is an admin"})
}

module.exports = {
  loginUser,
  createUser,
  resendVerificationEmail,
  generateOTP,
  verifyOTP,
  isAdmin
};
