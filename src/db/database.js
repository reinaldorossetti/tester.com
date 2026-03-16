import initSqlJs from 'sql.js';
import productsMock from '../data/products_mock.json';

let dbPromise = null;

const createDatabase = async () => {
    // 1. Load the WebAssembly module
    const SQL = await initSqlJs({
        // This URLs assumes we copied sql-wasm.wasm to public/ (which we did)
        locateFile: file => `/${file}`
    });

    // 2. Load existing DB from localStorage or create a fresh one
    const savedDb = localStorage.getItem('sqlite_db');
    let db;
    if (savedDb) {
        try {
            const binaryString = atob(savedDb);
            const binaryLen = binaryString.length;
            const bytes = new Uint8Array(binaryLen);
            for (let i = 0; i < binaryLen; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            db = new SQL.Database(bytes);
        } catch(e) {
            console.error("Failed to load saved DB, creating a new one", e);
            db = new SQL.Database();
        }
    } else {
        db = new SQL.Database();
    }
    
    // 3. Create products table
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

    // 3b. Create users table
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

    // 4. Sync mock data to ensure any new products added to the JSON are inserted
    const stmt = db.prepare(`
        INSERT INTO products (id, name, price, description, category, image, manufacturer, line, model) 
        VALUES ($id, $name, $price, $description, $category, $image, $manufacturer, $line, $model)
        ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            price = excluded.price,
            description = excluded.description,
            category = excluded.category,
            image = excluded.image,
            manufacturer = excluded.manufacturer,
            line = excluded.line,
            model = excluded.model
    `);
    
    db.run("BEGIN TRANSACTION;");
    let addedCount = 0;
    productsMock.forEach(p => {
        // Checking if product exists theoretically not needed with IGNORE, but we can track if we need to save
        stmt.run({
            $id: p.id,
            $name: p.name,
            $price: p.price,
            $description: p.description,
            $category: p.category,
            $image: p.image,
            $manufacturer: p.manufacturer || null,
            $line: p.line || null,
            $model: p.model || null
        });
    });
    db.run("COMMIT;");
    stmt.free();
    
    // Always resave to sync in case new products were ignored/inserted
    saveDatabase(db);

    return db;
};

// 5. Utility to Save DB to LocalStorage (since this is an in-memory SQLite setup in the browser)
export const saveDatabase = (db) => {
    const binaryArray = db.export();
    const binaryLen = binaryArray.byteLength;
    let binaryString = "";
    for (let i = 0; i < binaryLen; i++) {
        binaryString += String.fromCharCode(binaryArray[i]);
    }
    const base64String = btoa(binaryString);
    localStorage.setItem('sqlite_db', base64String);
};

export const getDatabase = () => {
    if (!dbPromise) {
        dbPromise = createDatabase();
    }
    return dbPromise;
};

// Helper: Get all products
export const getProducts = async () => {
    const db = await getDatabase();
    const res = db.exec("SELECT * FROM products ORDER BY name ASC");
    if (res.length === 0) return [];
    
    // Convert SQL.js result payload back to array of objects
    const columns = res[0].columns;
    const values = res[0].values;
    
    return values.map(row => {
        let obj = {};
        columns.forEach((col, idx) => {
            obj[col] = row[idx];
        });
        return obj;
    });
};

// Helper: Get single product by ID
export const getProductById = async (id) => {
    const db = await getDatabase();
    const stmt = db.prepare("SELECT * FROM products WHERE id = :id");
    stmt.bind({":id": Number(id)});
    
    if (stmt.step()) {
        const result = stmt.getAsObject();
        stmt.free();
        return result;
    }
    stmt.free();
    return null;
};

// Helper: Register a new user
export const registerUser = async (userData) => {
    const db = await getDatabase();

    // Check unique email
    const emailStmt = db.prepare("SELECT id FROM users WHERE email = :email");
    emailStmt.bind({ ':email': userData.email });
    const emailExists = emailStmt.step();
    emailStmt.free();
    if (emailExists) throw new Error("Este e-mail já está cadastrado.");

    // Check unique CPF (PF only)
    if (userData.cpf) {
        const cpfDigits = userData.cpf.replace(/\D/g, '');
        const cpfStmt = db.prepare("SELECT id FROM users WHERE cpf = :cpf");
        cpfStmt.bind({ ':cpf': cpfDigits });
        const cpfExists = cpfStmt.step();
        cpfStmt.free();
        if (cpfExists) throw new Error("Este CPF já está cadastrado.");
    }

    // Check unique CNPJ (PJ only)
    if (userData.cnpj) {
        const cnpjDigits = userData.cnpj.replace(/\D/g, '');
        const cnpjStmt = db.prepare("SELECT id FROM users WHERE cnpj = :cnpj");
        cnpjStmt.bind({ ':cnpj': cnpjDigits });
        const cnpjExists = cnpjStmt.step();
        cnpjStmt.free();
        if (cnpjExists) throw new Error("Este CNPJ já está cadastrado.");
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
        ':person_type': userData.person_type,
        ':first_name': userData.first_name,
        ':last_name': userData.last_name,
        ':email': userData.email,
        ':phone': userData.phone || null,
        ':password': userData.password, // In production, hash before storing
        ':cpf': userData.cpf ? userData.cpf.replace(/\D/g, '') : null,
        ':cnpj': userData.cnpj ? userData.cnpj.replace(/\D/g, '') : null,
        ':company_name': userData.company_name || null,
        ':address_zip': userData.address_zip || null,
        ':address_street': userData.address_street || null,
        ':address_number': userData.address_number || null,
        ':address_complement': userData.address_complement || null,
        ':address_neighborhood': userData.address_neighborhood || null,
        ':address_city': userData.address_city || null,
        ':address_state': userData.address_state || null,
        ':residence_proof_filename': userData.residence_proof_filename || null,
    });
    insertStmt.free();
    saveDatabase(db);
};

// Helper: Get user by email (for future login)
export const getUserByEmail = async (email) => {
    const db = await getDatabase();
    const stmt = db.prepare("SELECT * FROM users WHERE email = :email");
    stmt.bind({ ':email': email });
    if (stmt.step()) {
        const result = stmt.getAsObject();
        stmt.free();
        return result;
    }
    stmt.free();
    return null;
};

