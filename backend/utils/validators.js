const { body } = require("express-validator");

const registerValidator = [
  body("fullName").trim().isLength({ min: 2, max: 120 }).withMessage("Ad soyad zorunludur."),
  body("email").trim().isEmail().withMessage("Geçerli e-posta girin.").normalizeEmail(),
  body("password").isLength({ min: 8, max: 72 }).withMessage("Şifre en az 8 karakter olmalıdır."),
  body("phone").optional({ values: "falsy" }).isLength({ min: 10, max: 24 }).withMessage("Telefon geçersiz."),
  body("termsAccepted")
    .custom(function (value) {
      return value === true || value === "true";
    })
    .withMessage("Kullanıcı Sözleşmesi ve Gizlilik Politikası'nı kabul etmelisiniz.")
];

const loginValidator = [
  body("email").trim().isEmail().withMessage("Geçerli e-posta girin.").normalizeEmail(),
  body("password").isLength({ min: 8, max: 72 }).withMessage("Şifre en az 8 karakter olmalıdır.")
];

const listingWriteValidator = [
  body("category").trim().notEmpty().withMessage("Kategori zorunlu."),
  body("subcategory").trim().notEmpty().withMessage("Alt kategori zorunlu."),
  body("title").trim().isLength({ min: 3, max: 200 }).withMessage("Başlık geçersiz."),
  body("description").trim().isLength({ min: 10, max: 8000 }).withMessage("Açıklama geçersiz."),
  body("price").isFloat({ min: 0 }).withMessage("Fiyat geçersiz."),
  body("status").optional().isIn(["draft", "pending", "approved", "rejected", "passive"]).withMessage("Durum geçersiz.")
];

const profilePatchValidator = [
  body("fullName").optional().trim().isLength({ min: 2, max: 120 }).withMessage("Ad soyad geçersiz."),
  body("phone").optional().trim().isLength({ min: 0, max: 24 }).withMessage("Telefon geçersiz."),
  body("city").optional().trim().isLength({ max: 80 }),
  body("district").optional().trim().isLength({ max: 80 }),
  body("profileType").optional().trim().isIn(["Bireysel", "Kurumsal"]).withMessage("Profil tipi geçersiz."),
  body("role").optional().isIn(["user", "admin", "store"]).withMessage("Rol geçersiz.")
];

const myListingStatusValidator = [
  body("status").trim().isIn(["passive", "pending"]).withMessage("Geçersiz durum.")
];

module.exports = {
  registerValidator,
  loginValidator,
  listingWriteValidator,
  profilePatchValidator,
  myListingStatusValidator
};
