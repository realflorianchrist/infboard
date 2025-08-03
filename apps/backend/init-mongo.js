db = db.getSiblingDB("admin");

try {
    rs.initiate({
        _id: "rs0",
        members: [{ _id: 0, host: "localhost:27017" }]
    });
    print("Replica set 'rs0' initiated.");
} catch (e) {
    print("Replica set already initiated or error occurred:", e.message);
}

db = db.getSiblingDB("infboard_db");

print("DB 'infboard_db' created");

if (!db.getUser("infboardUser")) {
    db.createUser({
        user: "infboardUser",
        pwd: "password",
        roles: [{ role: "readWrite", db: "infboard_db" }]
    });
    print("User 'infboardUser' created with readWrite permissions.");
} else {
    print("User 'infboardUser' already exists.");
}