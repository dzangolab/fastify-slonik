import * as fastify from 'fastify';
import * as http from 'http';
import { DatabasePool } from 'slonik';
import { ConnectionRoutine, QueryFunction, SqlTaggedTemplate } from 'slonik/dist/src/types';

declare type SlonikOptions = {
    connectionString: string;
};
declare module "fastify" {
    interface FastifyRequest {
        slonik: {
            connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
            pool: DatabasePool;
            query: QueryFunction;
        };
        sql: SqlTaggedTemplate;
    }
    interface FastifyInstance {
        slonik: {
            connect: <T>(connectionRoutine: ConnectionRoutine<T>) => Promise<T>;
            pool: DatabasePool;
            query: QueryFunction;
        };
        sql: SqlTaggedTemplate;
    }
}
declare const fastifySlonik: fastify.FastifyPluginAsync<SlonikOptions, http.Server, fastify.FastifyTypeProviderDefault>;
declare const _default: fastify.FastifyPluginAsync<SlonikOptions, http.Server, fastify.FastifyTypeProviderDefault>;

export { _default as default, fastifySlonik };
