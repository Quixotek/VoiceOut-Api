// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

export const { PORT, MONGO_URL, MONGO_DB_NAME, NODE_ENV, MONGO_URL_TEST } =
  process.env;

export const DB_URL = NODE_ENV === 'test' ? MONGO_URL_TEST : MONGO_URL;
