const router = require("express").Router();

const {
  deleteUser,
  updateUser,
  getProfileById,
  getProfilesAll,
  getMyProfile,
  updateMyProfile,
} = require("../controllers/user/user.mutation.controller");
const {
  verifySuperAdmin,
  verifyToken,
  emailVerified,
} = require("../middleware/auth.middleware");

router
  .route("/user/:id")
  .patch(verifyToken, verifySuperAdmin, updateUser)
  .delete(verifyToken, verifySuperAdmin, deleteUser)
  .get(verifyToken, verifySuperAdmin, getProfileById);
router.get("/users", verifyToken, verifySuperAdmin, getProfilesAll);

router.get("/profile", verifyToken,  getMyProfile);
router.patch("/profile", verifyToken, updateMyProfile);

module.exports = router;
