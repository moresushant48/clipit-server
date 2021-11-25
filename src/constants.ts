import { JwtModuleOptions } from "@nestjs/jwt";

export const GLOBAL = {
    JWT: {
        secret: 'A882D8E36816CD3E97AF6710C5EC8B395A4B366779A84A9F9213CCF002552E7C',
    },
    bcrypt: {
        saltRounds: 10,
    },
};

export const JWT_MODULE_OPTIONS: JwtModuleOptions = {
    secret: GLOBAL.JWT.secret,
    signOptions: {
        expiresIn: '14w',
    },
};