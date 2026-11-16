import bcrypt = require('bcryptjs');

const hashPassword = async (password: string, saltRounds = 10) => {
    return await bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password: string, hashedPassword: string) => {
    return await bcrypt.compare(password, hashedPassword);
};

export { hashPassword, comparePassword };
