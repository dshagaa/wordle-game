/*
 Navicat Premium Data Transfer

 Source Server         : Local PostgreSQL
 Source Server Type    : PostgreSQL
 Source Server Version : 140004
 Source Host           : localhost:5432
 Source Catalog        : wordle-users
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 140004
 File Encoding         : 65001

 Date: 03/07/2022 21:34:35
*/


-- ----------------------------
-- Sequence structure for answered_words_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."answered_words_id_seq";
CREATE SEQUENCE "public"."answered_words_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for records_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."records_id_seq";
CREATE SEQUENCE "public"."records_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for selected_words_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."selected_words_id_seq";
CREATE SEQUENCE "public"."selected_words_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for users_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."users_id_seq";
CREATE SEQUENCE "public"."users_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 2147483647
START 1
CACHE 1;

-- ----------------------------
-- Table structure for answered_words
-- ----------------------------
DROP TABLE IF EXISTS "public"."answered_words";
CREATE TABLE "public"."answered_words" (
  "id" int4 NOT NULL DEFAULT nextval('answered_words_id_seq'::regclass),
  "uuid" uuid NOT NULL,
  "word" varchar(10) COLLATE "pg_catalog"."default" NOT NULL
)
;

-- ----------------------------
-- Table structure for records
-- ----------------------------
DROP TABLE IF EXISTS "public"."records";
CREATE TABLE "public"."records" (
  "id" int4 NOT NULL DEFAULT nextval('records_id_seq'::regclass),
  "uuid" uuid NOT NULL,
  "user_id" uuid NOT NULL,
  "selected_word_id" uuid NOT NULL,
  "answered_word_id" uuid NOT NULL,
  "intents_count" int4 NOT NULL DEFAULT 0,
  "created_at" timestamp(6),
  "updated_at" timestamp(6),
  "deleted_at" timestamp(6)
)
;

-- ----------------------------
-- Table structure for selected_words
-- ----------------------------
DROP TABLE IF EXISTS "public"."selected_words";
CREATE TABLE "public"."selected_words" (
  "id" int4 NOT NULL DEFAULT nextval('selected_words_id_seq'::regclass),
  "uuid" uuid NOT NULL,
  "word" varchar(10) COLLATE "pg_catalog"."default" NOT NULL,
  "user_id" uuid NOT NULL
)
;

-- ----------------------------
-- Table structure for typeorm_metadata
-- ----------------------------
DROP TABLE IF EXISTS "public"."typeorm_metadata";
CREATE TABLE "public"."typeorm_metadata" (
  "type" varchar COLLATE "pg_catalog"."default" NOT NULL,
  "database" varchar COLLATE "pg_catalog"."default",
  "schema" varchar COLLATE "pg_catalog"."default",
  "table" varchar COLLATE "pg_catalog"."default",
  "name" varchar COLLATE "pg_catalog"."default",
  "value" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
  "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
  "uuid" uuid NOT NULL,
  "username" varchar(191) COLLATE "pg_catalog"."default" NOT NULL,
  "email" varchar(191) COLLATE "pg_catalog"."default" NOT NULL,
  "password" varchar(191) COLLATE "pg_catalog"."default" NOT NULL,
  "auth_token" varchar(255) COLLATE "pg_catalog"."default",
  "created_at" timestamp(6),
  "updated_at" timestamp(6),
  "deleted_at" timestamp(6)
)
;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."answered_words_id_seq"
OWNED BY "public"."answered_words"."id";
SELECT setval('"public"."answered_words_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."records_id_seq"
OWNED BY "public"."records"."id";
SELECT setval('"public"."records_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."selected_words_id_seq"
OWNED BY "public"."selected_words"."id";
SELECT setval('"public"."selected_words_id_seq"', 2, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."users_id_seq"
OWNED BY "public"."users"."id";
SELECT setval('"public"."users_id_seq"', 2, false);

-- ----------------------------
-- Uniques structure for table answered_words
-- ----------------------------
ALTER TABLE "public"."answered_words" ADD CONSTRAINT "UQ_e42d1f5d788360328a13f7b011d" UNIQUE ("uuid");

-- ----------------------------
-- Primary Key structure for table answered_words
-- ----------------------------
ALTER TABLE "public"."answered_words" ADD CONSTRAINT "PK_37b188700005a6161964a567ea7" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table records
-- ----------------------------
ALTER TABLE "public"."records" ADD CONSTRAINT "PK_188149422ee2454660abf1d5ee5" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table selected_words
-- ----------------------------
ALTER TABLE "public"."selected_words" ADD CONSTRAINT "UQ_e127d2b98f0da596f1d79a6f12d" UNIQUE ("uuid");

-- ----------------------------
-- Primary Key structure for table selected_words
-- ----------------------------
ALTER TABLE "public"."selected_words" ADD CONSTRAINT "PK_2559b918c42655266059e8cf7fe" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_951b8f1dfc94ac1d0301a14b7e1" UNIQUE ("uuid");
ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username");
ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email");
ALTER TABLE "public"."users" ADD CONSTRAINT "UQ_5ea43a6048f9d72d0bf84635b52" UNIQUE ("auth_token");

-- ----------------------------
-- Primary Key structure for table users
-- ----------------------------
ALTER TABLE "public"."users" ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table records
-- ----------------------------
ALTER TABLE "public"."records" ADD CONSTRAINT "FK_27b2efc240866f140b8eb6ac554" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."records" ADD CONSTRAINT "FK_831be8cc96249b0983faa2797e3" FOREIGN KEY ("selected_word_id") REFERENCES "public"."selected_words" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION;
ALTER TABLE "public"."records" ADD CONSTRAINT "FK_a808c340f95b22eee03ceb234ef" FOREIGN KEY ("answered_word_id") REFERENCES "public"."answered_words" ("uuid") ON DELETE CASCADE ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table selected_words
-- ----------------------------
ALTER TABLE "public"."selected_words" ADD CONSTRAINT "FK_9fc1d070808ed9533c31d4344a8" FOREIGN KEY ("user_id") REFERENCES "public"."users" ("uuid") ON DELETE NO ACTION ON UPDATE NO ACTION;
