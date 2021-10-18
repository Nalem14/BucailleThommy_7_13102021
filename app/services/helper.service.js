var CryptoJS = require("crypto-js");

class Helper {
    static encrypt(value) {
        return CryptoJS.AES.encrypt(value, CryptoJS.enc.Base64.parse(process.env.PASSPHRASE), { iv: CryptoJS.enc.Base64.parse(process.env.IV), mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 }).toString();
    }

    static decrypt(valueEncrypted) {
        var bytes  = CryptoJS.AES.decrypt(valueEncrypted, CryptoJS.enc.Base64.parse(process.env.PASSPHRASE), { iv: CryptoJS.enc.Base64.parse(process.env.IV), mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 });
        return bytes.toString(CryptoJS.enc.Utf8);
    }
}

module.exports = Helper;