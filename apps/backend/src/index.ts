import cors from "cors";
import express from 'express';
import {NodeEnvs} from '@src/constants/NodeEnvs';
import morgan from 'morgan';
import helmet from 'helmet';
import {connectDB} from "@src/config/database";
import {ensureBucketExists} from "@src/config/s3";
import dispatcher from "@src/api/controllers/dispatcher";
import {apiRoutes} from "@workspace/routes";
import {ENV} from "@src/constants/ENV";
import {errorHandler} from "@src/middleware/errorHandler";
import {authenticateToken} from "@src/middleware/authMiddleware";
import logger from "@src/utils/logger";
import {requireUser} from "@src/middleware/requireUser";


// **** Configuration **** //
const corsConfig: cors.CorsOptions | cors.CorsOptionsDelegate = {
    origin: ENV.FRONTEND_URL,
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
if (ENV.NODE_ENV === NodeEnvs.Dev) {
    app.use(morgan('dev'));
}

// Security
if (ENV.NODE_ENV === NodeEnvs.Production) {
    // eslint-disable-next-line n/no-process-env
    if (!process.env.DISABLE_HELMET) {
        app.use(helmet());
    }
}

app.use((req, res, next) => {
    if (req.path.startsWith('/api/open')) {
        return next();
    }
    return authenticateToken(req, res, next);
});
app.use((req, res, next) => {
    if (req.path.startsWith('/api/open')) {
        return next();
    }
    return requireUser(req, res, next);
});
app.use(apiRoutes.base, dispatcher);
app.use(errorHandler);


(async () => {

    // **** Database **** //
    await connectDB();

    // **** S3 **** //
    await ensureBucketExists();

    // Start the server
    app.listen(ENV.PORT, err => {
        if (!!err) {
            logger.err(err.message);
        } else {
            logger.info('Express server started on port: ' + ENV.PORT.toString());
            logger.info(`Frontend URL: ${ENV.FRONTEND_URL}`);
        }
    });

})();
