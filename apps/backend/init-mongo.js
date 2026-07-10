const databaseName = process.env.MONGO_APP_DATABASE;
const databaseUser = process.env.MONGO_APP_USERNAME;
const databasePassword = process.env.MONGO_APP_PASSWORD;

db = db.getSiblingDB(databaseName);

print(`DB '${databaseName}' selected`);

if (!db.getUser(databaseUser)) {
    db.createUser({
        user: databaseUser,
        pwd: databasePassword,
        roles: [
            {
                role: "readWrite",
                db: databaseName
            }
        ]
    });

    print(`User '${databaseUser}' created with readWrite permissions.`);
} else {
    print(`User '${databaseUser}' already exists.`);
}