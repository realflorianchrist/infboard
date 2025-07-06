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