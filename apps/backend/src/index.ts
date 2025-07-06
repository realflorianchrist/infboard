import logger from 'jet-logger';
import cors from "cors";
import ENV from '@src/common/constants/ENV';
import express from 'express';
import {NodeEnvs} from '@src/common/constants';
import morgan from 'morgan';
import helmet from 'helmet';
import {connectDB} from "@src/config/database";
import {ensureBucketExists} from "@src/config/s3";


// **** Configuration **** //

const corsConfig: cors.CorsOptions | cors.CorsOptionsDelegate = {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}

// **** Http-Server **** //

const app = express();

// **** Middleware **** //

// Basic middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Show routes called in console during development
if (ENV.NodeEnv === NodeEnvs.Dev) {
    app.use(morgan('dev'));
}

// Security
if (ENV.NodeEnv === NodeEnvs.Production) {
    // eslint-disable-next-line n/no-process-env
    if (!process.env.DISABLE_HELMET) {
        app.use(helmet());
    }
}

(async () => {

    // **** Database **** //
    await connectDB();

    // **** S3 **** //
    await ensureBucketExists();

    // Start the server
    app.listen(ENV.Port, err => {
        if (!!err) {
            logger.err(err.message);
        } else {
            logger.info('Express server started on port: ' + ENV.Port.toString());
        }
    });

})();


