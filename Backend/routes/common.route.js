const router = require("express").Router();

const sanitize = require("sanitize-filename");
const multer = require('multer');
const path = require("path");

const {
  getAllCategory,
  deleteCategory,
  createCategory,
  updateCategoryImage,
  getOrderStatues,
  uploadImage,
  getFile,
  getAdminAnalytics,
  downloadAnalytics,
  addDiscountToCategory,
} = require("../controllers/common.controller");
const {
  verifyToken,
  verifyAdmin,
  validationMiddleware,
  verifySuperAdmin,
} = require("../middleware/auth.middleware");

router
  .route("/category")
  .post(
    verifyToken,
    verifyAdmin,
    createCategory
  )

  .get(getAllCategory);

  router.patch("/category/:id/discount", verifyToken, verifySuperAdmin, addDiscountToCategory);
  
  router.route("/category/:id").delete(verifyToken, verifyAdmin, deleteCategory);

router.patch("/category/:id/image", verifyToken, verifyAdmin, updateCategoryImage);

router.get("/order-status", getOrderStatues);

router.get("/analytics/download", verifyToken, verifyAdmin, downloadAnalytics);

router.get("/analytics", verifyToken, verifyAdmin, getAdminAnalytics);



const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const uploadFolder = path.resolve(__dirname, "..", 'files');
      cb(null, uploadFolder);
    },
    filename: function (req, file, cb) {
      let originalName = file.originalname;
      if (originalName.length>10){
        originalName = originalName.substring(originalName.length-10, originalName.length);
      }
      const sanitizedFilename = sanitize(`${Date.now()}-${originalName}`);
      cb(null, sanitizedFilename);
    },
  }),
  fileFilter: function (req, file, cb) {
    console.log("Mimetype: " + file.mimetype.toLowerCase())
    if (file.mimetype.toLowerCase().includes("image")) {
      cb(null, true);
    } else {
      cb(new Error("Not an image"));
    }
  },
});


router.post("/file", upload.single("image"), uploadImage);
router.get("/files/:filename", getFile);

module.exports = router;
