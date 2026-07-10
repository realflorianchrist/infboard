const replicaSetName = process.env.MONGO_REPLICA_SET_NAME;
const replicaHost = process.env.MONGO_REPLICA_HOST;

try {
    rs.status();
    print("Replica set already initialized");
} catch (err) {
    print("Initializing replica set...");

    rs.initiate({
        _id: replicaSetName,
        members: [
            {
                _id: 0,
                host: replicaHost
            }
        ]
    });

    print("Replica set initialized");
}