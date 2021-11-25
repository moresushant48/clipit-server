import * as path from 'path';

export default {
    type: process.env.TYPEORM_CONNECTION,
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT, 10),
    username: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: process.env.TYPEORM_DATABASE,
    synchronize: true,
    dropSchema: false,
    logging: false,
    retryAttempts: 5,
    keepConnectionAlive: true,
    entities: [
        path.join(__dirname, '../') + '**/!(*.d).entity{.ts,.js}',
    ],
    migrations: ['migrations/**/*.ts'],
    subscribers: ['subscriber/**/*.ts', 'dist/subscriber/**/.js'],
    cli: {
        entitiesDir: 'src',
        migrationsDir: 'migrations',
        subscribersDir: 'subscriber',
    },
};
