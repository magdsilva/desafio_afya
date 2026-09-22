"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = require("../config/database");
const seed = () => __awaiter(void 0, void 0, void 0, function* () {
    const name = process.env.SEED_USER_NAME;
    const email = process.env.SEED_USER_EMAIL;
    const password = process.env.SEED_USER_PASSWORD;
    if (!name || !email || !password) {
        throw new Error('Seed user environment variables are missing');
    }
    const passwordHash = yield bcrypt_1.default.hash(password, 10);
    try {
        const result = yield database_1.database.query(`
        INSERT INTO users (
          name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3)
        ON CONFLICT (email) DO NOTHING
        RETURNING id, name, email
      `, [name, email, passwordHash]);
        if (result.rowCount === 0) {
            console.log('Seed user already exists');
            return;
        }
        console.log('Seed user created successfully');
        console.log(result.rows[0]);
    }
    finally {
        yield database_1.database.end();
    }
});
seed().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});
