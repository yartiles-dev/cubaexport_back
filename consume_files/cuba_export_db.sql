/*
 Navicat Premium Data Transfer

 Source Server         : postgresDB
 Source Server Type    : PostgreSQL
 Source Server Version : 100003
 Source Host           : localhost:5432
 Source Catalog        : cuba_export
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 100003
 File Encoding         : 65001

 Date: 04/03/2022 10:23:43
*/


-- ----------------------------
-- Type structure for bank_account_type
-- ----------------------------
DROP TYPE IF EXISTS "public"."bank_account_type";
CREATE TYPE "public"."bank_account_type" AS ENUM (
  'mlc',
  'cup'
);
ALTER TYPE "public"."bank_account_type" OWNER TO "postgres";

-- ----------------------------
-- Type structure for status_person
-- ----------------------------
DROP TYPE IF EXISTS "public"."status_person";
CREATE TYPE "public"."status_person" AS ENUM (
  'enabled',
  'disabled',
  'complete',
  'pendingSignUpVerification'
);
ALTER TYPE "public"."status_person" OWNER TO "postgres";

-- ----------------------------
-- Sequence structure for bank_data_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."bank_data_seq";
CREATE SEQUENCE "public"."bank_data_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for city_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."city_seq";
CREATE SEQUENCE "public"."city_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for country_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."country_seq";
CREATE SEQUENCE "public"."country_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for document_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."document_seq";
CREATE SEQUENCE "public"."document_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for log_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."log_seq";
CREATE SEQUENCE "public"."log_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for mipyme_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."mipyme_seq";
CREATE SEQUENCE "public"."mipyme_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for person_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."person_seq";
CREATE SEQUENCE "public"."person_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for role_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."role_seq";
CREATE SEQUENCE "public"."role_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for roleperson_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."roleperson_seq";
CREATE SEQUENCE "public"."roleperson_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for roleserverfunction_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."roleserverfunction_seq";
CREATE SEQUENCE "public"."roleserverfunction_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for serverfunction_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."serverfunction_seq";
CREATE SEQUENCE "public"."serverfunction_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for state_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."state_seq";
CREATE SEQUENCE "public"."state_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for bank_data
-- ----------------------------
DROP TABLE IF EXISTS "public"."bank_data";
CREATE TABLE "public"."bank_data" (
  "id" int4 NOT NULL DEFAULT nextval('bank_data_seq'::regclass),
  "bank_account_type" "public"."bank_account_type" NOT NULL DEFAULT 'cup'::bank_account_type,
  "bank_name" text COLLATE "pg_catalog"."default" NOT NULL,
  "office" text COLLATE "pg_catalog"."default" NOT NULL,
  "direction" text COLLATE "pg_catalog"."default" NOT NULL,
  "personId" int4 NOT NULL,
  "mipyme_id" int4 NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "deletedAt" timestamp(6)
)
;

-- ----------------------------
-- Records of bank_data
-- ----------------------------

-- ----------------------------
-- Table structure for city
-- ----------------------------
DROP TABLE IF EXISTS "public"."city";
CREATE TABLE "public"."city" (
  "id" int4 NOT NULL DEFAULT nextval('city_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "deletedAt" timestamp(6),
  "state_id" int4 NOT NULL
)
;

-- ----------------------------
-- Records of city
-- ----------------------------

-- ----------------------------
-- Table structure for country
-- ----------------------------
DROP TABLE IF EXISTS "public"."country";
CREATE TABLE "public"."country" (
  "id" int4 NOT NULL DEFAULT nextval('country_seq'::regclass),
  "description" text COLLATE "pg_catalog"."default",
  "name" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "alpha2" varchar(255) COLLATE "pg_catalog"."default",
  "alpha3" varchar(255) COLLATE "pg_catalog"."default",
  "status" varchar(255) COLLATE "pg_catalog"."default",
  "ioc" varchar(255) COLLATE "pg_catalog"."default",
  "iva" float4,
  "createdAt" timestamp(6),
  "updatedAt" timestamp(6),
  "deletedAt" timestamp(6)
)
;

-- ----------------------------
-- Records of country
-- ----------------------------
INSERT INTO "public"."country" VALUES (1, NULL, 'Ascension Island', 'AC', '', 'reserved', 'SHP', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (2, NULL, 'Andorra', 'AD', 'AND', 'assigned', 'AND', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (3, NULL, 'United Arab Emirates', 'AE', 'ARE', 'assigned', 'UAE', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (4, NULL, 'Afghanistan', 'AF', 'AFG', 'assigned', 'AFG', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (5, NULL, 'Antigua And Barbuda', 'AG', 'ATG', 'assigned', 'ANT', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (6, NULL, 'Anguilla', 'AI', 'AIA', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (7, NULL, 'Albania', 'AL', 'ALB', 'assigned', 'ALB', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (8, NULL, 'Armenia', 'AM', 'ARM', 'assigned', 'ARM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (9, NULL, 'Angola', 'AO', 'AGO', 'assigned', 'ANG', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (10, NULL, 'Antarctica', 'AQ', 'ATA', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (11, NULL, 'Argentina', 'AR', 'ARG', 'assigned', 'ARG', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (12, NULL, 'American Samoa', 'AS', 'ASM', 'assigned', 'ASA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (13, NULL, 'Austria', 'AT', 'AUT', 'assigned', 'AUT', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (14, NULL, 'Australia', 'AU', 'AUS', 'assigned', 'AUS', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (15, NULL, 'Aruba', 'AW', 'ABW', 'assigned', 'ARU', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (16, NULL, 'Ã…land Islands', 'AX', 'ALA', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (17, NULL, 'Azerbaijan', 'AZ', 'AZE', 'assigned', 'AZE', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (18, NULL, 'Bosnia & Herzegovina', 'BA', 'BIH', 'assigned', 'BIH', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (19, NULL, 'Barbados', 'BB', 'BRB', 'assigned', 'BAR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (20, NULL, 'Bangladesh', 'BD', 'BGD', 'assigned', 'BAN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (21, NULL, 'Belgium', 'BE', 'BEL', 'assigned', 'BEL', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (22, NULL, 'Burkina Faso', 'BF', 'BFA', 'assigned', 'BUR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (23, NULL, 'Bulgaria', 'BG', 'BGR', 'assigned', 'BUL', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (24, NULL, 'Bahrain', 'BH', 'BHR', 'assigned', 'BRN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (25, NULL, 'Burundi', 'BI', 'BDI', 'assigned', 'BDI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (26, NULL, 'Benin', 'BJ', 'BEN', 'assigned', 'BEN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (27, NULL, 'Saint BarthÃ©lemy', 'BL', 'BLM', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (28, NULL, 'Bermuda', 'BM', 'BMU', 'assigned', 'BER', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (29, NULL, 'Brunei Darussalam', 'BN', 'BRN', 'assigned', 'BRU', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (30, NULL, 'Bolivia, Plurinational State Of', 'BO', 'BOL', 'assigned', 'BOL', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (31, NULL, 'Bonaire, Saint Eustatius And Saba', 'BQ', 'BES', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (32, NULL, 'Brazil', 'BR', 'BRA', 'assigned', 'BRA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (33, NULL, 'Bahamas', 'BS', 'BHS', 'assigned', 'BAH', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (34, NULL, 'Bhutan', 'BT', 'BTN', 'assigned', 'BHU', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (35, NULL, 'Bouvet Island', 'BV', 'BVT', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (36, NULL, 'Botswana', 'BW', 'BWA', 'assigned', 'BOT', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (37, NULL, 'Belarus', 'BY', 'BLR', 'assigned', 'BLR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (38, NULL, 'Belize', 'BZ', 'BLZ', 'assigned', 'BIZ', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (39, NULL, 'Canada', 'CA', 'CAN', 'assigned', 'CAN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (40, NULL, 'Cocos (Keeling) Islands', 'CC', 'CCK', 'assigned', 'COCOS', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (41, NULL, 'Democratic Republic Of Congo', 'CD', 'COD', 'assigned', 'COD', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (42, NULL, 'Central African Republic', 'CF', 'CAF', 'assigned', 'CAF', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (43, NULL, 'Republic Of Congo', 'CG', 'COG', 'assigned', 'CGO', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (44, NULL, 'Switzerland', 'CH', 'CHE', 'assigned', 'SUI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (45, NULL, 'Cote d''Ivoire', 'CI', 'CIV', 'assigned', 'CIV', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (46, NULL, 'Cook Islands', 'CK', 'COK', 'assigned', 'COK', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (47, NULL, 'Chile', 'CL', 'CHL', 'assigned', 'CHI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (48, NULL, 'Cameroon', 'CM', 'CMR', 'assigned', 'CMR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (49, NULL, 'China', 'CN', 'CHN', 'assigned', 'CHN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (50, NULL, 'Colombia', 'CO', 'COL', 'assigned', 'COL', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (51, NULL, 'Clipperton Island', 'CP', '', 'reserved', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (52, NULL, 'Costa Rica', 'CR', 'CRI', 'assigned', 'CRC', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (53, NULL, 'Cuba', 'CU', 'CUB', 'assigned', 'CUB', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (54, NULL, 'Cabo Verde', 'CV', 'CPV', 'assigned', 'CPV', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (55, NULL, 'Curacao', 'CW', 'CUW', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (56, NULL, 'Christmas Island', 'CX', 'CXR', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (57, NULL, 'Cyprus', 'CY', 'CYP', 'assigned', 'CYP', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (58, NULL, 'Czech Republic', 'CZ', 'CZE', 'assigned', 'CZE', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (59, NULL, 'Germany', 'DE', 'DEU', 'assigned', 'GER', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (60, NULL, 'Diego Garcia', 'DG', '', 'reserved', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (61, NULL, 'Djibouti', 'DJ', 'DJI', 'assigned', 'DJI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (62, NULL, 'Denmark', 'DK', 'DNK', 'assigned', 'DEN', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (63, NULL, 'Dominica', 'DM', 'DMA', 'assigned', 'DMA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (64, NULL, 'Dominican Republic', 'DO', 'DOM', 'assigned', 'DOM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (65, NULL, 'Algeria', 'DZ', 'DZA', 'assigned', 'ALG', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (66, NULL, 'Ceuta, Mulilla', 'EA', '', 'reserved', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (67, NULL, 'Ecuador', 'EC', 'ECU', 'assigned', 'ECU', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (68, NULL, 'Estonia', 'EE', 'EST', 'assigned', 'EST', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (69, NULL, 'Egypt', 'EG', 'EGY', 'assigned', 'EGY', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (70, NULL, 'Western Sahara', 'EH', 'ESH', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (71, NULL, 'Eritrea', 'ER', 'ERI', 'assigned', 'ERI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (72, NULL, 'Spain', 'ES', 'ESP', 'assigned', 'ESP', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (73, NULL, 'Ethiopia', 'ET', 'ETH', 'assigned', 'ETH', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (74, NULL, 'European Union', 'EU', '', 'reserved', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (75, NULL, 'Finland', 'FI', 'FIN', 'assigned', 'FIN', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (76, NULL, 'Fiji', 'FJ', 'FJI', 'assigned', 'FIJ', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (77, NULL, 'Falkland Islands', 'FK', 'FLK', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (78, NULL, 'Micronesia, Federated States Of', 'FM', 'FSM', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (79, NULL, 'Faroe Islands', 'FO', 'FRO', 'assigned', 'FAI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (80, NULL, 'France', 'FR', 'FRA', 'assigned', 'FRA', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (81, NULL, 'France, Metropolitan', 'FX', '', 'reserved', '', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (82, NULL, 'Gabon', 'GA', 'GAB', 'assigned', 'GAB', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (83, NULL, 'United Kingdom', 'GB', 'GBR', 'assigned', 'GBR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (84, NULL, 'Grenada', 'GD', 'GRD', 'assigned', 'GRN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (85, NULL, 'Georgia', 'GE', 'GEO', 'assigned', 'GEO', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (86, NULL, 'French Guiana', 'GF', 'GUF', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (87, NULL, 'Guernsey', 'GG', 'GGY', 'assigned', 'GCI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (88, NULL, 'Ghana', 'GH', 'GHA', 'assigned', 'GHA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (89, NULL, 'Gibraltar', 'GI', 'GIB', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (90, NULL, 'Greenland', 'GL', 'GRL', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (91, NULL, 'Gambia', 'GM', 'GMB', 'assigned', 'GAM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (92, NULL, 'Guinea', 'GN', 'GIN', 'assigned', 'GUI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (93, NULL, 'Guadeloupe', 'GP', 'GLP', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (94, NULL, 'Equatorial Guinea', 'GQ', 'GNQ', 'assigned', 'GEQ', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (95, NULL, 'Greece', 'GR', 'GRC', 'assigned', 'GRE', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (96, NULL, 'South Georgia And The South Sandwich Islands', 'GS', 'SGS', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (97, NULL, 'Guatemala', 'GT', 'GTM', 'assigned', 'GUA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (98, NULL, 'Guam', 'GU', 'GUM', 'assigned', 'GUM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (99, NULL, 'Guinea-bissau', 'GW', 'GNB', 'assigned', 'GBS', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (100, NULL, 'Guyana', 'GY', 'GUY', 'assigned', 'GUY', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (101, NULL, 'Hong Kong', 'HK', 'HKG', 'assigned', 'HKG', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (102, NULL, 'Heard Island And McDonald Islands', 'HM', 'HMD', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (103, NULL, 'Honduras', 'HN', 'HND', 'assigned', 'HON', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (104, NULL, 'Croatia', 'HR', 'HRV', 'assigned', 'CRO', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (105, NULL, 'Haiti', 'HT', 'HTI', 'assigned', 'HAI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (106, NULL, 'Hungary', 'HU', 'HUN', 'assigned', 'HUN', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (107, NULL, 'Canary Islands', 'IC', '', 'reserved', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (108, NULL, 'Indonesia', 'ID', 'IDN', 'assigned', 'INA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (109, NULL, 'Ireland', 'IE', 'IRL', 'assigned', 'IRL', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (110, NULL, 'Israel', 'IL', 'ISR', 'assigned', 'ISR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (111, NULL, 'Isle Of Man', 'IM', 'IMN', 'assigned', '', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (112, NULL, 'India', 'IN', 'IND', 'assigned', 'IND', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (113, NULL, 'British Indian Ocean Territory', 'IO', 'IOT', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (114, NULL, 'Iraq', 'IQ', 'IRQ', 'assigned', 'IRQ', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (115, NULL, 'Iran, Islamic Republic Of', 'IR', 'IRN', 'assigned', 'IRI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (116, NULL, 'Iceland', 'IS', 'ISL', 'assigned', 'ISL', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (117, NULL, 'Italy', 'IT', 'ITA', 'assigned', 'ITA', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (118, NULL, 'Jersey', 'JE', 'JEY', 'assigned', 'JCI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (119, NULL, 'Jamaica', 'JM', 'JAM', 'assigned', 'JAM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (120, NULL, 'Jordan', 'JO', 'JOR', 'assigned', 'JOR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (121, NULL, 'Japan', 'JP', 'JPN', 'assigned', 'JPN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (122, NULL, 'Kenya', 'KE', 'KEN', 'assigned', 'KEN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (123, NULL, 'Kyrgyzstan', 'KG', 'KGZ', 'assigned', 'KGZ', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (124, NULL, 'Cambodia', 'KH', 'KHM', 'assigned', 'CAM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (125, NULL, 'Kiribati', 'KI', 'KIR', 'assigned', 'KIR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (126, NULL, 'Comoros', 'KM', 'COM', 'assigned', 'COM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (127, NULL, 'Saint Kitts And Nevis', 'KN', 'KNA', 'assigned', 'SKN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (128, NULL, 'Korea, Democratic People''s Republic Of', 'KP', 'PRK', 'assigned', 'PRK', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (129, NULL, 'Korea, Republic Of', 'KR', 'KOR', 'assigned', 'KOR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (130, NULL, 'Kuwait', 'KW', 'KWT', 'assigned', 'KUW', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (131, NULL, 'Cayman Islands', 'KY', 'CYM', 'assigned', 'CAY', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (132, NULL, 'Kazakhstan', 'KZ', 'KAZ', 'assigned', 'KAZ', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (133, NULL, 'Lao People''s Democratic Republic', 'LA', 'LAO', 'assigned', 'LAO', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (134, NULL, 'Lebanon', 'LB', 'LBN', 'assigned', 'LIB', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (135, NULL, 'Saint Lucia', 'LC', 'LCA', 'assigned', 'LCA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (136, NULL, 'Liechtenstein', 'LI', 'LIE', 'assigned', 'LIE', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (137, NULL, 'Sri Lanka', 'LK', 'LKA', 'assigned', 'SRI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (138, NULL, 'Liberia', 'LR', 'LBR', 'assigned', 'LBR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (139, NULL, 'Lesotho', 'LS', 'LSO', 'assigned', 'LES', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (140, NULL, 'Lithuania', 'LT', 'LTU', 'assigned', 'LTU', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (141, NULL, 'Luxembourg', 'LU', 'LUX', 'assigned', 'LUX', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (142, NULL, 'Latvia', 'LV', 'LVA', 'assigned', 'LAT', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (143, NULL, 'Libya', 'LY', 'LBY', 'assigned', 'LBA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (144, NULL, 'Morocco', 'MA', 'MAR', 'assigned', 'MAR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (145, NULL, 'Monaco', 'MC', 'MCO', 'assigned', 'MON', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (146, NULL, 'Moldova', 'MD', 'MDA', 'assigned', 'MDA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (147, NULL, 'Montenegro', 'ME', 'MNE', 'assigned', 'MNE', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (148, NULL, 'Saint Martin', 'MF', 'MAF', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (149, NULL, 'Madagascar', 'MG', 'MDG', 'assigned', 'MAD', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (150, NULL, 'Marshall Islands', 'MH', 'MHL', 'assigned', 'MHL', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (151, NULL, 'Macedonia, The Former Yugoslav Republic Of', 'MK', 'MKD', 'assigned', 'MKD', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (152, NULL, 'Mali', 'ML', 'MLI', 'assigned', 'MLI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (153, NULL, 'Myanmar', 'MM', 'MMR', 'assigned', 'MYA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (154, NULL, 'Mongolia', 'MN', 'MNG', 'assigned', 'MGL', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (155, NULL, 'Macao', 'MO', 'MAC', 'assigned', 'MAC', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (156, NULL, 'Northern Mariana Islands', 'MP', 'MNP', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (157, NULL, 'Martinique', 'MQ', 'MTQ', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (158, NULL, 'Mauritania', 'MR', 'MRT', 'assigned', 'MTN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (159, NULL, 'Montserrat', 'MS', 'MSR', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (160, NULL, 'Malta', 'MT', 'MLT', 'assigned', 'MLT', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (161, NULL, 'Mauritius', 'MU', 'MUS', 'assigned', 'MRI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (162, NULL, 'Maldives', 'MV', 'MDV', 'assigned', 'MDV', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (163, NULL, 'Malawi', 'MW', 'MWI', 'assigned', 'MAW', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (164, NULL, 'Mexico', 'MX', 'MEX', 'assigned', 'MEX', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (165, NULL, 'Malaysia', 'MY', 'MYS', 'assigned', 'MAS', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (166, NULL, 'Mozambique', 'MZ', 'MOZ', 'assigned', 'MOZ', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (167, NULL, 'Namibia', 'NA', 'NAM', 'assigned', 'NAM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (168, NULL, 'New Caledonia', 'NC', 'NCL', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (169, NULL, 'Niger', 'NE', 'NER', 'assigned', 'NIG', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (170, NULL, 'Norfolk Island', 'NF', 'NFK', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (171, NULL, 'Nigeria', 'NG', 'NGA', 'assigned', 'NGR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (172, NULL, 'Nicaragua', 'NI', 'NIC', 'assigned', 'NCA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (173, NULL, 'Netherlands', 'NL', 'NLD', 'assigned', 'NED', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (174, NULL, 'Norway', 'NO', 'NOR', 'assigned', 'NOR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (175, NULL, 'Nepal', 'NP', 'NPL', 'assigned', 'NEP', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (176, NULL, 'Nauru', 'NR', 'NRU', 'assigned', 'NRU', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (177, NULL, 'Niue', 'NU', 'NIU', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (178, NULL, 'New Zealand', 'NZ', 'NZL', 'assigned', 'NZL', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (179, NULL, 'Oman', 'OM', 'OMN', 'assigned', 'OMA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (180, NULL, 'Panama', 'PA', 'PAN', 'assigned', 'PAN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (181, NULL, 'Peru', 'PE', 'PER', 'assigned', 'PER', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (182, NULL, 'French Polynesia', 'PF', 'PYF', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (183, NULL, 'Papua New Guinea', 'PG', 'PNG', 'assigned', 'PNG', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (184, NULL, 'Philippines', 'PH', 'PHL', 'assigned', 'PHI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (185, NULL, 'Pakistan', 'PK', 'PAK', 'assigned', 'PAK', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (186, NULL, 'Poland', 'PL', 'POL', 'assigned', 'POL', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (187, NULL, 'Saint Pierre And Miquelon', 'PM', 'SPM', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (188, NULL, 'Pitcairn', 'PN', 'PCN', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (189, NULL, 'Puerto Rico', 'PR', 'PRI', 'assigned', 'PUR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (190, NULL, 'Palestinian Territory, Occupied', 'PS', 'PSE', 'assigned', 'PLE', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (191, NULL, 'Portugal', 'PT', 'PRT', 'assigned', 'POR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (192, NULL, 'Palau', 'PW', 'PLW', 'assigned', 'PLW', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (193, NULL, 'Paraguay', 'PY', 'PRY', 'assigned', 'PAR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (194, NULL, 'Qatar', 'QA', 'QAT', 'assigned', 'QAT', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (195, NULL, 'Reunion', 'RE', 'REU', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (196, NULL, 'Romania', 'RO', 'ROU', 'assigned', 'ROU', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (197, NULL, 'Serbia', 'RS', 'SRB', 'assigned', 'SRB', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (198, NULL, 'Russian Federation', 'RU', 'RUS', 'assigned', 'RUS', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (199, NULL, 'Rwanda', 'RW', 'RWA', 'assigned', 'RWA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (200, NULL, 'Saudi Arabia', 'SA', 'SAU', 'assigned', 'KSA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (201, NULL, 'Solomon Islands', 'SB', 'SLB', 'assigned', 'SOL', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (202, NULL, 'Seychelles', 'SC', 'SYC', 'assigned', 'SEY', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (203, NULL, 'Sudan', 'SD', 'SDN', 'assigned', 'SUD', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (204, NULL, 'Sweden', 'SE', 'SWE', 'assigned', 'SWE', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (205, NULL, 'Singapore', 'SG', 'SGP', 'assigned', 'SIN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (206, NULL, 'Saint Helena, Ascension And Tristan Da Cunha', 'SH', 'SHN', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (207, NULL, 'Slovenia', 'SI', 'SVN', 'assigned', 'SLO', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (208, NULL, 'Svalbard And Jan Mayen', 'SJ', 'SJM', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (209, NULL, 'Slovakia', 'SK', 'SVK', 'assigned', 'SVK', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (210, NULL, 'Sierra Leone', 'SL', 'SLE', 'assigned', 'SLE', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (211, NULL, 'San Marino', 'SM', 'SMR', 'assigned', 'SMR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (212, NULL, 'Senegal', 'SN', 'SEN', 'assigned', 'SEN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (213, NULL, 'Somalia', 'SO', 'SOM', 'assigned', 'SOM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (214, NULL, 'Suriname', 'SR', 'SUR', 'assigned', 'SUR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (215, NULL, 'South Sudan', 'SS', 'SSD', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (216, NULL, 'SÃ£o TomÃ© and PrÃ­ncipe', 'ST', 'STP', 'assigned', 'STP', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (217, NULL, 'USSR', 'SU', '', 'reserved', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (218, NULL, 'El Salvador', 'SV', 'SLV', 'assigned', 'ESA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (219, NULL, 'Sint Maarten', 'SX', 'SXM', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (220, NULL, 'Syrian Arab Republic', 'SY', 'SYR', 'assigned', 'SYR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (221, NULL, 'Swaziland', 'SZ', 'SWZ', 'assigned', 'SWZ', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (222, NULL, 'Tristan de Cunha', 'TA', '', 'reserved', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (223, NULL, 'Turks And Caicos Islands', 'TC', 'TCA', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (224, NULL, 'Chad', 'TD', 'TCD', 'assigned', 'CHA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (225, NULL, 'French Southern Territories', 'TF', 'ATF', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (226, NULL, 'Togo', 'TG', 'TGO', 'assigned', 'TOG', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (227, NULL, 'Thailand', 'TH', 'THA', 'assigned', 'THA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (228, NULL, 'Tajikistan', 'TJ', 'TJK', 'assigned', 'TJK', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (229, NULL, 'Tokelau', 'TK', 'TKL', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (230, NULL, 'Timor-Leste, Democratic Republic of', 'TL', 'TLS', 'assigned', 'TLS', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (231, NULL, 'Turkmenistan', 'TM', 'TKM', 'assigned', 'TKM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (232, NULL, 'Tunisia', 'TN', 'TUN', 'assigned', 'TUN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (233, NULL, 'Tonga', 'TO', 'TON', 'assigned', 'TGA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (234, NULL, 'Turkey', 'TR', 'TUR', 'assigned', 'TUR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (235, NULL, 'Trinidad And Tobago', 'TT', 'TTO', 'assigned', 'TRI', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (236, NULL, 'Tuvalu', 'TV', 'TUV', 'assigned', 'TUV', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (237, NULL, 'Taiwan', 'TW', 'TWN', 'assigned', 'TPE', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (238, NULL, 'Tanzania, United Republic Of', 'TZ', 'TZA', 'assigned', 'TAN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (239, NULL, 'Ukraine', 'UA', 'UKR', 'assigned', 'UKR', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (240, NULL, 'Uganda', 'UG', 'UGA', 'assigned', 'UGA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (241, NULL, 'United Kingdom', 'UK', '', 'reserved', '', 21, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (242, NULL, 'United States Minor Outlying Islands', 'UM', 'UMI', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (243, NULL, 'United States', 'US', 'USA', 'assigned', 'USA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (244, NULL, 'Uruguay', 'UY', 'URY', 'assigned', 'URU', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (245, NULL, 'Uzbekistan', 'UZ', 'UZB', 'assigned', 'UZB', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (246, NULL, 'Vatican City State', 'VA', 'VAT', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (247, NULL, 'Saint Vincent And The Grenadines', 'VC', 'VCT', 'assigned', 'VIN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (248, NULL, 'Venezuela, Bolivarian Republic Of', 'VE', 'VEN', 'assigned', 'VEN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (249, NULL, 'Virgin Islands (British)', 'VG', 'VGB', 'assigned', 'ISV', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (250, NULL, 'Virgin Islands (US)', 'VI', 'VIR', 'assigned', 'ISV', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (251, NULL, 'Viet Nam', 'VN', 'VNM', 'assigned', 'VIE', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (252, NULL, 'Vanuatu', 'VU', 'VUT', 'assigned', 'VAN', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (253, NULL, 'Wallis And Futuna', 'WF', 'WLF', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (254, NULL, 'Samoa', 'WS', 'WSM', 'assigned', 'SAM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (255, NULL, 'Kosovo', 'XK', '', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (256, NULL, 'Yemen', 'YE', 'YEM', 'assigned', 'YEM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (257, NULL, 'Mayotte', 'YT', 'MYT', 'assigned', '', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (258, NULL, 'South Africa', 'ZA', 'ZAF', 'assigned', 'RSA', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (259, NULL, 'Zambia', 'ZM', 'ZMB', 'assigned', 'ZAM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (260, NULL, 'Zimbabwe', 'ZW', 'ZWE', 'assigned', 'ZIM', 0, '2016-07-29 00:53:41', '2016-07-29 00:53:41', NULL);
INSERT INTO "public"."country" VALUES (261, NULL, 'asdf', 'sdf', 'sdf', 'sdf', 'sdf', 0, '2022-02-24 02:05:33', '2022-02-24 02:05:35', NULL);
INSERT INTO "public"."country" VALUES (262, 'asdsad', 'ygf', 'hg', 'hg', 'hg', 'hg', 0, '2022-02-24 02:06:42', '2022-02-24 02:06:43', NULL);

-- ----------------------------
-- Table structure for document
-- ----------------------------
DROP TABLE IF EXISTS "public"."document";
CREATE TABLE "public"."document" (
  "id" int4 NOT NULL DEFAULT nextval('document_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "directory" text COLLATE "pg_catalog"."default" NOT NULL,
  "url" text COLLATE "pg_catalog"."default" NOT NULL,
  "personId" int4 NOT NULL,
  "mipyme_id" int4 NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "deletedAt" timestamp(6)
)
;

-- ----------------------------
-- Records of document
-- ----------------------------

-- ----------------------------
-- Table structure for log
-- ----------------------------
DROP TABLE IF EXISTS "public"."log";
CREATE TABLE "public"."log" (
  "id" int4 NOT NULL DEFAULT nextval('log_seq'::regclass),
  "description" text COLLATE "pg_catalog"."default",
  "personId" text COLLATE "pg_catalog"."default",
  "serverFunctionId" int4 NOT NULL,
  "approverId" int4,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "deletedAt" timestamp(6),
  "statusCode" int4 NOT NULL,
  "originIp" text COLLATE "pg_catalog"."default" NOT NULL,
  "mac" text COLLATE "pg_catalog"."default",
  "navigator" text COLLATE "pg_catalog"."default",
  "os" text COLLATE "pg_catalog"."default",
  "device" text COLLATE "pg_catalog"."default",
  "token_life_time" timestamp(6),
  "service_duration" int4 NOT NULL,
  "last_login" timestamp(6)
)
;

-- ----------------------------
-- Records of log
-- ----------------------------

-- ----------------------------
-- Table structure for mipyme
-- ----------------------------
DROP TABLE IF EXISTS "public"."mipyme";
CREATE TABLE "public"."mipyme" (
  "id" int4 NOT NULL DEFAULT nextval('mipyme_seq'::regclass),
  "reeup_code" text COLLATE "pg_catalog"."default",
  "nit_code" text COLLATE "pg_catalog"."default",
  "license_number" text COLLATE "pg_catalog"."default",
  "name" text COLLATE "pg_catalog"."default",
  "direction" text COLLATE "pg_catalog"."default",
  "authorized_activity" text COLLATE "pg_catalog"."default",
  "country_id" int4 NOT NULL DEFAULT 53,
  "description" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "deletedAt" timestamp(6)
)
;

-- ----------------------------
-- Records of mipyme
-- ----------------------------

-- ----------------------------
-- Table structure for person
-- ----------------------------
DROP TABLE IF EXISTS "public"."person";
CREATE TABLE "public"."person" (
  "id" int4 NOT NULL DEFAULT nextval('person_seq'::regclass),
  "description" text COLLATE "pg_catalog"."default",
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "birthDate" date,
  "age" int4,
  "gender" varchar(255) COLLATE "pg_catalog"."default",
  "photo" text COLLATE "pg_catalog"."default",
  "username" varchar(250) COLLATE "pg_catalog"."default",
  "password" text COLLATE "pg_catalog"."default" NOT NULL,
  "email" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "countryId" int4 NOT NULL DEFAULT 53,
  "personalIdentification" text COLLATE "pg_catalog"."default",
  "hasWasSignedFacebook" int2,
  "hasSignedGoogle" int2,
  "lastLogin" timestamp(6),
  "lastLogout" timestamp(6),
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "deletedAt" timestamp(6),
  "roleId" int4 NOT NULL,
  "confirmCode" varchar(255) COLLATE "pg_catalog"."default" NOT NULL,
  "ci" int8 NOT NULL,
  "volume" int4 NOT NULL,
  "folio" int4 NOT NULL,
  "nit_code" text COLLATE "pg_catalog"."default",
  "mobile" int8,
  "phone" int8,
  "license_number" text COLLATE "pg_catalog"."default",
  "authorized_activity" text COLLATE "pg_catalog"."default",
  "status" "public"."status_person" NOT NULL DEFAULT 'disabled'::status_person,
  "mipyme_id" int4,
  "prefix_mobile" text COLLATE "pg_catalog"."default",
  "is_agent" bool NOT NULL DEFAULT false,
  "exist" bool DEFAULT true
)
;

-- ----------------------------
-- Records of person
-- ----------------------------

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS "public"."role";
CREATE TABLE "public"."role" (
  "id" int4 NOT NULL DEFAULT nextval('role_seq'::regclass),
  "description" text COLLATE "pg_catalog"."default",
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "deletedAt" timestamp(6)
)
;

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO "public"."role" VALUES (9, 'To manage all system', 'master', '2022-02-24 02:16:30', '2022-02-24 02:16:32', NULL);
INSERT INTO "public"."role" VALUES (10, '
Client registered as a self-employed worker', 'tcp', '2022-02-24 02:16:44', '2022-02-24 02:16:46', NULL);
INSERT INTO "public"."role" VALUES (7, 'To manage the administrative part', 'admin', '2022-02-24 02:16:06', '2022-02-24 02:16:08', NULL);

-- ----------------------------
-- Table structure for roleperson
-- ----------------------------
DROP TABLE IF EXISTS "public"."roleperson";
CREATE TABLE "public"."roleperson" (
  "id" int4 NOT NULL DEFAULT nextval('roleperson_seq'::regclass),
  "roleId" int4 NOT NULL,
  "personId" int4 NOT NULL,
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "deletedAt" timestamp(6)
)
;

-- ----------------------------
-- Records of roleperson
-- ----------------------------

-- ----------------------------
-- Table structure for roleserverfunction
-- ----------------------------
DROP TABLE IF EXISTS "public"."roleserverfunction";
CREATE TABLE "public"."roleserverfunction" (
  "id" int4 NOT NULL DEFAULT nextval('roleserverfunction_seq'::regclass),
  "serverFunctionId" int4 NOT NULL,
  "roleId" int4 NOT NULL,
  "canAll" varchar(255) COLLATE "pg_catalog"."default",
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "deletedAt" timestamp(6)
)
;

-- ----------------------------
-- Records of roleserverfunction
-- ----------------------------
INSERT INTO "public"."roleserverfunction" VALUES (1629, 1834, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1631, 1835, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1632, 1837, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1634, 1836, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1636, 1842, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1638, 1854, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1640, 1855, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1642, 1857, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1644, 1856, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1646, 1846, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1648, 1847, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1650, 1849, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1652, 1848, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1654, 1850, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1656, 1858, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1658, 1859, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1660, 1861, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1662, 1860, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1664, 1862, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1666, 1866, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1668, 1867, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1670, 1869, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1672, 1868, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1674, 1870, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1676, 1874, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1678, 1878, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1680, 1838, 7, 'yes', '2022-02-28 00:38:29.893', '2022-02-28 00:38:29.893', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1630, 1834, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1633, 1835, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1635, 1837, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1637, 1836, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1639, 1842, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1641, 1843, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1643, 1845, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1645, 1844, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1647, 1854, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1649, 1855, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1651, 1857, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1653, 1856, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1655, 1846, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1657, 1847, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1659, 1849, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1661, 1848, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1663, 1850, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1665, 1851, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1667, 1853, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1669, 1852, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1671, 1858, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1673, 1859, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1675, 1861, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1677, 1860, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1679, 1862, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1681, 1863, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1682, 1865, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1683, 1864, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1684, 1866, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1685, 1867, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1686, 1869, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1687, 1868, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1688, 1870, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1689, 1871, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1690, 1873, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1691, 1872, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1692, 1874, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1693, 1875, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1694, 1877, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1695, 1876, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1696, 1878, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1697, 1879, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1698, 1881, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1699, 1880, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1700, 1838, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1701, 1839, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1702, 1841, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1703, 1840, 9, 'yes', '2022-02-28 00:38:29.892', '2022-02-28 00:38:29.892', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1704, 1834, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1705, 1835, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1706, 1837, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1707, 1836, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1708, 1842, 10, 'yes', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1709, 1854, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1710, 1855, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1711, 1857, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1712, 1856, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1713, 1846, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1714, 1847, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1715, 1849, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1716, 1848, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1717, 1858, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1718, 1861, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1719, 1860, 10, 'no', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1720, 1878, 10, 'yes', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);
INSERT INTO "public"."roleserverfunction" VALUES (1721, 1838, 10, 'yes', '2022-02-28 00:38:30.723', '2022-02-28 00:38:30.723', NULL);

-- ----------------------------
-- Table structure for serverfunction
-- ----------------------------
DROP TABLE IF EXISTS "public"."serverfunction";
CREATE TABLE "public"."serverfunction" (
  "id" int4 NOT NULL DEFAULT nextval('serverfunction_seq'::regclass),
  "description" text COLLATE "pg_catalog"."default",
  "name" varchar(255) COLLATE "pg_catalog"."default",
  "route" text COLLATE "pg_catalog"."default" NOT NULL,
  "method" text COLLATE "pg_catalog"."default" NOT NULL,
  "free" int4 NOT NULL DEFAULT 0,
  "associatedModel" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "deletedAt" timestamp(6)
)
;

-- ----------------------------
-- Records of serverfunction
-- ----------------------------
INSERT INTO "public"."serverfunction" VALUES (1003, NULL, NULL, '/v1', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1004, NULL, NULL, '/v1/help', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1005, NULL, NULL, '/v1/sign-up', 'POST', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1006, NULL, NULL, '/v1/auth/login', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1007, NULL, NULL, '/v1/auth/logout', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1008, NULL, NULL, '/v1/generate', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1009, NULL, NULL, '/v1/createDataTest', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1010, NULL, NULL, '/v1/consume_data', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1011, NULL, NULL, '/v1/generated_json_postman', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1012, NULL, NULL, '/v1/create_migration', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1014, NULL, NULL, '/v1/confirm', 'GET', 0, NULL, '2022-02-24 20:23:09', '2022-02-24 20:23:11', NULL);
INSERT INTO "public"."serverfunction" VALUES (1015, NULL, NULL, '/v1/send_code', 'GET', 0, NULL, '2022-02-24 20:24:07', '2022-02-24 20:24:11', NULL);
INSERT INTO "public"."serverfunction" VALUES (1016, NULL, NULL, '/v1/change_password', 'POST', 0, NULL, '2022-02-24 20:25:04', '2022-02-24 20:25:06', NULL);
INSERT INTO "public"."serverfunction" VALUES (1017, NULL, NULL, '/v1/change_account', 'PATCH', 0, NULL, '2022-02-24 20:26:18', '2022-02-24 20:26:20', NULL);
INSERT INTO "public"."serverfunction" VALUES (1834, NULL, NULL, '/v1/bank_data', 'PUT', 0, 'bank_data', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1835, NULL, NULL, '/v1/bank_data', 'POST', 0, 'bank_data', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1836, NULL, NULL, '/v1/bank_data', 'PATCH', 0, 'bank_data', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1837, NULL, NULL, '/v1/bank_data', 'DELETE', 0, 'bank_data', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1838, NULL, NULL, '/v1/city', 'PUT', 0, 'city', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1839, NULL, NULL, '/v1/city', 'POST', 0, 'city', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1840, NULL, NULL, '/v1/city', 'PATCH', 0, 'city', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1841, NULL, NULL, '/v1/city', 'DELETE', 0, 'city', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1842, NULL, NULL, '/v1/country', 'PUT', 0, 'country', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1843, NULL, NULL, '/v1/country', 'POST', 0, 'country', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1844, NULL, NULL, '/v1/country', 'PATCH', 0, 'country', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1845, NULL, NULL, '/v1/country', 'DELETE', 0, 'country', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1846, NULL, NULL, '/v1/document', 'PUT', 0, 'document', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1847, NULL, NULL, '/v1/document', 'POST', 0, 'document', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1848, NULL, NULL, '/v1/document', 'PATCH', 0, 'document', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1849, NULL, NULL, '/v1/document', 'DELETE', 0, 'document', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1850, NULL, NULL, '/v1/log', 'PUT', 0, 'log', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1851, NULL, NULL, '/v1/log', 'POST', 0, 'log', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1852, NULL, NULL, '/v1/log', 'PATCH', 0, 'log', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1853, NULL, NULL, '/v1/log', 'DELETE', 0, 'log', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1854, NULL, NULL, '/v1/mipyme', 'PUT', 0, 'mipyme', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1855, NULL, NULL, '/v1/mipyme', 'POST', 0, 'mipyme', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1856, NULL, NULL, '/v1/mipyme', 'PATCH', 0, 'mipyme', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1857, NULL, NULL, '/v1/mipyme', 'DELETE', 0, 'mipyme', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1858, NULL, NULL, '/v1/person', 'PUT', 0, 'person', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1859, NULL, NULL, '/v1/person', 'POST', 0, 'person', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1860, NULL, NULL, '/v1/person', 'PATCH', 0, 'person', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1861, NULL, NULL, '/v1/person', 'DELETE', 0, 'person', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1862, NULL, NULL, '/v1/role', 'PUT', 0, 'role', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1863, NULL, NULL, '/v1/role', 'POST', 0, 'role', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1864, NULL, NULL, '/v1/role', 'PATCH', 0, 'role', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1865, NULL, NULL, '/v1/role', 'DELETE', 0, 'role', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1866, NULL, NULL, '/v1/roleperson', 'PUT', 0, 'roleperson', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1867, NULL, NULL, '/v1/roleperson', 'POST', 0, 'roleperson', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1868, NULL, NULL, '/v1/roleperson', 'PATCH', 0, 'roleperson', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1869, NULL, NULL, '/v1/roleperson', 'DELETE', 0, 'roleperson', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1870, NULL, NULL, '/v1/roleserverfunction', 'PUT', 0, 'roleserverfunction', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1871, NULL, NULL, '/v1/roleserverfunction', 'POST', 0, 'roleserverfunction', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1872, NULL, NULL, '/v1/roleserverfunction', 'PATCH', 0, 'roleserverfunction', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1873, NULL, NULL, '/v1/roleserverfunction', 'DELETE', 0, 'roleserverfunction', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1874, NULL, NULL, '/v1/serverfunction', 'PUT', 0, 'serverfunction', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1875, NULL, NULL, '/v1/serverfunction', 'POST', 0, 'serverfunction', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1876, NULL, NULL, '/v1/serverfunction', 'PATCH', 0, 'serverfunction', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1877, NULL, NULL, '/v1/serverfunction', 'DELETE', 0, 'serverfunction', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1878, NULL, NULL, '/v1/state', 'PUT', 0, 'state', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1879, NULL, NULL, '/v1/state', 'POST', 0, 'state', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1880, NULL, NULL, '/v1/state', 'PATCH', 0, 'state', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1881, NULL, NULL, '/v1/state', 'DELETE', 0, 'state', '2022-02-28 00:38:29.806', '2022-02-28 00:38:29.806', NULL);
INSERT INTO "public"."serverfunction" VALUES (1882, NULL, NULL, '/v1/auth/login_email', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1883, NULL, NULL, '/v1/auth/login_email_or_username', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1884, NULL, NULL, '/v1/auth/confirm', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1885, NULL, NULL, '/v1/auth/send_code', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1886, NULL, NULL, '/v1/auth/change_password', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);
INSERT INTO "public"."serverfunction" VALUES (1887, NULL, NULL, '/v1/auth/change_account', 'GET', 0, NULL, '2021-04-17 00:48:56', '2021-04-17 00:48:56', NULL);

-- ----------------------------
-- Table structure for state
-- ----------------------------
DROP TABLE IF EXISTS "public"."state";
CREATE TABLE "public"."state" (
  "id" int4 NOT NULL DEFAULT nextval('state_seq'::regclass),
  "name" text COLLATE "pg_catalog"."default" NOT NULL,
  "description" text COLLATE "pg_catalog"."default",
  "createdAt" timestamp(6) NOT NULL,
  "updatedAt" timestamp(6) NOT NULL,
  "deletedAt" timestamp(6),
  "country_id" int4 NOT NULL
)
;

-- ----------------------------
-- Records of state
-- ----------------------------

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."bank_data_seq"
OWNED BY "public"."bank_data"."id";
SELECT setval('"public"."bank_data_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."city_seq"
OWNED BY "public"."city"."id";
SELECT setval('"public"."city_seq"', 3, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."country_seq"
OWNED BY "public"."country"."id";
SELECT setval('"public"."country_seq"', 262, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."document_seq"
OWNED BY "public"."document"."id";
SELECT setval('"public"."document_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."log_seq"
OWNED BY "public"."log"."id";
SELECT setval('"public"."log_seq"', 465, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."mipyme_seq"
OWNED BY "public"."mipyme"."id";
SELECT setval('"public"."mipyme_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."person_seq"
OWNED BY "public"."person"."id";
SELECT setval('"public"."person_seq"', 35, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."role_seq"
OWNED BY "public"."role"."id";
SELECT setval('"public"."role_seq"', 12, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."roleperson_seq"
OWNED BY "public"."roleperson"."id";
SELECT setval('"public"."roleperson_seq"', 1, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."roleserverfunction_seq"
OWNED BY "public"."roleserverfunction"."id";
SELECT setval('"public"."roleserverfunction_seq"', 1721, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."serverfunction_seq"
OWNED BY "public"."serverfunction"."id";
SELECT setval('"public"."serverfunction_seq"', 1887, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."state_seq"
OWNED BY "public"."state"."id";
SELECT setval('"public"."state_seq"', 2, true);

-- ----------------------------
-- Indexes structure for table bank_data
-- ----------------------------
CREATE INDEX "Ref501" ON "public"."bank_data" USING btree (
  "personId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "Ref502" ON "public"."bank_data" USING btree (
  "mipyme_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table bank_data
-- ----------------------------
ALTER TABLE "public"."bank_data" ADD CONSTRAINT "bank_data_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table city
-- ----------------------------
CREATE INDEX "Ref601" ON "public"."city" USING btree (
  "state_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table city
-- ----------------------------
ALTER TABLE "public"."city" ADD CONSTRAINT "name_city_UNIQUE" UNIQUE ("name");

-- ----------------------------
-- Primary Key structure for table city
-- ----------------------------
ALTER TABLE "public"."city" ADD CONSTRAINT "city_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table country
-- ----------------------------
ALTER TABLE "public"."country" ADD CONSTRAINT "country_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table document
-- ----------------------------
CREATE INDEX "Ref503" ON "public"."document" USING btree (
  "personId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "Ref504" ON "public"."document" USING btree (
  "mipyme_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table document
-- ----------------------------
ALTER TABLE "public"."document" ADD CONSTRAINT "document_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table log
-- ----------------------------
CREATE INDEX "serverFunctionId" ON "public"."log" USING btree (
  "serverFunctionId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table log
-- ----------------------------
ALTER TABLE "public"."log" ADD CONSTRAINT "_copy_11" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table mipyme
-- ----------------------------
CREATE INDEX "Ref500" ON "public"."mipyme" USING btree (
  "country_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table mipyme
-- ----------------------------
ALTER TABLE "public"."mipyme" ADD CONSTRAINT "reeup_code_UNIQUE" UNIQUE ("reeup_code");
ALTER TABLE "public"."mipyme" ADD CONSTRAINT "nit_code_UNIQUE" UNIQUE ("nit_code");
ALTER TABLE "public"."mipyme" ADD CONSTRAINT "license_number_UNIQUE" UNIQUE ("license_number");

-- ----------------------------
-- Primary Key structure for table mipyme
-- ----------------------------
ALTER TABLE "public"."mipyme" ADD CONSTRAINT "mipyme_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table person
-- ----------------------------
CREATE INDEX "Ref505" ON "public"."person" USING btree (
  "mipyme_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "Ref651" ON "public"."person" USING btree (
  "roleId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "Ref917" ON "public"."person" USING btree (
  "countryId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "confirmCode_UNIQUE" ON "public"."person" USING btree (
  "confirmCode" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "email_UNIQUE" ON "public"."person" USING btree (
  "email" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);
CREATE UNIQUE INDEX "username_UNIQUE" ON "public"."person" USING btree (
  "username" COLLATE "pg_catalog"."default" "pg_catalog"."text_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table person
-- ----------------------------
ALTER TABLE "public"."person" ADD CONSTRAINT "ci_UNIQUE" UNIQUE ("ci");

-- ----------------------------
-- Primary Key structure for table person
-- ----------------------------
ALTER TABLE "public"."person" ADD CONSTRAINT "person_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Uniques structure for table role
-- ----------------------------
ALTER TABLE "public"."role" ADD CONSTRAINT "name_UNIQUE" UNIQUE ("name");

-- ----------------------------
-- Primary Key structure for table role
-- ----------------------------
ALTER TABLE "public"."role" ADD CONSTRAINT "_copy_5" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table roleperson
-- ----------------------------
CREATE INDEX "personId" ON "public"."roleperson" USING btree (
  "personId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "roleId_copy_2" ON "public"."roleperson" USING btree (
  "roleId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table roleperson
-- ----------------------------
ALTER TABLE "public"."roleperson" ADD CONSTRAINT "_copy_4" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table roleserverfunction
-- ----------------------------
CREATE INDEX "roleId_copy_1" ON "public"."roleserverfunction" USING btree (
  "roleId" "pg_catalog"."int4_ops" ASC NULLS LAST
);
CREATE INDEX "serverFunctionId_copy_1" ON "public"."roleserverfunction" USING btree (
  "serverFunctionId" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Primary Key structure for table roleserverfunction
-- ----------------------------
ALTER TABLE "public"."roleserverfunction" ADD CONSTRAINT "_copy_3" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table serverfunction
-- ----------------------------
ALTER TABLE "public"."serverfunction" ADD CONSTRAINT "_copy_2" PRIMARY KEY ("id");

-- ----------------------------
-- Indexes structure for table state
-- ----------------------------
CREATE INDEX "Ref600" ON "public"."state" USING btree (
  "country_id" "pg_catalog"."int4_ops" ASC NULLS LAST
);

-- ----------------------------
-- Uniques structure for table state
-- ----------------------------
ALTER TABLE "public"."state" ADD CONSTRAINT "name_state_UNIQUE" UNIQUE ("name");

-- ----------------------------
-- Primary Key structure for table state
-- ----------------------------
ALTER TABLE "public"."state" ADD CONSTRAINT "state_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Foreign Keys structure for table bank_data
-- ----------------------------
ALTER TABLE "public"."bank_data" ADD CONSTRAINT "fk_bank_data_mipyme_1" FOREIGN KEY ("mipyme_id") REFERENCES "public"."mipyme" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."bank_data" ADD CONSTRAINT "fk_bank_data_person_1" FOREIGN KEY ("personId") REFERENCES "public"."person" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table city
-- ----------------------------
ALTER TABLE "public"."city" ADD CONSTRAINT "fk_city_state_1" FOREIGN KEY ("state_id") REFERENCES "public"."state" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table document
-- ----------------------------
ALTER TABLE "public"."document" ADD CONSTRAINT "fk_document_mipyme_1" FOREIGN KEY ("mipyme_id") REFERENCES "public"."mipyme" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."document" ADD CONSTRAINT "fk_document_person_1" FOREIGN KEY ("personId") REFERENCES "public"."person" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table log
-- ----------------------------
ALTER TABLE "public"."log" ADD CONSTRAINT "log_ibfk_1" FOREIGN KEY ("serverFunctionId") REFERENCES "public"."serverfunction" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table mipyme
-- ----------------------------
ALTER TABLE "public"."mipyme" ADD CONSTRAINT "fk_mipyme_country_1" FOREIGN KEY ("country_id") REFERENCES "public"."country" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table person
-- ----------------------------
ALTER TABLE "public"."person" ADD CONSTRAINT "fk_person_mipyme_1" FOREIGN KEY ("mipyme_id") REFERENCES "public"."mipyme" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."person" ADD CONSTRAINT "person_ibfk_1" FOREIGN KEY ("countryId") REFERENCES "public"."country" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."person" ADD CONSTRAINT "person_ibfk_2" FOREIGN KEY ("roleId") REFERENCES "public"."role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table roleperson
-- ----------------------------
ALTER TABLE "public"."roleperson" ADD CONSTRAINT "roleperson_ibfk_1" FOREIGN KEY ("roleId") REFERENCES "public"."role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."roleperson" ADD CONSTRAINT "roleperson_ibfk_2" FOREIGN KEY ("personId") REFERENCES "public"."person" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table roleserverfunction
-- ----------------------------
ALTER TABLE "public"."roleserverfunction" ADD CONSTRAINT "roleserverfunction_ibfk_1" FOREIGN KEY ("serverFunctionId") REFERENCES "public"."serverfunction" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE "public"."roleserverfunction" ADD CONSTRAINT "roleserverfunction_ibfk_2" FOREIGN KEY ("roleId") REFERENCES "public"."role" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- ----------------------------
-- Foreign Keys structure for table state
-- ----------------------------
ALTER TABLE "public"."state" ADD CONSTRAINT "fk_state_country_1" FOREIGN KEY ("country_id") REFERENCES "public"."country" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
