import db from "#db/client";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // Drop existing tables
  await db.query(`DROP TABLE IF EXISTS files;`);
  await db.query(`DROP TABLE IF EXISTS folders;`);

  // Create tables
  await db.query(`
    CREATE TABLE folders (
      id SERIAL PRIMARY KEY,
      name TEXT UNIQUE NOT NULL
    );

    CREATE TABLE files (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      size INT NOT NULL,
      folder_id INT NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
      UNIQUE(name, folder_id)
    );
  `);

  // Seed data
  const folders = ["Documents", "Pictures", "Music"];
  const fileNames = ["fileA.txt", "fileB.txt", "fileC.txt", "fileD.txt", "fileE.txt"];

  for (const folderName of folders) {
    const { rows } = await db.query(
      `INSERT INTO folders (name) VALUES ($1) RETURNING id`,
      [folderName]
    );
    const folderId = rows[0].id;

    for (const fileName of fileNames) {
      await db.query(
        `INSERT INTO files (name, size, folder_id) VALUES ($1, $2, $3)`,
        [fileName, Math.floor(Math.random() * 1000), folderId]
      );
    }
  }
}
