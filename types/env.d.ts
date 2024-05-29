declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DB_HOST: 'string';
            DB_PORT: 'number';
            DB_USER: 'string';
            DB_PW: 'string';
            DB_NAME: 'string';
            ACCESS_TOKEN_SECRET: 'string';
            REFRESH_TOKEN_SECRET: 'string';
        }
    }
}

export { };
