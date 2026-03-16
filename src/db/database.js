import initSqlJs from 'sql.js';
import productsMock from '../data/products_mock.json';

/** @type {Promise<import('sql.js').Database> | null} Singleton promise for the DB instance. */
let dbPromise = null;

/**
 * Bootstraps the in-browser SQLite database.
 *
 * Attempts to rehydrate a previously persisted database from localStorage.
 * If none exists (or if the stored data is corrupt), a fresh database is
 * created. Both the `products` and `users` tables are created if they do
 * not already exist, and every product from the mock JSON is upserted so
 * the catalog is always up-to-date.
 *
 * @returns {Promise<import('sql.js').Database>} Resolved database instance.
 */
const createDatabase = async () => {
    const SQL = await initSqlJs({
        locateFile: (file) => `/${file}`,
    });

    // Rehydrate from localStorage or create a fresh instance
    const savedDb = localStorage.getItem('sqlite_db');
    let db;
    if (savedDb) {
        try {
            const binaryString = atob(savedDb);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            db = new SQL.Database(bytes);
        } catch (e) {
            console.error('[DB] Failed to restore saved database — creating a fresh one.', e);
            db = new SQL.Database();
        }
    } else {
        db = new SQL.Database();
    }

    // Products table
    db.run(`
        CREATE TABLE IF NOT EXISTS products (
            id INTEGER PRIMARY KEY,
            name TEXT,
            price REAL,
            description TEXT,
            category TEXT,
            image TEXT,
            manufacturer TEXT,
            line TEXT,
            model TEXT
        );
    `);

    // Users table – supports Pessoa Física (CPF) and Pessoa Jurídica (CNPJ)
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            person_type TEXT NOT NULL DEFAULT 'PF',
            first_name TEXT NOT NULL,
            last_name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            phone TEXT,
            password TEXT NOT NULL,
            cpf TEXT UNIQUE,
            cnpj TEXT UNIQUE,
            company_name TEXT,
            address_zip TEXT,
            address_street TEXT,
            address_number TEXT,
            address_complement TEXT,
            address_neighborhood TEXT,
            address_city TEXT,
            address_state TEXT,
            residence_proof_filename TEXT,
            created_at TEXT DEFAULT (datetime('now','localtime'))
        );
    `);

    // Upsert all mock products so the catalog is always current
    const stmt = db.prepare(`
        INSERT INTO products (id, name, price, description, category, image, manufacturer, line, model)
        VALUES ($id, $name, $price, $description, $category, $image, $manufacturer, $line, $model)
        ON CONFLICT(id) DO UPDATE SET
            name         = excluded.name,
            price        = excluded.price,
            description  = excluded.description,
            category     = excluded.category,
            image        = excluded.image,
            manufacturer = excluded.manufacturer,
            line         = excluded.line,
            model        = excluded.model
    `);

    db.run('BEGIN TRANSACTION;');
    productsMock.forEach((p) => {
        stmt.run({
            $id:           p.id,
            $name:         p.name,
            $price:        p.price,
            $description:  p.description,
            $category:     p.category,
            $image:        p.image,
            $manufacturer: p.manufacturer || null,
            $line:         p.line         || null,
            $model:        p.model        || null,
        });
    });
    db.run('COMMIT;');
    stmt.free();

    saveDatabase(db);
    return db;
};

/**
 * Serialises the in-memory SQLite database to a Base-64 string and writes
 * it to localStorage under the key `'sqlite_db'`.
 *
 * Uses `Uint8Array.reduce` with `String.fromCharCode` in chunks to avoid
 * call-stack overflows that can occur when spreading very large arrays into
 * `String.fromCharCode`.
 *
 * @param {import('sql.js').Database} db - The SQL.js database instance to persist.
 * @returns {void}
 */
export const saveDatabase = (db) => {
    const binaryArray = db.export();
    // Process in chunks to avoid call-stack limits on large databases
    const CHUNK = 8192;
    let binaryString = '';
    for (let i = 0; i < binaryArray.length; i += CHUNK) {
        binaryString += String.fromCharCode(...binaryArray.subarray(i, i + CHUNK));
    }
    localStorage.setItem('sqlite_db', btoa(binaryString));
};

/**
 * Returns a singleton promise that resolves to the active database instance.
 * Initialises the database on first call; subsequent calls return the cached
 * promise without re-running the bootstrap logic.
 *
 * @returns {Promise<import('sql.js').Database>}
 */
export const getDatabase = () => {
    if (!dbPromise) {
        dbPromise = createDatabase();
    }
    return dbPromise;
};

/**
 * Fetches all products from the database, sorted alphabetically by name.
 *
 * @returns {Promise<Object[]>} Array of product row objects.
 *   Each object has keys matching the `products` table columns.
 */
export const getProducts = async () => {
    const db = await getDatabase();
    const res = db.exec('SELECT * FROM products ORDER BY name ASC');
    if (res.length === 0) return [];

    const { columns, values } = res[0];
    return values.map((row) =>
        Object.fromEntries(columns.map((col, idx) => [col, row[idx]]))
    );
};

/**
 * Fetches a single product by its numeric ID.
 *
 * @param {number|string} id - The product ID to look up.
 * @returns {Promise<Object|null>} The matching product row object, or `null`
 *   if no product with the given ID exists.
 */
export const getProductById = async (id) => {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM products WHERE id = :id');
    stmt.bind({ ':id': Number(id) });

    if (stmt.step()) {
        const result = stmt.getAsObject();
        stmt.free();
        return result;
    }
    stmt.free();
    return null;
};

/**
 * Registers a new user in the `users` table.
 *
 * Performs uniqueness validation for email, CPF (Pessoa Física), and CNPJ
 * (Pessoa Jurídica) before inserting. CPF and CNPJ are stored as digit-only
 * strings (masks stripped). The database is persisted to localStorage after
 * a successful insert.
 *
 * @security Passwords are stored as plain text in this demo project.
 *   In a production environment, always hash passwords with a strong
 *   algorithm (e.g. bcrypt / argon2) before persisting them.
 *
 * @param {Object} userData - User data payload.
 * @param {string} userData.person_type - `'PF'` (individual) or `'PJ'` (company).
 * @param {string} userData.first_name
 * @param {string} userData.last_name
 * @param {string} userData.email - Must be unique across all users.
 * @param {string} [userData.phone]
 * @param {string} userData.password - Plain-text password (see @security note).
 * @param {string|null} [userData.cpf] - Required for PF; stored without mask.
 * @param {string|null} [userData.cnpj] - Required for PJ; stored without mask.
 * @param {string|null} [userData.company_name] - Required for PJ.
 * @param {string} [userData.address_zip]
 * @param {string} [userData.address_street]
 * @param {string} [userData.address_number]
 * @param {string} [userData.address_complement]
 * @param {string} [userData.address_neighborhood]
 * @param {string} [userData.address_city]
 * @param {string} [userData.address_state]
 * @param {string|null} [userData.residence_proof_filename]
 * @throws {Error} If email, CPF, or CNPJ is already registered.
 * @returns {Promise<void>}
 */
export const registerUser = async (userData) => {
    const db = await getDatabase();

    // Uniqueness check — email
    const emailStmt = db.prepare('SELECT id FROM users WHERE email = :email');
    emailStmt.bind({ ':email': userData.email });
    const emailExists = emailStmt.step();
    emailStmt.free();
    if (emailExists) throw new Error('Este e-mail já está cadastrado.');

    // Uniqueness check — CPF (PF only)
    if (userData.cpf) {
        const cpfDigits = userData.cpf.replace(/\D/g, '');
        const cpfStmt = db.prepare('SELECT id FROM users WHERE cpf = :cpf');
        cpfStmt.bind({ ':cpf': cpfDigits });
        const cpfExists = cpfStmt.step();
        cpfStmt.free();
        if (cpfExists) throw new Error('Este CPF já está cadastrado.');
    }

    // Uniqueness check — CNPJ (PJ only)
    if (userData.cnpj) {
        const cnpjDigits = userData.cnpj.replace(/\D/g, '');
        const cnpjStmt = db.prepare('SELECT id FROM users WHERE cnpj = :cnpj');
        cnpjStmt.bind({ ':cnpj': cnpjDigits });
        const cnpjExists = cnpjStmt.step();
        cnpjStmt.free();
        if (cnpjExists) throw new Error('Este CNPJ já está cadastrado.');
    }

    const insertStmt = db.prepare(`
        INSERT INTO users (
            person_type, first_name, last_name, email, phone, password,
            cpf, cnpj, company_name,
            address_zip, address_street, address_number, address_complement,
            address_neighborhood, address_city, address_state,
            residence_proof_filename
        ) VALUES (
            :person_type, :first_name, :last_name, :email, :phone, :password,
            :cpf, :cnpj, :company_name,
            :address_zip, :address_street, :address_number, :address_complement,
            :address_neighborhood, :address_city, :address_state,
            :residence_proof_filename
        )
    `);

    insertStmt.run({
        ':person_type':              userData.person_type,
        ':first_name':               userData.first_name,
        ':last_name':                userData.last_name,
        ':email':                    userData.email,
        ':phone':                    userData.phone                    || null,
        ':password':                 userData.password,
        ':cpf':                      userData.cpf   ? userData.cpf.replace(/\D/g, '')   : null,
        ':cnpj':                     userData.cnpj  ? userData.cnpj.replace(/\D/g, '')  : null,
        ':company_name':             userData.company_name             || null,
        ':address_zip':              userData.address_zip              || null,
        ':address_street':           userData.address_street           || null,
        ':address_number':           userData.address_number           || null,
        ':address_complement':       userData.address_complement       || null,
        ':address_neighborhood':     userData.address_neighborhood     || null,
        ':address_city':             userData.address_city             || null,
        ':address_state':            userData.address_state            || null,
        ':residence_proof_filename': userData.residence_proof_filename || null,
    });
    insertStmt.free();
    saveDatabase(db);
};

/**
 * Retrieves a user record by email address. Used primarily during login to
 * verify credentials.
 *
 * @param {string} email - The email address to search for (case-sensitive).
 * @returns {Promise<Object|null>} The matching user row object, or `null` if
 *   no user with the given email exists.
 */
export const getUserByEmail = async (email) => {
    const db = await getDatabase();
    const stmt = db.prepare('SELECT * FROM users WHERE email = :email');
    stmt.bind({ ':email': email });
    if (stmt.step()) {
        const result = stmt.getAsObject();
        stmt.free();
        return result;
    }
    stmt.free();
    return null;
};
