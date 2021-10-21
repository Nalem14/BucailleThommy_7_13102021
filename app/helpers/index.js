var CryptoJS = require("crypto-js");

class Helper {
  static encrypt(value) {
    return CryptoJS.AES.encrypt(
      value,
      CryptoJS.enc.Base64.parse(process.env.PASSPHRASE),
      {
        iv: CryptoJS.enc.Base64.parse(process.env.IV),
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    ).toString();
  }

  static decrypt(valueEncrypted) {
    var bytes = CryptoJS.AES.decrypt(
      valueEncrypted,
      CryptoJS.enc.Base64.parse(process.env.PASSPHRASE),
      {
        iv: CryptoJS.enc.Base64.parse(process.env.IV),
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7,
      }
    );
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  static successResponse = (req, res, data, hateoas = [], code = 200) =>
    res.status(code).json({
      code,
      data,
      success: true,
    }, hateoas);

  static errorResponse = (
    req,
    res,
    errorMessage = "Something went wrong",
    hateoas = [],
    code = 500,
    error = {}
  ) =>
    res.status(code).json({
      code,
      errorMessage,
      error,
      data: null,
      success: false,
    }, hateoas);

  static capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  }
}

module.exports = Helper;
