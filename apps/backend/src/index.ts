import logger from 'jet-logger';

import ENV from '@src/common/constants/ENV';
import express from 'express';
import {NodeEnvs} from '@src/common/constants';
import morgan from 'morgan';
import helmet from 'helmet';


// **** Http-Server **** //

const app = express();


// **** Middleware **** //

// Basic middleware
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

// Start the server
app.listen(ENV.Port, err => {
    if (!!err) {
        logger.err(err.message);
    } else {
        logger.info('Express server started on port: ' + ENV.Port.toString());
    }
});
