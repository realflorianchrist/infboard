import jetEnv, {bool, num, str} from 'jet-env';
import { isEnumVal } from 'jet-validators';

import { NodeEnvs } from '.';


/******************************************************************************
                                 Setup
******************************************************************************/


const ENV = jetEnv({
  // Environment
  NodeEnv: isEnumVal(NodeEnvs),

  // Server
  Port: num,
  Host: str,

  // Frontend url
  FrontendUrl: str,

  // Logger
  JetLoggerMode: str,
  JetLoggerFilepath: str,
  JetLoggerTimestamp: bool,
  JetLoggerFormat: str,

  // MongoDB
  MongoHost: str,
  MongoDatabase: str,
  MongoUser: str,
  MongoPassword: str,

  // S3 / MinIO
  S3Region: str,
  S3Endpoint: str,
  S3AccessKey: str,
  S3SecretKey: str,
  S3Bucket: str,
});


/******************************************************************************
                            Export default
******************************************************************************/

export default ENV;
