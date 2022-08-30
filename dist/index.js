"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default,
  fastifySlonik: () => fastifySlonik
});
module.exports = __toCommonJS(src_exports);
var import_fastify_plugin = __toESM(require("fastify-plugin"));
var import_slonik = require("slonik");
var plugin = async (fastify, options) => {
  const { connectionString } = options;
  let pool;
  try {
    pool = await (0, import_slonik.createPool)(connectionString);
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
    fastify.decorate("sql", import_slonik.sql);
  }
  if (!fastify.hasRequestDecorator("slonik") && !fastify.hasRequestDecorator("sql")) {
    fastify.decorateRequest("slonik", null);
    fastify.decorateRequest("sql", null);
    fastify.addHook("onRequest", async (req) => {
      req.slonik = db;
      req.sql = import_slonik.sql;
    });
  }
};
var fastifySlonik = (0, import_fastify_plugin.default)(plugin, {
  fastify: "4.x",
  name: "fastify-slonik"
});
var src_default = (0, import_fastify_plugin.default)(plugin, {
  fastify: "4.x",
  name: "fastify-slonik"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  fastifySlonik
});
