// src/index.ts
import fastifyPlugin from "fastify-plugin";
import { createPool, sql } from "slonik";
var plugin = async (fastify, options) => {
  const { connectionString } = options;
  let pool;
  try {
    pool = await createPool(connectionString);
  } catch (error) {
    fastify.log.error("\u{1F534} Error happened while connecting to Postgres DB");
    throw new Error(error);
  }
  try {
    await pool.connect(async () => {
      fastify.log.info("\u2705 Connected to Postgres DB");
    });
  } catch {
    fastify.log.error("\u{1F534} Error happened while connecting to Postgres DB");
  }
  const db = {
    connect: pool.connect.bind(pool),
    pool,
    query: pool.query.bind(pool)
  };
  if (!fastify.hasDecorator("slonik") && !fastify.hasDecorator("sql")) {
    fastify.decorate("slonik", db);
    fastify.decorate("sql", sql);
  }
  if (!fastify.hasRequestDecorator("slonik") && !fastify.hasRequestDecorator("sql")) {
    fastify.decorateRequest("slonik", null);
    fastify.decorateRequest("sql", null);
    fastify.addHook("onRequest", async (req) => {
      req.slonik = db;
      req.sql = sql;
    });
  }
};
var fastifySlonik = fastifyPlugin(plugin, {
  fastify: "4.x",
  name: "fastify-slonik"
});
var src_default = fastifyPlugin(plugin, {
  fastify: "4.x",
  name: "fastify-slonik"
});

export {
  fastifySlonik,
  src_default
};
