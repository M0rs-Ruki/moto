--
-- PostgreSQL database dump
--

\restrict JQh0uflwai8OsoJumikcaWheMz8eROlkipb43nqD9XTcQAMnOGCgQfmTqDhMrGG

-- Dumped from database version 15.15 (Debian 15.15-1.pgdg13+1)
-- Dumped by pg_dump version 18.1 (Ubuntu 18.1-1.pgdg24.04+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: utkalUser
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO "utkalUser";

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: utkalUser
--

COMMENT ON SCHEMA public IS '';


--
-- Name: BulkUploadJobStatus; Type: TYPE; Schema: public; Owner: utkalUser
--

CREATE TYPE public."BulkUploadJobStatus" AS ENUM (
    'QUEUED',
    'PROCESSING',
    'COMPLETED',
    'FAILED'
);


ALTER TYPE public."BulkUploadJobStatus" OWNER TO "utkalUser";

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: utkalUser
--

CREATE TYPE public."UserRole" AS ENUM (
    'admin',
    'user',
    'super_admin'
);


ALTER TYPE public."UserRole" OWNER TO "utkalUser";

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: BulkUploadJob; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."BulkUploadJob" (
    id text NOT NULL,
    "jobId" text NOT NULL,
    type text NOT NULL,
    status public."BulkUploadJobStatus" DEFAULT 'QUEUED'::public."BulkUploadJobStatus" NOT NULL,
    "totalRows" integer NOT NULL,
    "processedRows" integer DEFAULT 0 NOT NULL,
    "successCount" integer DEFAULT 0 NOT NULL,
    "errorCount" integer DEFAULT 0 NOT NULL,
    "failedRows" jsonb,
    "dealershipId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone
);


ALTER TABLE public."BulkUploadJob" OWNER TO "utkalUser";

--
-- Name: BulkUploadJobResult; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."BulkUploadJobResult" (
    id text NOT NULL,
    "jobId" text NOT NULL,
    "rowNumber" integer NOT NULL,
    success boolean NOT NULL,
    data jsonb,
    error text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."BulkUploadJobResult" OWNER TO "utkalUser";

--
-- Name: Dealership; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."Dealership" (
    id text NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "showroomNumber" text,
    "organizationId" text
);


ALTER TABLE public."Dealership" OWNER TO "utkalUser";

--
-- Name: DeliveryTicket; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."DeliveryTicket" (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "whatsappNumber" text NOT NULL,
    email text,
    address text,
    description text,
    "deliveryDate" timestamp(3) without time zone NOT NULL,
    "messageSent" boolean DEFAULT false NOT NULL,
    "whatsappContactId" text,
    "dealershipId" text,
    "modelId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "variantId" text,
    "completionSent" boolean DEFAULT false NOT NULL,
    status text DEFAULT 'active'::text NOT NULL
);


ALTER TABLE public."DeliveryTicket" OWNER TO "utkalUser";

--
-- Name: DigitalEnquiry; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."DigitalEnquiry" (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "whatsappNumber" text NOT NULL,
    email text,
    address text,
    reason text NOT NULL,
    "leadScope" text DEFAULT 'warm'::text NOT NULL,
    "whatsappContactId" text,
    "dealershipId" text,
    "leadSourceId" text,
    "interestedModelId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "interestedVariantId" text,
    "modelText" text,
    "sourceText" text
);


ALTER TABLE public."DigitalEnquiry" OWNER TO "utkalUser";

--
-- Name: DigitalEnquirySession; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."DigitalEnquirySession" (
    id text NOT NULL,
    notes text,
    status text DEFAULT 'active'::text NOT NULL,
    "digitalEnquiryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DigitalEnquirySession" OWNER TO "utkalUser";

--
-- Name: FieldInquiry; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."FieldInquiry" (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "whatsappNumber" text NOT NULL,
    email text,
    address text,
    reason text NOT NULL,
    "leadScope" text DEFAULT 'warm'::text NOT NULL,
    "whatsappContactId" text,
    "dealershipId" text,
    "leadSourceId" text,
    "interestedModelId" text,
    "interestedVariantId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FieldInquiry" OWNER TO "utkalUser";

--
-- Name: FieldInquirySession; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."FieldInquirySession" (
    id text NOT NULL,
    notes text,
    status text DEFAULT 'active'::text NOT NULL,
    "fieldInquiryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FieldInquirySession" OWNER TO "utkalUser";

--
-- Name: LeadSource; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."LeadSource" (
    id text NOT NULL,
    name text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "dealershipId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LeadSource" OWNER TO "utkalUser";

--
-- Name: OrgFeatureToggle; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."OrgFeatureToggle" (
    id text NOT NULL,
    "organizationId" text NOT NULL,
    dashboard boolean DEFAULT true NOT NULL,
    "dailyWalkinsVisitors" boolean DEFAULT true NOT NULL,
    "dailyWalkinsSessions" boolean DEFAULT true NOT NULL,
    "digitalEnquiry" boolean DEFAULT true NOT NULL,
    "fieldInquiry" boolean DEFAULT true NOT NULL,
    "deliveryUpdate" boolean DEFAULT true NOT NULL,
    "exportExcel" boolean DEFAULT true NOT NULL,
    "settingsProfile" boolean DEFAULT true NOT NULL,
    "settingsVehicleModels" boolean DEFAULT true NOT NULL,
    "settingsLeadSources" boolean DEFAULT true NOT NULL,
    "settingsWhatsApp" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."OrgFeatureToggle" OWNER TO "utkalUser";

--
-- Name: Organization; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."Organization" (
    id text NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Organization" OWNER TO "utkalUser";

--
-- Name: ScheduledMessage; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."ScheduledMessage" (
    id text NOT NULL,
    "scheduledFor" timestamp(3) without time zone NOT NULL,
    "sentAt" timestamp(3) without time zone,
    status text DEFAULT 'pending'::text NOT NULL,
    "retryCount" integer DEFAULT 0 NOT NULL,
    "deliveryTicketId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."ScheduledMessage" OWNER TO "utkalUser";

--
-- Name: TestDrive; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."TestDrive" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    "modelId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "variantId" text
);


ALTER TABLE public."TestDrive" OWNER TO "utkalUser";

--
-- Name: User; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "dealershipId" text,
    theme text DEFAULT 'light'::text NOT NULL,
    "profilePicture" text,
    "isActive" boolean DEFAULT true NOT NULL,
    role public."UserRole" DEFAULT 'user'::public."UserRole" NOT NULL,
    "organizationId" text
);


ALTER TABLE public."User" OWNER TO "utkalUser";

--
-- Name: UserPermission; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."UserPermission" (
    id text NOT NULL,
    "userId" text NOT NULL,
    dashboard boolean DEFAULT false NOT NULL,
    "dailyWalkinsVisitors" boolean DEFAULT false NOT NULL,
    "dailyWalkinsSessions" boolean DEFAULT false NOT NULL,
    "digitalEnquiry" boolean DEFAULT false NOT NULL,
    "fieldInquiry" boolean DEFAULT false NOT NULL,
    "deliveryUpdate" boolean DEFAULT false NOT NULL,
    "settingsProfile" boolean DEFAULT false NOT NULL,
    "settingsVehicleModels" boolean DEFAULT false NOT NULL,
    "settingsLeadSources" boolean DEFAULT false NOT NULL,
    "settingsWhatsApp" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "exportExcel" boolean DEFAULT false NOT NULL
);


ALTER TABLE public."UserPermission" OWNER TO "utkalUser";

--
-- Name: VehicleCategory; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."VehicleCategory" (
    id text NOT NULL,
    name text NOT NULL,
    "dealershipId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VehicleCategory" OWNER TO "utkalUser";

--
-- Name: VehicleModel; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."VehicleModel" (
    id text NOT NULL,
    name text NOT NULL,
    year integer,
    "categoryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VehicleModel" OWNER TO "utkalUser";

--
-- Name: VehicleVariant; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."VehicleVariant" (
    id text NOT NULL,
    name text NOT NULL,
    "modelId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VehicleVariant" OWNER TO "utkalUser";

--
-- Name: Visitor; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."Visitor" (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "whatsappNumber" text NOT NULL,
    email text,
    address text,
    "whatsappContactId" text,
    "dealershipId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Visitor" OWNER TO "utkalUser";

--
-- Name: VisitorInterest; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."VisitorInterest" (
    id text NOT NULL,
    "visitorId" text NOT NULL,
    "modelId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "sessionId" text,
    "variantId" text
);


ALTER TABLE public."VisitorInterest" OWNER TO "utkalUser";

--
-- Name: VisitorSession; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."VisitorSession" (
    id text NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'intake'::text NOT NULL,
    "visitorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    feedback text
);


ALTER TABLE public."VisitorSession" OWNER TO "utkalUser";

--
-- Name: WhatsAppTemplate; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public."WhatsAppTemplate" (
    id text NOT NULL,
    name text NOT NULL,
    "templateId" text NOT NULL,
    "templateName" text NOT NULL,
    language text DEFAULT 'en_US'::text NOT NULL,
    type text NOT NULL,
    "dealershipId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    section text DEFAULT 'global'::text
);


ALTER TABLE public."WhatsAppTemplate" OWNER TO "utkalUser";

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: utkalUser
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO "utkalUser";

--
-- Data for Name: BulkUploadJob; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."BulkUploadJob" (id, "jobId", type, status, "totalRows", "processedRows", "successCount", "errorCount", "failedRows", "dealershipId", "createdAt", "updatedAt", "completedAt") FROM stdin;
cml2jng6m00009yifcthlfy8e	8b1b6e35-81c0-4257-84f9-298c322452de	digital_enquiry	QUEUED	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-31 16:46:18.163	2026-01-31 16:46:18.163	\N
cml2jqdqz00009yiggzvh2qjj	a678445c-fd6b-475a-8576-0051e21a8563	digital_enquiry	QUEUED	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-31 16:48:35.099	2026-01-31 16:48:35.099	\N
cml2jwl2900009ysucg4d6wpw	ebaefe0b-d97a-4a19-8ab6-0ef5ba6b139a	digital_enquiry	PROCESSING	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-31 16:53:24.396	2026-01-31 16:53:24.968	\N
cml69p8h3009wqn0ku05i2q65	0a325c46-6509-4676-8e74-6549d9f71e38	digital_enquiry	COMPLETED	2	0	2	0	\N	cmk130qz40000l704z6fc2alp	2026-02-03 07:18:50.151	2026-02-03 07:18:53.212	2026-02-03 07:18:53.212
cml0i5edq000apo0k7kul4zl7	4ce75216-e791-4b4c-b641-851f37f25a2a	digital_enquiry	COMPLETED	72	70	72	0	\N	cmk130qz40000l704z6fc2alp	2026-01-30 06:28:44.174	2026-01-30 06:30:27.476	2026-01-30 06:30:27.476
cmkzgsmru0014me0kgmrv8oif	46b79f30-146c-473e-bae9-7868a6d6d5dc	digital_enquiry	COMPLETED	95	90	95	0	\N	cmk130qz40000l704z6fc2alp	2026-01-29 13:03:02.73	2026-01-29 13:04:57.213	2026-01-29 13:04:57.213
cmkwvsbel001rr10ly17ezu8y	4fd4e3c4-c793-4fea-8342-1f808fffc818	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-27 17:39:23.709	2026-01-31 15:07:02.255	2026-01-27 17:39:34.419
cmkr22j6800009yn1to29kr1d	b8d1dfe6-675c-43cf-b545-bf1ed5ead263	digital_enquiry	COMPLETED	10	10	10	0	null	cmivgorqg00009y5iyf5y9s5b	2026-01-23 15:48:40.976	2026-01-31 15:07:02.255	2026-01-23 15:48:54.068
cmky66kty00009yq3yhjdc13g	6d52e00e-b3bf-4e4a-b2c7-3d206a5aeefc	digital_enquiry	QUEUED	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-28 15:18:11.446	2026-01-31 15:07:02.255	\N
cmkr23kms000l9yn16co4crwa	f2110753-4ecf-43ea-b80a-915b26ecbc5f	digital_enquiry	COMPLETED	10	10	10	0	null	cmivgorqg00009y5iyf5y9s5b	2026-01-23 15:49:29.524	2026-01-31 15:07:02.255	2026-01-23 15:49:44.037
cmky67x4q00019yq35a9q6nvu	4236f4c1-9290-486e-aafe-927706a8ebda	digital_enquiry	QUEUED	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-28 15:19:14.042	2026-01-31 15:07:02.255	\N
cmkr254bt00009yq007tka1m0	95fec569-1121-436f-8b50-ad0cbb28c255	digital_enquiry	COMPLETED	10	10	10	0	null	cmivgorqg00009y5iyf5y9s5b	2026-01-23 15:50:41.705	2026-01-31 15:07:02.255	2026-01-23 15:50:55.631
cmky68y6i00029yq3tlf88876	6acd738b-2f6d-4b2d-8ad3-affaa5d0e9be	digital_enquiry	QUEUED	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-28 15:20:02.058	2026-01-31 15:07:02.255	\N
cmkr26398000l9yq0heslpkjn	c0b2aad3-55d3-4fb5-8532-2872b999c845	digital_enquiry	COMPLETED	10	10	10	0	null	cmivgorqg00009y5iyf5y9s5b	2026-01-23 15:51:26.972	2026-01-31 15:07:02.255	2026-01-23 15:51:41.755
cmky6ecnx00009ydfye3tjfni	adad797f-4ea6-4be9-8685-3c2e8255ac0d	digital_enquiry	QUEUED	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-28 15:24:14.11	2026-01-31 15:07:02.255	\N
cmkr2gan700009ydm6jhrfsdp	dff03c70-4a0b-46cc-b6c5-00e61c96f043	digital_enquiry	COMPLETED	10	10	10	0	null	cmivgorqg00009y5iyf5y9s5b	2026-01-23 15:59:23.108	2026-01-31 15:07:02.255	2026-01-23 15:59:51.842
cmkwqfi4200009yar1pbvsfim	df541732-5003-43d1-bf0c-278c7d5dd2c6	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-27 15:09:27.794	2026-01-31 15:07:02.255	2026-01-27 15:09:56.016
cmkwutyws0000n30k4h7u3hzg	94a6f79b-a82f-4e0e-bc6a-f676366428c0	digital_enquiry	QUEUED	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-27 17:12:41.212	2026-01-31 15:07:02.255	\N
cmkwvi5r80001n30k1uhvsunf	18305b9d-7680-4b0c-98e5-2032fd6fa526	digital_enquiry	QUEUED	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-27 17:31:29.759	2026-01-31 15:07:02.255	\N
cmkwvjfav0000r10lew1lq7mq	02586dda-4bdf-4df0-8d44-0116d3be3e16	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-27 17:32:28.855	2026-01-31 15:07:02.255	2026-01-27 17:32:40.739
cmky8ah5z00009yn7fljrfymq	296d86a3-bf62-4735-805c-c31f8f062f98	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-28 16:17:12.551	2026-01-31 15:07:02.255	2026-01-28 16:17:58.424
cmkwvqnqu000lr10lu2889wjt	6aeafb8a-8904-40fd-a2c4-60c54c0402ce	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-27 17:38:06.39	2026-01-31 15:07:02.255	2026-01-27 17:38:17.88
cmky72joe00009yqm9vcn5eyn	37e6f995-ec37-4cf0-8eab-7f0286f0b5a3	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-28 15:43:02.942	2026-01-31 15:07:02.255	2026-01-28 15:43:35.566
cmkwvr9yi0016r10ldyoa69ol	7c8e9647-aa8d-4de4-bb89-d530bdcca367	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-27 17:38:35.178	2026-01-31 15:07:02.255	2026-01-27 17:38:47.197
cmky7agpy00009yxo27x3bnnu	defc38b8-78d6-41f8-bb14-fc3e1ffaf90a	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-28 15:49:12.358	2026-01-31 15:07:02.255	2026-01-28 15:49:53.065
cmky7kwd000009yzk43w3e1ch	a79a6f15-5354-465e-9531-55f0a4b3aa53	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-28 15:57:19.189	2026-01-31 15:07:02.255	2026-01-28 15:58:02.545
cmky7osx800159yzk0wkkiizw	1a24a5eb-7e3a-4523-80d2-80154eb402e3	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-28 16:00:21.356	2026-01-31 15:07:02.255	2026-01-28 16:00:45.516
cmky7x3ta00009ynljfo89btv	b36f0a04-6962-433c-b83a-3ac87b73b672	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-28 16:06:48.718	2026-01-31 15:07:02.255	2026-01-28 16:07:15.763
cml11v77400009yuqemkxu2sg	67b51cdc-5ef8-4ff0-9999-3ef30dec7348	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-30 15:40:40.624	2026-01-31 15:07:02.255	2026-01-30 15:49:14.843
cml13avwq00009yx6iiv49q7s	e1a23325-efa5-41fb-af70-5fd2f3d31769	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-30 16:20:52.106	2026-01-31 15:07:02.255	2026-01-30 16:21:54.718
cmkzmxico00009y3p4q4k7mbk	b7a33cbf-fbf9-437c-97f3-a6d018f7975a	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-29 15:54:47.976	2026-01-31 15:07:02.255	2026-01-29 15:55:17.247
cml12z4ma00009yfunhbhgfpr	fe29cb65-2fe5-450a-b5fe-884602ed9902	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-30 16:11:43.522	2026-01-31 15:07:02.255	2026-01-30 16:12:13.377
cml0i89n6004bpo0kiwx5p1k3	6ac95864-e772-4811-bf64-90329ea9aadc	digital_enquiry	COMPLETED	10	10	10	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-30 06:30:58.002	2026-01-31 15:07:02.255	2026-01-30 06:31:10.474
cml11sbum00009yayrarh5h9d	0862b619-852b-4ac4-9ad8-1fdb37a1bbd3	digital_enquiry	QUEUED	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-30 15:38:26.686	2026-01-31 15:07:02.255	\N
cml2jo0d300009yq56g6wv0oe	ae884260-a298-4789-9f54-87ea0ad8f37d	digital_enquiry	QUEUED	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-31 16:46:44.439	2026-01-31 16:46:44.439	\N
cml2jv0of00029y54mj4hd6rq	1e735fa5-a5cf-4696-9ef4-36337a86953e	digital_enquiry	QUEUED	10	0	0	0	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-31 16:52:11.439	2026-01-31 16:52:11.439	\N
cml5g1q3a0017qn0kaydmfcwl	705ee8b9-935f-4f08-8e44-f27bacf264d6	digital_enquiry	COMPLETED	142	140	142	0	\N	cmk130qz40000l704z6fc2alp	2026-02-02 17:28:44.363	2026-02-02 17:31:38.822	2026-02-02 17:31:38.822
\.


--
-- Data for Name: BulkUploadJobResult; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."BulkUploadJobResult" (id, "jobId", "rowNumber", success, data, error, "createdAt") FROM stdin;
cmkr22l3g00029yn1ha1f039v	b8d1dfe6-675c-43cf-b545-bf1ed5ead263	2	t	\N	\N	2026-01-23 15:48:43.468
cmkr22m0i00049yn1m8w85uva	b8d1dfe6-675c-43cf-b545-bf1ed5ead263	3	t	\N	\N	2026-01-23 15:48:44.659
cmkr22myr00069yn161gli1vf	b8d1dfe6-675c-43cf-b545-bf1ed5ead263	4	t	\N	\N	2026-01-23 15:48:45.891
cmkr22ntz00089yn1fsp0rae0	b8d1dfe6-675c-43cf-b545-bf1ed5ead263	5	t	\N	\N	2026-01-23 15:48:47.016
cmkr22os4000a9yn12qk59e17	b8d1dfe6-675c-43cf-b545-bf1ed5ead263	6	t	\N	\N	2026-01-23 15:48:48.244
cmkr22pkl000c9yn1s4bvn9ek	b8d1dfe6-675c-43cf-b545-bf1ed5ead263	7	t	\N	\N	2026-01-23 15:48:49.269
cmkr22qit000e9yn15vcjjfbx	b8d1dfe6-675c-43cf-b545-bf1ed5ead263	8	t	\N	\N	2026-01-23 15:48:50.501
cmkr22re0000g9yn17dd7lbcx	b8d1dfe6-675c-43cf-b545-bf1ed5ead263	9	t	\N	\N	2026-01-23 15:48:51.624
cmkr22s8j000i9yn1jizbrbz6	b8d1dfe6-675c-43cf-b545-bf1ed5ead263	10	t	\N	\N	2026-01-23 15:48:52.723
cmkr22t20000k9yn1wc1xthul	b8d1dfe6-675c-43cf-b545-bf1ed5ead263	11	t	\N	\N	2026-01-23 15:48:53.784
cmkr23n07000n9yn1t8ar6zub	f2110753-4ecf-43ea-b80a-915b26ecbc5f	2	t	\N	\N	2026-01-23 15:49:32.599
cmkr23o18000p9yn1mj2tv5bn	f2110753-4ecf-43ea-b80a-915b26ecbc5f	3	t	\N	\N	2026-01-23 15:49:33.933
cmkr23ovs000r9yn1hwnnttaf	f2110753-4ecf-43ea-b80a-915b26ecbc5f	4	t	\N	\N	2026-01-23 15:49:35.033
cmkr23pun000t9yn1jfz6pe5x	f2110753-4ecf-43ea-b80a-915b26ecbc5f	5	t	\N	\N	2026-01-23 15:49:36.287
cmkr23qof000v9yn1vvt20bam	f2110753-4ecf-43ea-b80a-915b26ecbc5f	6	t	\N	\N	2026-01-23 15:49:37.36
cmkr23rqy000x9yn18by1vp4y	f2110753-4ecf-43ea-b80a-915b26ecbc5f	7	t	\N	\N	2026-01-23 15:49:38.746
cmkr23smx000z9yn1mi9pqpb0	f2110753-4ecf-43ea-b80a-915b26ecbc5f	8	t	\N	\N	2026-01-23 15:49:39.898
cmkr23tsw00119yn191h6hhga	f2110753-4ecf-43ea-b80a-915b26ecbc5f	9	t	\N	\N	2026-01-23 15:49:41.409
cmkr23ur100139yn1lt8llyu6	f2110753-4ecf-43ea-b80a-915b26ecbc5f	10	t	\N	\N	2026-01-23 15:49:42.637
cmkr23vm900159yn1jk1mv85l	f2110753-4ecf-43ea-b80a-915b26ecbc5f	11	t	\N	\N	2026-01-23 15:49:43.761
cmkr256lk00029yq0mxw2c3a4	95fec569-1121-436f-8b50-ad0cbb28c255	2	t	\N	\N	2026-01-23 15:50:44.648
cmkr257ws00049yq03q27vi8p	95fec569-1121-436f-8b50-ad0cbb28c255	3	t	\N	\N	2026-01-23 15:50:46.348
cmkr258p300069yq02v6tr8yv	95fec569-1121-436f-8b50-ad0cbb28c255	4	t	\N	\N	2026-01-23 15:50:47.367
cmkr259j500089yq0w7rsk1vk	95fec569-1121-436f-8b50-ad0cbb28c255	5	t	\N	\N	2026-01-23 15:50:48.449
cmkr25aim000a9yq0rw04i3ba	95fec569-1121-436f-8b50-ad0cbb28c255	6	t	\N	\N	2026-01-23 15:50:49.726
cmkr25bds000c9yq0gleznjhb	95fec569-1121-436f-8b50-ad0cbb28c255	7	t	\N	\N	2026-01-23 15:50:50.849
cmkr25c94000e9yq0y22tq855	95fec569-1121-436f-8b50-ad0cbb28c255	8	t	\N	\N	2026-01-23 15:50:51.976
cmkr25cyp000g9yq0izuqyulo	95fec569-1121-436f-8b50-ad0cbb28c255	9	t	\N	\N	2026-01-23 15:50:52.898
cmkr25dr9000i9yq0sdvobuml	95fec569-1121-436f-8b50-ad0cbb28c255	10	t	\N	\N	2026-01-23 15:50:53.926
cmkr25es9000k9yq0uqu1lbl7	95fec569-1121-436f-8b50-ad0cbb28c255	11	t	\N	\N	2026-01-23 15:50:55.257
cmkr2661p000n9yq0upqbjmg5	c0b2aad3-55d3-4fb5-8532-2872b999c845	2	t	\N	\N	2026-01-23 15:51:30.59
cmkr266zw000p9yq07sentrq3	c0b2aad3-55d3-4fb5-8532-2872b999c845	3	t	\N	\N	2026-01-23 15:51:31.821
cmkr2683r000r9yq0xqluu9au	c0b2aad3-55d3-4fb5-8532-2872b999c845	4	t	\N	\N	2026-01-23 15:51:33.255
cmkr268z1000t9yq0ka7te6q5	c0b2aad3-55d3-4fb5-8532-2872b999c845	5	t	\N	\N	2026-01-23 15:51:34.381
cmkr269ua000v9yq07fk9f1t7	c0b2aad3-55d3-4fb5-8532-2872b999c845	6	t	\N	\N	2026-01-23 15:51:35.507
cmkr26avb000x9yq00lg14tri	c0b2aad3-55d3-4fb5-8532-2872b999c845	7	t	\N	\N	2026-01-23 15:51:36.839
cmkr26bns000z9yq0mdwk2pi7	c0b2aad3-55d3-4fb5-8532-2872b999c845	8	t	\N	\N	2026-01-23 15:51:37.865
cmkr26clw00119yq00ijpemx2	c0b2aad3-55d3-4fb5-8532-2872b999c845	9	t	\N	\N	2026-01-23 15:51:39.093
cmkr26dpq00139yq0zuqfrdqy	c0b2aad3-55d3-4fb5-8532-2872b999c845	10	t	\N	\N	2026-01-23 15:51:40.527
cmkr26eid00159yq0b11ymyek	c0b2aad3-55d3-4fb5-8532-2872b999c845	11	t	\N	\N	2026-01-23 15:51:41.557
cmkr2ge6000029ydmiyd6wopn	dff03c70-4a0b-46cc-b6c5-00e61c96f043	2	t	\N	\N	2026-01-23 15:59:27.672
cmkr2gg3t00049ydmgubp3ra0	dff03c70-4a0b-46cc-b6c5-00e61c96f043	3	t	\N	\N	2026-01-23 15:59:30.186
cmkr2gl2l00069ydm95l4swy9	dff03c70-4a0b-46cc-b6c5-00e61c96f043	4	t	\N	\N	2026-01-23 15:59:36.621
cmkr2gmhr00089ydm95qpjle5	dff03c70-4a0b-46cc-b6c5-00e61c96f043	5	t	\N	\N	2026-01-23 15:59:38.463
cmkr2go5g000a9ydmiqxbcc6d	dff03c70-4a0b-46cc-b6c5-00e61c96f043	6	t	\N	\N	2026-01-23 15:59:40.612
cmkr2gpxj000c9ydmehqpuqiq	dff03c70-4a0b-46cc-b6c5-00e61c96f043	7	t	\N	\N	2026-01-23 15:59:42.837
cmkr2grwh000e9ydmgbuvyt59	dff03c70-4a0b-46cc-b6c5-00e61c96f043	8	t	\N	\N	2026-01-23 15:59:45.473
cmkr2gti1000g9ydmlmlj14cf	dff03c70-4a0b-46cc-b6c5-00e61c96f043	9	t	\N	\N	2026-01-23 15:59:47.545
cmkr2gv2u000i9ydmcsm1fhpn	dff03c70-4a0b-46cc-b6c5-00e61c96f043	10	t	\N	\N	2026-01-23 15:59:49.59
cmkr2gwlv000k9ydmjjj6yrgp	dff03c70-4a0b-46cc-b6c5-00e61c96f043	11	t	\N	\N	2026-01-23 15:59:51.571
cmkwqfn4n00029yar45rrwa48	df541732-5003-43d1-bf0c-278c7d5dd2c6	2	t	\N	\N	2026-01-27 15:09:34.295
cmkwqfowl00049yar85msensl	df541732-5003-43d1-bf0c-278c7d5dd2c6	3	t	\N	\N	2026-01-27 15:09:36.598
cmkwqfqjc00069yarf5dhmgj7	df541732-5003-43d1-bf0c-278c7d5dd2c6	4	t	\N	\N	2026-01-27 15:09:38.712
cmkwqfrzm00089yare7xi8wgd	df541732-5003-43d1-bf0c-278c7d5dd2c6	5	t	\N	\N	2026-01-27 15:09:40.595
cmkwqfuiq000a9yarvsywj7e8	df541732-5003-43d1-bf0c-278c7d5dd2c6	6	t	\N	\N	2026-01-27 15:09:43.874
cmkwqfwd9000c9yardzhni3x5	df541732-5003-43d1-bf0c-278c7d5dd2c6	7	t	\N	\N	2026-01-27 15:09:46.27
cmkwqfypi000e9yar9wqobke1	df541732-5003-43d1-bf0c-278c7d5dd2c6	8	t	\N	\N	2026-01-27 15:09:49.302
cmkwqg0es000g9yargn1hlxu9	df541732-5003-43d1-bf0c-278c7d5dd2c6	9	t	\N	\N	2026-01-27 15:09:51.509
cmkwqg23k000i9yarx5pxbs1i	df541732-5003-43d1-bf0c-278c7d5dd2c6	10	t	\N	\N	2026-01-27 15:09:53.697
cmkwqg3nl000k9yarr5zprmua	df541732-5003-43d1-bf0c-278c7d5dd2c6	11	t	\N	\N	2026-01-27 15:09:55.713
cmkwvjgrs0002r10lp8ewk877	02586dda-4bdf-4df0-8d44-0116d3be3e16	2	t	\N	\N	2026-01-27 17:32:30.761
cmkwvjhkj0004r10l2tmjk0ws	02586dda-4bdf-4df0-8d44-0116d3be3e16	3	t	\N	\N	2026-01-27 17:32:31.796
cmkwvjiff0006r10liqja92ap	02586dda-4bdf-4df0-8d44-0116d3be3e16	4	t	\N	\N	2026-01-27 17:32:32.908
cmkwvjjaz0008r10l31b097v3	02586dda-4bdf-4df0-8d44-0116d3be3e16	5	t	\N	\N	2026-01-27 17:32:34.044
cmkwvjk20000ar10l60cvwoz1	02586dda-4bdf-4df0-8d44-0116d3be3e16	6	t	\N	\N	2026-01-27 17:32:35.016
cmkwvjky0000cr10ldnwutq4w	02586dda-4bdf-4df0-8d44-0116d3be3e16	7	t	\N	\N	2026-01-27 17:32:36.167
cmkwvjlru000er10l7q4ivgb3	02586dda-4bdf-4df0-8d44-0116d3be3e16	8	t	\N	\N	2026-01-27 17:32:37.242
cmkwvjmiw000gr10l7snuu5n7	02586dda-4bdf-4df0-8d44-0116d3be3e16	9	t	\N	\N	2026-01-27 17:32:38.217
cmkwvjnij000ir10l2azslmq3	02586dda-4bdf-4df0-8d44-0116d3be3e16	10	t	\N	\N	2026-01-27 17:32:39.499
cmkwvjogu000kr10luezyg8nj	02586dda-4bdf-4df0-8d44-0116d3be3e16	11	t	\N	\N	2026-01-27 17:32:40.735
cmkwvqor5000nr10lpz9dnckc	6aeafb8a-8904-40fd-a2c4-60c54c0402ce	2	t	\N	\N	2026-01-27 17:38:07.697
cmkwvqphg000pr10l6cuxoo8y	6aeafb8a-8904-40fd-a2c4-60c54c0402ce	3	t	\N	\N	2026-01-27 17:38:08.644
cmkwvqqlw000rr10lckgmz3ld	6aeafb8a-8904-40fd-a2c4-60c54c0402ce	4	t	\N	\N	2026-01-27 17:38:10.101
cmkwvqrcx000tr10l2r35bsb2	6aeafb8a-8904-40fd-a2c4-60c54c0402ce	5	t	\N	\N	2026-01-27 17:38:11.073
cmkwvqshi000vr10l1e0a92bt	6aeafb8a-8904-40fd-a2c4-60c54c0402ce	6	t	\N	\N	2026-01-27 17:38:12.534
cmkwvqt8c000xr10ldxj5gfyx	6aeafb8a-8904-40fd-a2c4-60c54c0402ce	7	t	\N	\N	2026-01-27 17:38:13.5
cmkwvqtw8000zr10lr1bc0xhd	6aeafb8a-8904-40fd-a2c4-60c54c0402ce	8	t	\N	\N	2026-01-27 17:38:14.36
cmkwvqul40011r10lrgai5egh	6aeafb8a-8904-40fd-a2c4-60c54c0402ce	9	t	\N	\N	2026-01-27 17:38:15.256
cmkwvqvqf0013r10lvb3kv5vx	6aeafb8a-8904-40fd-a2c4-60c54c0402ce	10	t	\N	\N	2026-01-27 17:38:16.743
cmkwvrb260018r10l1w9v0a0l	7c8e9647-aa8d-4de4-bb89-d530bdcca367	2	t	\N	\N	2026-01-27 17:38:36.606
cmkwvrcx9001cr10la6ynvc8s	7c8e9647-aa8d-4de4-bb89-d530bdcca367	4	t	\N	\N	2026-01-27 17:38:39.022
cmkwvrdo3001er10lscwkuose	7c8e9647-aa8d-4de4-bb89-d530bdcca367	5	t	\N	\N	2026-01-27 17:38:39.988
cmkwvrfb0001ir10l20te4yto	7c8e9647-aa8d-4de4-bb89-d530bdcca367	7	t	\N	\N	2026-01-27 17:38:42.109
cmkwvrh2c001mr10ltv05oamv	7c8e9647-aa8d-4de4-bb89-d530bdcca367	9	t	\N	\N	2026-01-27 17:38:44.388
cmkwvrhu4001or10lt9z5043h	7c8e9647-aa8d-4de4-bb89-d530bdcca367	10	t	\N	\N	2026-01-27 17:38:45.387
cmkwvrj7q001qr10lbg6sbxzx	7c8e9647-aa8d-4de4-bb89-d530bdcca367	11	t	\N	\N	2026-01-27 17:38:47.174
cmkwvsdgo001vr10leohnxoyl	4fd4e3c4-c793-4fea-8342-1f808fffc818	3	t	\N	\N	2026-01-27 17:39:26.376
cmkwvse7a001xr10l5s6uphk7	4fd4e3c4-c793-4fea-8342-1f808fffc818	4	t	\N	\N	2026-01-27 17:39:27.335
cmkwvsey6001zr10l0asyoeff	4fd4e3c4-c793-4fea-8342-1f808fffc818	5	t	\N	\N	2026-01-27 17:39:28.302
cmkwvsh8k0025r10louosadwl	4fd4e3c4-c793-4fea-8342-1f808fffc818	8	t	\N	\N	2026-01-27 17:39:31.269
cmkwvsjo0002br10lfc6or400	4fd4e3c4-c793-4fea-8342-1f808fffc818	11	t	\N	\N	2026-01-27 17:39:34.416
cmkwvqwlx0015r10ls4qf8fl0	6aeafb8a-8904-40fd-a2c4-60c54c0402ce	11	t	\N	\N	2026-01-27 17:38:17.878
cmkwvrbsh001ar10lh5idqwjr	7c8e9647-aa8d-4de4-bb89-d530bdcca367	3	t	\N	\N	2026-01-27 17:38:37.554
cmkwvrek3001gr10lx4eocgjw	7c8e9647-aa8d-4de4-bb89-d530bdcca367	6	t	\N	\N	2026-01-27 17:38:41.139
cmkwvrg4o001kr10l0n98fsdh	7c8e9647-aa8d-4de4-bb89-d530bdcca367	8	t	\N	\N	2026-01-27 17:38:43.177
cmkwvscmv001tr10lk99ne5hr	4fd4e3c4-c793-4fea-8342-1f808fffc818	2	t	\N	\N	2026-01-27 17:39:25.303
cmkwvsfpl0021r10lfws48jgz	4fd4e3c4-c793-4fea-8342-1f808fffc818	6	t	\N	\N	2026-01-27 17:39:29.29
cmkwvsghh0023r10lejivup5s	4fd4e3c4-c793-4fea-8342-1f808fffc818	7	t	\N	\N	2026-01-27 17:39:30.293
cmkwvsi3e0027r10lo88kz9l2	4fd4e3c4-c793-4fea-8342-1f808fffc818	9	t	\N	\N	2026-01-27 17:39:32.378
cmkwvsiwp0029r10l07thyfye	4fd4e3c4-c793-4fea-8342-1f808fffc818	10	t	\N	\N	2026-01-27 17:39:33.433
cmky72n3m00029yqmluex066s	37e6f995-ec37-4cf0-8eab-7f0286f0b5a3	2	t	\N	\N	2026-01-28 15:43:07.378
cmky72rgd00049yqmgbo8knyn	37e6f995-ec37-4cf0-8eab-7f0286f0b5a3	3	t	\N	\N	2026-01-28 15:43:13.022
cmky72ub000069yqmgb84bcd0	37e6f995-ec37-4cf0-8eab-7f0286f0b5a3	4	t	\N	\N	2026-01-28 15:43:16.716
cmky72wra00089yqmf2j3pd0k	37e6f995-ec37-4cf0-8eab-7f0286f0b5a3	5	t	\N	\N	2026-01-28 15:43:19.894
cmky72zd2000a9yqmiqxoh5ql	37e6f995-ec37-4cf0-8eab-7f0286f0b5a3	6	t	\N	\N	2026-01-28 15:43:23.27
cmky731cb000c9yqm0nhtnaub	37e6f995-ec37-4cf0-8eab-7f0286f0b5a3	7	t	\N	\N	2026-01-28 15:43:25.835
cmky7338l000e9yqmakzfh7wl	37e6f995-ec37-4cf0-8eab-7f0286f0b5a3	8	t	\N	\N	2026-01-28 15:43:28.293
cmky734z7000g9yqmih66h2z3	37e6f995-ec37-4cf0-8eab-7f0286f0b5a3	9	t	\N	\N	2026-01-28 15:43:30.547
cmky736qu000i9yqmxdzq912i	37e6f995-ec37-4cf0-8eab-7f0286f0b5a3	10	t	\N	\N	2026-01-28 15:43:32.839
cmky738m6000k9yqm9fz9uv0k	37e6f995-ec37-4cf0-8eab-7f0286f0b5a3	11	t	\N	\N	2026-01-28 15:43:35.262
cmky7algl00029yxoqhbz9gqo	defc38b8-78d6-41f8-bb14-fc3e1ffaf90a	2	t	\N	\N	2026-01-28 15:49:18.501
cmky7anzn00049yxogjyqlmwv	defc38b8-78d6-41f8-bb14-fc3e1ffaf90a	3	t	\N	\N	2026-01-28 15:49:21.78
cmky7aqwx00069yxoc8mphrkp	defc38b8-78d6-41f8-bb14-fc3e1ffaf90a	4	t	\N	\N	2026-01-28 15:49:25.57
cmky7audx00089yxo3t0wd989	defc38b8-78d6-41f8-bb14-fc3e1ffaf90a	5	t	\N	\N	2026-01-28 15:49:30.069
cmky7ax8z000a9yxoru0qp3qo	defc38b8-78d6-41f8-bb14-fc3e1ffaf90a	6	t	\N	\N	2026-01-28 15:49:33.779
cmky7b0dd000c9yxop5000ijg	defc38b8-78d6-41f8-bb14-fc3e1ffaf90a	7	t	\N	\N	2026-01-28 15:49:37.826
cmky7b2z5000e9yxobncguand	defc38b8-78d6-41f8-bb14-fc3e1ffaf90a	8	t	\N	\N	2026-01-28 15:49:41.202
cmky7b5x2000g9yxoe23lbp18	defc38b8-78d6-41f8-bb14-fc3e1ffaf90a	9	t	\N	\N	2026-01-28 15:49:45.015
cmky7b8no000i9yxoehbplyk3	defc38b8-78d6-41f8-bb14-fc3e1ffaf90a	10	t	\N	\N	2026-01-28 15:49:48.565
cmky7bbcb000k9yxoau0ed20w	defc38b8-78d6-41f8-bb14-fc3e1ffaf90a	11	t	\N	\N	2026-01-28 15:49:52.043
cmky7kz9100029yzkvgp9416t	a79a6f15-5354-465e-9531-55f0a4b3aa53	2	t	\N	\N	2026-01-28 15:57:22.934
cmky7l4sd00049yzk42l9wbe1	a79a6f15-5354-465e-9531-55f0a4b3aa53	3	t	\N	\N	2026-01-28 15:57:30.11
cmky7l77n00069yzkijnluta3	a79a6f15-5354-465e-9531-55f0a4b3aa53	4	t	\N	\N	2026-01-28 15:57:33.252
cmky7l9ro00089yzkrgdhj3dz	a79a6f15-5354-465e-9531-55f0a4b3aa53	5	t	\N	\N	2026-01-28 15:57:36.564
cmky7lcxn000a9yzk27cu4hyj	a79a6f15-5354-465e-9531-55f0a4b3aa53	6	t	\N	\N	2026-01-28 15:57:40.668
cmky7lg2g000c9yzk6uxtzfta	a79a6f15-5354-465e-9531-55f0a4b3aa53	7	t	\N	\N	2026-01-28 15:57:44.728
cmky7lj0p000e9yzktuxbniih	a79a6f15-5354-465e-9531-55f0a4b3aa53	8	t	\N	\N	2026-01-28 15:57:48.553
cmky7lmf0000g9yzk4uz6nsfg	a79a6f15-5354-465e-9531-55f0a4b3aa53	9	t	\N	\N	2026-01-28 15:57:52.651
cmky7lq20000i9yzktnizcx1m	a79a6f15-5354-465e-9531-55f0a4b3aa53	10	t	\N	\N	2026-01-28 15:57:57.673
cmky7lt27000k9yzkl0ri0mpt	a79a6f15-5354-465e-9531-55f0a4b3aa53	11	t	\N	\N	2026-01-28 15:58:01.567
cmky7owhc00179yzkqzish1us	1a24a5eb-7e3a-4523-80d2-80154eb402e3	2	t	\N	\N	2026-01-28 16:00:25.968
cmky7oy4m00199yzkglibhfw1	1a24a5eb-7e3a-4523-80d2-80154eb402e3	3	t	\N	\N	2026-01-28 16:00:28.102
cmky7ozk9001b9yzkajqz39iu	1a24a5eb-7e3a-4523-80d2-80154eb402e3	4	t	\N	\N	2026-01-28 16:00:29.962
cmky7p1al001d9yzkl180i1w3	1a24a5eb-7e3a-4523-80d2-80154eb402e3	5	t	\N	\N	2026-01-28 16:00:32.206
cmky7p3cu001f9yzkr7gj7c05	1a24a5eb-7e3a-4523-80d2-80154eb402e3	6	t	\N	\N	2026-01-28 16:00:34.878
cmky7p4yk001h9yzksrd5cy06	1a24a5eb-7e3a-4523-80d2-80154eb402e3	7	t	\N	\N	2026-01-28 16:00:36.956
cmky7p6li001j9yzkm6tafwcb	1a24a5eb-7e3a-4523-80d2-80154eb402e3	8	t	\N	\N	2026-01-28 16:00:39.078
cmky7p895001l9yzkmt8jbrc6	1a24a5eb-7e3a-4523-80d2-80154eb402e3	9	t	\N	\N	2026-01-28 16:00:41.226
cmky7p9u5001n9yzk989gflv1	1a24a5eb-7e3a-4523-80d2-80154eb402e3	10	t	\N	\N	2026-01-28 16:00:43.278
cmky7pbc4001p9yzkgkmvlzjm	1a24a5eb-7e3a-4523-80d2-80154eb402e3	11	t	\N	\N	2026-01-28 16:00:45.22
cmky7x72x00029ynl5p32zpg7	b36f0a04-6962-433c-b83a-3ac87b73b672	2	t	\N	\N	2026-01-28 16:06:52.953
cmky7x94r00049ynlb02cb3wq	b36f0a04-6962-433c-b83a-3ac87b73b672	3	t	\N	\N	2026-01-28 16:06:55.612
cmky7xapv00069ynlgzyrl02p	b36f0a04-6962-433c-b83a-3ac87b73b672	4	t	\N	\N	2026-01-28 16:06:57.667
cmky7xcg900089ynlse94ezdn	b36f0a04-6962-433c-b83a-3ac87b73b672	5	t	\N	\N	2026-01-28 16:06:59.913
cmky7xe6s000a9ynl0lm35k62	b36f0a04-6962-433c-b83a-3ac87b73b672	6	t	\N	\N	2026-01-28 16:07:02.164
cmky7xgdc000c9ynlid2wzuqm	b36f0a04-6962-433c-b83a-3ac87b73b672	7	t	\N	\N	2026-01-28 16:07:04.992
cmky7xixf000e9ynlk481ik1y	b36f0a04-6962-433c-b83a-3ac87b73b672	8	t	\N	\N	2026-01-28 16:07:08.307
cmky7xkzg000g9ynl6k0ohsg4	b36f0a04-6962-433c-b83a-3ac87b73b672	9	t	\N	\N	2026-01-28 16:07:10.972
cmky7xmkb000i9ynlr9bbstfn	b36f0a04-6962-433c-b83a-3ac87b73b672	10	t	\N	\N	2026-01-28 16:07:13.019
cmky7xogl000k9ynllyeecma0	b36f0a04-6962-433c-b83a-3ac87b73b672	11	t	\N	\N	2026-01-28 16:07:15.477
cmky8amma00029yn7otmgwgtu	296d86a3-bf62-4735-805c-c31f8f062f98	2	t	\N	\N	2026-01-28 16:17:19.618
cmky8apmq00049yn7usy8c11y	296d86a3-bf62-4735-805c-c31f8f062f98	3	t	\N	\N	2026-01-28 16:17:23.522
cmky8asb100069yn742p9nwom	296d86a3-bf62-4735-805c-c31f8f062f98	4	t	\N	\N	2026-01-28 16:17:26.989
cmky8b0aa00089yn7qoqn1kid	296d86a3-bf62-4735-805c-c31f8f062f98	5	t	\N	\N	2026-01-28 16:17:37.33
cmky8b3lt000a9yn7k6zzvq4k	296d86a3-bf62-4735-805c-c31f8f062f98	6	t	\N	\N	2026-01-28 16:17:41.633
cmky8b6g7000c9yn7d70o9f0k	296d86a3-bf62-4735-805c-c31f8f062f98	7	t	\N	\N	2026-01-28 16:17:45.319
cmky8b8g7000e9yn76lna2mvr	296d86a3-bf62-4735-805c-c31f8f062f98	8	t	\N	\N	2026-01-28 16:17:47.911
cmky8bb6p000g9yn7q7soed8r	296d86a3-bf62-4735-805c-c31f8f062f98	9	t	\N	\N	2026-01-28 16:17:51.258
cmky8bdpx000i9yn7zifz4rw7	296d86a3-bf62-4735-805c-c31f8f062f98	10	t	\N	\N	2026-01-28 16:17:54.741
cmky8bfuo000k9yn70rkbimqv	296d86a3-bf62-4735-805c-c31f8f062f98	11	t	\N	\N	2026-01-28 16:17:57.504
cmkzgsok00016me0kuixnz2u2	46b79f30-146c-473e-bae9-7868a6d6d5dc	2	t	\N	\N	2026-01-29 13:03:05.041
cmkzgspks0018me0ktt19h1qz	46b79f30-146c-473e-bae9-7868a6d6d5dc	3	t	\N	\N	2026-01-29 13:03:06.365
cmkzgsqht001ame0kevh6jk9r	46b79f30-146c-473e-bae9-7868a6d6d5dc	4	t	\N	\N	2026-01-29 13:03:07.554
cmkzgsras001cme0kdck35xg8	46b79f30-146c-473e-bae9-7868a6d6d5dc	5	t	\N	\N	2026-01-29 13:03:08.597
cmkzgssku001eme0k5bv92dkq	46b79f30-146c-473e-bae9-7868a6d6d5dc	6	t	\N	\N	2026-01-29 13:03:10.254
cmkzgstht001gme0k13r9lecl	46b79f30-146c-473e-bae9-7868a6d6d5dc	7	t	\N	\N	2026-01-29 13:03:11.442
cmkzgsun5001ime0krwmbs14o	46b79f30-146c-473e-bae9-7868a6d6d5dc	8	t	\N	\N	2026-01-29 13:03:12.929
cmkzgsvg0001kme0kkzo9wbvo	46b79f30-146c-473e-bae9-7868a6d6d5dc	9	t	\N	\N	2026-01-29 13:03:13.968
cmkzgswi6001mme0kd2mbk62l	46b79f30-146c-473e-bae9-7868a6d6d5dc	10	t	\N	\N	2026-01-29 13:03:15.342
cmkzgsz7k001sme0kmw516u77	46b79f30-146c-473e-bae9-7868a6d6d5dc	13	t	\N	\N	2026-01-29 13:03:18.848
cmkzgt0z0001wme0kvynl7w0u	46b79f30-146c-473e-bae9-7868a6d6d5dc	15	t	\N	\N	2026-01-29 13:03:21.132
cmkzgt23d001yme0k41bfcy6j	46b79f30-146c-473e-bae9-7868a6d6d5dc	16	t	\N	\N	2026-01-29 13:03:22.586
cmkzgt2yv0020me0kzmg9dxkv	46b79f30-146c-473e-bae9-7868a6d6d5dc	17	t	\N	\N	2026-01-29 13:03:23.719
cmkzgt3qh0022me0k0vr7s1v3	46b79f30-146c-473e-bae9-7868a6d6d5dc	18	t	\N	\N	2026-01-29 13:03:24.713
cmkzgt4j00024me0kwhrtdqcp	46b79f30-146c-473e-bae9-7868a6d6d5dc	19	t	\N	\N	2026-01-29 13:03:25.741
cmkzgtakz002gme0k0u8dhltf	46b79f30-146c-473e-bae9-7868a6d6d5dc	25	t	\N	\N	2026-01-29 13:03:33.587
cmkzgtceq002kme0kkweikzss	46b79f30-146c-473e-bae9-7868a6d6d5dc	27	t	\N	\N	2026-01-29 13:03:35.954
cmkzgtdbc002mme0kt2d7897s	46b79f30-146c-473e-bae9-7868a6d6d5dc	28	t	\N	\N	2026-01-29 13:03:37.129
cmkzgtf9t002qme0k1vzqkleg	46b79f30-146c-473e-bae9-7868a6d6d5dc	30	t	\N	\N	2026-01-29 13:03:39.666
cmkzgtofv003ame0kexihgptd	46b79f30-146c-473e-bae9-7868a6d6d5dc	40	t	\N	\N	2026-01-29 13:03:51.547
cmkzgtqvh003gme0kyuzak8je	46b79f30-146c-473e-bae9-7868a6d6d5dc	43	t	\N	\N	2026-01-29 13:03:54.702
cmkzgtrua003ime0k1u0scpue	46b79f30-146c-473e-bae9-7868a6d6d5dc	44	t	\N	\N	2026-01-29 13:03:55.954
cmkzgtue6003ome0k7icgkp10	46b79f30-146c-473e-bae9-7868a6d6d5dc	47	t	\N	\N	2026-01-29 13:03:59.263
cmkzgsx9x001ome0k4qb75niy	46b79f30-146c-473e-bae9-7868a6d6d5dc	11	t	\N	\N	2026-01-29 13:03:16.341
cmkzgsyb6001qme0kcn949fba	46b79f30-146c-473e-bae9-7868a6d6d5dc	12	t	\N	\N	2026-01-29 13:03:17.683
cmkzgt04n001ume0k4jekp4vz	46b79f30-146c-473e-bae9-7868a6d6d5dc	14	t	\N	\N	2026-01-29 13:03:20.039
cmkzgt5og0026me0k0elyu4oc	46b79f30-146c-473e-bae9-7868a6d6d5dc	20	t	\N	\N	2026-01-29 13:03:27.232
cmkzgt6j00028me0kyozj2bgf	46b79f30-146c-473e-bae9-7868a6d6d5dc	21	t	\N	\N	2026-01-29 13:03:28.333
cmkzgt7jt002ame0k8epnkwea	46b79f30-146c-473e-bae9-7868a6d6d5dc	22	t	\N	\N	2026-01-29 13:03:29.657
cmkzgt8x5002cme0k8lrcdfde	46b79f30-146c-473e-bae9-7868a6d6d5dc	23	t	\N	\N	2026-01-29 13:03:31.433
cmkzgt9st002eme0k0iz60krr	46b79f30-146c-473e-bae9-7868a6d6d5dc	24	t	\N	\N	2026-01-29 13:03:32.574
cmkzgtbmm002ime0k0gq0diuq	46b79f30-146c-473e-bae9-7868a6d6d5dc	26	t	\N	\N	2026-01-29 13:03:34.942
cmkzgteas002ome0kbdyo49tf	46b79f30-146c-473e-bae9-7868a6d6d5dc	29	t	\N	\N	2026-01-29 13:03:38.404
cmkzgtgb9002sme0kc5ydvfv2	46b79f30-146c-473e-bae9-7868a6d6d5dc	31	t	\N	\N	2026-01-29 13:03:41.014
cmkzgth85002ume0kuf3dz13v	46b79f30-146c-473e-bae9-7868a6d6d5dc	32	t	\N	\N	2026-01-29 13:03:42.197
cmkzgthyb002wme0k9uigkwtr	46b79f30-146c-473e-bae9-7868a6d6d5dc	33	t	\N	\N	2026-01-29 13:03:43.139
cmkzgtj0q002yme0kpuvbabos	46b79f30-146c-473e-bae9-7868a6d6d5dc	34	t	\N	\N	2026-01-29 13:03:44.523
cmkzgtk5r0030me0ke43lgxpi	46b79f30-146c-473e-bae9-7868a6d6d5dc	35	t	\N	\N	2026-01-29 13:03:45.999
cmkzgtl060032me0kmfiy56zc	46b79f30-146c-473e-bae9-7868a6d6d5dc	36	t	\N	\N	2026-01-29 13:03:47.094
cmkzgtlyj0034me0k05ggxhwe	46b79f30-146c-473e-bae9-7868a6d6d5dc	37	t	\N	\N	2026-01-29 13:03:48.332
cmkzgtmqe0036me0ko2r91kzf	46b79f30-146c-473e-bae9-7868a6d6d5dc	38	t	\N	\N	2026-01-29 13:03:49.334
cmkzgtnm80038me0kxyh3m61i	46b79f30-146c-473e-bae9-7868a6d6d5dc	39	t	\N	\N	2026-01-29 13:03:50.48
cmkzgtp59003cme0khet4ccsv	46b79f30-146c-473e-bae9-7868a6d6d5dc	41	t	\N	\N	2026-01-29 13:03:52.461
cmkzgtpzm003eme0k4hto1fq2	46b79f30-146c-473e-bae9-7868a6d6d5dc	42	t	\N	\N	2026-01-29 13:03:53.555
cmkzgtsog003kme0kd3kud058	46b79f30-146c-473e-bae9-7868a6d6d5dc	45	t	\N	\N	2026-01-29 13:03:57.04
cmkzgttho003mme0ksgoh3mj5	46b79f30-146c-473e-bae9-7868a6d6d5dc	46	t	\N	\N	2026-01-29 13:03:58.092
cmkzgtvb7003qme0k67bomg0u	46b79f30-146c-473e-bae9-7868a6d6d5dc	48	t	\N	\N	2026-01-29 13:04:00.452
cmkzgtwap003sme0kqlc2ch3n	46b79f30-146c-473e-bae9-7868a6d6d5dc	49	t	\N	\N	2026-01-29 13:04:01.729
cmkzgtx5t003ume0k8dimosnd	46b79f30-146c-473e-bae9-7868a6d6d5dc	50	t	\N	\N	2026-01-29 13:04:02.85
cmkzgtxya003wme0k3sv8l1j5	46b79f30-146c-473e-bae9-7868a6d6d5dc	51	t	\N	\N	2026-01-29 13:04:03.874
cmkzgtyqp003yme0ktg1e3uvo	46b79f30-146c-473e-bae9-7868a6d6d5dc	52	t	\N	\N	2026-01-29 13:04:04.898
cmkzgtzh70040me0km34t5qk9	46b79f30-146c-473e-bae9-7868a6d6d5dc	53	t	\N	\N	2026-01-29 13:04:05.851
cmkzgu0cy0042me0kbe5v04ch	46b79f30-146c-473e-bae9-7868a6d6d5dc	54	t	\N	\N	2026-01-29 13:04:06.995
cmkzgu1420044me0kajvxi2wg	46b79f30-146c-473e-bae9-7868a6d6d5dc	55	t	\N	\N	2026-01-29 13:04:07.97
cmkzgu1pz0046me0kajfrn4c4	46b79f30-146c-473e-bae9-7868a6d6d5dc	56	t	\N	\N	2026-01-29 13:04:08.759
cmkzgu2mq0048me0kca5iu0g3	46b79f30-146c-473e-bae9-7868a6d6d5dc	57	t	\N	\N	2026-01-29 13:04:09.939
cmkzgu3rb004ame0kcf8lhtfw	46b79f30-146c-473e-bae9-7868a6d6d5dc	58	t	\N	\N	2026-01-29 13:04:11.4
cmkzgu4ic004cme0knxcztdgv	46b79f30-146c-473e-bae9-7868a6d6d5dc	59	t	\N	\N	2026-01-29 13:04:12.373
cmkzgu59h004eme0knflqzlbt	46b79f30-146c-473e-bae9-7868a6d6d5dc	60	t	\N	\N	2026-01-29 13:04:13.35
cmkzgu65b004gme0k0zqb74l6	46b79f30-146c-473e-bae9-7868a6d6d5dc	61	t	\N	\N	2026-01-29 13:04:14.495
cmkzgu7f6004ime0k6c5bn74i	46b79f30-146c-473e-bae9-7868a6d6d5dc	62	t	\N	\N	2026-01-29 13:04:16.146
cmkzgu890004kme0klhaz70ih	46b79f30-146c-473e-bae9-7868a6d6d5dc	63	t	\N	\N	2026-01-29 13:04:17.22
cmkzgu90w004mme0k14jmeok6	46b79f30-146c-473e-bae9-7868a6d6d5dc	64	t	\N	\N	2026-01-29 13:04:18.224
cmkzgu9ze004ome0k9hxrac22	46b79f30-146c-473e-bae9-7868a6d6d5dc	65	t	\N	\N	2026-01-29 13:04:19.466
cmkzguav1004qme0ko2vca730	46b79f30-146c-473e-bae9-7868a6d6d5dc	66	t	\N	\N	2026-01-29 13:04:20.605
cmkzgubp5004sme0ktt7vf8bq	46b79f30-146c-473e-bae9-7868a6d6d5dc	67	t	\N	\N	2026-01-29 13:04:21.69
cmkzgucgz004ume0k79d0ms2b	46b79f30-146c-473e-bae9-7868a6d6d5dc	68	t	\N	\N	2026-01-29 13:04:22.691
cmkzgudcg004wme0kjxf84ywh	46b79f30-146c-473e-bae9-7868a6d6d5dc	69	t	\N	\N	2026-01-29 13:04:23.824
cmkzgue94004yme0ktn72pc5q	46b79f30-146c-473e-bae9-7868a6d6d5dc	70	t	\N	\N	2026-01-29 13:04:25
cmkzguf7e0050me0k10akfnee	46b79f30-146c-473e-bae9-7868a6d6d5dc	71	t	\N	\N	2026-01-29 13:04:26.234
cmkzgug7o0052me0kohz2hbev	46b79f30-146c-473e-bae9-7868a6d6d5dc	72	t	\N	\N	2026-01-29 13:04:27.541
cmkzguh5n0054me0kvomqo7g3	46b79f30-146c-473e-bae9-7868a6d6d5dc	73	t	\N	\N	2026-01-29 13:04:28.763
cmkzguia50056me0k9oujcfk6	46b79f30-146c-473e-bae9-7868a6d6d5dc	74	t	\N	\N	2026-01-29 13:04:30.221
cmkzgujeb0058me0kzce176gn	46b79f30-146c-473e-bae9-7868a6d6d5dc	75	t	\N	\N	2026-01-29 13:04:31.668
cmkzguk9x005ame0khkjqm5kg	46b79f30-146c-473e-bae9-7868a6d6d5dc	76	t	\N	\N	2026-01-29 13:04:32.805
cmkzgul62005cme0k3ds9sbi6	46b79f30-146c-473e-bae9-7868a6d6d5dc	77	t	\N	\N	2026-01-29 13:04:33.963
cmkzgulz3005eme0krzaaucp5	46b79f30-146c-473e-bae9-7868a6d6d5dc	78	t	\N	\N	2026-01-29 13:04:35.007
cmkzgun7e005gme0kidlqfohq	46b79f30-146c-473e-bae9-7868a6d6d5dc	79	t	\N	\N	2026-01-29 13:04:36.603
cmkzguo5q005ime0kkdpos0u2	46b79f30-146c-473e-bae9-7868a6d6d5dc	80	t	\N	\N	2026-01-29 13:04:37.838
cmkzguoxa005kme0ktsmlz8k8	46b79f30-146c-473e-bae9-7868a6d6d5dc	81	t	\N	\N	2026-01-29 13:04:38.83
cmkzgupsm005mme0k0xpz48yu	46b79f30-146c-473e-bae9-7868a6d6d5dc	82	t	\N	\N	2026-01-29 13:04:39.958
cmkzguqs1005ome0kn4rz9o3y	46b79f30-146c-473e-bae9-7868a6d6d5dc	83	t	\N	\N	2026-01-29 13:04:41.233
cmkzgurpk005qme0k9a1h06wk	46b79f30-146c-473e-bae9-7868a6d6d5dc	84	t	\N	\N	2026-01-29 13:04:42.44
cmkzgusmc005sme0kfng55fj6	46b79f30-146c-473e-bae9-7868a6d6d5dc	85	t	\N	\N	2026-01-29 13:04:43.62
cmkzgutp1005ume0kljo2fsgc	46b79f30-146c-473e-bae9-7868a6d6d5dc	86	t	\N	\N	2026-01-29 13:04:45.014
cmkzguugp005wme0kacwt4jmh	46b79f30-146c-473e-bae9-7868a6d6d5dc	87	t	\N	\N	2026-01-29 13:04:46.01
cmkzguvce005yme0kdutqrr2d	46b79f30-146c-473e-bae9-7868a6d6d5dc	88	t	\N	\N	2026-01-29 13:04:47.151
cmkzguw4e0060me0kkfj8j7g4	46b79f30-146c-473e-bae9-7868a6d6d5dc	89	t	\N	\N	2026-01-29 13:04:48.159
cmkzguwxu0062me0kez40svtd	46b79f30-146c-473e-bae9-7868a6d6d5dc	90	t	\N	\N	2026-01-29 13:04:49.218
cmkzguxxp0064me0k70pp753g	46b79f30-146c-473e-bae9-7868a6d6d5dc	91	t	\N	\N	2026-01-29 13:04:50.509
cmkzguyq10066me0karo4haz2	46b79f30-146c-473e-bae9-7868a6d6d5dc	92	t	\N	\N	2026-01-29 13:04:51.53
cmkzguzo00068me0kgmmcyjj9	46b79f30-146c-473e-bae9-7868a6d6d5dc	93	t	\N	\N	2026-01-29 13:04:52.752
cmkzgv0xf006ame0klve442cr	46b79f30-146c-473e-bae9-7868a6d6d5dc	94	t	\N	\N	2026-01-29 13:04:54.388
cmkzgv235006cme0k5a7dnwgq	46b79f30-146c-473e-bae9-7868a6d6d5dc	95	t	\N	\N	2026-01-29 13:04:55.89
cmkzgv33v006eme0kha7fsc3y	46b79f30-146c-473e-bae9-7868a6d6d5dc	96	t	\N	\N	2026-01-29 13:04:57.212
cmkzmxlzg00029y3p6x0kjqpp	b7a33cbf-fbf9-437c-97f3-a6d018f7975a	2	t	\N	\N	2026-01-29 15:54:52.579
cmkzmxo9q00049y3pra51m9lr	b7a33cbf-fbf9-437c-97f3-a6d018f7975a	3	t	\N	\N	2026-01-29 15:54:55.646
cmkzmxqsq00069y3p53wdag3q	b7a33cbf-fbf9-437c-97f3-a6d018f7975a	4	t	\N	\N	2026-01-29 15:54:58.923
cmkzmxsox00089y3pjjaueg5l	b7a33cbf-fbf9-437c-97f3-a6d018f7975a	5	t	\N	\N	2026-01-29 15:55:01.377
cmkzmxuj7000a9y3pcrune93x	b7a33cbf-fbf9-437c-97f3-a6d018f7975a	6	t	\N	\N	2026-01-29 15:55:03.763
cmkzmxwhi000c9y3plwt9d78b	b7a33cbf-fbf9-437c-97f3-a6d018f7975a	7	t	\N	\N	2026-01-29 15:55:06.294
cmkzmxyjf000e9y3prfv4y4fi	b7a33cbf-fbf9-437c-97f3-a6d018f7975a	8	t	\N	\N	2026-01-29 15:55:08.856
cmkzmy0im000g9y3poo0o8d5s	b7a33cbf-fbf9-437c-97f3-a6d018f7975a	9	t	\N	\N	2026-01-29 15:55:11.519
cmkzmy2hr000i9y3pxs5vdxud	b7a33cbf-fbf9-437c-97f3-a6d018f7975a	10	t	\N	\N	2026-01-29 15:55:14.079
cmkzmy4gu000k9y3pzs0q7lc1	b7a33cbf-fbf9-437c-97f3-a6d018f7975a	11	t	\N	\N	2026-01-29 15:55:16.638
cml0i5g18000cpo0k2ogljot7	4ce75216-e791-4b4c-b641-851f37f25a2a	2	t	\N	\N	2026-01-30 06:28:46.316
cml0i5gxb000epo0kfmrf96yx	4ce75216-e791-4b4c-b641-851f37f25a2a	3	t	\N	\N	2026-01-30 06:28:47.472
cml0i5hze000gpo0kmql4gb2f	4ce75216-e791-4b4c-b641-851f37f25a2a	4	t	\N	\N	2026-01-30 06:28:48.843
cml0i5j3h000ipo0ku3jke71p	4ce75216-e791-4b4c-b641-851f37f25a2a	5	t	\N	\N	2026-01-30 06:28:50.286
cml0i5k0p000kpo0kk1a6uhbs	4ce75216-e791-4b4c-b641-851f37f25a2a	6	t	\N	\N	2026-01-30 06:28:51.482
cml0i5l5v000mpo0kkgyiqbeq	4ce75216-e791-4b4c-b641-851f37f25a2a	7	t	\N	\N	2026-01-30 06:28:52.963
cml0i5m5h000opo0kakqf1h7k	4ce75216-e791-4b4c-b641-851f37f25a2a	8	t	\N	\N	2026-01-30 06:28:54.245
cml0i5nea000qpo0kxkcn62jm	4ce75216-e791-4b4c-b641-851f37f25a2a	9	t	\N	\N	2026-01-30 06:28:55.858
cml0i5ohn000spo0kk1olcj2h	4ce75216-e791-4b4c-b641-851f37f25a2a	10	t	\N	\N	2026-01-30 06:28:57.276
cml0i5pf6000upo0ki1rume19	4ce75216-e791-4b4c-b641-851f37f25a2a	11	t	\N	\N	2026-01-30 06:28:58.483
cml0i5qi4000wpo0k9u2jw4pf	4ce75216-e791-4b4c-b641-851f37f25a2a	12	t	\N	\N	2026-01-30 06:28:59.884
cml0i5rhn000ypo0k2lqr9g9i	4ce75216-e791-4b4c-b641-851f37f25a2a	13	t	\N	\N	2026-01-30 06:29:01.164
cml0i5sfm0010po0keubwx8hg	4ce75216-e791-4b4c-b641-851f37f25a2a	14	t	\N	\N	2026-01-30 06:29:02.386
cml0i5tda0012po0kgud6cpzh	4ce75216-e791-4b4c-b641-851f37f25a2a	15	t	\N	\N	2026-01-30 06:29:03.599
cml0i5ugr0014po0k2ykh5q9c	4ce75216-e791-4b4c-b641-851f37f25a2a	16	t	\N	\N	2026-01-30 06:29:05.019
cml0i5vg10016po0kp2brmxok	4ce75216-e791-4b4c-b641-851f37f25a2a	17	t	\N	\N	2026-01-30 06:29:06.29
cml0i5wol0018po0k7cbi1lxr	4ce75216-e791-4b4c-b641-851f37f25a2a	18	t	\N	\N	2026-01-30 06:29:07.894
cml0i5xqw001apo0kpt59vjg8	4ce75216-e791-4b4c-b641-851f37f25a2a	19	t	\N	\N	2026-01-30 06:29:09.272
cml0i5ypf001cpo0k5kslbgfv	4ce75216-e791-4b4c-b641-851f37f25a2a	20	t	\N	\N	2026-01-30 06:29:10.516
cml0i5zvj001epo0k5no7x2ex	4ce75216-e791-4b4c-b641-851f37f25a2a	21	t	\N	\N	2026-01-30 06:29:12.031
cml0i60w0001gpo0k5tdb51s5	4ce75216-e791-4b4c-b641-851f37f25a2a	22	t	\N	\N	2026-01-30 06:29:13.344
cml0i61xy001ipo0kd0rqbr55	4ce75216-e791-4b4c-b641-851f37f25a2a	23	t	\N	\N	2026-01-30 06:29:14.711
cml0i62xk001kpo0kadtde59h	4ce75216-e791-4b4c-b641-851f37f25a2a	24	t	\N	\N	2026-01-30 06:29:15.993
cml0i63so001mpo0k7q3nl148	4ce75216-e791-4b4c-b641-851f37f25a2a	25	t	\N	\N	2026-01-30 06:29:17.113
cml0i64on001opo0ktqos8nez	4ce75216-e791-4b4c-b641-851f37f25a2a	26	t	\N	\N	2026-01-30 06:29:18.263
cml0i65z0001qpo0kcvmoxt02	4ce75216-e791-4b4c-b641-851f37f25a2a	27	t	\N	\N	2026-01-30 06:29:19.932
cml0i671c001spo0ko4eihahq	4ce75216-e791-4b4c-b641-851f37f25a2a	28	t	\N	\N	2026-01-30 06:29:21.313
cml0i67y8001upo0kw9cwit9e	4ce75216-e791-4b4c-b641-851f37f25a2a	29	t	\N	\N	2026-01-30 06:29:22.497
cml0i690v001wpo0k07pevt8l	4ce75216-e791-4b4c-b641-851f37f25a2a	30	t	\N	\N	2026-01-30 06:29:23.887
cml0i6a82001ypo0kn4tb06c2	4ce75216-e791-4b4c-b641-851f37f25a2a	31	t	\N	\N	2026-01-30 06:29:25.442
cml0i6bax0020po0kvhtstk2c	4ce75216-e791-4b4c-b641-851f37f25a2a	32	t	\N	\N	2026-01-30 06:29:26.841
cml0i6ccm0022po0k7ncptf4b	4ce75216-e791-4b4c-b641-851f37f25a2a	33	t	\N	\N	2026-01-30 06:29:28.198
cml0i6ddj0024po0k3vl26nm9	4ce75216-e791-4b4c-b641-851f37f25a2a	34	t	\N	\N	2026-01-30 06:29:29.527
cml0i6ea60026po0kjrh65wdb	4ce75216-e791-4b4c-b641-851f37f25a2a	35	t	\N	\N	2026-01-30 06:29:30.702
cml0i6f4i0028po0kstc6wrfv	4ce75216-e791-4b4c-b641-851f37f25a2a	36	t	\N	\N	2026-01-30 06:29:31.795
cml0i6g0w002apo0kwk9jctwa	4ce75216-e791-4b4c-b641-851f37f25a2a	37	t	\N	\N	2026-01-30 06:29:32.961
cml0i6h9w002cpo0kcsf7zo8m	4ce75216-e791-4b4c-b641-851f37f25a2a	38	t	\N	\N	2026-01-30 06:29:34.581
cml0i6i50002epo0kpb1hdvnw	4ce75216-e791-4b4c-b641-851f37f25a2a	39	t	\N	\N	2026-01-30 06:29:35.701
cml0i6jby002gpo0kfa1z35os	4ce75216-e791-4b4c-b641-851f37f25a2a	40	t	\N	\N	2026-01-30 06:29:37.246
cml0i6k8t002ipo0k8rlo9jjr	4ce75216-e791-4b4c-b641-851f37f25a2a	41	t	\N	\N	2026-01-30 06:29:38.429
cml0i6lcx002kpo0ksab28h59	4ce75216-e791-4b4c-b641-851f37f25a2a	42	t	\N	\N	2026-01-30 06:29:39.873
cml0i6mee002mpo0k0muv5bpx	4ce75216-e791-4b4c-b641-851f37f25a2a	43	t	\N	\N	2026-01-30 06:29:41.222
cml0i6nbd002opo0k739crrgv	4ce75216-e791-4b4c-b641-851f37f25a2a	44	t	\N	\N	2026-01-30 06:29:42.409
cml0i6o5x002qpo0kah91hf9c	4ce75216-e791-4b4c-b641-851f37f25a2a	45	t	\N	\N	2026-01-30 06:29:43.509
cml0i6p2v002spo0kr17pfyr1	4ce75216-e791-4b4c-b641-851f37f25a2a	46	t	\N	\N	2026-01-30 06:29:44.695
cml0i6q8j002upo0kleiwlft6	4ce75216-e791-4b4c-b641-851f37f25a2a	47	t	\N	\N	2026-01-30 06:29:46.193
cml0i6rb0002wpo0kndrb7am5	4ce75216-e791-4b4c-b641-851f37f25a2a	48	t	\N	\N	2026-01-30 06:29:47.58
cml0i6sfw002ypo0kvp8jee0g	4ce75216-e791-4b4c-b641-851f37f25a2a	49	t	\N	\N	2026-01-30 06:29:49.053
cml0i6tel0030po0kl51cwwf9	4ce75216-e791-4b4c-b641-851f37f25a2a	50	t	\N	\N	2026-01-30 06:29:50.301
cml0i6ucf0032po0kcpnlgk4m	4ce75216-e791-4b4c-b641-851f37f25a2a	51	t	\N	\N	2026-01-30 06:29:51.519
cml0i6vqb0034po0knnd1pl46	4ce75216-e791-4b4c-b641-851f37f25a2a	52	t	\N	\N	2026-01-30 06:29:53.316
cml0i6wn60036po0k8ibqizub	4ce75216-e791-4b4c-b641-851f37f25a2a	53	t	\N	\N	2026-01-30 06:29:54.498
cml0i6xlx0038po0k4a7gfioh	4ce75216-e791-4b4c-b641-851f37f25a2a	54	t	\N	\N	2026-01-30 06:29:55.749
cml0i6yoz003apo0k3qo0v9ex	4ce75216-e791-4b4c-b641-851f37f25a2a	55	t	\N	\N	2026-01-30 06:29:57.155
cml0i6zqy003cpo0kka8qbrfr	4ce75216-e791-4b4c-b641-851f37f25a2a	56	t	\N	\N	2026-01-30 06:29:58.522
cml0i70s2003epo0kt8fhn4ig	4ce75216-e791-4b4c-b641-851f37f25a2a	57	t	\N	\N	2026-01-30 06:29:59.858
cml0i725o003gpo0kgjhqm45m	4ce75216-e791-4b4c-b641-851f37f25a2a	58	t	\N	\N	2026-01-30 06:30:01.644
cml0i7388003ipo0kqqz1mogi	4ce75216-e791-4b4c-b641-851f37f25a2a	59	t	\N	\N	2026-01-30 06:30:03.032
cml0i745s003kpo0kl4xbatvu	4ce75216-e791-4b4c-b641-851f37f25a2a	60	t	\N	\N	2026-01-30 06:30:04.241
cml0i74z9003mpo0k3tmv7l6q	4ce75216-e791-4b4c-b641-851f37f25a2a	61	t	\N	\N	2026-01-30 06:30:05.301
cml0i75yh003opo0kobejlk5t	4ce75216-e791-4b4c-b641-851f37f25a2a	62	t	\N	\N	2026-01-30 06:30:06.569
cml0i7714003qpo0k4scmsvis	4ce75216-e791-4b4c-b641-851f37f25a2a	63	t	\N	\N	2026-01-30 06:30:07.961
cml0i780p003spo0k33qdvui9	4ce75216-e791-4b4c-b641-851f37f25a2a	64	t	\N	\N	2026-01-30 06:30:09.241
cml0i78xz003upo0kz2wlfuhb	4ce75216-e791-4b4c-b641-851f37f25a2a	65	t	\N	\N	2026-01-30 06:30:10.44
cml0i79vz003wpo0kbm4advyq	4ce75216-e791-4b4c-b641-851f37f25a2a	66	t	\N	\N	2026-01-30 06:30:11.664
cml0i7cnr003ypo0kxx279onb	4ce75216-e791-4b4c-b641-851f37f25a2a	67	t	\N	\N	2026-01-30 06:30:15.255
cml0i7dnm0040po0kph2lijj0	4ce75216-e791-4b4c-b641-851f37f25a2a	68	t	\N	\N	2026-01-30 06:30:16.546
cml0i7eun0042po0k29ax1k5z	4ce75216-e791-4b4c-b641-851f37f25a2a	69	t	\N	\N	2026-01-30 06:30:18.095
cml0i7gxy0044po0kyljdixvl	4ce75216-e791-4b4c-b641-851f37f25a2a	70	t	\N	\N	2026-01-30 06:30:20.807
cml0i7kqq0048po0k1dtybr53	4ce75216-e791-4b4c-b641-851f37f25a2a	72	t	\N	\N	2026-01-30 06:30:25.73
cml0i8et5004lpo0kpsh5rqe6	6ac95864-e772-4811-bf64-90329ea9aadc	6	t	\N	\N	2026-01-30 06:31:04.697
cml0i8i92004tpo0ka5s0pf68	6ac95864-e772-4811-bf64-90329ea9aadc	10	t	\N	\N	2026-01-30 06:31:09.158
cml0i7iog0046po0kilyekp5w	4ce75216-e791-4b4c-b641-851f37f25a2a	71	t	\N	\N	2026-01-30 06:30:23.056
cml0i7m36004apo0k1nv6t65v	4ce75216-e791-4b4c-b641-851f37f25a2a	73	t	\N	\N	2026-01-30 06:30:27.474
cml0i8ath004dpo0k32ebtxms	6ac95864-e772-4811-bf64-90329ea9aadc	2	t	\N	\N	2026-01-30 06:30:59.524
cml0i8buq004fpo0k5sy413t8	6ac95864-e772-4811-bf64-90329ea9aadc	3	t	\N	\N	2026-01-30 06:31:00.866
cml0i8d50004hpo0kymu6g0f5	6ac95864-e772-4811-bf64-90329ea9aadc	4	t	\N	\N	2026-01-30 06:31:02.533
cml0i8dxm004jpo0klrw6p6sh	6ac95864-e772-4811-bf64-90329ea9aadc	5	t	\N	\N	2026-01-30 06:31:03.563
cml0i8frd004npo0ke9v9t1ox	6ac95864-e772-4811-bf64-90329ea9aadc	7	t	\N	\N	2026-01-30 06:31:05.93
cml0i8gje004ppo0kxe9vz2rd	6ac95864-e772-4811-bf64-90329ea9aadc	8	t	\N	\N	2026-01-30 06:31:06.938
cml0i8hh7004rpo0knm7xxcgn	6ac95864-e772-4811-bf64-90329ea9aadc	9	t	\N	\N	2026-01-30 06:31:08.155
cml0i8j9k004vpo0ku86r6feh	6ac95864-e772-4811-bf64-90329ea9aadc	11	t	\N	\N	2026-01-30 06:31:10.472
cml125idq00019yz89vyp1yh0	67b51cdc-5ef8-4ff0-9999-3ef30dec7348	2	t	\N	\N	2026-01-30 15:48:41.679
cml125l6d00039yz8edzza6av	67b51cdc-5ef8-4ff0-9999-3ef30dec7348	3	t	\N	\N	2026-01-30 15:48:45.301
cml125nze00059yz82uh9u8om	67b51cdc-5ef8-4ff0-9999-3ef30dec7348	4	t	\N	\N	2026-01-30 15:48:48.939
cml125q7100079yz8wbxq5lpq	67b51cdc-5ef8-4ff0-9999-3ef30dec7348	5	t	\N	\N	2026-01-30 15:48:51.806
cml125squ00099yz87zrfop14	67b51cdc-5ef8-4ff0-9999-3ef30dec7348	6	t	\N	\N	2026-01-30 15:48:55.111
cml125w75000b9yz8llhvq1b2	67b51cdc-5ef8-4ff0-9999-3ef30dec7348	7	t	\N	\N	2026-01-30 15:48:59.384
cml125z4k000d9yz8bhcap6rq	67b51cdc-5ef8-4ff0-9999-3ef30dec7348	8	t	\N	\N	2026-01-30 15:49:03.381
cml1262ee000f9yz81e62uu94	67b51cdc-5ef8-4ff0-9999-3ef30dec7348	9	t	\N	\N	2026-01-30 15:49:07.622
cml1264jn000h9yz83ly1xuz1	67b51cdc-5ef8-4ff0-9999-3ef30dec7348	10	t	\N	\N	2026-01-30 15:49:10.403
cml1267c9000j9yz8re1p8b40	67b51cdc-5ef8-4ff0-9999-3ef30dec7348	11	t	\N	\N	2026-01-30 15:49:14.025
cml12z88d00029yfuhfmfj4me	fe29cb65-2fe5-450a-b5fe-884602ed9902	2	t	\N	\N	2026-01-30 16:11:48.205
cml12zao800049yfu9afkyw9d	fe29cb65-2fe5-450a-b5fe-884602ed9902	3	t	\N	\N	2026-01-30 16:11:51.368
cml12zd1g00069yfu8mbm8d5n	fe29cb65-2fe5-450a-b5fe-884602ed9902	4	t	\N	\N	2026-01-30 16:11:54.436
cml12zf6b00089yfujjz1xa3e	fe29cb65-2fe5-450a-b5fe-884602ed9902	5	t	\N	\N	2026-01-30 16:11:57.203
cml12zgwu000a9yfuhyzdza3s	fe29cb65-2fe5-450a-b5fe-884602ed9902	6	t	\N	\N	2026-01-30 16:11:59.454
cml12zisy000c9yfu9d2z95vc	fe29cb65-2fe5-450a-b5fe-884602ed9902	7	t	\N	\N	2026-01-30 16:12:01.906
cml12zksa000e9yfue5bllj4z	fe29cb65-2fe5-450a-b5fe-884602ed9902	8	t	\N	\N	2026-01-30 16:12:04.474
cml12znh0000g9yfukz9gm5bs	fe29cb65-2fe5-450a-b5fe-884602ed9902	9	t	\N	\N	2026-01-30 16:12:07.956
cml12zpda000i9yfumq7iurrn	fe29cb65-2fe5-450a-b5fe-884602ed9902	10	t	\N	\N	2026-01-30 16:12:10.414
cml12zr9i000k9yfucvmz0e8n	fe29cb65-2fe5-450a-b5fe-884602ed9902	11	t	\N	\N	2026-01-30 16:12:12.871
cml13b16500029yx63x93iyiq	e1a23325-efa5-41fb-af70-5fd2f3d31769	2	t	\N	\N	2026-01-30 16:20:58.926
cml13b4wi00049yx66l8j31ru	e1a23325-efa5-41fb-af70-5fd2f3d31769	3	t	\N	\N	2026-01-30 16:21:03.763
cml13b8cr00069yx68mbmta6b	e1a23325-efa5-41fb-af70-5fd2f3d31769	4	t	\N	\N	2026-01-30 16:21:08.037
cml13bbnh00089yx66y9ktk9y	e1a23325-efa5-41fb-af70-5fd2f3d31769	5	t	\N	\N	2026-01-30 16:21:12.509
cml13bjtq00019yihi4e69p5i	e1a23325-efa5-41fb-af70-5fd2f3d31769	2	t	\N	\N	2026-01-30 16:21:23.102
cml13bm8w00039yihjkdd9hsg	e1a23325-efa5-41fb-af70-5fd2f3d31769	3	t	\N	\N	2026-01-30 16:21:26.241
cml13bpcq00059yihsycpt6bs	e1a23325-efa5-41fb-af70-5fd2f3d31769	4	t	\N	\N	2026-01-30 16:21:30.267
cml13bs7000079yihtjpv8emp	e1a23325-efa5-41fb-af70-5fd2f3d31769	5	t	\N	\N	2026-01-30 16:21:33.75
cml13buhp00099yih6wlv5r0e	e1a23325-efa5-41fb-af70-5fd2f3d31769	6	t	\N	\N	2026-01-30 16:21:36.925
cml13bx96000b9yih0n5wxlrc	e1a23325-efa5-41fb-af70-5fd2f3d31769	7	t	\N	\N	2026-01-30 16:21:40.506
cml13bz8e000d9yih0n5exlir	e1a23325-efa5-41fb-af70-5fd2f3d31769	8	t	\N	\N	2026-01-30 16:21:43.07
cml13c1iu000f9yihum0yh43f	e1a23325-efa5-41fb-af70-5fd2f3d31769	9	t	\N	\N	2026-01-30 16:21:46.039
cml13c4ol000h9yih9pha39jt	e1a23325-efa5-41fb-af70-5fd2f3d31769	10	t	\N	\N	2026-01-30 16:21:49.935
cml13c7dn000j9yihp416h50w	e1a23325-efa5-41fb-af70-5fd2f3d31769	11	t	\N	\N	2026-01-30 16:21:53.628
cml2jwo3t00029ysu5qye7bd4	ebaefe0b-d97a-4a19-8ab6-0ef5ba6b139a	2	t	\N	\N	2026-01-31 16:53:28.457
cml2jwq5300049ysuk3hmk88r	ebaefe0b-d97a-4a19-8ab6-0ef5ba6b139a	3	t	\N	\N	2026-01-31 16:53:31.095
cml2jwrw500069ysuuo70zfst	ebaefe0b-d97a-4a19-8ab6-0ef5ba6b139a	4	t	\N	\N	2026-01-31 16:53:33.365
cml2jwun600089ysumf9rm5gj	ebaefe0b-d97a-4a19-8ab6-0ef5ba6b139a	5	t	\N	\N	2026-01-31 16:53:36.931
cml2jwx0m000a9ysu198z9q0d	ebaefe0b-d97a-4a19-8ab6-0ef5ba6b139a	6	t	\N	\N	2026-01-31 16:53:40.006
cml2jwzgn000c9ysuc4n25d0p	ebaefe0b-d97a-4a19-8ab6-0ef5ba6b139a	7	t	\N	\N	2026-01-31 16:53:43.176
cml2jx1ej000e9ysujavru7p4	ebaefe0b-d97a-4a19-8ab6-0ef5ba6b139a	8	t	\N	\N	2026-01-31 16:53:45.691
cml2jx3lj000g9ysu59elbs9o	ebaefe0b-d97a-4a19-8ab6-0ef5ba6b139a	9	t	\N	\N	2026-01-31 16:53:48.535
cml2jx5v1000i9ysuasvjkpnm	ebaefe0b-d97a-4a19-8ab6-0ef5ba6b139a	10	t	\N	\N	2026-01-31 16:53:51.469
cml5g1s2i0019qn0k1ej3x052	705ee8b9-935f-4f08-8e44-f27bacf264d6	2	t	\N	\N	2026-02-02 17:28:46.938
cml5g1syj001bqn0kj9sw8492	705ee8b9-935f-4f08-8e44-f27bacf264d6	3	t	\N	\N	2026-02-02 17:28:48.091
cml5g1u3u001dqn0kuxjtv7tr	705ee8b9-935f-4f08-8e44-f27bacf264d6	4	t	\N	\N	2026-02-02 17:28:49.578
cml5g1v40001fqn0kyyejbww0	705ee8b9-935f-4f08-8e44-f27bacf264d6	5	t	\N	\N	2026-02-02 17:28:50.881
cml5g1vx1001hqn0ksj0fpktw	705ee8b9-935f-4f08-8e44-f27bacf264d6	6	t	\N	\N	2026-02-02 17:28:51.925
cml5g1x53001jqn0kp7zc1hdl	705ee8b9-935f-4f08-8e44-f27bacf264d6	7	t	\N	\N	2026-02-02 17:28:53.511
cml5g1y3i001lqn0k4k57jkw8	705ee8b9-935f-4f08-8e44-f27bacf264d6	8	t	\N	\N	2026-02-02 17:28:54.75
cml5g1z9d001nqn0k5awx5m6l	705ee8b9-935f-4f08-8e44-f27bacf264d6	9	t	\N	\N	2026-02-02 17:28:56.258
cml5g20c5001pqn0kxzite4zo	705ee8b9-935f-4f08-8e44-f27bacf264d6	10	t	\N	\N	2026-02-02 17:28:57.654
cml5g2182001rqn0knmyrlosf	705ee8b9-935f-4f08-8e44-f27bacf264d6	11	t	\N	\N	2026-02-02 17:28:58.803
cml5g225z001tqn0kj846h9ho	705ee8b9-935f-4f08-8e44-f27bacf264d6	12	t	\N	\N	2026-02-02 17:29:00.023
cml5g239e001vqn0kr3ow4spm	705ee8b9-935f-4f08-8e44-f27bacf264d6	13	t	\N	\N	2026-02-02 17:29:01.442
cml5g249m001xqn0ke3ivj1c6	705ee8b9-935f-4f08-8e44-f27bacf264d6	14	t	\N	\N	2026-02-02 17:29:02.746
cml5g256t001zqn0k7phr584j	705ee8b9-935f-4f08-8e44-f27bacf264d6	15	t	\N	\N	2026-02-02 17:29:03.942
cml5g26610021qn0kib3d8yql	705ee8b9-935f-4f08-8e44-f27bacf264d6	16	t	\N	\N	2026-02-02 17:29:05.209
cml5g277u0023qn0kl5ywvuox	705ee8b9-935f-4f08-8e44-f27bacf264d6	17	t	\N	\N	2026-02-02 17:29:06.571
cml5g28b70025qn0k6lb9jy1e	705ee8b9-935f-4f08-8e44-f27bacf264d6	18	t	\N	\N	2026-02-02 17:29:07.987
cml5g29ji0027qn0k0nx75wen	705ee8b9-935f-4f08-8e44-f27bacf264d6	19	t	\N	\N	2026-02-02 17:29:09.583
cml5g2aoo0029qn0k8wc0pgd3	705ee8b9-935f-4f08-8e44-f27bacf264d6	20	t	\N	\N	2026-02-02 17:29:11.064
cml5g2bo3002bqn0k58ekdmhh	705ee8b9-935f-4f08-8e44-f27bacf264d6	21	t	\N	\N	2026-02-02 17:29:12.339
cml5g2cjj002dqn0kpxj850ln	705ee8b9-935f-4f08-8e44-f27bacf264d6	22	t	\N	\N	2026-02-02 17:29:13.471
cml5g2dm7002fqn0kyiek1s1h	705ee8b9-935f-4f08-8e44-f27bacf264d6	23	t	\N	\N	2026-02-02 17:29:14.863
cml5g2eea002hqn0k1ew3uo6f	705ee8b9-935f-4f08-8e44-f27bacf264d6	24	t	\N	\N	2026-02-02 17:29:15.874
cml5g2fgs002jqn0k7ta6x4oj	705ee8b9-935f-4f08-8e44-f27bacf264d6	25	t	\N	\N	2026-02-02 17:29:17.26
cml5g2g6o002lqn0kuvopwhgv	705ee8b9-935f-4f08-8e44-f27bacf264d6	26	t	\N	\N	2026-02-02 17:29:18.192
cml5g2kvn002vqn0k6i7kwviw	705ee8b9-935f-4f08-8e44-f27bacf264d6	31	t	\N	\N	2026-02-02 17:29:24.275
cml5g2lia002xqn0kqdik6qy7	705ee8b9-935f-4f08-8e44-f27bacf264d6	32	t	\N	\N	2026-02-02 17:29:25.091
cml5g2nxy0033qn0kb4gqfl6c	705ee8b9-935f-4f08-8e44-f27bacf264d6	35	t	\N	\N	2026-02-02 17:29:28.246
cml5g2rfj003bqn0kfd6bm4cl	705ee8b9-935f-4f08-8e44-f27bacf264d6	39	t	\N	\N	2026-02-02 17:29:32.768
cml5g2tnk003hqn0k90id65r2	705ee8b9-935f-4f08-8e44-f27bacf264d6	42	t	\N	\N	2026-02-02 17:29:35.648
cml5g2ulf003jqn0kp5fejj3v	705ee8b9-935f-4f08-8e44-f27bacf264d6	43	t	\N	\N	2026-02-02 17:29:36.868
cml5g2xmg003pqn0k7w8r3oln	705ee8b9-935f-4f08-8e44-f27bacf264d6	46	t	\N	\N	2026-02-02 17:29:40.792
cml5g2ygr003rqn0khuwgqtf5	705ee8b9-935f-4f08-8e44-f27bacf264d6	47	t	\N	\N	2026-02-02 17:29:41.884
cml5g2zk7003tqn0kj9pgslkk	705ee8b9-935f-4f08-8e44-f27bacf264d6	48	t	\N	\N	2026-02-02 17:29:43.304
cml5g30dr003vqn0kygry2oog	705ee8b9-935f-4f08-8e44-f27bacf264d6	49	t	\N	\N	2026-02-02 17:29:44.367
cml5g311h003xqn0k4prvqxtm	705ee8b9-935f-4f08-8e44-f27bacf264d6	50	t	\N	\N	2026-02-02 17:29:45.221
cml5g34800043qn0kiv9fdiiw	705ee8b9-935f-4f08-8e44-f27bacf264d6	53	t	\N	\N	2026-02-02 17:29:49.344
cml5g36dk0047qn0kwwxi1val	705ee8b9-935f-4f08-8e44-f27bacf264d6	55	t	\N	\N	2026-02-02 17:29:52.136
cml5g37kr0049qn0kjfiqxw6d	705ee8b9-935f-4f08-8e44-f27bacf264d6	56	t	\N	\N	2026-02-02 17:29:53.691
cml5g38gn004bqn0kgx3a79wp	705ee8b9-935f-4f08-8e44-f27bacf264d6	57	t	\N	\N	2026-02-02 17:29:54.84
cml5g3b6y004hqn0k499e9aek	705ee8b9-935f-4f08-8e44-f27bacf264d6	60	t	\N	\N	2026-02-02 17:29:58.378
cml5g3etn004pqn0kev5nl8jo	705ee8b9-935f-4f08-8e44-f27bacf264d6	64	t	\N	\N	2026-02-02 17:30:03.083
cml5g3fpw004rqn0kbudvl4qq	705ee8b9-935f-4f08-8e44-f27bacf264d6	65	t	\N	\N	2026-02-02 17:30:04.244
cml5g3gpk004tqn0kq5q06eg1	705ee8b9-935f-4f08-8e44-f27bacf264d6	66	t	\N	\N	2026-02-02 17:30:05.528
cml5g3hix004vqn0k9let0dua	705ee8b9-935f-4f08-8e44-f27bacf264d6	67	t	\N	\N	2026-02-02 17:30:06.586
cml5g3jm5004zqn0ks44kk7u6	705ee8b9-935f-4f08-8e44-f27bacf264d6	69	t	\N	\N	2026-02-02 17:30:09.293
cml5g3ldt0053qn0k20x7vlmj	705ee8b9-935f-4f08-8e44-f27bacf264d6	71	t	\N	\N	2026-02-02 17:30:11.586
cml5g3oyz005bqn0kepzts8ic	705ee8b9-935f-4f08-8e44-f27bacf264d6	75	t	\N	\N	2026-02-02 17:30:16.235
cml5g3qha005fqn0kqhrn05ea	705ee8b9-935f-4f08-8e44-f27bacf264d6	77	t	\N	\N	2026-02-02 17:30:18.191
cml5g3rfh005hqn0kzvte2rlq	705ee8b9-935f-4f08-8e44-f27bacf264d6	78	t	\N	\N	2026-02-02 17:30:19.421
cml5g2h1d002nqn0kxdjwkdjq	705ee8b9-935f-4f08-8e44-f27bacf264d6	27	t	\N	\N	2026-02-02 17:29:19.297
cml5g2i05002pqn0ksjond8m5	705ee8b9-935f-4f08-8e44-f27bacf264d6	28	t	\N	\N	2026-02-02 17:29:20.549
cml5g2itx002rqn0k1qj34epq	705ee8b9-935f-4f08-8e44-f27bacf264d6	29	t	\N	\N	2026-02-02 17:29:21.621
cml5g2jn1002tqn0kb3i4luyv	705ee8b9-935f-4f08-8e44-f27bacf264d6	30	t	\N	\N	2026-02-02 17:29:22.669
cml5g2mfl002zqn0kdaij22la	705ee8b9-935f-4f08-8e44-f27bacf264d6	33	t	\N	\N	2026-02-02 17:29:26.289
cml5g2n7a0031qn0kipwbcl11	705ee8b9-935f-4f08-8e44-f27bacf264d6	34	t	\N	\N	2026-02-02 17:29:27.287
cml5g2ost0035qn0k79szgofx	705ee8b9-935f-4f08-8e44-f27bacf264d6	36	t	\N	\N	2026-02-02 17:29:29.358
cml5g2pme0037qn0k8z1q0oiv	705ee8b9-935f-4f08-8e44-f27bacf264d6	37	t	\N	\N	2026-02-02 17:29:30.423
cml5g2qi00039qn0kyfcbk1yb	705ee8b9-935f-4f08-8e44-f27bacf264d6	38	t	\N	\N	2026-02-02 17:29:31.561
cml5g2sb1003dqn0kzrk28gk7	705ee8b9-935f-4f08-8e44-f27bacf264d6	40	t	\N	\N	2026-02-02 17:29:33.902
cml5g2svk003fqn0kk9j37jvn	705ee8b9-935f-4f08-8e44-f27bacf264d6	41	t	\N	\N	2026-02-02 17:29:34.641
cml5g2vi7003lqn0kardxxkxy	705ee8b9-935f-4f08-8e44-f27bacf264d6	44	t	\N	\N	2026-02-02 17:29:38.048
cml5g2wc4003nqn0kdtgc83k1	705ee8b9-935f-4f08-8e44-f27bacf264d6	45	t	\N	\N	2026-02-02 17:29:39.124
cml5g32ba003zqn0kifgr3yrg	705ee8b9-935f-4f08-8e44-f27bacf264d6	51	t	\N	\N	2026-02-02 17:29:46.87
cml5g33dw0041qn0kpqu0sqm2	705ee8b9-935f-4f08-8e44-f27bacf264d6	52	t	\N	\N	2026-02-02 17:29:48.26
cml5g354m0045qn0kmr0my9d6	705ee8b9-935f-4f08-8e44-f27bacf264d6	54	t	\N	\N	2026-02-02 17:29:50.519
cml5g398w004dqn0kypzcstwd	705ee8b9-935f-4f08-8e44-f27bacf264d6	58	t	\N	\N	2026-02-02 17:29:55.856
cml5g3aac004fqn0kmug3gs0m	705ee8b9-935f-4f08-8e44-f27bacf264d6	59	t	\N	\N	2026-02-02 17:29:57.204
cml5g3by2004jqn0kcuv7fbje	705ee8b9-935f-4f08-8e44-f27bacf264d6	61	t	\N	\N	2026-02-02 17:29:59.354
cml5g3cul004lqn0knvzrwb5b	705ee8b9-935f-4f08-8e44-f27bacf264d6	62	t	\N	\N	2026-02-02 17:30:00.526
cml5g3dqk004nqn0kifmbc0u4	705ee8b9-935f-4f08-8e44-f27bacf264d6	63	t	\N	\N	2026-02-02 17:30:01.676
cml5g3ijt004xqn0kwfhwn2f7	705ee8b9-935f-4f08-8e44-f27bacf264d6	68	t	\N	\N	2026-02-02 17:30:07.914
cml5g3klk0051qn0ki8w29rh2	705ee8b9-935f-4f08-8e44-f27bacf264d6	70	t	\N	\N	2026-02-02 17:30:10.568
cml5g3mh50055qn0k7h4y7fn6	705ee8b9-935f-4f08-8e44-f27bacf264d6	72	t	\N	\N	2026-02-02 17:30:13.001
cml5g3ncw0057qn0kivwzkn3e	705ee8b9-935f-4f08-8e44-f27bacf264d6	73	t	\N	\N	2026-02-02 17:30:14.145
cml5g3o4w0059qn0knk1sdnb4	705ee8b9-935f-4f08-8e44-f27bacf264d6	74	t	\N	\N	2026-02-02 17:30:15.153
cml5g3ppx005dqn0k6es6yr38	705ee8b9-935f-4f08-8e44-f27bacf264d6	76	t	\N	\N	2026-02-02 17:30:17.206
cml5g3sb2005jqn0ky6ztb9rg	705ee8b9-935f-4f08-8e44-f27bacf264d6	79	t	\N	\N	2026-02-02 17:30:20.558
cml5g3tb0005lqn0kxyobw7el	705ee8b9-935f-4f08-8e44-f27bacf264d6	80	t	\N	\N	2026-02-02 17:30:21.853
cml5g3ucg005nqn0kmo1wrvys	705ee8b9-935f-4f08-8e44-f27bacf264d6	81	t	\N	\N	2026-02-02 17:30:23.2
cml5g3vki005pqn0k3svnj7pf	705ee8b9-935f-4f08-8e44-f27bacf264d6	82	t	\N	\N	2026-02-02 17:30:24.787
cml5g3weo005rqn0ktu8mwi5p	705ee8b9-935f-4f08-8e44-f27bacf264d6	83	t	\N	\N	2026-02-02 17:30:25.873
cml5g3xk7005tqn0kkvdlr8i6	705ee8b9-935f-4f08-8e44-f27bacf264d6	84	t	\N	\N	2026-02-02 17:30:27.368
cml5g3yd3005vqn0k3jsmo9ph	705ee8b9-935f-4f08-8e44-f27bacf264d6	85	t	\N	\N	2026-02-02 17:30:28.407
cml5g3z4n005xqn0k0hk0d8q8	705ee8b9-935f-4f08-8e44-f27bacf264d6	86	t	\N	\N	2026-02-02 17:30:29.399
cml5g40ew005zqn0k8zg51g3w	705ee8b9-935f-4f08-8e44-f27bacf264d6	87	t	\N	\N	2026-02-02 17:30:31.065
cml5g41pg0061qn0kfj35mc4x	705ee8b9-935f-4f08-8e44-f27bacf264d6	88	t	\N	\N	2026-02-02 17:30:32.74
cml5g42di0063qn0khbsopetf	705ee8b9-935f-4f08-8e44-f27bacf264d6	89	t	\N	\N	2026-02-02 17:30:33.606
cml5g43o80065qn0kbfz7vrma	705ee8b9-935f-4f08-8e44-f27bacf264d6	90	t	\N	\N	2026-02-02 17:30:35.288
cml5g44mo0067qn0kd751mw5p	705ee8b9-935f-4f08-8e44-f27bacf264d6	91	t	\N	\N	2026-02-02 17:30:36.528
cml5g45jw0069qn0kcfypjqew	705ee8b9-935f-4f08-8e44-f27bacf264d6	92	t	\N	\N	2026-02-02 17:30:37.724
cml5g46ed006bqn0kgip42eu0	705ee8b9-935f-4f08-8e44-f27bacf264d6	93	t	\N	\N	2026-02-02 17:30:38.822
cml5g47aj006dqn0kur57p5v5	705ee8b9-935f-4f08-8e44-f27bacf264d6	94	t	\N	\N	2026-02-02 17:30:39.979
cml5g484x006fqn0k7ecdrhew	705ee8b9-935f-4f08-8e44-f27bacf264d6	95	t	\N	\N	2026-02-02 17:30:41.073
cml5g4913006hqn0krd4paw3j	705ee8b9-935f-4f08-8e44-f27bacf264d6	96	t	\N	\N	2026-02-02 17:30:42.231
cml5g49z9006jqn0km9yk6rpk	705ee8b9-935f-4f08-8e44-f27bacf264d6	97	t	\N	\N	2026-02-02 17:30:43.462
cml5g4ayx006lqn0ksx9d2s8q	705ee8b9-935f-4f08-8e44-f27bacf264d6	98	t	\N	\N	2026-02-02 17:30:44.745
cml5g4bsr006nqn0klxif0li7	705ee8b9-935f-4f08-8e44-f27bacf264d6	99	t	\N	\N	2026-02-02 17:30:45.819
cml5g4cp1006pqn0kqsp2qn6u	705ee8b9-935f-4f08-8e44-f27bacf264d6	100	t	\N	\N	2026-02-02 17:30:46.981
cml5g4dih006rqn0k0xsewbd3	705ee8b9-935f-4f08-8e44-f27bacf264d6	101	t	\N	\N	2026-02-02 17:30:48.041
cml5g4enx006tqn0kaysfoerx	705ee8b9-935f-4f08-8e44-f27bacf264d6	102	t	\N	\N	2026-02-02 17:30:49.534
cml5g4fml006vqn0kiz0g8t04	705ee8b9-935f-4f08-8e44-f27bacf264d6	103	t	\N	\N	2026-02-02 17:30:50.781
cml5g4gvf006xqn0ktjk96nha	705ee8b9-935f-4f08-8e44-f27bacf264d6	104	t	\N	\N	2026-02-02 17:30:52.395
cml5g4hxo006zqn0k6x723gtr	705ee8b9-935f-4f08-8e44-f27bacf264d6	105	t	\N	\N	2026-02-02 17:30:53.773
cml5g4ivj0071qn0kgdfm9kgu	705ee8b9-935f-4f08-8e44-f27bacf264d6	106	t	\N	\N	2026-02-02 17:30:54.991
cml5g4jpq0073qn0ka5yrz4iw	705ee8b9-935f-4f08-8e44-f27bacf264d6	107	t	\N	\N	2026-02-02 17:30:56.079
cml5g4kiy0075qn0knxn8phey	705ee8b9-935f-4f08-8e44-f27bacf264d6	108	t	\N	\N	2026-02-02 17:30:57.131
cml5g4lk80077qn0k3dcmxsct	705ee8b9-935f-4f08-8e44-f27bacf264d6	109	t	\N	\N	2026-02-02 17:30:58.473
cml5g4mfs0079qn0ket65eahl	705ee8b9-935f-4f08-8e44-f27bacf264d6	110	t	\N	\N	2026-02-02 17:30:59.608
cml5g4ncn007bqn0kbu8moztz	705ee8b9-935f-4f08-8e44-f27bacf264d6	111	t	\N	\N	2026-02-02 17:31:00.791
cml5g4oa2007dqn0kmwuzjzgi	705ee8b9-935f-4f08-8e44-f27bacf264d6	112	t	\N	\N	2026-02-02 17:31:01.994
cml5g4pd3007fqn0k31dl85l6	705ee8b9-935f-4f08-8e44-f27bacf264d6	113	t	\N	\N	2026-02-02 17:31:03.399
cml5g4q8i007hqn0k781ytzxe	705ee8b9-935f-4f08-8e44-f27bacf264d6	114	t	\N	\N	2026-02-02 17:31:04.531
cml5g4rcb007jqn0k15ocvfa9	705ee8b9-935f-4f08-8e44-f27bacf264d6	115	t	\N	\N	2026-02-02 17:31:05.963
cml5g4s8j007lqn0kgu6n5ymf	705ee8b9-935f-4f08-8e44-f27bacf264d6	116	t	\N	\N	2026-02-02 17:31:07.124
cml5g4t22007nqn0kaot74zgv	705ee8b9-935f-4f08-8e44-f27bacf264d6	117	t	\N	\N	2026-02-02 17:31:08.186
cml5g4tzf007pqn0ke4uckwhw	705ee8b9-935f-4f08-8e44-f27bacf264d6	118	t	\N	\N	2026-02-02 17:31:09.388
cml5g4uxd007rqn0kglcogznp	705ee8b9-935f-4f08-8e44-f27bacf264d6	119	t	\N	\N	2026-02-02 17:31:10.609
cml5g4vqb007tqn0kyax2s1jw	705ee8b9-935f-4f08-8e44-f27bacf264d6	120	t	\N	\N	2026-02-02 17:31:11.651
cml5g4wmm007vqn0kh2tisjh9	705ee8b9-935f-4f08-8e44-f27bacf264d6	121	t	\N	\N	2026-02-02 17:31:12.814
cml5g4xgf007xqn0k9vcrn0um	705ee8b9-935f-4f08-8e44-f27bacf264d6	122	t	\N	\N	2026-02-02 17:31:13.887
cml5g4yqo007zqn0kgwf8ov6x	705ee8b9-935f-4f08-8e44-f27bacf264d6	123	t	\N	\N	2026-02-02 17:31:15.552
cml5g4zs30081qn0k78aa7m7a	705ee8b9-935f-4f08-8e44-f27bacf264d6	124	t	\N	\N	2026-02-02 17:31:16.9
cml5g50mw0083qn0klr955vdv	705ee8b9-935f-4f08-8e44-f27bacf264d6	125	t	\N	\N	2026-02-02 17:31:18.009
cml5g51g80085qn0k1o668dg5	705ee8b9-935f-4f08-8e44-f27bacf264d6	126	t	\N	\N	2026-02-02 17:31:19.064
cml5g527o0087qn0kx7ef1pqp	705ee8b9-935f-4f08-8e44-f27bacf264d6	127	t	\N	\N	2026-02-02 17:31:20.052
cml5g542z008bqn0k1oxng0l5	705ee8b9-935f-4f08-8e44-f27bacf264d6	129	t	\N	\N	2026-02-02 17:31:22.475
cml5g54ws008dqn0kvvy5buvx	705ee8b9-935f-4f08-8e44-f27bacf264d6	130	t	\N	\N	2026-02-02 17:31:23.548
cml5g59aa008nqn0khx0stv2t	705ee8b9-935f-4f08-8e44-f27bacf264d6	135	t	\N	\N	2026-02-02 17:31:29.219
cml5g5b58008rqn0k6hwn1dsc	705ee8b9-935f-4f08-8e44-f27bacf264d6	137	t	\N	\N	2026-02-02 17:31:31.628
cml5g5czj008vqn0kmhzb23br	705ee8b9-935f-4f08-8e44-f27bacf264d6	139	t	\N	\N	2026-02-02 17:31:34.015
cml5g5dtm008xqn0k171px9sq	705ee8b9-935f-4f08-8e44-f27bacf264d6	140	t	\N	\N	2026-02-02 17:31:35.098
cml5g531c0089qn0korxov12x	705ee8b9-935f-4f08-8e44-f27bacf264d6	128	t	\N	\N	2026-02-02 17:31:21.12
cml5g55sj008fqn0kvwo63s91	705ee8b9-935f-4f08-8e44-f27bacf264d6	131	t	\N	\N	2026-02-02 17:31:24.692
cml5g56mx008hqn0kaqsdnwns	705ee8b9-935f-4f08-8e44-f27bacf264d6	132	t	\N	\N	2026-02-02 17:31:25.785
cml5g57fr008jqn0k2ur14ndw	705ee8b9-935f-4f08-8e44-f27bacf264d6	133	t	\N	\N	2026-02-02 17:31:26.823
cml5g58dx008lqn0kqmks2jni	705ee8b9-935f-4f08-8e44-f27bacf264d6	134	t	\N	\N	2026-02-02 17:31:28.053
cml5g5ad3008pqn0kylnvofow	705ee8b9-935f-4f08-8e44-f27bacf264d6	136	t	\N	\N	2026-02-02 17:31:30.615
cml5g5c43008tqn0kkank76vl	705ee8b9-935f-4f08-8e44-f27bacf264d6	138	t	\N	\N	2026-02-02 17:31:32.884
cml5g5ep4008zqn0kswp310g7	705ee8b9-935f-4f08-8e44-f27bacf264d6	141	t	\N	\N	2026-02-02 17:31:36.232
cml5g5fnt0091qn0kyrmdrmss	705ee8b9-935f-4f08-8e44-f27bacf264d6	142	t	\N	\N	2026-02-02 17:31:37.482
cml5g5goz0093qn0k06p7bj3x	705ee8b9-935f-4f08-8e44-f27bacf264d6	143	t	\N	\N	2026-02-02 17:31:38.82
cml69p9v9009yqn0kv46mz3t9	0a325c46-6509-4676-8e74-6549d9f71e38	2	t	\N	\N	2026-02-03 07:18:51.957
cml69pau200a0qn0k5xbl6t72	0a325c46-6509-4676-8e74-6549d9f71e38	3	t	\N	\N	2026-02-03 07:18:53.21
\.


--
-- Data for Name: Dealership; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."Dealership" (id, name, location, "createdAt", "updatedAt", "showroomNumber", "organizationId") FROM stdin;
cmk130qz40000l704z6fc2alp	Utkal Mahindra	Mancheswar	2026-01-05 11:33:16.816	2026-01-31 15:33:39.566	7008985634	cml2g3oru00009ymtudcd8add
cmivgorqg00009y5iyf5y9s5b	Mors 	Mancheswar, Rasulgarh, Bhubaneswar	2025-12-07 08:29:33.16	2026-01-31 15:34:43.177	9595959590	cml2h21jm00009y0tnq43jzk7
\.


--
-- Data for Name: DeliveryTicket; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."DeliveryTicket" (id, "firstName", "lastName", "whatsappNumber", email, address, description, "deliveryDate", "messageSent", "whatsappContactId", "dealershipId", "modelId", "createdAt", "updatedAt", "variantId", "completionSent", status) FROM stdin;
cml0pu9bd005kpo0kfef1mlgh	SOUMYASHREE	MOHANTY 	9437903466	soumyshree@gmail.com	BHUBANESWAR 	\N	2026-01-30 00:00:00	t	\N	cmk130qz40000l704z6fc2alp	cmk13mis60007js04xgg2p6bl	2026-01-30 10:04:01.321	2026-01-30 10:04:02.445	\N	f	active
cml0pvwko005mpo0kbdriwq7z	Rakesh swain	Swain	7978585992	swain79somya@gmail.com	Bbsr	Delivery 	2026-01-30 00:00:00	t	\N	cmk130qz40000l704z6fc2alp	cmk13n14k000fjs04n7s2wdb7	2026-01-30 10:05:18.12	2026-01-30 10:05:19.593	\N	f	active
cml0pxkzj005opo0k920vi234	Rakesh 	Test	7978585992	swain79somya@gmail.com	Bbsr	Delivery 	2026-01-30 00:00:00	t	\N	cmk130qz40000l704z6fc2alp	cmk13mrb90003lc04v9gamlr0	2026-01-30 10:06:36.415	2026-01-30 10:06:37.59	\N	f	active
cml0pzxn9005qpo0kfa001oql	TILITAMA	SAHOO 	9437771385	tilotama@gmail.com	BBSR 	\N	2026-01-30 00:00:00	t	\N	cmk130qz40000l704z6fc2alp	cmk13mis60007js04xgg2p6bl	2026-01-30 10:08:26.133	2026-01-30 10:08:27.371	\N	f	active
cml6bxccp00aiqn0kucz1qdh0	ARAKHITA	NAYAK	9938516092	\N	\N	\N	2026-02-03 00:00:00	t	\N	cmk130qz40000l704z6fc2alp	cml6bw1k000agqn0kjkvc2314	2026-02-03 08:21:07.657	2026-02-03 08:21:09.172	\N	f	active
cml1yw80o000eqi0k3w72ay1y	ASISH KUMAR 	SATAPATHY 	7751066039	asishkumar@gmail.com	\N	\N	2026-01-31 00:00:00	t	\N	cmk130qz40000l704z6fc2alp	cmk13nsjz0009js04ckim7hte	2026-01-31 07:05:15.672	2026-01-31 07:05:17.201	\N	f	active
cml1yxgtb000gqi0kwbp9x1vb	MANOJ KUMAR 	NAYAK 	9853879815	manojkumar@gmail.com	\N	\N	2026-01-31 00:00:00	t	\N	cmk130qz40000l704z6fc2alp	cmk13mis60007js04xgg2p6bl	2026-01-31 07:06:13.726	2026-01-31 07:06:15.269	\N	f	active
cml143fez00019ywhfib3h3bx	Anup	Pradhan	7735322819	anuppradhan929@gmail.com	bbsr	hello	2026-01-30 00:00:00	t	\N	cmivgorqg00009y5iyf5y9s5b	cmiztrp3m0007jo04qq6wkfgl	2026-01-30 16:43:03.659	2026-01-31 15:07:00.426	\N	t	closed
cml6c0t3s00akqn0kc2kqwy2m	AMBIKA PRASAD	MOHAPATRA 	9777579195	\N	\N	\N	2026-02-04 00:00:00	t	\N	cmk130qz40000l704z6fc2alp	cmk13n14k000fjs04n7s2wdb7	2026-02-03 08:23:49.336	2026-02-03 08:23:50.512	\N	f	active
cml2jtjgi00019y548pkbwv99	Anup	Pradhan	7735322819	anuppradhan929@gmail.com	\N	\N	2026-01-31 00:00:00	t	\N	cmivgorqg00009y5iyf5y9s5b	cmiztpjr70001jo044eu3c9m7	2026-01-31 16:51:02.201	2026-01-31 16:51:15.315	\N	t	closed
cml69ye9o00a2qn0kksiw6xly	Jyotiprakash	Swain	9040099131	ijpswain@gmail.com	BHUBANESWAR	\N	2026-02-03 00:00:00	t	\N	cmk130qz40000l704z6fc2alp	cmk13o7wv000bjs04kr6sz4b0	2026-02-03 07:25:57.564	2026-02-03 07:25:59.11	\N	f	active
cml6bs3l400acqn0kh83yicus	SUNIL KUMAR 	PRADHAN 	9439906889	sunilkumar@gmail.com	\N	\N	2026-02-03 00:00:00	t	\N	cmk130qz40000l704z6fc2alp	cmk13mrb90003lc04v9gamlr0	2026-02-03 08:17:03.016	2026-02-03 08:17:04.451	\N	f	active
cml6bt59i00aeqn0kmtg47npt	RABI NARAYAN 	OJHA	9937790825	rabinarayan@gmail.com	\N	\N	2026-02-03 00:00:00	t	\N	cmk130qz40000l704z6fc2alp	cmk13n14k000fjs04n7s2wdb7	2026-02-03 08:17:51.846	2026-02-03 08:17:53.448	\N	f	active
\.


--
-- Data for Name: DigitalEnquiry; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."DigitalEnquiry" (id, "firstName", "lastName", "whatsappNumber", email, address, reason, "leadScope", "whatsappContactId", "dealershipId", "leadSourceId", "interestedModelId", "createdAt", "updatedAt", "interestedVariantId", "modelText", "sourceText") FROM stdin;
cml2jwls700019ysuuws4bp1l	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-31 16:53:25.447	2026-01-31 16:53:25.447	\N	BE6	Instagram
cml2jwoir00039ysu19s80fp7	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-31 16:53:28.996	2026-01-31 16:53:28.996	\N	XEV 9E	Facebook
cml2jwqb600059ysul6es55ff	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-31 16:53:31.314	2026-01-31 16:53:31.314	\N	XEV 9S	Website
cmkwaejhc007yns0km2ihpr4d	Sasmita	Bhanja .	7894546033	\N	BOMIKHAL	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:40:49.056	2026-01-27 07:40:49.056	\N	\N	\N
cmkwaekyn007zns0kr1dvos64	Gourikant	Pradhan	9776662009	\N	DUMDUMA	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:40:50.976	2026-01-27 07:40:50.976	\N	\N	\N
cmkwaelti0080ns0k3y1jmqqq	TRINATH	KANTA	8249337952	\N	KORAPUT	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:40:52.087	2026-01-27 07:40:52.087	\N	\N	\N
cmkwaemj80081ns0khpv00iqg	Mumtaz	Belal.	8018937254	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:40:53.012	2026-01-27 07:40:53.012	\N	\N	\N
cmkwaengl0082ns0kbpzkeacg	SHIBA	SAHU	7873792904	\N	ROURKELA	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:40:54.213	2026-01-27 07:40:54.213	\N	\N	\N
cmkwaeoau0083ns0kh4to8ai3	Sudarsan	Bagha	8984844837	\N	UDALA	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:40:55.302	2026-01-27 07:40:55.302	\N	\N	\N
cmkwaep540084ns0kwjxxve1o	Dillip	Kumar	8800648707	\N	BANGALORE	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:40:56.393	2026-01-27 07:40:56.393	\N	\N	\N
cmkwaeq0b0085ns0k49rniy8s	SUBHANKAR	PANIGRAHY	7749913685	\N	BERHAMPUR	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:40:57.515	2026-01-27 07:40:57.515	\N	\N	\N
cmkwaeqv80086ns0kf60ggo77	BISWAJIT	SAMANTRAY	6370028567	\N	GOTHAPATNA	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:40:58.628	2026-01-27 07:40:58.628	\N	\N	\N
cmkwaerxs0087ns0kfrosfgyj	Tirtha	Harijan	7846897734	\N	KALAHANDI	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:41:00.017	2026-01-27 07:41:00.017	\N	\N	\N
cmkwaesw00088ns0kdj5t9zq9	NARESH	SETH	9437829163	\N	JHARSUGUDA	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-27 07:41:01.248	2026-01-27 07:41:01.248	\N	\N	\N
cmkwaeu080089ns0k37sg1s5v	ADARSH	PRAHRAJ	7205009649	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:41:02.697	2026-01-27 07:41:02.697	\N	\N	\N
cmkwaeuse008ans0kew64bs2e	AMIT	PRADHAN	9776000791	\N	NAYAPALI	Enquiry from 1/12/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:41:03.711	2026-01-27 07:41:03.711	\N	\N	\N
cmkwaevis008bns0kbm0y14c5	Swadesh	Routray	9040555666	\N	RASULGARH	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:04.661	2026-01-27 07:41:04.661	\N	\N	\N
cmkwaewfo008cns0ky9swpuil	Animesh	PADHIHARI	8144467670	\N	BHUBANESWAR	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:05.844	2026-01-27 07:41:05.844	\N	\N	\N
cmkwaexim008dns0kw7x8k2fh	HEMANT	SAHOO	7880116275	\N	KHORDHA	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:41:07.246	2026-01-27 07:41:07.246	\N	\N	\N
cmkwaeycx008ens0k7mpmv7oh	KARTIK	PATRA	8280066766	\N	GANJAM	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:08.338	2026-01-27 07:41:08.338	\N	\N	\N
cmkwaez84008fns0k14tbv6jp	BIGHNARAJ	NAYAK	9337400073	\N	KHORDHA	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:41:09.46	2026-01-27 07:41:09.46	\N	\N	\N
cmkwaf0f9008gns0kiso0b3kd	Jitendra	SAHOO	9861280166	\N	BHUBANESWAR	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:11.014	2026-01-27 07:41:11.014	\N	\N	\N
cmkwaf1b5008hns0kdctgj8mk	BISHNU		8851544542	\N	BHUBANESWAR	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:41:12.161	2026-01-27 07:41:12.161	\N	\N	\N
cmkwaf2ac008ins0kumzfvw3q	Abani	Sahoo	7751887700	\N	TALCHER	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:41:13.428	2026-01-27 07:41:13.428	\N	\N	\N
cmkwaf31s008jns0klom4wmui	Sharat	Saha .	7008971752	\N	BHUBANESWAR	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:14.416	2026-01-27 07:41:14.416	\N	\N	\N
cmkwaf3zg008kns0kyn9c3wax	Dipu	Mohanty	9861438167	\N	JHARPADA	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:15.629	2026-01-27 07:41:15.629	\N	\N	\N
cmkwaf4rk008lns0k4o9069sl	ANIKET	.	9078235056	\N	BHUBANESWAR	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:16.64	2026-01-27 07:41:16.64	\N	\N	\N
cmkwaf5l7008mns0ksful1c90	SAROJ	GUDAY	9937010815	\N	BHUBANESWAR	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:17.707	2026-01-27 07:41:17.707	\N	\N	\N
cmkwaf6e9008nns0k5cadj4qg	Debashis	Dash	8456957640	\N	BHUBANESWAR	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:18.753	2026-01-27 07:41:18.753	\N	\N	\N
cmkwaf7dg008ons0k2l5qbzbj	SIR		8018502203	\N	KALAHANDI	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:41:20.021	2026-01-27 07:41:20.021	\N	\N	\N
cmkwaf8ce008pns0kxjoi7tzc	DEBASISH	SWAIN	9337928770	\N	KHORDHA	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:41:21.278	2026-01-27 07:41:21.278	\N	\N	\N
cmkwaf974008qns0kx7qv2ylf	Venkatesh	CH	7799422909	\N	KHORDHA	Enquiry from 1/13/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:22.384	2026-01-27 07:41:22.384	\N	\N	\N
cmkwafa4f008rns0kcxevfioc	Dhiren	SAMAL	9937096868	\N	BHUBANESWAR	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:23.583	2026-01-27 07:41:23.583	\N	\N	\N
cmkwafaw0008sns0kz15wkbgg	SANDEEP	Sandip mohanty	9439331220	\N	RASULGARH	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:41:24.577	2026-01-27 07:41:24.577	\N	\N	\N
cmkwafbnc008tns0kafo7vnko	Ganesh	Sahu	7873907071	\N	BOMIKHAL	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:25.56	2026-01-27 07:41:25.56	\N	\N	\N
cmkwafcmu008uns0kqq1cmc5m	PARITOSH	MAJHI	8144200564	\N	BARAMUNDA	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:26.839	2026-01-27 07:41:26.839	\N	\N	\N
cmkwafdgu008vns0kzr2vd7ss	Ganesh	Pani	8249900978	\N	OUAT	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:27.918	2026-01-27 07:41:27.918	\N	\N	\N
cmkwaffxy008yns0k7y06ini2	Ritesh	Mohanty	7815010321	\N	KHORDHA	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:31.126	2026-01-27 07:41:31.126	\N	\N	\N
cmkwafgug008zns0kq60ngdgd	SANTOSH	PATRA	8917282116	\N	BERHAMPUR	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:41:32.296	2026-01-27 07:41:32.296	\N	\N	\N
cmkwafhnu0090ns0k4yu084rt	HARISH	REDDY	9392396743	\N	HANSPAL	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:33.355	2026-01-27 07:41:33.355	\N	\N	\N
cmkwaflc90094ns0kwdaypa7o	SATAN	HALDAR	8114828345	\N	NABARANGAPUR	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:38.121	2026-01-27 07:41:38.121	\N	\N	\N
cmkwafm4d0095ns0k1t1u3og2	abhisek	pattjoshi	9600188497	\N	NAKHARA	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-27 07:41:39.133	2026-01-27 07:41:39.133	\N	\N	\N
cmkwafmwq0096ns0kc8wovwsd	BISWAJIT	CHAND	9861273474	\N	RAYAGADA	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-27 07:41:40.155	2026-01-27 07:41:40.155	\N	\N	\N
cmkwafnn50097ns0kn68at04c	KARAN	NAIK	9777857143	\N	RAYAGADA	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:41:41.105	2026-01-27 07:41:41.105	\N	\N	\N
cmkwafodd0098ns0k9ktkqj7o	TARAKANTA	SAMAL	9777025816	\N	CTC	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:41:42.049	2026-01-27 07:41:42.049	\N	\N	\N
cmkwafp440099ns0ktztkmyvq	SWAPNIL	KUMAR	9348379904	\N	KHORDHA	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-27 07:41:43.012	2026-01-27 07:41:43.012	\N	\N	\N
cmkwafpv7009ans0kjc17ehic	AJAY	THAPAD	9124838365	\N	KOIDA	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:41:43.987	2026-01-27 07:41:43.987	\N	\N	\N
cmkwafqr9009bns0kwswozfcn	Rajib	Das Patnaik Patnaik	9937034144	\N	RASULGARH	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:45.141	2026-01-27 07:41:45.141	\N	\N	\N
cmkwafrkx009cns0kuvryk2i9	KAMAL	TIWARI	7318084529	\N	LUCKNOW	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:46.21	2026-01-27 07:41:46.21	\N	\N	\N
cmkwafsbc009dns0kzky6pob9	SATYA	NARAYAN BEHERA	9668411323	\N	UMARKORT	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:47.16	2026-01-27 07:41:47.16	\N	\N	\N
cmkwaftj5009ens0khrfckp1d	ANURUP	PATRA	9114303230	\N	BERHAMPUR	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:41:48.737	2026-01-27 07:41:48.737	\N	\N	\N
cmkwafup3009fns0kbcof19f7	Suptendu	Mohapatra	9938000614	\N	RASULGARH	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:50.247	2026-01-27 07:41:50.247	\N	\N	\N
cmkwafvl5009gns0k7ubq7abw	SANDEEP	REDDY	9966663385	\N	BBSR	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:51.401	2026-01-27 07:41:51.401	\N	\N	\N
cmkwafwes009hns0kt52s4p5k	SONU		9546213060	\N	RANCHI	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:41:52.469	2026-01-27 07:41:52.469	\N	\N	\N
cmkwag2lw009pns0kx9vxo4x4	ABHISEKH	BAG	8101117123	\N	WEST BENGOL	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:42:00.501	2026-01-27 07:42:00.501	\N	\N	\N
cmkwag3ap009qns0k1daqs6y7	P	MISHRA	8144705038	\N	BHUBANESWAR	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:01.394	2026-01-27 07:42:01.394	\N	\N	\N
cmkwag45f009rns0kf5y309e1	Abhishek	BARIK	7751073292	\N	KHORDHA	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:42:02.499	2026-01-27 07:42:02.499	\N	\N	\N
cmkwag505009sns0ki4jg6k84	DUSYANT	KUMAR	7044075889	\N	SAMBALPUR	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:03.605	2026-01-27 07:42:03.605	\N	\N	\N
cmkwag5q1009tns0k6bnk1wks	GAGAN	KUMAR BEHERA	8338004560	\N	PURI	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:04.537	2026-01-27 07:42:04.537	\N	\N	\N
cml2jwsfj00079ysuqq1nkw99	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-31 16:53:34.063	2026-01-31 16:53:34.063	\N	SCORPIO CLASSIC	Ads
cml2jwv1f00099ysuub53zfyk	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-31 16:53:37.443	2026-01-31 16:53:37.443	\N	SCORPIO-N	Social Media
cml2jwxkd000b9ysu1s9wwwor	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-31 16:53:40.717	2026-01-31 16:53:40.717	\N	THAR 3 DOOR	Customer Word-of-Mouth
cml2jwzs0000d9ysuyg5zyx0s	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-31 16:53:43.584	2026-01-31 16:53:43.584	\N	THAR ROXX	Instagram
cml2jx1m4000f9ysuf5sijabg	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-31 16:53:45.965	2026-01-31 16:53:45.965	\N	XUV 3XO	Website
cml2jx3sd000h9ysusdy1ijv9	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-31 16:53:48.781	2026-01-31 16:53:48.781	\N	XUV 700	Ads
cml2jx61v000j9ysu60f7u1wu	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-31 16:53:51.716	2026-01-31 16:53:51.716	\N	BE6	Facebook
cmkwafe9b008wns0kva5crnrg	AKHIL		9014546651	\N	BHUBANESWAR	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:28.943	2026-01-27 07:41:28.943	\N	\N	\N
cmkwafeyn008xns0kvrw7kx88	Biswajit		7008790656	\N	RASULGARH	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:41:29.855	2026-01-27 07:41:29.855	\N	\N	\N
cmkwafiji0091ns0k24et8fr1	Suryakanta	Sasmal	8280078826	\N	CUTTACK	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:34.495	2026-01-27 07:41:34.495	\N	\N	\N
cmkwafjft0092ns0k4cdcg5un	Dr	Sangram Keshari Swain	9437493949	\N	RASULGARH	Enquiry from 1/14/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:35.657	2026-01-27 07:41:35.657	\N	\N	\N
cmkwafkfb0093ns0kyz0dwoye	ADITYA	GOYL	9777707750	\N	JHARSUGADA	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:36.935	2026-01-27 07:41:36.935	\N	\N	\N
cmkwafx4q009ins0k3fcvztli	SURENDRA	MOHANTY	9078612344	\N	UMARKORT	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:53.402	2026-01-27 07:41:53.402	\N	\N	\N
cmkwafxwz009jns0kiheocuny	ADITYA	NANDA	9438574085	\N	JHARSUGUDA	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:41:54.419	2026-01-27 07:41:54.419	\N	\N	\N
cmkwafyn7009kns0kwznxhqxv	DIBYARANJAN		9658468784	\N	RASULGARH	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:55.363	2026-01-27 07:41:55.363	\N	\N	\N
cmkwafzg5009lns0kjnkemuie	NIRAKAR	SAHOO	8249851517	\N	SUNDAPADA	Enquiry from 1/15/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:41:56.406	2026-01-27 07:41:56.406	\N	\N	\N
cmkwag09e009mns0kv3wchlgq	SUBHASISH	DHAL	9234000584	\N	NAYAPALI	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:41:57.459	2026-01-27 07:41:57.459	\N	\N	\N
cmkwag101009nns0kk3hmqaf1	Jyotiranjan	Sahoo	7008348828	\N	BHUBANESWAR	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:41:58.418	2026-01-27 07:41:58.418	\N	\N	\N
cmkwag1sf009ons0k5c5xd6to	ASISH	DAS	7008162248	\N	ROURKELA	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:41:59.439	2026-01-27 07:41:59.439	\N	\N	\N
cmkwag70r009uns0kbqyf6alm	BIDESHI	GOUDA	8421500842	\N	GANJAM	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:42:06.219	2026-01-27 07:42:06.219	\N	\N	\N
cmkwag7tu009vns0kav4qa7mn	SAILESH	KUMAR BEHERA	9337887041	\N	SAMBALPUR	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:07.267	2026-01-27 07:42:07.267	\N	\N	\N
cmkwag8rc009wns0k5qd55u57	FALGUNI	SAHU	8480744868	\N	LAXMISAGAR	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:42:08.473	2026-01-27 07:42:08.473	\N	\N	\N
cmkwag9qx009xns0kvtselrtx	SUMIT	KUMAR GUPTA	6372599648	\N	JHARSUGUDA	Enquiry from 1/16/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:42:09.753	2026-01-27 07:42:09.753	\N	\N	\N
cmkwagafz009yns0kl3jbg5pf	Manoranjan	Behera	9337718802	\N	PALASUNI	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:42:10.655	2026-01-27 07:42:10.655	\N	\N	\N
cmkwagbcw009zns0ko4ukuw3m	DEEPAK	GOUDA	7976087258	\N	ROURKELA	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:42:11.84	2026-01-27 07:42:11.84	\N	\N	\N
cmkwagc6b00a0ns0ki4x58elq	Iswar	Bajikar	8984406919	\N	BHUBANESWAR	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:42:12.9	2026-01-27 07:42:12.9	\N	\N	\N
cmkwagczd00a1ns0k19yqif8b	ASHUTOSH	MOHANTY	8249183435	\N	\N	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:13.945	2026-01-27 07:42:13.945	\N	\N	\N
cmkwage1h00a2ns0kix3vc01e	KAMAL	PANDA	7670012347	\N	MANCHESWAR	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:15.317	2026-01-27 07:42:15.317	\N	\N	\N
cmkwagevw00a3ns0kjskcgj0o	Anupam	Nayak	9853199136	\N	BHUBANESWAR	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:16.413	2026-01-27 07:42:16.413	\N	\N	\N
cmkwagfst00a4ns0k4zw5ncuc	AYUSMAN	KAR	9437267264	\N	BHUBANESWAR	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:17.597	2026-01-27 07:42:17.597	\N	\N	\N
cmkwaggmt00a5ns0kcxur8vlw	BIKASH	KUMAR DAS	9779948566	\N	CHANDIKHOL	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:42:18.677	2026-01-27 07:42:18.677	\N	\N	\N
cmkwaghrf00a6ns0k871y254s	KAPILESWAR		7008667416	\N	RAYAGADA	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:42:20.139	2026-01-27 07:42:20.139	\N	\N	\N
cmkwagipa00a7ns0k923gq10u	NIGAM	MOHANTY	7894355551	\N	SUM HOSPITAL	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:21.358	2026-01-27 07:42:21.358	\N	\N	\N
cmkwagjqy00a8ns0kxjcgvj7l	KESAB	DAS	7008313454	\N	BHUBANESWAR	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:42:22.715	2026-01-27 07:42:22.715	\N	\N	\N
cmkwagkjf00a9ns0ksy3g7i0e	MUKESH	KUMAR PATRA	9094021212	\N	PAHAL	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:42:23.739	2026-01-27 07:42:23.739	\N	\N	\N
cmkwagla500aans0k6n9l9n7e	DURGA	SHANKAR PATTNAIK	9674629038	\N	BARAMUNDA	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:24.701	2026-01-27 07:42:24.701	\N	\N	\N
cmkwagm2700abns0kgwtdnwl4	TRILOCHAN	SAHOO	8144868128	\N	KHORDHA	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:25.712	2026-01-27 07:42:25.712	\N	\N	\N
cmkwagmvj00acns0kofv0wr3s	SUBHAM	JOSHI	9668506679	\N	NUAPADA	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:26.768	2026-01-27 07:42:26.768	\N	\N	\N
cmkwagnky00adns0kagi79m2n	DEV	KUMAR DAS	9437320891	\N	MAYURBHANJ	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:27.683	2026-01-27 07:42:27.683	\N	\N	\N
cmkwagoib00aens0k59peftub	RAJIB	SUBUDHI	9583205129	\N	CHILIKA	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:28.884	2026-01-27 07:42:28.884	\N	\N	\N
cmkwagpcq00afns0k91drij5l	SUBHASMITA	DAS	7008082267	\N	CHANDRASEKHAR PUR	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:29.978	2026-01-27 07:42:29.978	\N	\N	\N
cmkwagqj500agns0khxj8nr9r	KANHA	SAHOO	7978203942	\N	PHULBANI	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:42:31.505	2026-01-27 07:42:31.505	\N	\N	\N
cmkwagrdj00ahns0ku012gdnc	Nilesh	Nayak	7064130429	\N	ROURKELA	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:32.6	2026-01-27 07:42:32.6	\N	\N	\N
cmkwags9f00ains0kpwz6wz26	SUBHARJIT	MOHANTY	7377385361	\N	PURI	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:42:33.747	2026-01-27 07:42:33.747	\N	\N	\N
cmkwagteg00ajns0kf7um8yzh	KHIROD	NAYAK	8917374446	\N	BALANGIR	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:42:35.225	2026-01-27 07:42:35.225	\N	\N	\N
cmkwagy7700apns0kdwusmsvc	manjushri	Das	9861264886	\N	NAYAPALLI	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:42:41.443	2026-01-27 07:42:41.443	\N	\N	\N
cmkwagywc00aqns0kxa2n1kjn	Rajesh	Barik	8926310856	\N	JAYDEV VIHAR	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:42:42.348	2026-01-27 07:42:42.348	\N	\N	\N
cmkwagzq600arns0k9nm867vy	TRINATH	MOHANTY	8327745448	\N	TAMANDO	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:43.422	2026-01-27 07:42:43.422	\N	\N	\N
cmkwah0ja00asns0k2b4juzx9	Kumarjit	Mohanty	9853217767	\N	SUM HOSPITAL	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:42:44.47	2026-01-27 07:42:44.47	\N	\N	\N
cmkwah1f100atns0k01uzlt9n	SANTOSH	BATI	7608837444	\N	GAJPATI	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:42:45.614	2026-01-27 07:42:45.614	\N	\N	\N
cmkwah2e200auns0kskpkt6ks	JITENDRA	NAYAK	6371615537	\N	NAYAPALLI	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:42:46.875	2026-01-27 07:42:46.875	\N	\N	\N
cmkwah3u000avns0k06rryinl	Anand	sahoo	9945539349	\N	JATANI	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:42:48.745	2026-01-27 07:42:48.745	\N	\N	\N
cmkwah4n300awns0k59s4070n	RAKESH	PALARU	7205735003	\N	ROURKELA	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:42:49.791	2026-01-27 07:42:49.791	\N	\N	\N
cmkwah5d500axns0k383xtyn2	TANMAY	BAITHAREO	8249441871	\N	TITLAGARH	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:42:50.729	2026-01-27 07:42:50.729	\N	\N	\N
cmkwah6c300ayns0kpl72z1sx	Rajesh	Kumar Behera	6372964297	\N	BERHAMPUR	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:51.987	2026-01-27 07:42:51.987	\N	\N	\N
cmkwah78500azns0kshzzhew0	BISWAPRATAP	NANDA	7978450841	\N	BHUBANESWAR	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:42:53.142	2026-01-27 07:42:53.142	\N	\N	\N
cmkwah80400b0ns0k9u6f1zzq	LINU	DAS	7978486011	\N	TALCHER	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:42:54.148	2026-01-27 07:42:54.148	\N	\N	\N
cmkwah8o900b1ns0khn0aszyq	TARUN	LAKH	8093631509	\N	ROURKELA	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:55.017	2026-01-27 07:42:55.017	\N	\N	\N
cmkwah9ia00b2ns0kvn1r1xho	AKASH	PANIGRAHI	6370160768	\N	KORAPUT	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:42:56.099	2026-01-27 07:42:56.099	\N	\N	\N
cmkwahafz00b3ns0kn7kdz115	BARSHA	MAHANADH	6370544828	\N	JAYDEV VIHAR	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:42:57.311	2026-01-27 07:42:57.311	\N	\N	\N
cmkwahi7w00bcns0kn2ov3pis	SANGRAM	PAHADSINGH	6372609088	\N	NAYAPALLI	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:07.389	2026-01-27 07:43:07.389	\N	\N	\N
cmkwahjam00bdns0kbm3wfy4l	AMIT	KUMAR	7978939344	\N	PALASUNI	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:43:08.782	2026-01-27 07:43:08.782	\N	\N	\N
cmkwahk1l00bens0k0jfomyl9	MD	HUZAIH	7606920700	\N	ROURKELA	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:09.754	2026-01-27 07:43:09.754	\N	\N	\N
cmkwahl3c00bfns0khjhei7uu	Sujeet	Singh	8763312286	\N	BHUBANESWAR	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:43:11.113	2026-01-27 07:43:11.113	\N	\N	\N
cmkwahlx900bgns0ka3oqyzq5	SATYAJIT	PARMANIK	9861573010	\N	NIMAPADA	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:43:12.19	2026-01-27 07:43:12.19	\N	\N	\N
cmkwahmrs00bhns0k6wdg9bro	BISHNU	KUMARA BARIK	8053939544	\N	ROURKELA	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:43:13.288	2026-01-27 07:43:13.288	\N	\N	\N
cmkwahni900bins0kgp1bqohe	BASUDEV	BISOI	6372286280	\N	KORAPUT	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:43:14.242	2026-01-27 07:43:14.242	\N	\N	\N
cmkwahwdp00btns0kvjpzprh2	KUNA	BEHERA	8249014170	\N	BHABANIPATNA	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:25.741	2026-01-27 07:43:25.741	\N	\N	\N
cmkwahx4r00buns0kan9xr6qw	DEBASISH	BISWAS ROY	8093527427	\N	BERHAMPUR	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:43:26.715	2026-01-27 07:43:26.715	\N	\N	\N
cmkwahxxb00bvns0kk69pqo9i	SUDHIR	PATTANAIK	7008912850	\N	JATANI	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:43:27.744	2026-01-27 07:43:27.744	\N	\N	\N
cmkwahyr400bwns0k9aw9ka1g	ZAFAR		9676360007	\N	ANDRA PRADESH	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:28.817	2026-01-27 07:43:28.817	\N	\N	\N
cmkwahzjz00bxns0kvt18i1ua	BIPIN	KUMAR DAS	8249025580	\N	MANCHESWAR	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:29.855	2026-01-27 07:43:29.855	\N	\N	\N
cmkwai05t00byns0k6yzoquxz	RAM	KRISHNA PADHI	7381111339	\N	BERHAMPUR	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:43:30.642	2026-01-27 07:43:30.642	\N	\N	\N
cmkwai0vi00bzns0ko4i8p03d	MAHENDRA	JENA	8908903330	\N	BERHAMPUR	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:43:31.567	2026-01-27 07:43:31.567	\N	\N	\N
cmkwai1s200c0ns0kgibq4e42	AMIT	KUMAR MOHARANA	9861332000	\N	BARAMUNDA	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:43:32.739	2026-01-27 07:43:32.739	\N	\N	\N
cmkwai2k800c1ns0kprc8n9b3	ANJAN	PRIYA BEHERA	7978090482	\N	BARAGARH	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:43:33.753	2026-01-27 07:43:33.753	\N	\N	\N
cmkwai3b200c2ns0kiielfpxz	SERU	KHAN	7008558909	\N	SAMBALPUR	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:34.718	2026-01-27 07:43:34.718	\N	\N	\N
cmkwai42l00c3ns0krzgmxhvz	BRAJESH	PARIJA	9777662904	\N	VSS NAGAR	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:43:35.709	2026-01-27 07:43:35.709	\N	\N	\N
cmkwai4sy00c4ns0ke3v9uqkz	TANMAYA	KUMAR	9348243147	\N	KHORDHA	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:36.658	2026-01-27 07:43:36.658	\N	\N	\N
cmkwai5kv00c5ns0knz32bodn	Alok	ranjan khuntia	9853529228	\N	SUNDARPADA	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:43:37.664	2026-01-27 07:43:37.664	\N	\N	\N
cmkwai6dl00c6ns0km9pxx2id	D	BAIDYA	9490693203	\N	ANUGUL	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:38.697	2026-01-27 07:43:38.697	\N	\N	\N
cmkwagu4n00akns0k1xgkiuaz	ANIL	SAHOO	7377053696	\N	HANSPAL	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:42:36.168	2026-01-27 07:42:36.168	\N	\N	\N
cmkwaguxx00alns0k6la3u5u5	Subham	Dash	7735340510	\N	\N	Enquiry from 1/17/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:42:37.221	2026-01-27 07:42:37.221	\N	\N	\N
cmkwagvqs00amns0kbdcrlfi8	Rabindra	pati	8249032112	\N	BHUBANESWAR	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:42:38.26	2026-01-27 07:42:38.26	\N	\N	\N
cmkwagwhr00anns0k42zqfbed	RITESH		9090059795	\N	BERHAMPUR	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:42:39.232	2026-01-27 07:42:39.232	\N	\N	\N
cmkwagxc600aons0kud0rtk3e	Anil	Kamar Maharana	9090249090	\N	KHORDHA	Enquiry from 1/19/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:42:40.326	2026-01-27 07:42:40.326	\N	\N	\N
cmkwahbbx00b4ns0kdvp9b2ec	RANJAN	MOHANTY	9090018214	\N	NAKHARA	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:42:58.461	2026-01-27 07:42:58.461	\N	\N	\N
cmkwahc3400b5ns0kgca0l8mn	DURGESH	PANDA	9078323232	\N	SONPUR	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:42:59.44	2026-01-27 07:42:59.44	\N	\N	\N
cmkwahcu800b6ns0kp1bo2vib	KALU	GOUDA	9776115848	\N	BERHAMPUR	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:43:00.417	2026-01-27 07:43:00.417	\N	\N	\N
cmkwahdux00b7ns0k5vafhe2c	Samir	Kumar Das	9777041487	\N	BHUBANESWAR	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:43:01.737	2026-01-27 07:43:01.737	\N	\N	\N
cmkwahep700b8ns0ku2r8ukys	Rahul	Behera.	7008301370	\N	PAHALA	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:43:02.827	2026-01-27 07:43:02.827	\N	\N	\N
cmkwahfl800b9ns0kw9f0qzsn	Amit	Kumar Panda	9090440606	\N	PAHALA	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:03.98	2026-01-27 07:43:03.98	\N	\N	\N
cmkwahggh00bans0ks5u1kwql	SUBASH	KUMAR	9348746242	\N	SUNDARGARH	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:43:05.106	2026-01-27 07:43:05.106	\N	\N	\N
cmkwahhbt00bbns0kn6lzykcs	SANTOSH	RATH	9337449197	\N	PURI	Enquiry from 1/20/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:43:06.233	2026-01-27 07:43:06.233	\N	\N	\N
cmkwahoce00bjns0k2ea0rup1	Soubhagya	Nayak	9348250534	\N	BALIANTA	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:43:15.327	2026-01-27 07:43:15.327	\N	\N	\N
cmkwahp4o00bkns0k0ooc2vg5	SATYARANJAN		9938091165	\N	BARAMUNDA	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:43:16.345	2026-01-27 07:43:16.345	\N	\N	\N
cmkwahpv100blns0koadj1v8v	Sitaram	Behera	8917207022	\N	MAYURBHANJ	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:43:17.293	2026-01-27 07:43:17.293	\N	\N	\N
cmkwahqkx00bmns0kdfztodn0	GAGAN	SWAIN	7027545217	\N	CHAKEISIANI	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:43:18.226	2026-01-27 07:43:18.226	\N	\N	\N
cmkwahrcg00bnns0k99764820	SUNIL	KUMAR PARIDA	9556824504	\N	KHORDHA	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:43:19.216	2026-01-27 07:43:19.216	\N	\N	\N
cmkwahrz000bons0kvcawxg01	ABHIJIT	BANERJEE	9583102038	\N	ROURKELA	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:43:20.028	2026-01-27 07:43:20.028	\N	\N	\N
cmkwahsux00bpns0kujlpsdq0	BASANT	BISOI	9692745567	\N	KORAPUT	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:43:21.178	2026-01-27 07:43:21.178	\N	\N	\N
cmkwahtoy00bqns0k3lfz7zir	KAMAL	KHAN	6370173473	\N	NABARANGPUR	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:43:22.258	2026-01-27 07:43:22.258	\N	\N	\N
cmkwahuhx00brns0k2fpm8nl7	EKANTA	KUMAR SETH	8658311546	\N	SUNDARGARH	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:43:23.301	2026-01-27 07:43:23.301	\N	\N	\N
cmkwahvjd00bsns0k97xogq7q	RAJA	RAM	9997956019	\N	RASULGARH	Enquiry from 1/21/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:43:24.649	2026-01-27 07:43:24.649	\N	\N	\N
cmkwaibf500ccns0k6ilk4dm1	AJIT	KUMAR	9090823435	\N	BHUBANESWAR	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:45.233	2026-01-27 07:43:45.233	\N	\N	\N
cmkwaicb500cdns0knflz0mh1	SOHAN	PUROHIT	9348106300	\N	BERHAMPUR	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:43:46.385	2026-01-27 07:43:46.385	\N	\N	\N
cmkwaid6w00cens0khe3vh463	Ricky	verma	9776422255	\N	NANDAN VIHAR	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:47.529	2026-01-27 07:43:47.529	\N	\N	\N
cmkwaidyy00cfns0kevfj58pd	BINOD	KUMAR	8249181836	\N	RASULGARH	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:43:48.538	2026-01-27 07:43:48.538	\N	\N	\N
cmkwaieth00cgns0k4j0004nm	LALU	PRASAD SAMAL	9937087477	\N	NIALI	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:43:49.637	2026-01-27 07:43:49.637	\N	\N	\N
cmkwaii0s00ckns0k2edvzrzm	BISWAJIT	JENA	7008308782	\N	JATANI	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:53.789	2026-01-27 07:43:53.789	\N	\N	\N
cmkwaij3y00clns0kzp6ob9kc	Amriit	Saamntraay	9861838003	\N	CHILIKA	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:43:55.199	2026-01-27 07:43:55.199	\N	\N	\N
cmkwaijxm00cmns0kvrsdsaog	JAGABANDHU	SAHOO	6372049590	\N	KHORDHA	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:43:56.267	2026-01-27 07:43:56.267	\N	\N	\N
cmkwaimgh00cpns0kcdxgmx6o	ANURAG	MISHRA	9861551494	\N	BERHAMPUR	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:59.537	2026-01-27 07:43:59.537	\N	\N	\N
cmkwaindz00cqns0kp3hdmi9l	Jamudi	Ilvu Rana	6370305142	\N	KALAHANDI	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:00.743	2026-01-27 07:44:00.743	\N	\N	\N
cmkwaio5c00crns0k73pz3yt6	Nityashree	Ranjan Nayak	8338031023	\N	NAKHARA	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:01.728	2026-01-27 07:44:01.728	\N	\N	\N
cmkwaip1e00csns0k0f8roopo	Dayasankar	Panigrahi	9778998484	\N	BARAMUNDA	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:02.883	2026-01-27 07:44:02.883	\N	\N	\N
cmkwaipze00ctns0khhitwxz9	Shasank	Agrawal	9078957509	\N	BARGARH	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:04.106	2026-01-27 07:44:04.106	\N	\N	\N
cmkwaiqsn00cuns0kklixv2sm	RAJA	RAM DASH	8260336147	\N	KHORDHA	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:44:05.159	2026-01-27 07:44:05.159	\N	\N	\N
cmkwai79i00c7ns0kbiw6gv9k	RAM	GUPTA	7873291501	\N	SAMBALPUR	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:43:39.847	2026-01-27 07:43:39.847	\N	\N	\N
cmkwai89g00c8ns0kvpr4h7qh	DEV	RAY	9078996600	\N	JAIPUR	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:43:41.141	2026-01-27 07:43:41.141	\N	\N	\N
cmkwai92100c9ns0k52mh8tm9	RAJ	BARAD	9937942568	\N	JAIPUR	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:43:42.169	2026-01-27 07:43:42.169	\N	\N	\N
cmkwai9ry00cans0ksxx8okan	BISWAJIT	MOHARANA	6371540753	\N	RASULGARH	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:43:43.102	2026-01-27 07:43:43.102	\N	\N	\N
cmkwaiar600cbns0kle304kiy	RANJIT	SEN	9204632465	\N	JAMSEDPUR	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:43:44.37	2026-01-27 07:43:44.37	\N	\N	\N
cmkwaifml00chns0k0avk951k	BIKASH	KUMAR	6372290059	\N	KORAPUT	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:43:50.686	2026-01-27 07:43:50.686	\N	\N	\N
cmkwaigcs00cins0kk5rw8nqx	BIPLAV	KUMAR	9337677759	\N	MALKANGIRI	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:43:51.628	2026-01-27 07:43:51.628	\N	\N	\N
cmkwaih6600cjns0kcusq3k1p	SANJAY	BALIARSINGH	9853300020	\N	MANCHESWAR	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:43:52.686	2026-01-27 07:43:52.686	\N	\N	\N
cmkwaikny00cnns0k29mh14e5	SUBHRANSHU	DEHURI	9090677177	\N	AIIMS	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:43:57.214	2026-01-27 07:43:57.214	\N	\N	\N
cmkwaildo00cons0k2dvt4mft	RAJIT	KUMAR	9179424133	\N	BERHAMPUR	Enquiry from 1/22/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:43:58.141	2026-01-27 07:43:58.141	\N	\N	\N
cmkwaisgx00cwns0kzgalq5x2	Jayanta	Narayan Sarangi	9437153732	\N	KHORDHA	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:44:07.329	2026-01-27 07:44:07.329	\N	\N	\N
cmkwaitf600cxns0k9wxu8z5a	RAHUL	SHAH	9178999999	\N	GOPALPUR	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:08.563	2026-01-27 07:44:08.563	\N	\N	\N
cmkwaiu8z00cyns0kt31xzgk9	Jaminee	Mishra	9937022255	\N	MANCHESWAR	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:44:09.635	2026-01-27 07:44:09.635	\N	\N	\N
cml5g1q620018qn0kygl0dsyb	NARAYAN	SAHOO	9937718244	\N	GANJAM	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:28:44.474	2026-02-02 17:28:44.474	\N	Bolero Neo	DIGITAL
cml5g1x56001kqn0kxjb3jscf	PINAKI	SAMAL	8456804565	\N	DHENKANAL	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:28:53.514	2026-02-02 17:28:53.514	\N	XUV 3XO	DIGITAL
cml5g1y3l001mqn0k9xx0w4lv	JYOTIRANJAN	JENA	9040844252	\N	GADAKANA	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:28:54.753	2026-02-02 17:28:54.753	\N	Bolero Neo	DIGITAL
cml5g2262001uqn0k1jmv82o4	SabyasachiMohanty		9040095927	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:00.026	2026-02-02 17:29:00.026	\N	XUV 7XO	DIGITAL
cml5g239h001wqn0kgo2tf2wn	PRASAD	JENA	8249470711	\N	ANGUL	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:01.445	2026-02-02 17:29:01.445	\N	XUV 3XO	DIGITAL
cml5g249r001yqn0kpyqc999w	TAPAS	BEHERA	6370138664	\N	TAMANDO	Bolero	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:02.752	2026-02-02 17:29:02.752	\N	Bolero	DIGITAL
cml5g29jn0028qn0kj2757wl9	Sagar	Kumar Pradhan	7008513161	\N	ANGUL	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:09.587	2026-02-02 17:29:09.587	\N	XUV 7XO	DIGITAL
cml5g2bo7002cqn0kwt6dd4rt	DIBYA	RASHMI BISWAL	9861174740	\N	ANGUL	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:12.343	2026-02-02 17:29:12.343	\N	Scorpio N	DIGITAL
cml5g2dma002gqn0kjlib09y4	MANOJ	PATRA	9712937982	\N	PATIA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:14.866	2026-02-02 17:29:14.866	\N	XUV 3XO	DIGITAL
cml5g2eee002iqn0krz06j1s7	ANIL	KUMAR KAR	7008312052	\N	C S PUR	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:15.879	2026-02-02 17:29:15.879	\N	Bolero Neo	DIGITAL
cml5g2kvt002wqn0k1qarm2od	Rashmi	Ranjan .	8123769168	\N	BHUBANESWAR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:24.282	2026-02-02 17:29:24.282	\N	XUV 7XO	DIGITAL
cml5g2n7c0032qn0krmvmoeeq	PRADEEP	BEURA	8777032173	\N	ATHAGARH	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:27.289	2026-02-02 17:29:27.289	\N	Bolero Neo	DIGITAL
cml5g2rfn003cqn0kpftbdc8r	Somya	Pani	8249727155	\N	KIIT SQUARE	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:32.772	2026-02-02 17:29:32.772	\N	Scorpio N	DIGITAL
cml5g2svo003gqn0kaes86tmr	Yugant	Behuria	9937569235	\N	PATIA	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:34.645	2026-02-02 17:29:34.645	\N	THAR ROXX	DIGITAL
cml5g2tnm003iqn0km1hmphy4	INDRAJIT	BHANJA	9348114738	\N	DHENKANAL	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:35.651	2026-02-02 17:29:35.651	\N	XUV 7XO	DIGITAL
cml5g2uli003kqn0kowu8713j	DANIEL		8290221192	\N	ANUGUL	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:36.871	2026-02-02 17:29:36.871	\N	XUV 3XO	DIGITAL
cml5g2wc6003oqn0ksig2s2ly	PRAVAT	BEHERA	9556916267	\N	SAMBALPUR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:39.127	2026-02-02 17:29:39.127	\N	XUV 3XO	DIGITAL
cml5g2xmi003qqn0kg9eez9up	PRAVAT	PATRA	8939158790	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:40.794	2026-02-02 17:29:40.794	\N	XUV 7XO	DIGITAL
cml5g2zka003uqn0kia5w121e	SUMANT	KUMAR	9032118987	\N	PATIA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:43.306	2026-02-02 17:29:43.306	\N	XUV 3XO	DIGITAL
cml5g30dt003wqn0khrssut18	AR	PRADHAN	7008826410	\N	SAILASHREE VIHAR	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:44.369	2026-02-02 17:29:44.369	\N	Scorpio N	DIGITAL
cml5g33dz0042qn0kxlvkwen1	GOUTAM	SAHOO	9337353388	\N	SAILASHREE VIHAR	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:48.263	2026-02-02 17:29:48.263	\N	Scorpio N	DIGITAL
cml5g36do0048qn0k5qubuzjs	ITISHREE	DAS	7735287981	\N	PATIA	Scorpio Classic	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:52.141	2026-02-02 17:29:52.141	\N	Scorpio Classic	DIGITAL
cml5g37kt004aqn0ktga91bbz	Pramod	patnaik	9439490009	\N	SAILESHREE VIHAR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:53.693	2026-02-02 17:29:53.693	\N	XUV 7XO	DIGITAL
cml5g3aae004gqn0ku7jig7sh	Manoranjan	Behara	7377674129	\N	KIIT SQUARE	Bolero	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:57.207	2026-02-02 17:29:57.207	\N	Bolero	DIGITAL
cml5g3b70004iqn0ki8d3ee8w	Soumya	Pratim Sahoo	7381654886	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:58.381	2026-02-02 17:29:58.381	\N	XUV 7XO	DIGITAL
cml5g3dqm004oqn0k4l3jd6bv	Avijit	Patra	9649003234	\N	KIIT	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:01.679	2026-02-02 17:30:01.679	\N	XUV 7XO	DIGITAL
cml5g3etq004qqn0krvh1vsj2	SUSHANT	KUMAR DASH	8489646476	\N	HYDRABAD	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:03.086	2026-02-02 17:30:03.086	\N	XUV 7XO	DIGITAL
cml5g3fq1004sqn0kn7blxpxp	Silu	Kumar Palai	9938000666	\N	INFO CITY	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:04.249	2026-02-02 17:30:04.249	\N	XUV 7XO	DIGITAL
cml5g3gpn004uqn0klbhmuicx	SIDHARTHA	KUMAR NAYAK	8093252068	\N	GOTHAPATNA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:05.531	2026-02-02 17:30:05.531	\N	XUV 7XO	DIGITAL
cml5g3ijw004yqn0kvvzpwony	Siddhant	Sahoo	7750847056	\N	BBSR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:07.916	2026-02-02 17:30:07.916	\N	XUV 7XO	DIGITAL
cml5g3jm70050qn0k3kuc1fua	DEVI	SANKAR	9986809564	\N	BANGLORE	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:09.296	2026-02-02 17:30:09.296	\N	XUV 7XO	DIGITAL
cmkwairo800cvns0kwoar4qgm	S	PRADHAN	7008786353	\N	SAHEED NAGAR	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:44:06.297	2026-01-27 07:44:06.297	\N	\N	\N
cmkwaiv2g00czns0kgsgxgso7	HIMANSHU	DIGAL	8260906694	\N	SALIASAHI	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:44:10.697	2026-01-27 07:44:10.697	\N	\N	\N
cmkwaiw3u00d0ns0ki92fx2lk	CHINTU	RANA	6372735279	\N	MAYURBHANJ	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:44:12.043	2026-01-27 07:44:12.043	\N	\N	\N
cmkwaiwz400d1ns0kl38e0u7y	KARAN	SOREN	9437143742	\N	MAYURBHANJ	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:44:13.169	2026-01-27 07:44:13.169	\N	\N	\N
cmkwaixtm00d2ns0k8w52tbu3	LOVILINA		8447316700	\N	BHUBANESWAR	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:14.266	2026-01-27 07:44:14.266	\N	\N	\N
cmkwaiyqt00d3ns0ki7koqjrc	Santanu	Dixit	9090020655	\N	BHUBANESWAR	Enquiry from 1/23/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:15.461	2026-01-27 07:44:15.461	\N	\N	\N
cmkwaizla00d4ns0kkt9clruf	SUJIT	KATRIYA	7008239686	\N	DAMANJODI	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:44:16.559	2026-01-27 07:44:16.559	\N	\N	\N
cmkwaj0cu00d5ns0ktkv4wr29	KHIROD	KUMAR MOHANTY	9938447673	\N	GOPALPUR	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:44:17.55	2026-01-27 07:44:17.55	\N	\N	\N
cmkwaj18k00d6ns0k0e4dsk3j	BISWA	MITRA BEHERA	8260947723	\N	BALANGIR	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:44:18.692	2026-01-27 07:44:18.692	\N	\N	\N
cmkwaj1zh00d7ns0kwt0aan6v	SAYAN	JENA	8249498391	\N	NAYAPALLI	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:44:19.661	2026-01-27 07:44:19.661	\N	\N	\N
cmkwaj2za00d8ns0kpdkyiz9j	MANAV	PATEL	7008316826	\N	SAMBALPUR	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:20.951	2026-01-27 07:44:20.951	\N	\N	\N
cmkwaj3nv00d9ns0kd0rm7wbb	SHAKTI	RONIT	6371432115	\N	PAHALA	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:21.835	2026-01-27 07:44:21.835	\N	\N	\N
cmkwaj4jh00dans0k3336x9yp	NIKHIL	ROUTRAY	8249046168	\N	KHORDHA	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:44:22.973	2026-01-27 07:44:22.973	\N	\N	\N
cmkwaj5ii00dbns0kdt54ecg9	MANOJ	SAHU	9337627685	\N	PAHALA	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:24.234	2026-01-27 07:44:24.234	\N	\N	\N
cmkwaj69w00dcns0kaxc9mzir	ANAND	MEHER	7609070076	\N	SONPUR	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:25.22	2026-01-27 07:44:25.22	\N	\N	\N
cmkwaj72s00ddns0k2itwe4n6	rudra	narayan dixit	6372202715	\N	PURI	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:44:26.26	2026-01-27 07:44:26.26	\N	\N	\N
cmkwaj7w000dens0k4nqut94c	K.	SHIVARAM	8908755817	\N	PAHALA	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:44:27.312	2026-01-27 07:44:27.312	\N	\N	\N
cmkwaj8p400dfns0kmrhh6odp	ANUKULA	MOHANTY	9937302378	\N	PARALAKHEMUNDI	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:28.361	2026-01-27 07:44:28.361	\N	\N	\N
cmkwaj9kh00dgns0kypgfxefc	ISWAR	CHANDRA BEHERA	9938595368	\N	SALIPUR	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:44:29.489	2026-01-27 07:44:29.489	\N	\N	\N
cmkwajacf00dhns0knaydsp0b	PRIYANSHU	GUPTA	6306867457	\N	RAYAGADA	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:44:30.495	2026-01-27 07:44:30.495	\N	\N	\N
cmkwajb7p00dins0ka3s0tmc6	JITENDRA	mahanadia	9337541655	\N	RAYAGADA	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-27 07:44:31.621	2026-01-27 07:44:31.621	\N	\N	\N
cmkwajbwj00djns0k9d6x5le0	kadambini	MOHANTY	9778660888	\N	BALIANTA	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-27 07:44:32.515	2026-01-27 07:44:32.515	\N	\N	\N
cmkwajct000dkns0k492ca275	sumanta	Biswal	6370084859	\N	KHORDHA	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:44:33.684	2026-01-27 07:44:33.684	\N	\N	\N
cmkwajdkh00dlns0kajgoaj2q	BB	BEHERA	7008608086	\N	BARAMUNDA	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:44:34.673	2026-01-27 07:44:34.673	\N	\N	\N
cmkwajehg00dmns0k3ynizi3m	IRSHAD	KHAN	8455007332	\N	SONPUR	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:35.86	2026-01-27 07:44:35.86	\N	\N	\N
cmkwajf8x00dnns0k23q88tl6	HITESH	SAHA	7008375956	\N	SAMBALPUR	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:36.85	2026-01-27 07:44:36.85	\N	\N	\N
cmkwajg4r00dons0k3s3cspib	RANJAN	KUMAR	8861896861	\N	MANCHESWAR	Enquiry from 1/24/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:37.995	2026-01-27 07:44:37.995	\N	\N	\N
cmkwajh3q00dpns0kvmzcrwdf	CHINU	BISOI	9348913493	\N	BERHAMPUR	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:44:39.255	2026-01-27 07:44:39.255	\N	\N	\N
cmkwaji0p00dqns0kod58w7fj	BAIKUNTHA	DURIA	9348068181	\N	RAYAGADA	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:40.441	2026-01-27 07:44:40.441	\N	\N	\N
cmkwajizk00drns0k93tdvv3x	Bishnu	Priya Sahu	7327980729	\N	MANCHESWAR	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-27 07:44:41.697	2026-01-27 07:44:41.697	\N	\N	\N
cmkwajjys00dsns0krp0nby4o	SAMBIT	GHADEI	9437198823	\N	CUTTACK	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:44:42.964	2026-01-27 07:44:42.964	\N	\N	\N
cmkwajkwu00dtns0kued0vb6x	pramod	kumar AGARWAL	9778806816	\N	LAXMI SAGAR	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:44.19	2026-01-27 07:44:44.19	\N	\N	\N
cmkwajlmy00duns0k2dzvvbvz	KAILASH	CHANDRA parida	7735531279	\N	BHUBANESWAR	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:44:45.131	2026-01-27 07:44:45.131	\N	\N	\N
cmkwajmig00dvns0kdu94p7d5	UDAYA		8917201706	\N	HI-TECH	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:46.264	2026-01-27 07:44:46.264	\N	\N	\N
cmkwajn9800dwns0k1k8f4n63	SOUMYA	HOTA	9040281591	\N	RASULGARH	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-27 07:44:47.228	2026-01-27 07:44:47.228	\N	\N	\N
cmkwajnz900dxns0kzap1xcl2	Ankita	Khuntia	7609821027	\N	KHORDHA	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:48.165	2026-01-27 07:44:48.165	\N	\N	\N
cmkwajors00dyns0k5qrnjsb0	Debadatta	sethi	9040744989	\N	BHUBANESWAR	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-27 07:44:49.192	2026-01-27 07:44:49.192	\N	\N	\N
cmkwajpj400dzns0kg6emjjxz	Shibnarayan	Samantasinghar	7016299983	\N	BHUBANESWAR	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:44:50.176	2026-01-27 07:44:50.176	\N	\N	\N
cmkwajqa900e0ns0k1zd0nac7	JB	RAMNA	7416342016	\N	RAJASTHAN	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-27 07:44:51.154	2026-01-27 07:44:51.154	\N	\N	\N
cmkwajqxa00e1ns0ksohb36tu	GOURAV	SAMAL	6372914036	\N	BARBIL	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:44:51.983	2026-01-27 07:44:51.983	\N	\N	\N
cmkwajruz00e2ns0kf1kx7ibi	ABHIJIT	SAHOO	9238906509	\N	PAHALA	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-27 07:44:53.196	2026-01-27 07:44:53.196	\N	\N	\N
cml5g1s2t001aqn0k6okollj5	ABHAYA	ROUT	8095875886	\N	PATIA	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:28:46.949	2026-02-02 17:28:46.949	\N	Scorpio N	DIGITAL
cml5g1syo001cqn0kp2hci9ic	SATYAJEET	BISWAL	8114864765	\N	ANGUL	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:28:48.096	2026-02-02 17:28:48.096	\N	Scorpio N	DIGITAL
cml5g1u3x001eqn0kop6kr5yg	RAJESH	KUMAR MALLICK	9348568833	\N	DUMDUMA	Scorpio Classic	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:28:49.581	2026-02-02 17:28:49.581	\N	Scorpio Classic	DIGITAL
cml5g1v44001gqn0k3musjirq	MANAS	BEHERA	8984641065	\N	PATIA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:28:50.884	2026-02-02 17:28:50.884	\N	XUV 3XO	DIGITAL
cml5g1vx4001iqn0kcqjt53cy	HIMANSU	PRADHAN	6372592910	\N	SUM HOSPITAL	Scorpio Classic	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:28:51.928	2026-02-02 17:28:51.928	\N	Scorpio Classic	DIGITAL
cml5g1z9h001oqn0k3rv6mfyl	KRISHNA	CHANDRA MISHRA	9337388968	\N	CHANDAK	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:28:56.261	2026-02-02 17:28:56.261	\N	Bolero Neo	DIGITAL
cml5g20cb001qqn0km92nq2rd	SUKANT	SAMAL	7842301986	\N	PATIA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:28:57.659	2026-02-02 17:28:57.659	\N	XUV 3XO	DIGITAL
cml5g2188001sqn0kqo77dn8u	Soumya	Ranjan	7735092106	\N	ANGUL	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:28:58.808	2026-02-02 17:28:58.808	\N	THAR ROXX	DIGITAL
cml5g256x0020qn0k8tdfkpl2	SAMIR		7908977171	\N	PATIA	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:03.945	2026-02-02 17:29:03.945	\N	Bolero Neo	DIGITAL
cml5g26650022qn0kt1uglgdf	SANKET	MOHANTY	8260364292	\N	PATIA	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:05.213	2026-02-02 17:29:05.213	\N	THAR	DIGITAL
cml5g277y0024qn0k6x2m0lhr	Bibhudatta	Jena	9438434241	\N	BHUBANESWAR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:06.574	2026-02-02 17:29:06.574	\N	XUV 7XO	DIGITAL
cml5g28b90026qn0k78ovmkw5	BIBEK		9900468844	\N	BANGALORE	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:07.989	2026-02-02 17:29:07.989	\N	XUV 7XO	DIGITAL
cml5g2aor002aqn0kfc4w5yrh	BIBHU	DUTTA	7411539119	\N	ANGUL	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:11.067	2026-02-02 17:29:11.067	\N	XUV 7XO	DIGITAL
cml5g2cjn002eqn0knxizfvw5	RAJESH	DAS	7978986926	\N	BARANG	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:13.475	2026-02-02 17:29:13.475	\N	XUV 3XO	DIGITAL
cml5g2fgu002kqn0kty78j560	SUSHANT	ACHARAY	8951866365	\N	BANGALORE	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:17.263	2026-02-02 17:29:17.263	\N	Scorpio N	DIGITAL
cml5g2g6q002mqn0kej3m7pct	Dipak	RANJAN DAS	9777606011	\N	PATIA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:18.195	2026-02-02 17:29:18.195	\N	XUV 3XO	DIGITAL
cml5g2h1k002oqn0knwz16f78	BISHNU	BARIK	8763784166	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:19.304	2026-02-02 17:29:19.304	\N	XUV 7XO	DIGITAL
cml5g2i07002qqn0k50xr914r	LELIN		7894148960	\N	PATIA	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:20.552	2026-02-02 17:29:20.552	\N	THAR	DIGITAL
cml5g2iu3002sqn0kw9heqmaf	Kishore	Chandra Nayak .	9437211923	\N	BHUBANESWAR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:21.627	2026-02-02 17:29:21.627	\N	XUV 3XO	DIGITAL
cml5g2jn4002uqn0ku2sezoit	Yash	Roy	8584859668	\N	ANGUL	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:22.672	2026-02-02 17:29:22.672	\N	THAR	DIGITAL
cml5g2lid002yqn0kdp04lpg7	Sunil	Tripathy	9178471714	\N	SONEPUR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:25.094	2026-02-02 17:29:25.094	\N	XUV 7XO	DIGITAL
cml5g2mfq0030qn0kra4oug9e	SUDHAKAR	RAO	9439190096	\N	KORAPUT	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:26.295	2026-02-02 17:29:26.295	\N	THAR	DIGITAL
cml5g2ny00034qn0k2gsdqrqt	ADITYA	RUPCHAND	7853984558	\N	PATIA	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:28.249	2026-02-02 17:29:28.249	\N	Scorpio N	DIGITAL
cml5g2osw0036qn0koigvt91i	JAGDESH	SARANGI	9078628883	\N	SAILASHREE	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:29.36	2026-02-02 17:29:29.36	\N	XUV 7XO	DIGITAL
cml5g2pmi0038qn0karos4n4d	RAHUL	KUMAR BEHERA	7978069142	\N	C S PUR	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:30.427	2026-02-02 17:29:30.427	\N	THAR	DIGITAL
cml5g2qi3003aqn0kwccyyycd	Biswajit	Lenka	7540904441	\N	BBSR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:31.563	2026-02-02 17:29:31.563	\N	XUV 7XO	DIGITAL
cml5g2sb4003eqn0kciz58hm0	AMRESH	BEHERA	9556914770	\N	NANDAN BIHAR	Scorpio Classic	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:33.904	2026-02-02 17:29:33.904	\N	Scorpio Classic	DIGITAL
cml5g2vib003mqn0kdbakgma1	KULAMANI	BAG	9556185430	\N	CHANDAKA	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:38.05	2026-02-02 17:29:38.05	\N	Scorpio N	DIGITAL
cml5g2ygw003sqn0kqyo3gi02	HETRAM		9414481436	\N	DELHI	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:41.888	2026-02-02 17:29:41.888	\N	Scorpio N	DIGITAL
cml5g311k003yqn0kk4g3hxsi	PRAVAT	RANJAN NAURA	9938090533	\N	TRIDENT COLLEGE	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:45.224	2026-02-02 17:29:45.224	\N	XUV 7XO	DIGITAL
cml5g32bh0040qn0kpwu8tsi7	RAHUL	SAHU	8249675101	\N	BHUBANESWAR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:46.877	2026-02-02 17:29:46.877	\N	XUV 7XO	DIGITAL
cml5g34820044qn0kk0n2ayz7	KAMAL		9959098368	\N	MAITRI VIHAR	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:49.347	2026-02-02 17:29:49.347	\N	Bolero Neo	DIGITAL
cml5g354r0046qn0k6j6ukfjn	Amit	Dubey	9078293706	\N	PATIA	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:50.523	2026-02-02 17:29:50.523	\N	Scorpio N	DIGITAL
cml5g38gr004cqn0k1zp3eymq	CHINMAYA	SAHOO	7873476377	\N	DHENKANAL	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:54.843	2026-02-02 17:29:54.843	\N	Bolero Neo	DIGITAL
cml5g398y004eqn0kj0m2n4l4	Sanjay	Kumar Bhoi	7008174349	\N	BHARATPUR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:55.859	2026-02-02 17:29:55.859	\N	XUV 7XO	DIGITAL
cml5g3by7004kqn0kyof3d9et	Karun		8895268107	\N	Banglore	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:29:59.359	2026-02-02 17:29:59.359	\N	THAR	DIGITAL
cml5g3cup004mqn0k22kzq1sj	prasanta	Kumar Biswal	9437108195	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:00.529	2026-02-02 17:30:00.529	\N	XUV 7XO	DIGITAL
cml5g3hj1004wqn0k8g87ub2z	SHEKH	TOUKIR	7049326058	\N	MADHYA PRADESH	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:06.589	2026-02-02 17:30:06.589	\N	Scorpio N	DIGITAL
cml5g3mh80056qn0kjtbtsd4z	UNNAT	DIGAL	8763131397	\N	BHUBANESWAR	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:13.004	2026-02-02 17:30:13.004	\N	Scorpio N	DIGITAL
cml5g3ncz0058qn0kviodge8v	LORESH	BAG	8093345683	\N	NILADARI VIHAR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:14.148	2026-02-02 17:30:14.148	\N	XUV 7XO	DIGITAL
cml5g3oz2005cqn0ko8jc3lye	KIRTI		7004192891	\N	SAILASHREE VIHAR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:16.238	2026-02-02 17:30:16.238	\N	XUV 7XO	DIGITAL
cml5g3rfj005iqn0kalcx4i1k	ANJAN	CHOUDHRY	9040469921	\N	ATHAGARH	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:19.424	2026-02-02 17:30:19.424	\N	XUV 7XO	DIGITAL
cmkwajsn400e3ns0kddvq5lsh	DHARMENDRA	MEHER	9668512833	\N	KALAHANDI	Enquiry from 1/27/2026	cold	\N	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:44:54.208	2026-01-27 07:44:54.208	\N	\N	\N
cml5g3klm0052qn0kihhb6qne	ASHOK	SAHOO	7381231122	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:10.57	2026-02-02 17:30:10.57	\N	XUV 7XO	DIGITAL
cml5g3ldx0054qn0ke1aawrqz	PRATUSH	KUMAR	9590349590	\N	SHREEVIHAR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:11.589	2026-02-02 17:30:11.589	\N	XUV 7XO	DIGITAL
cml5g3o4z005aqn0k6bt7x8b2	Siba	Santosh khuntia	9937056700	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:15.156	2026-02-02 17:30:15.156	\N	XUV 7XO	DIGITAL
cml5g3pq0005eqn0k3zo0i940	Piyush	Mohanty	9437178405	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:17.208	2026-02-02 17:30:17.208	\N	XUV 7XO	DIGITAL
cml5g3qhe005gqn0k9p2wfzum	Abhishek	Tripathy	8260241245	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:18.194	2026-02-02 17:30:18.194	\N	XUV 7XO	DIGITAL
cml5g3sb9005kqn0kirun5vjg	KULAMANI	SAHOO	7846806378	\N	ANGUL	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:20.565	2026-02-02 17:30:20.565	\N	XUV 7XO	DIGITAL
cml5g3tb6005mqn0k1do0aqc5	Sunil	Saw	7004436678	\N	ANDHARI	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:21.858	2026-02-02 17:30:21.858	\N	XUV 7XO	DIGITAL
cml5g3ucn005oqn0kkmgtftet	Somya	Ranjan Pani	9692191921	\N	BHANJANAGAR	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:23.207	2026-02-02 17:30:23.207	\N	THAR ROXX	DIGITAL
cml5g3xkb005uqn0kzpbbikg5	SANU	NAYAK	8371331689	\N	ATHAGARH	Scorpio Classic	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:27.371	2026-02-02 17:30:27.371	\N	Scorpio Classic	DIGITAL
cml5g40ez0060qn0kznkbrl0w	SUBHAYAN	DAS	9040097731	\N	PATIA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:31.067	2026-02-02 17:30:31.067	\N	XUV 3XO	DIGITAL
cml5g41pj0062qn0kzl52kfq0	Keshab	Kumar	9938242024	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:32.743	2026-02-02 17:30:32.743	\N	XUV 7XO	DIGITAL
cml5g42dk0064qn0k0o5jgoav	SANKAR	SAHOO	6372528491	\N	DHENKANAL	Bolero	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:33.608	2026-02-02 17:30:33.608	\N	Bolero	DIGITAL
cml5g44mr0068qn0kamejoztc	DEEPAK	KUMAR SAHOO	7978414849	\N	ANUGUL	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:36.532	2026-02-02 17:30:36.532	\N	Scorpio N	DIGITAL
cml5g46eh006cqn0k2s8wza1k	BISWA	PRAKASH SAHOO	7008933590	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:38.825	2026-02-02 17:30:38.825	\N	XUV 7XO	DIGITAL
cml5g4850006gqn0kuco4948i	SOUMYA	RANJAN NAYAK	7653985140	\N	PATIA	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:41.076	2026-02-02 17:30:41.076	\N	THAR ROXX	DIGITAL
cml5g4ayz006mqn0kjgltxqwn	KUNAL	MEHROTRI	9900060736	\N	BANGLORE	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:44.748	2026-02-02 17:30:44.748	\N	XUV 7XO	DIGITAL
cml5g4bsx006oqn0k79h6qujt	BIBEK	KUMAR BEY	8249788895	\N	PATIA	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:45.826	2026-02-02 17:30:45.826	\N	Scorpio N	DIGITAL
cml5g4cp4006qqn0klgpz7bkr	SURAJ	MOHAPTRA	8926347775	\N	DHENKANAL	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:46.985	2026-02-02 17:30:46.985	\N	XUV 7XO	DIGITAL
cml5g4dil006sqn0kegzxh03h	KULDEEP	MOHANTY	7978416852	\N	BBSR	Bolero	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:48.045	2026-02-02 17:30:48.045	\N	Bolero	DIGITAL
cml5g4eo0006uqn0kk68lwgak	PRASANT	NAIK	8686879292	\N	ANUGUL	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:49.537	2026-02-02 17:30:49.537	\N	XUV 3XO	DIGITAL
cml5g4fmo006wqn0kmkjgkfzv	TRILOCHAN	PRADHAN	7205826515	\N	ANUGUL	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:50.784	2026-02-02 17:30:50.784	\N	Bolero Neo	DIGITAL
cml5g4gvh006yqn0ky2jwd42m	MANI	SINGH	7070903126	\N	C S PUR	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:52.398	2026-02-02 17:30:52.398	\N	THAR	DIGITAL
cml5g4jpt0074qn0k0rvqrrt7	NISAL	SURYAJIT	7735773911	\N	DAMANA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:56.081	2026-02-02 17:30:56.081	\N	XUV 7XO	DIGITAL
cml5g4mfu007aqn0kokdggig0	NIRANJAN	SAHOO	9337409842	\N	KIIT	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:59.611	2026-02-02 17:30:59.611	\N	XUV 3XO	DIGITAL
cml5g4pd6007gqn0kghgdzme2	RAJAN	KAPOOR	7749947743	\N	RAGHUNATHPUR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:03.402	2026-02-02 17:31:03.402	\N	XUV 7XO	DIGITAL
cml5g4q8l007iqn0krkgxgos9	NIRANJAN	BEHERA	7608985423	\N	ANUGUL	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:04.533	2026-02-02 17:31:04.533	\N	Bolero Neo	DIGITAL
cml5g4uxg007sqn0kmfbxixsf	SOURAV	ROUT	9983143338	\N	CS PUR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:10.612	2026-02-02 17:31:10.612	\N	XUV 3XO	DIGITAL
cml5g4wmr007wqn0kbghbmu44	KANHA	MAHARANA	7978903981	\N	ANUGUL	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:12.819	2026-02-02 17:31:12.819	\N	XUV 7XO	DIGITAL
cml5g4yqq0080qn0kekqi06qk	SAFAT	ALI	9937162058	\N	CS PUR	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:15.554	2026-02-02 17:31:15.554	\N	THAR ROXX	DIGITAL
cml5g4zs60082qn0k0pyzxc3i	GURINDER	SANDHU	9815738117	\N	CHANDIGARH	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:16.902	2026-02-02 17:31:16.902	\N	THAR	DIGITAL
cml5g50mz0084qn0k9tyby2h7	Rachit	Mohanty	9078038832	\N	Kalarahanga	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:18.012	2026-02-02 17:31:18.012	\N	XUV 7XO	DIGITAL
cml5g3vkl005qqn0k8skzf9ua	RAJESH	JENA	7008878208	\N	ANGUL	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:24.789	2026-02-02 17:30:24.789	\N	XUV 3XO	DIGITAL
cml5g3wer005sqn0kyun4g6yh	DEEPAK	KUMAR SAHOO	7077823223	\N	PATIA	Bolero	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:25.876	2026-02-02 17:30:25.876	\N	Bolero	DIGITAL
cml5g3yd7005wqn0kkpixer96	Sanjaya	Maharana	9853158843	\N	DHENKANAL	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:28.411	2026-02-02 17:30:28.411	\N	XUV 7XO	DIGITAL
cml5g3z4p005yqn0k43idxnqb	P	PANDA	9620080002	\N	NANDAN BIHAR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:29.402	2026-02-02 17:30:29.402	\N	XUV 7XO	DIGITAL
cml5g43ob0066qn0ku9n6vvkw	BAPUN	KUMAR PRADHAN	8895134886	\N	BANGLORE	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:35.292	2026-02-02 17:30:35.292	\N	XUV 3XO	DIGITAL
cml5g45jz006aqn0klplqaufj	AMITOSH	PATRA	7377519434	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:37.727	2026-02-02 17:30:37.727	\N	XUV 7XO	DIGITAL
cml5g47am006eqn0kaiz45lii	LYHAANOSH	SEKHAR JENA	8456041510	\N	SAILASHREE VIHAR	Scorpio Classic	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:39.982	2026-02-02 17:30:39.982	\N	Scorpio Classic	DIGITAL
cml5g4915006iqn0ku3i2bjtz	PRIYANSHU	GUPTA	8018522808	\N	INFOCITY	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:42.234	2026-02-02 17:30:42.234	\N	XUV 3XO	DIGITAL
cml5g49zc006kqn0k33yig1f5	RAKESH	MOHANTY	9337321941	\N	C S PUR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:43.465	2026-02-02 17:30:43.465	\N	XUV 7XO	DIGITAL
cml5g4hxr0070qn0kaz2y5qgg	D	Pattnaik	8249913131	\N	Bangalore	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:53.775	2026-02-02 17:30:53.775	\N	XUV 7XO	DIGITAL
cml5g4ivl0072qn0kjjm3us7s	RANJIT	DASH	9937764535	\N	DAMANA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:54.993	2026-02-02 17:30:54.993	\N	XUV 3XO	DIGITAL
cml5g4kj10076qn0k88n4rahi	CHANDAN	KUMAR DANGA	9668015459	\N	ANUGUL	Scorpio Classic	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:57.134	2026-02-02 17:30:57.134	\N	Scorpio Classic	DIGITAL
cml5g4lkb0078qn0k5fbsvt97	PAPU	SAMAL	7008116038	\N	ANUGUL	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:30:58.476	2026-02-02 17:30:58.476	\N	THAR	DIGITAL
cml5g4ncr007cqn0k4b1awcvi	SAHIL	RAJ PATRA	8327701274	\N	PATIA	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:00.795	2026-02-02 17:31:00.795	\N	THAR ROXX	DIGITAL
cml5g4oa4007eqn0kgbm8luch	SAMAYA	MOHAPATRA	7008377115	\N	PATIA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:01.997	2026-02-02 17:31:01.997	\N	XUV 3XO	DIGITAL
cml5g4rce007kqn0klspnixhb	.	SUNIL	8249948425	\N	BBSR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:05.967	2026-02-02 17:31:05.967	\N	XUV 7XO	DIGITAL
cml5g4s8m007mqn0k7ek9m4x3	PRASANT	DAS	9900623836	\N	ROURKELA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:07.126	2026-02-02 17:31:07.126	\N	XUV 7XO	DIGITAL
cml5g4t24007oqn0kfzhnwyzu	subah	bal	6370160768	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:08.188	2026-02-02 17:31:08.188	\N	XUV 7XO	DIGITAL
cml5g4tzi007qqn0kh7ubwwwm	BIKASH	MOHAPATRA	9827553651	\N	ANUGUL	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:09.39	2026-02-02 17:31:09.39	\N	Bolero Neo	DIGITAL
cml5g4vqd007uqn0kt7qwoxq0	AKASH	KUMAR	6370114844	\N	KIIT	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:11.653	2026-02-02 17:31:11.653	\N	XUV 7XO	DIGITAL
cml5g4xgk007yqn0kq9h6g6rb	Santoshkumar	Routray	9777791033	\N	BARANG	Scorpio Classic	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:13.892	2026-02-02 17:31:13.892	\N	Scorpio Classic	DIGITAL
cml5g51ga0086qn0kxu4zwauw	SAMBIT	BEHERA	9861480344	\N	PATIA	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:19.066	2026-02-02 17:31:19.066	\N	THAR ROXX	DIGITAL
cml5g527r0088qn0kkgpd2l6d	ATUL	SINGH	8249017971	\N	BANGLORE	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:20.055	2026-02-02 17:31:20.055	\N	THAR ROXX	DIGITAL
cml5g531g008aqn0k02o1toj9	RISAB	KUMAR SAHOO	7978933563	\N	KORAPUT	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:21.124	2026-02-02 17:31:21.124	\N	XUV 7XO	DIGITAL
cml5g5436008cqn0kjfhiucax	M	K SAHOO	9438008595	\N	TALCHER	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:22.482	2026-02-02 17:31:22.482	\N	XUV 3XO	DIGITAL
cml5g57ft008kqn0kurbskhgj	RAHUL	AGARWAL	9778924765	\N	RAGHUNATHPUR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:26.826	2026-02-02 17:31:26.826	\N	XUV 7XO	DIGITAL
cml5g58dz008mqn0k8grtala8	MAYANK	RAY	6263854838	\N	PATIA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:28.056	2026-02-02 17:31:28.056	\N	XUV 3XO	DIGITAL
cml5g5czl008wqn0kekxkne7u	SASWAT	SINGH	9078313413	\N	C S PUR	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:34.018	2026-02-02 17:31:34.018	\N	Scorpio N	DIGITAL
cml5g5fnx0092qn0k1oprxb0e	SRABAN	SUBHUDHI	9692599058	\N	NANDANKANANA ROAD	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:37.485	2026-02-02 17:31:37.485	\N	XUV 7XO	DIGITAL
cmkzgsmu20015me0k77mzjy2d	Deepak	tamal	9938474882	\N	KUJANGA	Scorpio Classic	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:02.811	2026-01-29 13:03:02.811	\N	\N	\N
cmkzgsok60017me0k1u4q6tdm	BIJAY	KUMAR	9776670666	\N	CUTTACK	Scorpio Classic	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:05.046	2026-01-29 13:03:05.046	\N	\N	\N
cmkzgspkw0019me0k51t7gke1	Babul	Sahoo	7749033378	\N	PARADEEP	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:06.368	2026-01-29 13:03:06.368	\N	\N	\N
cmkzgsqhw001bme0klhox4kon	SURYAKANTA	PARIDA	7326844817	\N	CUTTACK	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:07.557	2026-01-29 13:03:07.557	\N	\N	\N
cmkzgsrav001dme0kv8stk4zi	HIMANSHU	NAYAK	9692277687	\N	BHADRAK	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:08.599	2026-01-29 13:03:08.599	\N	\N	\N
cmkzgsskw001fme0k5ulk6xop	Tripura	Behera	9439975946	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:10.256	2026-01-29 13:03:10.256	\N	\N	\N
cmkzgsthw001hme0kj0iuls15	SATYABRATA	JENA	9040230220	\N	KENDRAPARA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:11.444	2026-01-29 13:03:11.444	\N	\N	\N
cmkzgsunc001jme0kx4a6fozn	PRASANTA	NATH	8338837898	\N	PARADEEP	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:12.936	2026-01-29 13:03:12.936	\N	\N	\N
cmkzgsvg3001lme0kj2pryfd6	Swapna	panigrahi	7847858104	\N	CHOUDWAR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:13.972	2026-01-29 13:03:13.972	\N	\N	\N
cmkzgswi9001nme0ky9o6txfr	HRUSIKESH	POHAN	8455929847	\N	CTC	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:15.345	2026-01-29 13:03:15.345	\N	\N	\N
cmkzgsxa1001pme0kq2pccem2	BICHITRANANDA	MOHAPATRA	7873531556	\N	BHADRAK	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:16.346	2026-01-29 13:03:16.346	\N	\N	\N
cmkzgsyba001rme0kcjfgt85k	HIMANSHU	KUMAR SAHOO	8984375328	\N	SORO	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:17.686	2026-01-29 13:03:17.686	\N	\N	\N
cmkzgsz7n001tme0ks59vbu20	Dambarudhar	Patra	8908913282	\N	DHENKANAL	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:18.851	2026-01-29 13:03:18.851	\N	\N	\N
cmkzgt04q001vme0kmlrlpgql	SUBHAKANT	ROUT	6372989580	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:20.042	2026-01-29 13:03:20.042	\N	\N	\N
cmkzgt0z3001xme0kdhpba4du	Pratyush	Nayak	7008196035	\N	CDA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:21.135	2026-01-29 13:03:21.135	\N	\N	\N
cmkzgt23g001zme0kg22dcq3a	SATYA	RANJAN PANI	9178095421	\N	JAJPUR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:22.588	2026-01-29 13:03:22.588	\N	\N	\N
cmkzgt2yx0021me0kziccfnjp	SUDIPTA	ROUT	9861329676	\N	JAJPUR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:23.722	2026-01-29 13:03:23.722	\N	\N	\N
cmkzgt3qk0023me0k7bvbbkyk	SUBHAM	BARIK	9440588832	\N	BHADRAK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:24.716	2026-01-29 13:03:24.716	\N	\N	\N
cmkzgt4j30025me0knl81ru39	SUVENDU	PARIDA	9938265110	\N	KENDRAPARA	SCORPIO CLASSIC	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:25.743	2026-01-29 13:03:25.743	\N	\N	\N
cmkzgt5ol0027me0k9buwzwmf	SAM		7978644846	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:27.237	2026-01-29 13:03:27.237	\N	\N	\N
cmkzgt6j60029me0ks5grsvor	ISHWAR	MURMUR	9124641993	\N	PARADEEP	Bolero	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:28.338	2026-01-29 13:03:28.338	\N	\N	\N
cmkzgt7jv002bme0kw2n6022g	MALAYA	RANJAN SWAIN	7077058110	\N	JAJPUR	Bolero	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:29.659	2026-01-29 13:03:29.659	\N	\N	\N
cmkzgt8x7002dme0kp02d5izu	ROHIT	DAS	8118034180	\N	CHOUDWAR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:31.436	2026-01-29 13:03:31.436	\N	\N	\N
cmkzgt9sw002fme0kfvw2xf4z	HARAPRASAD	ROUL	7008941463	\N	CHATIA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:32.577	2026-01-29 13:03:32.577	\N	\N	\N
cmkzgtal1002hme0k5pw4t1m5	TARINI	PRASAD SAHOO	9861737455	\N	CHOUDWAR	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:33.59	2026-01-29 13:03:33.59	\N	\N	\N
cmkzgtbmq002jme0kfoz5mk8l	Pitabash	Padhiary	7327036363	\N	BALESWAR	SCORPIO CLASSIC	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:34.946	2026-01-29 13:03:34.946	\N	\N	\N
cmkzgtcet002lme0kv12t6oo2	Pratyush	Nayak	7008196035	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:35.958	2026-01-29 13:03:35.958	\N	\N	\N
cmkzgtdbf002nme0kd0db5m0q	Shibananda	Mandal	7328055242	\N	KENDRAPARA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:37.131	2026-01-29 13:03:37.131	\N	\N	\N
cmkzgteav002pme0kp1vn8e4c	ASISH	MALLIK	6371105986	\N	KENDRAPARA	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:38.407	2026-01-29 13:03:38.407	\N	\N	\N
cmkzgtf9w002rme0kpn994ekg	JIBANJYOTI	SAHOO	7815069123	\N	CUTTACK	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:39.669	2026-01-29 13:03:39.669	\N	\N	\N
cmkzgtgbg002tme0ktxfsl0lf	SUBHRAJYOTI	SAHOO	9090602961	\N	DHENKANAL	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:41.02	2026-01-29 13:03:41.02	\N	\N	\N
cmkzgth87002vme0kfm2c1b58	ADITYA	JENA	7787081937	\N	CHANDIKHOL	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:42.199	2026-01-29 13:03:42.199	\N	\N	\N
cmkzgthyd002xme0kozb3d8np	SUBHANKAR	SHA	7681097161	\N	BHADRAK	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:43.142	2026-01-29 13:03:43.142	\N	\N	\N
cmkzgtj0t002zme0kbmbw9bzx	SRIKANT	KUMAR SAHOO	9861214133	\N	BHADRAK	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:44.525	2026-01-29 13:03:44.525	\N	\N	\N
cmkzgtk5t0031me0ky94t9az4	AMAN	DEEP BOSE	9040408684	\N	CUTTACK	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:46.002	2026-01-29 13:03:46.002	\N	\N	\N
cmkzgtl090033me0krc49xs2v	BISWARANJAN	PARIDA	8144533247	\N	JAJPUR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:47.097	2026-01-29 13:03:47.097	\N	\N	\N
cmkzgtlym0035me0k42syrako	Suraj	Kumar Behera	9124024598	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:48.334	2026-01-29 13:03:48.334	\N	\N	\N
cmkzgtmqh0037me0k97ksmt33	Er	Abdul Kalam	8917393119	\N	JAJPUR	SCORPIO CLASSIC	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:49.337	2026-01-29 13:03:49.337	\N	\N	\N
cmkzgtnma0039me0k8g8k2vpe	Deepak	Raj	9861216609	\N	CUTTACK	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:50.482	2026-01-29 13:03:50.482	\N	\N	\N
cmkzgtofy003bme0kr7j0qmqi	Pratyush	Baral	9078852296	\N	JAGATSING PUR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:51.55	2026-01-29 13:03:51.55	\N	\N	\N
cmkzgtp5f003dme0kx2dqc1t4	DIBYANSHU	BARIK	8984499292	\N	CDA SEC 9	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:52.467	2026-01-29 13:03:52.467	\N	\N	\N
cmkzgtpzp003fme0kub09kp5r	ROSHAN	KUMAR	7609810700	\N	CUTTACK	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:53.557	2026-01-29 13:03:53.557	\N	\N	\N
cmkzgtqvp003hme0kqzip75ws	Santoshini	Jena	8249753538	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:54.709	2026-01-29 13:03:54.709	\N	\N	\N
cmkzgtrud003jme0ksogf09h8	Hrushikesh	Behera	7978502794	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:55.957	2026-01-29 13:03:55.957	\N	\N	\N
cmkzgtsok003lme0kkpt2bszi	DEB	PRASAD DAS	9114579012	\N	KENDRAPARA	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:57.044	2026-01-29 13:03:57.044	\N	\N	\N
cmkzgtvba003rme0k5fqyny7t	Jyotikant	Tripathy	8260742149	\N	ATHAGARH	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:00.455	2026-01-29 13:04:00.455	\N	\N	\N
cmkzgtwat003tme0k2xrouxj3	SUBHAKANTA	NAYAK	9016978451	\N	CHANDIKHOL	Bolero	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:01.733	2026-01-29 13:04:01.733	\N	\N	\N
cmkzgtxye003xme0kk817x38f	SOURAV	SAHOO	7684894555	\N	KENDRAPARA	Bolero	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:03.879	2026-01-29 13:04:03.879	\N	\N	\N
cmkzgu1450045me0kts799s9i	Srikalp	Singh	9583138844	\N	CDA SEC-10	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:07.973	2026-01-29 13:04:07.973	\N	\N	\N
cmkzgu2mt0049me0k1fv4uzow	Charls	pattanayak	9438702687	\N	KUJANGA	SCORPIO CLASSIC	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:09.941	2026-01-29 13:04:09.941	\N	\N	\N
cmkzgu4ij004dme0khofneqvd	MANORANJAN	BISWAL	9556238924	\N	KAKATPUR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:12.379	2026-01-29 13:04:12.379	\N	\N	\N
cmkzgu65j004hme0kucl4rhdn	Abinash	Parida	7735567629	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:14.503	2026-01-29 13:04:14.503	\N	\N	\N
cmkzgu892004lme0k5lzkw9pb	ADITYA	SAHOO	9090906067	\N	CHANDIKHOL	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:17.223	2026-01-29 13:04:17.223	\N	\N	\N
cmkzgu911004nme0kuhd0ppup	Ansari	Majhi	8144074301	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:18.229	2026-01-29 13:04:18.229	\N	\N	\N
cmkzgu9zg004pme0kl8yj67o3	TARAKANTA	PANDA	8917546454	\N	JAGATSINGPUR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:19.469	2026-01-29 13:04:19.469	\N	\N	\N
cmkzguav5004rme0kklx5sa1n	PRATAP	SWAIN	9437673897	\N	CTC	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:20.609	2026-01-29 13:04:20.609	\N	\N	\N
cmkzgubp8004tme0kkqc20uzu	RAHUL	DAS	9021164298	\N	KENDRAPARA	SCORPIO CLASSIC	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:21.692	2026-01-29 13:04:21.692	\N	\N	\N
cmkzguch1004vme0ks0m7hds3	PRADIP	KUMAR MISHRA	9937241730	\N	DHENKANAL	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:22.694	2026-01-29 13:04:22.694	\N	\N	\N
cmkzgue96004zme0k37grym8d	DINESH	KUMAR BEHERA	7978882944	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:25.002	2026-01-29 13:04:25.002	\N	\N	\N
cmkzguh5q0055me0kuylpoxyv	vinod	behera	7377874862	\N	SALIPUR	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:28.766	2026-01-29 13:04:28.766	\N	\N	\N
cmkzguk9z005bme0k93lde77f	RAJESH	KUMAR SWAIN	9776670094	\N	JAJPUR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:32.808	2026-01-29 13:04:32.808	\N	\N	\N
cmkzgun7h005hme0kjlgd81w2	SANJAY	SAHOO	8908726771	\N	SEC 6	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:36.605	2026-01-29 13:04:36.605	\N	\N	\N
cmkzguo5s005jme0kg14rvsuk	AJAR	UDIN KHAN	9337121621	\N	CHANDIKHOL	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:37.841	2026-01-29 13:04:37.841	\N	\N	\N
cmkzgupso005nme0km3j44f22	Sasendukumar	Patra	9938422201	\N	LINK ROAD	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:39.961	2026-01-29 13:04:39.961	\N	\N	\N
cmkzgusmf005tme0kfp8leed0	Prakash	Kumar BEHERA	9437106610	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:43.623	2026-01-29 13:04:43.623	\N	\N	\N
cmkzgutp3005vme0kk4jp99c3	Ashok	Kumar Das	8280479629	\N	CTC	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:45.016	2026-01-29 13:04:45.016	\N	\N	\N
cmkzguugs005xme0k9eeq6zdx	Naseeb	Azad	8260567573	\N	DHENKANAL	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:46.012	2026-01-29 13:04:46.012	\N	\N	\N
cmkzguvci005zme0k1ll1l9su	SK	ASAR ALI	7749091781	\N	JAGATSINGHPUR	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:47.154	2026-01-29 13:04:47.154	\N	\N	\N
cmkzguyq40067me0kextt85ik	JOURNALIST	TARUN DASH	7008789709	\N	BARIPADA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:51.532	2026-01-29 13:04:51.532	\N	\N	\N
cmkzguzo30069me0kz4mt74pp	RAKESH	BIHARI	7653011501	\N	JAJPUR ROAD	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:52.755	2026-01-29 13:04:52.755	\N	\N	\N
cmkzgv0xi006bme0khakiz7pg	K	SIBRAM	8908755817	\N	CDA SEC-13	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:54.39	2026-01-29 13:04:54.39	\N	\N	\N
cml5g54wu008eqn0k2vzwc3na	SANDIP	SUBHANKAR	7008021223	\N	C S PUR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:23.55	2026-02-02 17:31:23.55	\N	XUV 7XO	DIGITAL
cml5g55sp008gqn0kk7r6ck1k	TAPAN	GIRI	8093044901	\N	RAGHUNATHPUR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:24.697	2026-02-02 17:31:24.697	\N	XUV 3XO	DIGITAL
cml5g56mz008iqn0km3nbss7s	YASYITA	RAJ SARANGI	8637252268	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:25.787	2026-02-02 17:31:25.787	\N	XUV 7XO	DIGITAL
cml5g59ad008oqn0kjh8o1h5x	SHREYANSH	NAYAK	9777548266	\N	PATIA	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:29.221	2026-02-02 17:31:29.221	\N	XUV 7XO	DIGITAL
cml5g5ad6008qqn0kjvmkum84	SAGAR	BISWAL	8144162237	\N	RAGHUNATHPUR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:30.618	2026-02-02 17:31:30.618	\N	XUV 3XO	DIGITAL
cml5g5b5a008sqn0kbek54nah	SAROJ	KUMAR MOHANTY	7008216386	\N	CS PUR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:31.631	2026-02-02 17:31:31.631	\N	XUV 3XO	DIGITAL
cml5g5c46008uqn0ksur7fpe5	SOMYA	RANJAN SWAIN	9372804525	\N	PATIA	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:32.886	2026-02-02 17:31:32.886	\N	XUV 3XO	DIGITAL
cml5g5dto008yqn0kj3tey4gm	MANISHA	SAHU	9827696490	\N	NILADARI VIHAR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:35.101	2026-02-02 17:31:35.101	\N	XUV 7XO	DIGITAL
cml5g5ep90090qn0k2hfzj4wt	PRADYUMNA	SAHOO	7847090115	\N	INFOCITY	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-02 17:31:36.237	2026-02-02 17:31:36.237	\N	XUV 3XO	DIGITAL
cmkzgtthq003nme0kyvka4d5y	Biswajit	Mohanty	9778313982	\N	CUTTACK	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:58.095	2026-01-29 13:03:58.095	\N	\N	\N
cmkzgtue9003pme0kwrxwkl4h	FAMSAD	KHAN	9776146786	\N	BALESWAR	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:03:59.265	2026-01-29 13:03:59.265	\N	\N	\N
cmkzgtx5w003vme0kgidvws3q	Tanweer	Alam	8709612729	\N	PARADEEP	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:02.852	2026-01-29 13:04:02.852	\N	\N	\N
cmkzgtyqu003zme0kxganbvn6	Dibakar	Panigrahi	9556302849	\N	CHOUDWAR	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:04.902	2026-01-29 13:04:04.902	\N	\N	\N
cmkzgtzha0041me0k5k5ryq5t	MOHAMMED	SAFE	9348000174	\N	SALEPUR	SCORPIO CLASSIC	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:05.854	2026-01-29 13:04:05.854	\N	\N	\N
cmkzgu0d10043me0kl8wtkx54	PRITAM	NAYAK	8114853467	\N	DHENKANAL	Bolero	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:06.998	2026-01-29 13:04:06.998	\N	\N	\N
cmkzgu1q20047me0kay64ya2d	SAI	PRASAD	7978038756	\N	CTC	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:08.762	2026-01-29 13:04:08.762	\N	\N	\N
cmkzgu3re004bme0kdzh2ohq2	Prakash	Kumar Swain	9040045723	\N	CUTTACK	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:11.402	2026-01-29 13:04:11.402	\N	\N	\N
cmkzgu59m004fme0kzcz69bh4	RANJAN	KUMAR PARIDA	9439814993	\N	CUTTACK	SCORPIO CLASSIC	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:13.355	2026-01-29 13:04:13.355	\N	\N	\N
cmkzgu7fa004jme0k2zinrcgo	Saswat	Samal	9861181070	\N	CUTTACK	THAR ROXX	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:16.15	2026-01-29 13:04:16.15	\N	\N	\N
cmkzgudci004xme0kctjj9jsi	Laxman	Kumar Mohanty	9566148206	\N	JAJPUR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:23.826	2026-01-29 13:04:23.826	\N	\N	\N
cmkzguf7i0051me0klw798qvn	NIGAM	SING	9178931108	\N	PARADEEP	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:26.238	2026-01-29 13:04:26.238	\N	\N	\N
cmkzgug7r0053me0krlp89m9c	SANTU	GUPTA	9437248325	\N	DHENKANAL	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:27.544	2026-01-29 13:04:27.544	\N	\N	\N
cmkzguia70057me0kjmwtvt8j	MANORANJAN	BEHERA	9437447359	\N	PARADEEP	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:30.224	2026-01-29 13:04:30.224	\N	\N	\N
cmkzgujei0059me0k16j3iown	PREMANADH	NAYAK	9938503648	\N	JAGATSINGPUR	Bolero	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:31.674	2026-01-29 13:04:31.674	\N	\N	\N
cmkzgul65005dme0kec780zu1	FAKIR	CHARAN NAYAK	9437432724	\N	KAKATPUR	XUV 7XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:33.966	2026-01-29 13:04:33.966	\N	\N	\N
cmkzgulz6005fme0kyu2sx391	MahboobKhan	.	9337385252	\N	CUTTACK	SCORPIO CLASSIC	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:35.011	2026-01-29 13:04:35.011	\N	\N	\N
cmkzguoxd005lme0kxfqffu4z	TRUPTI	RANJAN SINGH	9124030172	\N	BIDANASI	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:38.833	2026-01-29 13:04:38.833	\N	\N	\N
cmkzguqs4005pme0k8htnokrt	Rakesh	Singh	7894208253	\N	JAGATSINGHPUR	THAR	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:41.236	2026-01-29 13:04:41.236	\N	\N	\N
cmkzgurpn005rme0kdgentfey	KARIM	Mahmad	8895300653	\N	CUTTACK	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:42.443	2026-01-29 13:04:42.443	\N	\N	\N
cmkzguw4h0061me0kq4jqo5ik	Sano	Jyoti Prakash	8249388910	\N	NUA BAZAR	XUV 3XO	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:48.162	2026-01-29 13:04:48.162	\N	\N	\N
cmkzguwxw0063me0k0bfyzlxi	ABHISEK	KUMAR	7853985816	\N	JAJPUR	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:49.221	2026-01-29 13:04:49.221	\N	\N	\N
cmkzguxxs0065me0kf63d5l8y	SIBA	NANDA PADHI	8637231604	\N	JAJPUR	Scorpio N	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:50.513	2026-01-29 13:04:50.513	\N	\N	\N
cmkzgv238006dme0ktkepfqvc	SEKH	JAHUR	7609805668	\N	CUTTACK	Bolero Neo	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-29 13:04:55.892	2026-01-29 13:04:55.892	\N	\N	\N
cml69p8ij009xqn0ksfxrxe4f	ABHILASH	PANDA	9090090150	\N	BHUBANESWAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-03 07:18:50.203	2026-02-03 07:18:50.203	\N	BE 6	DIGITAL
cml0i5efv000bpo0kbc5b5i0k	AJIT	KUMAR KAR	9438505592	\N	KHORDHA	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:44.252	2026-01-30 06:28:44.252	\N	\N	\N
cml0i5g1g000dpo0ki9yfe05f	Dr	Sangram Keshari Swain	9437493949	\N	RASULGARH	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:46.325	2026-01-30 06:28:46.325	\N	\N	\N
cml0i5gxg000fpo0kgns0ucji	PRABIN	SAHOO	9828272756	\N	SUNDARPADA	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:47.476	2026-01-30 06:28:47.476	\N	\N	\N
cml0i5hzi000hpo0k9c0uqcl1	BINAYA	KUMAR SAHOO	8260310290	\N	ANUGUL	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:48.846	2026-01-30 06:28:48.846	\N	\N	\N
cml0i5j3n000jpo0ka17fx0ce	Atulya	Suhula	8763821158	\N	KALINGA NAGAR	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:50.291	2026-01-30 06:28:50.291	\N	\N	\N
cml0i5k0v000lpo0k3vesh0r1	Jalaj	kumar singh	9777443108	\N	ANUGUL	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:51.487	2026-01-30 06:28:51.487	\N	\N	\N
cml0i5l5z000npo0k3gdrcw77	Maruti	Nandan Pattanayak	9124541429	\N	PATRAPADA	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:52.967	2026-01-30 06:28:52.967	\N	\N	\N
cml0i5m5k000ppo0k8t4saj8t	SHRIASHRIT	KUMAR	9040000286	\N	RASULGARH	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:54.248	2026-01-30 06:28:54.248	\N	\N	\N
cml0i5ned000rpo0kcbw1wxu6	Biswajit	Samal	9437541111	\N	SUM HOSPITAL	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:55.861	2026-01-30 06:28:55.861	\N	\N	\N
cml0i5ohq000tpo0ku34baar0	BIJAY	KUMAR	9777775589	\N	RASULGARH	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:57.278	2026-01-30 06:28:57.278	\N	\N	\N
cml0i5pfb000vpo0kwkfosj7b	Aditya	Gupta	8260747833	\N	BHUBANESWAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:58.487	2026-01-30 06:28:58.487	\N	\N	\N
cml0i5qi7000xpo0k6tnn3hsf	BINOD	KUMAR DAS	7008564045	\N	JATANI	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:28:59.888	2026-01-30 06:28:59.888	\N	\N	\N
cml0i5rhq000zpo0krle7keud	PRADEEP	KUMAR BEHERA	8328802350	\N	BHUBANESWAR	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:01.167	2026-01-30 06:29:01.167	\N	\N	\N
cml0i5sfp0011po0k2ro3gqdl	ASISH	RATHI	7987524400	\N	BHUBANESWAR	XEV 9E	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:02.389	2026-01-30 06:29:02.389	\N	\N	\N
cml0i5tdd0013po0kkhleoc2d	Chandan	Dash	8984731642	\N	BHUBANESWAR	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:03.602	2026-01-30 06:29:03.602	\N	\N	\N
cml0i5ugu0015po0kj9i3efgv	ABHIMANYU	ACHARYA	9437187410	\N	DHENKANAL	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:05.022	2026-01-30 06:29:05.022	\N	\N	\N
cml0i5vg40017po0khjikojrx	SUBHENDU	GHADAI	7008773048	\N	BHADRAK	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:06.293	2026-01-30 06:29:06.293	\N	\N	\N
cml0i60w6001hpo0ko2fohffl	Nageswar	Eppilirao	9438017645	\N	CHHATRAPUR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:13.351	2026-01-30 06:29:13.351	\N	\N	\N
cml0i5woo0019po0kpzn81ewb	Pyari	Mohan Jena	9776939001	\N	Badagarh Brit Colony	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:07.896	2026-01-30 06:29:07.896	\N	\N	\N
cml0i5xqz001bpo0kfygx3v0q	SASWAT	NAYAK	9114811117	\N	BHUBANESWAR	XEV 9E	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:09.275	2026-01-30 06:29:09.275	\N	\N	\N
cml0i5ypi001dpo0k9nic81uw	vishvajit	Sahoo	7077197903	\N	KALPANA	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:10.518	2026-01-30 06:29:10.518	\N	\N	\N
cml0i5zvn001fpo0kae9jglhb	Deepak	Raut	9818765688	\N	BERHAMPUR	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:12.035	2026-01-30 06:29:12.035	\N	\N	\N
cml0i61y1001jpo0kbgm6yl43	SANDEEP		9348721177	\N	PURI	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:14.713	2026-01-30 06:29:14.713	\N	\N	\N
cml0i64oq001ppo0k1ip29o6c	HITESH	NAYAK	8895771618	\N	PATRAPADA	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:18.267	2026-01-30 06:29:18.267	\N	\N	\N
cml0i671f001tpo0k87wotkup	SANGRAM	PATRA	9937069757	\N	CHAKEISIANI	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:21.316	2026-01-30 06:29:21.316	\N	\N	\N
cml0i6a86001zpo0k8mbwm0ae	Preetam	Pattnaik	6371466218	\N	BHUBANESWAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:25.447	2026-01-30 06:29:25.447	\N	\N	\N
cml0i6ea90027po0kcjcnbsid	Deepak	Satapathy	9938668884	\N	BHUBANESWAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:30.706	2026-01-30 06:29:30.706	\N	\N	\N
cml69p9ve009zqn0k3d7t5u3c	JYOTEPRAKASH	SWAIN	9040099131	\N	SAHEED NAGAR	XEV 9E	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-02-03 07:18:51.963	2026-02-03 07:18:51.963	\N	XEV 9E	DIGITAL
cml0i62xq001lpo0kq52elasu	PRUTHIV	RAJ TRIPATHY	9945000861	\N	NAYAPALI	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:15.998	2026-01-30 06:29:15.998	\N	\N	\N
cml0i63sr001npo0kpvbs4g7m	PRATYUSH	LENKA	7381033222	\N	BHUBANESWAR	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:17.115	2026-01-30 06:29:17.115	\N	\N	\N
cml0i65z3001rpo0kdf4f4rc4	DR	ALOK SAHOO	9438884160	\N	KHANDAGIRI	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:19.936	2026-01-30 06:29:19.936	\N	\N	\N
cml0i67yc001vpo0kim4k6y0w	Sailaja	Pattnayak	9938140206	\N	BHUBANESWAR	XEV 9E	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:22.501	2026-01-30 06:29:22.501	\N	\N	\N
cml0i690y001xpo0k4nxeccyr	Arbaz	Khan	7978754285	\N	BHUBANESWAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:23.89	2026-01-30 06:29:23.89	\N	\N	\N
cml0i6baz0021po0kljeuek7o	SAKIB		7855888866	\N	BHUBANESWAR	XEV 9E	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:26.844	2026-01-30 06:29:26.844	\N	\N	\N
cml0i6ccp0023po0kfeqvb98w	J	K Dash	9337442929	\N	PIPILI	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:28.201	2026-01-30 06:29:28.201	\N	\N	\N
cml0i6ddn0025po0kexebm0ir	Tanmay	Panda	8280004411	\N	BHUBANESWAR	XEV 9E	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:29.532	2026-01-30 06:29:29.532	\N	\N	\N
cml0i6f4l0029po0kdkq240wm	SIBA	PRAMANIK	9040199938	\N	BALESWAR	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:31.798	2026-01-30 06:29:31.798	\N	\N	\N
cml0i6g0z002bpo0knnxwz6gd	RAJESH	KUMAR SAHOO	7978280701	\N	ANUGUL	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:32.963	2026-01-30 06:29:32.963	\N	\N	\N
cml0i6h9z002dpo0k0sab5sez	DM	PATI	9667055166	\N	PATIA	XEV 9E	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:34.583	2026-01-30 06:29:34.583	\N	\N	\N
cml0i6i53002fpo0kkf11pmna	GURU	PRASAD DAS	7326863797	\N	AIIMS	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:35.704	2026-01-30 06:29:35.704	\N	\N	\N
cml0i6jcc002hpo0klo3g6odb	Debasish	G	8249167252	\N	BALIPATNA	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:37.248	2026-01-30 06:29:37.248	\N	\N	\N
cml0i6k8z002jpo0kg3tpcaa9	SUBHAM	SAHOO	7205994842	\N	KALINGA NAGAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:38.435	2026-01-30 06:29:38.435	\N	\N	\N
cml0i6lcz002lpo0khrpf22d6	PIYUSH	MODI	8249368659	\N	ROURKELA	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:39.875	2026-01-30 06:29:39.875	\N	\N	\N
cml0i6meh002npo0k80pl6kl3	ABHISEK	DAS	9040094965	\N	BHUBANESWAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:41.225	2026-01-30 06:29:41.225	\N	\N	\N
cml0i6nbg002ppo0kgk3g2ss3	Faisal	Musharraf	8328807551	\N	SATYA BIHAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:42.412	2026-01-30 06:29:42.412	\N	\N	\N
cml0i6o62002rpo0kvidbuxsi	Asutosh	Naik	9778559013	\N	DHENKANAL	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:43.515	2026-01-30 06:29:43.515	\N	\N	\N
cml0i6p2x002tpo0kvamc4wps	ABHAS	KUMAR	8249775119	\N	TALCHER	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:44.698	2026-01-30 06:29:44.698	\N	\N	\N
cml0i6q8r002vpo0k5ifex9ir	BRAJESH	PARIJA	9777662904	\N	VSS NAGAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:46.204	2026-01-30 06:29:46.204	\N	\N	\N
cml0i6rb8002xpo0k9firjxwm	Aakash	Jhunjhunwala	9453554103	\N	SAHEEDNAGAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:47.588	2026-01-30 06:29:47.588	\N	\N	\N
cml0i6sg0002zpo0kxeg1smrw	AMAR	PATTNAIK	9439194459	\N	TANKAPANI ROAD	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:49.056	2026-01-30 06:29:49.056	\N	\N	\N
cml0i6teo0031po0k0dga9rgb	SHAKTIPRASAD		8260364700	\N	BHUBANESWAR	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:50.304	2026-01-30 06:29:50.304	\N	\N	\N
cml0i6uck0033po0ks96wkbv1	DIVYA	SAHOO	8249031088	\N	LAXMI SAGAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:51.524	2026-01-30 06:29:51.524	\N	\N	\N
cml0i6vqe0035po0koswqnayw	ASUTOSH	KUMAR	7008248076	\N	JAYDEV VIHAR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:53.319	2026-01-30 06:29:53.319	\N	\N	\N
cml0i6wn90037po0kpzlh8ox9	Sanjay	Baliarsingh	9853300020	\N	MANCHESWAR	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:54.502	2026-01-30 06:29:54.502	\N	\N	\N
cml0i6xm00039po0ktpv4tuvg	PULKIT		8770166329	\N	CHHATTISGARH	XEV 9E	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:55.752	2026-01-30 06:29:55.752	\N	\N	\N
cml0i6yp1003bpo0kdh871tkq	DEEPAK	CHOUDHURY	9158244744	\N	NAYAPALLI	XEV 9E	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:57.157	2026-01-30 06:29:57.157	\N	\N	\N
cml0i6zr1003dpo0kz0mlwudc	Sipun	kumar Bedi	9777318316	\N	SUNDARPADA	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:58.525	2026-01-30 06:29:58.525	\N	\N	\N
cml0i70s6003fpo0kvdn0ycwn	S	Mishra	9304244111	\N	BHUBANESWAR	XEV 9E	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:29:59.862	2026-01-30 06:29:59.862	\N	\N	\N
cml0i725t003hpo0kol6e7x4e	DEBASIS	BEHURA	9778328744	\N	JAJPUR ROAD	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:01.649	2026-01-30 06:30:01.649	\N	\N	\N
cml0i738d003jpo0km7llhhxt	RAHUL	AGARWAL	8249062347	\N	JHARKHAND	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:03.037	2026-01-30 06:30:03.037	\N	\N	\N
cml0i745w003lpo0kzlov1zpt	RAMESH	AGARWAL	9777771555	\N	PATRAPADA	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:04.244	2026-01-30 06:30:04.244	\N	\N	\N
cml0i74ze003npo0kofavu43p	BINOD	KUMAR	9124744463	\N	IRC VILLAGE	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:05.307	2026-01-30 06:30:05.307	\N	\N	\N
cml0i75yl003ppo0kqp0v8yqk	SUBHAM		9337336266	\N	PATIA	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:06.573	2026-01-30 06:30:06.573	\N	\N	\N
cml0i7718003rpo0k2uxcznp8	KIRSHNA	DALMIA	8895143777	\N	KIIT	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:07.964	2026-01-30 06:30:07.964	\N	\N	\N
cml0i780x003tpo0k2j8p50ud	Sumit	Rathi	9827773805	\N	MANGULI	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:09.249	2026-01-30 06:30:09.249	\N	\N	\N
cml0i78y4003vpo0k8avnw2es	Lalan	Pattnaik	8328958760	\N	GOTHAPATNA	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:10.445	2026-01-30 06:30:10.445	\N	\N	\N
cml0i79w2003xpo0kne8eh6g5	Roshan	Mohapatra	9555508492	\N	BBSR	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:11.667	2026-01-30 06:30:11.667	\N	\N	\N
cml0i7cnt003zpo0kd0oybhnw	Mahebub	alli khan	9438255359	\N	DHENKANAL	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:15.257	2026-01-30 06:30:15.257	\N	\N	\N
cml0i7dno0041po0kenl02jc5	HIMANSHU	SWAIN	7077655889	\N	GUDIAPOKHARI	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:16.549	2026-01-30 06:30:16.549	\N	\N	\N
cml0i7eur0043po0kg9b1g4n1	SRABAN	SUBHUDHI	9845730820	\N	NANDANKANANA ROAD	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:18.099	2026-01-30 06:30:18.099	\N	\N	\N
cml0i7gy20045po0k3x34lag4	Pradeep	Dash	8260142589	\N	TALCHER	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:20.811	2026-01-30 06:30:20.811	\N	\N	\N
cml0i7iol0047po0k1ue6j8wk	MD	AKBAR	7008828651	\N	PIPILI	XEV 9S	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:23.061	2026-01-30 06:30:23.061	\N	\N	\N
cml0i7kqs0049po0kd2xdrg2r	Somanath	subudhi	9861940406	\N	CHILIKA	BE 6	WARM	\N	cmk130qz40000l704z6fc2alp	\N	\N	2026-01-30 06:30:25.733	2026-01-30 06:30:25.733	\N	\N	\N
cml0i8gji004qpo0kw5fga1cu	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 06:31:06.943	2026-01-31 15:06:59.594	\N	\N	\N
cml0i8hh9004spo0kx80w34jb	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 06:31:08.158	2026-01-31 15:06:59.594	\N	\N	\N
cmkr2gb6z00019ydmwc0uv186	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-23 15:59:23.82	2026-01-31 15:06:59.594	\N	\N	\N
cmkr2gehd00039ydmsqwzpf2h	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-23 15:59:28.082	2026-01-31 15:06:59.594	\N	\N	\N
cmkr2gg9j00059ydmse6rkarx	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-23 15:59:30.391	2026-01-31 15:06:59.594	\N	\N	\N
cmkr2gl8900079ydmnlwphe38	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-23 15:59:36.826	2026-01-31 15:06:59.594	\N	\N	\N
cmkr2gmq600099ydmbyulr5z3	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-23 15:59:38.766	2026-01-31 15:06:59.594	\N	\N	\N
cmkr2godp000b9ydmsae1ncx3	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-23 15:59:40.909	2026-01-31 15:06:59.594	\N	\N	\N
cmkr2gq7z000d9ydmz17f7wv1	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-23 15:59:43.295	2026-01-31 15:06:59.594	\N	\N	\N
cmkr2gs3e000f9ydmtkobxhlh	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-23 15:59:45.723	2026-01-31 15:06:59.594	\N	\N	\N
cmkr2gtmt000h9ydmlc2ubwjh	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-23 15:59:47.718	2026-01-31 15:06:59.594	\N	\N	\N
cmkr2gv85000j9ydm88xswjq5	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-23 15:59:49.782	2026-01-31 15:06:59.594	\N	\N	\N
cmkwqfj4o00019yarifxooso7	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 15:09:29.113	2026-01-31 15:06:59.594	\N	\N	\N
cmkwqfnes00039yarb6qd0tjt	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 15:09:34.66	2026-01-31 15:06:59.594	\N	\N	\N
cmkwqfp5a00059yarpgmz4hk6	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 15:09:36.911	2026-01-31 15:06:59.594	\N	\N	\N
cmkwqfqq000079yarrrgvmiqr	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 15:09:38.953	2026-01-31 15:06:59.594	\N	\N	\N
cmkwqfs5b00099yary43h5wsa	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 15:09:40.8	2026-01-31 15:06:59.594	\N	\N	\N
cmkwqfur3000b9yaryifq63l6	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 15:09:44.175	2026-01-31 15:06:59.594	\N	\N	\N
cmkwqfwiy000d9yarpqxhd2v2	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 15:09:46.474	2026-01-31 15:06:59.594	\N	\N	\N
cmkwqfyv4000f9yaroig2vx16	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 15:09:49.505	2026-01-31 15:06:59.594	\N	\N	\N
cmkwqg0kn000h9yarperyuvsp	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 15:09:51.72	2026-01-31 15:06:59.594	\N	\N	\N
cmkwqg29a000j9yarfrze7d5c	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 15:09:53.902	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvjfbn0001r10lwswhtxqc	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:32:28.883	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvjgrw0003r10llglqz8d2	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:32:30.764	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvjhkn0005r10la703pws9	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:32:31.799	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvjifk0007r10l2k8vd5d6	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:32:32.912	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvjjbd0009r10leagotopq	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:32:34.057	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvjk24000br10ljnr8uma7	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:32:35.02	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvjky4000dr10lfe96a4vz	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:32:36.172	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvjlrx000fr10l1ngkuxqs	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:32:37.245	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvjmj0000hr10lr2n2ztf7	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:32:38.22	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvjnio000jr10l8agkn2va	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:32:39.505	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvqnr3000mr10lxskpowz4	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:06.399	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvqora000or10lv3889imp	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:07.702	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvqphj000qr10l1tvdzrzt	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:08.648	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvqqlz000sr10lncg8m6sg	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:10.103	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvqrd0000ur10lachsv1m4	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:11.077	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvqshk000wr10lpoqxl0g6	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:12.537	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvqt8m000yr10l1tfqmsa3	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:13.51	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvqtwa0010r10lc4ztcjlw	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:14.362	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvqul70012r10l4jb1ec8n	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:15.259	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvqvqr0014r10lm5ujsmvl	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:16.756	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvr9yp0017r10lz26fcb38	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:35.185	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvrb290019r10l4rfh2yn8	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:36.609	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvrbsl001br10ljk120xwp	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:37.557	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvrcxc001dr10lwk05hqqg	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:39.024	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvrdo6001fr10lw6h1q7qx	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:39.99	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvrek6001hr10l0es1e9wn	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:41.143	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvrfb4001jr10lt8p15a99	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:42.112	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvrg4x001lr10lccp8aai3	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:43.185	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvrh2g001nr10lqp6wngdt	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:44.393	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvrhu6001pr10lghwx3att	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:38:45.391	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvsbet001sr10li8uv49ao	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:39:23.718	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvscmx001ur10lqaogb1ws	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:39:25.305	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvsdgr001wr10lrdun49rg	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:39:26.38	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvse7d001yr10lwc8h5q5l	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:39:27.337	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvsey90020r10lmjhu8t3t	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:39:28.305	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvsfpn0022r10l8dd4fnh2	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:39:29.292	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvsghk0024r10lf24ucu08	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:39:30.296	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvsh8n0026r10l2yib2l23	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:39:31.271	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvsi3j0028r10ls82ezhis	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:39:32.383	2026-01-31 15:06:59.594	\N	\N	\N
cmkwvsiws002ar10li80xngbj	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-27 17:39:33.436	2026-01-31 15:06:59.594	\N	\N	\N
cmky72k8b00019yqm2m7s972r	John	Doe	1234567890	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:43:03.66	2026-01-31 15:06:59.594	\N	\N	\N
cmky72o1o00039yqmrh0w0p2n	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:43:08.604	2026-01-31 15:06:59.594	\N	\N	\N
cmky72rxh00059yqmnayj75mw	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:43:13.637	2026-01-31 15:06:59.594	\N	\N	\N
cmky72ul500079yqmkzmev2bi	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:43:17.081	2026-01-31 15:06:59.594	\N	\N	\N
cmky72x4200099yqmk1ano45y	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:43:20.355	2026-01-31 15:06:59.594	\N	\N	\N
cmky72zm9000b9yqmvmx84s42	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:43:23.601	2026-01-31 15:06:59.594	\N	\N	\N
cmky731jf000d9yqm3kqid2ld	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:43:26.092	2026-01-31 15:06:59.594	\N	\N	\N
cmky733e8000f9yqm08u84b1r	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:43:28.497	2026-01-31 15:06:59.594	\N	\N	\N
cmky7357r000h9yqmquy3lw2w	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:43:30.855	2026-01-31 15:06:59.594	\N	\N	\N
cmky736vu000j9yqmy0q8rpn2	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:43:33.018	2026-01-31 15:06:59.594	\N	\N	\N
cmky7ahw400019yxo52s22wwl	John	Doe	1234567890	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:49:13.877	2026-01-31 15:06:59.594	\N	\N	\N
cmky7am3800039yxofzb4vqdd	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:49:19.316	2026-01-31 15:06:59.594	\N	\N	\N
cmky7aogo00059yxoh1h9hjgz	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:49:22.392	2026-01-31 15:06:59.594	\N	\N	\N
cmky7arpb00079yxoca12vz6n	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:49:26.184	2026-01-31 15:06:59.594	\N	\N	\N
cmky7aury00099yxob3aartug	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:49:30.575	2026-01-31 15:06:59.594	\N	\N	\N
cmky7axxi000b9yxohvb7cmwe	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:49:34.662	2026-01-31 15:06:59.594	\N	\N	\N
cmky7b0op000d9yxo5k96jdnl	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:49:38.233	2026-01-31 15:06:59.594	\N	\N	\N
cmky7b3om000f9yxoa9cvph2m	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:49:42.119	2026-01-31 15:06:59.594	\N	\N	\N
cmky7b6g4000h9yxo1x9z4cmn	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:49:45.7	2026-01-31 15:06:59.594	\N	\N	\N
cmky7b94m000j9yxooc4rt8ia	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:49:49.174	2026-01-31 15:06:59.594	\N	\N	\N
cmky7kx1g00019yzkztxer9q4	John	Doe	1234567890	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:57:20.069	2026-01-31 15:06:59.594	\N	\N	\N
cmky7l0ti00039yzkrip4lt5s	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:57:24.966	2026-01-31 15:06:59.594	\N	\N	\N
cmky7l52n00059yzk2flo1hj4	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:57:30.479	2026-01-31 15:06:59.594	\N	\N	\N
cmky7l7h200079yzk86vcl5if	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:57:33.59	2026-01-31 15:06:59.594	\N	\N	\N
cmky7lak600099yzktgqwomff	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:57:37.59	2026-01-31 15:06:59.594	\N	\N	\N
cmky7ldel000b9yzke5jd0qzt	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:57:41.277	2026-01-31 15:06:59.594	\N	\N	\N
cmky7lgen000d9yzk49rqywa7	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:57:45.167	2026-01-31 15:06:59.594	\N	\N	\N
cmky7ljhr000f9yzka67j15x3	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:57:49.167	2026-01-31 15:06:59.594	\N	\N	\N
cmky7ln07000h9yzkals43m8c	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:57:53.719	2026-01-31 15:06:59.594	\N	\N	\N
cmky7lqhy000j9yzkk76f4cl4	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 15:57:58.247	2026-01-31 15:06:59.594	\N	\N	\N
cmky7otmr00169yzktr2o8vzp	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:00:22.177	2026-01-31 15:06:59.594	\N	\N	\N
cmky7owt400189yzkwwabg28f	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:00:26.392	2026-01-31 15:06:59.594	\N	\N	\N
cmky7oyae001a9yzk1rvnp4z8	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:00:28.311	2026-01-31 15:06:59.594	\N	\N	\N
cmky7ozph001c9yzk16ufslvv	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:00:30.149	2026-01-31 15:06:59.594	\N	\N	\N
cmky7p1j5001e9yzk43amppei	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:00:32.514	2026-01-31 15:06:59.594	\N	\N	\N
cmky7p3i9001g9yzk4lmnfggp	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:00:35.073	2026-01-31 15:06:59.594	\N	\N	\N
cmky7p569001i9yzkzc5c6afs	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:00:37.233	2026-01-31 15:06:59.594	\N	\N	\N
cmky7p6r0001k9yzk4dvvizgb	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:00:39.277	2026-01-31 15:06:59.594	\N	\N	\N
cmky7p8er001m9yzkdaa39qd2	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:00:41.427	2026-01-31 15:06:59.594	\N	\N	\N
cmky7p9zh001o9yzk2u23e7mk	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:00:43.469	2026-01-31 15:06:59.594	\N	\N	\N
cmky7x4a600019ynlzgkdxqvk	John	Doe	1234567890	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:06:49.327	2026-01-31 15:06:59.594	\N	\N	\N
cmky7x7gw00039ynlp567kfow	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:06:53.456	2026-01-31 15:06:59.594	\N	\N	\N
cmky7x9d400059ynlaqww5ugo	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:06:55.912	2026-01-31 15:06:59.594	\N	\N	\N
cmky7xav600079ynl2fr6mz39	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:06:57.858	2026-01-31 15:06:59.594	\N	\N	\N
cmky7xcoq00099ynlxezoe1wb	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:07:00.219	2026-01-31 15:06:59.594	\N	\N	\N
cmky7xei2000b9ynl0n3xmw53	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:07:02.57	2026-01-31 15:06:59.594	\N	\N	\N
cmky7xgk1000d9ynlzf14huiu	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:07:05.233	2026-01-31 15:06:59.594	\N	\N	\N
cmky7xj5f000f9ynlorhiq1fq	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:07:08.595	2026-01-31 15:06:59.594	\N	\N	\N
cmky7xl51000h9ynlfgxpmzy9	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:07:11.174	2026-01-31 15:06:59.594	\N	\N	\N
cmky7xmpl000j9ynlxgfwgp2k	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:07:13.209	2026-01-31 15:06:59.594	\N	\N	\N
cmky8ai9200019yn7gqhkap1n	John	Doe	1234567890	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:17:13.959	2026-01-31 15:06:59.594	\N	\N	\N
cmky8anbs00039yn7ag1ubre3	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:17:20.537	2026-01-31 15:06:59.594	\N	\N	\N
cmky8aq4q00059yn7j3ytcxtu	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:17:24.17	2026-01-31 15:06:59.594	\N	\N	\N
cmky8asu100079yn7vc7k3yoj	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:17:27.674	2026-01-31 15:06:59.594	\N	\N	\N
cmky8b0rd00099yn7endxwd7f	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:17:37.945	2026-01-31 15:06:59.594	\N	\N	\N
cmky8b45o000b9yn7z22nn3fk	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:17:42.349	2026-01-31 15:06:59.594	\N	\N	\N
cmky8b6ue000d9yn7580z8q7s	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:17:45.83	2026-01-31 15:06:59.594	\N	\N	\N
cmky8b8qj000f9yn7748afr4g	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:17:48.283	2026-01-31 15:06:59.594	\N	\N	\N
cmky8bbi4000h9yn7ojku8azx	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:17:51.868	2026-01-31 15:06:59.594	\N	\N	\N
cmky8bdze000j9yn73hk5oc3f	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-28 16:17:55.083	2026-01-31 15:06:59.594	\N	\N	\N
cmkzmxj1a00019y3py4q44u25	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-29 15:54:48.862	2026-01-31 15:06:59.594	\N	\N	\N
cmkzmxmdd00039y3p74izofoj	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-29 15:54:53.186	2026-01-31 15:06:59.594	\N	\N	\N
cmkzmxol000059y3pmvgocqso	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-29 15:54:56.053	2026-01-31 15:06:59.594	\N	\N	\N
cmkzmxqzn00079y3p8mnrxsek	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-29 15:54:59.172	2026-01-31 15:06:59.594	\N	\N	\N
cmkzmxsxf00099y3pi1gr5vq5	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-29 15:55:01.684	2026-01-31 15:06:59.594	\N	\N	\N
cmkzmxuqu000b9y3ptzp1g6qb	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-29 15:55:04.038	2026-01-31 15:06:59.594	\N	\N	\N
cmkzmxwst000d9y3pva3qb0rz	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-29 15:55:06.701	2026-01-31 15:06:59.594	\N	\N	\N
cmkzmxyrv000f9y3pdyh25pxz	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-29 15:55:09.26	2026-01-31 15:06:59.594	\N	\N	\N
cmkzmy0tu000h9y3pc1p6ik8i	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-29 15:55:11.923	2026-01-31 15:06:59.594	\N	\N	\N
cmkzmy2nn000j9y3pn1melsfp	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-29 15:55:14.292	2026-01-31 15:06:59.594	\N	\N	\N
cml0i89nd004cpo0k79cmth82	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 06:30:58.009	2026-01-31 15:06:59.594	\N	\N	\N
cml0i8atm004epo0k8u5mocz0	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 06:30:59.531	2026-01-31 15:06:59.594	\N	\N	\N
cml0i8bus004gpo0kxzjvugio	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 06:31:00.868	2026-01-31 15:06:59.594	\N	\N	\N
cml0i8d53004ipo0kbrte4di7	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 06:31:02.535	2026-01-31 15:06:59.594	\N	\N	\N
cml0i8dxp004kpo0kdowgx8ew	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 06:31:03.565	2026-01-31 15:06:59.594	\N	\N	\N
cml0i8et8004mpo0kqwmb0j3j	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 06:31:04.7	2026-01-31 15:06:59.594	\N	\N	\N
cml0i8frg004opo0k4bf0ia14	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 06:31:05.932	2026-01-31 15:06:59.594	\N	\N	\N
cml0i8i95004upo0kzqargtk2	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 06:31:09.162	2026-01-31 15:06:59.594	\N	\N	\N
cml1259xa00009yz8dxnceeqf	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 15:48:30.718	2026-01-31 15:06:59.594	\N	\N	\N
cml125ip400029yz8ofmdh6cs	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 15:48:42.089	2026-01-31 15:06:59.594	\N	\N	\N
cml125lj700049yz8e3fs2e81	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 15:48:45.763	2026-01-31 15:06:59.594	\N	\N	\N
cml125o9f00069yz8e0lryoae	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 15:48:49.299	2026-01-31 15:06:59.594	\N	\N	\N
cml125ql900089yz8w25qvrr9	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 15:48:52.318	2026-01-31 15:06:59.594	\N	\N	\N
cml125tct000a9yz8dx5tvqsd	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 15:48:55.902	2026-01-31 15:06:59.594	\N	\N	\N
cml125wlj000c9yz80pa9v19j	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 15:49:00.103	2026-01-31 15:06:59.594	\N	\N	\N
cml125zfs000e9yz8pt1atwmp	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 15:49:03.785	2026-01-31 15:06:59.594	\N	\N	\N
cml1262ms000g9yz8n2mi8kcz	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 15:49:07.924	2026-01-31 15:06:59.594	\N	\N	\N
cml1264w2000i9yz8xoucq4y2	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 15:49:10.851	2026-01-31 15:06:59.594	\N	\N	\N
cml12z56s00019yfu48zs956w	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:11:44.26	2026-01-31 15:06:59.594	\N	\N	\N
cml12z8jd00039yfuy2q1sftf	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:11:48.601	2026-01-31 15:06:59.594	\N	\N	\N
cml12zawm00059yfuamk7w8rf	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:11:51.671	2026-01-31 15:06:59.594	\N	\N	\N
cml12zdfb00079yfu6k6gz56i	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:11:54.935	2026-01-31 15:06:59.594	\N	\N	\N
cml12zfer00099yfuqmfai09i	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:11:57.508	2026-01-31 15:06:59.594	\N	\N	\N
cml12zh87000b9yfu4nltjlza	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:11:59.863	2026-01-31 15:06:59.594	\N	\N	\N
cml12zj1n000d9yfugxd7602o	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:12:02.219	2026-01-31 15:06:59.594	\N	\N	\N
cml12zl3j000f9yfu3vuhs1yu	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:12:04.88	2026-01-31 15:06:59.594	\N	\N	\N
cml12znpe000h9yfuccxgy92p	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:12:08.259	2026-01-31 15:06:59.594	\N	\N	\N
cml12zpoi000j9yfu7j0oili9	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:12:10.819	2026-01-31 15:06:59.594	\N	\N	\N
cml134c2p000l9yfuj4zjh2kd	Anup	Pradhan	7735322819	anuppradhan929@gmail.com	\N	hello	cold	\N	cmivgorqg00009y5iyf5y9s5b	cmjbcndys0001jo04cc0sxh44	cmiztrwb10009jo04qj930dx5	2026-01-30 16:15:46.465	2026-01-31 15:06:59.594	cmj1ijq7d00019yn04s3gnxbh	\N	\N
cml13ax0b00019yx6mrtp53eo	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:20:53.531	2026-01-31 15:06:59.594	\N	BE6	Instagram
cml13b1sn00039yx6uvaged7l	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:20:59.736	2026-01-31 15:06:59.594	\N	XEV 9E	Facebook
cml13b5cp00059yx6qtsj97ul	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:04.345	2026-01-31 15:06:59.594	\N	XEV 9S	Website
cml13b90u00079yx6p5hemxj8	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:09.102	2026-01-31 15:06:59.594	\N	SCORPIO CLASSIC	Ads
cml13bc0n00099yx6tzlj6ojs	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:12.984	2026-01-31 15:06:59.594	\N	SCORPIO-N	Social Media
cml13bg8200009yihrj4kp9s0	John	Doe	7735322819	\N	New York	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:18.435	2026-01-31 15:06:59.594	\N	BE6	Instagram
cml13bk9u00029yihbfulyi9c	Jane	Smith	9876543210	\N	Los Angeles	XEV 9E	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:23.682	2026-01-31 15:06:59.594	\N	XEV 9E	Facebook
cml13bmi700049yihhoiokbjh	Robert	Johnson	5551234567	\N	Chicago	XEV 9S	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:26.575	2026-01-31 15:06:59.594	\N	XEV 9S	Website
cml13bpzt00069yiherocz9h2	Mary	Williams	4449876543	\N	Houston	SCORPIO CLASSIC	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:31.098	2026-01-31 15:06:59.594	\N	SCORPIO CLASSIC	Ads
cml13bsla00089yihxw2m92s4	David	Brown	3335557777	\N	Phoenix	SCORPIO-N	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:34.463	2026-01-31 15:06:59.594	\N	SCORPIO-N	Social Media
cml13busy000a9yihpxabmi29	Sarah	Davis	2224446666	\N	Philadelphia	THAR 3 DOOR	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:37.33	2026-01-31 15:06:59.594	\N	THAR 3 DOOR	Customer Word-of-Mouth
cml13bxi1000c9yihgyv6srhs	Michael	Wilson	1113335555	\N	San Antonio	THAR ROXX	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:40.825	2026-01-31 15:06:59.594	\N	THAR ROXX	Instagram
cml13bzjp000e9yih69pu4350	Emily	Martinez	9998887777	\N	San Diego	XUV 3XO	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:43.477	2026-01-31 15:06:59.594	\N	XUV 3XO	Website
cml13c24g000g9yih1kvhy06z	James	Anderson	8887776666	\N	Dallas	XUV 700	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:46.816	2026-01-31 15:06:59.594	\N	XUV 700	Ads
cml13c55s000i9yihul09swni	Lisa	Taylor	7776665555	\N	San Jose	BE6	WARM	\N	cmivgorqg00009y5iyf5y9s5b	\N	\N	2026-01-30 16:21:50.753	2026-01-31 15:06:59.594	\N	BE6	Facebook
\.


--
-- Data for Name: DigitalEnquirySession; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."DigitalEnquirySession" (id, notes, status, "digitalEnquiryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FieldInquiry; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."FieldInquiry" (id, "firstName", "lastName", "whatsappNumber", email, address, reason, "leadScope", "whatsappContactId", "dealershipId", "leadSourceId", "interestedModelId", "interestedVariantId", "createdAt", "updatedAt") FROM stdin;
cmkwqhpqs000l9yarqwfalcm6	John	Doe	7735322819	\N	New York	Inquiry from 1/15/2025	cold	\N	cmivgorqg00009y5iyf5y9s5b	cmj331qe500069ycfq0sg490q	cmiztrwb10009jo04qj930dx5	\N	2026-01-27 15:11:10.996	2026-01-31 15:06:59.992
cmkwqhtpo000m9yardeee1gr2	Jane	Smith	9876543210	\N	Los Angeles	Inquiry from 1/16/2025	cold	\N	cmivgorqg00009y5iyf5y9s5b	cmj331qe500069ycfq0sg490q	cmiztrp3m0007jo04qq6wkfgl	\N	2026-01-27 15:11:16.14	2026-01-31 15:06:59.992
cmkwqhvdg000n9yar7z9bwr0b	Robert	Johnson	5551234567	\N	Chicago	Inquiry from 1/17/2025	cold	\N	cmivgorqg00009y5iyf5y9s5b	cmj331qe500069ycfq0sg490q	cmiztscns000fl704c6yki0ju	\N	2026-01-27 15:11:18.292	2026-01-31 15:06:59.992
cmkwqhwtz000o9yarc9v21afv	Mary	Williams	4449876543	\N	Houston	Inquiry from 1/18/2025	cold	\N	cmivgorqg00009y5iyf5y9s5b	cmj331qe500069ycfq0sg490q	cmiztq99k0003jo0426lvvjyd	\N	2026-01-27 15:11:20.183	2026-01-31 15:06:59.992
cmkwqhyp1000p9yarfxed012i	David	Brown	3335557777	\N	Phoenix	Inquiry from 1/19/2025	cold	\N	cmivgorqg00009y5iyf5y9s5b	cmj331qe500069ycfq0sg490q	cmiztpjr70001jo044eu3c9m7	\N	2026-01-27 15:11:22.598	2026-01-31 15:06:59.992
cmkwqi0dk000q9yarvi7jykwn	Sarah	Davis	2224446666	\N	Philadelphia	Inquiry from 1/20/2025	cold	\N	cmivgorqg00009y5iyf5y9s5b	cmj331qe500069ycfq0sg490q	cmiztquhb000bl7043xrbotf9	\N	2026-01-27 15:11:24.776	2026-01-31 15:06:59.992
cmkwqi236000r9yarke1w8pp2	Michael	Wilson	1113335555	\N	San Antonio	Inquiry from 1/21/2025	cold	\N	cmivgorqg00009y5iyf5y9s5b	cmj331qe500069ycfq0sg490q	cmiztr3tx0005jo0448ptxxf2	\N	2026-01-27 15:11:26.994	2026-01-31 15:06:59.992
cmkwqi3o9000s9yarho3i5jkz	Emily	Martinez	9998887777	\N	San Diego	Inquiry from 1/22/2025	cold	\N	cmivgorqg00009y5iyf5y9s5b	cmj331qe500069ycfq0sg490q	cmiztp1ll0009l704zwumbdwc	\N	2026-01-27 15:11:29.05	2026-01-31 15:06:59.992
cmkwqi64e000t9yarn508urc4	James	Anderson	8887776666	\N	Dallas	Inquiry from 1/23/2025	cold	\N	cmivgorqg00009y5iyf5y9s5b	cmj331qe500069ycfq0sg490q	cmiztoo5h0007l704gbh0c0zn	\N	2026-01-27 15:11:32.223	2026-01-31 15:06:59.992
cmkwqi86c000u9yar4qtxburn	Lisa	Taylor	7776665555	\N	San Jose	Inquiry from 1/24/2025	cold	\N	cmivgorqg00009y5iyf5y9s5b	cmj331qe500069ycfq0sg490q	cmiztrwb10009jo04qj930dx5	\N	2026-01-27 15:11:34.885	2026-01-31 15:06:59.992
\.


--
-- Data for Name: FieldInquirySession; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."FieldInquirySession" (id, notes, status, "fieldInquiryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LeadSource; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."LeadSource" (id, name, "order", "isDefault", "dealershipId", "createdAt", "updatedAt") FROM stdin;
cmk13jon50003js04007b2fcy	Ads	0	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.258	2026-01-05 11:48:00.258
cmk13jonn0005js04zrlxzgso	Websites	3	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.259	2026-01-05 11:48:00.259
cmk13joo00007js04cxk0xw1o	Instagram	1	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.258	2026-01-05 11:48:00.258
cmk13joo50009js04lc52ijgk	Customer Word-of-Mouth	4	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.258	2026-01-05 11:48:00.258
cmk13joo7000bjs04nafhv6uq	Other	5	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.259	2026-01-05 11:48:00.259
cmk13joo9000djs04ok9rhhn3	Social Media	2	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.258	2026-01-05 11:48:00.258
cmk14mkfi0001jr04geb9t804	FIELD	6	f	cmk130qz40000l704z6fc2alp	2026-01-05 12:18:14.382	2026-01-05 12:18:14.382
cmk14njxu0001jv04dpvacj8o	TELEPHONE	7	f	cmk130qz40000l704z6fc2alp	2026-01-05 12:19:00.402	2026-01-05 12:19:00.402
cmj331qe500069ycfq0sg490q	Websites	3	t	cmivgorqg00009y5iyf5y9s5b	2025-12-12 16:29:50.081	2026-01-31 15:07:01.339
cmjbcn50y0001l504f96hangz	Hyperlocal	6	f	cmivgorqg00009y5iyf5y9s5b	2025-12-18 11:20:37.426	2026-01-31 15:07:01.339
cmjbcndys0001jo04cc0sxh44	MRC	7	f	cmivgorqg00009y5iyf5y9s5b	2025-12-18 11:20:49.012	2026-01-31 15:07:01.339
cmjbcnvub0001l80486ufdvxg	Other Digital	8	f	cmivgorqg00009y5iyf5y9s5b	2025-12-18 11:21:12.18	2026-01-31 15:07:01.339
\.


--
-- Data for Name: OrgFeatureToggle; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."OrgFeatureToggle" (id, "organizationId", dashboard, "dailyWalkinsVisitors", "dailyWalkinsSessions", "digitalEnquiry", "fieldInquiry", "deliveryUpdate", "exportExcel", "settingsProfile", "settingsVehicleModels", "settingsLeadSources", "settingsWhatsApp", "createdAt", "updatedAt") FROM stdin;
cml2g3p5l00029ymt61usdz20	cml2g3oru00009ymtudcd8add	t	t	t	t	t	t	t	t	t	t	t	2026-01-31 15:06:57.945	2026-01-31 15:06:57.945
cml2h21vs00029y0tfnepe8ns	cml2h21jm00009y0tnq43jzk7	t	t	t	t	t	t	t	t	t	t	t	2026-01-31 15:33:40.744	2026-01-31 15:33:40.744
\.


--
-- Data for Name: Organization; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."Organization" (id, name, slug, "isActive", "createdAt", "updatedAt") FROM stdin;
cml2g3oru00009ymtudcd8add	Utkal Automobiles Pvt Ltd	utkal-automobiles	t	2026-01-31 15:06:57.451	2026-01-31 15:06:57.451
cml2h21jm00009y0tnq43jzk7	Test Organization	test-organization	t	2026-01-31 15:33:40.307	2026-01-31 15:33:40.307
\.


--
-- Data for Name: ScheduledMessage; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."ScheduledMessage" (id, "scheduledFor", "sentAt", status, "retryCount", "deliveryTicketId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: TestDrive; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."TestDrive" (id, "sessionId", "modelId", "createdAt", "updatedAt", "variantId") FROM stdin;
cmkzjtpvo00059y6sd8uo97cy	cmkzjt89v00029y6safvxrqz1	cmiztq99k0003jo0426lvvjyd	2026-01-29 14:27:52.26	2026-01-29 14:27:52.26	\N
cml0gwh3p0005po0kegkchao7	cml0fm1g40002po0kwhha5h08	cmk13mis60007js04xgg2p6bl	2026-01-30 05:53:48.181	2026-01-30 05:53:48.181	\N
cml0if772004xpo0k2ds52pfk	cml0hvtk20008po0kbe4vwqmy	cmk13ovnl000djs047uy6wdf0	2026-01-30 06:36:21.422	2026-01-30 06:36:21.422	\N
cml0prsh1005ipo0kbwc6kiaq	cml0prkty005fpo0kdkiqmyf4	cmk13ovnl000djs047uy6wdf0	2026-01-30 10:02:06.181	2026-01-30 10:02:06.181	\N
cml0rfkm10064po0kuvw0eysr	cml0rfe4m0061po0krmqloy66	cmk13o7wv000bjs04kr6sz4b0	2026-01-30 10:48:35.354	2026-01-30 10:48:35.354	\N
cml1vmjlh0008qi0k3c6x0hup	cml1vlqmn0005qi0ktu5qa4oc	cmk13mis60007js04xgg2p6bl	2026-01-31 05:33:45.269	2026-01-31 05:33:45.269	\N
cml53rzsd0011qn0k4gi7kv65	cml50up3u000qqn0ka73572e5	cmk5701ld0001l804ns4u58mz	2026-02-02 11:45:14.99	2026-02-02 11:45:14.99	\N
cml68tvk4009eqn0kvxmcf9xh	cml68tis8009bqn0kebkmz876	cmk13mis60007js04xgg2p6bl	2026-02-03 06:54:27.076	2026-02-03 06:54:27.076	\N
cml68ub6w009gqn0kfrhlz6sl	cml65cjvq0096qn0kpvar3723	cmk13o7wv000bjs04kr6sz4b0	2026-02-03 06:54:47.337	2026-02-03 06:54:47.337	\N
cml697ijj009mqn0k8ygzg9i7	cml696hml009jqn0ka1h1wp1m	cmk13o7wv000bjs04kr6sz4b0	2026-02-03 07:05:03.391	2026-02-03 07:05:03.391	\N
cml69e94u009vqn0kp2prxnou	cml69bcri009sqn0kzypmbzde	cmiztquhb000bl7043xrbotf9	2026-02-03 07:10:17.791	2026-02-03 07:10:17.791	\N
cml6jbxgo00auqn0ktare1gta	cml6i9q2n00anqn0kw2gqrw0k	cmk13o7wv000bjs04kr6sz4b0	2026-02-03 11:48:25.513	2026-02-03 11:48:25.513	\N
cml6qbhar00049ydp0mnk1fgv	cml6qakdz00019ydpjb63aeez	cmiztpjr70001jo044eu3c9m7	2026-02-03 15:04:01.876	2026-02-03 15:04:01.876	\N
cml6qlf5d00099ydpnwcyhtw5	cml6qcaj200069ydp3yvgc8ch	cmiztpjr70001jo044eu3c9m7	2026-02-03 15:11:45.65	2026-02-03 15:11:45.65	\N
cml6qm09l000b9ydpxhsh3bsu	cml6qcaj200069ydp3yvgc8ch	cmiztquhb000bl7043xrbotf9	2026-02-03 15:12:13.017	2026-02-03 15:12:13.017	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."User" (id, email, password, "createdAt", "updatedAt", "dealershipId", theme, "profilePicture", "isActive", role, "organizationId") FROM stdin;
cmk130rve0002l704u1xindzz	cxhead@utkalautomobiles.com	$2b$10$HUs.0usDCUpH7f.fy3M/BOB3Tc.XptbH5N.SoKNjRJc2lioko7iG6	2026-01-05 11:33:17.978	2026-01-31 15:33:39.808	cmk130qz40000l704z6fc2alp	light	https://6bq7rhjji2yjom4g.public.blob.vercel-storage.com/profile-pictures/cmk130rve0002l704u1xindzz-1767612798008-pVUWOiwH7IndaAnsftXWaKwGRS1Ya1.jpg	t	super_admin	cml2g3oru00009ymtudcd8add
cmivgos9200029y5ih8trr8ri	test@google.com	$2b$10$J2srSW.o9DPQs1V8h8XYCeSIBNa1xO5rooX4qZQlEmKkFEHcQ89da	2025-12-07 08:29:33.83	2026-01-31 15:33:41.775	cmivgorqg00009y5iyf5y9s5b	custom	https://6bq7rhjji2yjom4g.public.blob.vercel-storage.com/profile-pictures/cmivgos9200029y5ih8trr8ri-1767611092722-kIQc1kwe6CExCSTCRjldrc5oWb092a.jpg	t	super_admin	cml2h21jm00009y0tnq43jzk7
cml6abef600a4qn0kaaxb9ey9	dem@utkalautomobiles.com	$2b$10$H7szZxgDWGrRDbdpE.nq/uM.Uy76WXQe7BOdpsTtoaiBi9q0jdgCu	2026-02-03 07:36:04.29	2026-02-03 07:36:04.29	cmk130qz40000l704z6fc2alp	light	\N	t	admin	\N
cml6bov3q00a8qn0kjonsnax5	monalisapradhan7439@gmail.com	$2b$10$qzvVw6.15PElW87Hhiy9PeMALcTB4MssMduGBnELwaaVRw4f48RZK	2026-02-03 08:14:32.054	2026-02-03 08:14:32.054	cmk130qz40000l704z6fc2alp	light	\N	t	user	\N
\.


--
-- Data for Name: UserPermission; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."UserPermission" (id, "userId", dashboard, "dailyWalkinsVisitors", "dailyWalkinsSessions", "digitalEnquiry", "fieldInquiry", "deliveryUpdate", "settingsProfile", "settingsVehicleModels", "settingsLeadSources", "settingsWhatsApp", "createdAt", "updatedAt", "exportExcel") FROM stdin;
cmkr0y77000019ymthhqb3ctz	cmivgos9200029y5ih8trr8ri	f	f	f	f	f	f	f	f	f	f	2026-01-23 15:17:19.212	2026-01-23 15:17:19.212	f
cmkr1bkwh0025ns0klx1ucdoz	cmk130rve0002l704u1xindzz	t	t	t	t	t	t	t	t	t	t	2026-01-23 15:27:43.504	2026-01-23 15:27:43.504	f
cml6abefb00a6qn0kogp5me29	cml6abef600a4qn0kaaxb9ey9	t	t	t	t	t	t	t	t	t	f	2026-02-03 07:36:04.295	2026-02-03 07:36:04.295	t
cml6bov4500aaqn0k7oekd33j	cml6bov3q00a8qn0kjonsnax5	t	t	t	f	f	t	f	f	f	f	2026-02-03 08:14:32.058	2026-02-03 08:14:32.058	f
\.


--
-- Data for Name: VehicleCategory; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."VehicleCategory" (id, name, "dealershipId", "createdAt", "updatedAt") FROM stdin;
cmk13jvej0001js042x7jmw4l	SUV	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:09.02	2026-01-05 11:48:09.02
cmk13jzei0001jr04tanpwnsz	EV	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:14.202	2026-01-05 11:48:14.202
cmivgs0z600079y5i3c2b21ci	SUV	cmivgorqg00009y5iyf5y9s5b	2025-12-07 08:32:04.739	2026-01-31 15:07:00.938
cmiztrdig000dl704zboi5qen	BEV	cmivgorqg00009y5iyf5y9s5b	2025-12-10 09:46:34.408	2026-01-31 15:07:00.938
\.


--
-- Data for Name: VehicleModel; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."VehicleModel" (id, name, year, "categoryId", "createdAt", "updatedAt") FROM stdin;
cmiztoo5h0007l704gbh0c0zn	XUV 700	\N	cmivgs0z600079y5i3c2b21ci	2025-12-10 09:44:28.229	2025-12-10 09:44:28.229
cmiztp1ll0009l704zwumbdwc	XUV 3XO	\N	cmivgs0z600079y5i3c2b21ci	2025-12-10 09:44:45.658	2025-12-10 09:44:45.658
cmiztpjr70001jo044eu3c9m7	SCORPIO-N	\N	cmivgs0z600079y5i3c2b21ci	2025-12-10 09:45:09.188	2025-12-10 09:45:09.188
cmiztq99k0003jo0426lvvjyd	SCORPIO CLASSIC	\N	cmivgs0z600079y5i3c2b21ci	2025-12-10 09:45:42.248	2025-12-10 09:45:42.248
cmiztquhb000bl7043xrbotf9	THAR 3 DOOR	\N	cmivgs0z600079y5i3c2b21ci	2025-12-10 09:46:09.744	2025-12-10 09:46:09.744
cmiztr3tx0005jo0448ptxxf2	THAR ROXX	\N	cmivgs0z600079y5i3c2b21ci	2025-12-10 09:46:21.862	2025-12-10 09:46:21.862
cmiztrp3m0007jo04qq6wkfgl	XEV 9E	\N	cmiztrdig000dl704zboi5qen	2025-12-10 09:46:49.427	2025-12-10 09:46:49.427
cmiztrwb10009jo04qj930dx5	BE6	\N	cmiztrdig000dl704zboi5qen	2025-12-10 09:46:58.765	2025-12-10 09:46:58.765
cmiztscns000fl704c6yki0ju	XEV 9S	\N	cmiztrdig000dl704zboi5qen	2025-12-10 09:47:19.961	2025-12-10 09:47:19.961
cmk13mis60007js04xgg2p6bl	XUV 3XO	\N	cmk13jvej0001js042x7jmw4l	2026-01-05 11:50:12.63	2026-01-05 11:50:12.63
cmk13mrb90003lc04v9gamlr0	Bolero	\N	cmk13jvej0001js042x7jmw4l	2026-01-05 11:50:23.685	2026-01-05 11:50:23.685
cmk13n14k000fjs04n7s2wdb7	Bolero Neo	\N	cmk13jvej0001js042x7jmw4l	2026-01-05 11:50:36.405	2026-01-05 11:50:36.405
cmk13nkwk0001js04czooodij	Scorpio N	\N	cmk13jvej0001js042x7jmw4l	2026-01-05 11:51:02.036	2026-01-05 11:51:02.036
cmk13nsjz0009js04ckim7hte	Scorpio Classic	\N	cmk13jvej0001js042x7jmw4l	2026-01-05 11:51:11.95	2026-01-05 11:51:11.95
cmk13o7wv000bjs04kr6sz4b0	XUV 7XO	\N	cmk13jvej0001js042x7jmw4l	2026-01-05 11:51:31.855	2026-01-05 11:51:31.855
cmk13ondj000hjs04uli7wp7a	THAR	\N	cmk13jvej0001js042x7jmw4l	2026-01-05 11:51:51.895	2026-01-05 11:51:51.895
cmk13ovnl000djs047uy6wdf0	THAR ROXX	\N	cmk13jvej0001js042x7jmw4l	2026-01-05 11:52:02.625	2026-01-05 11:52:02.625
cmk56v3sb0001jp04h73ijrbf	BE 6	\N	cmk13jzei0001jr04tanpwnsz	2026-01-08 08:31:56.651	2026-01-08 08:31:56.651
cmk56zmu30001jy04rtisk47w	XEV 9E	\N	cmk13jzei0001jr04tanpwnsz	2026-01-08 08:35:27.963	2026-01-08 08:35:27.963
cmk5701ld0001l804ns4u58mz	XEV 9S	\N	cmk13jzei0001jr04tanpwnsz	2026-01-08 08:35:47.089	2026-01-08 08:35:47.089
cml6bw1k000agqn0kjkvc2314	XUV 7OO	\N	cmk13jvej0001js042x7jmw4l	2026-02-03 08:20:07.008	2026-02-03 08:20:07.008
\.


--
-- Data for Name: VehicleVariant; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."VehicleVariant" (id, name, "modelId", "createdAt", "updatedAt") FROM stdin;
cmj1ijq7d00019yn04s3gnxbh	esy	cmiztrwb10009jo04qj930dx5	2025-12-11 14:08:14.185	2025-12-11 14:08:14.185
\.


--
-- Data for Name: Visitor; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."Visitor" (id, "firstName", "lastName", "whatsappNumber", email, address, "whatsappContactId", "dealershipId", "createdAt", "updatedAt") FROM stdin;
cmk5eguhv0001l2048htsqxa1	MONALISA	MHGF	7064645937	MONA@GMAIL	TEST	695f9d608ba75797369a342e	cmk130qz40000l704z6fc2alp	2026-01-08 12:04:48.355	2026-01-08 12:12:13.794
cmk5f2tdm0001jj04lkucp9dz	SURESH 	KUMAR	7855877317	sureshkumar@gmail.com	NAYAGARH	695fa16194dcfd88151f1755	cmk130qz40000l704z6fc2alp	2026-01-08 12:21:53.339	2026-01-08 12:21:53.339
cmk5f63mk0001ib0474a9l034	HARIHAR	MAHAPATRA	9337521170	harihar@gmail.com	PURI 	695fa1fa94dcfd88151f1b99	cmk130qz40000l704z6fc2alp	2026-01-08 12:24:26.589	2026-01-08 12:24:26.589
cmk5fjllt0001kw04iape5ier	AKASH KUMAR 	MALLICK 	8917375417	akashkumar@gmail.com	KHORDHA 	695fa47094dcfd88151f3147	cmk130qz40000l704z6fc2alp	2026-01-08 12:34:56.418	2026-01-08 12:34:56.418
cmk5fxnvy0006l204w9hnce48	VINEET	KUTHAL	9437002011	vineetkuthal@gmail.com	BOMIKHAL 	695fa70094dcfd88151f50e4	cmk130qz40000l704z6fc2alp	2026-01-08 12:45:52.558	2026-01-08 12:45:52.558
cmk5fzg84000bl204zz9zjh2g	SK	MOHANTY 	7978309195	skmohanty@gmail.com	POKHARIPUT 	695fa75394dcfd88151f55a4	cmk130qz40000l704z6fc2alp	2026-01-08 12:47:15.94	2026-01-08 12:47:15.94
cmk6ft8ls0001l40499qxxrio	ASHUTOSH 	PRADHAN 	8328869198	ashutosh@gmail.com	PAREDEEP	696092646291ef8bcee57fb4	cmk130qz40000l704z6fc2alp	2026-01-09 05:30:12.304	2026-01-09 05:30:12.304
cmk6ibvd30001l4041wcedeh0	SANJIB	MOHANTY 	8895180338	sanjib@gmail.com	POKHARIPUT	6960a2e8489bd08ae6299014	cmk130qz40000l704z6fc2alp	2026-01-09 06:40:40.839	2026-01-09 06:40:40.839
cmk7tyv3r0001l204367gk6sm	Biswa	Test	8658094734	biswatest@gmail.com	Bbsr	6961db77f5d2f8f3c8687e88	cmk130qz40000l704z6fc2alp	2026-01-10 04:54:15.543	2026-01-10 04:54:15.543
cmk7v2pci0001la047odt2v1r	PRADYUMNA KUMAR 	JENA	7008617434	pradyumnakumar@gmail.com	KALPANA	6961e2baf5d2f8f3c868bf98	cmk130qz40000l704z6fc2alp	2026-01-10 05:25:14.322	2026-01-10 05:25:14.322
cmk7ybphf0001jm04ydrlsq47	CHOLAGANGA	SAMAL	9862428496	cholaganga@gmail.com	JAJPUR	6961f80df5d2f8f3c8694a44	cmk130qz40000l704z6fc2alp	2026-01-10 06:56:13.251	2026-01-10 06:56:13.251
cmk7yziaf0001jp04f4dxm976	MR	BHASKAR	7894454048	bhaskar@gmail.com	KALINGA VIHAR	6961fc63f5d2f8f3c8696cf0	cmk130qz40000l704z6fc2alp	2026-01-10 07:14:43.671	2026-01-10 07:14:43.671
cmk5eenwc0001jy04trhfxtdc	DEBASISH 	MISHRA	7008296300	debasiss@gmail.com	RASULGARH	695f9cfa8ba75797369a3014	cmk130qz40000l704z6fc2alp	2026-01-08 12:03:06.492	2026-01-08 12:03:06.492
cmk805unr0001ju04rqctzb1r	ARDHENDU SEKHAR	MANSINGH	7855817098	ardhendu@gmail.com	SUBHAGYANAGAR 	6962041bf5d2f8f3c8698f84	cmk130qz40000l704z6fc2alp	2026-01-10 07:47:39.256	2026-01-10 07:47:39.256
cmk868dju0001lb04l81mgxe5	S	RAYSINGH	9776777984	sransingh@gmail.com	KHORDHA 	69622beef5d2f8f3c86a88e8	cmk130qz40000l704z6fc2alp	2026-01-10 10:37:34.746	2026-01-10 10:37:34.746
cmk87y2fx0006jx04gf41lhit	SEEMA	KUMARI	9599228681	seemakumari@gmail.com	RAGHUNATHPUR	6962372cf5d2f8f3c86abb17	cmk130qz40000l704z6fc2alp	2026-01-10 11:25:33.021	2026-01-10 11:25:33.021
cmk88272o000bjx04t671mh6s	SMRUTI RANJAN 	SAHOO	9861960070	smrutiranjan@gmail.com	BALIANTA	696237edf5d2f8f3c86abd58	cmk130qz40000l704z6fc2alp	2026-01-10 11:28:45.648	2026-01-10 11:28:45.648
cmk88dmkl0001ky04npquuo37	Sthita pragnya	Tripathy 	9337532053	sthita9090@gmail.com	Patia 	69623a02f5d2f8f3c86acf82	cmk130qz40000l704z6fc2alp	2026-01-10 11:37:38.95	2026-01-10 11:37:38.95
cmk87p7yn0001jx04d7tefhqi	Chandra	Maham	7751958528	etudu@yahoo.com	Patia	69623590f5d2f8f3c86ab6c8	cmk130qz40000l704z6fc2alp	2026-01-10 11:18:40.272	2026-01-10 11:45:24.244
cmk896l4e0008ky0441949cny	RAKESH 	KHADANGA	9040045889	rakesh@gmail.com	KALINGA NAGAR 	69623f4af5d2f8f3c86aef5a	cmk130qz40000l704z6fc2alp	2026-01-10 12:00:10.095	2026-01-10 12:00:10.095
cmk89frtm0001kw040rfei7xv	ABHISHEK 	DASH	9348914139	abhishek@gmail.com	ANGUL	696240f6f5d2f8f3c86af80d	cmk130qz40000l704z6fc2alp	2026-01-10 12:07:18.682	2026-01-10 12:07:18.682
cmk8ap7dw000dky04kmxjdcku	RAJEN	SARANGI	9861343117	rajensarangi@gmail.com	PATIA	6962493ef5d2f8f3c86b3047	cmk130qz40000l704z6fc2alp	2026-01-10 12:42:38.372	2026-01-10 12:42:38.372
cmkaq4qcg0001jp04owla5bsz	ABHILASH	PATTANAIK 	9583400955	abhilas@gmail.com	KHORDHA 	696486e1f5d2f8f3c8739937	cmk130qz40000l704z6fc2alp	2026-01-12 05:30:09.376	2026-01-12 05:30:09.376
cmkaq5xg40001ib04etw1us6j	RABINDRA KUMAR 	MARTHA	9853517013	rabindrakumar@gmail.com	KHORDHA 	69648719f5d2f8f3c8739aa3	cmk130qz40000l704z6fc2alp	2026-01-12 05:31:05.237	2026-01-12 05:31:05.237
cmkat2vx20001ih04mk7k6hy3	JAGAN	MAHARANA	7077913113	cube@utkalautomobiles.com	PLOT NO 9	69649a3af5d2f8f3c874386b	cmk130qz40000l704z6fc2alp	2026-01-12 06:52:42.135	2026-01-12 06:54:53.104
cmkaw6rsa0001l5049gwa1cbz	SANJAY KUMAR 	MISHRA 	9938025858	SanjayKumar@gmail.com	KHORDHA 	6964ae9ef5d2f8f3c874bc35	cmk130qz40000l704z6fc2alp	2026-01-12 08:19:42.25	2026-01-12 08:19:42.25
cmkb2p3n40001ju048dag0bwy	Krishna 	Das	7978439018	krishna.das157@gmail.com	Cda sec 7 	6964d953f5d2f8f3c875e5b5	cmk130qz40000l704z6fc2alp	2026-01-12 11:21:55.121	2026-01-12 11:21:55.121
cmkb5jd8x0001l7049u7pplrp	Chiranjeev 	Pradhan	7735298679	chiranjeev@gmail.com	Kalarahanga	6964ebf6f5d2f8f3c87668ff	cmk130qz40000l704z6fc2alp	2026-01-12 12:41:26.482	2026-01-12 12:41:26.482
cmkc7h5k70001i504qi6n4c4l	SATYAJEET	BEHERA 	8327735427	satyajeet@gmail.com	KEONJHAR 	6965e4e0f5d2f8f3c87a3937	cmk130qz40000l704z6fc2alp	2026-01-13 06:23:28.615	2026-01-13 06:23:28.615
cmkc7lp5u0001l804jhi6j6eg	MALLIKA	MITRA	9437162758	mallika@gmail.com	JATANI	6965e5b4f5d2f8f3c87a3cf9	cmk130qz40000l704z6fc2alp	2026-01-13 06:27:00.642	2026-01-13 06:27:00.642
cmkc80hky0001l4049n1vx43r	SANDEEP	NAYAK 	9437733437	sandeep@gmail.com	LAXMISAGAR 	6965e866f5d2f8f3c87a43e4	cmk130qz40000l704z6fc2alp	2026-01-13 06:38:30.658	2026-01-13 06:38:30.658
cmkc8kqv20001gt04yswx9clf	VISHAL	KUMAR	7509355601	vishalkumar@gmail.com	PATIA 	6965ec17f5d2f8f3c87a520a	cmk130qz40000l704z6fc2alp	2026-01-13 06:54:15.806	2026-01-13 06:54:15.806
cmkc9314l0001jx04d9dxcxzv	DEBI PRASAD	MANGARAJ 	9438552902	debiprasad@gmail.com	PURI	6965ef6cf5d2f8f3c87a62ba	cmk130qz40000l704z6fc2alp	2026-01-13 07:08:28.917	2026-01-13 07:08:28.917
cmkc9hm500001l404jt6qjzml	testing 	123	9937214349	xyz@gmail.com	BBSR	6965f215f5d2f8f3c87a6b33	cmk130qz40000l704z6fc2alp	2026-01-13 07:19:49.333	2026-01-13 07:19:49.333
cmkc9t05a0001ic04rjqrkm44	SK	WAJID	8637281289	skwajid@gmail.com	\N	6965f428f5d2f8f3c87a76b3	cmk130qz40000l704z6fc2alp	2026-01-13 07:28:40.703	2026-01-13 07:28:40.703
cmkc9z1350001kz04mixco0pl	Divyaranjan	Patra	9937913892	nilu.divyaranjan@gmail.com	Cda sec 8	6965f541f5d2f8f3c87a79cb	cmk130qz40000l704z6fc2alp	2026-01-13 07:33:21.858	2026-01-13 07:33:21.858
cmkcan3xj0001jm042tnpj5oy	CHANDAN 	SONKAR	9937135222	chandan@gmail.com	DEOGARH 	6965f9a5f5d2f8f3c87a8681	cmk130qz40000l704z6fc2alp	2026-01-13 07:52:05.288	2026-01-13 07:52:05.288
cmkcbw7p20001l6049d774t20	RAJENDRA 	NAYAK 	7008270108	Rajendra@gmail.com	NAYAPALI 	696601dd759d487731e69057	cmk130qz40000l704z6fc2alp	2026-01-13 08:27:09.686	2026-01-13 08:27:09.686
cmkcfe9wn0001js04aqu5cczt	BIKASH CHANDRA 	BHOLA	7008844062	bikashchandra@gmail.com	KHORDHA 	696618d7759d487731e6f23e	cmk130qz40000l704z6fc2alp	2026-01-13 10:05:11.207	2026-01-13 10:05:11.207
cmkch1ekz0001l204j3qxsa48	GIRIJA	BISWAL	9132281852	girija@gmail.com	JAJPUR	6966239d759d487731e73cc5	cmk130qz40000l704z6fc2alp	2026-01-13 10:51:09.971	2026-01-13 10:51:09.971
cmkcj69y00001k304bx4b16lq	Sujit	Nayak 	7008484710	sujit@gmail.com	Patia	696631a00700740b6823bfab	cmk130qz40000l704z6fc2alp	2026-01-13 11:50:56.472	2026-01-13 11:50:56.472
cmk5qz9so0001jo045y949ym8	Avtar	Panda	966870761	abhilash.panda8654@gmail.com	bhubaneswae		cmivgorqg00009y5iyf5y9s5b	2026-01-08 17:55:03.384	2026-01-31 15:06:59.121
cmkck3yf70001jr04g2hfhlyy	BARAH	SAMAL	8249878287	barahsamal@gmail.com	KENDRAPARA 	696637c34920b28544b383b0	cmk130qz40000l704z6fc2alp	2026-01-13 12:17:07.844	2026-01-13 12:17:07.844
cmkcmeg8s0001l5042f9mhyb4	YASOBANTA	OJHA TESTING	9437600067	YNN@gmail.com	bhubaneswar	696646cc4920b28544b3eea6	cmk130qz40000l704z6fc2alp	2026-01-13 13:21:16.732	2026-01-13 13:21:16.732
cmkcml18h0003jl04r9qrr8c5	yaso	ojha testing	8260846006	ojha@gmail.com	BBSR	696647ff4920b28544b3fe63	cmk130qz40000l704z6fc2alp	2026-01-13 13:26:23.874	2026-01-13 13:26:23.874
cmkdk6xxv0001ky04v6m1o8bb	Vivekananda 	Panda	9937010123	vpanda86@gmail.com	Paradeep	696724814920b28544b7b4da	cmk130qz40000l704z6fc2alp	2026-01-14 05:07:13.363	2026-01-14 05:07:13.363
cmkdm3cka0001l20480b6gk2r	PURNA CHANDRA 	SAHOO 	9861027773	purnachandra@gmail.com	BOMIKHALA	696730f84920b28544b804f3	cmk130qz40000l704z6fc2alp	2026-01-14 06:00:24.923	2026-01-14 06:00:24.923
cmkdm5rzb0001jr04v4t6fuvb	GAGAN KUMAR 	BHUTIA	9337334833	gagankumar@gmail.com	GADAKANA	6967316a4920b28544b80778	cmk130qz40000l704z6fc2alp	2026-01-14 06:02:18.215	2026-01-14 06:02:18.215
cmkdndug30001js04x9wze5id	SP	PANDEY	9861240528	sppandey@gmail.com	OLD TOWN 	69673972d67f4b05e36f08f5	cmk130qz40000l704z6fc2alp	2026-01-14 06:36:34.275	2026-01-14 06:36:34.275
cmkdo8adj0001jp04k35sph6j	SABYASACHI	DAS 	9432184888	sabyasachi@gmail.com	BANIVIHAR	69673efed67f4b05e36f2124	cmk130qz40000l704z6fc2alp	2026-01-14 07:00:14.6	2026-01-14 07:00:14.6
cmkdq17870001jn04t40nol8x	STAFFORD VALENTINE	REDDEN	8018929599	stafford@gmail.com	BHUBANESWAR 	69674ad3d67f4b05e36f50ab	cmk130qz40000l704z6fc2alp	2026-01-14 07:50:43.159	2026-01-14 07:50:43.159
cmkdqifdh0001jr044xe6iv79	SATYAJEET 	ROUT	7205127339	satyajeet@gmail.com	KEONJHAR 	69674df66cbf493b9840d047	cmk130qz40000l704z6fc2alp	2026-01-14 08:04:06.869	2026-01-14 08:04:06.869
cmkdqlou10001jo04yl487ogn	RAMAKANTA	PRADHAN 	9556897143	ramakanta@gmail.com	JAYDEV BIHAR	69674e8f6cbf493b9840d55c	cmk130qz40000l704z6fc2alp	2026-01-14 08:06:39.098	2026-01-14 08:06:39.098
cmkdtp8os0001lb0449frz1zf	ABINASH	Rout	7978020447	abinash@gmail.com	MANCHESWAR 	696762e36cbf493b9841304f	cmk130qz40000l704z6fc2alp	2026-01-14 09:33:23.645	2026-01-14 09:33:23.645
cmkduwpfu0006lb04se1s3auc	HARDIK	PATTNAIK	7008512813	hardik@gmail.com	BHUBANESWAR 	69676acf6cbf493b98416716	cmk130qz40000l704z6fc2alp	2026-01-14 10:07:11.562	2026-01-14 10:07:11.562
cmkdvrt9j000blb04zvk7foa0	SURJYAKANTA	PRUSTY	7667326806	surjyakanta@gmail.com	KESHURA	6967707a6cbf493b984190f4	cmk130qz40000l704z6fc2alp	2026-01-14 10:31:22.856	2026-01-14 10:31:22.856
cmkdvxwpg0001kz04dmkkuvm2	GHANASHYAM	SAHOO 	8328950005	ghanashyam@gmail.com	BALAKATI	696771976cbf493b9841984a	cmk130qz40000l704z6fc2alp	2026-01-14 10:36:07.252	2026-01-14 10:36:07.252
cmkdy11km0001l204nvev1st9	DIBYA RANJAN 	MOHANTY 	7749860230	dibyaranjan@gmail.com	RAGHUNATHPUR 	69677f486cbf493b984233e1	cmk130qz40000l704z6fc2alp	2026-01-14 11:34:32.758	2026-01-14 11:34:32.758
cmkdye1o70001kv04lvrx5wtl	RK	DAS	8280672308	rkdas@gmail.com	RASULGARH 	696781a76cbf493b98424a78	cmk130qz40000l704z6fc2alp	2026-01-14 11:44:39.415	2026-01-14 11:44:39.415
cmkdyv9110001l104wx4x859g	KIRTI 	KUMAR 	7004192891	kritikumar@gmail.com	SAILASHREE BIHAR 	696784ca6cbf493b98426805	cmk130qz40000l704z6fc2alp	2026-01-14 11:58:02.101	2026-01-14 11:58:02.101
cmke11zii0001l704xebaz5rs	Prasant	Sahu	9776348096	prasantsahu20@gmail.com	CDA Sec 9	696793236cbf493b9842dd6b	cmk130qz40000l704z6fc2alp	2026-01-14 12:59:15.594	2026-01-14 12:59:15.594
cmkf33s190001jm04fzfoxjty	AMARJEET 	NAYAK	7504571031	amarjeet@gmail.com	BARMUNDA	69688cc8a0872a13faaaef7d	cmk130qz40000l704z6fc2alp	2026-01-15 06:44:24.621	2026-01-15 06:44:24.621
cmkf5hxl80001lb04zfw7iamj	SOUMYARANJAN 	GURU	9658711248	soumyaranjan@gmail.com	RAHAMA	69689c7c6cf7329488f4d3ac	cmk130qz40000l704z6fc2alp	2026-01-15 07:51:24.236	2026-01-15 07:51:24.236
cmkf7v9b40001l504tpudl05e	PUNEET	KUMAR 	7892851923	puneet@gmail.com	PARADEEP 	6968ac096cf7329488f5415b	cmk130qz40000l704z6fc2alp	2026-01-15 08:57:45.184	2026-01-15 08:57:45.184
cmkfakkfm0001l804teb6rs9m	ASHOK KUMAR 	SAHU	9556166352	ashokkumar@gmail.com	NAYAPALLI 	6968bdc56cf7329488f5816f	cmk130qz40000l704z6fc2alp	2026-01-15 10:13:25.234	2026-01-15 10:13:25.234
cmkfc93xs0001lb04ksryt73m	SNEHASISH 	BADAJENA 	8763709909	snehasish@gmail.com	KHORDHA 	6968c8cd4feb41b2193f0c39	cmk130qz40000l704z6fc2alp	2026-01-15 11:00:29.872	2026-01-15 11:00:29.872
cmkfcgrgy0006lb04vwtw85w5	RATNAKAR	SAHOO 	8270703877	ratnakar@gmail.com	CUTTACK 	6968ca326d4a771fdfea82c7	cmk130qz40000l704z6fc2alp	2026-01-15 11:06:26.962	2026-01-15 11:06:26.962
cmkfej6ug0001l804j1tzb1cw	Arnab	Sarkar	9337096291	sarkar.arnab@mahindra.com	BBSR	6968d7c35a78b232f6601845	cmk130qz40000l704z6fc2alp	2026-01-15 12:04:19.432	2026-01-15 12:04:19.432
cmkgeuucd0001if04igp4b402	Bipasa	Padhy 	7008985632	bipasapadhy789@gmail.com	BHUBANESWAR 	6969c615cad0478a8fcea484	cmk130qz40000l704z6fc2alp	2026-01-16 05:01:09.277	2026-01-16 05:01:09.277
cmkgf44a40001lh04386luhcx	Biswabhusan 	Arjuna	8144533020	biswaharichandan@gmail.com	Tamanda 	6969c7c6cad0478a8fcebefb	cmk130qz40000l704z6fc2alp	2026-01-16 05:08:22.061	2026-01-16 05:08:22.061
cmkghdr1m0001l204lujtmtiu	RR	Khuntia 	9437130022	rrkhuntia@gmail.com	BARMUNDA	6969d6a6cad0478a8fcf292d	cmk130qz40000l704z6fc2alp	2026-01-16 06:11:50.699	2026-01-16 06:11:50.699
cmkghl79k0001l704rtqymfpz	Pratyush 	Mallick 	94348596673	sulaganarath11@gmail.com	\N	6969d802cad0478a8fcf2cf9	cmk130qz40000l704z6fc2alp	2026-01-16 06:17:38.313	2026-01-16 06:17:38.313
cmkgho39s0001jr04miom602i	Pratyush 	Mallick 	9348516673	sulaganarath11@gmail.com	\N	6969d889cad0478a8fcf2e4a	cmk130qz40000l704z6fc2alp	2026-01-16 06:19:53.104	2026-01-16 06:21:02.876
cmkgjz0mo0001l204b04tvgu2	Swapneswar	Dey	7718865732	swapneswar@gmail.com	Bbsr 	6969e7a6cad0478a8fcf7567	cmk130qz40000l704z6fc2alp	2026-01-16 07:24:22.128	2026-01-16 07:24:22.128
cmkgofiga0001k404g4dyt0rb	Nirupama	Samal	8249735852	\N	BHUBANESWAR 	696a04e679400262e43f4dc1	cmk130qz40000l704z6fc2alp	2026-01-16 09:29:10.186	2026-01-16 09:29:10.186
cmkgoio1f0006k404nuqbg7z5	Subham	Mishra	7008017647	\N	Salepur	696a057979400262e43f4f52	cmk130qz40000l704z6fc2alp	2026-01-16 09:31:37.395	2026-01-16 09:31:37.395
cmkgpaqt50001l804hfwb0y5l	Aman	Behera	7853970098	\N	\N	696a0a9779400262e43f70fe	cmk130qz40000l704z6fc2alp	2026-01-16 09:53:27.354	2026-01-16 09:53:27.354
cmkgps2fd0001jv04m964b40j	Sk	Pattnaik	9853514344	\N	\N	696a0dbf79400262e43f8f28	cmk130qz40000l704z6fc2alp	2026-01-16 10:06:55.562	2026-01-16 10:06:55.562
cmkgpymg70001js04rhs0lb7m	Subhra sikha	Behera	8480425226	\N	\N	696a0ef179400262e43f9bd2	cmk130qz40000l704z6fc2alp	2026-01-16 10:12:01.448	2026-01-16 10:12:01.448
cmkgq0lko0006l804r2fh1ykw	Jharana	Sahoo	8249071492	\N	\N	696a0f4d79400262e43f9eab	cmk130qz40000l704z6fc2alp	2026-01-16 10:13:33.625	2026-01-16 10:13:33.625
cmkgqtl4b0001k104dbl434zm	Ajitabinash	Sahoo	9777134234	\N	\N	696a14963788bb33d29140f8	cmk130qz40000l704z6fc2alp	2026-01-16 10:36:06.059	2026-01-16 10:36:06.059
cmkgr86gc0001jr0488bsh2nt	Swadhina	Mohanty	9051314656	\N	\N	696a173e3788bb33d2914a3f	cmk130qz40000l704z6fc2alp	2026-01-16 10:47:26.893	2026-01-16 10:47:26.893
cmkgs1bzx0001ju047nddfdrx	Gurdit	Dang	9437489710	\N	\N	696a1c8f3788bb33d29162ba	cmk130qz40000l704z6fc2alp	2026-01-16 11:10:07.101	2026-01-16 11:10:07.101
cmkgs32x00001lb04ndsm1x8f	Sk	Tripathy	8249155481	\N	\N	696a1ce03788bb33d29165d3	cmk130qz40000l704z6fc2alp	2026-01-16 11:11:28.644	2026-01-16 11:11:28.644
cmkgs6fpd0001jx04mcczg8v6	Trilochan 	Dash	9438108777	\N	\N	696a1d7d3788bb33d2916789	cmk130qz40000l704z6fc2alp	2026-01-16 11:14:05.186	2026-01-16 11:14:05.186
cmkgshpki0006jx04cln9t9if	Deepak 	Dash	977760601	deepak@gmail.com	Kalarahanga		cmk130qz40000l704z6fc2alp	2026-01-16 11:22:51.187	2026-01-16 11:22:51.187
cmk5r33be0001kz04kc6yhdt8	Avtar	Panda	9668750761	xyz@utkalauto.com	Bhubaneswar		cmivgorqg00009y5iyf5y9s5b	2026-01-08 17:58:01.611	2026-01-31 15:06:59.121
cmkgst0qw0001ju04ljlver0q	Litu	Tudu	7077412342	\N	\N	696a219a3788bb33d291a212	cmk130qz40000l704z6fc2alp	2026-01-16 11:31:38.888	2026-01-16 11:31:38.888
cmkgsu8wx000bjx04uelm9nmk	SR	Jena	9438682403	\N	\N	696a21d43788bb33d291a391	cmk130qz40000l704z6fc2alp	2026-01-16 11:32:36.13	2026-01-16 11:32:36.13
cmkgsvmk60006ju04f93znxkb	Ramakanta	Sethi	9937327704	\N	\N	696a22143788bb33d291a463	cmk130qz40000l704z6fc2alp	2026-01-16 11:33:40.47	2026-01-16 11:33:40.47
cmkgswwh40006ju04oe9nqn7h	Santosh	Biswal	7735224455	\N	\N	696a224f3788bb33d291a578	cmk130qz40000l704z6fc2alp	2026-01-16 11:34:39.977	2026-01-16 11:34:39.977
cmkgu1elj0001l4041s2tkat1	Ranjit kumar	Senapati	9237505777	\N	\N	696a29b1554db7fc632131ef	cmk130qz40000l704z6fc2alp	2026-01-16 12:06:09.703	2026-01-16 12:06:09.703
cmkguy3kn0001i8042zi1pii0	Biswaprakash	Sahoo	7008933590	\N	\N	696a2fa7554db7fc632164bb	cmk130qz40000l704z6fc2alp	2026-01-16 12:31:35.063	2026-01-16 12:31:35.063
cmkgve3460001jz04css1msno	Priyaranjan	Acharya	8328928152	\N	\N	696a32904c1c41ad862fce77	cmk130qz40000l704z6fc2alp	2026-01-16 12:44:00.967	2026-01-16 12:44:00.967
cmkhznylz0001i804gycz1xdp	ASWINI 	DAS	7978635345	aswini@gmail.com	POKHARIPUT		cmk130qz40000l704z6fc2alp	2026-01-17 07:31:26.327	2026-01-17 07:31:26.327
cmkhzqvfp0006i804wfba3bnh	RANJIT	PRADHAN 	8328906606	ranjit@gmail.com	PATIA	696b3b56b72257ef1ee7b31e	cmk130qz40000l704z6fc2alp	2026-01-17 07:33:42.181	2026-01-17 07:33:42.181
cmkhzs6fj0001l4049nt835vb	SUBHAM	BISWAL	7978770585	subham@gmail.com	OLDTOWN 	6964e7c4f5d2f8f3c8764fb7	cmk130qz40000l704z6fc2alp	2026-01-17 07:34:43.087	2026-01-17 07:34:43.087
cmkhztdh00001lh04tkk42ueg	SANTOSH KUMAR 	DAS	8249984008	Santoshkumar@gmail.com	BHUBANESWAR 	696b3bcab72257ef1ee7b426	cmk130qz40000l704z6fc2alp	2026-01-17 07:35:38.868	2026-01-17 07:35:38.868
cmkhzvusg000bi804l6ss9e80	YOGESH 	SARLIA	9437485551	yogesh@gmail.com	BHUBANESWAR 	696b3c3eb72257ef1ee7b547	cmk130qz40000l704z6fc2alp	2026-01-17 07:37:34.624	2026-01-17 07:37:34.624
cmki0g5wk000gi804mc84spz8	SADANANDA	SAHOO	7008169264	sadananda@gmail.com	POKHARIPUT 	696b3ff2b72257ef1ee7c014	cmk130qz40000l704z6fc2alp	2026-01-17 07:53:22.149	2026-01-17 07:53:22.149
cmki4e4ev0001la04ciiga9zy	RUPELIKA	MOHAPATRA	7008114672	rupelika@gmail.com	CUTTACK 	696b59d1f9ed9203c0a88475	cmk130qz40000l704z6fc2alp	2026-01-17 09:43:45.368	2026-01-17 09:43:45.368
cmki509l70001l704via59vid	DEBASISH 	BALIARSINGH 	7008512324	debasish@gmail.com	TAMANDO	696b5ddaf9ed9203c0a89a0f	cmk130qz40000l704z6fc2alp	2026-01-17 10:00:58.508	2026-01-17 10:00:58.508
cmki51mwo0001jl04rw0n998s	PRADIPTA KUMAR 	PANDA	9040007761	pradipta@gmail.com	BALESWAR	696b5e1af9ed9203c0a89b20	cmk130qz40000l704z6fc2alp	2026-01-17 10:02:02.425	2026-01-17 10:02:02.425
cmki5dd4o0006jl04rm5k97ee	PRATYUSH	Nayak	9777795018	nayakpratyush514@gmail.com	CDA Sec 9	696b603df9ed9203c0a8a964	cmk130qz40000l704z6fc2alp	2026-01-17 10:11:09.624	2026-01-17 10:11:09.624
cmki5gagr0006l704r81k7tcp	ANSUMAN	SWAIN	7978318578	anshuleo1993@gmail.com	Mission Road	696b60c6f9ed9203c0a8acfd	cmk130qz40000l704z6fc2alp	2026-01-17 10:13:26.139	2026-01-17 10:13:26.139
cmki5nbw30001l8040ljcy17t	PRATYUSH 	CHHOTRAY 	7008560426	pratyush@gmail.com	SAHIDNAGAR 	696b620ef9ed9203c0a8b382	cmk130qz40000l704z6fc2alp	2026-01-17 10:18:54.579	2026-01-17 10:18:54.579
cmki864gg0001jv04hjy1zebj	SITI KANTA	DAS 	9938882143	sitikanta@gmail.com	SUBHAGYANAGAR 	696b729af9ed9203c0a91606	cmk130qz40000l704z6fc2alp	2026-01-17 11:29:30.638	2026-01-17 11:29:30.638
cmki89j3m0001l504o2a776nm	KRUSHNA CHANDRA 	DAS	7008933301	krushnachandra@gmail.com	JATANI	696b7339f9ed9203c0a9198e	cmk130qz40000l704z6fc2alp	2026-01-17 11:32:09.587	2026-01-17 11:32:09.587
cmki8a5yp0006jv040ztmu10t	SABYASACHI 	PATTANAIK	8763857867	jaseswari2014@gmail.com	Pokhariput BBSR	696b7357f9ed9203c0a91ac8	cmk130qz40000l704z6fc2alp	2026-01-17 11:32:39.218	2026-01-17 11:32:39.218
cmki8aig10001ii04asdw9o2x	MITHUN 	MARANDI	7077481334	mithun@gmail.com	BARANGA	696b7367f9ed9203c0a91b77	cmk130qz40000l704z6fc2alp	2026-01-17 11:32:55.393	2026-01-17 11:32:55.393
cmki8xkyi000bjv04990tde3e	PRASANT KUMAR 	NAYAK 	7735320664	prasantkumar@gmail.com	BARMUNDA 	696b779bf9ed9203c0a9290a	cmk130qz40000l704z6fc2alp	2026-01-17 11:50:51.738	2026-01-17 11:50:51.738
cmki9afpe000gjv04fkre4nk0	GURU PRASAD	NAYAK 	8249999560	guruprasad@gmail.com	KIIT SQUARE 	696b79f3f9ed9203c0a930fb	cmk130qz40000l704z6fc2alp	2026-01-17 12:00:51.458	2026-01-17 12:00:51.458
cmkiaoa700001l704ml1wsbr4	Priyabrat	Mishra 	7609007340	priyabrat@gmail.com	Bbsr 	696b8309f9ed9203c0a94bb1	cmk130qz40000l704z6fc2alp	2026-01-17 12:39:37.116	2026-01-17 12:39:37.116
cmks3pjqo0026ns0kbkmeuo8v	Prabhat	Pradhan	9778342646	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:22:20.593	2026-01-24 09:22:20.593
cmks3rab8002ans0k4i90m8af	Partha	Mohanty	9861950095	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:23:41.685	2026-01-24 09:23:41.685
cmks3sugq002ens0kwrm7k437	Prakash	Behera	9124555338	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:24:54.458	2026-01-24 09:24:54.458
cmks4ac1s002mns0kb0v963o3	Kiran	Shinde	7738362908	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:38:30.4	2026-01-24 09:38:30.4
cmks4bfvy002qns0kz2h09g8x	Mohit kumar	Jena	9437116005	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:39:22.031	2026-01-24 09:39:22.031
cmks4czqi002uns0k4l0n22y7	Sidheswar	Swain	9439633346	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:40:34.41	2026-01-24 09:40:34.41
cmks4fscg002yns0kg0g2z1xg	Anubhav	Pani	8917478344	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:42:44.8	2026-01-24 09:42:44.8
cmks4h1u80032ns0kjunqw8ji	Bharadwaj	Sahoo	7008242993	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:43:43.76	2026-01-24 09:43:43.76
cmks4ii620036ns0kl6d3fttc	Pratyusha	Badapanda	7894727610	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:44:51.579	2026-01-24 09:44:51.579
cmks4lg1u003ans0k09lv6s01	Sangeeta	Mohapatra	9438183925	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:47:08.802	2026-01-24 09:47:08.802
cmks4n7e0003ens0ksxz7wfyl	Brajesh	Parija	9777662904	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:48:30.888	2026-01-24 09:48:30.888
cmks52u81003ins0kihoancnd	Gourav	Digal	9861754189	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 10:00:40.321	2026-01-24 10:00:40.321
cmks55rks003mns0kod372s9z	Aditya	Anad	9178721399	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 10:02:56.86	2026-01-24 10:02:56.86
cmks5a4j6003qns0kagw14lrx	Subhranshu	Dehury	9090677177	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 10:06:20.274	2026-01-24 10:06:20.274
cmks5co7b003uns0k5h14ew5w	Gopi	Nayak	9490429524	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 10:08:19.079	2026-01-24 10:08:19.079
cmks5v298003yns0krhe3c09w	Jyoti ranjan	Chhotray	7381079497	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 10:22:37.1	2026-01-24 10:22:37.1
cmks5w4hg0042ns0kkb338cp5	Arun	Digal	9827735445	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 10:23:26.645	2026-01-24 10:23:26.645
cmks6kug00046ns0kcnevq02f	Arjun	Parmeet	7205844518	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 10:42:40.033	2026-01-24 10:42:40.033
cmks71b1q004ans0k811e4ej3	Jitendra Kumar 	Mishra	9040094612	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 10:55:28.047	2026-01-24 10:55:28.047
cmks72llb004ens0k3a8rpqto	Subhadra	Jethy	8457981950	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 10:56:28.367	2026-01-24 10:56:28.367
cmks7bhd0004ins0kb4hl9xle	Asish 	Behera	7008339393	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:03:22.788	2026-01-24 11:03:22.788
cmks7ezzs004mns0kx0aydqmj	Satyajit 	Marndi 	9438367507	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:06:06.904	2026-01-24 11:06:06.904
cmks7gy43004qns0k52lr6f9j	Ashutosh	.	7787999727	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:07:37.779	2026-01-24 11:07:37.779
cmks7j3z8004uns0klquunnvm	Chittaranjan	.	9776211796	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:09:18.692	2026-01-24 11:09:18.692
cmks7kukt004yns0kw7mjg93v	Sanatan 	. 	7008821481	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:10:39.822	2026-01-24 11:10:39.822
cmks7mjwb0052ns0kan4t0ygl	Vaskar	Pradhan	7008301400	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:11:59.291	2026-01-24 11:11:59.291
cmks7p4bj005ans0kzqvcgxhl	Subham 	Jena	9078639596	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:13:59.072	2026-01-24 11:13:59.072
cmks7nzo80056ns0kksv854rf	Diptirani	Samal	9692066370	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:13:06.392	2026-01-24 11:13:06.392
cmks7qlfb005ens0k6ssa8ofm	Asish kumar 	Mallick 	8766325089	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:15:07.895	2026-01-24 11:15:07.895
cmks7rz01005ins0kfk09qltw	Prasant kumar 	Panda	9437518241	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:16:12.146	2026-01-24 11:16:12.146
cmks7t784005mns0kizjth984	Quantum 	Global 	9776613427	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:17:09.46	2026-01-24 11:17:09.46
cmks7ue4r005qns0kz9qy8o3e	Bk	Padhi 	9861109810	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:18:05.067	2026-01-24 11:18:05.067
cmks7vxr8005uns0kw5ugl4mz	Amrit 	Pattnaik 	9090966282	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:19:17.157	2026-01-24 11:19:17.157
cmks7xiju005yns0k64aajn97	Manoj Kumar 	Behera 	9937327173	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:20:30.762	2026-01-24 11:20:30.762
cmks7yxeg0062ns0kpofb070v	Manoj	Senapati 	9777175718	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:21:36.665	2026-01-24 11:21:36.665
cmks80fio0066ns0knbnn4u4n	Manas	Bichhanand	7855007508	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:22:46.8	2026-01-24 11:22:46.8
cmks81gbi006ans0kj3r32xmx	Rashmi	Ranjan 	7978422022	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:23:34.494	2026-01-24 11:23:34.494
cmks82k59006ens0k4u2a2rnz	Biswaranjan 	Mohapatra	7978229011	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:24:26.11	2026-01-24 11:24:26.11
cmks83p3j006ins0kxpffspbr	Arun kumar 	Sahoo 	7978466066	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:25:19.183	2026-01-24 11:25:19.183
cmks850jr006mns0kte9i32at	Arpit kumar 	Tripathy 	7978159735	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:26:20.68	2026-01-24 11:26:20.68
cmks877wj006qns0k8ro65ly8	Binod  	kumar	9360080525	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:28:03.523	2026-01-24 11:28:03.523
cmks88hvt006uns0kllcys5oj	Umakanta 	Panigrahi	7008201055	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:29:03.113	2026-01-24 11:29:03.113
cmks8arjs006yns0kj6yliy8e	Rou	Interio	6370125394	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:30:48.953	2026-01-24 11:30:48.953
cmks8qbrw0072ns0kydswnfe0	Pradeep Kumar 	Guru 	8327763352	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:42:55.005	2026-01-24 11:42:55.005
cmks8rho40076ns0kvcvh0rll	Hadibandhu	Tudu 	7008278508	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 11:43:49.301	2026-01-24 11:43:49.301
cmks9vyt4007ans0kdb7i29fg	Piyush 	Dash 	7846832142	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 12:15:17.752	2026-01-24 12:15:17.752
cmksbhb6y007ens0kuza1ah72	Sanu	Khan	7978663539	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-01-24 12:59:53.194	2026-01-24 12:59:53.194
cmkw5uvos007ins0kcb31wavn	SASHIKANTA 	DAS	8984543371	shashikant@gmail.com	ANUGUL 	\N	cmk130qz40000l704z6fc2alp	2026-01-27 05:33:33.292	2026-01-27 05:33:33.292
cmkw6sbrr007mns0kpk6issef	SANJAY	MAHAPATRA 	9937029321	Sanjay@gmail.com	PIPILI 	\N	cmk130qz40000l704z6fc2alp	2026-01-27 05:59:33.784	2026-01-27 05:59:33.784
cmkw9r5y9007qns0kuudg7ndn	SUNIL KUMAR 	AGARWAL 	7978352109	sunilkumar@gmail.com	VSS NAGAR 	\N	cmk130qz40000l704z6fc2alp	2026-01-27 07:22:38.434	2026-01-27 07:22:38.434
cmkw9sq1x007uns0k8h752706	DEBASISH 	BEHERA 	7008042196	debasish@gmail.com	BHUBANESWAR 	\N	cmk130qz40000l704z6fc2alp	2026-01-27 07:23:51.142	2026-01-27 07:23:51.142
cmkwb8iio00e4ns0kqfz8299g	PRATYUSH	PANDA	9658802989	pratyush@gmail.com	PATIA	\N	cmk130qz40000l704z6fc2alp	2026-01-27 08:04:07.489	2026-01-27 08:04:07.489
cmkweyyzi00e8ns0k3dkgkx66	SAROJ 	PANDA	7205040408	saroj@gmail.com	BOMIKHAL	\N	cmk130qz40000l704z6fc2alp	2026-01-27 09:48:40.735	2026-01-27 09:48:40.735
cmkf24vxl0001l404ve151myk	DIPU RANJAN 	MOHANTY 	9861438167	dipuranjan@gmail.com	BHUBANESWAR 	696725fcc8563e92f693265b	cmk130qz40000l704z6fc2alp	2026-01-15 06:17:16.713	2026-01-28 05:58:38.924
cmkxn76tv002fr10lzmtxjv3h	PRADYUMNA 	SAHOO 	7847090115	pradyumna@gmail.com	INFOCITY 	\N	cmk130qz40000l704z6fc2alp	2026-01-28 06:26:47.252	2026-01-28 06:26:47.252
cmkxyrafs002jr10ly2c3vjg3	HARDIK	VERMA	7003535428	hardik@gmail.com	LAXMISAGAR 	\N	cmk130qz40000l704z6fc2alp	2026-01-28 11:50:20.824	2026-01-28 11:50:20.824
cmkxytyv4002nr10l25zrcyl1	JOGESH CHANDRA 	JENA	9124123534	jogeshchandra@gmail.com	BJB NAGAR 	\N	cmk130qz40000l704z6fc2alp	2026-01-28 11:52:25.793	2026-01-28 11:52:25.793
cmky02iii002rr10lx4p1wjuk	DILLIP KUMAR 	PAL 	7978914065	dillipkumar@gmail.com	RASULGARH 	\N	cmk130qz40000l704z6fc2alp	2026-01-28 12:27:04.122	2026-01-28 12:27:04.122
cmkz3a0ck0000me0k6imezv4u	ASISH KUMAR 	JENA	6370052618	asishkumar@gmail.com	BHUBANESWAR 	\N	cmk130qz40000l704z6fc2alp	2026-01-29 06:44:38.852	2026-01-29 06:44:38.852
cmkz3oyp60004me0kuwph5ziz	AMITASH	PATRA	7377519434	amitash@gmail.com	PATIA	\N	cmk130qz40000l704z6fc2alp	2026-01-29 06:56:16.554	2026-01-29 06:56:16.554
cmkz3ysxv0008me0kshje9jhl	SANTOSH 	SAHOO	9337229567	Santosh@gmail.com	PATIA	\N	cmk130qz40000l704z6fc2alp	2026-01-29 07:03:55.652	2026-01-29 07:03:55.652
cmkz45yqa000cme0kjidp94fa	GURU PRASAD	MOHANTY 	8457006691	guruprasad@gmail.com	KESHURA	\N	cmk130qz40000l704z6fc2alp	2026-01-29 07:09:29.747	2026-01-29 07:09:29.747
cmkz63xs7000gme0k4q4czxo7	DR ABHISHEK 	SWAIN 	9827451414	abhisek@gmail.com	CUTTACK 	\N	cmk130qz40000l704z6fc2alp	2026-01-29 08:03:54.44	2026-01-29 08:03:54.44
cmkzc02lg000kme0kmu0tnkmj	SOUMYARANJAN 	MAHAPATRA 	7978811386	soumyaranjan@gmail.com	CUTTACK 	\N	cmk130qz40000l704z6fc2alp	2026-01-29 10:48:51.748	2026-01-29 10:48:51.748
cmkzc1808000ome0k4etvn3c2	AMIT KUMAR 	BEHERA 	8018915060	amitkumar@gmail.com	BALIANTA	\N	cmk130qz40000l704z6fc2alp	2026-01-29 10:49:45.416	2026-01-29 10:49:45.416
cmkzd99pq000sme0ksiymgd4p	SHIVAM	JAISWAL 	7205371758	shivam@gmail.com	BHUBANESWAR 	\N	cmk130qz40000l704z6fc2alp	2026-01-29 11:24:00.494	2026-01-29 11:24:00.494
cmkze9mtc000wme0ki4xbnz1q	SWAYAM	SAHOO	9078187393	swayam@gmail.com	RASULGARH 	\N	cmk130qz40000l704z6fc2alp	2026-01-29 11:52:17.088	2026-01-29 11:52:17.088
cml0fm1ft0000po0kyzvwnqp4	SUBASH CHANDRA 	MISHRA 	9439140270	subashchandra@gmail.com	JAJPUR 	\N	cmk130qz40000l704z6fc2alp	2026-01-30 05:17:41.705	2026-01-30 05:17:41.705
cml0hvtjz0006po0kdn64gdax	SUBHAM	KUNDU	7978523283	subham@gmail.com	NUAPATNA	\N	cmk130qz40000l704z6fc2alp	2026-01-30 06:21:17.279	2026-01-30 06:21:17.279
cml0kdmv5004ypo0k6lpsjfce	R	MAHAPATRA 	9437371077	rmahapatra@gmail.com	BOMIKHAL 	\N	cmk130qz40000l704z6fc2alp	2026-01-30 07:31:07.649	2026-01-30 07:31:07.649
cml0ky4ci0052po0kwovp5x2x	VISHAL	PAIKARAY 	9776685777	vishal@gmail.com	JATANI	\N	cmk130qz40000l704z6fc2alp	2026-01-30 07:47:03.427	2026-01-30 07:47:03.427
cml0kzttm0056po0kdvcldb4q	DUSMANTA KUMAR 	BISWAL	9337762481	dusmantakumar@gmail.com	MANCHESWAR 	\N	cmk130qz40000l704z6fc2alp	2026-01-30 07:48:23.099	2026-01-30 07:48:23.099
cmk55ljp20001js0412fftmc0	Rakesh 	swain	7978585992	swainr168@gmail.com	bbsr	6939306b32ca55336d785d29	cmk130qz40000l704z6fc2alp	2026-01-08 07:56:31.094	2026-01-30 08:15:47.1
cml0prktt005dpo0kvuge4xoc	LOKANATH	SAHOO	8763935805	lokanath@gmail.com	BHUBANESWAR 	\N	cmk130qz40000l704z6fc2alp	2026-01-30 10:01:56.273	2026-01-30 10:01:56.273
cml0q4otg005rpo0kirt6xc6x	MANOJ	PRADHAN	7978446618	manojpradhan9994@gmail.com	JAYDEVBIHAR	\N	cmk130qz40000l704z6fc2alp	2026-01-30 10:12:07.973	2026-01-30 10:12:07.973
cml0q9e7i005vpo0kbzrr7got	PRABOD 	MOHANTY 	9348526528	prabod@gmail.com	BBSR	\N	cmk130qz40000l704z6fc2alp	2026-01-30 10:15:47.502	2026-01-30 10:15:47.502
cml0rfe4g005zpo0k98ndy959	SATYA	BRATA	7751982493	satyabrata@gmail.com	BHUBANESWAR 	\N	cmk130qz40000l704z6fc2alp	2026-01-30 10:48:26.944	2026-01-30 10:48:26.944
cmkzge5qv0010me0ku74ykiz3	Abhilash	Panda	9090090150	abhilash.panda8383@gmail.com	Bhubaneswar	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-29 12:51:47.48	2026-01-31 15:06:59.121
cml1vlqmb0003qi0kef5m6see	SR	BISWAL	9776361774	srbiswal@gmail.com	CUTTACK 	\N	cmk130qz40000l704z6fc2alp	2026-01-31 05:33:07.714	2026-01-31 05:33:07.714
cml1wuvqj0009qi0k4l8w75cd	ANIL KUMAR 	SAHOO 	7064080455	anilkumar@gmail.com	PATIA	\N	cmk130qz40000l704z6fc2alp	2026-01-31 06:08:13.867	2026-01-31 06:08:13.867
cml1zwzu4000hqi0kyztfk397	KISHORE GOPAL	PRUSTY 	8249781106	Kishore@gmail.com	PURI	\N	cmk130qz40000l704z6fc2alp	2026-01-31 07:33:51.34	2026-01-31 07:33:51.34
cml1zxyjs000lqi0kcwshkhjd	BHAGABAN 	PATRA 	8337974957	bhagaban@gmail.com	BHUBANESWAR 	\N	cmk130qz40000l704z6fc2alp	2026-01-31 07:34:36.328	2026-01-31 07:34:36.328
cml205wm4000pqi0khp2vvnbs	DEBASISH 	LENKA 	9937645872	debasish@gmail.com	CHAKEISIANI 	\N	cmk130qz40000l704z6fc2alp	2026-01-31 07:40:47.069	2026-01-31 07:40:47.069
cml20g1sm000tqi0kvysg548l	MANGARAJ 	NAYAK	9437003511	mangaraj@gmail.com	RASULGARH 	\N	cmk130qz40000l704z6fc2alp	2026-01-31 07:48:40.343	2026-01-31 07:48:40.343
cml26ix2l000xqi0k7lgnbl9j	ASWINI KUMAR 	BEHERA 	9916487352	aswini@gmail.com	NAYAPALLI 	\N	cmk130qz40000l704z6fc2alp	2026-01-31 10:38:51.885	2026-01-31 10:38:51.885
cml26k7dn0011qi0kpa8x89tj	RK	PATTANAIK 	9437352693	rkpattnaik@gmail.com	BHANJANAGAR	\N	cmk130qz40000l704z6fc2alp	2026-01-31 10:39:51.899	2026-01-31 10:39:51.899
cmks40pi3002ins0klghr7e6i	BIJAY	KUMAR	7572041364	bijaykumar@gmail.com	CHANDRASEKHARPUR 	\N	cmk130qz40000l704z6fc2alp	2026-01-24 09:31:01.275	2026-01-31 10:44:37.325
cml28kbyj0018qi0k5vt1l1hr	DURGA PRASAD 	MAHAPATRA	9840295664	durgaprasad@gmail.com	KALINGA VIHAR 	\N	cmk130qz40000l704z6fc2alp	2026-01-31 11:35:57.067	2026-01-31 11:35:57.067
cmk869o2r0001ld04qfh0bzww	Ajit	Bhai	8981446268	abhilash.panda8654@gmail.com	bhubaneswar	69622c2af5d2f8f3c86a8b21	cmivgorqg00009y5iyf5y9s5b	2026-01-10 10:38:35.043	2026-01-31 15:06:59.121
cmk86kfjn000ald04u0s9budk	Madhusmita	Parida	9337938937	abhilash.panda8654@gmail.com	Bomikhal	69622e21f5d2f8f3c86a93d0	cmivgorqg00009y5iyf5y9s5b	2026-01-10 10:46:57.204	2026-01-31 15:06:59.121
cml4sfou60000qn0ket396i0e	SANDEEP KUMAR 	JENA	7978412955	sandeep@gmail.com	JAJPUR 	\N	cmk130qz40000l704z6fc2alp	2026-02-02 06:27:45.15	2026-02-02 06:27:45.15
cml4sqe4k0004qn0kzolrnzai	RASHMIRANJAN 	MAHAPATRA	9937755166	rashmiranjan@gmail.com	HANSPAL 	\N	cmk130qz40000l704z6fc2alp	2026-02-02 06:36:04.484	2026-02-02 06:36:04.484
cml4vlm4i0008qn0kuejqwxfo	SATISH	TRIPATHY 	8984445045	satish@gmail.com	DHAULI	\N	cmk130qz40000l704z6fc2alp	2026-02-02 07:56:20.418	2026-02-02 07:56:20.418
cml4xhbaj000cqn0kl4vn2f1g	Asit	PATTANAIK	7873166517	asit317@gmail.com	Athagarh 	\N	cmk130qz40000l704z6fc2alp	2026-02-02 08:48:58.987	2026-02-02 08:48:58.987
cml4y7jyc000gqn0kw72wps5t	G	SAHOO 	9937079880	gsahoo@gmail.com	BHUBANESWAR 	\N	cmk130qz40000l704z6fc2alp	2026-02-02 09:09:23.268	2026-02-02 09:09:23.268
cml50dw96000kqn0kebkgrfev	BEHERA 	TRAVELS	8249415101	beheratravels@gmail.com	ANUGUL 	\N	cmk130qz40000l704z6fc2alp	2026-02-02 10:10:18.377	2026-02-02 10:10:18.377
cml50up3p000oqn0kf6h9n08m	SISIRA	PANDA 	9903974747	sisira@gmail.com	Luis Road	\N	cmk130qz40000l704z6fc2alp	2026-02-02 10:23:22.262	2026-02-02 10:23:22.262
cml51im0b000sqn0kz9v38jlw	HITESH KUMAR	ONDHIA	9937025851	hiteshkumar@gmail.com	PATIA	\N	cmk130qz40000l704z6fc2alp	2026-02-02 10:41:57.996	2026-02-02 10:41:57.996
cml51k3mp000wqn0kehga9zfw	N C	BEHERA	8456827889	ncbehera@gmail.com	PATIA	\N	cmk130qz40000l704z6fc2alp	2026-02-02 10:43:07.489	2026-02-02 10:43:07.489
cml53ua5f0012qn0kp0zka8wj	DEBASMITA 	SAHOO	9668847013	debasmita@gmail.com	GHATIKIA	\N	cmk130qz40000l704z6fc2alp	2026-02-02 11:47:01.731	2026-02-02 11:47:01.731
cml65cjvc0094qn0kysfcjc54	SUJIT	PARIJA	7008000034	sujit@gmail.com	PURI 	\N	cmk130qz40000l704z6fc2alp	2026-02-03 05:16:59.928	2026-02-03 05:16:59.928
cml68tirs0099qn0kodlss6bo	RK	MISHRA 	9449022720	rkmishra@gmail.com	BHUBANESWAR 	\N	cmk130qz40000l704z6fc2alp	2026-02-03 06:54:10.503	2026-02-03 06:54:10.503
cml696hmg009hqn0kc361cyyh	jyotiprakash	swain	9040099131	ijpswain@gmail.com	BBSR	\N	cmk130qz40000l704z6fc2alp	2026-02-03 07:04:15.545	2026-02-03 07:04:15.545
cml69bcrg009qqn0kqckbqed7	ss	jj	8327793515	\N	\N	\N	cmivgorqg00009y5iyf5y9s5b	2026-02-03 07:08:02.525	2026-02-03 07:08:02.525
cml6i9q2g00alqn0k26sqgcxn	RAHUL 	AGARWAL 	9778924765	\N	\N	\N	cmk130qz40000l704z6fc2alp	2026-02-03 11:18:43	2026-02-03 11:18:43
cml6il2l800apqn0kdgwqmb8w	PRAKASH RANJAN 	ACHARYA 	8917371255	\N	BHARATPUR 	\N	cmk130qz40000l704z6fc2alp	2026-02-03 11:27:32.444	2026-02-03 11:27:32.444
cml6l07yi00avqn0khbas2mlp	DR SUNIL 	MAHAPATRA	9437460806	\N	BARMUNDA	\N	cmk130qz40000l704z6fc2alp	2026-02-03 12:35:18.474	2026-02-03 12:35:18.474
cml6l9q5i00azqn0k3fsh2139	AYUSHMAN 	SAHOO	6370787400	\N	HANSPAL 	\N	cmk130qz40000l704z6fc2alp	2026-02-03 12:42:41.958	2026-02-03 12:42:41.958
cml6lc9hf00b3qn0k58xsu1yz	LALIT MOHAN 	PRADHAN 	8249616433	\N	BHUBANESWAR 	\N	cmk130qz40000l704z6fc2alp	2026-02-03 12:44:40.323	2026-02-03 12:44:40.323
cmkzjt7nf00009y6syqpe044a	Anup	Pradhan	7735322819	anuppradhan929@gmail.com	bbsr	\N	cmivgorqg00009y5iyf5y9s5b	2026-01-29 14:27:28.635	2026-02-03 15:04:38.656
\.


--
-- Data for Name: VisitorInterest; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."VisitorInterest" (id, "visitorId", "modelId", "createdAt", "sessionId", "variantId") FROM stdin;
cmks3pjr40029ns0khggo6lnt	cmks3pjqo0026ns0kbkmeuo8v	cmk13nsjz0009js04ckim7hte	2026-01-24 09:22:20.608	cmks3pjr10028ns0kz0go2sy4	\N
cmks3rabd002dns0kmuuq1m10	cmks3rab8002ans0k4i90m8af	cmk5701ld0001l804ns4u58mz	2026-01-24 09:23:41.69	cmks3rabc002cns0kdckuv76v	\N
cmks3sugt002hns0keekxlk1o	cmks3sugq002ens0kwrm7k437	cmk13ondj000hjs04uli7wp7a	2026-01-24 09:24:54.461	cmks3sugs002gns0kampakaec	\N
cmks40pi8002lns0k82dlqz7b	cmks40pi3002ins0klghr7e6i	cmk13o7wv000bjs04kr6sz4b0	2026-01-24 09:31:01.281	cmks40pi6002kns0kb3oqjrus	\N
cmks4ac1z002pns0k56o990hj	cmks4ac1s002mns0kb0v963o3	cmk13mis60007js04xgg2p6bl	2026-01-24 09:38:30.407	cmks4ac1x002ons0k4k82vrsm	\N
cmks4bfw4002tns0kab29cizk	cmks4bfvy002qns0kz2h09g8x	cmk13mis60007js04xgg2p6bl	2026-01-24 09:39:22.037	cmks4bfw2002sns0k5v77e3tx	\N
cmks4czqo002xns0kpyrq7rvp	cmks4czqi002uns0k4l0n22y7	cmk13mrb90003lc04v9gamlr0	2026-01-24 09:40:34.416	cmks4czqm002wns0kry79hyxj	\N
cmks4fsck0031ns0kw0jcjbu4	cmks4fscg002yns0kg0g2z1xg	cmk13mis60007js04xgg2p6bl	2026-01-24 09:42:44.804	cmks4fscj0030ns0kxmph9e9k	\N
cmks4h1ub0035ns0kub06vu7w	cmks4h1u80032ns0kjunqw8ji	cmk5701ld0001l804ns4u58mz	2026-01-24 09:43:43.763	cmks4h1ua0034ns0k3l8wuob8	\N
cmks4ii660039ns0k155dmwty	cmks4ii620036ns0kl6d3fttc	cmk13mis60007js04xgg2p6bl	2026-01-24 09:44:51.582	cmks4ii650038ns0kwwew0aa7	\N
cmks4lg1y003dns0k541xxqv3	cmks4lg1u003ans0k09lv6s01	cmk13o7wv000bjs04kr6sz4b0	2026-01-24 09:47:08.806	cmks4lg1x003cns0k6cqehypb	\N
cmks4n7e4003hns0k0l6o69p6	cmks4n7e0003ens0ksxz7wfyl	cmk13mis60007js04xgg2p6bl	2026-01-24 09:48:30.892	cmks4n7e2003gns0kf5hrwist	\N
cmks52u88003lns0kukxlioud	cmks52u81003ins0kihoancnd	cmk13n14k000fjs04n7s2wdb7	2026-01-24 10:00:40.328	cmks52u86003kns0k2fkuz6k4	\N
cmks55rky003pns0k2hxvbc1i	cmks55rks003mns0kod372s9z	cmk13o7wv000bjs04kr6sz4b0	2026-01-24 10:02:56.866	cmks55rkw003ons0kucogxly9	\N
cmks5a4jb003tns0kg8r1f6td	cmks5a4j6003qns0kagw14lrx	cmk13mis60007js04xgg2p6bl	2026-01-24 10:06:20.279	cmks5a4j9003sns0k4bzc8sqp	\N
cmks5co7e003xns0ksxk9yd4c	cmks5co7b003uns0k5h14ew5w	cmk5701ld0001l804ns4u58mz	2026-01-24 10:08:19.083	cmks5co7d003wns0kkccp71hx	\N
cmks5v29d0041ns0kjoqkaaim	cmks5v298003yns0krhe3c09w	cmk13o7wv000bjs04kr6sz4b0	2026-01-24 10:22:37.106	cmks5v29b0040ns0krsv97emv	\N
cmks5w4hk0045ns0kdhlobvmd	cmks5w4hg0042ns0kkb338cp5	cmk13mrb90003lc04v9gamlr0	2026-01-24 10:23:26.649	cmks5w4hj0044ns0kc90c8v10	\N
cmks6kug50049ns0kqhnuqhkw	cmks6kug00046ns0kcnevq02f	cmk13mis60007js04xgg2p6bl	2026-01-24 10:42:40.038	cmks6kug40048ns0kf88ozsq1	\N
cmks71b1v004dns0kvk1he5l9	cmks71b1q004ans0k811e4ej3	cmk13o7wv000bjs04kr6sz4b0	2026-01-24 10:55:28.052	cmks71b1u004cns0kw0xadcti	\N
cmks72llg004hns0kj0sue4sn	cmks72llb004ens0k3a8rpqto	cmk13mrb90003lc04v9gamlr0	2026-01-24 10:56:28.372	cmks72lle004gns0krgk09jgs	\N
cmks7bhdf004lns0kyg391vdv	cmks7bhd0004ins0kb4hl9xle	cmk13o7wv000bjs04kr6sz4b0	2026-01-24 11:03:22.793	cmks7bhd3004kns0kmjb4k5iq	\N
cmks7ezzv004pns0kfwid1zt5	cmks7ezzs004mns0kx0aydqmj	cmk13mis60007js04xgg2p6bl	2026-01-24 11:06:06.907	cmks7ezzu004ons0kbt2vrpq7	\N
cmks7gy49004tns0kz8pih1zs	cmks7gy43004qns0k52lr6f9j	cmk56v3sb0001jp04h73ijrbf	2026-01-24 11:07:37.786	cmks7gy47004sns0kb1guf25w	\N
cmks7j3zd004xns0kz7oou28d	cmks7j3z8004uns0klquunnvm	cmk13nkwk0001js04czooodij	2026-01-24 11:09:18.697	cmks7j3zc004wns0kisss0lok	\N
cmks7kuky0051ns0kf8yghw9b	cmks7kukt004yns0kw7mjg93v	cmk13mrb90003lc04v9gamlr0	2026-01-24 11:10:39.827	cmks7kukx0050ns0ksgcbv9do	\N
cmks7mjwf0055ns0knt7lk22d	cmks7mjwb0052ns0kan4t0ygl	cmk13mis60007js04xgg2p6bl	2026-01-24 11:11:59.296	cmks7mjwe0054ns0kt915gk15	\N
cmks7nzob0059ns0khd36h66b	cmks7nzo80056ns0kksv854rf	cmk13mis60007js04xgg2p6bl	2026-01-24 11:13:06.396	cmks7nzoa0058ns0ktjfluax8	\N
cmks7p4bn005dns0kpud8ctra	cmks7p4bj005ans0kzqvcgxhl	cmk13mis60007js04xgg2p6bl	2026-01-24 11:13:59.075	cmks7p4bm005cns0krgi14wqz	\N
cmks7qlfh005hns0k3qv0ibhh	cmks7qlfb005ens0k6ssa8ofm	cmk13mis60007js04xgg2p6bl	2026-01-24 11:15:07.901	cmks7qlff005gns0kyze2dpfn	\N
cmks7rz06005lns0k5hxf5dcx	cmks7rz01005ins0kfk09qltw	cmk13n14k000fjs04n7s2wdb7	2026-01-24 11:16:12.15	cmks7rz05005kns0kbqi4wv2e	\N
cmks7t788005pns0k9vgaw00u	cmks7t784005mns0kizjth984	cmk13nkwk0001js04czooodij	2026-01-24 11:17:09.464	cmks7t787005ons0k234o67yr	\N
cmks7ue4u005tns0k6gdve6w5	cmks7ue4r005qns0kz9qy8o3e	cmk13o7wv000bjs04kr6sz4b0	2026-01-24 11:18:05.07	cmks7ue4t005sns0krxahkonk	\N
cmks7vxrd005xns0k70x0g7yu	cmks7vxr8005uns0kw5ugl4mz	cmk13mrb90003lc04v9gamlr0	2026-01-24 11:19:17.161	cmks7vxrc005wns0khbzgt0m7	\N
cmks7xik20061ns0kbf858q78	cmks7xiju005yns0k64aajn97	cmk13o7wv000bjs04kr6sz4b0	2026-01-24 11:20:30.77	cmks7xijz0060ns0kvf9rh5tl	\N
cmks7yxel0065ns0kdoewdhpi	cmks7yxeg0062ns0kpofb070v	cmk13ondj000hjs04uli7wp7a	2026-01-24 11:21:36.669	cmks7yxek0064ns0kjdfm0wpb	\N
cmks80fir0069ns0kh3jj8ijs	cmks80fio0066ns0knbnn4u4n	cmk56v3sb0001jp04h73ijrbf	2026-01-24 11:22:46.804	cmks80fiq0068ns0kifj8imun	\N
cmks81gbm006dns0k0qa9wc34	cmks81gbi006ans0kj3r32xmx	cmk13n14k000fjs04n7s2wdb7	2026-01-24 11:23:34.498	cmks81gbl006cns0komjch1s0	\N
cmks82k5d006hns0k0qnhlym6	cmks82k59006ens0k4u2a2rnz	cmk56zmu30001jy04rtisk47w	2026-01-24 11:24:26.113	cmks82k5c006gns0ks66cq86h	\N
cmks83p3o006lns0ka3eslgdf	cmks83p3j006ins0kxpffspbr	cmk5701ld0001l804ns4u58mz	2026-01-24 11:25:19.188	cmks83p3m006kns0kad7s7qyi	\N
cmks850jw006pns0kdnyf70g6	cmks850jr006mns0kte9i32at	cmk13o7wv000bjs04kr6sz4b0	2026-01-24 11:26:20.684	cmks850jv006ons0kvarm1m0w	\N
cmks877wo006tns0kwp36opor	cmks877wj006qns0k8ro65ly8	cmk56v3sb0001jp04h73ijrbf	2026-01-24 11:28:03.528	cmks877wm006sns0kxfu59p8q	\N
cmks88hvy006xns0kwqe0rvq5	cmks88hvt006uns0kllcys5oj	cmk56zmu30001jy04rtisk47w	2026-01-24 11:29:03.119	cmks88hvx006wns0k936n0tav	\N
cmks8arjw0071ns0kh5hym1dv	cmks8arjs006yns0kj6yliy8e	cmk5701ld0001l804ns4u58mz	2026-01-24 11:30:48.957	cmks8arjv0070ns0kdoo3kjqd	\N
cmks8qbs30075ns0kgy7uoi3f	cmks8qbrw0072ns0kydswnfe0	cmk13mrb90003lc04v9gamlr0	2026-01-24 11:42:55.012	cmks8qbs00074ns0kp7k107j5	\N
cmks8rho90079ns0ksc3i54ic	cmks8rho40076ns0kvcvh0rll	cmk13mis60007js04xgg2p6bl	2026-01-24 11:43:49.305	cmks8rho80078ns0k3nh7qo9s	\N
cmks9vytk007dns0k2t4k6g9r	cmks9vyt4007ans0kdb7i29fg	cmk13nkwk0001js04czooodij	2026-01-24 12:15:17.758	cmks9vyt8007cns0kfx0g5vw1	\N
cmksbhb76007hns0k52nleji4	cmksbhb6y007ens0kuza1ah72	cmk13o7wv000bjs04kr6sz4b0	2026-01-24 12:59:53.202	cmksbhb73007gns0kt3ir1di7	\N
cmkw5uvpg007lns0k4g83ohj8	cmkw5uvos007ins0kcb31wavn	cmk13nkwk0001js04czooodij	2026-01-27 05:33:33.316	cmkw5uvpb007kns0kx55kg3bd	\N
cmkw6sbrz007pns0kei2bn9kq	cmkw6sbrr007mns0kpk6issef	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 05:59:33.791	cmkw6sbrw007ons0kdw9flkh0	\N
cmkw9r5yk007tns0k3bxjjlfl	cmkw9r5y9007qns0kuudg7ndn	cmk13o7wv000bjs04kr6sz4b0	2026-01-27 07:22:38.444	cmkw9r5yh007sns0k498wmnky	\N
cmkw9sq24007xns0k2udop25m	cmkw9sq1x007uns0k8h752706	cmk13nsjz0009js04ckim7hte	2026-01-27 07:23:51.148	cmkw9sq22007wns0kak6ldh8j	\N
cmkwb8iiv00e7ns0k0g2drkzq	cmkwb8iio00e4ns0kqfz8299g	cmk13nkwk0001js04czooodij	2026-01-27 08:04:07.496	cmkwb8iit00e6ns0k3nd6qgdd	\N
cmkweyyzp00ebns0k43kldmfq	cmkweyyzi00e8ns0k3dkgkx66	cmk13mis60007js04xgg2p6bl	2026-01-27 09:48:40.741	cmkweyyzn00eans0k6apus3ib	\N
cmkxm7047002er10lj0itpkoj	cmkf24vxl0001l404ve151myk	cmk13o7wv000bjs04kr6sz4b0	2026-01-28 05:58:38.935	cmkxm7044002dr10ldkk2y02h	\N
cmkxn76u2002ir10l56jpt56z	cmkxn76tv002fr10lzmtxjv3h	cmk13mis60007js04xgg2p6bl	2026-01-28 06:26:47.259	cmkxn76u0002hr10locva93tg	\N
cmkxyrag5002mr10lc2dqyrmh	cmkxyrafs002jr10ly2c3vjg3	cmk13mis60007js04xgg2p6bl	2026-01-28 11:50:20.838	cmkxyrag3002lr10lo3wf4ih1	\N
cmkxytyve002qr10lemqbrysl	cmkxytyv4002nr10l25zrcyl1	cmk5701ld0001l804ns4u58mz	2026-01-28 11:52:25.803	cmkxytyvc002pr10lar7gk336	\N
cmky02iiq002ur10ldql9ahwm	cmky02iii002rr10lx4p1wjuk	cmk13mis60007js04xgg2p6bl	2026-01-28 12:27:04.13	cmky02iio002tr10lil93efg3	\N
cmkz3a0d00003me0kpjrrzz28	cmkz3a0ck0000me0k6imezv4u	cmk13nsjz0009js04ckim7hte	2026-01-29 06:44:38.868	cmkz3a0cv0002me0kp9x4hp88	\N
cmkz3oypc0007me0kvmhcgn7e	cmkz3oyp60004me0kuwph5ziz	cmk13o7wv000bjs04kr6sz4b0	2026-01-29 06:56:16.56	cmkz3oypa0006me0kmbt31jkx	\N
cmkz3ysy1000bme0ketooln7h	cmkz3ysxv0008me0kshje9jhl	cmk13o7wv000bjs04kr6sz4b0	2026-01-29 07:03:55.657	cmkz3ysxz000ame0khy90bml4	\N
cmkz45yqg000fme0ktwt72nkr	cmkz45yqa000cme0kjidp94fa	cmk13mrb90003lc04v9gamlr0	2026-01-29 07:09:29.752	cmkz45yqe000eme0kfs6nl3sa	\N
cmkz63xsc000jme0kfqlihjrw	cmkz63xs7000gme0k4q4czxo7	cmk13o7wv000bjs04kr6sz4b0	2026-01-29 08:03:54.445	cmkz63xsb000ime0k0k5b09wl	\N
cmkzc02lx000nme0ka5on1knh	cmkzc02lg000kme0kmu0tnkmj	cmk5701ld0001l804ns4u58mz	2026-01-29 10:48:51.765	cmkzc02ls000mme0kjyzgf8ix	\N
cmkzc180c000rme0kwankqpw8	cmkzc1808000ome0k4etvn3c2	cmk56v3sb0001jp04h73ijrbf	2026-01-29 10:49:45.421	cmkzc180b000qme0kmdlt90ba	\N
cmkzd99px000vme0kvz35wt23	cmkzd99pq000sme0ksiymgd4p	cmk13o7wv000bjs04kr6sz4b0	2026-01-29 11:24:00.502	cmkzd99pv000ume0k4lfsc58u	\N
cmkze9mth000zme0kt163kx6g	cmkze9mtc000wme0ki4xbnz1q	cmk13mis60007js04xgg2p6bl	2026-01-29 11:52:17.094	cmkze9mtg000yme0kr6px2rbm	\N
cmkzge5r10013me0k76pugwhd	cmkzge5qv0010me0ku74ykiz3	cmiztoo5h0007l704gbh0c0zn	2026-01-29 12:51:47.485	cmkzge5qz0012me0krlg87fj3	\N
cmkzjt8k900039y6sh4qmmj9w	cmkzjt7nf00009y6syqpe044a	cmiztrp3m0007jo04qq6wkfgl	2026-01-29 14:27:29.817	cmkzjt89v00029y6safvxrqz1	\N
cml0fm1g80003po0koxlsn73o	cml0fm1ft0000po0kyzvwnqp4	cmk13mis60007js04xgg2p6bl	2026-01-30 05:17:41.721	cml0fm1g40002po0kwhha5h08	\N
cml0hvtk50009po0k2uvsauhf	cml0hvtjz0006po0kdn64gdax	cmk13ovnl000djs047uy6wdf0	2026-01-30 06:21:17.286	cml0hvtk20008po0kbe4vwqmy	\N
cml0kdmva0051po0kndpmddaq	cml0kdmv5004ypo0k6lpsjfce	cmk13mis60007js04xgg2p6bl	2026-01-30 07:31:07.655	cml0kdmv90050po0kpijyjmu0	\N
cml0ky4cw0055po0klhx3431i	cml0ky4ci0052po0kwovp5x2x	cmk13nkwk0001js04czooodij	2026-01-30 07:47:03.44	cml0ky4cr0054po0k6dkze8l2	\N
cml0kzttr0059po0k0wswap4z	cml0kzttm0056po0kdvcldb4q	cmk56zmu30001jy04rtisk47w	2026-01-30 07:48:23.104	cml0kzttq0058po0kj16dio0s	\N
cml0lz2cm005cpo0km9kwt4jj	cmk55ljp20001js0412fftmc0	cmk56zmu30001jy04rtisk47w	2026-01-30 08:15:47.11	cml0lz2cj005bpo0kxk6kg7ri	\N
cml0prku0005gpo0kug0c9njn	cml0prktt005dpo0kvuge4xoc	cmk13ovnl000djs047uy6wdf0	2026-01-30 10:01:56.28	cml0prkty005fpo0kdkiqmyf4	\N
cml0q4otl005upo0kcp9vrj6o	cml0q4otg005rpo0kirt6xc6x	cmk13mis60007js04xgg2p6bl	2026-01-30 10:12:07.978	cml0q4otj005tpo0kfrbrmi3v	\N
cml0q9e7q005ypo0km27pjxxk	cml0q9e7i005vpo0kbzrr7got	cmk13n14k000fjs04n7s2wdb7	2026-01-30 10:15:47.511	cml0q9e7n005xpo0k9hb9osmk	\N
cml0rfe4o0062po0kgxb15w10	cml0rfe4g005zpo0k98ndy959	cmk13o7wv000bjs04kr6sz4b0	2026-01-30 10:48:26.952	cml0rfe4m0061po0krmqloy66	\N
cml0z4z6e00029yzgzrtblfpe	cmkzjt7nf00009y6syqpe044a	cmiztquhb000bl7043xrbotf9	2026-01-30 14:24:17.943	cml0z4yxx00019yzgl1g72qnp	\N
cml15axxl0002qi0kenq98c5l	cmkzjt7nf00009y6syqpe044a	cmiztquhb000bl7043xrbotf9	2026-01-30 17:16:53.961	cml15axxj0001qi0koivj8971	\N
cml1vlqmq0006qi0kieyp6qgv	cml1vlqmb0003qi0kef5m6see	cmk13mis60007js04xgg2p6bl	2026-01-31 05:33:07.731	cml1vlqmn0005qi0ktu5qa4oc	\N
cml1wuvqu000cqi0ksgexrzzh	cml1wuvqj0009qi0k4l8w75cd	cmk13mis60007js04xgg2p6bl	2026-01-31 06:08:13.879	cml1wuvqq000bqi0kj68vxtnt	\N
cml1zwzun000kqi0kl2ecdzbt	cml1zwzu4000hqi0kyztfk397	cmk13o7wv000bjs04kr6sz4b0	2026-01-31 07:33:51.36	cml1zwzuk000jqi0kier3789y	\N
cml1zxyjw000oqi0ku041rjwk	cml1zxyjs000lqi0kcwshkhjd	cmk13mrb90003lc04v9gamlr0	2026-01-31 07:34:36.332	cml1zxyjv000nqi0kd816xgvf	\N
cml205wm9000sqi0kq15nx0cy	cml205wm4000pqi0khp2vvnbs	cmk13o7wv000bjs04kr6sz4b0	2026-01-31 07:40:47.074	cml205wm8000rqi0kpe1m96da	\N
cml20g1sr000wqi0kbqrfxbaf	cml20g1sm000tqi0kvysg548l	cmk13ondj000hjs04uli7wp7a	2026-01-31 07:48:40.347	cml20g1sp000vqi0ktd0mbqpu	\N
cml26ix2u0010qi0kr9jd65as	cml26ix2l000xqi0k7lgnbl9j	cmk13o7wv000bjs04kr6sz4b0	2026-01-31 10:38:51.894	cml26ix2r000zqi0ksl8q7my8	\N
cml26k7dr0014qi0kdixl2iwr	cml26k7dn0011qi0kpa8x89tj	cmk13o7wv000bjs04kr6sz4b0	2026-01-31 10:39:51.904	cml26k7dq0013qi0k6wa8rhey	\N
cml26qbmc0017qi0k3rlz13wy	cmks40pi3002ins0klghr7e6i	cmk13o7wv000bjs04kr6sz4b0	2026-01-31 10:44:37.332	cml26qbma0016qi0knvmnf4je	\N
cml28kbyp001bqi0kvwheq2ka	cml28kbyj0018qi0k5vt1l1hr	cmk13nkwk0001js04czooodij	2026-01-31 11:35:57.073	cml28kbyn001aqi0ki03i44m7	\N
cml4sfouk0003qn0k9piqgv8l	cml4sfou60000qn0ket396i0e	cmk13o7wv000bjs04kr6sz4b0	2026-02-02 06:27:45.165	cml4sfouh0002qn0k3286ju1x	\N
cml4sqe4q0007qn0k5jrr6avj	cml4sqe4k0004qn0kzolrnzai	cmk13nkwk0001js04czooodij	2026-02-02 06:36:04.491	cml4sqe4o0006qn0kwyjpxhsc	\N
cml4vlm4s000bqn0kpxpvuwkm	cml4vlm4i0008qn0kuejqwxfo	cmk13ovnl000djs047uy6wdf0	2026-02-02 07:56:20.428	cml4vlm4p000aqn0ke687l4p7	\N
cml4xhbb9000fqn0k695u6e58	cml4xhbaj000cqn0kl4vn2f1g	cmk13mis60007js04xgg2p6bl	2026-02-02 08:48:59.013	cml4xhbb4000eqn0kerftdrim	\N
cml4y7jyp000jqn0ks376rsmx	cml4y7jyc000gqn0kw72wps5t	cmk5701ld0001l804ns4u58mz	2026-02-02 09:09:23.281	cml4y7jyj000iqn0kh0q2u2n2	\N
cml50dw9l000nqn0kefgl2sbb	cml50dw96000kqn0kebkgrfev	cmk13nsjz0009js04ckim7hte	2026-02-02 10:10:18.393	cml50dw9i000mqn0kyl29noa2	\N
cml50up3w000rqn0kohwnhnod	cml50up3p000oqn0kf6h9n08m	cmk5701ld0001l804ns4u58mz	2026-02-02 10:23:22.268	cml50up3u000qqn0ka73572e5	\N
cml51im0i000vqn0k5ttkqh4g	cml51im0b000sqn0kz9v38jlw	cmk13o7wv000bjs04kr6sz4b0	2026-02-02 10:41:58.002	cml51im0f000uqn0koeviy5d3	\N
cml51k3mt000zqn0k1fz81iph	cml51k3mp000wqn0kehga9zfw	cmk13o7wv000bjs04kr6sz4b0	2026-02-02 10:43:07.493	cml51k3ms000yqn0kqj8oklij	\N
cml53ua5k0015qn0ko26qoq8j	cml53ua5f0012qn0kp0zka8wj	cmk13ovnl000djs047uy6wdf0	2026-02-02 11:47:01.736	cml53ua5i0014qn0kl4vevi2x	\N
cml53ua5k0016qn0kmmmjvkts	cml53ua5f0012qn0kp0zka8wj	cmk13ondj000hjs04uli7wp7a	2026-02-02 11:47:01.736	cml53ua5i0014qn0kl4vevi2x	\N
cml65cjvv0097qn0kreaznmd0	cml65cjvc0094qn0kysfcjc54	cmk13nkwk0001js04czooodij	2026-02-03 05:16:59.948	cml65cjvq0096qn0kpvar3723	\N
cml65cjvv0098qn0kadj77nmh	cml65cjvc0094qn0kysfcjc54	cmk13o7wv000bjs04kr6sz4b0	2026-02-03 05:16:59.948	cml65cjvq0096qn0kpvar3723	\N
cml68tisc009cqn0kn3p40e6r	cml68tirs0099qn0kodlss6bo	cmk13mis60007js04xgg2p6bl	2026-02-03 06:54:10.525	cml68tis8009bqn0kebkmz876	\N
cml696hmz009kqn0ko9mjohbe	cml696hmg009hqn0kc361cyyh	cmk13o7wv000bjs04kr6sz4b0	2026-02-03 07:04:15.551	cml696hml009jqn0ka1h1wp1m	\N
cml69a6nf009pqn0kgxer2wm5	cmkzjt7nf00009y6syqpe044a	cmiztrp3m0007jo04qq6wkfgl	2026-02-03 07:07:07.947	cml69a6ne009oqn0kls7lzwap	\N
cml69bcrj009tqn0kloed6j12	cml69bcrg009qqn0kqckbqed7	cmiztrp3m0007jo04qq6wkfgl	2026-02-03 07:08:02.528	cml69bcri009sqn0kzypmbzde	\N
cml6i9q2r00aoqn0kiezagudp	cml6i9q2g00alqn0k26sqgcxn	cmk13o7wv000bjs04kr6sz4b0	2026-02-03 11:18:43.012	cml6i9q2n00anqn0kw2gqrw0k	\N
cml6il2ld00asqn0kqam6n3j4	cml6il2l800apqn0kdgwqmb8w	cmk13n14k000fjs04n7s2wdb7	2026-02-03 11:27:32.45	cml6il2lb00arqn0kwjnk45mn	\N
cml6l07yo00ayqn0kjg2pso5i	cml6l07yi00avqn0khbas2mlp	cmk13o7wv000bjs04kr6sz4b0	2026-02-03 12:35:18.48	cml6l07ym00axqn0kr73ksn70	\N
cml6l9q5y00b2qn0kc2fvin3r	cml6l9q5i00azqn0k3fsh2139	cmk13mis60007js04xgg2p6bl	2026-02-03 12:42:41.964	cml6l9q5l00b1qn0k6j87pagx	\N
cml6lc9hr00b6qn0kx1au7j8c	cml6lc9hf00b3qn0k58xsu1yz	cmk5701ld0001l804ns4u58mz	2026-02-03 12:44:40.335	cml6lc9hn00b5qn0kt0p87y2w	\N
cml6qakjh00029ydpmv6nkjv8	cmkzjt7nf00009y6syqpe044a	cmiztquhb000bl7043xrbotf9	2026-02-03 15:03:19.421	cml6qakdz00019ydpjb63aeez	\N
cml6qcao300079ydpjxtohabl	cmkzjt7nf00009y6syqpe044a	cmiztpjr70001jo044eu3c9m7	2026-02-03 15:04:39.94	cml6qcaj200069ydp3yvgc8ch	\N
\.


--
-- Data for Name: VisitorSession; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."VisitorSession" (id, reason, status, "visitorId", "createdAt", "updatedAt", feedback) FROM stdin;
cmkat5ozo0001kz04msdvjfc2	FOR ENQ ABOUT THAR ROXX	exited	cmkat2vx20001ih04mk7k6hy3	2026-01-12 06:54:53.124	2026-01-12 06:56:02.61	\N
cmkat2vxl0003ih04r51ldd9b	UNIT-3,  BBSR,ODISHA	exited	cmkat2vx20001ih04mk7k6hy3	2026-01-12 06:52:42.154	2026-01-12 06:56:22.678	\N
cmkb2p3ny0003ju04mkcppwz2	Want quotation 	exited	cmkb2p3n40001ju048dag0bwy	2026-01-12 11:21:55.151	2026-01-12 11:25:17.241	\N
cmkb5jd9m0003l704fo5u2iis	Explore to THAR	exited	cmkb5jd8x0001l7049u7pplrp	2026-01-12 12:41:26.507	2026-01-13 06:24:15.737	\N
cmkaw6rt30003l504u5z8w54x	SCORPIO CLASSIC 	exited	cmkaw6rsa0001l5049gwa1cbz	2026-01-12 08:19:42.279	2026-01-13 06:24:42.017	\N
cmkc7lp6h0003l804jrzj9jos	XUV 7XO	exited	cmkc7lp5u0001l804jhi6j6eg	2026-01-13 06:27:00.666	2026-01-13 06:54:25.097	\N
cmkc9hm5t0003l404wj8s2td3	7xo	exited	cmkc9hm500001l404jt6qjzml	2026-01-13 07:19:49.361	2026-01-13 07:23:53.471	\N
cmk55ljq00003js04uf3cnsuj	To test 7XO	exited	cmk55ljp20001js0412fftmc0	2026-01-08 07:56:31.128	2026-01-08 08:01:31.537	\N
cmkc7h5l40003i504k9ffql6l	SCORPIO CLASSIC 	exited	cmkc7h5k70001i504qi6n4c4l	2026-01-13 06:23:28.648	2026-01-13 07:26:36.637	\N
cmkc80hly0003l40472dq0lza	XUV 3XO 	exited	cmkc80hky0001l4049n1vx43r	2026-01-13 06:38:30.695	2026-01-13 07:26:57.178	\N
cmk5eguid0003l204f1zo1l99	BOLERO	exited	cmk5eguhv0001l2048htsqxa1	2026-01-08 12:04:48.373	2026-01-08 12:05:55.764	\N
cmkc931570003jx04k86jr0bi	XUV 3XO 	exited	cmkc9314l0001jx04d9dxcxzv	2026-01-13 07:08:28.94	2026-01-13 07:27:21.434	\N
cmk5eqe7o0006jy04q8cysn6c	XEV 9E	test_drive	cmk5eguhv0001l2048htsqxa1	2026-01-08 12:12:13.812	2026-01-08 12:12:37.977	\N
cmk5f2teb0003jj0455x0v3s7	XUV-7XO	exited	cmk5f2tdm0001jj04lkucp9dz	2026-01-08 12:21:53.363	2026-01-08 12:22:05.033	\N
cmk5fjlmf0003kw04mc7h1d7a	XUV 3XO 	exited	cmk5fjllt0001kw04iape5ier	2026-01-08 12:34:56.439	2026-01-08 12:35:07.262	\N
cmkc9t05w0003ic04xveqgetg	XUV 7XO	exited	cmkc9t05a0001ic04rjqrkm44	2026-01-13 07:28:40.725	2026-01-13 07:49:17.827	\N
cmkc9z13v0003kz046mqbyhfh	To buy XEV 9S	exited	cmkc9z1350001kz04mixco0pl	2026-01-13 07:33:21.883	2026-01-13 07:52:04.276	\N
cmk5f63n30003ib04ukk0jpiw	XUV7XO	exited	cmk5f63mk0001ib0474a9l034	2026-01-08 12:24:26.608	2026-01-08 12:49:28.345	\N
cmk5eenx20003jy04rhjlae6m	3XO	exited	cmk5eenwc0001jy04trhfxtdc	2026-01-08 12:03:06.519	2026-01-08 12:50:22.15	\N
cmk5r33bv0003kz046hj64tpr	jy vy	exited	cmk5r33be0001kz04kc6yhdt8	2026-01-08 17:58:01.627	2026-01-08 17:59:22.485	\N
cmk5fzg8o000dl204hh2ivrpn	XUV 3XO 	exited	cmk5fzg84000bl204zz9zjh2g	2026-01-08 12:47:15.961	2026-01-09 04:50:35.271	\N
cmk5fxnwj0008l2049hv9akba	XUV 7XO	exited	cmk5fxnvy0006l204w9hnce48	2026-01-08 12:45:52.58	2026-01-09 05:25:21.522	\N
cmk6ft8o50003l404hpb8ulko	THAR 	exited	cmk6ft8ls0001l40499qxxrio	2026-01-09 05:30:12.389	2026-01-09 06:14:41.407	\N
cmkc8kqvs0003gt04mmd4aq7k	XUV 7XO	exited	cmkc8kqv20001gt04yswx9clf	2026-01-13 06:54:15.833	2026-01-13 10:05:25.863	\N
cmk6ibvem0003l404pngk0t8p	XUV 3XO 	exited	cmk6ibvd30001l4041wcedeh0	2026-01-09 06:40:40.894	2026-01-09 08:57:17.696	\N
cmkcan3y80003jm04bu5uogao	XUV7XO	exited	cmkcan3xj0001jm042tnpj5oy	2026-01-13 07:52:05.313	2026-01-13 10:08:14.078	\N
cmk7tyvtt0003l204hhi5nhnu	Bolero 	test_drive	cmk7tyv3r0001l204367gk6sm	2026-01-10 04:54:16.482	2026-01-10 04:54:45.238	\N
cmk7v2pd70003la04c0gw6br3	SCORPIO-N 	exited	cmk7v2pci0001la047odt2v1r	2026-01-10 05:25:14.347	2026-01-10 05:50:58.182	\N
cmkcfe9xe0003js04569syhuj	SCORPIO CLASSIC 	exited	cmkcfe9wn0001js04aqu5cczt	2026-01-13 10:05:11.235	2026-01-13 10:51:23.973	\N
cmk7ybpk00003jm04py1ouzpr	XUV 3XO 	exited	cmk7ybphf0001jm04ydrlsq47	2026-01-10 06:56:13.345	2026-01-10 07:11:34.587	\N
cmkcbw7pw0003l604ccznw1kj	XUV 7XO	exited	cmkcbw7p20001l6049d774t20	2026-01-13 08:27:09.716	2026-01-13 10:51:35.656	\N
cmkcj6a160003k304u1pc5cld	Explore to Roxx 	exited	cmkcj69y00001k304bx4b16lq	2026-01-13 11:50:56.587	2026-01-13 12:11:40.815	\N
cmk805upw0003ju04sxn685ze	XUV 3XO 	exited	cmk805unr0001ju04rqctzb1r	2026-01-10 07:47:39.332	2026-01-10 10:37:41.72	\N
cmk7yziaz0003jp043yg72u6c	THAR ROXX 	exited	cmk7yziaf0001jp04f4dxm976	2026-01-10 07:14:43.691	2026-01-10 10:37:52.107	\N
cmkch1emj0003l204c0g1jcoj	XUV7XO	exited	cmkch1ekz0001l204j3qxsa48	2026-01-13 10:51:10.028	2026-01-13 12:11:55.396	\N
cmk869o380003ld04gzvdz1xb	Car Enquiry	exited	cmk869o2r0001ld04qfh0bzww	2026-01-10 10:38:35.06	2026-01-10 10:40:42.239	\N
cmk86kfk8000cld04gbutpni8	Car enquiry	exited	cmk86kfjn000ald04u0s9budk	2026-01-10 10:46:57.225	2026-01-10 10:48:21.637	\N
cmkcmeg9e0003l504rntww06v	7xo	exited	cmkcmeg8s0001l5042f9mhyb4	2026-01-13 13:21:16.755	2026-01-13 13:23:30.212	\N
cmk87p7zj0003jx04i1tz2yuc	XUV 3XO 	exited	cmk87p7yn0001jx04d7tefhqi	2026-01-10 11:18:40.304	2026-01-10 11:18:47.822	\N
cmkcml1970005jl04bw81vr4n	xev9e	test_drive	cmkcml18h0003jl04r9qrr8c5	2026-01-13 13:26:23.899	2026-01-13 13:27:07.913	\N
cmk868dkw0003lb04hx7t6iir	Scorpio Classic 	exited	cmk868dju0001lb04l81mgxe5	2026-01-10 10:37:34.784	2026-01-10 11:31:16.441	\N
cmkck3yfu0003jr0469xxa77b	\nXUV 3XO \n	exited	cmkck3yf70001jr04g2hfhlyy	2026-01-13 12:17:07.867	2026-01-14 05:59:11.342	\N
cmk88dmlb0003ky04p5wdyd8f	Explore to 3xo	exited	cmk88dmkl0001ky04npquuo37	2026-01-10 11:37:38.975	2026-01-10 11:43:01.276	\N
cmk88nlm00001k104cz3tyz6s	Explore to 3XO 	exited	cmk87p7yn0001jx04d7tefhqi	2026-01-10 11:45:24.265	2026-01-10 11:56:48.329	\N
cmk87y2gi0008jx04gycv016l	XUV 7XO	exited	cmk87y2fx0006jx04gf41lhit	2026-01-10 11:25:33.043	2026-01-10 11:58:34.202	\N
cmk88274u000djx04zj5qy19c	XUV3XO 	exited	cmk88272o000bjx04t671mh6s	2026-01-10 11:28:45.726	2026-01-10 11:58:51.586	\N
cmkdk6y0e0003ky04c5aqzhck	The customer visited the showroom to enquire about the models available  and their prices	exited	cmkdk6xxv0001ky04v6m1o8bb	2026-01-14 05:07:13.455	2026-01-14 06:01:54.036	\N
cmk89fru20003kw040x1eit59	SCORPIO CLASSIC 	exited	cmk89frtm0001kw040rfei7xv	2026-01-10 12:07:18.698	2026-01-10 12:34:48.189	\N
cmk896l55000aky0410zlq1g7	XUV 7XO	exited	cmk896l4e0008ky0441949cny	2026-01-10 12:00:10.121	2026-01-10 12:35:04.674	\N
cmkdm3cks0003l2048siax5i1	XUV 7XO	exited	cmkdm3cka0001l20480b6gk2r	2026-01-14 06:00:24.94	2026-01-14 06:33:58.069	\N
cmk8ap7e9000fky04e98uoroh	XUV 7XO	exited	cmk8ap7dw000dky04kmxjdcku	2026-01-10 12:42:38.385	2026-01-12 04:58:00.029	\N
cmkdm5rzr0003jr04phu048ws	SCORPIO CLASSIC 	exited	cmkdm5rzb0001jr04v4t6fuvb	2026-01-14 06:02:18.232	2026-01-14 06:37:03.211	\N
cmkaq5xgk0003ib04ujljc53l	SCORPIO CLASSIC 	exited	cmkaq5xg40001ib04etw1us6j	2026-01-12 05:31:05.252	2026-01-12 05:38:54.677	\N
cmkaq4qdd0003jp04bri558fm	SCORPIO CLASSIC 	exited	cmkaq4qcg0001jp04owla5bsz	2026-01-12 05:30:09.409	2026-01-12 05:39:08.672	\N
cmkdndugo0003js04swf9dm19	BOLERO NEO 	exited	cmkdndug30001js04x9wze5id	2026-01-14 06:36:34.296	2026-01-14 06:58:11.266	\N
cmkdq17990003jn045pkjzib8	SCORPIO-N 	exited	cmkdq17870001jn04t40nol8x	2026-01-14 07:50:43.197	2026-01-14 07:50:51.683	\N
cmkdo8ae60003jp04f4ft82pl	XUV7XO	exited	cmkdo8adj0001jp04k35sph6j	2026-01-14 07:00:14.622	2026-01-14 08:07:02.3	\N
cmkdqlouh0003jo0484gz3nm6	XUV 3XO 	exited	cmkdqlou10001jo04yl487ogn	2026-01-14 08:06:39.113	2026-01-14 08:57:28.662	\N
cmkdqifep0003jr04hqwtx1yq	XE	exited	cmkdqifdh0001jr044xe6iv79	2026-01-14 08:04:06.913	2026-01-14 08:57:41.097	\N
cmkdtp8pm0003lb04ski9yi33	XUV 3XO /BOLERO  ENQUIRY 	exited	cmkdtp8os0001lb0449frz1zf	2026-01-14 09:33:23.675	2026-01-14 09:40:50.45	\N
cmkduwpg70008lb04lc6jcsgv	XUV 7XO	exited	cmkduwpfu0006lb04se1s3auc	2026-01-14 10:07:11.576	2026-01-14 10:44:03.384	\N
cmkdy11li0003l204v3kqkfka	BOLERO 	intake	cmkdy11km0001l204nvev1st9	2026-01-14 11:34:32.791	2026-01-14 11:34:32.791	\N
cmkdvxwq00003kz04b2zya42p	XEV9S	exited	cmkdvxwpg0001kz04dmkkuvm2	2026-01-14 10:36:07.272	2026-01-14 11:34:42.589	\N
cmkdvrta5000dlb04vatz02f7	XUV7XO ENQUIRY 	exited	cmkdvrt9j000blb04zvk7foa0	2026-01-14 10:31:22.877	2026-01-14 11:34:56.628	\N
cmkdye1oy0003kv041lihkzsb	THAR ROXX 	intake	cmkdye1o70001kv04lvrx5wtl	2026-01-14 11:44:39.442	2026-01-14 11:44:39.442	\N
cmkdyv9260003l104algxa7yq	XUV 7XO	intake	cmkdyv9110001l104wx4x859g	2026-01-14 11:58:02.142	2026-01-14 11:58:02.142	\N
cmke10yv70001le04hgzsecmg	Car Enquiry	exited	cmk5r33be0001kz04kc6yhdt8	2026-01-14 12:58:28.099	2026-01-14 12:58:51.138	\N
cmke11zj70003l704seck9jnx	To enquiry about Bolero 6	intake	cmke11zii0001l704xebaz5rs	2026-01-14 12:59:15.619	2026-01-14 12:59:15.619	\N
cmkf24w040003l404nxff0gvk	XUV 7XO	exited	cmkf24vxl0001l404ve151myk	2026-01-15 06:17:16.805	2026-01-15 07:51:43.669	\N
cmkf33s220003jm045u8ro5pm	XEV9S	exited	cmkf33s190001jm04fzfoxjty	2026-01-15 06:44:24.65	2026-01-15 07:52:12.494	\N
cmkf5hxm40003lb041ebole6u	XUV 3XO 	exited	cmkf5hxl80001lb04zfw7iamj	2026-01-15 07:51:24.268	2026-01-15 08:57:55.602	\N
cmkf7v9co0003l504viryzdwn	XUV 3XO 	exited	cmkf7v9b40001l504tpudl05e	2026-01-15 08:57:45.241	2026-01-15 10:13:44.896	\N
cmkfakkgf0003l804j1zrqt8d	XUV 3XO 	exited	cmkfakkfm0001l804teb6rs9m	2026-01-15 10:13:25.264	2026-01-15 10:58:56.079	\N
cmkfc93yb0003lb04xk94fc2k	XUV 3XO 	intake	cmkfc93xs0001lb04ksryt73m	2026-01-15 11:00:29.891	2026-01-15 11:00:29.891	\N
cmkfcgrhw0008lb0444tq0kot	SCORPIO-N 	intake	cmkfcgrgy0006lb04vwtw85w5	2026-01-15 11:06:26.996	2026-01-15 11:06:26.996	\N
cmkfej6vf0003l804clnmjr4i	XUV 3xo	exited	cmkfej6ug0001l804j1tzb1cw	2026-01-15 12:04:19.467	2026-01-15 12:10:11.86	\N
cmkgeuudc0003if04wiao1vko	ENQUIRY FOR 3XO VEHICLE 	exited	cmkgeuucd0001if04igp4b402	2026-01-16 05:01:09.313	2026-01-16 05:02:39.397	\N
cmkghdr2k0003l204szux25pi	To see the demo vehicle 	intake	cmkghdr1m0001l204lujtmtiu	2026-01-16 06:11:50.732	2026-01-16 06:11:50.732	\N
cmkghl7a80003l704to959w4l	TO TAKE TD	intake	cmkghl79k0001l704rtqymfpz	2026-01-16 06:17:38.336	2026-01-16 06:17:38.336	\N
cmkgho3a80003jr04iz07ue7u	To take td 	intake	cmkgho39s0001jr04miom602i	2026-01-16 06:19:53.12	2026-01-16 06:19:53.12	\N
cmkghpl4n0006l7040a46h1fv	To take td	intake	cmkgho39s0001jr04miom602i	2026-01-16 06:21:02.904	2026-01-16 06:21:02.904	\N
cmkgf44al0003lh04rylg57wl	ScorpioN 	exited	cmkgf44a40001lh04386luhcx	2026-01-16 05:08:22.078	2026-01-16 06:25:16.572	\N
cmkgjz0ni0003l204g8lbhmja	Explore to 3XO 	exited	cmkgjz0mo0001l204b04tvgu2	2026-01-16 07:24:22.158	2026-01-16 07:30:23.951	\N
cmkgofihr0003k4040cjmtu0c	For demo vehicle 	intake	cmkgofiga0001k404g4dyt0rb	2026-01-16 09:29:10.239	2026-01-16 09:29:10.239	\N
cmkgoio1s0008k404gl24m54c	For demo vehicle 	exited	cmkgoio1f0006k404nuqbg7z5	2026-01-16 09:31:37.409	2026-01-16 09:50:54.898	\N
cmkgpaqtw0003l8042klv10fv	For demo vehicle 	intake	cmkgpaqt50001l804hfwb0y5l	2026-01-16 09:53:27.381	2026-01-16 09:53:27.381	\N
cmkgps2hp0003jv046qez5peb	For demo vehicle 	intake	cmkgps2fd0001jv04m964b40j	2026-01-16 10:06:55.646	2026-01-16 10:06:55.646	\N
cmkgpymgq0003js04air9s72a	For demo vehicle 	intake	cmkgpymg70001js04rhs0lb7m	2026-01-16 10:12:01.466	2026-01-16 10:12:01.466	\N
cmkgq0llb0008l80464aimc3o	For demo vehicle 	intake	cmkgq0lko0006l804r2fh1ykw	2026-01-16 10:13:33.648	2026-01-16 10:13:33.648	\N
cmkgqtl5i0003k104xsum693j	For demo vehicle 	intake	cmkgqtl4b0001k104dbl434zm	2026-01-16 10:36:06.102	2026-01-16 10:36:06.102	\N
cmkgr86hb0003jr04sxdiih0s	For demo vehicle 	intake	cmkgr86gc0001jr0488bsh2nt	2026-01-16 10:47:26.927	2026-01-16 10:47:26.927	\N
cmkgs1c200003ju049avq9exc	For demo vehicle 	intake	cmkgs1bzx0001ju047nddfdrx	2026-01-16 11:10:07.176	2026-01-16 11:10:07.176	\N
cmkgs32xt0003lb049rokla8u	For demo vehicle 	intake	cmkgs32x00001lb04ndsm1x8f	2026-01-16 11:11:28.674	2026-01-16 11:11:28.674	\N
cmkgs6fpx0003jx049axc48h0	For demo vehicle 	intake	cmkgs6fpd0001jx04mcczg8v6	2026-01-16 11:14:05.205	2026-01-16 11:14:05.205	\N
cmkgst0rw0003ju04zg0hh168	For demo vehicle 	intake	cmkgst0qw0001ju04ljlver0q	2026-01-16 11:31:38.925	2026-01-16 11:31:38.925	\N
cmkgsu8xm000djx04a3zpvimj	For demo vehicle 	intake	cmkgsu8wx000bjx04uelm9nmk	2026-01-16 11:32:36.154	2026-01-16 11:32:36.154	\N
cmkgsvml00008ju04o5m8jgh2	For demo vehicle 	intake	cmkgsvmk60006ju04f93znxkb	2026-01-16 11:33:40.5	2026-01-16 11:33:40.5	\N
cmkgswwhx0008ju042uxjjuui	For demo vehicle 	intake	cmkgswwh40006ju04oe9nqn7h	2026-01-16 11:34:40.005	2026-01-16 11:34:40.005	\N
cmkgshple0008jx04mmmntzs7	Explore to 3XO 	exited	cmkgshpki0006jx04cln9t9if	2026-01-16 11:22:51.219	2026-01-16 11:38:23.943	\N
cmkgu1emg0003l404s9huxeoh	For demo vehicle 	intake	cmkgu1elj0001l4041s2tkat1	2026-01-16 12:06:09.736	2026-01-16 12:06:09.736	\N
cmkguy3ln0003i8047fa530br	For demo vehicle 	intake	cmkguy3kn0001i8042zi1pii0	2026-01-16 12:31:35.1	2026-01-16 12:31:35.1	\N
cmkgve3590003jz0485bv4t4e	For demo vehicle 	intake	cmkgve3460001jz04css1msno	2026-01-16 12:44:01.006	2026-01-16 12:44:01.006	\N
cmkhztdhn0003lh04zsvxks6w	XEV9E 	exited	cmkhztdh00001lh04tkk42ueg	2026-01-17 07:35:38.891	2026-01-17 07:36:23.841	\N
cmkhzvut4000di804uco5y90o	XEV9S	exited	cmkhzvusg000bi804l6ss9e80	2026-01-17 07:37:34.649	2026-01-17 07:37:41.529	\N
cmkhznymp0003i804m2w13by4	XUV 7XO	exited	cmkhznylz0001i804gycz1xdp	2026-01-17 07:31:26.353	2026-01-17 09:43:54.747	\N
cmkhzqvg90008i8045r0yj4hf	BE6	exited	cmkhzqvfp0006i804wfba3bnh	2026-01-17 07:33:42.201	2026-01-17 09:44:10.461	\N
cmkhzs6g20003l404jmgn6bg8	XUV 7XO	exited	cmkhzs6fj0001l4049nt835vb	2026-01-17 07:34:43.106	2026-01-17 09:44:19.861	\N
cmki0g5x6000ii8044u7yn1ou	SCORPIO-N 	exited	cmki0g5wk000gi804mc84spz8	2026-01-17 07:53:22.171	2026-01-17 09:44:42.74	\N
cmki509lx0003l704133utrra	SCORPIO CLASSIC 	intake	cmki509l70001l704via59vid	2026-01-17 10:00:58.534	2026-01-17 10:00:58.534	\N
cmki51mx60003jl04c2c0aza5	XUV 3XO 	intake	cmki51mwo0001jl04rw0n998s	2026-01-17 10:02:02.443	2026-01-17 10:02:02.443	\N
cmki4e4fq0003la04gxquskxh	XUV 3XO 	exited	cmki4e4ev0001la04ciiga9zy	2026-01-17 09:43:45.398	2026-01-17 10:17:52.892	\N
cmki5gaha0008l704ns4jns79	To enquire about Xuv 3xo	exited	cmki5gagr0006l704r81k7tcp	2026-01-17 10:13:26.158	2026-01-17 10:57:16.838	\N
cmki5dd590008jl04m1e90cy4	To enquire about Xuv 7xo	exited	cmki5dd4o0006jl04rm5k97ee	2026-01-17 10:11:09.645	2026-01-17 10:57:54.924	\N
cmki864h00003jv04hh9n4a0z	THAR 	intake	cmki864gg0001jv04hjy1zebj	2026-01-17 11:29:30.661	2026-01-17 11:29:30.661	\N
cmki5nbwv0003l804y1kux1n5	BOLERO NEO 	exited	cmki5nbw30001l8040ljcy17t	2026-01-17 10:18:54.607	2026-01-17 11:29:43.282	\N
cmki89j480003l504f2pdqbzz	XUV 7XO 	intake	cmki89j3m0001l504o2a776nm	2026-01-17 11:32:09.609	2026-01-17 11:32:09.609	\N
cmki8aigi0003ii04vc7xixh1	BOLERO 	intake	cmki8aig10001ii04asdw9o2x	2026-01-17 11:32:55.41	2026-01-17 11:32:55.41	\N
cmki8xkz0000djv044ls0zsd2	XUV 7XO 	intake	cmki8xkyi000bjv04990tde3e	2026-01-17 11:50:51.756	2026-01-17 11:50:51.756	\N
cmki9afq9000ijv0424gxmdyp	XUV 7XO 	intake	cmki9afpe000gjv04fkre4nk0	2026-01-17 12:00:51.49	2026-01-17 12:00:51.49	\N
cmki8a5zc0008jv04bdi965de	To enquire about Xuv 7xo 	exited	cmki8a5yp0006jv040ztmu10t	2026-01-17 11:32:39.24	2026-01-17 12:09:20.962	\N
cmkiaoa7t0003l704fspi0too	Explore to scorpion 	exited	cmkiaoa700001l704ml1wsbr4	2026-01-17 12:39:37.145	2026-01-17 12:44:34.495	\N
cmks3pjr10028ns0kz0go2sy4	For demo vehicle 	intake	cmks3pjqo0026ns0kbkmeuo8v	2026-01-24 09:22:20.604	2026-01-24 09:22:20.604	\N
cmks3rabc002cns0kdckuv76v	For demo vehicle 	intake	cmks3rab8002ans0k4i90m8af	2026-01-24 09:23:41.688	2026-01-24 09:23:41.688	\N
cmks3sugs002gns0kampakaec	For demo vehicle 	intake	cmks3sugq002ens0kwrm7k437	2026-01-24 09:24:54.46	2026-01-24 09:24:54.46	\N
cmks40pi6002kns0kb3oqjrus	For demo vehicle 	intake	cmks40pi3002ins0klghr7e6i	2026-01-24 09:31:01.279	2026-01-24 09:31:01.279	\N
cmks4ac1x002ons0k4k82vrsm	For demo vehicle 	intake	cmks4ac1s002mns0kb0v963o3	2026-01-24 09:38:30.405	2026-01-24 09:38:30.405	\N
cmks4bfw2002sns0k5v77e3tx	For demo vehicle 	intake	cmks4bfvy002qns0kz2h09g8x	2026-01-24 09:39:22.035	2026-01-24 09:39:22.035	\N
cmks4czqm002wns0kry79hyxj	For demo vehicle 	intake	cmks4czqi002uns0k4l0n22y7	2026-01-24 09:40:34.414	2026-01-24 09:40:34.414	\N
cmks4fscj0030ns0kxmph9e9k	For demo vehicle 	intake	cmks4fscg002yns0kg0g2z1xg	2026-01-24 09:42:44.803	2026-01-24 09:42:44.803	\N
cmks4h1ua0034ns0k3l8wuob8	For demo vehicle 	intake	cmks4h1u80032ns0kjunqw8ji	2026-01-24 09:43:43.762	2026-01-24 09:43:43.762	\N
cmks4ii650038ns0kwwew0aa7	For demo vehicle 	intake	cmks4ii620036ns0kl6d3fttc	2026-01-24 09:44:51.581	2026-01-24 09:44:51.581	\N
cmks4lg1x003cns0k6cqehypb	For demo vehicle 	intake	cmks4lg1u003ans0k09lv6s01	2026-01-24 09:47:08.805	2026-01-24 09:47:08.805	\N
cmks4n7e2003gns0kf5hrwist	For demo vehicle 	intake	cmks4n7e0003ens0ksxz7wfyl	2026-01-24 09:48:30.891	2026-01-24 09:48:30.891	\N
cmks52u86003kns0k2fkuz6k4	For demo vehicle 	intake	cmks52u81003ins0kihoancnd	2026-01-24 10:00:40.326	2026-01-24 10:00:40.326	\N
cmks55rkw003ons0kucogxly9	For demo vehicle 	intake	cmks55rks003mns0kod372s9z	2026-01-24 10:02:56.864	2026-01-24 10:02:56.864	\N
cmks5a4j9003sns0k4bzc8sqp	For demo vehicle 	intake	cmks5a4j6003qns0kagw14lrx	2026-01-24 10:06:20.277	2026-01-24 10:06:20.277	\N
cmks5co7d003wns0kkccp71hx	For demo vehicle 	intake	cmks5co7b003uns0k5h14ew5w	2026-01-24 10:08:19.082	2026-01-24 10:08:19.082	\N
cmks5v29b0040ns0krsv97emv	For demo vehicle 	intake	cmks5v298003yns0krhe3c09w	2026-01-24 10:22:37.104	2026-01-24 10:22:37.104	\N
cmks5w4hj0044ns0kc90c8v10	For demo vehicle 	intake	cmks5w4hg0042ns0kkb338cp5	2026-01-24 10:23:26.647	2026-01-24 10:23:26.647	\N
cmks6kug40048ns0kf88ozsq1	For demo vehicle 	intake	cmks6kug00046ns0kcnevq02f	2026-01-24 10:42:40.036	2026-01-24 10:42:40.036	\N
cmks71b1u004cns0kw0xadcti	For demo vehicle 	intake	cmks71b1q004ans0k811e4ej3	2026-01-24 10:55:28.05	2026-01-24 10:55:28.05	\N
cmks72lle004gns0krgk09jgs	For demo vehicle 	intake	cmks72llb004ens0k3a8rpqto	2026-01-24 10:56:28.371	2026-01-24 10:56:28.371	\N
cmks7bhd3004kns0kmjb4k5iq	For demo vehicle 	intake	cmks7bhd0004ins0kb4hl9xle	2026-01-24 11:03:22.791	2026-01-24 11:03:22.791	\N
cmks7ezzu004ons0kbt2vrpq7	For demo vehicle 	intake	cmks7ezzs004mns0kx0aydqmj	2026-01-24 11:06:06.906	2026-01-24 11:06:06.906	\N
cmks7gy47004sns0kb1guf25w	For demo vehicle 	intake	cmks7gy43004qns0k52lr6f9j	2026-01-24 11:07:37.784	2026-01-24 11:07:37.784	\N
cmks7j3zc004wns0kisss0lok	For demo vehicle 	intake	cmks7j3z8004uns0klquunnvm	2026-01-24 11:09:18.696	2026-01-24 11:09:18.696	\N
cmks7kukx0050ns0ksgcbv9do	For demo vehicle 	intake	cmks7kukt004yns0kw7mjg93v	2026-01-24 11:10:39.825	2026-01-24 11:10:39.825	\N
cmks7mjwe0054ns0kt915gk15	For demo vehicle 	intake	cmks7mjwb0052ns0kan4t0ygl	2026-01-24 11:11:59.294	2026-01-24 11:11:59.294	\N
cmks7nzoa0058ns0ktjfluax8	For demo vehicle 	intake	cmks7nzo80056ns0kksv854rf	2026-01-24 11:13:06.395	2026-01-24 11:13:06.395	\N
cmks7p4bm005cns0krgi14wqz	For demo vehicle 	intake	cmks7p4bj005ans0kzqvcgxhl	2026-01-24 11:13:59.074	2026-01-24 11:13:59.074	\N
cmks7qlff005gns0kyze2dpfn	For demo vehicle 	intake	cmks7qlfb005ens0k6ssa8ofm	2026-01-24 11:15:07.9	2026-01-24 11:15:07.9	\N
cmks7rz05005kns0kbqi4wv2e	For demo vehicle 	intake	cmks7rz01005ins0kfk09qltw	2026-01-24 11:16:12.149	2026-01-24 11:16:12.149	\N
cmks7t787005ons0k234o67yr	For demo vehicle 	intake	cmks7t784005mns0kizjth984	2026-01-24 11:17:09.463	2026-01-24 11:17:09.463	\N
cmks7ue4t005sns0krxahkonk	For demo vehicle 	intake	cmks7ue4r005qns0kz9qy8o3e	2026-01-24 11:18:05.069	2026-01-24 11:18:05.069	\N
cmks7vxrc005wns0khbzgt0m7	For demo vehicle 	intake	cmks7vxr8005uns0kw5ugl4mz	2026-01-24 11:19:17.16	2026-01-24 11:19:17.16	\N
cmks7xijz0060ns0kvf9rh5tl	For demo vehicle 	intake	cmks7xiju005yns0k64aajn97	2026-01-24 11:20:30.768	2026-01-24 11:20:30.768	\N
cmks7yxek0064ns0kjdfm0wpb	For demo vehicle 	intake	cmks7yxeg0062ns0kpofb070v	2026-01-24 11:21:36.668	2026-01-24 11:21:36.668	\N
cmks80fiq0068ns0kifj8imun	For demo vehicle 	intake	cmks80fio0066ns0knbnn4u4n	2026-01-24 11:22:46.802	2026-01-24 11:22:46.802	\N
cmks81gbl006cns0komjch1s0	For demo 	intake	cmks81gbi006ans0kj3r32xmx	2026-01-24 11:23:34.497	2026-01-24 11:23:34.497	\N
cmks82k5c006gns0ks66cq86h	For demo vehicle 	intake	cmks82k59006ens0k4u2a2rnz	2026-01-24 11:24:26.112	2026-01-24 11:24:26.112	\N
cmks83p3m006kns0kad7s7qyi	For demo vehicle 	intake	cmks83p3j006ins0kxpffspbr	2026-01-24 11:25:19.186	2026-01-24 11:25:19.186	\N
cmks850jv006ons0kvarm1m0w	For demo vehicle 	intake	cmks850jr006mns0kte9i32at	2026-01-24 11:26:20.683	2026-01-24 11:26:20.683	\N
cmks877wm006sns0kxfu59p8q	For demo vehicle 	intake	cmks877wj006qns0k8ro65ly8	2026-01-24 11:28:03.527	2026-01-24 11:28:03.527	\N
cmks88hvx006wns0k936n0tav	For demo vehicle 	intake	cmks88hvt006uns0kllcys5oj	2026-01-24 11:29:03.117	2026-01-24 11:29:03.117	\N
cmks8arjv0070ns0kdoo3kjqd	For demo vehicle 	intake	cmks8arjs006yns0kj6yliy8e	2026-01-24 11:30:48.955	2026-01-24 11:30:48.955	\N
cmks8qbs00074ns0kp7k107j5	For demo vehicle 	intake	cmks8qbrw0072ns0kydswnfe0	2026-01-24 11:42:55.008	2026-01-24 11:42:55.008	\N
cmks8rho80078ns0k3nh7qo9s	For demo vehicle 	intake	cmks8rho40076ns0kvcvh0rll	2026-01-24 11:43:49.304	2026-01-24 11:43:49.304	\N
cmks9vyt8007cns0kfx0g5vw1	For demo vehicle 	intake	cmks9vyt4007ans0kdb7i29fg	2026-01-24 12:15:17.756	2026-01-24 12:15:17.756	\N
cmksbhb73007gns0kt3ir1di7	For demo vehicle 	intake	cmksbhb6y007ens0kuza1ah72	2026-01-24 12:59:53.199	2026-01-24 12:59:53.199	\N
cmkw9r5yh007sns0k498wmnky	XUV 7XO	intake	cmkw9r5y9007qns0kuudg7ndn	2026-01-27 07:22:38.441	2026-01-27 07:22:38.441	\N
cmkw5uvpb007kns0kx55kg3bd	SCORPION 	exited	cmkw5uvos007ins0kcb31wavn	2026-01-27 05:33:33.311	2026-01-27 07:22:55.902	\N
cmkw6sbrw007ons0kdw9flkh0	XUV 7XO 	exited	cmkw6sbrr007mns0kpk6issef	2026-01-27 05:59:33.789	2026-01-27 07:23:08.208	\N
cmkw9sq22007wns0kak6ldh8j	SCORPIO CLASSIC 	exited	cmkw9sq1x007uns0k8h752706	2026-01-27 07:23:51.146	2026-01-27 09:48:48.08	\N
cmkwb8iit00e6ns0k3nd6qgdd	SCORPIO-N/THAR ROXX 	exited	cmkwb8iio00e4ns0kqfz8299g	2026-01-27 08:04:07.493	2026-01-27 09:50:46.562	\N
cmkweyyzn00eans0k6apus3ib	XUV 3XO 	exited	cmkweyyzi00e8ns0k3dkgkx66	2026-01-27 09:48:40.74	2026-01-28 05:57:30.22	\N
cmkxm7044002dr10ldkk2y02h	XUV 7XO 	exited	cmkf24vxl0001l404ve151myk	2026-01-28 05:58:38.932	2026-01-28 06:25:46.162	\N
cmkxn76u0002hr10locva93tg	XUV 3XO 	exited	cmkxn76tv002fr10lzmtxjv3h	2026-01-28 06:26:47.257	2026-01-28 11:50:26.268	\N
cmkxytyvc002pr10lar7gk336	XEV9S 	exited	cmkxytyv4002nr10l25zrcyl1	2026-01-28 11:52:25.801	2026-01-28 12:25:18.916	\N
cmkxyrag3002lr10lo3wf4ih1	XUV 3XO 	exited	cmkxyrafs002jr10ly2c3vjg3	2026-01-28 11:50:20.835	2026-01-28 12:25:27.185	\N
cmk5qz9v50003jo043m03l0h5	brfvtrbf	exited	cmk5qz9so0001jo045y949ym8	2026-01-08 17:55:03.474	2026-01-28 16:32:09.136	sad
cmky02iio002tr10lil93efg3	XUV 3XO 	exited	cmky02iii002rr10lx4p1wjuk	2026-01-28 12:27:04.128	2026-01-29 06:45:09.603	happy
cmkz3a0cv0002me0kp9x4hp88	SCORPIO CLASSIC 	exited	cmkz3a0ck0000me0k6imezv4u	2026-01-29 06:44:38.863	2026-01-29 06:46:52.724	happy
cmkz3oypa0006me0kmbt31jkx	XUV 7XO ENQUIRY 	exited	cmkz3oyp60004me0kuwph5ziz	2026-01-29 06:56:16.558	2026-01-29 07:09:38.237	happy
cmkz45yqe000eme0kfs6nl3sa	BOLERO ENQUIRY 	exited	cmkz45yqa000cme0kjidp94fa	2026-01-29 07:09:29.751	2026-01-29 08:02:51.835	happy
cmkz3ysxz000ame0khy90bml4	XUV 7XO ENQUIRY 	exited	cmkz3ysxv0008me0kshje9jhl	2026-01-29 07:03:55.655	2026-01-29 08:05:28.966	happy
cmkzc180b000qme0kmdlt90ba	BE6 	exited	cmkzc1808000ome0k4etvn3c2	2026-01-29 10:49:45.419	2026-01-29 10:49:56.772	happy
cmkz63xsb000ime0k0k5b09wl	XUV 7XO ENQUIRY 	exited	cmkz63xs7000gme0k4q4czxo7	2026-01-29 08:03:54.443	2026-01-29 10:56:05.848	happy
cmkze9mtg000yme0kr6px2rbm	XUV 3XO 	exited	cmkze9mtc000wme0ki4xbnz1q	2026-01-29 11:52:17.092	2026-01-29 12:36:12.755	happy
cmkzd99pv000ume0k4lfsc58u	XUV 7XO 	exited	cmkzd99pq000sme0ksiymgd4p	2026-01-29 11:24:00.499	2026-01-29 12:36:24.424	happy
cmkzc02ls000mme0kjyzgf8ix	XEV9S 	exited	cmkzc02lg000kme0kmu0tnkmj	2026-01-29 10:48:51.761	2026-01-29 12:37:19.84	happy
cmkzge5qz0012me0krlg87fj3	Car 7XO enquiry	exited	cmkzge5qv0010me0ku74ykiz3	2026-01-29 12:51:47.484	2026-01-29 12:52:42.561	happy
cmkzjt89v00029y6safvxrqz1	f	exited	cmkzjt7nf00009y6syqpe044a	2026-01-29 14:27:29.443	2026-01-29 14:28:12.116	okay
cml0fm1g40002po0kwhha5h08	XUV 3XO 	exited	cml0fm1ft0000po0kyzvwnqp4	2026-01-30 05:17:41.716	2026-01-30 07:29:16.064	happy
cml0kzttq0058po0kj16dio0s	XEV9E 	intake	cml0kzttm0056po0kdvcldb4q	2026-01-30 07:48:23.102	2026-01-30 07:48:23.102	\N
cml0hvtk20008po0kbe4vwqmy	THAR ROXX 	exited	cml0hvtjz0006po0kdn64gdax	2026-01-30 06:21:17.282	2026-01-30 07:49:21.307	happy
cml0lz2cj005bpo0kxk6kg7ri	looking for xev 9e	intake	cmk55ljp20001js0412fftmc0	2026-01-30 08:15:47.108	2026-01-30 08:15:47.108	\N
cml0kdmv90050po0kpijyjmu0	XUV 3XO 	exited	cml0kdmv5004ypo0k6lpsjfce	2026-01-30 07:31:07.653	2026-01-30 10:16:06.366	happy
cml0ky4cr0054po0k6dkze8l2	SCORPIO-N 	exited	cml0ky4ci0052po0kwovp5x2x	2026-01-30 07:47:03.435	2026-01-30 10:16:15.011	happy
cml0rfe4m0061po0krmqloy66	XUV 7XO 	test_drive	cml0rfe4g005zpo0k98ndy959	2026-01-30 10:48:26.95	2026-01-30 10:48:35.356	\N
cml0prkty005fpo0kdkiqmyf4	THAR ROXX 	exited	cml0prktt005dpo0kvuge4xoc	2026-01-30 10:01:56.278	2026-01-30 10:48:52.975	happy
cml0q4otj005tpo0kfrbrmi3v	XUV 3XO 	exited	cml0q4otg005rpo0kirt6xc6x	2026-01-30 10:12:07.976	2026-01-30 10:49:03.433	happy
cml0q9e7n005xpo0k9hb9osmk	BOLERO NEO 	exited	cml0q9e7i005vpo0kbzrr7got	2026-01-30 10:15:47.507	2026-01-30 10:49:17.528	happy
cml0z4yxx00019yzgl1g72qnp	sd	intake	cmkzjt7nf00009y6syqpe044a	2026-01-30 14:24:17.638	2026-01-30 14:24:17.638	\N
cml1vlqmn0005qi0ktu5qa4oc	XUV 3XO 	test_drive	cml1vlqmb0003qi0kef5m6see	2026-01-31 05:33:07.727	2026-01-31 05:33:45.273	\N
cml26qbma0016qi0knvmnf4je	XUV 7XO 	intake	cmks40pi3002ins0klghr7e6i	2026-01-31 10:44:37.33	2026-01-31 10:44:37.33	\N
cml1wuvqq000bqi0kj68vxtnt	XUV 3XO 	exited	cml1wuvqj0009qi0k4l8w75cd	2026-01-31 06:08:13.874	2026-01-31 11:55:56.77	happy
cml1zwzuk000jqi0kier3789y	XUV 3XO/ XUV 7XO 	exited	cml1zwzu4000hqi0kyztfk397	2026-01-31 07:33:51.344	2026-01-31 11:56:16.251	happy
cml1zxyjv000nqi0kd816xgvf	BOLERO 	exited	cml1zxyjs000lqi0kcwshkhjd	2026-01-31 07:34:36.331	2026-01-31 11:56:28.361	happy
cml205wm8000rqi0kpe1m96da	XUV 7XO 	exited	cml205wm4000pqi0khp2vvnbs	2026-01-31 07:40:47.072	2026-01-31 11:57:02.263	happy
cml20g1sp000vqi0ktd0mbqpu	THAR 	exited	cml20g1sm000tqi0kvysg548l	2026-01-31 07:48:40.346	2026-01-31 11:57:17.75	happy
cml26ix2r000zqi0ksl8q7my8	XUV 7XO 	exited	cml26ix2l000xqi0k7lgnbl9j	2026-01-31 10:38:51.891	2026-01-31 11:57:28.725	happy
cml26k7dq0013qi0k6wa8rhey	XUV 7XO 	exited	cml26k7dn0011qi0kpa8x89tj	2026-01-31 10:39:51.902	2026-01-31 11:57:41.755	happy
cml28kbyn001aqi0ki03i44m7	SCORPION 	exited	cml28kbyj0018qi0k5vt1l1hr	2026-01-31 11:35:57.071	2026-02-02 06:27:56.013	happy
cml4sqe4o0006qn0kwyjpxhsc	SCORPIO-N 	exited	cml4sqe4k0004qn0kzolrnzai	2026-02-02 06:36:04.489	2026-02-02 07:55:22.566	happy
cml4sfouh0002qn0k3286ju1x	XUV 3XO 	exited	cml4sfou60000qn0ket396i0e	2026-02-02 06:27:45.161	2026-02-02 07:55:31.693	happy
cml4vlm4p000aqn0ke687l4p7	THAR ROXX, SCORPIO-N 	exited	cml4vlm4i0008qn0kuejqwxfo	2026-02-02 07:56:20.426	2026-02-02 09:10:02.53	happy
cml4xhbb4000eqn0kerftdrim	To enquire about 3xo	exited	cml4xhbaj000cqn0kl4vn2f1g	2026-02-02 08:48:59.009	2026-02-02 09:10:32.741	happy
cml4y7jyj000iqn0kh0q2u2n2	XEV9S 	exited	cml4y7jyc000gqn0kw72wps5t	2026-02-02 09:09:23.276	2026-02-02 10:12:59.022	happy
cml50up3u000qqn0ka73572e5	XEV9S 	test_drive	cml50up3p000oqn0kf6h9n08m	2026-02-02 10:23:22.267	2026-02-02 11:45:14.993	\N
cml50dw9i000mqn0kyl29noa2	SCORPIO CLASSIC 	exited	cml50dw96000kqn0kebkgrfev	2026-02-02 10:10:18.39	2026-02-02 11:45:29.8	happy
cml51im0f000uqn0koeviy5d3	XUV 7XO 	exited	cml51im0b000sqn0kz9v38jlw	2026-02-02 10:41:58	2026-02-02 11:45:44.365	happy
cml51k3ms000yqn0kqj8oklij	XUV 7XO 	exited	cml51k3mp000wqn0kehga9zfw	2026-02-02 10:43:07.492	2026-02-02 11:45:53.116	happy
cml53ua5i0014qn0kl4vevi2x	THAR/THAR ROXX 	exited	cml53ua5f0012qn0kp0zka8wj	2026-02-02 11:47:01.735	2026-02-02 12:17:08	happy
cml68tis8009bqn0kebkmz876	XUV 3XO 	test_drive	cml68tirs0099qn0kodlss6bo	2026-02-03 06:54:10.521	2026-02-03 06:54:27.079	\N
cml65cjvq0096qn0kpvar3723	XUV 7XO/SCORPIO-N 	test_drive	cml65cjvc0094qn0kysfcjc54	2026-02-03 05:16:59.942	2026-02-03 06:54:47.339	\N
cml696hml009jqn0ka1h1wp1m	7XO ENQUIRY	test_drive	cml696hmg009hqn0kc361cyyh	2026-02-03 07:04:15.549	2026-02-03 07:05:03.397	\N
cml69bcri009sqn0kzypmbzde	.	test_drive	cml69bcrg009qqn0kqckbqed7	2026-02-03 07:08:02.527	2026-02-03 07:10:17.794	\N
cml69a6ne009oqn0kls7lzwap	m	exited	cmkzjt7nf00009y6syqpe044a	2026-02-03 07:07:07.946	2026-02-03 07:10:32.081	okay
cml6i9q2n00anqn0kw2gqrw0k	XUV 7XO 	test_drive	cml6i9q2g00alqn0k26sqgcxn	2026-02-03 11:18:43.007	2026-02-03 11:48:25.516	\N
cml6l07ym00axqn0kr73ksn70	XUV 7XO 	intake	cml6l07yi00avqn0khbas2mlp	2026-02-03 12:35:18.478	2026-02-03 12:35:18.478	\N
cml6l9q5l00b1qn0k6j87pagx	XUV 3XO 	intake	cml6l9q5i00azqn0k3fsh2139	2026-02-03 12:42:41.961	2026-02-03 12:42:41.961	\N
cml6lc9hn00b5qn0kt0p87y2w	XEV9S 	intake	cml6lc9hf00b3qn0k58xsu1yz	2026-02-03 12:44:40.331	2026-02-03 12:44:40.331	\N
cml6il2lb00arqn0kwjnk45mn	BOLERO NEO 	exited	cml6il2l800apqn0kdgwqmb8w	2026-02-03 11:27:32.448	2026-02-03 12:44:53.054	happy
cml6qakdz00019ydpjb63aeez	fds	test_drive	cmkzjt7nf00009y6syqpe044a	2026-02-03 15:03:19.223	2026-02-03 15:04:02.469	\N
cml6qcaj200069ydp3yvgc8ch	fsdfas	exited	cmkzjt7nf00009y6syqpe044a	2026-02-03 15:04:39.758	2026-02-03 15:12:27.103	okay
cml15axxj0001qi0koivj8971	fdsf	exited	cmkzjt7nf00009y6syqpe044a	2026-01-30 17:16:53.958	2026-02-03 15:29:25.548	\N
\.


--
-- Data for Name: WhatsAppTemplate; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public."WhatsAppTemplate" (id, name, "templateId", "templateName", language, type, "dealershipId", "createdAt", "updatedAt", section) FROM stdin;
cmk13jolu0001js04e9dmeen5	Field Inquiry			en_US	field_inquiry	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.21	2026-01-05 11:48:00.21	field_inquiry
cmk130t1a0004l7047cbfjf3z	Test Drive Follow-up	1426745462783971	test_drive_feedback_temp	en_US	test_drive	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-05 12:05:21.779	global
cmk130t1a0005l704gpcvzuo1	Exit Thank You	1614441933012020	welcome_visit_feedback	en_US	exit	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-05 12:06:32.502	global
cmk130t1a0006l704puhu037g	Delivery Reminder	854907410836364	delivery_notify_1_updated	en_US	delivery_reminder	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-05 12:07:47.67	delivery_update
cmk130t1a0008l704clon3csp	Delivery Completion	1386651019021695	delivery_notify_2_updated	en_US	delivery_completion	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-05 12:08:17.774	delivery_update
cmk130t1a0003l704jxxl9792	Welcome Message	25870530502583482	welcome_msg_temp_updated	en_US	welcome	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-07 04:13:52.311	global
cmk130t1a0007l7045upah28m	Digital Enquiry Notification	906197139247940	digital_enquiry_reply_temp_updated1	en_US	digital_enquiry	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-07 04:40:55.932	digital_enquiry
cmivgoujk00039y5i4ja8lso7	Welcome Message	25870530502583482	welcome_msg_temp_updated	en_US	welcome	cmivgorqg00009y5iyf5y9s5b	2025-12-07 08:29:36.8	2026-01-31 15:07:01.861	default
cmivgoujk00059y5ijob55cly	Exit Thank You	1614441933012020	welcome_visit_feedback	en_US	exit	cmivgorqg00009y5iyf5y9s5b	2025-12-07 08:29:36.8	2026-01-31 15:07:01.861	default
cmj7foz0100019ys0jx2zd05y	Digital Enquiry	906197139247940	digital_enquiry_reply_temp_updated1	en_US	digital_enquiry	cmivgorqg00009y5iyf5y9s5b	2025-12-15 17:34:57.073	2026-01-31 15:07:01.861	digital_enquiry
cmivgoujk00049y5i8i0amwz3	Test Drive Follow-up	1426745462783971	test_drive_feedback_temp	en_US	test_drive	cmivgorqg00009y5iyf5y9s5b	2025-12-07 08:29:36.8	2026-01-31 15:07:01.861	default
cmjb4r6lo00059y55kbpw1ozn	Delivery Completion	1386651019021695	delivery_notify_2_updated	en_US	delivery_completion	cmivgorqg00009y5iyf5y9s5b	2025-12-18 07:39:49.164	2026-01-31 15:07:01.861	delivery_update
cmj39r9wl00019yzy4il1210w	Delivery Reminder	854907410836364	delivery_notify_1_updated	en_US	delivery_reminder	cmivgorqg00009y5iyf5y9s5b	2025-12-12 19:37:42.116	2026-01-31 15:07:01.861	delivery_update
cmjvhls4t00019y9iqve59x6x	Field Inquiry	906197139247940	digital_enquiry_reply_temp_updated1	en_US	field_inquiry	cmivgorqg00009y5iyf5y9s5b	2026-01-01 13:34:55.661	2026-01-31 15:07:01.861	field_inquiry
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: utkalUser
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f5bb2d2c-e713-4772-9cf4-4dc9455a8701	ea73c087083fd514369e1133aeb5b10bc980797fde5879f1a75ea25fa4cb9233	2026-01-23 14:38:49.577509+00	20260104131601_init	\N	\N	2026-01-23 14:38:48.773767+00	1
8739809a-a3aa-42b3-8e84-c9297b74fbf2	771b7a5de0a0eb171970c5e8041e19a5f6e84be0af0135c69a7afe928a47236d	2026-01-23 14:39:12.188749+00	20260123143911_add	\N	\N	2026-01-23 14:39:11.713213+00	1
\.


--
-- Name: BulkUploadJobResult BulkUploadJobResult_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."BulkUploadJobResult"
    ADD CONSTRAINT "BulkUploadJobResult_pkey" PRIMARY KEY (id);


--
-- Name: BulkUploadJob BulkUploadJob_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."BulkUploadJob"
    ADD CONSTRAINT "BulkUploadJob_pkey" PRIMARY KEY (id);


--
-- Name: Dealership Dealership_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."Dealership"
    ADD CONSTRAINT "Dealership_pkey" PRIMARY KEY (id);


--
-- Name: DeliveryTicket DeliveryTicket_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."DeliveryTicket"
    ADD CONSTRAINT "DeliveryTicket_pkey" PRIMARY KEY (id);


--
-- Name: DigitalEnquirySession DigitalEnquirySession_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."DigitalEnquirySession"
    ADD CONSTRAINT "DigitalEnquirySession_pkey" PRIMARY KEY (id);


--
-- Name: DigitalEnquiry DigitalEnquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."DigitalEnquiry"
    ADD CONSTRAINT "DigitalEnquiry_pkey" PRIMARY KEY (id);


--
-- Name: FieldInquirySession FieldInquirySession_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."FieldInquirySession"
    ADD CONSTRAINT "FieldInquirySession_pkey" PRIMARY KEY (id);


--
-- Name: FieldInquiry FieldInquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."FieldInquiry"
    ADD CONSTRAINT "FieldInquiry_pkey" PRIMARY KEY (id);


--
-- Name: LeadSource LeadSource_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."LeadSource"
    ADD CONSTRAINT "LeadSource_pkey" PRIMARY KEY (id);


--
-- Name: OrgFeatureToggle OrgFeatureToggle_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."OrgFeatureToggle"
    ADD CONSTRAINT "OrgFeatureToggle_pkey" PRIMARY KEY (id);


--
-- Name: Organization Organization_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."Organization"
    ADD CONSTRAINT "Organization_pkey" PRIMARY KEY (id);


--
-- Name: ScheduledMessage ScheduledMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."ScheduledMessage"
    ADD CONSTRAINT "ScheduledMessage_pkey" PRIMARY KEY (id);


--
-- Name: TestDrive TestDrive_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."TestDrive"
    ADD CONSTRAINT "TestDrive_pkey" PRIMARY KEY (id);


--
-- Name: UserPermission UserPermission_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "UserPermission_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VehicleCategory VehicleCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VehicleCategory"
    ADD CONSTRAINT "VehicleCategory_pkey" PRIMARY KEY (id);


--
-- Name: VehicleModel VehicleModel_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VehicleModel"
    ADD CONSTRAINT "VehicleModel_pkey" PRIMARY KEY (id);


--
-- Name: VehicleVariant VehicleVariant_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VehicleVariant"
    ADD CONSTRAINT "VehicleVariant_pkey" PRIMARY KEY (id);


--
-- Name: VisitorInterest VisitorInterest_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VisitorInterest"
    ADD CONSTRAINT "VisitorInterest_pkey" PRIMARY KEY (id);


--
-- Name: VisitorSession VisitorSession_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VisitorSession"
    ADD CONSTRAINT "VisitorSession_pkey" PRIMARY KEY (id);


--
-- Name: Visitor Visitor_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."Visitor"
    ADD CONSTRAINT "Visitor_pkey" PRIMARY KEY (id);


--
-- Name: WhatsAppTemplate WhatsAppTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."WhatsAppTemplate"
    ADD CONSTRAINT "WhatsAppTemplate_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: BulkUploadJobResult_createdAt_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "BulkUploadJobResult_createdAt_idx" ON public."BulkUploadJobResult" USING btree ("createdAt");


--
-- Name: BulkUploadJobResult_jobId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "BulkUploadJobResult_jobId_idx" ON public."BulkUploadJobResult" USING btree ("jobId");


--
-- Name: BulkUploadJob_createdAt_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "BulkUploadJob_createdAt_idx" ON public."BulkUploadJob" USING btree ("createdAt");


--
-- Name: BulkUploadJob_dealershipId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "BulkUploadJob_dealershipId_idx" ON public."BulkUploadJob" USING btree ("dealershipId");


--
-- Name: BulkUploadJob_jobId_key; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE UNIQUE INDEX "BulkUploadJob_jobId_key" ON public."BulkUploadJob" USING btree ("jobId");


--
-- Name: BulkUploadJob_status_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "BulkUploadJob_status_idx" ON public."BulkUploadJob" USING btree (status);


--
-- Name: Dealership_organizationId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "Dealership_organizationId_idx" ON public."Dealership" USING btree ("organizationId");


--
-- Name: DeliveryTicket_dealershipId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "DeliveryTicket_dealershipId_idx" ON public."DeliveryTicket" USING btree ("dealershipId");


--
-- Name: DeliveryTicket_deliveryDate_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "DeliveryTicket_deliveryDate_idx" ON public."DeliveryTicket" USING btree ("deliveryDate");


--
-- Name: DeliveryTicket_modelId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "DeliveryTicket_modelId_idx" ON public."DeliveryTicket" USING btree ("modelId");


--
-- Name: DeliveryTicket_whatsappNumber_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "DeliveryTicket_whatsappNumber_idx" ON public."DeliveryTicket" USING btree ("whatsappNumber");


--
-- Name: DigitalEnquirySession_digitalEnquiryId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "DigitalEnquirySession_digitalEnquiryId_idx" ON public."DigitalEnquirySession" USING btree ("digitalEnquiryId");


--
-- Name: DigitalEnquirySession_status_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "DigitalEnquirySession_status_idx" ON public."DigitalEnquirySession" USING btree (status);


--
-- Name: DigitalEnquiry_dealershipId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "DigitalEnquiry_dealershipId_idx" ON public."DigitalEnquiry" USING btree ("dealershipId");


--
-- Name: DigitalEnquiry_leadSourceId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "DigitalEnquiry_leadSourceId_idx" ON public."DigitalEnquiry" USING btree ("leadSourceId");


--
-- Name: DigitalEnquiry_whatsappNumber_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "DigitalEnquiry_whatsappNumber_idx" ON public."DigitalEnquiry" USING btree ("whatsappNumber");


--
-- Name: FieldInquirySession_fieldInquiryId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "FieldInquirySession_fieldInquiryId_idx" ON public."FieldInquirySession" USING btree ("fieldInquiryId");


--
-- Name: FieldInquirySession_status_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "FieldInquirySession_status_idx" ON public."FieldInquirySession" USING btree (status);


--
-- Name: FieldInquiry_dealershipId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "FieldInquiry_dealershipId_idx" ON public."FieldInquiry" USING btree ("dealershipId");


--
-- Name: FieldInquiry_leadSourceId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "FieldInquiry_leadSourceId_idx" ON public."FieldInquiry" USING btree ("leadSourceId");


--
-- Name: FieldInquiry_whatsappNumber_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "FieldInquiry_whatsappNumber_idx" ON public."FieldInquiry" USING btree ("whatsappNumber");


--
-- Name: LeadSource_dealershipId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "LeadSource_dealershipId_idx" ON public."LeadSource" USING btree ("dealershipId");


--
-- Name: LeadSource_dealershipId_name_key; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE UNIQUE INDEX "LeadSource_dealershipId_name_key" ON public."LeadSource" USING btree ("dealershipId", name);


--
-- Name: OrgFeatureToggle_organizationId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "OrgFeatureToggle_organizationId_idx" ON public."OrgFeatureToggle" USING btree ("organizationId");


--
-- Name: OrgFeatureToggle_organizationId_key; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE UNIQUE INDEX "OrgFeatureToggle_organizationId_key" ON public."OrgFeatureToggle" USING btree ("organizationId");


--
-- Name: Organization_isActive_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "Organization_isActive_idx" ON public."Organization" USING btree ("isActive");


--
-- Name: Organization_slug_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "Organization_slug_idx" ON public."Organization" USING btree (slug);


--
-- Name: Organization_slug_key; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE UNIQUE INDEX "Organization_slug_key" ON public."Organization" USING btree (slug);


--
-- Name: ScheduledMessage_deliveryTicketId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "ScheduledMessage_deliveryTicketId_idx" ON public."ScheduledMessage" USING btree ("deliveryTicketId");


--
-- Name: ScheduledMessage_scheduledFor_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "ScheduledMessage_scheduledFor_idx" ON public."ScheduledMessage" USING btree ("scheduledFor");


--
-- Name: ScheduledMessage_status_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "ScheduledMessage_status_idx" ON public."ScheduledMessage" USING btree (status);


--
-- Name: TestDrive_modelId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "TestDrive_modelId_idx" ON public."TestDrive" USING btree ("modelId");


--
-- Name: TestDrive_sessionId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "TestDrive_sessionId_idx" ON public."TestDrive" USING btree ("sessionId");


--
-- Name: TestDrive_variantId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "TestDrive_variantId_idx" ON public."TestDrive" USING btree ("variantId");


--
-- Name: UserPermission_userId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "UserPermission_userId_idx" ON public."UserPermission" USING btree ("userId");


--
-- Name: UserPermission_userId_key; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE UNIQUE INDEX "UserPermission_userId_key" ON public."UserPermission" USING btree ("userId");


--
-- Name: User_dealershipId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "User_dealershipId_idx" ON public."User" USING btree ("dealershipId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: User_organizationId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "User_organizationId_idx" ON public."User" USING btree ("organizationId");


--
-- Name: VehicleCategory_dealershipId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "VehicleCategory_dealershipId_idx" ON public."VehicleCategory" USING btree ("dealershipId");


--
-- Name: VehicleCategory_dealershipId_name_key; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE UNIQUE INDEX "VehicleCategory_dealershipId_name_key" ON public."VehicleCategory" USING btree ("dealershipId", name);


--
-- Name: VehicleModel_categoryId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "VehicleModel_categoryId_idx" ON public."VehicleModel" USING btree ("categoryId");


--
-- Name: VehicleVariant_modelId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "VehicleVariant_modelId_idx" ON public."VehicleVariant" USING btree ("modelId");


--
-- Name: VehicleVariant_modelId_name_key; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE UNIQUE INDEX "VehicleVariant_modelId_name_key" ON public."VehicleVariant" USING btree ("modelId", name);


--
-- Name: VisitorInterest_modelId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "VisitorInterest_modelId_idx" ON public."VisitorInterest" USING btree ("modelId");


--
-- Name: VisitorInterest_sessionId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "VisitorInterest_sessionId_idx" ON public."VisitorInterest" USING btree ("sessionId");


--
-- Name: VisitorInterest_variantId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "VisitorInterest_variantId_idx" ON public."VisitorInterest" USING btree ("variantId");


--
-- Name: VisitorInterest_visitorId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "VisitorInterest_visitorId_idx" ON public."VisitorInterest" USING btree ("visitorId");


--
-- Name: VisitorInterest_visitorId_modelId_variantId_sessionId_key; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE UNIQUE INDEX "VisitorInterest_visitorId_modelId_variantId_sessionId_key" ON public."VisitorInterest" USING btree ("visitorId", "modelId", "variantId", "sessionId");


--
-- Name: VisitorSession_status_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "VisitorSession_status_idx" ON public."VisitorSession" USING btree (status);


--
-- Name: VisitorSession_visitorId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "VisitorSession_visitorId_idx" ON public."VisitorSession" USING btree ("visitorId");


--
-- Name: Visitor_dealershipId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "Visitor_dealershipId_idx" ON public."Visitor" USING btree ("dealershipId");


--
-- Name: Visitor_whatsappNumber_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "Visitor_whatsappNumber_idx" ON public."Visitor" USING btree ("whatsappNumber");


--
-- Name: WhatsAppTemplate_dealershipId_idx; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE INDEX "WhatsAppTemplate_dealershipId_idx" ON public."WhatsAppTemplate" USING btree ("dealershipId");


--
-- Name: WhatsAppTemplate_dealershipId_type_section_key; Type: INDEX; Schema: public; Owner: utkalUser
--

CREATE UNIQUE INDEX "WhatsAppTemplate_dealershipId_type_section_key" ON public."WhatsAppTemplate" USING btree ("dealershipId", type, section);


--
-- Name: DeliveryTicket DeliveryTicket_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."DeliveryTicket"
    ADD CONSTRAINT "DeliveryTicket_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DeliveryTicket DeliveryTicket_modelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."DeliveryTicket"
    ADD CONSTRAINT "DeliveryTicket_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DeliveryTicket DeliveryTicket_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."DeliveryTicket"
    ADD CONSTRAINT "DeliveryTicket_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public."VehicleVariant"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DigitalEnquirySession DigitalEnquirySession_digitalEnquiryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."DigitalEnquirySession"
    ADD CONSTRAINT "DigitalEnquirySession_digitalEnquiryId_fkey" FOREIGN KEY ("digitalEnquiryId") REFERENCES public."DigitalEnquiry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DigitalEnquiry DigitalEnquiry_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."DigitalEnquiry"
    ADD CONSTRAINT "DigitalEnquiry_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DigitalEnquiry DigitalEnquiry_interestedModelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."DigitalEnquiry"
    ADD CONSTRAINT "DigitalEnquiry_interestedModelId_fkey" FOREIGN KEY ("interestedModelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DigitalEnquiry DigitalEnquiry_interestedVariantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."DigitalEnquiry"
    ADD CONSTRAINT "DigitalEnquiry_interestedVariantId_fkey" FOREIGN KEY ("interestedVariantId") REFERENCES public."VehicleVariant"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DigitalEnquiry DigitalEnquiry_leadSourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."DigitalEnquiry"
    ADD CONSTRAINT "DigitalEnquiry_leadSourceId_fkey" FOREIGN KEY ("leadSourceId") REFERENCES public."LeadSource"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FieldInquirySession FieldInquirySession_fieldInquiryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."FieldInquirySession"
    ADD CONSTRAINT "FieldInquirySession_fieldInquiryId_fkey" FOREIGN KEY ("fieldInquiryId") REFERENCES public."FieldInquiry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FieldInquiry FieldInquiry_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."FieldInquiry"
    ADD CONSTRAINT "FieldInquiry_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FieldInquiry FieldInquiry_interestedModelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."FieldInquiry"
    ADD CONSTRAINT "FieldInquiry_interestedModelId_fkey" FOREIGN KEY ("interestedModelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FieldInquiry FieldInquiry_interestedVariantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."FieldInquiry"
    ADD CONSTRAINT "FieldInquiry_interestedVariantId_fkey" FOREIGN KEY ("interestedVariantId") REFERENCES public."VehicleVariant"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FieldInquiry FieldInquiry_leadSourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."FieldInquiry"
    ADD CONSTRAINT "FieldInquiry_leadSourceId_fkey" FOREIGN KEY ("leadSourceId") REFERENCES public."LeadSource"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LeadSource LeadSource_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."LeadSource"
    ADD CONSTRAINT "LeadSource_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: OrgFeatureToggle OrgFeatureToggle_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."OrgFeatureToggle"
    ADD CONSTRAINT "OrgFeatureToggle_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ScheduledMessage ScheduledMessage_deliveryTicketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."ScheduledMessage"
    ADD CONSTRAINT "ScheduledMessage_deliveryTicketId_fkey" FOREIGN KEY ("deliveryTicketId") REFERENCES public."DeliveryTicket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestDrive TestDrive_modelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."TestDrive"
    ADD CONSTRAINT "TestDrive_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestDrive TestDrive_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."TestDrive"
    ADD CONSTRAINT "TestDrive_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."VisitorSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestDrive TestDrive_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."TestDrive"
    ADD CONSTRAINT "TestDrive_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public."VehicleVariant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: UserPermission UserPermission_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."UserPermission"
    ADD CONSTRAINT "UserPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: User User_organizationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES public."Organization"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VehicleCategory VehicleCategory_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VehicleCategory"
    ADD CONSTRAINT "VehicleCategory_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VehicleModel VehicleModel_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VehicleModel"
    ADD CONSTRAINT "VehicleModel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."VehicleCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VehicleVariant VehicleVariant_modelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VehicleVariant"
    ADD CONSTRAINT "VehicleVariant_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisitorInterest VisitorInterest_modelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VisitorInterest"
    ADD CONSTRAINT "VisitorInterest_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisitorInterest VisitorInterest_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VisitorInterest"
    ADD CONSTRAINT "VisitorInterest_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."VisitorSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisitorInterest VisitorInterest_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VisitorInterest"
    ADD CONSTRAINT "VisitorInterest_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public."VehicleVariant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisitorInterest VisitorInterest_visitorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VisitorInterest"
    ADD CONSTRAINT "VisitorInterest_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES public."Visitor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisitorSession VisitorSession_visitorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."VisitorSession"
    ADD CONSTRAINT "VisitorSession_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES public."Visitor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Visitor Visitor_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."Visitor"
    ADD CONSTRAINT "Visitor_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WhatsAppTemplate WhatsAppTemplate_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: utkalUser
--

ALTER TABLE ONLY public."WhatsAppTemplate"
    ADD CONSTRAINT "WhatsAppTemplate_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: utkalUser
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict JQh0uflwai8OsoJumikcaWheMz8eROlkipb43nqD9XTcQAMnOGCgQfmTqDhMrGG

