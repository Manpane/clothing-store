const bcrypt = require("bcrypt");
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

async function createSuperAdmin(){
    let superAdmin = await prisma.user.findFirst({
        where: { role: "super_admin" },
    });
    if (superAdmin) {
        await prisma.user.delete({
            where: { id: superAdmin.id },
        });
    }
    
    const username = "Super Admin";
    const email = process.env.SUPER_ADMIN_EMAIL;
    const password = process.env.SUPER_ADMIN_PASSWORD;
    const passwordHash = await bcrypt.hash(password, 10);
    const role = "super_admin";
    
    await prisma.user.create({
        data: {
            username,
            email,
            password:passwordHash,
            role,
        },
    });
    // console.log("Super admin credentials:");
    // console.log("Email: ",process.env.SUPER_ADMIN_EMAIL, "\nPassword: ", process.env.SUPER_ADMIN_PASSWORD);
}

module.exports = {createSuperAdmin};