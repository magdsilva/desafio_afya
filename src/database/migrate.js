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
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const database_1 = require("../config/database");
const migrationsPath = node_path_1.default.resolve(process.cwd(), 'src', 'database', 'migrations');
const runMigrations = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield database_1.database.connect();
    try {
        yield client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
        const files = yield promises_1.default.readdir(migrationsPath);
        const migrations = files
            .filter((file) => file.endsWith('.sql'))
            .sort();
        for (const filename of migrations) {
            const migrationAlreadyExecuted = yield client.query('SELECT 1 FROM schema_migrations WHERE filename = $1', [filename]);
            if (migrationAlreadyExecuted.rowCount) {
                console.log(`Skipping migration: ${filename}`);
                continue;
            }
            const filePath = node_path_1.default.join(migrationsPath, filename);
            const sql = yield promises_1.default.readFile(filePath, 'utf-8');
            console.log(`Running migration: ${filename}`);
            yield client.query('BEGIN');
            try {
                yield client.query(sql);
                yield client.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [filename]);
                yield client.query('COMMIT');
                console.log(`Migration completed: ${filename}`);
            }
            catch (error) {
                yield client.query('ROLLBACK');
                throw error;
            }
        }
    }
    finally {
        client.release();
        yield database_1.database.end();
    }
});
runMigrations().catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
});
