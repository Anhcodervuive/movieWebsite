const bcrypt = require('bcryptjs');

// Hàm để băm mật khẩu
async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10); // Tạo muối
    const hashedPassword = await bcrypt.hash(password, salt); // Băm mật khẩu với muối
    console.log(hashedPassword);

    return hashedPassword;
}

// Hàm để kiểm tra mật khẩu
async function comparePassword(password, hashedPassword) {
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch;
}

module.exports = {
    hashPassword,
    comparePassword,
};
