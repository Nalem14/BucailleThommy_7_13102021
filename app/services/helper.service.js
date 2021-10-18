var CryptoJS = require("crypto-js");

class Helper {
    static encryptEmail(email) {
        return CryptoJS.AES.encrypt(email, CryptoJS.enc.Base64.parse(process.env.PASSPHRASE), { iv: CryptoJS.enc.Base64.parse(process.env.IV), mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
    }

    static decryptEmail(emailEncrypted) {
        var bytes  = CryptoJS.AES.decrypt(emailEncrypted, CryptoJS.enc.Base64.parse(process.env.PASSPHRASE), { iv: CryptoJS.enc.Base64.parse(process.env.IV), mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}

module.exports = Helper;