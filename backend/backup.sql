--
-- PostgreSQL database dump
--

\restrict kpat3eK88YlBlHsuFN5wEbnRZvd8pFbfSRzGM3wI9h4qTwbCYkCwoY4Z1cC3uie

-- Dumped from database version 17.7 (e429a59)
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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Dealership; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Dealership" (
    id text NOT NULL,
    name text NOT NULL,
    location text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "showroomNumber" text
);


ALTER TABLE public."Dealership" OWNER TO neondb_owner;

--
-- Name: DeliveryTicket; Type: TABLE; Schema: public; Owner: neondb_owner
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
    "dealershipId" text NOT NULL,
    "modelId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "variantId" text,
    "completionSent" boolean DEFAULT false NOT NULL,
    status text DEFAULT 'active'::text NOT NULL
);


ALTER TABLE public."DeliveryTicket" OWNER TO neondb_owner;

--
-- Name: DigitalEnquiry; Type: TABLE; Schema: public; Owner: neondb_owner
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
    "dealershipId" text NOT NULL,
    "leadSourceId" text,
    "interestedModelId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "interestedVariantId" text
);


ALTER TABLE public."DigitalEnquiry" OWNER TO neondb_owner;

--
-- Name: DigitalEnquirySession; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."DigitalEnquirySession" (
    id text NOT NULL,
    notes text,
    status text DEFAULT 'active'::text NOT NULL,
    "digitalEnquiryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."DigitalEnquirySession" OWNER TO neondb_owner;

--
-- Name: FieldInquiry; Type: TABLE; Schema: public; Owner: neondb_owner
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
    "dealershipId" text NOT NULL,
    "leadSourceId" text,
    "interestedModelId" text,
    "interestedVariantId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FieldInquiry" OWNER TO neondb_owner;

--
-- Name: FieldInquirySession; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."FieldInquirySession" (
    id text NOT NULL,
    notes text,
    status text DEFAULT 'active'::text NOT NULL,
    "fieldInquiryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."FieldInquirySession" OWNER TO neondb_owner;

--
-- Name: LeadSource; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."LeadSource" (
    id text NOT NULL,
    name text NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "dealershipId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."LeadSource" OWNER TO neondb_owner;

--
-- Name: ScheduledMessage; Type: TABLE; Schema: public; Owner: neondb_owner
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


ALTER TABLE public."ScheduledMessage" OWNER TO neondb_owner;

--
-- Name: TestDrive; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."TestDrive" (
    id text NOT NULL,
    "sessionId" text NOT NULL,
    "modelId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "variantId" text
);


ALTER TABLE public."TestDrive" OWNER TO neondb_owner;

--
-- Name: User; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."User" (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "dealershipId" text,
    theme text DEFAULT 'light'::text NOT NULL,
    "profilePicture" text
);


ALTER TABLE public."User" OWNER TO neondb_owner;

--
-- Name: VehicleCategory; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."VehicleCategory" (
    id text NOT NULL,
    name text NOT NULL,
    "dealershipId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VehicleCategory" OWNER TO neondb_owner;

--
-- Name: VehicleModel; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."VehicleModel" (
    id text NOT NULL,
    name text NOT NULL,
    year integer,
    "categoryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VehicleModel" OWNER TO neondb_owner;

--
-- Name: VehicleVariant; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."VehicleVariant" (
    id text NOT NULL,
    name text NOT NULL,
    "modelId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VehicleVariant" OWNER TO neondb_owner;

--
-- Name: Visitor; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."Visitor" (
    id text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    "whatsappNumber" text NOT NULL,
    email text,
    address text,
    "whatsappContactId" text,
    "dealershipId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Visitor" OWNER TO neondb_owner;

--
-- Name: VisitorInterest; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."VisitorInterest" (
    id text NOT NULL,
    "visitorId" text NOT NULL,
    "modelId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "sessionId" text,
    "variantId" text
);


ALTER TABLE public."VisitorInterest" OWNER TO neondb_owner;

--
-- Name: VisitorSession; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."VisitorSession" (
    id text NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'intake'::text NOT NULL,
    "visitorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."VisitorSession" OWNER TO neondb_owner;

--
-- Name: WhatsAppTemplate; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public."WhatsAppTemplate" (
    id text NOT NULL,
    name text NOT NULL,
    "templateId" text NOT NULL,
    "templateName" text NOT NULL,
    language text DEFAULT 'en_US'::text NOT NULL,
    type text NOT NULL,
    "dealershipId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    section text DEFAULT 'global'::text
);


ALTER TABLE public."WhatsAppTemplate" OWNER TO neondb_owner;

--
-- Data for Name: Dealership; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Dealership" (id, name, location, "createdAt", "updatedAt", "showroomNumber") FROM stdin;
cmivgorqg00009y5iyf5y9s5b	Utkal Mahindra	Mancheswar, Rasulgarh, Bhubaneswar	2025-12-07 08:29:33.16	2026-01-05 11:29:47.213	9595959590
cmk130qz40000l704z6fc2alp	Utkal Mahindra	Mancheswar	2026-01-05 11:33:16.816	2026-01-05 12:36:57.562	7008985634
\.


--
-- Data for Name: DeliveryTicket; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."DeliveryTicket" (id, "firstName", "lastName", "whatsappNumber", email, address, description, "deliveryDate", "messageSent", "whatsappContactId", "dealershipId", "modelId", "createdAt", "updatedAt", "variantId", "completionSent", status) FROM stdin;
cmk5siz2u0001jv04cuwqdg55	TEST	Ruki	7735322819	admin@chati.ai	bbsr	yfjgh	2026-01-10 00:00:00	t		cmivgorqg00009y5iyf5y9s5b	cmiztq99k0003jo0426lvvjyd	2026-01-08 18:38:22.23	2026-01-08 18:38:23.613	\N	f	active
cmk6l9m7n0001js04eweo1ek8	Abhilash	Panda	9090090150	abhilash.panda8383@gmail.com	Bomikhal	ytdbgcysdgc	2026-01-09 00:00:00	t		cmivgorqg00009y5iyf5y9s5b	cmiztscns000fl704c6yki0ju	2026-01-09 08:02:54.516	2026-01-09 08:02:55.676	\N	f	active
cmk6liulf0003js04q6pbczgx	Milinid	San	9937503365	abhilash.panda8654@gmail.com	Bomikhal	\N	2026-01-09 00:00:00	t	6960b7ddefb0dd7e3d0b278b	cmivgorqg00009y5iyf5y9s5b	cmiztp1ll0009l704zwumbdwc	2026-01-09 08:10:05.283	2026-01-09 08:10:06.309	\N	f	active
cmk86e2wa0008ld04jcs65tlm	Aji	Bhai	8981446268	abhilash.panda8654@gmail.com	bhubaneswar	Car delivery	2026-01-10 00:00:00	t	69622c2af5d2f8f3c86a8b21	cmivgorqg00009y5iyf5y9s5b	cmiztoo5h0007l704gbh0c0zn	2026-01-10 10:42:00.875	2026-01-10 10:42:41.301	\N	t	closed
cmk86r04u0003i2045n6km7fb	Madusmtita	Parida	9337938937	abhilash.panda8654@gmail.com	Rasulgarh, Bhubaneswar	Delivery	2026-01-10 00:00:00	t	69622e21f5d2f8f3c86a93d0	cmivgorqg00009y5iyf5y9s5b	cmiztpjr70001jo044eu3c9m7	2026-01-10 10:52:03.823	2026-01-10 10:52:45.777	\N	t	closed
cmk5eyo2i0009jy048vb8s2qe	MONALISA	PRADHAN	7064645937	monalisapradhan7439@gmail.com	BBSR	vehicle delivery	2026-01-11 00:00:00	t	695f9d608ba75797369a342e	cmk130qz40000l704z6fc2alp	cmk13mrb90003lc04v9gamlr0	2026-01-08 12:18:39.835	2026-01-12 07:51:03.665	\N	t	closed
cmk57qwm80001l504cx624679	Rakesh	Swain	7978585992	cxhead@utkalautomobiles.com	Bhubaneswar	FDYHTFDJTR	2026-01-08 00:00:00	t	6939306b32ca55336d785d29	cmk130qz40000l704z6fc2alp	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:56:40.353	2026-01-08 09:01:02.132	\N	t	closed
cmk5shx7f0001i804ugfen396	Mors	Ruki	7735322819	admin@chati.ai	bbsr	fvjknm./.,	2026-11-22 00:00:00	f		cmivgorqg00009y5iyf5y9s5b	cmiztpjr70001jo044eu3c9m7	2026-01-08 18:37:33.148	2026-01-08 18:37:33.148	\N	f	active
\.


--
-- Data for Name: DigitalEnquiry; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."DigitalEnquiry" (id, "firstName", "lastName", "whatsappNumber", email, address, reason, "leadScope", "whatsappContactId", "dealershipId", "leadSourceId", "interestedModelId", "createdAt", "updatedAt", "interestedVariantId") FROM stdin;
cmk57dd0j000jlb04xgz3rwgt	Deepak	Kumar Garabadu	9938826252	\N	KHORDHA	Enquiry from 1/2/2026	cold	695f6ed00063bd8e932d1a11	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:08.42	2026-01-08 08:46:08.42	\N
cmk57de4u000llb04pxajbfwc	Mihir	MISHRA	9937499993	\N	KHORDHA	Enquiry from 1/6/2026	cold	695f6ed10063bd8e932d1a37	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:09.87	2026-01-08 08:46:09.87	\N
cmk55z01z0003kz04ojyjsk5r	Rakesh	Swain	7978585992	cxhead@utkalautomobiles.com	Bhubaneswar	For 3xo enquiry	warm	6939306b32ca55336d785d29	cmk130qz40000l704z6fc2alp	cmk13joo00007js04cxk0xw1o	cmk13mis60007js04xgg2p6bl	2026-01-08 08:06:58.823	2026-01-08 08:06:58.823	\N
cmk56we950007kz04zbi0303d	Rakesh	Swain	7978585992	\N	Bhubanesewar	Enquiry from 1/8/2026	warm	6939306b32ca55336d785d29	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:32:56.873	2026-01-08 08:36:12.946	\N
cmk56wctp0005kz0474cvbjp9	Ananda	Kandher	7894530970	\N	Bhubaneswar	Enquiry from 1/5/2026	hot	695f6bb60063bd8e932d0df5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-08 08:32:55.021	2026-01-08 08:36:15.513	\N
cmk57d2rg0001lb04wuvligw2	Bishal	Pilley	9040703063	\N	CUTTACK	Enquiry from 1/7/2026	cold	695f6ec30063bd8e932d1905	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:45:55.133	2026-01-08 08:45:55.133	\N
cmk57d4aa0003lb0489huxff0	Susanta	. Pradhan	9090869369	\N	KHORDHA	Enquiry from 1/7/2026	cold	695f6ec50063bd8e932d1929	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:45:57.107	2026-01-08 08:45:57.107	\N
cmk57d5e30005lb04v88cefww	Chiranjit	clenka	8984302330	\N	KHORDHA	Enquiry from 1/6/2026	cold	695f6ec60063bd8e932d1945	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:45:58.539	2026-01-08 08:45:58.539	\N
cmk57d6g70007lb04uqdyg9cb	Santosh	.	7978716817	\N	JAJPUR	Enquiry from 1/6/2026	cold	695f6ec70063bd8e932d195c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:45:59.911	2026-01-08 08:45:59.911	\N
cmk57d7kc0009lb0485hdh35d	UTKAL	AUTOMOBILE PVT LTD	9437039621	\N	KHORDHA	Enquiry from 1/2/2026	cold	694e8203c4c394fdd37e8b2e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:01.356	2026-01-08 08:46:01.356	\N
cmk57d8ns000blb04man68aoe	SANTANUH	MOHANTA	8455890408	\N	KHORDHA	Enquiry from 1/2/2026	cold	695f6eca0063bd8e932d1987	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:02.777	2026-01-08 08:46:02.777	\N
cmk57da0a000dlb04hm6ifdve	Tariq	Sheikh	7978133382	\N	KHORDHA	Enquiry from 1/6/2026	cold	695f6ecc0063bd8e932d19ae	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:04.523	2026-01-08 08:46:04.523	\N
cmk57dawi000flb04ys8zqpz9	Atman	Atman	9861621111	\N	CUTTACK	Enquiry from 1/5/2026	cold	695f6ecd0063bd8e932d19c3	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:05.682	2026-01-08 08:46:05.682	\N
cmk57dby8000hlb04uvwzmog8	Rashmi	Ranjan .	8123769168	\N	KHORDHA	Enquiry from 1/7/2026	cold	695f6ece0063bd8e932d19e8	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:07.04	2026-01-08 08:46:07.04	\N
cmk57df1i000nlb048xg3ghxb	Bibhudatta	Jena	9438434241	\N	KHORDHA	Enquiry from 1/5/2026	cold	695f6ed20063bd8e932d1a57	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:11.046	2026-01-08 08:46:11.046	\N
cmk57dg50000plb047ukqyam9	SabyasachiMohanty	.	9040095927	\N	KHORDHA	Enquiry from 1/4/2026	cold	695f6ed40063bd8e932d1a6c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:12.468	2026-01-08 08:46:12.468	\N
cmk57dh13000rlb04blmn1e3v	Sudam	Behera	9827877234	\N	CUTTACK	Enquiry from 1/7/2026	cold	695f6ed50063bd8e932d1a81	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:13.623	2026-01-08 08:46:13.623	\N
cmk57di5h000tlb04wi7l76vm	Aman	Agarwal	7978036559	\N	MAYURBHANJ	Enquiry from 1/5/2026	cold	695f6ed70063bd8e932d1aa6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:15.077	2026-01-08 08:46:15.077	\N
cmk57dj9g000vlb04m18ww660	Sankar	. Sankar	9966828184	\N	KHORDHA	Enquiry from 1/5/2026	cold	695f6ed80063bd8e932d1abb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:16.517	2026-01-08 08:46:16.517	\N
cmk57dkfj000xlb04z3kxvnz9	TUKARAM	.	7008655780	\N	KHORDHA	Enquiry from 1/6/2026	cold	695f6ed90063bd8e932d1ad0	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:18.032	2026-01-08 08:46:18.032	\N
cmk57dlg5000zlb04cozo13el	UTKAL	AUTOMOBILES	7008019701	\N	KHORDHA	Enquiry from 1/2/2026	cold	695f6edb0063bd8e932d1ae5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:19.349	2026-01-08 08:46:19.349	\N
cmk57dmdk0011lb04s7033o4k	Soumyajeet	lenkan	7751025246	\N	KHORDHA	Enquiry from 1/7/2026	cold	695f6edc0063bd8e932d1afa	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:20.553	2026-01-08 08:46:20.553	\N
cmk57dncw0013lb04i3vqekej	SOMANATH	MOHANTY	9776494630	\N	KHORDHA	Enquiry from 1/6/2026	cold	695f6edd0063bd8e932d1b13	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:21.824	2026-01-08 08:46:21.824	\N
cmk57dojg0015lb0428chv0kt	Prasanjit	Bhuyan	9348319828	\N	JAJPUR	Enquiry from 1/6/2026	cold	695f6edf0063bd8e932d1b28	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:23.356	2026-01-08 08:46:23.356	\N
cmk57dq0g0017lb04wnoe640d	Sagar	Kumar Pradhan	7008513161	\N	ANGUL	Enquiry from 1/6/2026	cold	695f6ee10063bd8e932d1b51	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:25.265	2026-01-08 08:46:25.265	\N
cmk57dr740019lb04eqmgymh9	Pratyush	Rout	9937585608	\N	KHORDHA	Enquiry from 1/5/2026	cold	695f6ee20063bd8e932d1b75	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:26.8	2026-01-08 08:46:26.8	\N
cmk57dsio001blb044ch7tipp	DIGVIJAY	SAHA	7847861761	\N	CUTTACK	Enquiry from 1/6/2026	cold	695f6ee40063bd8e932d1b8a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:28.512	2026-01-08 08:46:28.512	\N
cmk57dtkh001dlb0418385yiv	Yuvraj	Agarwal	6370951770	\N	KHORDHA	Enquiry from 1/4/2026	cold	695f6ee50063bd8e932d1b9f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:29.874	2026-01-08 08:46:29.874	\N
cmk57dve1001flb0456fhykr0	Sriram	..	7795351015	\N	KHORDHA	Enquiry from 1/5/2026	cold	695f6ee80063bd8e932d1bb5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:32.233	2026-01-08 08:46:32.233	\N
cmk57dwbu001hlb04hy2edhtt	Debabrata	samantaray	8280375042	\N	CUTTACK	Enquiry from 1/7/2026	cold	695f6ee90063bd8e932d1bd6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:33.45	2026-01-08 08:46:33.45	\N
cmk57dx5x001jlb04ckbn38c3	UTKAL	AUTOMOBILES PVT LTD	9938018737	\N	KHORDHA	Enquiry from 1/2/2026	cold	695f6eea0063bd8e932d1beb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:34.534	2026-01-08 08:46:34.534	\N
cmk57dy5s001llb0459p8tvvr	Sanjeet	Parida	9861419229	\N	KHORDHA	Enquiry from 1/1/2026	cold	695f6eeb0063bd8e932d1c00	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:35.824	2026-01-08 08:46:35.824	\N
cmk57dz7y001nlb04fam4w0g4	Rakesh	.	8270955254	\N	KHORDHA	Enquiry from 1/6/2026	cold	695f6eed0063bd8e932d1c15	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:37.198	2026-01-08 08:46:37.198	\N
cmk57e06l001plb04ei6r37w3	SATYAJEET	SAHOO	8917391266	\N	CUTTACK	Enquiry from 1/5/2026	cold	695f6eee0063bd8e932d1c2b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:38.446	2026-01-08 08:46:38.446	\N
cmk57e1al001rlb041365fmbt	DIBYAJYOTI	NAYAK	7008989259	\N	BHUBANESWAR	Enquiry from 1/5/2026	cold	695f6eef0063bd8e932d1c40	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 08:46:39.886	2026-01-08 08:46:39.886	\N
cmkb4vi9p0001l104xt4s2nig	Sanjeet	Parida	9861419229	\N	BHUBANESWAR	Enquiry from 1/2/2026	cold	695f6eeb0063bd8e932d1c00	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:22:53.246	2026-01-12 12:22:53.246	\N
cmkb4vk1q0003l104qib8vbay	SANJAY	NAYAK	9776160290	\N	MANCHESWAR	Enquiry from 1/2/2026	cold	6964e79ff5d2f8f3c8764cba	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:22:55.551	2026-01-12 12:22:55.551	\N
cmkb4vkx80005l1048g6mxy4y	SANTANUH	MOHANTA	8455890408	\N	BHUBANESWAR	Enquiry from 1/2/2026	cold	695f6eca0063bd8e932d1987	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:22:56.684	2026-01-12 12:22:56.684	\N
cmkb4vm5v0007l104jb1lyybg	G	RAJA KUMAR	8093905443	\N	KORAPUT	Enquiry from 1/2/2026	cold	6964e7a2f5d2f8f3c8764cfe	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:22:58.291	2026-01-12 12:22:58.291	\N
cmkb4vnd40009l104wqul167g	DEEPAK	KUMAR SETHY	9439328410	\N	ASKA	Enquiry from 1/2/2026	cold	6964e7a3f5d2f8f3c8764d1c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:22:59.848	2026-01-12 12:22:59.848	\N
cmkb4voi4000bl104gi80727n	SANTOSH	MEHER	9777075995	\N	NUAPADA	Enquiry from 1/2/2026	cold	6964e7a5f5d2f8f3c8764d31	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:23:01.324	2026-01-12 12:23:01.324	\N
cmkb4vpif000dl104cydpvz8j	PRIYASH	PRASAD SAHOO	8658587982	\N	MANCHESWAR	Enquiry from 1/2/2026	cold	6964e7a6f5d2f8f3c8764d48	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:23:02.631	2026-01-12 12:23:02.631	\N
cmkb4vqg0000fl104g27yrlno	LAL	KUMAR	9592661605	\N	BERHAMPUR	Enquiry from 1/2/2026	cold	6964e7a7f5d2f8f3c8764d66	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:03.841	2026-01-12 12:23:03.841	\N
cmkb4vrbq000hl104s60q79gc	KANHA	SAHOO	7978165986	\N	BHAWANIPATNA	Enquiry from 1/3/2026	cold	6964e7a8f5d2f8f3c8764d8b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-12 12:23:04.983	2026-01-12 12:23:04.983	\N
cmkb4vsf7000jl1046bsplzte	RITESH	KUMAR JENA	7008546641	\N	MANCHESWAR	Enquiry from 1/3/2026	cold	6964e7aaf5d2f8f3c8764da9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:06.404	2026-01-12 12:23:06.404	\N
cmkb4vtjc000ll104kj15fklj	SARTHAK		7978919399	\N	SAMBALPUR	Enquiry from 1/3/2026	cold	6964e7abf5d2f8f3c8764dc7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:23:07.848	2026-01-12 12:23:07.848	\N
cmkb4vul2000nl104h7d3wg7n	Somanath	naik	7978886123	\N	BHUBANESWAR	Enquiry from 1/5/2026	cold	6964e7adf5d2f8f3c8764dec	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-12 12:23:09.207	2026-01-12 12:23:09.207	\N
cmkb4vvop000pl104z9pqkjzu	RANJAN	PATRA	8596082689	\N	NAYAPALI	Enquiry from 1/5/2026	cold	6964e7aef5d2f8f3c8764e11	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:23:10.633	2026-01-12 12:23:10.633	\N
cmkb4vwoq000rl104mcj45sfx	JAGANNATH	SAHOO	9437929730	\N	BERHAMPUR	Enquiry from 1/6/2026	cold	6964e7aff5d2f8f3c8764e38	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:23:11.93	2026-01-12 12:23:11.93	\N
cmkb4vxhv000tl104i1533219	Atman	ACHARYA	9861621111	\N	ACHARYA VIHAR	Enquiry from 1/6/2026	cold	695f6ecd0063bd8e932d19c3	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:12.98	2026-01-12 12:23:12.98	\N
cmkb4vykg000vl104z4nry21b	Akash	Naik	7751975160	\N	BHUBANESWAR	Enquiry from 1/6/2026	cold	6964e7b2f5d2f8f3c8764e7a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-12 12:23:14.368	2026-01-12 12:23:14.368	\N
cmkb4vzqz000xl104vh8k9j1d	SASANKA	RATH	8342945477	\N	RAYAGADA	Enquiry from 1/6/2026	cold	6964e7b3f5d2f8f3c8764e9a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:15.899	2026-01-12 12:23:15.899	\N
cmkb4w0vc000zl104wsnulstk	BISWANATH	GOUDA	7978307657	\N	ROURKELA	Enquiry from 1/6/2026	cold	6964e7b5f5d2f8f3c8764ec0	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:17.352	2026-01-12 12:23:17.352	\N
cmkb4w1yk0011l1048ayw2j7w	YUVRAJ		7008426309	\N	RAYAGADA	Enquiry from 1/6/2026	cold	6964e7b6f5d2f8f3c8764ed5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:18.764	2026-01-12 12:23:18.764	\N
cmkb4w2xx0013l1041tpea7e8	Rakesh		8270955254	\N	BHUBANESWAR	Enquiry from 1/6/2026	cold	695f6eed0063bd8e932d1c15	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:20.037	2026-01-12 12:23:20.037	\N
cmkb4w3z00015l104jb6jv64z	SUBRAT	KUMAR SAHOO	7328060487	\N	BARAMUNDA	Enquiry from 1/6/2026	cold	6964e7b9f5d2f8f3c8764efa	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:23:21.373	2026-01-12 12:23:21.373	\N
cmkb4w4x60017l104hp8f9npu	SATYAPRIYA	JENA	9692466841	\N	KHORDHA	Enquiry from 1/6/2026	cold	6964e7baf5d2f8f3c8764f0f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:23:22.602	2026-01-12 12:23:22.602	\N
cmkb4w5s60019l1040rx4z5vf	Meenakshi	Padhy	9583098065	\N	NAYAPALI	Enquiry from 1/6/2026	cold	6964e7bbf5d2f8f3c8764f28	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:23:23.719	2026-01-12 12:23:23.719	\N
cmkb4w6yg001bl1042hvcqhc5	ASHUTOSH	CHHOUDHARY	7205225870	\N	BERHAMPUR	Enquiry from 1/7/2026	cold	6964e7bdf5d2f8f3c8764f3d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:25.24	2026-01-12 12:23:25.24	\N
cmkb4w7vl001dl104a2hwlvot	SUBRAT	SAMAL	9337973019	\N	TALCHER	Enquiry from 1/7/2026	cold	6964e7bef5d2f8f3c8764f62	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:23:26.433	2026-01-12 12:23:26.433	\N
cmkb4w8wv001fl104tnkghrop	SANDIP	PANDA	9439771558	\N	SAMBALPUR	Enquiry from 1/7/2026	cold	6964e7bff5d2f8f3c8764f78	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:23:27.775	2026-01-12 12:23:27.775	\N
cmkb4wa12001hl1040to6qvls	JORAM	PARICHHA	9827062767	\N	PARALAKHEMUNDI	Enquiry from 1/8/2026	cold	6964e7c1f5d2f8f3c8764f8d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:23:29.223	2026-01-12 12:23:29.223	\N
cmkb4wbk2001jl1047r5kcxnm	Abdul	Rauf Shaikh	9437078640	\N	BHUBANESWAR	Enquiry from 1/8/2026	cold	6964e7c3f5d2f8f3c8764fa2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:31.203	2026-01-12 12:23:31.203	\N
cmkb4wckj001ll1040tbqriyj	Shubham	Biswal	7978770585	\N	OLD TOWN	Enquiry from 1/8/2026	cold	6964e7c4f5d2f8f3c8764fb7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:32.515	2026-01-12 12:23:32.515	\N
cmkb4wdlb001nl104pcyzrq5u	Subhajit	Behera	8457062256	\N	RASULGARH	Enquiry from 1/8/2026	cold	6964e7c5f5d2f8f3c8764fcc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:33.84	2026-01-12 12:23:33.84	\N
cmkb4wej5001pl104912xg8v9	NIHAR	RANJAN SWAIN	9438027058	\N	NAYAPALLI	Enquiry from 1/8/2026	cold	6964e7c7f5d2f8f3c8764fe1	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:23:35.058	2026-01-12 12:23:35.058	\N
cmkb4wfsb001rl104qkakiqrk	BHABANI	SANKAR MISHRA	8249838178	\N	AIIMS	Enquiry from 1/9/2026	cold	6964e7c8f5d2f8f3c8764ff6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:23:36.684	2026-01-12 12:23:36.684	\N
cmkb4wgmk001tl10498l9ew05	NIHAR	Agarwal	9777996972	\N	NAYAPALI	Enquiry from 1/9/2026	cold	6964e7c9f5d2f8f3c876500b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:37.772	2026-01-12 12:23:37.772	\N
cmkb4whpf001vl104ivgxsyyu	DEBASISH	MOHAPATRA	9535554241	\N	BANGALORE	Enquiry from 1/9/2026	cold	6964e7cbf5d2f8f3c8765020	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:23:39.171	2026-01-12 12:23:39.171	\N
cmkb4wivy001xl104jt4x9cf7	SIMANCHAL	BABOO	9556780460	\N	BALANGIR	Enquiry from 1/9/2026	cold	6964e7ccf5d2f8f3c8765035	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:23:40.702	2026-01-12 12:23:40.702	\N
cmkb4wjxt001zl104d8vb2nai	PRAVUJEET	SABUT	8018303899	\N	NIALI	Enquiry from 1/9/2026	cold	6964e7cef5d2f8f3c8765055	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:42.066	2026-01-12 12:23:42.066	\N
cmkb4wkx50021l1042slo2ja4	AKASH	DHANWAR	8342985097	\N	SUNDARAGADA	Enquiry from 1/10/2026	cold	6964e7cff5d2f8f3c8765073	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:23:43.337	2026-01-12 12:23:43.337	\N
cmkb4wm1i0023l104dltutico	JYOTIRMAYA	MAHAPATRA	9938110551	\N	MANCHESWAR	Enquiry from 1/10/2026	cold	6964e7d0f5d2f8f3c876509a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:44.79	2026-01-12 12:23:44.79	\N
cmkb4wn9a0025l104adi9wznw	TANUP	GOCHHAYAT	9739261099	\N	BBSR	Enquiry from 1/10/2026	cold	6964e7d2f5d2f8f3c87650b5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:46.366	2026-01-12 12:23:46.366	\N
cmkb4wo960027l104ku5qz6m1	SWARAJ		7381133848	\N	BALIANTA	Enquiry from 1/10/2026	cold	6964e7d3f5d2f8f3c87650ca	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:47.658	2026-01-12 12:23:47.658	\N
cmkb4wpbs0029l104tjq2fhot	DebasisRoutray	.	7381087329	\N	KALPANA	Enquiry from 1/10/2026	cold	6964e7d4f5d2f8f3c87650e7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:49.048	2026-01-12 12:23:49.048	\N
cmkb4wqbi002bl1045zwe1rvk	RANJIT	KUMAR GOUDA	8144469491	\N	BHANJANAGAR	Enquiry from 1/10/2026	cold	6964e7d6f5d2f8f3c876510b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:23:50.335	2026-01-12 12:23:50.335	\N
cmkb4wrn1002dl104l3dazlhe	Rohit	Sahoo	9861233425	\N	BBSR	Enquiry from 1/10/2026	cold	6964e7d7f5d2f8f3c8765121	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:52.046	2026-01-12 12:23:52.046	\N
cmkb4wsz3002fl10457e1s6c0	BIBHU	KALAS	6371239699	\N	BARAMUNDA	Enquiry from 1/10/2026	cold	6964e7d9f5d2f8f3c8765136	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:53.776	2026-01-12 12:23:53.776	\N
cmkb4wujt002hl104nk9hkw7r	SMRUTI	SAGAR PATI	9438571259	\N	JARKA	Enquiry from 1/10/2026	cold	6964e7dbf5d2f8f3c8765150	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:23:55.817	2026-01-12 12:23:55.817	\N
cmkb4wvll002jl104xclikgi6	Deepak	kumar Shahu	8917458203	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	6964e7ddf5d2f8f3c8765165	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:57.177	2026-01-12 12:23:57.177	\N
cmkb4wwl7002ll104zxjo7dwx	DEEPAK	JEN	9861505723	\N	MANCHESWAR	Enquiry from 1/12/2026	cold	6964e7def5d2f8f3c876517a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:58.46	2026-01-12 12:23:58.46	\N
cmkb4wxk3002nl104wnc9lobr	Ramakrushna	Gouda	7681038002	\N	JHARAPARA	Enquiry from 1/12/2026	cold	6964e7dff5d2f8f3c876518f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:23:59.716	2026-01-12 12:23:59.716	\N
cmkb4wyk1002pl104ll029xx5	SAMBIT	SEKHAR SWAIN	9611015912	\N	BHANJANAGR	Enquiry from 1/12/2026	cold	6964e7e0f5d2f8f3c87651a4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:24:01.009	2026-01-12 12:24:01.009	\N
cmkb4wzsn002rl1049wdu27jk	HIMANSHU	SEKHAR PRUSTY	7682940242	\N	BBSR	Enquiry from 1/12/2026	cold	6964e7e2f5d2f8f3c87651bb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:24:02.615	2026-01-12 12:24:02.615	\N
cmkb4x0oj002tl104m1pm76xr	Prakash	Chandra	9348498456	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	6964e7e3f5d2f8f3c87651d9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:24:03.764	2026-01-12 12:24:03.764	\N
cmkb4x1wi002vl104j95ugy18	Sk	Sabir .	7788903532	\N	JHARAPARA	Enquiry from 1/12/2026	cold	6964e7e5f5d2f8f3c87651fe	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:24:05.347	2026-01-12 12:24:05.347	\N
cmkb4x2tw002xl104oxyltt4j	Sasmita	Bhanja .	7894546033	\N	BOMIKHAL	Enquiry from 1/12/2026	cold	6964e7e6f5d2f8f3c876521c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:24:06.548	2026-01-12 12:24:06.548	\N
cmkb4x3ut002zl104umhojaqu	Gourikant	Pradhan	9776662009	\N	DUMDUMA	Enquiry from 1/12/2026	cold	6964e7e7f5d2f8f3c876524b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:24:07.878	2026-01-12 12:24:07.878	\N
cmkb4x4sx0031l104ld8in04y	Mumtaz	Belal.	8018937254	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	6964e7e9f5d2f8f3c876526b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:24:09.105	2026-01-12 12:24:09.105	\N
cmkb4x5pt0033l104e6m8yu9z	SHIBA	SAHU	7873792904	\N	ROURKELA	Enquiry from 1/12/2026	cold	6964e7eaf5d2f8f3c876528e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:24:10.289	2026-01-12 12:24:10.289	\N
cmkb4x6lz0035l104dow279ke	Sudarsan	Bagha	8984844837	\N	UDALA	Enquiry from 1/12/2026	cold	6964e7ebf5d2f8f3c87652bd	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:24:11.447	2026-01-12 12:24:11.447	\N
cmkb4x7k40037l104rrqz7l2v	Dillip	Kumar	8800648707	\N	BANGALORE	Enquiry from 1/12/2026	cold	6964e7ecf5d2f8f3c87652d4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:24:12.677	2026-01-12 12:24:12.677	\N
cmkb4x8jh0039l104yjefvav1	SUBHANKAR	PANIGRAHY	7749913685	\N	BERHAMPUR	Enquiry from 1/12/2026	cold	6964e7edf5d2f8f3c87652e9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:24:13.949	2026-01-12 12:24:13.949	\N
cmkb4x9n2003bl104m4agmgdx	BISWAJIT	SAMANTRAY	6370028567	\N	GOTHAPATNA	Enquiry from 1/12/2026	cold	6964e7eff5d2f8f3c87652fe	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:24:15.374	2026-01-12 12:24:15.374	\N
cmkb51c4j0001l804nec65pqw	Sanjeet	Parida	9861419229	\N	BHUBANESWAR	Enquiry from 1/2/2026	cold	695f6eeb0063bd8e932d1c00	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:25.219	2026-01-12 12:27:25.219	\N
cmkb51dh30003l804f2syt8op	SANJAY	NAYAK	9776160290	\N	MANCHESWAR	Enquiry from 1/2/2026	cold	6964e79ff5d2f8f3c8764cba	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:27:26.968	2026-01-12 12:27:26.968	\N
cmkb51eke0005l8040icqqtk1	SANTANUH	MOHANTA	8455890408	\N	BHUBANESWAR	Enquiry from 1/2/2026	cold	695f6eca0063bd8e932d1987	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:28.382	2026-01-12 12:27:28.382	\N
cmkb51fiz0007l804kuw51x89	G	RAJA KUMAR	8093905443	\N	KORAPUT	Enquiry from 1/2/2026	cold	6964e7a2f5d2f8f3c8764cfe	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:27:29.628	2026-01-12 12:27:29.628	\N
cmkb51gfx0009l804koi513sw	DEEPAK	KUMAR SETHY	9439328410	\N	ASKA	Enquiry from 1/2/2026	cold	6964e7a3f5d2f8f3c8764d1c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:27:30.813	2026-01-12 12:27:30.813	\N
cmkb51hu8000bl8041rs0k3c7	SANTOSH	MEHER	9777075995	\N	NUAPADA	Enquiry from 1/2/2026	cold	6964e7a5f5d2f8f3c8764d31	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:27:32.624	2026-01-12 12:27:32.624	\N
cmkb51j29000dl804ym5hzyqx	PRIYASH	PRASAD SAHOO	8658587982	\N	MANCHESWAR	Enquiry from 1/2/2026	cold	6964e7a6f5d2f8f3c8764d48	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:27:34.209	2026-01-12 12:27:34.209	\N
cmkb51jta000fl8045bm9qp2f	LAL	KUMAR	9592661605	\N	BERHAMPUR	Enquiry from 1/2/2026	cold	6964e7a7f5d2f8f3c8764d66	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:35.183	2026-01-12 12:27:35.183	\N
cmkb51kmj000hl804gf5jlc50	KANHA	SAHOO	7978165986	\N	BHAWANIPATNA	Enquiry from 1/3/2026	cold	6964e7a8f5d2f8f3c8764d8b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-12 12:27:36.236	2026-01-12 12:27:36.236	\N
cmkb51ll6000jl804l8q0dz2l	RITESH	KUMAR JENA	7008546641	\N	MANCHESWAR	Enquiry from 1/3/2026	cold	6964e7aaf5d2f8f3c8764da9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:37.483	2026-01-12 12:27:37.483	\N
cmkb51mft000ll8043zvxlji1	SARTHAK		7978919399	\N	SAMBALPUR	Enquiry from 1/3/2026	cold	6964e7abf5d2f8f3c8764dc7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:27:38.585	2026-01-12 12:27:38.585	\N
cmkb51nek000nl804kv859ban	Somanath	naik	7978886123	\N	BHUBANESWAR	Enquiry from 1/5/2026	cold	6964e7adf5d2f8f3c8764dec	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-12 12:27:39.836	2026-01-12 12:27:39.836	\N
cmkb51ofc000pl80445vmo8fo	RANJAN	PATRA	8596082689	\N	NAYAPALI	Enquiry from 1/5/2026	cold	6964e7aef5d2f8f3c8764e11	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:27:41.16	2026-01-12 12:27:41.16	\N
cmkb51p8z000rl804lr2hfmdf	JAGANNATH	SAHOO	9437929730	\N	BERHAMPUR	Enquiry from 1/6/2026	cold	6964e7aff5d2f8f3c8764e38	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:27:42.227	2026-01-12 12:27:42.227	\N
cmkb51q1p000tl804mfgp48n6	Atman	ACHARYA	9861621111	\N	ACHARYA VIHAR	Enquiry from 1/6/2026	cold	695f6ecd0063bd8e932d19c3	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:43.261	2026-01-12 12:27:43.261	\N
cmkb51qxo000vl804f6ntwklg	Akash	Naik	7751975160	\N	BHUBANESWAR	Enquiry from 1/6/2026	cold	6964e7b2f5d2f8f3c8764e7a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-12 12:27:44.412	2026-01-12 12:27:44.412	\N
cmkb51rp7000xl804ev06x2sw	SASANKA	RATH	8342945477	\N	RAYAGADA	Enquiry from 1/6/2026	cold	6964e7b3f5d2f8f3c8764e9a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:45.404	2026-01-12 12:27:45.404	\N
cmkb51so8000zl804s94ul1wg	BISWANATH	GOUDA	7978307657	\N	ROURKELA	Enquiry from 1/6/2026	cold	6964e7b5f5d2f8f3c8764ec0	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:46.664	2026-01-12 12:27:46.664	\N
cmkb51tkj0011l804e799mew7	YUVRAJ		7008426309	\N	RAYAGADA	Enquiry from 1/6/2026	cold	6964e7b6f5d2f8f3c8764ed5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:47.827	2026-01-12 12:27:47.827	\N
cmkb51udj0013l804pti21ybb	Rakesh		8270955254	\N	BHUBANESWAR	Enquiry from 1/6/2026	cold	695f6eed0063bd8e932d1c15	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:48.871	2026-01-12 12:27:48.871	\N
cmkb51vm60015l8044qr0v707	SUBRAT	KUMAR SAHOO	7328060487	\N	BARAMUNDA	Enquiry from 1/6/2026	cold	6964e7b9f5d2f8f3c8764efa	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:27:50.478	2026-01-12 12:27:50.478	\N
cmkb51wjm0017l804bc9o68au	SATYAPRIYA	JENA	9692466841	\N	KHORDHA	Enquiry from 1/6/2026	cold	6964e7baf5d2f8f3c8764f0f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:27:51.682	2026-01-12 12:27:51.682	\N
cmkb51xbo0019l8044820u0di	Meenakshi	Padhy	9583098065	\N	NAYAPALI	Enquiry from 1/6/2026	cold	6964e7bbf5d2f8f3c8764f28	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:27:52.693	2026-01-12 12:27:52.693	\N
cmkb51ycb001bl804zqkugaxa	ASHUTOSH	CHHOUDHARY	7205225870	\N	BERHAMPUR	Enquiry from 1/7/2026	cold	6964e7bdf5d2f8f3c8764f3d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:54.012	2026-01-12 12:27:54.012	\N
cmkb51z65001dl804zzuwv4sv	SUBRAT	SAMAL	9337973019	\N	TALCHER	Enquiry from 1/7/2026	cold	6964e7bef5d2f8f3c8764f62	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:27:55.085	2026-01-12 12:27:55.085	\N
cmkb5204l001fl804xh8k6cik	SANDIP	PANDA	9439771558	\N	SAMBALPUR	Enquiry from 1/7/2026	cold	6964e7bff5d2f8f3c8764f78	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:27:56.325	2026-01-12 12:27:56.325	\N
cmkb520zv001hl804vu6703h9	JORAM	PARICHHA	9827062767	\N	PARALAKHEMUNDI	Enquiry from 1/8/2026	cold	6964e7c1f5d2f8f3c8764f8d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:27:57.451	2026-01-12 12:27:57.451	\N
cmkb521y6001jl804vu8kp0o0	Abdul	Rauf Shaikh	9437078640	\N	BHUBANESWAR	Enquiry from 1/8/2026	cold	6964e7c3f5d2f8f3c8764fa2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:58.687	2026-01-12 12:27:58.687	\N
cmkb522vh001ll8049p8270zk	Shubham	Biswal	7978770585	\N	OLD TOWN	Enquiry from 1/8/2026	cold	6964e7c4f5d2f8f3c8764fb7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:27:59.885	2026-01-12 12:27:59.885	\N
cmkb523t9001nl804llrf6spi	Subhajit	Behera	8457062256	\N	RASULGARH	Enquiry from 1/8/2026	cold	6964e7c5f5d2f8f3c8764fcc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:01.101	2026-01-12 12:28:01.101	\N
cmkb524lh001pl8041midibt9	NIHAR	RANJAN SWAIN	9438027058	\N	NAYAPALLI	Enquiry from 1/8/2026	cold	6964e7c7f5d2f8f3c8764fe1	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:28:02.117	2026-01-12 12:28:02.117	\N
cmkb525f4001rl804pkmyw29l	BHABANI	SANKAR MISHRA	8249838178	\N	AIIMS	Enquiry from 1/9/2026	cold	6964e7c8f5d2f8f3c8764ff6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:28:03.184	2026-01-12 12:28:03.184	\N
cmkb5267f001tl8043jlazdak	NIHAR	Agarwal	9777996972	\N	NAYAPALI	Enquiry from 1/9/2026	cold	6964e7c9f5d2f8f3c876500b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:04.203	2026-01-12 12:28:04.203	\N
cmkb5278f001vl80478dk6j5y	DEBASISH	MOHAPATRA	9535554241	\N	BANGALORE	Enquiry from 1/9/2026	cold	6964e7cbf5d2f8f3c8765020	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:28:05.536	2026-01-12 12:28:05.536	\N
cmkb5287h001xl804ondbue9o	SIMANCHAL	BABOO	9556780460	\N	BALANGIR	Enquiry from 1/9/2026	cold	6964e7ccf5d2f8f3c8765035	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:28:06.798	2026-01-12 12:28:06.798	\N
cmkb5294l001zl804q6swsluq	PRAVUJEET	SABUT	8018303899	\N	NIALI	Enquiry from 1/9/2026	cold	6964e7cef5d2f8f3c8765055	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:07.99	2026-01-12 12:28:07.99	\N
cmkb529yd0021l804qv8xvb8r	AKASH	DHANWAR	8342985097	\N	SUNDARAGADA	Enquiry from 1/10/2026	cold	6964e7cff5d2f8f3c8765073	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:28:09.061	2026-01-12 12:28:09.061	\N
cmkb52au20023l8048yks7v4z	JYOTIRMAYA	MAHAPATRA	9938110551	\N	MANCHESWAR	Enquiry from 1/10/2026	cold	6964e7d0f5d2f8f3c876509a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:10.202	2026-01-12 12:28:10.202	\N
cmkb52c1c0025l804sregip13	TANUP	GOCHHAYAT	9739261099	\N	BBSR	Enquiry from 1/10/2026	cold	6964e7d2f5d2f8f3c87650b5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:11.761	2026-01-12 12:28:11.761	\N
cmkb52cux0027l804gfq2qbme	SWARAJ		7381133848	\N	BALIANTA	Enquiry from 1/10/2026	cold	6964e7d3f5d2f8f3c87650ca	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:12.825	2026-01-12 12:28:12.825	\N
cmkb52dse0029l804bx0wsq5u	DebasisRoutray	.	7381087329	\N	KALPANA	Enquiry from 1/10/2026	cold	6964e7d4f5d2f8f3c87650e7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:14.03	2026-01-12 12:28:14.03	\N
cmkb52emn002bl804xed0ufa8	RANJIT	KUMAR GOUDA	8144469491	\N	BHANJANAGAR	Enquiry from 1/10/2026	cold	6964e7d6f5d2f8f3c876510b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:28:15.12	2026-01-12 12:28:15.12	\N
cmkb52fn7002dl804j15wyn10	Rohit	Sahoo	9861233425	\N	BBSR	Enquiry from 1/10/2026	cold	6964e7d7f5d2f8f3c8765121	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:16.435	2026-01-12 12:28:16.435	\N
cmkb52gpm002fl804wwiyel50	BIBHU	KALAS	6371239699	\N	BARAMUNDA	Enquiry from 1/10/2026	cold	6964e7d9f5d2f8f3c8765136	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:17.818	2026-01-12 12:28:17.818	\N
cmkb52hyg002hl8043hpbq9ui	SMRUTI	SAGAR PATI	9438571259	\N	JARKA	Enquiry from 1/10/2026	cold	6964e7dbf5d2f8f3c8765150	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:28:19.432	2026-01-12 12:28:19.432	\N
cmkb52ir5002jl804llm0nzc1	Deepak	kumar Shahu	8917458203	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	6964e7ddf5d2f8f3c8765165	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:20.466	2026-01-12 12:28:20.466	\N
cmkb52jo9002ll804vmx5qmww	DEEPAK	JEN	9861505723	\N	MANCHESWAR	Enquiry from 1/12/2026	cold	6964e7def5d2f8f3c876517a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:21.658	2026-01-12 12:28:21.658	\N
cmkb52kgq002nl804so6r3v1p	Ramakrushna	Gouda	7681038002	\N	JHARAPARA	Enquiry from 1/12/2026	cold	6964e7dff5d2f8f3c876518f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:22.683	2026-01-12 12:28:22.683	\N
cmkb52lhe002pl804ol7mz4et	SAMBIT	SEKHAR SWAIN	9611015912	\N	BHANJANAGR	Enquiry from 1/12/2026	cold	6964e7e0f5d2f8f3c87651a4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:28:24.002	2026-01-12 12:28:24.002	\N
cmkb52mjx002rl80408yoj73z	HIMANSHU	SEKHAR PRUSTY	7682940242	\N	BBSR	Enquiry from 1/12/2026	cold	6964e7e2f5d2f8f3c87651bb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:28:25.39	2026-01-12 12:28:25.39	\N
cmkb52ndh002tl80403h3cmpv	Prakash	Chandra	9348498456	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	6964e7e3f5d2f8f3c87651d9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:26.454	2026-01-12 12:28:26.454	\N
cmkb52oav002vl804hfkzuwyg	Sk	Sabir .	7788903532	\N	JHARAPARA	Enquiry from 1/12/2026	cold	6964e7e5f5d2f8f3c87651fe	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:28:27.655	2026-01-12 12:28:27.655	\N
cmkb52p4g002xl804w7zrpv2y	Sasmita	Bhanja .	7894546033	\N	BOMIKHAL	Enquiry from 1/12/2026	cold	6964e7e6f5d2f8f3c876521c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:28.721	2026-01-12 12:28:28.721	\N
cmkb52q7i002zl8044w8hb8qc	Gourikant	Pradhan	9776662009	\N	DUMDUMA	Enquiry from 1/12/2026	cold	6964e7e7f5d2f8f3c876524b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:30.126	2026-01-12 12:28:30.126	\N
cmkb52r3a0031l804jd0nt83m	Mumtaz	Belal.	8018937254	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	6964e7e9f5d2f8f3c876526b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:31.27	2026-01-12 12:28:31.27	\N
cmkb52s000033l804r2hh39fa	SHIBA	SAHU	7873792904	\N	ROURKELA	Enquiry from 1/12/2026	cold	6964e7eaf5d2f8f3c876528e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:28:32.448	2026-01-12 12:28:32.448	\N
cmkb52st90035l804tqtsozoe	Sudarsan	Bagha	8984844837	\N	UDALA	Enquiry from 1/12/2026	cold	6964e7ebf5d2f8f3c87652bd	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:33.502	2026-01-12 12:28:33.502	\N
cmkb52tm80037l804o9ohzn37	Dillip	Kumar	8800648707	\N	BANGALORE	Enquiry from 1/12/2026	cold	6964e7ecf5d2f8f3c87652d4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:34.544	2026-01-12 12:28:34.544	\N
cmkb52ugm0039l8049mioe351	SUBHANKAR	PANIGRAHY	7749913685	\N	BERHAMPUR	Enquiry from 1/12/2026	cold	6964e7edf5d2f8f3c87652e9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:35.639	2026-01-12 12:28:35.639	\N
cmkb52vjv003bl804gq4ecsfi	BISWAJIT	SAMANTRAY	6370028567	\N	GOTHAPATNA	Enquiry from 1/12/2026	cold	6964e7eff5d2f8f3c87652fe	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:28:37.052	2026-01-12 12:28:37.052	\N
cmkb5kz640006l704cv8az2ok	Sanjeet	Parida	9861419229	\N	BHUBANESWAR	Enquiry from 1/2/2026	cold	695f6eeb0063bd8e932d1c00	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:42:41.548	2026-01-12 12:42:41.548	\N
cmkb5l0mj0008l7049ox4bbtp	Debasish	Nayak	8249699750	\N	PATRAPADA	Enquiry from 1/2/2026	cold	6964ec43f5d2f8f3c8766a75	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:42:43.436	2026-01-12 12:42:43.436	\N
cmkb5l1o1000al704aonptqhc	BIKRAM	RAUL	9348610480	\N	BALUGAON	Enquiry from 1/2/2026	cold	6964ec44f5d2f8f3c8766a92	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-12 12:42:44.785	2026-01-12 12:42:44.785	\N
cmkb5l2o6000cl704b9jq4rfv	DIPEN	SARKAR	9078664310	\N	NABARANGAPUR	Enquiry from 1/2/2026	cold	6964ec46f5d2f8f3c8766aa7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:42:46.086	2026-01-12 12:42:46.086	\N
cmkb5l3n5000el704iw9j0k77	SANJAY	NAYAK	9776160290	\N	MANCHESWAR	Enquiry from 1/2/2026	cold	6964e79ff5d2f8f3c8764cba	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:42:47.346	2026-01-12 12:42:47.346	\N
cmkb5l4kt000gl704hcnt3koo	SANTANUH	MOHANTA	8455890408	\N	BHUBANESWAR	Enquiry from 1/2/2026	cold	695f6eca0063bd8e932d1987	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:42:48.557	2026-01-12 12:42:48.557	\N
cmkb5l5pq000il7048earev80	G	RAJA KUMAR	8093905443	\N	KORAPUT	Enquiry from 1/2/2026	cold	6964e7a2f5d2f8f3c8764cfe	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:42:50.03	2026-01-12 12:42:50.03	\N
cmkb5l6sf000kl704qvy75ax9	LAXMIDHAR	NANDI	7008941078	\N	BHUBANESWAR	Enquiry from 1/2/2026	cold	6964ec4bf5d2f8f3c8766b1c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:42:51.424	2026-01-12 12:42:51.424	\N
cmkb5l7r4000ml7041ox2cocy	BIKASH	KUMAR SHARMA	9040633981	\N	SAMBALPUR	Enquiry from 1/2/2026	cold	6964ec4cf5d2f8f3c8766b31	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:42:52.673	2026-01-12 12:42:52.673	\N
cmkb5l8np000ol7049vvtayku	DEEPAK	KUMAR SETHY	9439328410	\N	ASKA	Enquiry from 1/2/2026	cold	6964e7a3f5d2f8f3c8764d1c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:42:53.846	2026-01-12 12:42:53.846	\N
cmkb5l9ny000ql7044far69ek	SANTOSH	MEHER	9777075995	\N	NUAPADA	Enquiry from 1/2/2026	cold	6964e7a5f5d2f8f3c8764d31	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:42:55.15	2026-01-12 12:42:55.15	\N
cmkb5lakt000sl704qb35fwzm	JITU	MISHRA	9032540505	\N	BALANGIR	Enquiry from 1/2/2026	cold	6964ec50f5d2f8f3c8766b66	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:42:56.333	2026-01-12 12:42:56.333	\N
cmkb5lbih000ul70416x56js0	PRIYASH	PRASAD SAHOO	8658587982	\N	MANCHESWAR	Enquiry from 1/2/2026	cold	6964e7a6f5d2f8f3c8764d48	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:42:57.545	2026-01-12 12:42:57.545	\N
cmkb5lc7u000wl704zyggmfob	LAL	KUMAR	9592661605	\N	BERHAMPUR	Enquiry from 1/2/2026	cold	6964e7a7f5d2f8f3c8764d66	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:42:58.459	2026-01-12 12:42:58.459	\N
cmkb5ld7e000yl70493cxk380	AMARJEET		9337032850	\N	JATANI	Enquiry from 1/3/2026	cold	6964ec53f5d2f8f3c8766ba2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:42:59.738	2026-01-12 12:42:59.738	\N
cmkb5le980010l704vzal21au	GOPAL	NAYAK	9686555332	\N	SAKHIGOPAL	Enquiry from 1/3/2026	cold	6964ec55f5d2f8f3c8766bb7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:43:01.1	2026-01-12 12:43:01.1	\N
cmkb5lf7u0012l7042tcbrupx	KANHA	SAHOO	7978165986	\N	BHAWANIPATNA	Enquiry from 1/3/2026	cold	6964e7a8f5d2f8f3c8764d8b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-12 12:43:02.347	2026-01-12 12:43:02.347	\N
cmkb5lgae0014l704ihpt0q8d	Debidutta	Mohapatra	9090370015	\N	KALINGA NAGAR	Enquiry from 1/3/2026	cold	6964ec57f5d2f8f3c8766be7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:43:03.734	2026-01-12 12:43:03.734	\N
cmkb5lhc00016l704ui05scev	JAGANNATH	SAHOO	9583733730	\N	CTC	Enquiry from 1/3/2026	cold	6964ec59f5d2f8f3c8766bfc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-12 12:43:05.089	2026-01-12 12:43:05.089	\N
cmkb5lidp0018l7041gesv8x1	RAMANKANT	PATTNAIK	9776578268	\N	NAYAPALLI	Enquiry from 1/3/2026	cold	6964ec5af5d2f8f3c8766c1a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:43:06.446	2026-01-12 12:43:06.446	\N
cmkb5ljbc001al7044iaqwoir	RITESH	KUMAR JENA	7008546641	\N	MANCHESWAR	Enquiry from 1/3/2026	cold	6964e7aaf5d2f8f3c8764da9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:07.657	2026-01-12 12:43:07.657	\N
cmkb5lkhj001cl70478zhr63c	SHREE	SARAN	9602356064	\N	INS CHILKA	Enquiry from 1/3/2026	cold	6964ec5df5d2f8f3c8766c47	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-12 12:43:09.175	2026-01-12 12:43:09.175	\N
cmkb5llmd001el704wlrcrg11	MANORANJAN	PADHI	8270470777	\N	BALANGIR	Enquiry from 1/3/2026	cold	6964ec5ef5d2f8f3c8766c6a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-12 12:43:10.645	2026-01-12 12:43:10.645	\N
cmkb5lmq2001gl704jsespxs8	SURYANARAYAN	DAS	8093502640	\N	JATANI	Enquiry from 1/3/2026	cold	6964ec60f5d2f8f3c8766c8c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:43:12.074	2026-01-12 12:43:12.074	\N
cmkb5lnrm001il704w5azq6m7	SURYAKANT	SAHOO	9937996699	\N	ROURKELA	Enquiry from 1/3/2026	cold	6964ec61f5d2f8f3c8766ca3	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:13.426	2026-01-12 12:43:13.426	\N
cmkb5lp2b001kl704eprday4x	SWEETIN	LAKRA	8018144401	\N	SAMBALPUR	Enquiry from 1/3/2026	cold	6964ec63f5d2f8f3c8766cb8	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:43:15.107	2026-01-12 12:43:15.107	\N
cmkb5lq2s001ml704eje555u0	SARTHAK		7978919399	\N	SAMBALPUR	Enquiry from 1/3/2026	cold	6964e7abf5d2f8f3c8764dc7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:43:16.42	2026-01-12 12:43:16.42	\N
cmkb5lr8l001ol704e1g24kwz	DINESH	PARIDA	9237103226	\N	PATIA	Enquiry from 1/5/2026	cold	6964ec65f5d2f8f3c8766cdd	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-12 12:43:17.926	2026-01-12 12:43:17.926	\N
cmkb5ls83001ql704mlka3s5j	DEV	ROY	9776555588	\N	SAMBALPUR	Enquiry from 1/5/2026	cold	6964ec67f5d2f8f3c8766cf4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-12 12:43:19.203	2026-01-12 12:43:19.203	\N
cmkb5ltkw001sl704lk7z37tw	SUBHALAXMI	SAHOO	9178303774	\N	SAMBALPUR	Enquiry from 1/5/2026	cold	6964ec68f5d2f8f3c8766d09	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:43:20.96	2026-01-12 12:43:20.96	\N
cmkb5lukv001ul704b6bfar16	PRABIN		9777775598	\N	JATANI	Enquiry from 1/5/2026	cold	6964ec6af5d2f8f3c8766d1e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:43:22.255	2026-01-12 12:43:22.255	\N
cmkb5lvkp001wl704ncq0r65p	AKASH	KUMAR PATEL	9937696916	\N	SUNDARGADA	Enquiry from 1/5/2026	cold	6964ec6bf5d2f8f3c8766d33	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:23.545	2026-01-12 12:43:23.545	\N
cmkb5lwed001yl70454b85rln	Somanath	naik	7978886123	\N	BHUBANESWAR	Enquiry from 1/5/2026	cold	6964e7adf5d2f8f3c8764dec	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-12 12:43:24.614	2026-01-12 12:43:24.614	\N
cmkb5lxi20020l704dnlb3yl4	KISHORE	SARDAR	9178344933	\N	MALKANGIR	Enquiry from 1/5/2026	cold	6964ec6df5d2f8f3c8766d58	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:43:26.042	2026-01-12 12:43:26.042	\N
cmkb5lygf0022l7044wtrywaa	YAGYESH	SHARMA	8383827006	\N	KALAHANDI	Enquiry from 1/5/2026	cold	6964ec6ff5d2f8f3c8766d6d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:43:27.279	2026-01-12 12:43:27.279	\N
cmkb5lzfi0024l704q1qeb3e1	RAKESH		7205735003	\N	BARAMUNDA	Enquiry from 1/5/2026	cold	6964ec70f5d2f8f3c8766d82	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:43:28.543	2026-01-12 12:43:28.543	\N
cmkb5m09m0026l7045q0x4gsp	RANJAN	PATRA	8596082689	\N	NAYAPALI	Enquiry from 1/5/2026	cold	6964e7aef5d2f8f3c8764e11	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:43:29.626	2026-01-12 12:43:29.626	\N
cmkb5m17x0028l7047lxbnzuw	SUDEEP	KUMAR MANDAL	8847840015	\N	NABARANGAPUR	Enquiry from 1/5/2026	cold	6964ec72f5d2f8f3c8766da7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:43:30.861	2026-01-12 12:43:30.861	\N
cmkb5m27z002al704av8b7pic	ANUSHKA		8018111888	\N	BHUBANESWAR	Enquiry from 1/6/2026	cold	6964ec74f5d2f8f3c8766dbc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:32.159	2026-01-12 12:43:32.159	\N
cmkb5m3bg002cl704p64f8hr1	UDAYA	NATH SAHOO	9541196334	\N	KEONJHAR	Enquiry from 1/6/2026	cold	6964ec75f5d2f8f3c8766dd1	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:43:33.58	2026-01-12 12:43:33.58	\N
cmkb5m4eg002el704yk81feap	SAMIR	KHAN	8655912437	\N	NAYAPALLI	Enquiry from 1/6/2026	cold	6964ec76f5d2f8f3c8766de6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:43:34.984	2026-01-12 12:43:34.984	\N
cmkb5m5b8002gl704wkib9ren	JAGANNATH	SAHOO	9437929730	\N	BERHAMPUR	Enquiry from 1/6/2026	cold	6964e7aff5d2f8f3c8764e38	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:43:36.164	2026-01-12 12:43:36.164	\N
cmkb5m6ab002il704bpc2zreh	Atman	ACHARYA	9861621111	\N	ACHARYA VIHAR	Enquiry from 1/6/2026	cold	695f6ecd0063bd8e932d19c3	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:37.428	2026-01-12 12:43:37.428	\N
cmkb5m77z002kl704jmu9u2xf	JAY		8073083430	\N	BARAMUNDA	Enquiry from 1/6/2026	cold	6964ec7af5d2f8f3c8766e2e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:38.64	2026-01-12 12:43:38.64	\N
cmkb5m87j002ml704thk257b1	Akash	Naik	7751975160	\N	BHUBANESWAR	Enquiry from 1/6/2026	cold	6964e7b2f5d2f8f3c8764e7a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-12 12:43:39.919	2026-01-12 12:43:39.919	\N
cmkb5m8ys002ol704xd166u42	SASANKA	RATH	8342945477	\N	RAYAGADA	Enquiry from 1/6/2026	cold	6964e7b3f5d2f8f3c8764e9a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:40.9	2026-01-12 12:43:40.9	\N
cmkb5m9xc002ql7047sfanvqb	ANKIT	KUMAR SAHOO	9439295124	\N	JATANI	Enquiry from 1/6/2026	cold	6964ec7ef5d2f8f3c8766e63	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:43:42.144	2026-01-12 12:43:42.144	\N
cmkb5maya002sl7045w4phpms	SAUD		8114663005	\N	FIRE STATION	Enquiry from 1/6/2026	cold	6964ec7ff5d2f8f3c8766e78	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:43.472	2026-01-12 12:43:43.472	\N
cmkb5mbsn002ul704txld9pi6	BISWANATH	GOUDA	7978307657	\N	ROURKELA	Enquiry from 1/6/2026	cold	6964e7b5f5d2f8f3c8764ec0	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:44.567	2026-01-12 12:43:44.567	\N
cmkb5mcs7002wl704kuabkg82	YUVRAJ		7008426309	\N	RAYAGADA	Enquiry from 1/6/2026	cold	6964e7b6f5d2f8f3c8764ed5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:45.848	2026-01-12 12:43:45.848	\N
cmkb5mdvk002yl7047u6k712a	ABANINDRA	SAHU	9853170049	\N	BERHAMPUR	Enquiry from 1/6/2026	cold	6964ec83f5d2f8f3c8766ead	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:47.264	2026-01-12 12:43:47.264	\N
cmkb5mets0030l704ptqnbpxw	Rakesh		8270955254	\N	BHUBANESWAR	Enquiry from 1/6/2026	cold	695f6eed0063bd8e932d1c15	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:48.497	2026-01-12 12:43:48.497	\N
cmkb5mfxf0032l704mbvanq0u	Dipan	Sundar Sahu	9861207073	\N	RASULGARH	Enquiry from 1/6/2026	cold	6964ec85f5d2f8f3c8766ed4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:43:49.923	2026-01-12 12:43:49.923	\N
cmkb5mgr50034l704bcfkh6a6	SUBRAT	KUMAR SAHOO	7328060487	\N	BARAMUNDA	Enquiry from 1/6/2026	cold	6964e7b9f5d2f8f3c8764efa	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:43:50.993	2026-01-12 12:43:50.993	\N
cmkb5mhmw0036l704o0p2yvpg	SATYAPRIYA	JENA	9692466841	\N	KHORDHA	Enquiry from 1/6/2026	cold	6964e7baf5d2f8f3c8764f0f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:43:52.137	2026-01-12 12:43:52.137	\N
cmkb5miep0038l7043odq0x0t	Meenakshi	Padhy	9583098065	\N	NAYAPALI	Enquiry from 1/6/2026	cold	6964e7bbf5d2f8f3c8764f28	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:43:53.137	2026-01-12 12:43:53.137	\N
cmkb5mjw7003al704zd91cxtj	SUBHANKAR	ROY	8260327932	\N	MALKANGIR	Enquiry from 1/6/2026	cold	6964ec8bf5d2f8f3c8766f4d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:55.064	2026-01-12 12:43:55.064	\N
cmkb5mkrp003cl704sy89mzhm	PRITAM	MAHANTA	7008548113	\N	MAYURBHANJ	Enquiry from 1/7/2026	cold	6964ec8cf5d2f8f3c8766f62	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:56.197	2026-01-12 12:43:56.197	\N
cmkb5mlov003el704pou8qmd4	AYUSHMAN	SAHOO	7978772851	\N	BARAMUNDA	Enquiry from 1/7/2026	cold	6964ec8df5d2f8f3c8766f77	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:43:57.391	2026-01-12 12:43:57.391	\N
cmkb5mmqa003gl704dx96ajzv	DEBABRATA	PRADHAN	9658718058	\N	RASULGARH	Enquiry from 1/7/2026	cold	6964ec8ef5d2f8f3c8766f8c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:43:58.738	2026-01-12 12:43:58.738	\N
cmkb5mnre003il704hvjfkm6h	RABI		7348000075	\N	KHANDAGIRI	Enquiry from 1/7/2026	cold	6964ec90f5d2f8f3c8766fb7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:44:00.075	2026-01-12 12:44:00.075	\N
cmkb5mp0e003kl704sfe2ifxr	ASHUTOSH	CHHOUDHARY	7205225870	\N	BERHAMPUR	Enquiry from 1/7/2026	cold	6964e7bdf5d2f8f3c8764f3d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:01.695	2026-01-12 12:44:01.695	\N
cmkb5mpxo003ml704gzusgsvw	ASISH	KUMAR CHOUDHURY	7537840076	\N	SUNDARGADA	Enquiry from 1/7/2026	cold	6964ec92f5d2f8f3c8766fdf	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:02.892	2026-01-12 12:44:02.892	\N
cmkb5mqzs003ol704xyv7qtek	SWASTIK	PANDA	9777403025	\N	SAMBALPUR	Enquiry from 1/7/2026	cold	6964ec94f5d2f8f3c8767006	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:04.264	2026-01-12 12:44:04.264	\N
cmkb5mrws003ql7042u0u4w8y	DIPTI		9840735871	\N	BBSR	Enquiry from 1/7/2026	cold	6964ec95f5d2f8f3c8767026	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-12 12:44:05.452	2026-01-12 12:44:05.452	\N
cmkb5mspp003sl70413ovvim0	SANJEET	CHAKRABARTY	9937084630	\N	NABARANGAPUR	Enquiry from 1/7/2026	cold	6964ec96f5d2f8f3c8767040	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:44:06.493	2026-01-12 12:44:06.493	\N
cmkb5mtrq003ul7046sl8sz88	RAMANKANT	SAHOO	9070002082	\N	KALINGA VIHAR	Enquiry from 1/7/2026	cold	6964ec97f5d2f8f3c87671f6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:44:07.863	2026-01-12 12:44:07.863	\N
cmkb5muqi003wl704b4hr06qm	SUBRAT	SAMAL	9337973019	\N	TALCHER	Enquiry from 1/7/2026	cold	6964e7bef5d2f8f3c8764f62	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:44:09.115	2026-01-12 12:44:09.115	\N
cmkb5mvsc003yl704f5zb1wk6	SOUMYA	RANJAN DUTTA	9945090087	\N	BANGLORE	Enquiry from 1/7/2026	cold	6964ec9af5d2f8f3c8767231	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:10.476	2026-01-12 12:44:10.476	\N
cmkb5mwtg0040l704vzme0pu3	BISWARANJAN	KANUNGO	7008932689	\N	JHARAPARA	Enquiry from 1/7/2026	cold	6964ec9bf5d2f8f3c8767246	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:11.812	2026-01-12 12:44:11.812	\N
cmkb5mxpv0042l7040hwsc670	SANDIP	PANDA	9439771558	\N	SAMBALPUR	Enquiry from 1/7/2026	cold	6964e7bff5d2f8f3c8764f78	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:44:12.979	2026-01-12 12:44:12.979	\N
cmkb5myq10044l7048jmjc2ad	GUPTESWAR	ROUT	9438377197	\N	KORAPUT	Enquiry from 1/8/2026	cold	6964ec9ef5d2f8f3c876726b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:44:14.281	2026-01-12 12:44:14.281	\N
cmkb5n02f0046l704rkigc4t3	JORAM	PARICHHA	9827062767	\N	PARALAKHEMUNDI	Enquiry from 1/8/2026	cold	6964e7c1f5d2f8f3c8764f8d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:44:16.023	2026-01-12 12:44:16.023	\N
cmkb5n11b0048l704w2i8lpzy	Abdul	Rauf Shaikh	9437078640	\N	BHUBANESWAR	Enquiry from 1/8/2026	cold	6964e7c3f5d2f8f3c8764fa2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:17.28	2026-01-12 12:44:17.28	\N
cmkb5n2ii004al704iuuab6ua	SOMANATH		6371714901	\N	PURI	Enquiry from 1/8/2026	cold	6964eca3f5d2f8f3c87672a5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:44:19.194	2026-01-12 12:44:19.194	\N
cmkb5n3na004cl704qqi0vbhb	HARISH		9178111222	\N	BARAGADA	Enquiry from 1/8/2026	cold	6964eca4f5d2f8f3c87672c4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:20.662	2026-01-12 12:44:20.662	\N
cmkb5n4hp004el7046qc7372i	Shubham	Biswal	7978770585	\N	OLD TOWN	Enquiry from 1/8/2026	cold	6964e7c4f5d2f8f3c8764fb7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:21.758	2026-01-12 12:44:21.758	\N
cmkb5n5oy004gl7041wmh62jk	Subhajit	Behera	8457062256	\N	RASULGARH	Enquiry from 1/8/2026	cold	6964e7c5f5d2f8f3c8764fcc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:23.314	2026-01-12 12:44:23.314	\N
cmkb5n6mm004il7043q8jty5q	Anubhav	Pattnaik	7077707287	\N	DELTA SQUARE	Enquiry from 1/8/2026	cold	6964eca8f5d2f8f3c8767316	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:24.527	2026-01-12 12:44:24.527	\N
cmkb5n7mi004kl704ngvavfj3	NIHAR	RANJAN SWAIN	9438027058	\N	NAYAPALLI	Enquiry from 1/8/2026	cold	6964e7c7f5d2f8f3c8764fe1	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:44:25.818	2026-01-12 12:44:25.818	\N
cmkb5n8ln004ml704aoasw4xk	SALMAN		9035352233	\N	KHORDHA	Enquiry from 1/8/2026	cold	6964ecabf5d2f8f3c876733b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:27.083	2026-01-12 12:44:27.083	\N
cmkb5n9jo004ol7048l4my6zc	RAVI	REDDY	8456071259	\N	BERHAMPUR	Enquiry from 1/8/2026	cold	6964ecacf5d2f8f3c8767354	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:44:28.308	2026-01-12 12:44:28.308	\N
cmkb5naiw004ql704p9uppvvj	rakesh	Gupta	7997990004	\N	BHUBANESWAR	Enquiry from 1/8/2026	cold	6964ecadf5d2f8f3c8767372	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:29.576	2026-01-12 12:44:29.576	\N
cmkb5nbe7004sl704mu840b85	ABHINASH	SINGH	7004742274	\N	HYDERABAD	Enquiry from 1/8/2026	cold	6964ecaef5d2f8f3c8767390	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:44:30.704	2026-01-12 12:44:30.704	\N
cmkb5ncfy004ul704cpl7idha	RANJIT	KHORA	8260756632	\N	NALCO	Enquiry from 1/9/2026	cold	6964ecb0f5d2f8f3c87673ad	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:32.063	2026-01-12 12:44:32.063	\N
cmkb5ndhc004wl704y3kp3lum	Prasan	Kumarjena	7978737562	\N	KHANDAPARA	Enquiry from 1/9/2026	cold	6964ecb1f5d2f8f3c87673c4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:44:33.409	2026-01-12 12:44:33.409	\N
cmkb5nea5004yl704ekt654a3	BHABANI	SANKAR MISHRA	8249838178	\N	AIIMS	Enquiry from 1/9/2026	cold	6964e7c8f5d2f8f3c8764ff6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:44:34.446	2026-01-12 12:44:34.446	\N
cmkb5nf3e0050l704strnwfv0	Sk	Ramzan	8144598747	\N	BBSR	Enquiry from 1/9/2026	cold	6964ecb3f5d2f8f3c87673f2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:35.499	2026-01-12 12:44:35.499	\N
cmkb5nfw20052l70444l6hzs0	NIHAR	Agarwal	9777996972	\N	NAYAPALI	Enquiry from 1/9/2026	cold	6964e7c9f5d2f8f3c876500b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:36.53	2026-01-12 12:44:36.53	\N
cmkb5ngtd0054l704yvi4i743	SUNIL	SWAIN	9556727330	\N	DHENKANAL	Enquiry from 1/9/2026	cold	6964ecb5f5d2f8f3c8767417	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:44:37.729	2026-01-12 12:44:37.729	\N
cmkb5ni2y0056l7045ft4mjy3	DEBASISH	MOHAPATRA	9535554241	\N	BANGALORE	Enquiry from 1/9/2026	cold	6964e7cbf5d2f8f3c8765020	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:44:39.37	2026-01-12 12:44:39.37	\N
cmkb5nj7h0058l7040ab2zuj6	SANTOSH	KUMAR SAHOO	8939059143	\N	RAMBHA	Enquiry from 1/9/2026	cold	6964ecb8f5d2f8f3c876745e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-12 12:44:40.829	2026-01-12 12:44:40.829	\N
cmkb5nk73005al704zmpp9to6	NILESH	PATTNAIK	7609987385	\N	MALKANGIR	Enquiry from 1/9/2026	cold	6964ecbaf5d2f8f3c876747c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:44:42.111	2026-01-12 12:44:42.111	\N
cmkb5nl3n005cl7049sxzu31c	AMIT	MOHANTY	7873474333	\N	NAHARAKANTA	Enquiry from 1/9/2026	cold	6964ecbbf5d2f8f3c8767491	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:44:43.283	2026-01-12 12:44:43.283	\N
cmkb5nm50005el704haxi3i5p	ABHISEK	PRADHAN	8260563094	\N	BHUBANESWAR	Enquiry from 1/9/2026	cold	6964ecbcf5d2f8f3c87674a6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:44.596	2026-01-12 12:44:44.596	\N
cmkb5nn5m005gl7046kjag5cw	SIMANCHAL	BABOO	9556780460	\N	BALANGIR	Enquiry from 1/9/2026	cold	6964e7ccf5d2f8f3c8765035	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:44:45.947	2026-01-12 12:44:45.947	\N
cmkb5nog4005il704vzhm814j	PRAVUJEET	SABUT	8018303899	\N	NIALI	Enquiry from 1/9/2026	cold	6964e7cef5d2f8f3c8765055	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:47.621	2026-01-12 12:44:47.621	\N
cmkb5nphb005kl704ubv0nez5	Kanhu	Senapati	9668104616	\N	BHAWANIPATNA	Enquiry from 1/10/2026	cold	6964ecc0f5d2f8f3c87674dc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:44:48.959	2026-01-12 12:44:48.959	\N
cmkb5nqf6005ml704jnqtch1u	AKASH	DHANWAR	8342985097	\N	SUNDARAGADA	Enquiry from 1/10/2026	cold	6964e7cff5d2f8f3c8765073	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:44:50.178	2026-01-12 12:44:50.178	\N
cmkb5nrt6005ol7046n63ort4	JYOTIRMAYA	MAHAPATRA	9938110551	\N	MANCHESWAR	Enquiry from 1/10/2026	cold	6964e7d0f5d2f8f3c876509a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:51.978	2026-01-12 12:44:51.978	\N
cmkb5nt12005ql704ebs8de69	ASISH	PRUSTY	6372737336	\N	BARAMUNDA	Enquiry from 1/10/2026	cold	6964ecc5f5d2f8f3c8767515	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:53.558	2026-01-12 12:44:53.558	\N
cmkb5nu1e005sl704qtplvrto	TANUP	GOCHHAYAT	9739261099	\N	BBSR	Enquiry from 1/10/2026	cold	6964e7d2f5d2f8f3c87650b5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:54.866	2026-01-12 12:44:54.866	\N
cmkb5nv2k005ul704saw62vsn	SWARAJ		7381133848	\N	BALIANTA	Enquiry from 1/10/2026	cold	6964e7d3f5d2f8f3c87650ca	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:56.204	2026-01-12 12:44:56.204	\N
cmkb5nw1t005wl7049yytz3pm	Rajesh	Kumar Mohapatra	8280901252	\N	MANCHESWAR	Enquiry from 1/10/2026	cold	6964ecc9f5d2f8f3c876754c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-12 12:44:57.473	2026-01-12 12:44:57.473	\N
cmkb5nx4q005yl704voyazplq	DebasisRoutray	.	7381087329	\N	KALPANA	Enquiry from 1/10/2026	cold	6964e7d4f5d2f8f3c87650e7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:44:58.875	2026-01-12 12:44:58.875	\N
cmkb5ny410060l704bwr6yet3	SARBESWAR	BAGHA	9556941718	\N	SAMBALPUR	Enquiry from 1/10/2026	cold	6964ecccf5d2f8f3c8767573	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:45:00.145	2026-01-12 12:45:00.145	\N
cmkb5nz2e0062l704eeukrv69	CHIKU	MEHER	8249572091	\N	JARSUGUDA	Enquiry from 1/10/2026	cold	6964eccdf5d2f8f3c8767591	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:45:01.383	2026-01-12 12:45:01.383	\N
cmkb5o0120064l70433lsrn18	SHAKTI	MISHRA	8260012377	\N	IRC VILLAGE	Enquiry from 1/10/2026	cold	6964eccef5d2f8f3c87675a9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:45:02.631	2026-01-12 12:45:02.631	\N
cmkb5o13m0066l7042b3uh5xe	SISIRA	PANDA	9903974747	\N	SAMANTARAPUR	Enquiry from 1/10/2026	cold	6964eccff5d2f8f3c87675dc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:04.018	2026-01-12 12:45:04.018	\N
cmkb5o2al0068l704bjnz36ah	RANJIT	KUMAR GOUDA	8144469491	\N	BHANJANAGAR	Enquiry from 1/10/2026	cold	6964e7d6f5d2f8f3c876510b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:45:05.565	2026-01-12 12:45:05.565	\N
cmkb5o35y006al704ssu5l9kn	Rohit	Sahoo	9861233425	\N	BBSR	Enquiry from 1/10/2026	cold	6964e7d7f5d2f8f3c8765121	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:06.694	2026-01-12 12:45:06.694	\N
cmkb5o43o006cl704j6ht3iry	BIBHU	KALAS	6371239699	\N	BARAMUNDA	Enquiry from 1/10/2026	cold	6964e7d9f5d2f8f3c8765136	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:07.909	2026-01-12 12:45:07.909	\N
cmkb5o5by006el7042dk847e8	SMRUTI	SAGAR PATI	9438571259	\N	JARKA	Enquiry from 1/10/2026	cold	6964e7dbf5d2f8f3c8765150	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:45:09.502	2026-01-12 12:45:09.502	\N
cmkb5o6ay006gl704jg67qi9p	Deepak	kumar Shahu	8917458203	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	6964e7ddf5d2f8f3c8765165	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:10.762	2026-01-12 12:45:10.762	\N
cmkb5o7jg006il704fzsjtae2	DEEPAK	JEN	9861505723	\N	MANCHESWAR	Enquiry from 1/12/2026	cold	6964e7def5d2f8f3c876517a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:12.364	2026-01-12 12:45:12.364	\N
cmkb5o8ed006kl704qfbs68pr	CHINMAYA	BISOI	8260612061	\N	KORAPUT	Enquiry from 1/12/2026	cold	6964ecd9f5d2f8f3c87676c2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:45:13.478	2026-01-12 12:45:13.478	\N
cmkb5o9dl006ml704oden75kt	Md	Saif	9090396687	\N	Rourkela	Enquiry from 1/12/2026	cold	6964ecdaf5d2f8f3c87676d8	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:45:14.745	2026-01-12 12:45:14.745	\N
cmkb5oafs006ol7044nledgup	Ramakrushna	Gouda	7681038002	\N	JHARAPARA	Enquiry from 1/12/2026	cold	6964e7dff5d2f8f3c876518f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:16.12	2026-01-12 12:45:16.12	\N
cmkb5obge006ql704e0q1ylt3	SAMBIT	SEKHAR SWAIN	9611015912	\N	BHANJANAGR	Enquiry from 1/12/2026	cold	6964e7e0f5d2f8f3c87651a4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-12 12:45:17.438	2026-01-12 12:45:17.438	\N
cmkb5ococ006sl704hikkmszx	Santosh	Mohanty	8338888614	\N	Koraput	Enquiry from 1/12/2026	cold	6964ecdef5d2f8f3c8767732	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:19.02	2026-01-12 12:45:19.02	\N
cmkb5odj6006ul704wjh96qoj	HIMANSHU	SEKHAR PRUSTY	7682940242	\N	BBSR	Enquiry from 1/12/2026	cold	6964e7e2f5d2f8f3c87651bb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-12 12:45:20.13	2026-01-12 12:45:20.13	\N
cmkb5ofbp006wl704lgcgilj2	Prakash	Chandra	9348498456	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	6964e7e3f5d2f8f3c87651d9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:22.453	2026-01-12 12:45:22.453	\N
cmkb5oga4006yl704qkim5hlu	Sk	Sabir .	7788903532	\N	JHARAPARA	Enquiry from 1/12/2026	cold	6964e7e5f5d2f8f3c87651fe	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:45:23.692	2026-01-12 12:45:23.692	\N
cmkb5oh8c0070l704u86z43fr	AMRIT	MOHARANA	7008376717	\N	PURI	Enquiry from 1/12/2026	cold	6964ece4f5d2f8f3c876778b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-12 12:45:24.924	2026-01-12 12:45:24.924	\N
cmkb5ohzx0072l7044lxw8p2g	Sasmita	Bhanja .	7894546033	\N	BOMIKHAL	Enquiry from 1/12/2026	cold	6964e7e6f5d2f8f3c876521c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:25.918	2026-01-12 12:45:25.918	\N
cmkb5ois50074l704py1sogvr	Gourikant	Pradhan	9776662009	\N	DUMDUMA	Enquiry from 1/12/2026	cold	6964e7e7f5d2f8f3c876524b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:26.934	2026-01-12 12:45:26.934	\N
cmkb5ojp20076l704yuhfkvoz	TRINATH	KANTA	8249337952	\N	KORAPUT	Enquiry from 1/12/2026	cold	6964ece8f5d2f8f3c87677d3	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-12 12:45:28.118	2026-01-12 12:45:28.118	\N
cmkb5okl10078l704gd2td2zq	Mumtaz	Belal.	8018937254	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	6964e7e9f5d2f8f3c876526b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:29.269	2026-01-12 12:45:29.269	\N
cmkb5olg3007al7049epkpvox	SHIBA	SAHU	7873792904	\N	ROURKELA	Enquiry from 1/12/2026	cold	6964e7eaf5d2f8f3c876528e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-12 12:45:30.388	2026-01-12 12:45:30.388	\N
cmkb5omb7007cl704dqzcy1l8	Sudarsan	Bagha	8984844837	\N	UDALA	Enquiry from 1/12/2026	cold	6964e7ebf5d2f8f3c87652bd	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:31.507	2026-01-12 12:45:31.507	\N
cmkb5on6p007el704j4ah3ebr	Dillip	Kumar	8800648707	\N	BANGALORE	Enquiry from 1/12/2026	cold	6964e7ecf5d2f8f3c87652d4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:32.641	2026-01-12 12:45:32.641	\N
cmkb5onyd007gl704a30ex2zv	SUBHANKAR	PANIGRAHY	7749913685	\N	BERHAMPUR	Enquiry from 1/12/2026	cold	6964e7edf5d2f8f3c87652e9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:33.637	2026-01-12 12:45:33.637	\N
cmkb5oova007il704xs3263dw	BISWAJIT	SAMANTRAY	6370028567	\N	GOTHAPATNA	Enquiry from 1/12/2026	cold	6964e7eff5d2f8f3c87652fe	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:34.822	2026-01-12 12:45:34.822	\N
cmkb5oq5c007kl704x5i8dp60	suchi	testing	9938025322	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	6964ecf0f5d2f8f3c87678ab	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-12 12:45:36.48	2026-01-12 12:45:36.48	\N
cmkfiiuol0001l404q78d8k6c	Priyaranjan	Panda	9558211854	\N	KENDRAPARA	Enquiry from 1/2/2026	cold	6968f1f25a78b232f66098c1	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:56:02.134	2026-01-15 13:56:02.134	\N
cmkfiiwg30003l40417gmjyuy	SATYAJEET	SAHOO	8917391266	\N	TALCHER	Enquiry from 1/2/2026	cold	695f6eee0063bd8e932d1c2b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:56:04.419	2026-01-15 13:56:04.419	\N
cmkfiix4p0005l404holxulg9	SANKAR	KUMAR RATH	7978716817	\N	JAJPUR	Enquiry from 1/2/2026	cold	695f6ec70063bd8e932d195c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-15 13:56:05.305	2026-01-15 13:56:05.305	\N
cmkfiizdg0007l4043ieri6nv	Dibyajyoti	Mishra	8327799423	\N	PARADEEP	Enquiry from 1/2/2026	cold	696725fcc8563e92f69326b1	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:56:08.212	2026-01-15 13:56:08.212	\N
cmkfij0i70009l404exs9zwgl	BALARAM	JENA	9861793986	\N	JAJPUR TOWN	Enquiry from 1/2/2026	cold	6968f1f95a78b232f6609978	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-15 13:56:09.679	2026-01-15 13:56:09.679	\N
cmkfij1nq000bl404yvz1ei6a	RABINDRA	BERA	9938901756	\N	KENDRAPARA	Enquiry from 1/2/2026	cold	6968f1fb5a78b232f66099a9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-15 13:56:11.174	2026-01-15 13:56:11.174	\N
cmkfij3y1000dl404gsbe5vn0	MOHAMMED	SAHA UDDIN	8093494466	\N	SAMBALPUR	Enquiry from 1/2/2026	cold	696725fcc8563e92f6932575	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:56:14.138	2026-01-15 13:56:14.138	\N
cmkfij4sz000fl404qcgdks6b	CHANDAN	LENKA	7853004834	\N	BHADRAK	Enquiry from 1/3/2026	cold	6968f1ff5a78b232f6609a13	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-15 13:56:15.251	2026-01-15 13:56:15.251	\N
cmkfij5sp000hl4044llhux8c	SUSHREE	RATH	7978848487	\N	CTC	Enquiry from 1/3/2026	cold	6968f2005a78b232f6609a3b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:56:16.537	2026-01-15 13:56:16.537	\N
cmkfij716000jl404tkc6ho1f	SAMIR	KUMAR MOHANTY	7847930940	\N	CTC	Enquiry from 1/3/2026	cold	6968f2025a78b232f6609a6e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:56:18.139	2026-01-15 13:56:18.139	\N
cmkfij81z000ll404n2yso7ad	MIRZA	SUMAN BAIG	7609865421	\N	SALEPUR	Enquiry from 1/3/2026	cold	6968f2035a78b232f6609a8e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-15 13:56:19.464	2026-01-15 13:56:19.464	\N
cmkfij963000nl40457kmkbsd	Subham		7008700486	\N	PARADIP	Enquiry from 1/3/2026	cold	6968f2045a78b232f6609aa8	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-15 13:56:20.907	2026-01-15 13:56:20.907	\N
cmkfija7v000pl404riydv9jf	SANJAY	BEHERA	9090518780	\N	KENDRAPARA	Enquiry from 1/3/2026	cold	6968f2065a78b232f6609ad9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-15 13:56:22.268	2026-01-15 13:56:22.268	\N
cmkfijcdy000rl4049hginand	Sandeep	s	9344636605	\N	TIRTOL	Enquiry from 1/3/2026	cold	696725fcc8563e92f69326e6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-15 13:56:25.079	2026-01-15 13:56:25.079	\N
cmkfijdm1000tl404txqtzwah	Pratap	Kumar Singh	7735746381	\N	JAGATPUR	Enquiry from 1/3/2026	cold	6968f20a5a78b232f6609b1e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-15 13:56:26.665	2026-01-15 13:56:26.665	\N
cmkfijfp8000vl404b7w4bfqj	Ashis	Patri	8847835893	\N	CDA-10	Enquiry from 1/5/2026	cold	696725fcc8563e92f6932631	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:56:29.372	2026-01-15 13:56:29.372	\N
cmkfijgrk000xl404kclxdhub	SATYA	SUBHAM	8114377842	\N	CTC	Enquiry from 1/5/2026	cold	6968f20e5a78b232f6609b4a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-15 13:56:30.753	2026-01-15 13:56:30.753	\N
cmkfijhso000zl4044peefdjt	BINOD	PALEI	9437213205	\N	BARIPADA	Enquiry from 1/5/2026	cold	6968f2105a78b232f6609b5f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:56:32.089	2026-01-15 13:56:32.089	\N
cmkfijit20011l404cedffytk	RANJITA	DAS	6370162506	\N	BALESWAR	Enquiry from 1/5/2026	cold	6968f2115a78b232f6609b74	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-15 13:56:33.398	2026-01-15 13:56:33.398	\N
cmkfijjsn0013l4049zoqx5x7	BASANT	KUMAR PRADHAN	7750052254	\N	BHADRAK	Enquiry from 1/5/2026	cold	6968f2125a78b232f6609b89	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-15 13:56:34.679	2026-01-15 13:56:34.679	\N
cmkfijks50015l404v87rjig7	NISHIT	RANJAN SAHOO	9090434142	\N	JAJPUR	Enquiry from 1/5/2026	cold	6968f2135a78b232f6609b9e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-15 13:56:35.957	2026-01-15 13:56:35.957	\N
cmkfijllr0017l404nnmhu1za	PRITAM	SAHOO	9439731818	\N	BARIPADA	Enquiry from 1/5/2026	cold	6968f2145a78b232f6609bb3	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-15 13:56:37.024	2026-01-15 13:56:37.024	\N
cmkfijmjw0019l404jk7owdaf	BHABANI	SANKAR BAISHAK	9337235524	\N	SALEPUR	Enquiry from 1/5/2026	cold	6968f2165a78b232f6609bca	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:56:38.252	2026-01-15 13:56:38.252	\N
cmkfijo01001bl404en84066y	TANVIR	ALAM	8709612729	\N	PARADEEP	Enquiry from 1/5/2026	cold	6968f2185a78b232f6609bf2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:56:40.13	2026-01-15 13:56:40.13	\N
cmkfijow1001dl404poxucmoq	BIBEKRANJAN	DAS	9960462980	\N	KENDRAPARA	Enquiry from 1/5/2026	cold	6968f2195a78b232f6609c08	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:56:41.281	2026-01-15 13:56:41.281	\N
cmkfijpyu001fl404m089knwe	ASIT	KHAN	7735438600	\N	KENDRAPARA	Enquiry from 1/6/2026	cold	6968f21a5a78b232f6609c35	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:56:42.678	2026-01-15 13:56:42.678	\N
cmkfijqtl001hl40452aa4a3m	MAHESWAR	NANDA	9853523499	\N	JAGATSINGHPUR	Enquiry from 1/6/2026	cold	6968f21b5a78b232f6609c52	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-15 13:56:43.785	2026-01-15 13:56:43.785	\N
cmkfijrsr001jl404ibxae6ua	GYANENDRA	SAMAL	9949485966	\N	JAJPUR	Enquiry from 1/6/2026	cold	6968f21c5a78b232f6609c7a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-15 13:56:45.051	2026-01-15 13:56:45.051	\N
cmkfijsxn001ll404hbsqhy2h	DIBYARAJ	SEN	9692727227	\N	CHANDIKHOL	Enquiry from 1/6/2026	cold	6968f21e5a78b232f6609c99	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:56:46.524	2026-01-15 13:56:46.524	\N
cmkfijtww001nl404zv2bgsll	SANGRAM	SINGH	7504969594	\N	SALEPUR	Enquiry from 1/6/2026	cold	6968f21f5a78b232f6609cb4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-15 13:56:47.792	2026-01-15 13:56:47.792	\N
cmkfijv41001pl404a2wxb031	MUKESH	KUMAR SWAIN	8260343363	\N	JAJPUR	Enquiry from 1/6/2026	cold	6968f2215a78b232f6609cdc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-15 13:56:49.345	2026-01-15 13:56:49.345	\N
cmkfijwey001rl404tu03s2ui	JITENDRA		9497471616	\N	BALESWAR	Enquiry from 1/6/2026	cold	6968f2225a78b232f6609cf4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:56:51.034	2026-01-15 13:56:51.034	\N
cmkfijxg6001tl4043j8yu76t	Prasanjit	Bhuyan	9348319828	\N	JAJPUR	Enquiry from 1/6/2026	cold	695f6edf0063bd8e932d1b28	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:56:52.374	2026-01-15 13:56:52.374	\N
cmkfijyek001vl404mk79jp2q	SHAIKH	ATTAHAR	8144992976	\N	JAJPUR	Enquiry from 1/6/2026	cold	6968f2255a78b232f6609d2b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:56:53.613	2026-01-15 13:56:53.613	\N
cmkfijzbk001xl404teaaexsc	DEEPAK	KUMAR	8431383287	\N	CUTTACK	Enquiry from 1/6/2026	cold	6968f2265a78b232f6609d42	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-15 13:56:54.8	2026-01-15 13:56:54.8	\N
cmkfik09w001zl404atdwgwss	BALARAM	PALEI	9937378309	\N	BERHAMPUR	Enquiry from 1/6/2026	cold	6968f2275a78b232f6609d5e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-15 13:56:56.037	2026-01-15 13:56:56.037	\N
cmkfik1bf0021l4042a9xktcx	Digbijay	Saha	7847861761	\N	CUTTACK SADAR	Enquiry from 1/6/2026	cold	695f6ee40063bd8e932d1b8a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:56:57.388	2026-01-15 13:56:57.388	\N
cmkfik27v0023l404hxh4zp2n	SUSANTA	NAYAK	8895751301	\N	JAJPUR	Enquiry from 1/6/2026	cold	6968f22a5a78b232f6609db4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:56:58.555	2026-01-15 13:56:58.555	\N
cmkfik3n30025l404fwpyx2pn	DURGA	PRASAD DASH	8637238959	\N	JAGATSINGHPUR	Enquiry from 1/6/2026	cold	6968f22c5a78b232f6609ddb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:57:00.4	2026-01-15 13:57:00.4	\N
cmkfik4lp0027l404m3yx0y6b	HARISH	PANGI	8984137008	\N	MALANGIRI	Enquiry from 1/6/2026	cold	6968f22d5a78b232f6609dfb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-15 13:57:01.645	2026-01-15 13:57:01.645	\N
cmkfik5oa0029l404euti5xd0	ROHIT	TIWARI	9065021992	\N	BALESWAR	Enquiry from 1/7/2026	cold	6968f22e5a78b232f6609e29	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:57:03.034	2026-01-15 13:57:03.034	\N
cmkfik6md002bl40458y1ssp2	Sudam	Behera	9827877234	\N	CTC	Enquiry from 1/7/2026	cold	695f6ed50063bd8e932d1a81	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:04.261	2026-01-15 13:57:04.261	\N
cmkfik7x3002dl404uqszq48m	AMIT	MISHRA	9920554564	\N	CUTTACK	Enquiry from 1/7/2026	cold	6968f2315a78b232f6609e71	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:05.943	2026-01-15 13:57:05.943	\N
cmkfik8va002fl4042uaiumbp	CHANDRA	SEKHAR MOHAPATRA	7750064157	\N	KENDRAPARA	Enquiry from 1/7/2026	cold	6968f2335a78b232f6609e93	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:57:07.174	2026-01-15 13:57:07.174	\N
cmkfik9uh002hl404s4hsqkep	GOPAL	CHANDRA MANDAL	7751923612	\N	BHADRAK	Enquiry from 1/7/2026	cold	6968f2345a78b232f6609ed7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-15 13:57:08.441	2026-01-15 13:57:08.441	\N
cmkfikau2002jl404b22h38n7	ANIMESH	SAHOO	8984895513	\N	PATTAMUNDAI	Enquiry from 1/7/2026	cold	6968f2355a78b232f6609f07	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:09.722	2026-01-15 13:57:09.722	\N
cmkfikbvi002ll404gss6hd1w	SUBHAM	DAS	7609010229	\N	JAJPUR	Enquiry from 1/8/2026	cold	6968f2375a78b232f6609f1e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:11.07	2026-01-15 13:57:11.07	\N
cmkfikcuh002nl404w3g5140t	Nigamananda	Sahoo	9437131211	\N	KENDRAPARA	Enquiry from 1/8/2026	cold	6968f2385a78b232f6609f4f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:57:12.329	2026-01-15 13:57:12.329	\N
cmkfikdsn002pl4044cmz22hc	DR	SITAKANT PANDA	8763177829	\N	CDA SEC 9	Enquiry from 1/8/2026	cold	6968f2395a78b232f6609f78	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:13.559	2026-01-15 13:57:13.559	\N
cmkfikfui002rl404wswgosya	Arun	kumar Arun kumar Shaw	8093694951	\N	BANKI	Enquiry from 1/8/2026	cold	696725fcc8563e92f69326eb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:16.218	2026-01-15 13:57:16.218	\N
cmkfikgps002tl404oqe3e5i5	Bishal	Pilley	9040703063	\N	JAGATPUR	Enquiry from 1/8/2026	cold	695f6ec30063bd8e932d1905	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:17.344	2026-01-15 13:57:17.344	\N
cmkfikhn0002vl404b60w2f2f	Bipul	Baivav	9853357609	\N	MALKANGIR	Enquiry from 1/8/2026	cold	6968f23e5a78b232f6609ffa	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:18.541	2026-01-15 13:57:18.541	\N
cmkfikitl002xl404k20zl27k	RAJ	GUPTA	9437744556	\N	BARIPADA	Enquiry from 1/8/2026	cold	6968f2405a78b232f660a032	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:20.074	2026-01-15 13:57:20.074	\N
cmkfikjsl002zl404pn44sl6g	BIJAY	KUMAR SWAIN	8722009999	\N	KENDRAPARA	Enquiry from 1/8/2026	cold	6968f2415a78b232f660a04a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-15 13:57:21.333	2026-01-15 13:57:21.333	\N
cmkfikkq80031l4044xseuo0x	KRISHNA	HALDAR	7978889128	\N	MALKANGIR	Enquiry from 1/8/2026	cold	6968f2425a78b232f660a05f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-15 13:57:22.545	2026-01-15 13:57:22.545	\N
cmkfiklqu0033l404iz9evll8	SHASIKANT	MALLICK	9556527897	\N	KENDRAPARA	Enquiry from 1/8/2026	cold	6968f2435a78b232f660a074	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:57:23.862	2026-01-15 13:57:23.862	\N
cmkfikmsr0035l404s53ydyiw	JOGADANANDA	KARA	8018402612	\N	BALESWAR	Enquiry from 1/8/2026	cold	6968f2455a78b232f660a089	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-15 13:57:25.227	2026-01-15 13:57:25.227	\N
cmkfiknu80037l404rppaqxem	LALAT	SWAIN	9078382165	\N	JAGATSINGHPUR	Enquiry from 1/9/2026	cold	6968f2465a78b232f660a09e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-15 13:57:26.577	2026-01-15 13:57:26.577	\N
cmkfikpua0039l404ku34ajfd	Biswa	Ranjan Behera	7894870108	\N	CUTTACK SADAR	Enquiry from 1/9/2026	cold	696725fcc8563e92f693252f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-15 13:57:29.17	2026-01-15 13:57:29.17	\N
cmkfikqp8003bl404jou89blm	DEBASISH	SAHOO	7008063743	\N	\N	Enquiry from 1/9/2026	cold	6968f24a5a78b232f660a0c9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:30.285	2026-01-15 13:57:30.285	\N
cmkfikrje003dl404xo4amtdz	Rasmiranjan	singh	9338483557	\N	CTC	Enquiry from 1/9/2026	cold	6968f24b5a78b232f660a0de	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-15 13:57:31.371	2026-01-15 13:57:31.371	\N
cmkfikuqw003fl404eb7q7809	Lalit	Lakhotia	9776330551	\N	CUTTACK SADAR	Enquiry from 1/9/2026	cold	696725fcc8563e92f69324d9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:35.526	2026-01-15 13:57:35.526	\N
cmkfikw1j003hl4044ebdi8ii	AMIT	RANJAN BISWAL	7809992525	\N	KENDRAPARA	Enquiry from 1/9/2026	cold	6968f2515a78b232f660a123	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-15 13:57:37.208	2026-01-15 13:57:37.208	\N
cmkfikx26003jl404kzc5ezct	RAM	MOHAN MOHANTY	9861479996	\N	BHADRAK	Enquiry from 1/9/2026	cold	6968f2525a78b232f660a13b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-15 13:57:38.526	2026-01-15 13:57:38.526	\N
cmkfikxy2003ll404v695tj73	CHITA	RANJAN SAHOO	9884213654	\N	CUTTACK	Enquiry from 1/9/2026	cold	6968f2535a78b232f660a16f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:39.674	2026-01-15 13:57:39.674	\N
cmkfikzxn003nl404xehcqd4d	Shaikh	Safik Uddin .	9778386238	\N	CUTTACK SADAR	Enquiry from 1/9/2026	cold	696725fcc8563e92f69324cf	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:42.251	2026-01-15 13:57:42.251	\N
cmkfil0tc003pl404kn3o2z22	Kaliprasanna	Das	7978672421	\N	CUTTACK SADAR	Enquiry from 1/10/2026	cold	6968f2575a78b232f660a1b5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-15 13:57:43.392	2026-01-15 13:57:43.392	\N
cmkfil1vd003rl404f0n44793	Anand	Das	9853576622	\N	CUTTACK SADAR	Enquiry from 1/10/2026	cold	6968f2585a78b232f660a1ca	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:44.761	2026-01-15 13:57:44.761	\N
cmkfil2rq003tl404a0k6leje	SATYAJIT	BEHERA	7077664136	\N	KENDRAPARA	Enquiry from 1/10/2026	cold	6968f2595a78b232f660a1df	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-15 13:57:45.927	2026-01-15 13:57:45.927	\N
cmkfil3l2003vl404bzfe6l8r	SWAVIMAN	GHARAI	8338812219	\N	BALESWAR	Enquiry from 1/10/2026	cold	6968f25a5a78b232f660a1f4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:57:46.982	2026-01-15 13:57:46.982	\N
cmkfil4ox003xl4043t12an82	SASWAT	SAMAL	9861181070	\N	JAJPUR	Enquiry from 1/10/2026	cold	6968f25c5a78b232f660a209	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-15 13:57:48.418	2026-01-15 13:57:48.418	\N
cmkfil6t3003zl404y0em1uux	Swadhin	Kumar swain	8984148062	\N	CUTTACK SADAR	Enquiry from 1/10/2026	cold	696725fcc8563e92f69324fb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:51.155	2026-01-15 13:57:51.155	\N
cmkfil97s0041l404ipqn9aat	Chandan	kumar sahoo	9776794005	\N	TRITOL	Enquiry from 1/10/2026	cold	696725fcc8563e92f69325a6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:54.281	2026-01-15 13:57:54.281	\N
cmkfilb6x0043l404l2n91419	Dipankar	Dipankar Ray	9861430414	\N	CUTTACK	Enquiry from 1/10/2026	cold	696725fcc8563e92f693259e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:56.841	2026-01-15 13:57:56.841	\N
cmkfilc780045l4045qazz6ar	HIMANSHU	SAHOO	7749980484	\N	KENDRAPARA	Enquiry from 1/10/2026	cold	6968f2665a78b232f660a285	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:57:58.148	2026-01-15 13:57:58.148	\N
cmkfildb70047l404mtr035l6	SWAGAT	SUBHRAJIT DAS	7978933518	\N	JAGATPUR	Enquiry from 1/10/2026	cold	6968f2675a78b232f660a2a4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-15 13:57:59.587	2026-01-15 13:57:59.587	\N
cmkfilff70049l404nb6p8rmy	Satyajit	Sahoo	7008014127	\N	CUTTACK SADAR	Enquiry from 1/10/2026	cold	696725fcc8563e92f6932648	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:02.323	2026-01-15 13:58:02.323	\N
cmkfilhcq004bl404qd3xeh4n	Mrinal	Dey	7008025812	\N	CUTTACK SADAR	Enquiry from 1/10/2026	cold	696725fcc8563e92f69324da	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:04.826	2026-01-15 13:58:04.826	\N
cmkfilik0004dl404b5hy9vup	JAGABANDU	NAYAK	9343045572	\N	BALESWAR	Enquiry from 1/10/2026	cold	6968f26e5a78b232f660a324	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:06.384	2026-01-15 13:58:06.384	\N
cmkfilkjo004fl4041uz9gare	Subrat	Kumar Swain	9437124503	\N	CUTTACK SADAR	Enquiry from 1/10/2026	cold	696725fcc8563e92f693251c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:08.965	2026-01-15 13:58:08.965	\N
cmkfillid004hl4042h7fpxzn	BIJAY	KUMAR SETHY	7306707045	\N	BHADRAK	Enquiry from 1/12/2026	cold	6968f2725a78b232f660a378	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-15 13:58:10.214	2026-01-15 13:58:10.214	\N
cmkfilmhq004jl404lakaa9j3	Sushant	Sethi	9777970102	\N	Jagatsinghpur	Enquiry from 1/12/2026	cold	6968f2735a78b232f660a3bc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-15 13:58:11.487	2026-01-15 13:58:11.487	\N
cmkfilnhc004ll4047r23afsa	Bhaktahari	das	7008572637	\N	Jajpur town	Enquiry from 1/12/2026	cold	6968f2745a78b232f660a3e7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:58:12.768	2026-01-15 13:58:12.768	\N
cmkfilodd004nl4048d2knqx6	Chandan	kumar sahoo	9776794005	\N	TIRTOL	Enquiry from 1/12/2026	cold	696725fcc8563e92f69325a6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:13.921	2026-01-15 13:58:13.921	\N
cmkfilqg8004pl404btinswt7	Prabas	Kumar Khatua	9438328717	\N	PARADEEP	Enquiry from 1/12/2026	cold	696725fcc8563e92f693252c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:16.616	2026-01-15 13:58:16.616	\N
cmkfilsix004rl404f6nxr07k	Biswajit	Swain	9938474749	\N	TULSIPUR	Enquiry from 1/12/2026	cold	696725fcc8563e92f69325c1	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:19.306	2026-01-15 13:58:19.306	\N
cmkfiluhi004tl404gmid0leu	Sudhanshu	Behera	7978300827	\N	CUTTACK SADAR	Enquiry from 1/12/2026	cold	696725fcc8563e92f693254a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:21.844	2026-01-15 13:58:21.844	\N
cmkfilvlu004vl404exqew3at	Rinku	Maity RK	8018983328	\N	KENDRAPADA	Enquiry from 1/12/2026	cold	6968f27f5a78b232f660a4ea	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-15 13:58:23.298	2026-01-15 13:58:23.298	\N
cmkfilxp3004xl404ry6clykn	Bikram	kumar Sahoo	7077931523	\N	CUTTACK SADAR	Enquiry from 1/12/2026	cold	696725fcc8563e92f69325f8	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:26.007	2026-01-15 13:58:26.007	\N
cmkfilyx2004zl404oxdiu9u3	Jkd	Mohapatra	9437755675	\N	BHADRAK	Enquiry from 1/12/2026	cold	6968f2835a78b232f660a516	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-15 13:58:27.591	2026-01-15 13:58:27.591	\N
cmkfilzs30051l404c60qxkfs	Mithun	behera	7978971902	\N	Paradeep	Enquiry from 1/12/2026	cold	6968f2845a78b232f660a530	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	\N	2026-01-15 13:58:28.707	2026-01-15 13:58:28.707	\N
cmkfim1vv0053l404gowgn1f9	SIBA	PRASAD MAHAPATRA	8917290377	\N	CUTTACK	Enquiry from 1/12/2026	cold	696725fcc8563e92f6932545	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:31.435	2026-01-15 13:58:31.435	\N
cmkfim3sz0055l404hisnfpz8	BIJOY	MANNA	6370956160	\N	JAGATPUR	Enquiry from 1/12/2026	cold	696725fcc8563e92f6932675	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:33.923	2026-01-15 13:58:33.923	\N
cmkfim5v40057l4047c6u0kgp	Yogesh	Rathod	9177227071	\N	TIRUMALAGIRI	Enquiry from 1/12/2026	cold	696725fcc8563e92f6932522	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:36.592	2026-01-15 13:58:36.592	\N
cmkfim7zt0059l4041ismp0fi	SATYA	RANJAN RANA	8249670550	\N	SALIPUR	Enquiry from 1/12/2026	cold	696725fcc8563e92f6932586	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:39.353	2026-01-15 13:58:39.353	\N
cmkfim8rm005bl4040xzlugz2	Bikram	kumar Sahoo	7077931523	\N	CUTTACK	Enquiry from 1/12/2026	cold	696725fcc8563e92f69325f8	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:40.354	2026-01-15 13:58:40.354	\N
cmkfim9pf005dl404iusbvot0	HIMANSHU	BEHERA	7326048866	\N	BALESWAR	Enquiry from 1/12/2026	cold	6968f2915a78b232f660a602	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-15 13:58:41.571	2026-01-15 13:58:41.571	\N
cmkfimbtf005fl404h1fxpenx	Kedar	SWAIN	9938866144	\N	SALIPUR	Enquiry from 1/12/2026	cold	696725fcc8563e92f693254d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-15 13:58:44.308	2026-01-15 13:58:44.308	\N
cmkfimcs6005hl404c1ryqpsu	SAMEER	MOHAPATRA	9090090094	\N	HIRAKUD	Enquiry from 1/12/2026	cold	6968f2955a78b232f660a65c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:58:45.559	2026-01-15 13:58:45.559	\N
cmkfimeag005jl404v3zv9msu	ARUPANAND	DAS	7008731255	\N	JAGATSINGPUR	Enquiry from 1/12/2026	cold	6968f2975a78b232f660a67b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:58:47.512	2026-01-15 13:58:47.512	\N
cmkfimg8x005ll4042xxlom19	Sheikh	Mamoor	8658017754	\N	CUTTACK SADAR	Enquiry from 1/13/2026	cold	696725fcc8563e92f6932530	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-15 13:58:50.05	2026-01-15 13:58:50.05	\N
cmkfimh6w005nl404pooabe0r	Pragati	Rout	9777533488	\N	CTC	Enquiry from 1/13/2026	cold	6968f29b5a78b232f660a6be	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:58:51.272	2026-01-15 13:58:51.272	\N
cmkfimi46005pl404u9jbqy37	MANOJ	NAYAK	9583932193	\N	KENDRAPARA	Enquiry from 1/13/2026	cold	6968f29c5a78b232f660a6d6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:58:52.471	2026-01-15 13:58:52.471	\N
cmkfimj5z005rl40457cxcwcf	BISWAJIT	SAHOO	9348790314	\N	JAJPUR	Enquiry from 1/13/2026	cold	6968f29d5a78b232f660a700	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-15 13:58:53.831	2026-01-15 13:58:53.831	\N
cmkfimkww005tl404iox2hf6i	NRUSINGHA	SAMAL	7008938363	\N	CUTTACK	Enquiry from 1/13/2026	cold	6968f2a05a78b232f660a720	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:58:56.096	2026-01-15 13:58:56.096	\N
cmkfimm5t005vl404m11sunnx	PARSHURAM	BEHERA	7978154947	\N	BALESWAR	Enquiry from 1/13/2026	cold	6968f2a15a78b232f660a741	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-15 13:58:57.713	2026-01-15 13:58:57.713	\N
cmkfimnet005xl404eiisd084	BIKASH	DHIR SAMANT	9938960681	\N	JAJPUR	Enquiry from 1/13/2026	cold	6968f2a35a78b232f660a768	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:58:59.334	2026-01-15 13:58:59.334	\N
cmkfimod9005zl404ad0eijhc	ABHINASH	PRADHAN	7751869265	\N	BALESWAR	Enquiry from 1/13/2026	cold	6968f2a45a78b232f660a792	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:59:00.574	2026-01-15 13:59:00.574	\N
cmkfimquy0061l4043ctqs1pk	SIBASHIS	SAHOO	8117817203	\N	BIDANASI	Enquiry from 1/13/2026	cold	696725fcc8563e92f69326ef	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:59:03.802	2026-01-15 13:59:03.802	\N
cmkfimrsz0063l4043juuaj4k	SUSHANT	KUMAR SWAIN	8249549063	\N	JAJPUR	Enquiry from 1/13/2026	cold	6968f2a85a78b232f660a839	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:59:05.027	2026-01-15 13:59:05.027	\N
cmkfimst50065l404h415ws6m	CHINMAYA	BEHERA	8328918433	\N	PARADEEP	Enquiry from 1/13/2026	cold	6968f2aa5a78b232f660a860	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-15 13:59:06.33	2026-01-15 13:59:06.33	\N
cmkfimtxn0067l404eqk2xmvy	PRIYANKA		8984097953	\N	CTC	Enquiry from 1/13/2026	cold	6968f2ab5a78b232f660a885	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:59:07.788	2026-01-15 13:59:07.788	\N
cmkfimvvm0069l404ddt7d70l	Narayan	Bramha	6370800336	\N	CUTTACK SADAR	Enquiry from 1/13/2026	cold	696725fcc8563e92f69325ff	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:59:10.306	2026-01-15 13:59:10.306	\N
cmkfimy1o006bl404u2ne8sw9	Yassar	Patel	9338577770	\N	CUTTACK	Enquiry from 1/13/2026	cold	696725fcc8563e92f693267c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:59:13.116	2026-01-15 13:59:13.116	\N
cmkfin078006dl404mwvs9tbk	GOPINATH	BARIK .	9977041045	\N	CUTTACK	Enquiry from 1/13/2026	cold	696725fcc8563e92f6932660	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:59:15.908	2026-01-15 13:59:15.908	\N
cmkfin1e2006fl404lop4lm82	BIBHU	KALYAN	9861109810	\N	CUTTACK	Enquiry from 1/13/2026	cold	6968f2b55a78b232f660a96d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:59:17.451	2026-01-15 13:59:17.451	\N
cmkfin2dt006hl404xg5kf2j0	BRUNDABAN	DAS	7440142746	\N	JAJPUR	Enquiry from 1/13/2026	cold	6968f2b65a78b232f660a986	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:59:18.738	2026-01-15 13:59:18.738	\N
cmkfin3db006jl404frymyk8m	Mintu	Biswas	9668115999	\N	\N	Enquiry from 1/13/2026	cold	6968f2b75a78b232f660a9ab	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-15 13:59:20.015	2026-01-15 13:59:20.015	\N
cmkfin4fz006ll4046f7hii5i	PRASANT	BHATEKAR	9040164073	\N	CUTTACK	Enquiry from 1/14/2026	cold	6968f2b95a78b232f660a9cc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-15 13:59:21.407	2026-01-15 13:59:21.407	\N
cmkfin5h1006nl404ty3ggvff	SANTOSH	PANDA	8622849225	\N	JAJPUR	Enquiry from 1/14/2026	cold	6968f2ba5a78b232f660a9e9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:59:22.742	2026-01-15 13:59:22.742	\N
cmkfin6du006pl404nq90gy8t	SAMERENDRA	PRADHAN	9938190675	\N	PARADEEP	Enquiry from 1/14/2026	cold	6968f2bb5a78b232f660aa07	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-15 13:59:23.92	2026-01-15 13:59:23.92	\N
cmkfin7gd006rl404895husry	Kshitish	Das	9776708100	\N	CDA	Enquiry from 1/14/2026	cold	6968f2bd5a78b232f660aa1f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:59:25.309	2026-01-15 13:59:25.309	\N
cmkfin8jz006tl404eh39uqng	PREMASIS	JENA	7978623735	\N	JAJPUR	Enquiry from 1/14/2026	cold	6968f2be5a78b232f660aa45	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:59:26.736	2026-01-15 13:59:26.736	\N
cmkfin9jy006vl404ushmoa6e	MANGRAJ		9999988282	\N	BHADRAK	Enquiry from 1/14/2026	cold	6968f2bf5a78b232f660aa67	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 13:59:28.031	2026-01-15 13:59:28.031	\N
cmkhy01qt0001jo047ei991w9	JANMEJAYA	ROUT	7377777779	\N	BHUBANESWAR	Enquiry from 1/2/2026	cold	696725fcc8563e92f69326d5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:44:51.029	2026-01-17 06:44:51.029	\N
cmkhy03au0003jo04oe9zepwe	AMBRIT	PATTANAIK	8917538609	\N	KHORDHA	Enquiry from 1/2/2026	cold	696725fcc8563e92f693269a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:44:53.046	2026-01-17 06:44:53.046	\N
cmkhy04fr0005jo04ohdze1el	RAMACHANDRA	PANIGRAHI	8327778535	\N	KORAPUT	Enquiry from 1/2/2026	cold	696b2fe6c906e255c280e3e8	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:44:54.52	2026-01-17 06:44:54.52	\N
cmkhy05d20007jo04f5i3wvzh	LAL	KUMAR	9592661605	\N	BERHAMPUR	Enquiry from 1/2/2026	cold	6964e7a7f5d2f8f3c8764d66	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:44:55.718	2026-01-17 06:44:55.718	\N
cmkhy06hw0009jo04kojyjxom	Dibyendu	Sahoo	8260044586	\N	ANGUL	Enquiry from 1/3/2026	cold	696725fcc8563e92f6932591	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:44:57.188	2026-01-17 06:44:57.188	\N
cmkhy081b000bjo0400ne8pvx	IKHLAS		8908347862	\N	SAHEED NAGAR	Enquiry from 1/3/2026	cold	696b2febc906e255c280e437	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:44:59.183	2026-01-17 06:44:59.183	\N
cmkhy097h000djo04blrg0a1g	AJIT	PARIDA	9778855115	\N	JAJPUR ROAD	Enquiry from 1/3/2026	cold	696b2fecc906e255c280e44c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:45:00.702	2026-01-17 06:45:00.702	\N
cmkhy0a8b000fjo04bk6ujjhi	ZAMIL	ALLI	8144034741	\N	JAGATSINGHPUR	Enquiry from 1/3/2026	cold	696b2fedc906e255c280e461	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:02.027	2026-01-17 06:45:02.027	\N
cmkhy0be5000hjo04wqk55cf6	KAMALAKANT	BARIK	6370225331	\N	JHARPADA	Enquiry from 1/3/2026	cold	696725fcc8563e92f69324f9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:03.533	2026-01-17 06:45:03.533	\N
cmkhy0cgi000jjo04qdgjglx2	MINAKETAN	PRADHAN	6200409398	\N	HI-TECH	Enquiry from 1/3/2026	cold	696b2ff0c906e255c280e4a7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:04.914	2026-01-17 06:45:04.914	\N
cmkhy0dt0000ljo04qzcagihz	Shaktiprasad	Panda	8895488796	\N	BHUBANESWAR	Enquiry from 1/3/2026	cold	696725fcc8563e92f69326b2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:06.66	2026-01-17 06:45:06.66	\N
cmkhy0eo9000njo04aiujj7bg	PRABHU	PRASAD ACHARYA	8237993508	\N	PATIA	Enquiry from 1/5/2026	cold	696b2ff3c906e255c280e4dc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:07.785	2026-01-17 06:45:07.785	\N
cmkhy0fi3000pjo04ttumzhvg	Ananda	Kandher	7894530970	\N	BHUBANESWAR	Enquiry from 1/5/2026	cold	695f6bb60063bd8e932d0df5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:08.859	2026-01-17 06:45:08.859	\N
cmkhy0ghz000rjo04rn9t4tah	PRAKASH	BHANJA	9348514369	\N	BALESWAR	Enquiry from 1/5/2026	cold	696b2ff6c906e255c280e509	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:10.151	2026-01-17 06:45:10.151	\N
cmkhy0hs4000tjo04uq7k017p	ABHINAS	KHUNTIA	7077714550	\N	PURI	Enquiry from 1/5/2026	cold	696725fcc8563e92f6932618	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:45:11.813	2026-01-17 06:45:11.813	\N
cmkhy0ivk000vjo04rscztoqz	Sriram		7795351015	\N	NAYAPALI	Enquiry from 1/5/2026	cold	695f6ee80063bd8e932d1bb5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:13.233	2026-01-17 06:45:13.233	\N
cmkhy0k1l000xjo04jq86jo3n	Prasenjit	Barik	6371401468	\N	BHUBANESWAR	Enquiry from 1/5/2026	cold	696725fcc8563e92f6932528	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:14.745	2026-01-17 06:45:14.745	\N
cmkhy0l85000zjo04hf5ujdaq	Prafulla	Kumar	7978637367	\N	BHUBANESWAR	Enquiry from 1/5/2026	cold	696725fcc8563e92f69324d1	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:16.277	2026-01-17 06:45:16.277	\N
cmkhy0m250011jo04atujymp7	ANUSHKA		8018111888	\N	BHUBANESWAR	Enquiry from 1/6/2026	cold	6964ec74f5d2f8f3c8766dbc	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:17.358	2026-01-17 06:45:17.358	\N
cmkhy0nf40013jo04so36d2u0	Anuj	BARAL	8018126603	\N	PATIA	Enquiry from 1/6/2026	cold	696725fcc8563e92f69324e6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:19.12	2026-01-17 06:45:19.12	\N
cmkhy0opm0015jo04kxw8ixlu	JITENDRA		9497471616	\N	BALESWAR	Enquiry from 1/6/2026	cold	6968f2225a78b232f6609cf4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:20.794	2026-01-17 06:45:20.794	\N
cmkhy0pvk0017jo04nirzajyq	Roshni	Khandai	9178829827	\N	PAHALA	Enquiry from 1/6/2026	cold	696725fcc8563e92f6932537	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:45:22.304	2026-01-17 06:45:22.304	\N
cmkhy0r090019jo0455sfs9n3	Shreeyans	Mohapatra	7735830943	\N	BHUBANESWAR	Enquiry from 1/6/2026	cold	696725fcc8563e92f69326bd	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:23.77	2026-01-17 06:45:23.77	\N
cmkhy0s09001bjo04a8c5wdky	Deepu	Diyani	8249434675	\N	JAJPUR ROAD	Enquiry from 1/6/2026	cold	696725fcc8563e92f693268f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:45:25.065	2026-01-17 06:45:25.065	\N
cmkhy0tnu001djo049pwo614k	DIBYA	RANJAN MOHANTY	7609976201	\N	BHUBANESWAR	Enquiry from 1/6/2026	cold	696725fcc8563e92f69325ed	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:27.211	2026-01-17 06:45:27.211	\N
cmkhy0ute001fjo044x4xpcy4	Hitesh	Kumar Panda	9337730709	\N	BHUBANESWAR	Enquiry from 1/6/2026	cold	696725fcc8563e92f69325b5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:28.707	2026-01-17 06:45:28.707	\N
cmkhy0vui001hjo04v804ii73	MOHAN		9901770088	\N	DEOGADA	Enquiry from 1/6/2026	cold	696b3009c906e255c280e64c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:30.042	2026-01-17 06:45:30.042	\N
cmkhy0xa4001jjo04fsavk2q7	Sohan		9692907343	\N	TALCHER	Enquiry from 1/7/2026	cold	696725fcc8563e92f69325c6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:45:31.9	2026-01-17 06:45:31.9	\N
cmkhy0y6l001ljo04usie4nue	CHINMAYA		7769951198	\N	CTC	Enquiry from 1/7/2026	cold	696b300dc906e255c280e67b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:45:33.07	2026-01-17 06:45:33.07	\N
cmkhy0z7k001njo04003fl41n	SOURVA	AGRAWAL	7008445818	\N	RASULGARH	Enquiry from 1/7/2026	cold	696b300ec906e255c280e69c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:34.401	2026-01-17 06:45:34.401	\N
cmkhy108r001pjo041xtu8egc	SUSHANT	SAMAL	7978330611	\N	NAYAPALI	Enquiry from 1/8/2026	cold	696b300fc906e255c280e6bb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:35.74	2026-01-17 06:45:35.74	\N
cmkhy1188001rjo04x6dbd4ow	CHINMAYA		9668082424	\N	ANUGUL	Enquiry from 1/8/2026	cold	696b3010c906e255c280e6d2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:37.014	2026-01-17 06:45:37.014	\N
cmkhy126c001tjo045pb0xffk	CHANDAN		9437018419	\N	RAVI TALKIES	Enquiry from 1/8/2026	cold	696b3012c906e255c280e6f4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:38.244	2026-01-17 06:45:38.244	\N
cmkhy13bo001vjo04oq2jea9v	Saswat	Mishra	8144744947	\N	NIALI	Enquiry from 1/8/2026	cold	696725fcc8563e92f69326c6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:45:39.732	2026-01-17 06:45:39.732	\N
cmkhy147h001xjo04ghiqo4oi	AKIB	JAVED	7701805115	\N	SAMANTARAPUR	Enquiry from 1/9/2026	cold	696b3014c906e255c280e728	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:40.878	2026-01-17 06:45:40.878	\N
cmkhy158n001zjo04xodnez0f	Subrat	Narayan Panda	7854880771	\N	BHUBANESWAR	Enquiry from 1/9/2026	cold	696b3016c906e255c280e73d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:42.216	2026-01-17 06:45:42.216	\N
cmkhy163e0021jo04nc4dk81z	Aditya	Narayan Patra	9337880418	\N	BHUBANESWAR	Enquiry from 1/9/2026	cold	696b3017c906e255c280e752	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:45:43.323	2026-01-17 06:45:43.323	\N
cmkhy176w0023jo04dddeqg6m	DASARATH	MEHER	9437241198	\N	GANJAM	Enquiry from 1/9/2026	cold	696725fcc8563e92f69324de	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:44.744	2026-01-17 06:45:44.744	\N
cmkhy184c0025jo04e9wf9rrx	PRIYANSHU		8763248100	\N	CUTTACK	Enquiry from 1/9/2026	cold	696b3019c906e255c280e780	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:45.948	2026-01-17 06:45:45.948	\N
cmkhy194u0027jo041l7chr4i	KHIROD	PATRA	7033850662	\N	BARAMUNDA	Enquiry from 1/9/2026	cold	696b301bc906e255c280e797	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:47.263	2026-01-17 06:45:47.263	\N
cmkhy1afc0029jo04my7539jx	RAKESH		8984145608	\N	DELTA SQUARE	Enquiry from 1/9/2026	cold	696b301cc906e255c280e7ac	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:48.936	2026-01-17 06:45:48.936	\N
cmkhy1b79002bjo04ohcaoltx	NIHAR	Agarwal	9777996972	\N	NAYAPALI	Enquiry from 1/9/2026	cold	6964e7c9f5d2f8f3c876500b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:45:49.942	2026-01-17 06:45:49.942	\N
cmkhy1ced002djo048zldxm80	Sambit	Swain	9437465592	\N	KUJANGA	Enquiry from 1/9/2026	cold	696725fcc8563e92f6932610	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:51.494	2026-01-17 06:45:51.494	\N
cmkhy1dxe002fjo04q5t89ugh	Subash	Chandra Jangid	8270027000	\N	BHUBANESWAR	Enquiry from 1/9/2026	cold	696725fcc8563e92f693262a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:53.475	2026-01-17 06:45:53.475	\N
cmkhy1f76002hjo04gpsndv8b	MUKESH		9556002023	\N	BBSR	Enquiry from 1/9/2026	cold	696725fcc8563e92f69324d2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:55.122	2026-01-17 06:45:55.122	\N
cmkhy1g0c002jjo04pg9kka4a	DIBYAJYOTI	DAS	9090018004	\N	RAGHUNATHPUR	Enquiry from 1/9/2026	cold	696b3024c906e255c280e815	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:45:56.173	2026-01-17 06:45:56.173	\N
cmkhy1hbl002ljo04h1tbu7sp	DEVADARSHINI	SAHOO	9658263901	\N	KIIT SQUARE	Enquiry from 1/9/2026	cold	696b3025c906e255c280e82f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:45:57.873	2026-01-17 06:45:57.873	\N
cmkhy1ipv002njo04jpeg5j4j	Puja	Murmu	8339084661	\N	BHUBANESWAR	Enquiry from 1/10/2026	cold	696b3027c906e255c280e850	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:45:59.683	2026-01-17 06:45:59.683	\N
cmkhy1jqk002pjo045lghexa2	srinibas	mohapatra	7504539844	\N	BHUBANESWAR	Enquiry from 1/10/2026	cold	696b3028c906e255c280e865	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:46:01.005	2026-01-17 06:46:01.005	\N
cmkhy1ksy002rjo04k54tzvvo	B	AHEMAD	9861610061	\N	JHARPADA	Enquiry from 1/10/2026	cold	696b302ac906e255c280e87a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:02.387	2026-01-17 06:46:02.387	\N
cmkhy1lw3002tjo04334hz2kw	Ambit	Sahu	9692847747	\N	ANGUL	Enquiry from 1/10/2026	cold	696725fcc8563e92f69324d3	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:03.796	2026-01-17 06:46:03.796	\N
cmkhy1n54002vjo04i0nrqmpr	PRAVATI	PADIARY	6370973977	\N	BALESWAR	Enquiry from 1/10/2026	cold	696b302dc906e255c280e8b8	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:46:05.416	2026-01-17 06:46:05.416	\N
cmkhy1o0b002xjo04ejurm3ba	SWATIMAYEE	ROUT	9778120546	\N	BERHAMPUR	Enquiry from 1/10/2026	cold	696b302ec906e255c280e8cd	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:46:06.539	2026-01-17 06:46:06.539	\N
cmkhy1p1d002zjo04bi1g7yoe	Radhamohan	Mohanty	8249559718	\N	CUTTACK SADAR	Enquiry from 1/10/2026	cold	696725fcc8563e92f693266c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:07.873	2026-01-17 06:46:07.873	\N
cmkhy1q180031jo04u286ydqm	TUSHAR	RANJAN PRADHAN	8455909050	\N	ANGUL	Enquiry from 1/10/2026	cold	696b3031c906e255c280e8fa	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:46:09.164	2026-01-17 06:46:09.164	\N
cmkhy1s4f0033jo04sxn5ihxc	Avik	roy	9911434933	\N	CDA 9	Enquiry from 1/10/2026	cold	696725fcc8563e92f693251b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:11.871	2026-01-17 06:46:11.871	\N
cmkhy1tc40035jo04ltjp0yhv	Suraj	Tripathy	9439863801	\N	BHUBANESWAR	Enquiry from 1/10/2026	cold	696725fcc8563e92f69325e5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:13.444	2026-01-17 06:46:13.444	\N
cmkhy1uh90037jo042ee5o99r	Priyabrata	Samal	9439818099	\N	TALCHER	Enquiry from 1/12/2026	cold	696725fcc8563e92f69325de	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:46:14.926	2026-01-17 06:46:14.926	\N
cmkhy1vdk0039jo04ta40om00	SAROJ	KUMAR PATRA	9032555917	\N	BERHAMPUR	Enquiry from 1/12/2026	cold	696b3038c906e255c280e953	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:16.088	2026-01-17 06:46:16.088	\N
cmkhy1we9003bjo044t9onvo6	bihari	babu	7091366868	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	696b3039c906e255c280e96a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:46:17.409	2026-01-17 06:46:17.409	\N
cmkhy1xg0003djo04w0u1tzed	Manoj	Chakrabarty	9937128333	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	696725fcc8563e92f69324f2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:46:18.768	2026-01-17 06:46:18.768	\N
cmkhy1yl9003fjo04ej5t9m3q	Santosh	Ray	9437124111	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	696b303cc906e255c280e997	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:46:20.253	2026-01-17 06:46:20.253	\N
cmkhy2001003hjo04r2hehqib	Swapnesh	Pattnaik	9933377734	\N	KALPANA	Enquiry from 1/12/2026	cold	696725fcc8563e92f69324d7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:46:22.081	2026-01-17 06:46:22.081	\N
cmkhy2136003jjo040dpp5pmm	Arpit		8260534787	\N	CTC	Enquiry from 1/12/2026	cold	696725fcc8563e92f69324e2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:23.491	2026-01-17 06:46:23.491	\N
cmkhy229k003ljo04gv8yjbf8	Anshuman	sabuja mohanta burma	7008896622	\N	KEONJHAR	Enquiry from 1/12/2026	cold	696725fcc8563e92f69324df	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:25.017	2026-01-17 06:46:25.017	\N
cmkhy23gp003njo040eq8n51x	HARSH	KHIRWAL	8109159090	\N	CHATISHGARH	Enquiry from 1/12/2026	cold	696b3042c906e255c280e9ee	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:46:26.57	2026-01-17 06:46:26.57	\N
cmkhy24hs003pjo04u2mdhvn6	TEJASWAR	PRASAD NAYAK	6372858761	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	696b3043c906e255c280ea03	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:46:27.904	2026-01-17 06:46:27.904	\N
cmkhy25ee003rjo04vk24prmn	Abhimayumahato		8118007870	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	696b3045c906e255c280ea18	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:46:29.079	2026-01-17 06:46:29.079	\N
cmkhy264u003tjo04jbkckb90	AWARATOKA		8917413128	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	696b3045c906e255c280ea2d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:30.031	2026-01-17 06:46:30.031	\N
cmkhy27ba003vjo04k7r8f1mk	ARUP	KUMAR PRADHAN	7978050710	\N	CHAKEISIANI	Enquiry from 1/13/2026	cold	696725fcc8563e92f693250b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:46:31.558	2026-01-17 06:46:31.558	\N
cmkhy283z003xjo04mbxismt4	JYOTIRMAYEE	BISWAL	8981422703	\N	BHUBANESWAR	Enquiry from 1/13/2026	cold	696b3048c906e255c280ea58	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56zmu30001jy04rtisk47w	2026-01-17 06:46:32.592	2026-01-17 06:46:32.592	\N
cmkhy293n003zjo041825b6zd	BARUN	SAHOO	9880716060	\N	RAIPUR	Enquiry from 1/13/2026	cold	696b3049c906e255c280ea6d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:46:33.875	2026-01-17 06:46:33.875	\N
cmkhy2a9b0041jo04plzhdvyz	Rajni	Singh	9937049671	\N	BHUBANESWAR	Enquiry from 1/13/2026	cold	696725fcc8563e92f6932581	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:35.375	2026-01-17 06:46:35.375	\N
cmkhy2bbc0043jo04gomnnnh4	Ambrit	prusty	9583282780	\N	DHAULI	Enquiry from 1/13/2026	cold	696725fcc8563e92f6932525	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:36.745	2026-01-17 06:46:36.745	\N
cmkhy2c7l0045jo04yth195jk	Alekh	Sahoo	8144497420	\N	BHUBANESWAR	Enquiry from 1/14/2026	cold	696b304dc906e255c280eaae	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:46:37.905	2026-01-17 06:46:37.905	\N
cmkhy2d290047jo04l6ll207r	SHREEYSNH	MOHAPATRA	7735067674	\N	POKHARIPUT	Enquiry from 1/14/2026	cold	696b304ec906e255c280eac3	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:39.01	2026-01-17 06:46:39.01	\N
cmkhy2dx00049jo04buib7qja	SURAJ		9900061804	\N	BANGLORE	Enquiry from 1/14/2026	cold	696b3050c906e255c280ead8	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:40.116	2026-01-17 06:46:40.116	\N
cmkhy2epu004bjo04hev4sjoq	LOKESH		7064882222	\N	JHARSUGUDA	Enquiry from 1/14/2026	cold	696b3051c906e255c280eaed	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk56v3sb0001jp04h73ijrbf	2026-01-17 06:46:41.154	2026-01-17 06:46:41.154	\N
cmkhy2fpa004djo04n2u3w7jt	ANUBHA	PRADHAN	7008800671	\N	JHARPADA	Enquiry from 1/14/2026	cold	696b3052c906e255c280eb0b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:42.431	2026-01-17 06:46:42.431	\N
cmkhy2glz004fjo044dq3oovm	NIHAR	RANJAN JENA	9337121166	\N	SAMANTARAPUR	Enquiry from 1/14/2026	cold	696b3053c906e255c280eb27	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:43.607	2026-01-17 06:46:43.607	\N
cmkhy2hgn004hjo04g7iphpgj	TOFAN	MOHAPATRA	8050106897	\N	BANGLORE	Enquiry from 1/14/2026	cold	696b3054c906e255c280eb3c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk5701ld0001l804ns4u58mz	2026-01-17 06:46:44.711	2026-01-17 06:46:44.711	\N
cmkhyl7iu0001l704sjkqm21v	Deepak	Kumar Garabadu	9938826252	\N	OLD TOWN	Enquiry from 1/2/2026	cold	695f6ed00063bd8e932d1a11	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:18.294	2026-01-17 07:01:18.294	\N
cmkhyl92p0003l70420mianaq	ANANTAGOPAL	SAHOO	8327757978	\N	POKHARIPUT	Enquiry from 1/2/2026	cold	696b33c0c906e255c280f412	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-17 07:01:20.305	2026-01-17 07:01:20.305	\N
cmkhyl9zl0005l7041yqslm60	NAKUL	BEHERA	7873988898	\N	PURI	Enquiry from 1/2/2026	cold	696b33c1c906e255c280f427	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-17 07:01:21.49	2026-01-17 07:01:21.49	\N
cmkhylb0t0007l704d8loj6go	SUMITRA	MOHAPATRA	8260610210	\N	KALINGA NAGAR	Enquiry from 1/2/2026	cold	696b33c2c906e255c280f444	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:01:22.829	2026-01-17 07:01:22.829	\N
cmkhylbyx0009l704lv4i6lhf	Sonu	SamantaRay	9078477631	\N	OLD TOWN	Enquiry from 1/2/2026	cold	696b33c4c906e255c280f459	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-17 07:01:24.058	2026-01-17 07:01:24.058	\N
cmkhyld4f000bl70423aijwes	KRISHNA	MOHANTY	7259400880	\N	NAYAPALI	Enquiry from 1/2/2026	cold	696b33c5c906e255c280f46e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-17 07:01:25.551	2026-01-17 07:01:25.551	\N
cmkhyle05000dl704nb36up5h	RAJEEB	ADHIKARY	8011051506	\N	PATRAPADA	Enquiry from 1/2/2026	cold	696b33c6c906e255c280f483	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-17 07:01:26.694	2026-01-17 07:01:26.694	\N
cmkhylewh000fl7048cgjzcr2	PRADIPTA	SWAIN	8984390681	\N	PIPILI	Enquiry from 1/3/2026	cold	696b33c7c906e255c280f498	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-17 07:01:27.858	2026-01-17 07:01:27.858	\N
cmkhylfz7000hl704xtcun4yi	ABHISHEK	GOYAL	9078378371	\N	KORAPUT	Enquiry from 1/3/2026	cold	696b33c9c906e255c280f4ad	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:01:29.252	2026-01-17 07:01:29.252	\N
cmkhylh16000jl704w5ll1n0b	AMRIT	ANKUR	9439451888	\N	UNIT-6	Enquiry from 1/3/2026	cold	696b33cac906e255c280f4c2	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-17 07:01:30.619	2026-01-17 07:01:30.619	\N
cmkhyli09000ll704yxeckm18	ABHISHEK	SINGH	7382996274	\N	VIZAG	Enquiry from 1/3/2026	cold	696b33cbc906e255c280f4d7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:31.882	2026-01-17 07:01:31.882	\N
cmkhyliw1000nl704131uimb0	MANAS	SAHOO	9437084035	\N	BARAGADA BRIT COLONY	Enquiry from 1/3/2026	cold	696b33ccc906e255c280f4ec	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:33.025	2026-01-17 07:01:33.025	\N
cmkhyljrn000pl704k2e9k2eo	Narra	Sandeep Reddy	9348062825	\N	LINGARAJ	Enquiry from 1/3/2026	cold	696725fcc8563e92f69325f1	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-17 07:01:34.163	2026-01-17 07:01:34.163	\N
cmkhylkpc000rl704ajxdhikv	Shaikh	hakim	9556793904	\N	BHUBANESWAR	Enquiry from 1/3/2026	cold	696725fcc8563e92f693269e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-17 07:01:35.377	2026-01-17 07:01:35.377	\N
cmkhyllha000tl7048nc9ce2v	Yuvraj	Agarwal	6370951770	\N	BHUBANESWAR	Enquiry from 1/5/2026	cold	695f6ee50063bd8e932d1b9f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:36.383	2026-01-17 07:01:36.383	\N
cmkhylmbi000vl704js5ysrox	TRISHA		9090190950	\N	KHANDAGIRI	Enquiry from 1/5/2026	cold	696b33d1c906e255c280f541	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:37.47	2026-01-17 07:01:37.47	\N
cmkhylnj0000xl704cw3cqsfa	RAKESH	KUMAR BEHERA	9178371626	\N	UNIT-4	Enquiry from 1/5/2026	cold	696725fcc8563e92f69326a7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:01:39.036	2026-01-17 07:01:39.036	\N
cmkhyloky000zl704uaq4mxvj	Soumyajit	Sahoo	8260621188	\N	JAGAMARA	Enquiry from 1/5/2026	cold	696725fcc8563e92f69324f1	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-17 07:01:40.402	2026-01-17 07:01:40.402	\N
cmkhylpji0011l7040k8olrgj	ASWINI	DAS	7978635345	\N	JAGAMARA	Enquiry from 1/5/2026	cold	696b33d5c906e255c280f595	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:41.646	2026-01-17 07:01:41.646	\N
cmkhylq8k0013l704budfhcg4	Sankar		9966828184	\N	BHUBANESWAR	Enquiry from 1/5/2026	cold	695f6ed80063bd8e932d1abb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:42.549	2026-01-17 07:01:42.549	\N
cmkhylrdf0015l7048f6e8rnq	KANHU	MISHRA	7008924894	\N	KALINGA NAGAR	Enquiry from 1/5/2026	cold	696725fcc8563e92f693253f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:01:44.019	2026-01-17 07:01:44.019	\N
cmkhylsak0017l704j9plif00	TEJASH	DAS	9348558747	\N	FOREST PARK	Enquiry from 1/5/2026	cold	696b33d9c906e255c280f5da	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-17 07:01:45.212	2026-01-17 07:01:45.212	\N
cmkhyltev0019l704n14v6m6o	SATYABRATA	NAYAK	8249766645	\N	KHANDAGIRI	Enquiry from 1/5/2026	cold	696b33dac906e255c280f5ef	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:01:46.663	2026-01-17 07:01:46.663	\N
cmkhylucd001bl704lsykfh68	BISWAPRAKASH	PATTNAIK	6370007280	\N	PURI	Enquiry from 1/5/2026	cold	696b33dbc906e255c280f604	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:01:47.869	2026-01-17 07:01:47.869	\N
cmkhylv8h001dl704xk0nrxyn	Pratyush	Rout	9937585608	\N	KHANDAGIRI	Enquiry from 1/6/2026	cold	695f6ee20063bd8e932d1b75	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:49.026	2026-01-17 07:01:49.026	\N
cmkhylw6h001fl704vvblv05z	BIBEK		7978064794	\N	POKHARIPUT	Enquiry from 1/6/2026	cold	696b33dec906e255c280f629	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-17 07:01:50.25	2026-01-17 07:01:50.25	\N
cmkhylx0p001hl7041wdqfnu4	L	TUKARAM	7008655780	\N	RAYAGADA	Enquiry from 1/6/2026	cold	695f6ed90063bd8e932d1ad0	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:51.337	2026-01-17 07:01:51.337	\N
cmkhyly2k001jl704l2v6cc4e	PRIYANSHU	SEKHAR	7992953949	\N	PURI	Enquiry from 1/6/2026	cold	696b33e0c906e255c280f64e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:01:52.701	2026-01-17 07:01:52.701	\N
cmkhylz2x001ll704ek0h2636	Azad	Singh Yadav	7607900439	\N	BANPUR	Enquiry from 1/6/2026	cold	696b33e1c906e255c280f663	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-17 07:01:54.01	2026-01-17 07:01:54.01	\N
cmkhylzz0001nl704e2a7u4bt	SUCHISMITA	PATTNAIK	8260774630	\N	OLD TOWN	Enquiry from 1/6/2026	cold	696b33e3c906e255c280f678	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:55.164	2026-01-17 07:01:55.164	\N
cmkhym0oz001pl704ds499fx2	Azad	Singh Yadav	7607900439	\N	BANPUR	Enquiry from 1/6/2026	cold	696b33e1c906e255c280f663	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mrb90003lc04v9gamlr0	2026-01-17 07:01:56.099	2026-01-17 07:01:56.099	\N
cmkhym1ir001rl704is30dsrv	Hrushikesh	Mohanta	8984285696	\N	KESURA	Enquiry from 1/7/2026	cold	696b33e5c906e255c280f69d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:57.171	2026-01-17 07:01:57.171	\N
cmkhym2d8001tl704dtk81vll	Soumyajeet	lenkan	7751025246	\N	KHANDAGIRI	Enquiry from 1/7/2026	cold	695f6edc0063bd8e932d1afa	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:01:58.269	2026-01-17 07:01:58.269	\N
cmkhym3kg001vl704yiaowsz5	DR	NIKUNJA KUMAR DAS	9090845262	\N	UNIT 2	Enquiry from 1/7/2026	cold	696b33e7c906e255c280f6fd	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:01:59.825	2026-01-17 07:01:59.825	\N
cmkhym4il001xl704gji0gywo	JAMIL	AKHTAR KHAN	9853527578	\N	JAGAMARA	Enquiry from 1/7/2026	cold	696b33e8c906e255c280f766	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-17 07:02:01.054	2026-01-17 07:02:01.054	\N
cmkhym5hv001zl7045e1vnl22	SOUMYA	RANJAN SWAIN	9556722863	\N	NIMAPADA	Enquiry from 1/7/2026	cold	696b33eac906e255c280f79d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:02.323	2026-01-17 07:02:02.323	\N
cmkhym6o90021l704of03ntid	RAKESH		9937881111	\N	BBSR	Enquiry from 1/7/2026	cold	696b33ebc906e255c280f7d6	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-17 07:02:03.849	2026-01-17 07:02:03.849	\N
cmkhym7pp0023l704km5byvx2	AMRIT	BEHERA	7978670341	\N	UNIT-6	Enquiry from 1/7/2026	cold	696b33edc906e255c280f801	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:05.197	2026-01-17 07:02:05.197	\N
cmkhym8l20025l704tr6iy765	TAPAS	SAHOO	9338555736	\N	TANKAPANI ROAD	Enquiry from 1/7/2026	cold	696b33eec906e255c280f81f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:02:06.326	2026-01-17 07:02:06.326	\N
cmkhym9gk0027l7042sophbky	PRADEEP	NAYAK	7681079014	\N	KHANDAGIRI	Enquiry from 1/7/2026	cold	696b33efc906e255c280f852	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-17 07:02:07.461	2026-01-17 07:02:07.461	\N
cmkhymags0029l704zoouvpce	Susanta	Pradhan	9090869369	\N	SAMANTARAPUR	Enquiry from 1/8/2026	cold	695f6ec50063bd8e932d1929	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:08.764	2026-01-17 07:02:08.764	\N
cmkhymbvg002bl704wpelaz4o	PRABIN	KUMAR	9840648229	\N	PURI	Enquiry from 1/8/2026	cold	696b33f2c906e255c280f8bd	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:02:10.588	2026-01-17 07:02:10.588	\N
cmkhymczu002dl704khfqi9jk	Dipraj	Jena	9348759266	\N	BBSR	Enquiry from 1/8/2026	cold	696725fcc8563e92f69324f8	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:12.042	2026-01-17 07:02:12.042	\N
cmkhymdzz002fl7042d7kgcmk	ABHINAB		8297047111	\N	OLD TOWN	Enquiry from 1/8/2026	cold	696b33f5c906e255c280f8fa	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-17 07:02:13.343	2026-01-17 07:02:13.343	\N
cmkhymeui002hl704fb8iy4ki	SANDEEP		9348721177	\N	PURI	Enquiry from 1/8/2026	cold	696b33f6c906e255c280fb41	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-17 07:02:14.442	2026-01-17 07:02:14.442	\N
cmkhymfzs002jl704alzckhzl	MANOJ		8328927686	\N	SAHEED NAGAR	Enquiry from 1/8/2026	cold	696725fcc8563e92f69326df	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:15.929	2026-01-17 07:02:15.929	\N
cmkhymgu5002ll704qf4wit0w	DR	SANJAY PATRA	8882933540	\N	PURI	Enquiry from 1/8/2026	cold	696b33f8c906e255c280fb76	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:02:17.021	2026-01-17 07:02:17.021	\N
cmkhymhls002nl704t2itdszt	SAMIR	MOHAPATRA	7606094761	\N	RAM MANDIR	Enquiry from 1/8/2026	cold	696b33f9c906e255c280fb8b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-17 07:02:18.017	2026-01-17 07:02:18.017	\N
cmkhymiiv002pl7048sxogcyf	BINAYA		9776112000	\N	MASTER CANTIN	Enquiry from 1/9/2026	cold	696725fcc8563e92f69325a7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:19.207	2026-01-17 07:02:19.207	\N
cmkhymjss002rl704icgqfnhu	NIRANJAN	DEY	8407802860	\N	LAXMI SAGAR	Enquiry from 1/9/2026	cold	696725fcc8563e92f6932544	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:02:20.861	2026-01-17 07:02:20.861	\N
cmkhymkuj002tl7049mc7vf8c	Dibyasundar	Mahanta	9650928668	\N	BHUBANESWAR	Enquiry from 1/9/2026	cold	696725fcc8563e92f6932649	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:22.219	2026-01-17 07:02:22.219	\N
cmkhymm3k002vl70409let3lg	GOPI	NAYAK	9490429524	\N	SAHEED NAGAR	Enquiry from 1/9/2026	cold	696725fcc8563e92f69325ca	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:23.84	2026-01-17 07:02:23.84	\N
cmkhymmxk002xl704lrabe476	DIP	NARAYAN DAS	8249380910	\N	BJP NAGAR	Enquiry from 1/10/2026	cold	696b3400c906e255c280fc6b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:02:24.921	2026-01-17 07:02:24.921	\N
cmkhymnzh002zl704ltk2zk0h	ROHIT	VERMA	8249444486	\N	KHANDAGIRI	Enquiry from 1/10/2026	cold	696b3402c906e255c280fc88	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:26.285	2026-01-17 07:02:26.285	\N
cmkhymovy0031l704ptnrhqcm	DEBASISH	NAYAK	9079349573	\N	LINGIPUR	Enquiry from 1/10/2026	cold	696b3403c906e255c280fc9e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:02:27.455	2026-01-17 07:02:27.455	\N
cmkhymq3r0033l704scwi4zrd	Anish	kumar aruk	9337429787	\N	NAYAPALI	Enquiry from 1/10/2026	cold	696725fcc8563e92f693264e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-17 07:02:29.032	2026-01-17 07:02:29.032	\N
cmkhymr0f0035l704apxx05km	RASHMITA	MOHANTY	8260874337	\N	PURI	Enquiry from 1/10/2026	cold	696b3406c906e255c280fcf0	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:30.207	2026-01-17 07:02:30.207	\N
cmkhyms190037l704vi1da42z	MANAS	KISHORE MOHANTY	7008506320	\N	JHARPADA	Enquiry from 1/10/2026	cold	696b3407c906e255c280fd19	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:02:31.533	2026-01-17 07:02:31.533	\N
cmkhymt3s0039l704y0mv0njo	JITENDRA	CHOUDHURY	7728819833	\N	KESURA	Enquiry from 1/10/2026	cold	696b3408c906e255c280fd35	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:32.921	2026-01-17 07:02:32.921	\N
cmkhymuag003bl704qmpiy1l0	sunil	kumar	9178303903	\N	UNIT 8	Enquiry from 1/10/2026	cold	696725fcc8563e92f69326ab	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:34.457	2026-01-17 07:02:34.457	\N
cmkhymvfx003dl704du4uzvn3	S	PARIDA	7682954721	\N	POKHARIPUT	Enquiry from 1/12/2026	cold	696b340bc906e255c280fd85	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:02:35.949	2026-01-17 07:02:35.949	\N
cmkhymwi0003fl704lwcc16ok	IPSIT	ACHARYA	9040224040	\N	KHANDAGIRI	Enquiry from 1/12/2026	cold	696b340dc906e255c280fdb5	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-17 07:02:37.32	2026-01-17 07:02:37.32	\N
cmkhymxex003hl704p8h2arwi	Raja		9692376956	\N	BARBAD BRIT COLONY	Enquiry from 1/12/2026	cold	696725fcc8563e92f693261a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:38.506	2026-01-17 07:02:38.506	\N
cmkhymydu003jl704thpskpqv	SWASAT	SATAPATHY	9348812223	\N	KESURA	Enquiry from 1/12/2026	cold	696b340fc906e255c280fdfb	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-17 07:02:39.762	2026-01-17 07:02:39.762	\N
cmkhymzhs003ll704p9jpq480	Ram	Rajesh	9395159117	\N	BHUBANESWAR	Enquiry from 1/12/2026	cold	696725fcc8563e92f69324e7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-17 07:02:41.201	2026-01-17 07:02:41.201	\N
cmkhyn0hx003nl704psb1aiq1	Subham	Mohapatra	7436959141	\N	BARAMUNDA	Enquiry from 1/12/2026	cold	696725fcc8563e92f69325ba	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:42.502	2026-01-17 07:02:42.502	\N
cmkhyn1jm003pl704q7cqeswr	Lalit	Mahapatra	9039255128	\N	Khandagiri	Enquiry from 1/12/2026	cold	696725fcc8563e92f69325d7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:43.858	2026-01-17 07:02:43.858	\N
cmkhyn2fc003rl7040c5q7z9x	RUDRA	JASWAL	9040016089	\N	ROULKELA	Enquiry from 1/12/2026	cold	696b3414c906e255c280fe9a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-17 07:02:45.001	2026-01-17 07:02:45.001	\N
cmkhyn3k0003tl704j8agi5tw	Chinmaya	PATRA	9668651545	\N	PIPILI	Enquiry from 1/12/2026	cold	696725fcc8563e92f69325b7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:46.464	2026-01-17 07:02:46.464	\N
cmkhyn4k2003vl704mtwvt3dm	Taj	Uddin	9937552424	\N	KHANDAGIRI	Enquiry from 1/12/2026	cold	696725fcc8563e92f69325d9	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:47.762	2026-01-17 07:02:47.762	\N
cmkhyn5di003xl704sdz6zxon	Vinay	Hans	9776112000	\N	MASTER CANTEEN	Enquiry from 1/12/2026	cold	696725fcc8563e92f69325a7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:48.822	2026-01-17 07:02:48.822	\N
cmkhyn6oh003zl704jq8c6na7	Durga	Madhab Pradhan	9348020269	\N	NAYAPALI	Enquiry from 1/13/2026	cold	696725fcc8563e92f693263f	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:50.513	2026-01-17 07:02:50.513	\N
cmkhyn7k50041l7045gwe7q33	RASHMI	RANJAN NAYAK	7008755732	\N	SUNDARPADA	Enquiry from 1/13/2026	cold	696b341bc906e255c280ff2b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13n14k000fjs04n7s2wdb7	2026-01-17 07:02:51.654	2026-01-17 07:02:51.654	\N
cmkhyn8lt0043l7040iwuss4l	DR	HIMADRI	8374524678	\N	KHANDAGIRI	Enquiry from 1/13/2026	cold	696b341cc906e255c280ff4c	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:53.01	2026-01-17 07:02:53.01	\N
cmkhyn9cv0045l704wt7rnw6k	SURYA	NARAYAN PATTNAIK	9936755333	\N	POKHARIPUT	Enquiry from 1/13/2026	cold	696b341dc906e255c280ff61	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:53.984	2026-01-17 07:02:53.984	\N
cmkhynabu0047l704fgd5qstr	MITHUN	LENKA	6294716733	\N	PURI	Enquiry from 1/13/2026	cold	696b341fc906e255c280ff78	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:55.243	2026-01-17 07:02:55.243	\N
cmkhynbcf0049l704y9lvbo43	SATYAJIT	BEHERA	9284518028	\N	KHANDAGIRI	Enquiry from 1/13/2026	cold	696b3420c906e255c280ff9a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:56.559	2026-01-17 07:02:56.559	\N
cmkhyncjo004bl7044vvzi78j	Suvasis	Pradhan	9776207316	\N	BHIMTANKI	Enquiry from 1/13/2026	cold	696725fcc8563e92f693252d	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:58.116	2026-01-17 07:02:58.116	\N
cmkhyndqr004dl704nzjaf9cg	DEVI	PRASAD MISHRA	8260342909	\N	RAVITAKIES	Enquiry from 1/13/2026	cold	696b3423c906e255c280fffd	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:02:59.667	2026-01-17 07:02:59.667	\N
cmkhyneto004fl704iyiz1clo	Abinash	kumar	9337272223	\N	Ghatikia	Enquiry from 1/13/2026	cold	696725fcc8563e92f6932602	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:03:01.068	2026-01-17 07:03:01.068	\N
cmkhynfqo004hl704lqwcbnxz	BHAGABAT	PANI	8144671922	\N	PURI	Enquiry from 1/13/2026	cold	696b3426c906e255c281004b	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-17 07:03:02.257	2026-01-17 07:03:02.257	\N
cmkhyngt6004jl704yygu2hxy	Abinash	Jena	9078666342	\N	BBSR	Enquiry from 1/13/2026	cold	696725fcc8563e92f693255a	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:03:03.642	2026-01-17 07:03:03.642	\N
cmkhynhw0004ll704mj6jzv5g	MANISH	AGRWAL	8480535366	\N	ASHOK NAGAR	Enquiry from 1/13/2026	cold	696b3428c906e255c28100a4	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:03:05.04	2026-01-17 07:03:05.04	\N
cmkhyniq3004nl704wuxmn7ot	CHINMAYA	SAENAPATI	7377223298	\N	JHARPADA	Enquiry from 1/13/2026	cold	696b342ac906e255c28100ca	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ondj000hjs04uli7wp7a	2026-01-17 07:03:06.123	2026-01-17 07:03:06.123	\N
cmkhynjmt004pl704oa26nl7h	Rajesh	Raja	9778555559	\N	PATRAPADA	Enquiry from 1/14/2026	cold	696b342bc906e255c2810103	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:03:07.301	2026-01-17 07:03:07.301	\N
cmkhynkiw004rl704aa6erue4	Dibyajyoti	Rath	9827682250	\N	BARAGAD BRIT COLONY	Enquiry from 1/14/2026	cold	696b342cc906e255c2810139	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:03:08.456	2026-01-17 07:03:08.456	\N
cmkhynlk5004tl70442s3lr70	SANTOSH	KUMAR	8249363051	\N	OLD TOWN	Enquiry from 1/14/2026	cold	696b342dc906e255c281014e	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13ovnl000djs047uy6wdf0	2026-01-17 07:03:09.798	2026-01-17 07:03:09.798	\N
cmkhynmp8004vl704up0aslw1	PARESH	SAHOO	7008431945	\N	PURI	Enquiry from 1/14/2026	cold	696b342fc906e255c2810175	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13mis60007js04xgg2p6bl	2026-01-17 07:03:11.277	2026-01-17 07:03:11.277	\N
cmkhynneg004xl704r8u4wsle	PIYUSH	PRADHAN	8454848476	\N	KHANDAGIRI	Enquiry from 1/14/2026	cold	696b3430c906e255c2810192	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:03:12.184	2026-01-17 07:03:12.184	\N
cmkhynokt004zl704ax0n1lim	ENOCH	LAL	8260651586	\N	KHANDAGIRI	Enquiry from 1/14/2026	cold	696b3431c906e255c28101a7	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:03:13.71	2026-01-17 07:03:13.71	\N
cmkhynpju0051l704ile24s1p	Debiprasad	Dash	8917585471	\N	KHANDAGIRI	Enquiry from 1/14/2026	cold	696b3432c906e255c28101be	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nsjz0009js04ckim7hte	2026-01-17 07:03:14.971	2026-01-17 07:03:14.971	\N
cmkhynqfy0053l704gpbiojqa	BASUJ	SAHOO	6370587508	\N	BARAMUNDA	Enquiry from 1/14/2026	cold	696b3434c906e255c28101d3	cmk130qz40000l704z6fc2alp	cmk13jon50003js04007b2fcy	cmk13nkwk0001js04czooodij	2026-01-17 07:03:16.127	2026-01-17 07:03:16.127	\N
\.


--
-- Data for Name: DigitalEnquirySession; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."DigitalEnquirySession" (id, notes, status, "digitalEnquiryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FieldInquiry; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."FieldInquiry" (id, "firstName", "lastName", "whatsappNumber", email, address, reason, "leadScope", "whatsappContactId", "dealershipId", "leadSourceId", "interestedModelId", "interestedVariantId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: FieldInquirySession; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."FieldInquirySession" (id, notes, status, "fieldInquiryId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: LeadSource; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."LeadSource" (id, name, "order", "isDefault", "dealershipId", "createdAt", "updatedAt") FROM stdin;
cmj331qe500069ycfq0sg490q	Websites	3	t	cmivgorqg00009y5iyf5y9s5b	2025-12-12 16:29:50.081	2025-12-12 16:29:50.081
cmjbcn50y0001l504f96hangz	Hyperlocal	6	f	cmivgorqg00009y5iyf5y9s5b	2025-12-18 11:20:37.426	2025-12-18 11:20:37.426
cmjbcndys0001jo04cc0sxh44	MRC	7	f	cmivgorqg00009y5iyf5y9s5b	2025-12-18 11:20:49.012	2025-12-18 11:20:49.012
cmjbcnvub0001l80486ufdvxg	Other Digital	8	f	cmivgorqg00009y5iyf5y9s5b	2025-12-18 11:21:12.18	2025-12-18 11:21:12.18
cmk13jon50003js04007b2fcy	Ads	0	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.258	2026-01-05 11:48:00.258
cmk13jonn0005js04zrlxzgso	Websites	3	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.259	2026-01-05 11:48:00.259
cmk13joo00007js04cxk0xw1o	Instagram	1	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.258	2026-01-05 11:48:00.258
cmk13joo50009js04lc52ijgk	Customer Word-of-Mouth	4	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.258	2026-01-05 11:48:00.258
cmk13joo7000bjs04nafhv6uq	Other	5	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.259	2026-01-05 11:48:00.259
cmk13joo9000djs04ok9rhhn3	Social Media	2	t	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.258	2026-01-05 11:48:00.258
cmk14mkfi0001jr04geb9t804	FIELD	6	f	cmk130qz40000l704z6fc2alp	2026-01-05 12:18:14.382	2026-01-05 12:18:14.382
cmk14njxu0001jv04dpvacj8o	TELEPHONE	7	f	cmk130qz40000l704z6fc2alp	2026-01-05 12:19:00.402	2026-01-05 12:19:00.402
\.


--
-- Data for Name: ScheduledMessage; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."ScheduledMessage" (id, "scheduledFor", "sentAt", status, "retryCount", "deliveryTicketId", "createdAt", "updatedAt") FROM stdin;
cmk5shx8t0003i8041lapqvsn	2026-11-19 00:00:00	\N	pending	0	cmk5shx7f0001i804ugfen396	2026-01-08 18:37:33.197	2026-01-08 18:37:33.197
\.


--
-- Data for Name: TestDrive; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."TestDrive" (id, "sessionId", "modelId", "createdAt", "updatedAt", "variantId") FROM stdin;
cmk55mlxj0001kz047xvlszwj	cmk55ljq00003js04uf3cnsuj	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 07:57:20.647	2026-01-08 07:57:20.647	\N
cmk5eqwsy0001l104x6oe3220	cmk5eqe7o0006jy04q8cysn6c	cmk56zmu30001jy04rtisk47w	2026-01-08 12:12:37.906	2026-01-08 12:12:37.906	\N
cmk5r3vd70001kz04h8yatp5q	cmk5r33bv0003kz046hj64tpr	cmiztrwb10009jo04qj930dx5	2026-01-08 17:58:37.964	2026-01-08 17:58:37.964	\N
cmk7tzi000001jy04agy45jbg	cmk7tyvtt0003l204hhi5nhnu	cmk13mrb90003lc04v9gamlr0	2026-01-10 04:54:45.216	2026-01-10 04:54:45.216	\N
cmk86ai140006ld04mb7mygra	cmk869o380003ld04gzvdz1xb	cmiztoo5h0007l704gbh0c0zn	2026-01-10 10:39:13.864	2026-01-10 10:39:13.864	\N
cmk86lejt0001i204i29mzpu8	cmk86kfk8000cld04gbutpni8	cmiztscns000fl704c6yki0ju	2026-01-10 10:47:42.569	2026-01-10 10:47:42.569	\N
cmk88hwch0006ky049urgcc7q	cmk88dmlb0003ky04p5wdyd8f	cmk13mis60007js04xgg2p6bl	2026-01-10 11:40:58.241	2026-01-10 11:40:58.241	\N
cmkat6cgo0006ih043t0abl8c	cmkat5ozo0001kz04msdvjfc2	cmk13ovnl000djs047uy6wdf0	2026-01-12 06:55:23.545	2026-01-12 06:55:23.545	\N
cmkb2rmer0001l804n8q9o2hl	cmkb2p3ny0003ju04mkcppwz2	cmk13mis60007js04xgg2p6bl	2026-01-12 11:23:52.755	2026-01-12 11:23:52.755	\N
cmkc9zvp80006kz04gm6xriqo	cmkc9z13v0003kz046mqbyhfh	cmk5701ld0001l804ns4u58mz	2026-01-13 07:34:01.532	2026-01-13 07:34:01.532	\N
cmkcmgrro0001jl04w1gm5tz8	cmkcmeg9e0003l504rntww06v	cmk13o7wv000bjs04kr6sz4b0	2026-01-13 13:23:04.98	2026-01-13 13:23:04.98	\N
cmkcmlz760001l50462v506or	cmkcml1970005jl04bw81vr4n	cmk56zmu30001jy04rtisk47w	2026-01-13 13:27:07.891	2026-01-13 13:27:07.891	\N
cmkfepo700001l504awfjgxfj	cmkfej6vf0003l804clnmjr4i	cmk13mis60007js04xgg2p6bl	2026-01-15 12:09:21.852	2026-01-15 12:09:21.852	\N
cmkgevvh10001l104p2xsdl5u	cmkgeuudc0003if04wiao1vko	cmk13mis60007js04xgg2p6bl	2026-01-16 05:01:57.398	2026-01-16 05:01:57.398	\N
cmkghuwat0006l204u9kv35kf	cmkgf44al0003lh04rylg57wl	cmk13nkwk0001js04czooodij	2026-01-16 06:25:10.661	2026-01-16 06:25:10.661	\N
cmkgoj3fq0001ju04skvx0ib3	cmkgoio1s0008k404gl24m54c	cmk56zmu30001jy04rtisk47w	2026-01-16 09:31:57.351	2026-01-16 09:31:57.351	\N
cmki5qi86000bl704spk4mhxo	cmki5dd590008jl04m1e90cy4	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 10:21:22.759	2026-01-17 10:21:22.759	\N
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."User" (id, email, password, "createdAt", "updatedAt", "dealershipId", theme, "profilePicture") FROM stdin;
cmivgos9200029y5ih8trr8ri	test@google.com	$2b$10$J2srSW.o9DPQs1V8h8XYCeSIBNa1xO5rooX4qZQlEmKkFEHcQ89da	2025-12-07 08:29:33.83	2026-01-05 11:04:54.059	cmivgorqg00009y5iyf5y9s5b	custom	https://6bq7rhjji2yjom4g.public.blob.vercel-storage.com/profile-pictures/cmivgos9200029y5ih8trr8ri-1767611092722-kIQc1kwe6CExCSTCRjldrc5oWb092a.jpg
cmk130rve0002l704u1xindzz	cxhead@utkalautomobiles.com	$2b$10$HUs.0usDCUpH7f.fy3M/BOB3Tc.XptbH5N.SoKNjRJc2lioko7iG6	2026-01-05 11:33:17.978	2026-01-07 18:02:49.321	cmk130qz40000l704z6fc2alp	light	https://6bq7rhjji2yjom4g.public.blob.vercel-storage.com/profile-pictures/cmk130rve0002l704u1xindzz-1767612798008-pVUWOiwH7IndaAnsftXWaKwGRS1Ya1.jpg
\.


--
-- Data for Name: VehicleCategory; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."VehicleCategory" (id, name, "dealershipId", "createdAt", "updatedAt") FROM stdin;
cmivgs0z600079y5i3c2b21ci	SUV	cmivgorqg00009y5iyf5y9s5b	2025-12-07 08:32:04.739	2025-12-07 08:32:04.739
cmiztrdig000dl704zboi5qen	BEV	cmivgorqg00009y5iyf5y9s5b	2025-12-10 09:46:34.408	2025-12-10 09:46:34.408
cmk13jvej0001js042x7jmw4l	SUV	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:09.02	2026-01-05 11:48:09.02
cmk13jzei0001jr04tanpwnsz	EV	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:14.202	2026-01-05 11:48:14.202
\.


--
-- Data for Name: VehicleModel; Type: TABLE DATA; Schema: public; Owner: neondb_owner
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
\.


--
-- Data for Name: VehicleVariant; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."VehicleVariant" (id, name, "modelId", "createdAt", "updatedAt") FROM stdin;
cmj1ijq7d00019yn04s3gnxbh	esy	cmiztrwb10009jo04qj930dx5	2025-12-11 14:08:14.185	2025-12-11 14:08:14.185
\.


--
-- Data for Name: Visitor; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."Visitor" (id, "firstName", "lastName", "whatsappNumber", email, address, "whatsappContactId", "dealershipId", "createdAt", "updatedAt") FROM stdin;
cmk5eguhv0001l2048htsqxa1	MONALISA	MHGF	7064645937	MONA@GMAIL	TEST	695f9d608ba75797369a342e	cmk130qz40000l704z6fc2alp	2026-01-08 12:04:48.355	2026-01-08 12:12:13.794
cmk5f2tdm0001jj04lkucp9dz	SURESH 	KUMAR	7855877317	sureshkumar@gmail.com	NAYAGARH	695fa16194dcfd88151f1755	cmk130qz40000l704z6fc2alp	2026-01-08 12:21:53.339	2026-01-08 12:21:53.339
cmk5f63mk0001ib0474a9l034	HARIHAR	MAHAPATRA	9337521170	harihar@gmail.com	PURI 	695fa1fa94dcfd88151f1b99	cmk130qz40000l704z6fc2alp	2026-01-08 12:24:26.589	2026-01-08 12:24:26.589
cmk5fjllt0001kw04iape5ier	AKASH KUMAR 	MALLICK 	8917375417	akashkumar@gmail.com	KHORDHA 	695fa47094dcfd88151f3147	cmk130qz40000l704z6fc2alp	2026-01-08 12:34:56.418	2026-01-08 12:34:56.418
cmk5fxnvy0006l204w9hnce48	VINEET	KUTHAL	9437002011	vineetkuthal@gmail.com	BOMIKHAL 	695fa70094dcfd88151f50e4	cmk130qz40000l704z6fc2alp	2026-01-08 12:45:52.558	2026-01-08 12:45:52.558
cmk5fzg84000bl204zz9zjh2g	SK	MOHANTY 	7978309195	skmohanty@gmail.com	POKHARIPUT 	695fa75394dcfd88151f55a4	cmk130qz40000l704z6fc2alp	2026-01-08 12:47:15.94	2026-01-08 12:47:15.94
cmk5qz9so0001jo045y949ym8	Avtar	Panda	966870761	abhilash.panda8654@gmail.com	bhubaneswae		cmivgorqg00009y5iyf5y9s5b	2026-01-08 17:55:03.384	2026-01-08 17:55:03.384
cmk6ft8ls0001l40499qxxrio	ASHUTOSH 	PRADHAN 	8328869198	ashutosh@gmail.com	PAREDEEP	696092646291ef8bcee57fb4	cmk130qz40000l704z6fc2alp	2026-01-09 05:30:12.304	2026-01-09 05:30:12.304
cmk6ibvd30001l4041wcedeh0	SANJIB	MOHANTY 	8895180338	sanjib@gmail.com	POKHARIPUT	6960a2e8489bd08ae6299014	cmk130qz40000l704z6fc2alp	2026-01-09 06:40:40.839	2026-01-09 06:40:40.839
cmk7tyv3r0001l204367gk6sm	Biswa	Test	8658094734	biswatest@gmail.com	Bbsr	6961db77f5d2f8f3c8687e88	cmk130qz40000l704z6fc2alp	2026-01-10 04:54:15.543	2026-01-10 04:54:15.543
cmk7v2pci0001la047odt2v1r	PRADYUMNA KUMAR 	JENA	7008617434	pradyumnakumar@gmail.com	KALPANA	6961e2baf5d2f8f3c868bf98	cmk130qz40000l704z6fc2alp	2026-01-10 05:25:14.322	2026-01-10 05:25:14.322
cmk7ybphf0001jm04ydrlsq47	CHOLAGANGA	SAMAL	9862428496	cholaganga@gmail.com	JAJPUR	6961f80df5d2f8f3c8694a44	cmk130qz40000l704z6fc2alp	2026-01-10 06:56:13.251	2026-01-10 06:56:13.251
cmk7yziaf0001jp04f4dxm976	MR	BHASKAR	7894454048	bhaskar@gmail.com	KALINGA VIHAR	6961fc63f5d2f8f3c8696cf0	cmk130qz40000l704z6fc2alp	2026-01-10 07:14:43.671	2026-01-10 07:14:43.671
cmk55ljp20001js0412fftmc0	Rakesh	Swain	7978585992	cxhead@utkalautomobiles.com	Bhubaneswar	6939306b32ca55336d785d29	cmk130qz40000l704z6fc2alp	2026-01-08 07:56:31.094	2026-01-08 07:56:31.094
cmk5eenwc0001jy04trhfxtdc	DEBASISH 	MISHRA	7008296300	debasiss@gmail.com	RASULGARH	695f9cfa8ba75797369a3014	cmk130qz40000l704z6fc2alp	2026-01-08 12:03:06.492	2026-01-08 12:03:06.492
cmk805unr0001ju04rqctzb1r	ARDHENDU SEKHAR	MANSINGH	7855817098	ardhendu@gmail.com	SUBHAGYANAGAR 	6962041bf5d2f8f3c8698f84	cmk130qz40000l704z6fc2alp	2026-01-10 07:47:39.256	2026-01-10 07:47:39.256
cmk868dju0001lb04l81mgxe5	S	RAYSINGH	9776777984	sransingh@gmail.com	KHORDHA 	69622beef5d2f8f3c86a88e8	cmk130qz40000l704z6fc2alp	2026-01-10 10:37:34.746	2026-01-10 10:37:34.746
cmk869o2r0001ld04qfh0bzww	Ajit	Bhai	8981446268	abhilash.panda8654@gmail.com	bhubaneswar	69622c2af5d2f8f3c86a8b21	cmivgorqg00009y5iyf5y9s5b	2026-01-10 10:38:35.043	2026-01-10 10:38:35.043
cmk86kfjn000ald04u0s9budk	Madhusmita	Parida	9337938937	abhilash.panda8654@gmail.com	Bomikhal	69622e21f5d2f8f3c86a93d0	cmivgorqg00009y5iyf5y9s5b	2026-01-10 10:46:57.204	2026-01-10 10:46:57.204
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
cmk5r33be0001kz04kc6yhdt8	Avtar	Panda	9668750761	xyz@utkalauto.com	Bhubaneswar		cmivgorqg00009y5iyf5y9s5b	2026-01-08 17:58:01.611	2026-01-14 12:58:28.067
cmke11zii0001l704xebaz5rs	Prasant	Sahu	9776348096	prasantsahu20@gmail.com	CDA Sec 9	696793236cbf493b9842dd6b	cmk130qz40000l704z6fc2alp	2026-01-14 12:59:15.594	2026-01-14 12:59:15.594
cmkf24vxl0001l404ve151myk	DIPTIRANJAN 	MOHANTY 	9861438167	diptiranjan@gmail.com	BHUBANESWAR 	696725fcc8563e92f693265b	cmk130qz40000l704z6fc2alp	2026-01-15 06:17:16.713	2026-01-15 06:17:16.713
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
\.


--
-- Data for Name: VisitorInterest; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."VisitorInterest" (id, "visitorId", "modelId", "createdAt", "sessionId", "variantId") FROM stdin;
cmk55ljrp0004js049w2mxdpy	cmk55ljp20001js0412fftmc0	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 07:56:31.19	cmk55ljq00003js04uf3cnsuj	\N
cmk5eenxd0004jy04nd9yyacr	cmk5eenwc0001jy04trhfxtdc	cmk13mis60007js04xgg2p6bl	2026-01-08 12:03:06.53	cmk5eenx20003jy04rhjlae6m	\N
cmk5eguii0004l204r4jqhc97	cmk5eguhv0001l2048htsqxa1	cmk13mrb90003lc04v9gamlr0	2026-01-08 12:04:48.379	cmk5eguid0003l204f1zo1l99	\N
cmk5eqe7u0007jy04kviu1otk	cmk5eguhv0001l2048htsqxa1	cmk56zmu30001jy04rtisk47w	2026-01-08 12:12:13.819	cmk5eqe7o0006jy04q8cysn6c	\N
cmk5f2tei0004jj04z9t339am	cmk5f2tdm0001jj04lkucp9dz	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 12:21:53.371	cmk5f2teb0003jj0455x0v3s7	\N
cmk5f63na0004ib04cy9pbfy7	cmk5f63mk0001ib0474a9l034	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 12:24:26.614	cmk5f63n30003ib04ukk0jpiw	\N
cmk5fjlml0004kw047ecjdahq	cmk5fjllt0001kw04iape5ier	cmk13mis60007js04xgg2p6bl	2026-01-08 12:34:56.446	cmk5fjlmf0003kw04mc7h1d7a	\N
cmk5fxnwo0009l2044py34xhs	cmk5fxnvy0006l204w9hnce48	cmk13o7wv000bjs04kr6sz4b0	2026-01-08 12:45:52.585	cmk5fxnwj0008l2049hv9akba	\N
cmk5fzg8v000el204af4h8300	cmk5fzg84000bl204zz9zjh2g	cmk13mis60007js04xgg2p6bl	2026-01-08 12:47:15.968	cmk5fzg8o000dl204hh2ivrpn	\N
cmk5qz9vg0004jo04ggyqfdxm	cmk5qz9so0001jo045y949ym8	cmiztrwb10009jo04qj930dx5	2026-01-08 17:55:03.484	cmk5qz9v50003jo043m03l0h5	\N
cmk5r33c20004kz04zemupsn9	cmk5r33be0001kz04kc6yhdt8	cmiztrwb10009jo04qj930dx5	2026-01-08 17:58:01.634	cmk5r33bv0003kz046hj64tpr	\N
cmk6ft8oi0004l404yfmetaok	cmk6ft8ls0001l40499qxxrio	cmk13ondj000hjs04uli7wp7a	2026-01-09 05:30:12.402	cmk6ft8o50003l404hpb8ulko	\N
cmk6ibvez0004l4042b67eu1q	cmk6ibvd30001l4041wcedeh0	cmk13mis60007js04xgg2p6bl	2026-01-09 06:40:40.907	cmk6ibvem0003l404pngk0t8p	\N
cmk7tyvu40004l2043hw12ev9	cmk7tyv3r0001l204367gk6sm	cmk13mrb90003lc04v9gamlr0	2026-01-10 04:54:16.492	cmk7tyvtt0003l204hhi5nhnu	\N
cmk7v2pdi0004la04co5sy3ol	cmk7v2pci0001la047odt2v1r	cmk13nkwk0001js04czooodij	2026-01-10 05:25:14.358	cmk7v2pd70003la04c0gw6br3	\N
cmk7ybpkb0004jm04eo0xyrqe	cmk7ybphf0001jm04ydrlsq47	cmk13mis60007js04xgg2p6bl	2026-01-10 06:56:13.355	cmk7ybpk00003jm04py1ouzpr	\N
cmk7yzib60004jp04xevgu5fr	cmk7yziaf0001jp04f4dxm976	cmk13ovnl000djs047uy6wdf0	2026-01-10 07:14:43.698	cmk7yziaz0003jp043yg72u6c	\N
cmk805uqi0004ju040noowqbv	cmk805unr0001ju04rqctzb1r	cmk13mis60007js04xgg2p6bl	2026-01-10 07:47:39.355	cmk805upw0003ju04sxn685ze	\N
cmk868dla0004lb04q3z8q3i4	cmk868dju0001lb04l81mgxe5	cmk13nsjz0009js04ckim7hte	2026-01-10 10:37:34.798	cmk868dkw0003lb04hx7t6iir	\N
cmk869o3e0004ld04z045m168	cmk869o2r0001ld04qfh0bzww	cmiztoo5h0007l704gbh0c0zn	2026-01-10 10:38:35.066	cmk869o380003ld04gzvdz1xb	\N
cmk86kfke000dld04f3vogsou	cmk86kfjn000ald04u0s9budk	cmiztrwb10009jo04qj930dx5	2026-01-10 10:46:57.231	cmk86kfk8000cld04gbutpni8	\N
cmk87p7zs0004jx04jg8pc2vr	cmk87p7yn0001jx04d7tefhqi	cmk13mis60007js04xgg2p6bl	2026-01-10 11:18:40.313	cmk87p7zj0003jx04i1tz2yuc	\N
cmk87y2gq0009jx044jch197c	cmk87y2fx0006jx04gf41lhit	cmk13o7wv000bjs04kr6sz4b0	2026-01-10 11:25:33.051	cmk87y2gi0008jx04gycv016l	\N
cmk882750000ejx046on2wyo9	cmk88272o000bjx04t671mh6s	cmk13mis60007js04xgg2p6bl	2026-01-10 11:28:45.732	cmk88274u000djx04zj5qy19c	\N
cmk88dmlj0004ky044uqgx5oe	cmk88dmkl0001ky04npquuo37	cmk13mis60007js04xgg2p6bl	2026-01-10 11:37:38.984	cmk88dmlb0003ky04p5wdyd8f	\N
cmk88nlm70002k1046nmaoqce	cmk87p7yn0001jx04d7tefhqi	cmk13mis60007js04xgg2p6bl	2026-01-10 11:45:24.271	cmk88nlm00001k104cz3tyz6s	\N
cmk896l5d000bky04rpzf9b6p	cmk896l4e0008ky0441949cny	cmk13o7wv000bjs04kr6sz4b0	2026-01-10 12:00:10.129	cmk896l55000aky0410zlq1g7	\N
cmk89fru80004kw04rjtkmhyn	cmk89frtm0001kw040rfei7xv	cmk13nsjz0009js04ckim7hte	2026-01-10 12:07:18.704	cmk89fru20003kw040x1eit59	\N
cmk8ap7ee000gky04em93awgt	cmk8ap7dw000dky04kmxjdcku	cmk13o7wv000bjs04kr6sz4b0	2026-01-10 12:42:38.39	cmk8ap7e9000fky04e98uoroh	\N
cmkaq4qdn0004jp04py199c2z	cmkaq4qcg0001jp04owla5bsz	cmk13nsjz0009js04ckim7hte	2026-01-12 05:30:09.42	cmkaq4qdd0003jp04bri558fm	\N
cmkaq5xgq0004ib04paip6wnl	cmkaq5xg40001ib04etw1us6j	cmk13nsjz0009js04ckim7hte	2026-01-12 05:31:05.258	cmkaq5xgk0003ib04ujljc53l	\N
cmkat2vxr0004ih048901g72j	cmkat2vx20001ih04mk7k6hy3	cmk13ovnl000djs047uy6wdf0	2026-01-12 06:52:42.159	cmkat2vxl0003ih04r51ldd9b	\N
cmkat5ozv0002kz047ul6iari	cmkat2vx20001ih04mk7k6hy3	cmk13ovnl000djs047uy6wdf0	2026-01-12 06:54:53.132	cmkat5ozo0001kz04msdvjfc2	\N
cmkaw6rtf0004l5040nyj85cc	cmkaw6rsa0001l5049gwa1cbz	cmk13nsjz0009js04ckim7hte	2026-01-12 08:19:42.291	cmkaw6rt30003l504u5z8w54x	\N
cmkb2p3ob0004ju04pulqcvw6	cmkb2p3n40001ju048dag0bwy	cmk13mis60007js04xgg2p6bl	2026-01-12 11:21:55.163	cmkb2p3ny0003ju04mkcppwz2	\N
cmkb5jd9y0004l704z09osj7z	cmkb5jd8x0001l7049u7pplrp	cmk13ondj000hjs04uli7wp7a	2026-01-12 12:41:26.519	cmkb5jd9m0003l704fo5u2iis	\N
cmkc7h5lg0004i504mm2nulyd	cmkc7h5k70001i504qi6n4c4l	cmk13nsjz0009js04ckim7hte	2026-01-13 06:23:28.661	cmkc7h5l40003i504k9ffql6l	\N
cmkc7lp6p0004l8048ipsze6t	cmkc7lp5u0001l804jhi6j6eg	cmk13o7wv000bjs04kr6sz4b0	2026-01-13 06:27:00.673	cmkc7lp6h0003l804jrzj9jos	\N
cmkc80hmc0004l404q8g4bpji	cmkc80hky0001l4049n1vx43r	cmk13mis60007js04xgg2p6bl	2026-01-13 06:38:30.708	cmkc80hly0003l40472dq0lza	\N
cmkc8kqw00004gt04y8nejmry	cmkc8kqv20001gt04yswx9clf	cmk13o7wv000bjs04kr6sz4b0	2026-01-13 06:54:15.84	cmkc8kqvs0003gt04mmd4aq7k	\N
cmkc9315e0004jx0481c1bt4s	cmkc9314l0001jx04d9dxcxzv	cmk13mis60007js04xgg2p6bl	2026-01-13 07:08:28.947	cmkc931570003jx04k86jr0bi	\N
cmkc9hm610004l4044wrru8ic	cmkc9hm500001l404jt6qjzml	cmk13o7wv000bjs04kr6sz4b0	2026-01-13 07:19:49.369	cmkc9hm5t0003l404wj8s2td3	\N
cmkc9t0630004ic04jw9uqzv5	cmkc9t05a0001ic04rjqrkm44	cmk13o7wv000bjs04kr6sz4b0	2026-01-13 07:28:40.731	cmkc9t05w0003ic04xveqgetg	\N
cmkc9z1420004kz04etq78671	cmkc9z1350001kz04mixco0pl	cmk5701ld0001l804ns4u58mz	2026-01-13 07:33:21.891	cmkc9z13v0003kz046mqbyhfh	\N
cmkcan3yg0004jm04b6vmdo71	cmkcan3xj0001jm042tnpj5oy	cmk13o7wv000bjs04kr6sz4b0	2026-01-13 07:52:05.32	cmkcan3y80003jm04bu5uogao	\N
cmkcbw7qk0004l604yani7vir	cmkcbw7p20001l6049d774t20	cmk13o7wv000bjs04kr6sz4b0	2026-01-13 08:27:09.74	cmkcbw7pw0003l604ccznw1kj	\N
cmkcfe9y00004js04xxn4smc3	cmkcfe9wn0001js04aqu5cczt	cmk13nsjz0009js04ckim7hte	2026-01-13 10:05:11.257	cmkcfe9xe0003js04569syhuj	\N
cmkch1emy0004l2044fow1imr	cmkch1ekz0001l204j3qxsa48	cmk13o7wv000bjs04kr6sz4b0	2026-01-13 10:51:10.042	cmkch1emj0003l204c0g1jcoj	\N
cmkcj6a1j0004k304nxln65pk	cmkcj69y00001k304bx4b16lq	cmk13ovnl000djs047uy6wdf0	2026-01-13 11:50:56.599	cmkcj6a160003k304u1pc5cld	\N
cmkck3yg10004jr04djbdv9k6	cmkck3yf70001jr04g2hfhlyy	cmk13mis60007js04xgg2p6bl	2026-01-13 12:17:07.874	cmkck3yfu0003jr0469xxa77b	\N
cmkcmeg9m0004l504unbb9xag	cmkcmeg8s0001l5042f9mhyb4	cmk13o7wv000bjs04kr6sz4b0	2026-01-13 13:21:16.763	cmkcmeg9e0003l504rntww06v	\N
cmkcml19f0006jl045j9nocju	cmkcml18h0003jl04r9qrr8c5	cmk56zmu30001jy04rtisk47w	2026-01-13 13:26:23.907	cmkcml1970005jl04bw81vr4n	\N
cmkdk6y0q0004ky04trjlp2nt	cmkdk6xxv0001ky04v6m1o8bb	cmk13nsjz0009js04ckim7hte	2026-01-14 05:07:13.467	cmkdk6y0e0003ky04c5aqzhck	\N
cmkdk6y0q0005ky048blu4oo4	cmkdk6xxv0001ky04v6m1o8bb	cmk13n14k000fjs04n7s2wdb7	2026-01-14 05:07:13.467	cmkdk6y0e0003ky04c5aqzhck	\N
cmkdm3cky0004l2045gch5pv0	cmkdm3cka0001l20480b6gk2r	cmk13o7wv000bjs04kr6sz4b0	2026-01-14 06:00:24.947	cmkdm3cks0003l2048siax5i1	\N
cmkdm5rzy0004jr04cvocfq9v	cmkdm5rzb0001jr04v4t6fuvb	cmk13nsjz0009js04ckim7hte	2026-01-14 06:02:18.238	cmkdm5rzr0003jr04phu048ws	\N
cmkdndugu0004js04rr7spy98	cmkdndug30001js04x9wze5id	cmk13n14k000fjs04n7s2wdb7	2026-01-14 06:36:34.303	cmkdndugo0003js04swf9dm19	\N
cmkdo8aef0004jp04yxjillbt	cmkdo8adj0001jp04k35sph6j	cmk13o7wv000bjs04kr6sz4b0	2026-01-14 07:00:14.632	cmkdo8ae60003jp04f4ft82pl	\N
cmkdq179o0004jn04h7u5m3ae	cmkdq17870001jn04t40nol8x	cmk13nkwk0001js04czooodij	2026-01-14 07:50:43.212	cmkdq17990003jn045pkjzib8	\N
cmkdqiff40004jr04pqa7vb4x	cmkdqifdh0001jr044xe6iv79	cmk56zmu30001jy04rtisk47w	2026-01-14 08:04:06.929	cmkdqifep0003jr04hqwtx1yq	\N
cmkdqloum0004jo04gq7unzqu	cmkdqlou10001jo04yl487ogn	cmk13mis60007js04xgg2p6bl	2026-01-14 08:06:39.118	cmkdqlouh0003jo0484gz3nm6	\N
cmkdtp8pz0004lb04j7m6clq6	cmkdtp8os0001lb0449frz1zf	cmk13mis60007js04xgg2p6bl	2026-01-14 09:33:23.688	cmkdtp8pm0003lb04ski9yi33	\N
cmkduwpgc0009lb04bocj2rvl	cmkduwpfu0006lb04se1s3auc	cmk13o7wv000bjs04kr6sz4b0	2026-01-14 10:07:11.581	cmkduwpg70008lb04lc6jcsgv	\N
cmkdvrtac000elb046zd5y4xr	cmkdvrt9j000blb04zvk7foa0	cmk13o7wv000bjs04kr6sz4b0	2026-01-14 10:31:22.884	cmkdvrta5000dlb04vatz02f7	\N
cmkdvxwq60004kz049fswlgaf	cmkdvxwpg0001kz04dmkkuvm2	cmk5701ld0001l804ns4u58mz	2026-01-14 10:36:07.278	cmkdvxwq00003kz04b2zya42p	\N
cmkdy11lx0004l2041suhh1mx	cmkdy11km0001l204nvev1st9	cmk13mrb90003lc04v9gamlr0	2026-01-14 11:34:32.805	cmkdy11li0003l204v3kqkfka	\N
cmkdye1p80004kv04kgshkesx	cmkdye1o70001kv04lvrx5wtl	cmk13ovnl000djs047uy6wdf0	2026-01-14 11:44:39.453	cmkdye1oy0003kv041lihkzsb	\N
cmkdyv92k0004l104bjxfrzl0	cmkdyv9110001l104wx4x859g	cmk13o7wv000bjs04kr6sz4b0	2026-01-14 11:58:02.157	cmkdyv9260003l104algxa7yq	\N
cmke10yvi0002le04qso73q3f	cmk5r33be0001kz04kc6yhdt8	cmiztoo5h0007l704gbh0c0zn	2026-01-14 12:58:28.111	cmke10yv70001le04hgzsecmg	\N
cmke11zje0004l704o2wgotgo	cmke11zii0001l704xebaz5rs	cmk13mrb90003lc04v9gamlr0	2026-01-14 12:59:15.627	cmke11zj70003l704seck9jnx	\N
cmkf24w0g0004l404sse7yec0	cmkf24vxl0001l404ve151myk	cmk13o7wv000bjs04kr6sz4b0	2026-01-15 06:17:16.816	cmkf24w040003l404nxff0gvk	\N
cmkf33s2b0004jm04xwz7hi4z	cmkf33s190001jm04fzfoxjty	cmk5701ld0001l804ns4u58mz	2026-01-15 06:44:24.66	cmkf33s220003jm045u8ro5pm	\N
cmkf5hxmd0004lb04rmrot1d3	cmkf5hxl80001lb04zfw7iamj	cmk13mis60007js04xgg2p6bl	2026-01-15 07:51:24.278	cmkf5hxm40003lb041ebole6u	\N
cmkf7v9cy0004l5045nxvxdut	cmkf7v9b40001l504tpudl05e	cmk13mis60007js04xgg2p6bl	2026-01-15 08:57:45.25	cmkf7v9co0003l504viryzdwn	\N
cmkfakkgo0004l804d7iyr645	cmkfakkfm0001l804teb6rs9m	cmk13mis60007js04xgg2p6bl	2026-01-15 10:13:25.272	cmkfakkgf0003l804j1zrqt8d	\N
cmkfc93yi0004lb04v43anjtq	cmkfc93xs0001lb04ksryt73m	cmk13mis60007js04xgg2p6bl	2026-01-15 11:00:29.898	cmkfc93yb0003lb04xk94fc2k	\N
cmkfcgri60009lb047yvfb6rl	cmkfcgrgy0006lb04vwtw85w5	cmk13nkwk0001js04czooodij	2026-01-15 11:06:27.006	cmkfcgrhw0008lb0444tq0kot	\N
cmkfej6vp0004l8045r3qy3s4	cmkfej6ug0001l804j1tzb1cw	cmk13mis60007js04xgg2p6bl	2026-01-15 12:04:19.478	cmkfej6vf0003l804clnmjr4i	\N
cmkgeuudo0004if04an6gdbq7	cmkgeuucd0001if04igp4b402	cmk13mis60007js04xgg2p6bl	2026-01-16 05:01:09.324	cmkgeuudc0003if04wiao1vko	\N
cmkgf44ar0004lh04mzudpahn	cmkgf44a40001lh04386luhcx	cmk13nkwk0001js04czooodij	2026-01-16 05:08:22.083	cmkgf44al0003lh04rylg57wl	\N
cmkghdr2v0004l2040yuwfj7e	cmkghdr1m0001l204lujtmtiu	cmk13o7wv000bjs04kr6sz4b0	2026-01-16 06:11:50.743	cmkghdr2k0003l204szux25pi	\N
cmkghl7am0004l704t7zn1zd2	cmkghl79k0001l704rtqymfpz	cmk13o7wv000bjs04kr6sz4b0	2026-01-16 06:17:38.35	cmkghl7a80003l704to959w4l	\N
cmkgho3ae0004jr04o1ud1j54	cmkgho39s0001jr04miom602i	cmk13nkwk0001js04czooodij	2026-01-16 06:19:53.127	cmkgho3a80003jr04iz07ue7u	\N
cmkghpl4v0007l704jzk5mqmc	cmkgho39s0001jr04miom602i	cmk13o7wv000bjs04kr6sz4b0	2026-01-16 06:21:02.911	cmkghpl4n0006l7040a46h1fv	\N
cmkgjz0ns0004l204lf9olh7h	cmkgjz0mo0001l204b04tvgu2	cmk13mis60007js04xgg2p6bl	2026-01-16 07:24:22.169	cmkgjz0ni0003l204g8lbhmja	\N
cmkgofii30004k404ud13hvha	cmkgofiga0001k404g4dyt0rb	cmk56v3sb0001jp04h73ijrbf	2026-01-16 09:29:10.252	cmkgofihr0003k4040cjmtu0c	\N
cmkgoio1x0009k40420ra7grr	cmkgoio1f0006k404nuqbg7z5	cmk56zmu30001jy04rtisk47w	2026-01-16 09:31:37.414	cmkgoio1s0008k404gl24m54c	\N
cmkgpaqu60004l804je96efyv	cmkgpaqt50001l804hfwb0y5l	cmk13o7wv000bjs04kr6sz4b0	2026-01-16 09:53:27.39	cmkgpaqtw0003l8042klv10fv	\N
cmkgps2hx0004jv04m0g5yb69	cmkgps2fd0001jv04m964b40j	cmk13o7wv000bjs04kr6sz4b0	2026-01-16 10:06:55.654	cmkgps2hp0003jv046qez5peb	\N
cmkgpymgw0004js04scsbsx5k	cmkgpymg70001js04rhs0lb7m	cmk13mis60007js04xgg2p6bl	2026-01-16 10:12:01.473	cmkgpymgq0003js04air9s72a	\N
cmkgq0lli0009l804fup1lkol	cmkgq0lko0006l804r2fh1ykw	cmk13mrb90003lc04v9gamlr0	2026-01-16 10:13:33.655	cmkgq0llb0008l80464aimc3o	\N
cmkgqtl5w0004k1048o6p1m3s	cmkgqtl4b0001k104dbl434zm	cmk13mis60007js04xgg2p6bl	2026-01-16 10:36:06.116	cmkgqtl5i0003k104xsum693j	\N
cmkgr86hl0004jr04s2bx73tu	cmkgr86gc0001jr0488bsh2nt	cmk13nkwk0001js04czooodij	2026-01-16 10:47:26.938	cmkgr86hb0003jr04sxdiih0s	\N
cmkgs1c290004ju04683tii5b	cmkgs1bzx0001ju047nddfdrx	cmk5701ld0001l804ns4u58mz	2026-01-16 11:10:07.185	cmkgs1c200003ju049avq9exc	\N
cmkgs32xz0004lb04abihuxdk	cmkgs32x00001lb04ndsm1x8f	cmk13nkwk0001js04czooodij	2026-01-16 11:11:28.679	cmkgs32xt0003lb049rokla8u	\N
cmkgs6fq30004jx04jvxdchpe	cmkgs6fpd0001jx04mcczg8v6	cmk13nkwk0001js04czooodij	2026-01-16 11:14:05.212	cmkgs6fpx0003jx049axc48h0	\N
cmkgshplp0009jx04euxbs6nt	cmkgshpki0006jx04cln9t9if	cmk13mis60007js04xgg2p6bl	2026-01-16 11:22:51.23	cmkgshple0008jx04mmmntzs7	\N
cmkgst0s30004ju04nd4eglpt	cmkgst0qw0001ju04ljlver0q	cmk13mis60007js04xgg2p6bl	2026-01-16 11:31:38.932	cmkgst0rw0003ju04zg0hh168	\N
cmkgsu8xt000ejx047r4age1b	cmkgsu8wx000bjx04uelm9nmk	cmk13nkwk0001js04czooodij	2026-01-16 11:32:36.162	cmkgsu8xm000djx04a3zpvimj	\N
cmkgsvml60009ju043t550ftq	cmkgsvmk60006ju04f93znxkb	cmk13o7wv000bjs04kr6sz4b0	2026-01-16 11:33:40.507	cmkgsvml00008ju04o5m8jgh2	\N
cmkgswwi50009ju045e6okxo8	cmkgswwh40006ju04oe9nqn7h	cmk13nkwk0001js04czooodij	2026-01-16 11:34:40.013	cmkgswwhx0008ju042uxjjuui	\N
cmkgu1emr0004l404wghzftw3	cmkgu1elj0001l4041s2tkat1	cmk13o7wv000bjs04kr6sz4b0	2026-01-16 12:06:09.747	cmkgu1emg0003l404s9huxeoh	\N
cmkguy3ly0004i804byipvvot	cmkguy3kn0001i8042zi1pii0	cmk13o7wv000bjs04kr6sz4b0	2026-01-16 12:31:35.11	cmkguy3ln0003i8047fa530br	\N
cmkgve35m0004jz04gevfjhq5	cmkgve3460001jz04css1msno	cmk13mis60007js04xgg2p6bl	2026-01-16 12:44:01.019	cmkgve3590003jz0485bv4t4e	\N
cmkhznymz0004i804kdx68cvg	cmkhznylz0001i804gycz1xdp	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:31:26.363	cmkhznymp0003i804m2w13by4	\N
cmkhzqvge0009i8046ovigp6g	cmkhzqvfp0006i804wfba3bnh	cmk56v3sb0001jp04h73ijrbf	2026-01-17 07:33:42.207	cmkhzqvg90008i8045r0yj4hf	\N
cmkhzs6g80004l40437be9mct	cmkhzs6fj0001l4049nt835vb	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 07:34:43.112	cmkhzs6g20003l404jmgn6bg8	\N
cmkhztdhu0004lh04f6wqz52i	cmkhztdh00001lh04tkk42ueg	cmk56zmu30001jy04rtisk47w	2026-01-17 07:35:38.899	cmkhztdhn0003lh04zsvxks6w	\N
cmkhzvutc000ei804z89bbfkt	cmkhzvusg000bi804l6ss9e80	cmk5701ld0001l804ns4u58mz	2026-01-17 07:37:34.657	cmkhzvut4000di804uco5y90o	\N
cmki0g5xd000ji804a3msyb98	cmki0g5wk000gi804mc84spz8	cmk13nkwk0001js04czooodij	2026-01-17 07:53:22.177	cmki0g5x6000ii8044u7yn1ou	\N
cmki4e4g10004la043zuq935w	cmki4e4ev0001la04ciiga9zy	cmk13mis60007js04xgg2p6bl	2026-01-17 09:43:45.41	cmki4e4fq0003la04gxquskxh	\N
cmki509m50004l704fzgkq6qy	cmki509l70001l704via59vid	cmk13nsjz0009js04ckim7hte	2026-01-17 10:00:58.541	cmki509lx0003l704133utrra	\N
cmki51mxc0004jl04ajkgveh8	cmki51mwo0001jl04rw0n998s	cmk13mis60007js04xgg2p6bl	2026-01-17 10:02:02.448	cmki51mx60003jl04c2c0aza5	\N
cmki5dd5g0009jl04gkxbij0h	cmki5dd4o0006jl04rm5k97ee	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 10:11:09.653	cmki5dd590008jl04m1e90cy4	\N
cmki5gahg0009l704eh2jfa6r	cmki5gagr0006l704r81k7tcp	cmk13mis60007js04xgg2p6bl	2026-01-17 10:13:26.165	cmki5gaha0008l704ns4jns79	\N
cmki5nbx30004l804cdksk0hk	cmki5nbw30001l8040ljcy17t	cmk13n14k000fjs04n7s2wdb7	2026-01-17 10:18:54.616	cmki5nbwv0003l804y1kux1n5	\N
cmki864h70004jv04hwcj3hud	cmki864gg0001jv04hjy1zebj	cmk13ondj000hjs04uli7wp7a	2026-01-17 11:29:30.668	cmki864h00003jv04hh9n4a0z	\N
cmki89j4g0004l5046ktda5f3	cmki89j3m0001l504o2a776nm	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 11:32:09.616	cmki89j480003l504f2pdqbzz	\N
cmki8a5zi0009jv043fojit5i	cmki8a5yp0006jv040ztmu10t	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 11:32:39.247	cmki8a5zc0008jv04bdi965de	\N
cmki8aigo0004ii04pv9b2092	cmki8aig10001ii04asdw9o2x	cmk13mrb90003lc04v9gamlr0	2026-01-17 11:32:55.416	cmki8aigi0003ii04vc7xixh1	\N
cmki8xkz5000ejv0411jgbjpx	cmki8xkyi000bjv04990tde3e	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 11:50:51.762	cmki8xkz0000djv044ls0zsd2	\N
cmki9afqh000jjv04zit7n2q9	cmki9afpe000gjv04fkre4nk0	cmk13o7wv000bjs04kr6sz4b0	2026-01-17 12:00:51.498	cmki9afq9000ijv0424gxmdyp	\N
cmkiaoa840004l70404304e49	cmkiaoa700001l704ml1wsbr4	cmk13nkwk0001js04czooodij	2026-01-17 12:39:37.156	cmkiaoa7t0003l704fspi0too	\N
\.


--
-- Data for Name: VisitorSession; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."VisitorSession" (id, reason, status, "visitorId", "createdAt", "updatedAt") FROM stdin;
cmkat5ozo0001kz04msdvjfc2	FOR ENQ ABOUT THAR ROXX	exited	cmkat2vx20001ih04mk7k6hy3	2026-01-12 06:54:53.124	2026-01-12 06:56:02.61
cmkat2vxl0003ih04r51ldd9b	UNIT-3,  BBSR,ODISHA	exited	cmkat2vx20001ih04mk7k6hy3	2026-01-12 06:52:42.154	2026-01-12 06:56:22.678
cmkb2p3ny0003ju04mkcppwz2	Want quotation 	exited	cmkb2p3n40001ju048dag0bwy	2026-01-12 11:21:55.151	2026-01-12 11:25:17.241
cmkb5jd9m0003l704fo5u2iis	Explore to THAR	exited	cmkb5jd8x0001l7049u7pplrp	2026-01-12 12:41:26.507	2026-01-13 06:24:15.737
cmkaw6rt30003l504u5z8w54x	SCORPIO CLASSIC 	exited	cmkaw6rsa0001l5049gwa1cbz	2026-01-12 08:19:42.279	2026-01-13 06:24:42.017
cmkc7lp6h0003l804jrzj9jos	XUV 7XO	exited	cmkc7lp5u0001l804jhi6j6eg	2026-01-13 06:27:00.666	2026-01-13 06:54:25.097
cmkc9hm5t0003l404wj8s2td3	7xo	exited	cmkc9hm500001l404jt6qjzml	2026-01-13 07:19:49.361	2026-01-13 07:23:53.471
cmk55ljq00003js04uf3cnsuj	To test 7XO	exited	cmk55ljp20001js0412fftmc0	2026-01-08 07:56:31.128	2026-01-08 08:01:31.537
cmkc7h5l40003i504k9ffql6l	SCORPIO CLASSIC 	exited	cmkc7h5k70001i504qi6n4c4l	2026-01-13 06:23:28.648	2026-01-13 07:26:36.637
cmkc80hly0003l40472dq0lza	XUV 3XO 	exited	cmkc80hky0001l4049n1vx43r	2026-01-13 06:38:30.695	2026-01-13 07:26:57.178
cmk5eguid0003l204f1zo1l99	BOLERO	exited	cmk5eguhv0001l2048htsqxa1	2026-01-08 12:04:48.373	2026-01-08 12:05:55.764
cmkc931570003jx04k86jr0bi	XUV 3XO 	exited	cmkc9314l0001jx04d9dxcxzv	2026-01-13 07:08:28.94	2026-01-13 07:27:21.434
cmk5eqe7o0006jy04q8cysn6c	XEV 9E	test_drive	cmk5eguhv0001l2048htsqxa1	2026-01-08 12:12:13.812	2026-01-08 12:12:37.977
cmk5f2teb0003jj0455x0v3s7	XUV-7XO	exited	cmk5f2tdm0001jj04lkucp9dz	2026-01-08 12:21:53.363	2026-01-08 12:22:05.033
cmk5fjlmf0003kw04mc7h1d7a	XUV 3XO 	exited	cmk5fjllt0001kw04iape5ier	2026-01-08 12:34:56.439	2026-01-08 12:35:07.262
cmkc9t05w0003ic04xveqgetg	XUV 7XO	exited	cmkc9t05a0001ic04rjqrkm44	2026-01-13 07:28:40.725	2026-01-13 07:49:17.827
cmkc9z13v0003kz046mqbyhfh	To buy XEV 9S	exited	cmkc9z1350001kz04mixco0pl	2026-01-13 07:33:21.883	2026-01-13 07:52:04.276
cmk5f63n30003ib04ukk0jpiw	XUV7XO	exited	cmk5f63mk0001ib0474a9l034	2026-01-08 12:24:26.608	2026-01-08 12:49:28.345
cmk5eenx20003jy04rhjlae6m	3XO	exited	cmk5eenwc0001jy04trhfxtdc	2026-01-08 12:03:06.519	2026-01-08 12:50:22.15
cmk5qz9v50003jo043m03l0h5	brfvtrbf	intake	cmk5qz9so0001jo045y949ym8	2026-01-08 17:55:03.474	2026-01-08 17:55:03.474
cmk5r33bv0003kz046hj64tpr	jy vy	exited	cmk5r33be0001kz04kc6yhdt8	2026-01-08 17:58:01.627	2026-01-08 17:59:22.485
cmk5fzg8o000dl204hh2ivrpn	XUV 3XO 	exited	cmk5fzg84000bl204zz9zjh2g	2026-01-08 12:47:15.961	2026-01-09 04:50:35.271
cmk5fxnwj0008l2049hv9akba	XUV 7XO	exited	cmk5fxnvy0006l204w9hnce48	2026-01-08 12:45:52.58	2026-01-09 05:25:21.522
cmk6ft8o50003l404hpb8ulko	THAR 	exited	cmk6ft8ls0001l40499qxxrio	2026-01-09 05:30:12.389	2026-01-09 06:14:41.407
cmkc8kqvs0003gt04mmd4aq7k	XUV 7XO	exited	cmkc8kqv20001gt04yswx9clf	2026-01-13 06:54:15.833	2026-01-13 10:05:25.863
cmk6ibvem0003l404pngk0t8p	XUV 3XO 	exited	cmk6ibvd30001l4041wcedeh0	2026-01-09 06:40:40.894	2026-01-09 08:57:17.696
cmkcan3y80003jm04bu5uogao	XUV7XO	exited	cmkcan3xj0001jm042tnpj5oy	2026-01-13 07:52:05.313	2026-01-13 10:08:14.078
cmk7tyvtt0003l204hhi5nhnu	Bolero 	test_drive	cmk7tyv3r0001l204367gk6sm	2026-01-10 04:54:16.482	2026-01-10 04:54:45.238
cmk7v2pd70003la04c0gw6br3	SCORPIO-N 	exited	cmk7v2pci0001la047odt2v1r	2026-01-10 05:25:14.347	2026-01-10 05:50:58.182
cmkcfe9xe0003js04569syhuj	SCORPIO CLASSIC 	exited	cmkcfe9wn0001js04aqu5cczt	2026-01-13 10:05:11.235	2026-01-13 10:51:23.973
cmk7ybpk00003jm04py1ouzpr	XUV 3XO 	exited	cmk7ybphf0001jm04ydrlsq47	2026-01-10 06:56:13.345	2026-01-10 07:11:34.587
cmkcbw7pw0003l604ccznw1kj	XUV 7XO	exited	cmkcbw7p20001l6049d774t20	2026-01-13 08:27:09.716	2026-01-13 10:51:35.656
cmkcj6a160003k304u1pc5cld	Explore to Roxx 	exited	cmkcj69y00001k304bx4b16lq	2026-01-13 11:50:56.587	2026-01-13 12:11:40.815
cmk805upw0003ju04sxn685ze	XUV 3XO 	exited	cmk805unr0001ju04rqctzb1r	2026-01-10 07:47:39.332	2026-01-10 10:37:41.72
cmk7yziaz0003jp043yg72u6c	THAR ROXX 	exited	cmk7yziaf0001jp04f4dxm976	2026-01-10 07:14:43.691	2026-01-10 10:37:52.107
cmkch1emj0003l204c0g1jcoj	XUV7XO	exited	cmkch1ekz0001l204j3qxsa48	2026-01-13 10:51:10.028	2026-01-13 12:11:55.396
cmk869o380003ld04gzvdz1xb	Car Enquiry	exited	cmk869o2r0001ld04qfh0bzww	2026-01-10 10:38:35.06	2026-01-10 10:40:42.239
cmk86kfk8000cld04gbutpni8	Car enquiry	exited	cmk86kfjn000ald04u0s9budk	2026-01-10 10:46:57.225	2026-01-10 10:48:21.637
cmkcmeg9e0003l504rntww06v	7xo	exited	cmkcmeg8s0001l5042f9mhyb4	2026-01-13 13:21:16.755	2026-01-13 13:23:30.212
cmk87p7zj0003jx04i1tz2yuc	XUV 3XO 	exited	cmk87p7yn0001jx04d7tefhqi	2026-01-10 11:18:40.304	2026-01-10 11:18:47.822
cmkcml1970005jl04bw81vr4n	xev9e	test_drive	cmkcml18h0003jl04r9qrr8c5	2026-01-13 13:26:23.899	2026-01-13 13:27:07.913
cmk868dkw0003lb04hx7t6iir	Scorpio Classic 	exited	cmk868dju0001lb04l81mgxe5	2026-01-10 10:37:34.784	2026-01-10 11:31:16.441
cmkck3yfu0003jr0469xxa77b	\nXUV 3XO \n	exited	cmkck3yf70001jr04g2hfhlyy	2026-01-13 12:17:07.867	2026-01-14 05:59:11.342
cmk88dmlb0003ky04p5wdyd8f	Explore to 3xo	exited	cmk88dmkl0001ky04npquuo37	2026-01-10 11:37:38.975	2026-01-10 11:43:01.276
cmk88nlm00001k104cz3tyz6s	Explore to 3XO 	exited	cmk87p7yn0001jx04d7tefhqi	2026-01-10 11:45:24.265	2026-01-10 11:56:48.329
cmk87y2gi0008jx04gycv016l	XUV 7XO	exited	cmk87y2fx0006jx04gf41lhit	2026-01-10 11:25:33.043	2026-01-10 11:58:34.202
cmk88274u000djx04zj5qy19c	XUV3XO 	exited	cmk88272o000bjx04t671mh6s	2026-01-10 11:28:45.726	2026-01-10 11:58:51.586
cmkdk6y0e0003ky04c5aqzhck	The customer visited the showroom to enquire about the models available  and their prices	exited	cmkdk6xxv0001ky04v6m1o8bb	2026-01-14 05:07:13.455	2026-01-14 06:01:54.036
cmk89fru20003kw040x1eit59	SCORPIO CLASSIC 	exited	cmk89frtm0001kw040rfei7xv	2026-01-10 12:07:18.698	2026-01-10 12:34:48.189
cmk896l55000aky0410zlq1g7	XUV 7XO	exited	cmk896l4e0008ky0441949cny	2026-01-10 12:00:10.121	2026-01-10 12:35:04.674
cmkdm3cks0003l2048siax5i1	XUV 7XO	exited	cmkdm3cka0001l20480b6gk2r	2026-01-14 06:00:24.94	2026-01-14 06:33:58.069
cmk8ap7e9000fky04e98uoroh	XUV 7XO	exited	cmk8ap7dw000dky04kmxjdcku	2026-01-10 12:42:38.385	2026-01-12 04:58:00.029
cmkdm5rzr0003jr04phu048ws	SCORPIO CLASSIC 	exited	cmkdm5rzb0001jr04v4t6fuvb	2026-01-14 06:02:18.232	2026-01-14 06:37:03.211
cmkaq5xgk0003ib04ujljc53l	SCORPIO CLASSIC 	exited	cmkaq5xg40001ib04etw1us6j	2026-01-12 05:31:05.252	2026-01-12 05:38:54.677
cmkaq4qdd0003jp04bri558fm	SCORPIO CLASSIC 	exited	cmkaq4qcg0001jp04owla5bsz	2026-01-12 05:30:09.409	2026-01-12 05:39:08.672
cmkdndugo0003js04swf9dm19	BOLERO NEO 	exited	cmkdndug30001js04x9wze5id	2026-01-14 06:36:34.296	2026-01-14 06:58:11.266
cmkdq17990003jn045pkjzib8	SCORPIO-N 	exited	cmkdq17870001jn04t40nol8x	2026-01-14 07:50:43.197	2026-01-14 07:50:51.683
cmkdo8ae60003jp04f4ft82pl	XUV7XO	exited	cmkdo8adj0001jp04k35sph6j	2026-01-14 07:00:14.622	2026-01-14 08:07:02.3
cmkdqlouh0003jo0484gz3nm6	XUV 3XO 	exited	cmkdqlou10001jo04yl487ogn	2026-01-14 08:06:39.113	2026-01-14 08:57:28.662
cmkdqifep0003jr04hqwtx1yq	XE	exited	cmkdqifdh0001jr044xe6iv79	2026-01-14 08:04:06.913	2026-01-14 08:57:41.097
cmkdtp8pm0003lb04ski9yi33	XUV 3XO /BOLERO  ENQUIRY 	exited	cmkdtp8os0001lb0449frz1zf	2026-01-14 09:33:23.675	2026-01-14 09:40:50.45
cmkduwpg70008lb04lc6jcsgv	XUV 7XO	exited	cmkduwpfu0006lb04se1s3auc	2026-01-14 10:07:11.576	2026-01-14 10:44:03.384
cmkdy11li0003l204v3kqkfka	BOLERO 	intake	cmkdy11km0001l204nvev1st9	2026-01-14 11:34:32.791	2026-01-14 11:34:32.791
cmkdvxwq00003kz04b2zya42p	XEV9S	exited	cmkdvxwpg0001kz04dmkkuvm2	2026-01-14 10:36:07.272	2026-01-14 11:34:42.589
cmkdvrta5000dlb04vatz02f7	XUV7XO ENQUIRY 	exited	cmkdvrt9j000blb04zvk7foa0	2026-01-14 10:31:22.877	2026-01-14 11:34:56.628
cmkdye1oy0003kv041lihkzsb	THAR ROXX 	intake	cmkdye1o70001kv04lvrx5wtl	2026-01-14 11:44:39.442	2026-01-14 11:44:39.442
cmkdyv9260003l104algxa7yq	XUV 7XO	intake	cmkdyv9110001l104wx4x859g	2026-01-14 11:58:02.142	2026-01-14 11:58:02.142
cmke10yv70001le04hgzsecmg	Car Enquiry	exited	cmk5r33be0001kz04kc6yhdt8	2026-01-14 12:58:28.099	2026-01-14 12:58:51.138
cmke11zj70003l704seck9jnx	To enquiry about Bolero 6	intake	cmke11zii0001l704xebaz5rs	2026-01-14 12:59:15.619	2026-01-14 12:59:15.619
cmkf24w040003l404nxff0gvk	XUV 7XO	exited	cmkf24vxl0001l404ve151myk	2026-01-15 06:17:16.805	2026-01-15 07:51:43.669
cmkf33s220003jm045u8ro5pm	XEV9S	exited	cmkf33s190001jm04fzfoxjty	2026-01-15 06:44:24.65	2026-01-15 07:52:12.494
cmkf5hxm40003lb041ebole6u	XUV 3XO 	exited	cmkf5hxl80001lb04zfw7iamj	2026-01-15 07:51:24.268	2026-01-15 08:57:55.602
cmkf7v9co0003l504viryzdwn	XUV 3XO 	exited	cmkf7v9b40001l504tpudl05e	2026-01-15 08:57:45.241	2026-01-15 10:13:44.896
cmkfakkgf0003l804j1zrqt8d	XUV 3XO 	exited	cmkfakkfm0001l804teb6rs9m	2026-01-15 10:13:25.264	2026-01-15 10:58:56.079
cmkfc93yb0003lb04xk94fc2k	XUV 3XO 	intake	cmkfc93xs0001lb04ksryt73m	2026-01-15 11:00:29.891	2026-01-15 11:00:29.891
cmkfcgrhw0008lb0444tq0kot	SCORPIO-N 	intake	cmkfcgrgy0006lb04vwtw85w5	2026-01-15 11:06:26.996	2026-01-15 11:06:26.996
cmkfej6vf0003l804clnmjr4i	XUV 3xo	exited	cmkfej6ug0001l804j1tzb1cw	2026-01-15 12:04:19.467	2026-01-15 12:10:11.86
cmkgeuudc0003if04wiao1vko	ENQUIRY FOR 3XO VEHICLE 	exited	cmkgeuucd0001if04igp4b402	2026-01-16 05:01:09.313	2026-01-16 05:02:39.397
cmkghdr2k0003l204szux25pi	To see the demo vehicle 	intake	cmkghdr1m0001l204lujtmtiu	2026-01-16 06:11:50.732	2026-01-16 06:11:50.732
cmkghl7a80003l704to959w4l	TO TAKE TD	intake	cmkghl79k0001l704rtqymfpz	2026-01-16 06:17:38.336	2026-01-16 06:17:38.336
cmkgho3a80003jr04iz07ue7u	To take td 	intake	cmkgho39s0001jr04miom602i	2026-01-16 06:19:53.12	2026-01-16 06:19:53.12
cmkghpl4n0006l7040a46h1fv	To take td	intake	cmkgho39s0001jr04miom602i	2026-01-16 06:21:02.904	2026-01-16 06:21:02.904
cmkgf44al0003lh04rylg57wl	ScorpioN 	exited	cmkgf44a40001lh04386luhcx	2026-01-16 05:08:22.078	2026-01-16 06:25:16.572
cmkgjz0ni0003l204g8lbhmja	Explore to 3XO 	exited	cmkgjz0mo0001l204b04tvgu2	2026-01-16 07:24:22.158	2026-01-16 07:30:23.951
cmkgofihr0003k4040cjmtu0c	For demo vehicle 	intake	cmkgofiga0001k404g4dyt0rb	2026-01-16 09:29:10.239	2026-01-16 09:29:10.239
cmkgoio1s0008k404gl24m54c	For demo vehicle 	exited	cmkgoio1f0006k404nuqbg7z5	2026-01-16 09:31:37.409	2026-01-16 09:50:54.898
cmkgpaqtw0003l8042klv10fv	For demo vehicle 	intake	cmkgpaqt50001l804hfwb0y5l	2026-01-16 09:53:27.381	2026-01-16 09:53:27.381
cmkgps2hp0003jv046qez5peb	For demo vehicle 	intake	cmkgps2fd0001jv04m964b40j	2026-01-16 10:06:55.646	2026-01-16 10:06:55.646
cmkgpymgq0003js04air9s72a	For demo vehicle 	intake	cmkgpymg70001js04rhs0lb7m	2026-01-16 10:12:01.466	2026-01-16 10:12:01.466
cmkgq0llb0008l80464aimc3o	For demo vehicle 	intake	cmkgq0lko0006l804r2fh1ykw	2026-01-16 10:13:33.648	2026-01-16 10:13:33.648
cmkgqtl5i0003k104xsum693j	For demo vehicle 	intake	cmkgqtl4b0001k104dbl434zm	2026-01-16 10:36:06.102	2026-01-16 10:36:06.102
cmkgr86hb0003jr04sxdiih0s	For demo vehicle 	intake	cmkgr86gc0001jr0488bsh2nt	2026-01-16 10:47:26.927	2026-01-16 10:47:26.927
cmkgs1c200003ju049avq9exc	For demo vehicle 	intake	cmkgs1bzx0001ju047nddfdrx	2026-01-16 11:10:07.176	2026-01-16 11:10:07.176
cmkgs32xt0003lb049rokla8u	For demo vehicle 	intake	cmkgs32x00001lb04ndsm1x8f	2026-01-16 11:11:28.674	2026-01-16 11:11:28.674
cmkgs6fpx0003jx049axc48h0	For demo vehicle 	intake	cmkgs6fpd0001jx04mcczg8v6	2026-01-16 11:14:05.205	2026-01-16 11:14:05.205
cmkgst0rw0003ju04zg0hh168	For demo vehicle 	intake	cmkgst0qw0001ju04ljlver0q	2026-01-16 11:31:38.925	2026-01-16 11:31:38.925
cmkgsu8xm000djx04a3zpvimj	For demo vehicle 	intake	cmkgsu8wx000bjx04uelm9nmk	2026-01-16 11:32:36.154	2026-01-16 11:32:36.154
cmkgsvml00008ju04o5m8jgh2	For demo vehicle 	intake	cmkgsvmk60006ju04f93znxkb	2026-01-16 11:33:40.5	2026-01-16 11:33:40.5
cmkgswwhx0008ju042uxjjuui	For demo vehicle 	intake	cmkgswwh40006ju04oe9nqn7h	2026-01-16 11:34:40.005	2026-01-16 11:34:40.005
cmkgshple0008jx04mmmntzs7	Explore to 3XO 	exited	cmkgshpki0006jx04cln9t9if	2026-01-16 11:22:51.219	2026-01-16 11:38:23.943
cmkgu1emg0003l404s9huxeoh	For demo vehicle 	intake	cmkgu1elj0001l4041s2tkat1	2026-01-16 12:06:09.736	2026-01-16 12:06:09.736
cmkguy3ln0003i8047fa530br	For demo vehicle 	intake	cmkguy3kn0001i8042zi1pii0	2026-01-16 12:31:35.1	2026-01-16 12:31:35.1
cmkgve3590003jz0485bv4t4e	For demo vehicle 	intake	cmkgve3460001jz04css1msno	2026-01-16 12:44:01.006	2026-01-16 12:44:01.006
cmkhztdhn0003lh04zsvxks6w	XEV9E 	exited	cmkhztdh00001lh04tkk42ueg	2026-01-17 07:35:38.891	2026-01-17 07:36:23.841
cmkhzvut4000di804uco5y90o	XEV9S	exited	cmkhzvusg000bi804l6ss9e80	2026-01-17 07:37:34.649	2026-01-17 07:37:41.529
cmkhznymp0003i804m2w13by4	XUV 7XO	exited	cmkhznylz0001i804gycz1xdp	2026-01-17 07:31:26.353	2026-01-17 09:43:54.747
cmkhzqvg90008i8045r0yj4hf	BE6	exited	cmkhzqvfp0006i804wfba3bnh	2026-01-17 07:33:42.201	2026-01-17 09:44:10.461
cmkhzs6g20003l404jmgn6bg8	XUV 7XO	exited	cmkhzs6fj0001l4049nt835vb	2026-01-17 07:34:43.106	2026-01-17 09:44:19.861
cmki0g5x6000ii8044u7yn1ou	SCORPIO-N 	exited	cmki0g5wk000gi804mc84spz8	2026-01-17 07:53:22.171	2026-01-17 09:44:42.74
cmki509lx0003l704133utrra	SCORPIO CLASSIC 	intake	cmki509l70001l704via59vid	2026-01-17 10:00:58.534	2026-01-17 10:00:58.534
cmki51mx60003jl04c2c0aza5	XUV 3XO 	intake	cmki51mwo0001jl04rw0n998s	2026-01-17 10:02:02.443	2026-01-17 10:02:02.443
cmki4e4fq0003la04gxquskxh	XUV 3XO 	exited	cmki4e4ev0001la04ciiga9zy	2026-01-17 09:43:45.398	2026-01-17 10:17:52.892
cmki5gaha0008l704ns4jns79	To enquire about Xuv 3xo	exited	cmki5gagr0006l704r81k7tcp	2026-01-17 10:13:26.158	2026-01-17 10:57:16.838
cmki5dd590008jl04m1e90cy4	To enquire about Xuv 7xo	exited	cmki5dd4o0006jl04rm5k97ee	2026-01-17 10:11:09.645	2026-01-17 10:57:54.924
cmki864h00003jv04hh9n4a0z	THAR 	intake	cmki864gg0001jv04hjy1zebj	2026-01-17 11:29:30.661	2026-01-17 11:29:30.661
cmki5nbwv0003l804y1kux1n5	BOLERO NEO 	exited	cmki5nbw30001l8040ljcy17t	2026-01-17 10:18:54.607	2026-01-17 11:29:43.282
cmki89j480003l504f2pdqbzz	XUV 7XO 	intake	cmki89j3m0001l504o2a776nm	2026-01-17 11:32:09.609	2026-01-17 11:32:09.609
cmki8aigi0003ii04vc7xixh1	BOLERO 	intake	cmki8aig10001ii04asdw9o2x	2026-01-17 11:32:55.41	2026-01-17 11:32:55.41
cmki8xkz0000djv044ls0zsd2	XUV 7XO 	intake	cmki8xkyi000bjv04990tde3e	2026-01-17 11:50:51.756	2026-01-17 11:50:51.756
cmki9afq9000ijv0424gxmdyp	XUV 7XO 	intake	cmki9afpe000gjv04fkre4nk0	2026-01-17 12:00:51.49	2026-01-17 12:00:51.49
cmki8a5zc0008jv04bdi965de	To enquire about Xuv 7xo 	exited	cmki8a5yp0006jv040ztmu10t	2026-01-17 11:32:39.24	2026-01-17 12:09:20.962
cmkiaoa7t0003l704fspi0too	Explore to scorpion 	exited	cmkiaoa700001l704ml1wsbr4	2026-01-17 12:39:37.145	2026-01-17 12:44:34.495
\.


--
-- Data for Name: WhatsAppTemplate; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public."WhatsAppTemplate" (id, name, "templateId", "templateName", language, type, "dealershipId", "createdAt", "updatedAt", section) FROM stdin;
cmivgoujk00039y5i4ja8lso7	Welcome Message	25870530502583482	welcome_msg_temp_updated	en_US	welcome	cmivgorqg00009y5iyf5y9s5b	2025-12-07 08:29:36.8	2026-01-08 17:53:18.467	default
cmivgoujk00059y5ijob55cly	Exit Thank You	1614441933012020	welcome_visit_feedback	en_US	exit	cmivgorqg00009y5iyf5y9s5b	2025-12-07 08:29:36.8	2026-01-08 17:53:46.896	default
cmj7foz0100019ys0jx2zd05y	Digital Enquiry	906197139247940	digital_enquiry_reply_temp_updated1	en_US	digital_enquiry	cmivgorqg00009y5iyf5y9s5b	2025-12-15 17:34:57.073	2026-01-08 17:54:16.99	digital_enquiry
cmivgoujk00049y5i8i0amwz3	Test Drive Follow-up	1426745462783971	test_drive_feedback_temp	en_US	test_drive	cmivgorqg00009y5iyf5y9s5b	2025-12-07 08:29:36.8	2025-12-15 17:09:12.513	default
cmjb4r6lo00059y55kbpw1ozn	Delivery Completion	1386651019021695	delivery_notify_2_updated	en_US	delivery_completion	cmivgorqg00009y5iyf5y9s5b	2025-12-18 07:39:49.164	2025-12-23 18:04:01.43	delivery_update
cmj39r9wl00019yzy4il1210w	Delivery Reminder	854907410836364	delivery_notify_1_updated	en_US	delivery_reminder	cmivgorqg00009y5iyf5y9s5b	2025-12-12 19:37:42.116	2025-12-30 16:42:36.039	delivery_update
cmjvhls4t00019y9iqve59x6x	Field Inquiry			en_US	field_inquiry	cmivgorqg00009y5iyf5y9s5b	2026-01-01 13:34:55.661	2026-01-01 13:34:55.661	field_inquiry
cmk13jolu0001js04e9dmeen5	Field Inquiry			en_US	field_inquiry	cmk130qz40000l704z6fc2alp	2026-01-05 11:48:00.21	2026-01-05 11:48:00.21	field_inquiry
cmk130t1a0004l7047cbfjf3z	Test Drive Follow-up	1426745462783971	test_drive_feedback_temp	en_US	test_drive	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-05 12:05:21.779	global
cmk130t1a0005l704gpcvzuo1	Exit Thank You	1614441933012020	welcome_visit_feedback	en_US	exit	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-05 12:06:32.502	global
cmk130t1a0006l704puhu037g	Delivery Reminder	854907410836364	delivery_notify_1_updated	en_US	delivery_reminder	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-05 12:07:47.67	delivery_update
cmk130t1a0008l704clon3csp	Delivery Completion	1386651019021695	delivery_notify_2_updated	en_US	delivery_completion	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-05 12:08:17.774	delivery_update
cmk130t1a0003l704jxxl9792	Welcome Message	25870530502583482	welcome_msg_temp_updated	en_US	welcome	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-07 04:13:52.311	global
cmk130t1a0007l7045upah28m	Digital Enquiry Notification	906197139247940	digital_enquiry_reply_temp_updated1	en_US	digital_enquiry	cmk130qz40000l704z6fc2alp	2026-01-05 11:33:19.486	2026-01-07 04:40:55.932	digital_enquiry
\.


--
-- Name: Dealership Dealership_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Dealership"
    ADD CONSTRAINT "Dealership_pkey" PRIMARY KEY (id);


--
-- Name: DeliveryTicket DeliveryTicket_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DeliveryTicket"
    ADD CONSTRAINT "DeliveryTicket_pkey" PRIMARY KEY (id);


--
-- Name: DigitalEnquirySession DigitalEnquirySession_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DigitalEnquirySession"
    ADD CONSTRAINT "DigitalEnquirySession_pkey" PRIMARY KEY (id);


--
-- Name: DigitalEnquiry DigitalEnquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DigitalEnquiry"
    ADD CONSTRAINT "DigitalEnquiry_pkey" PRIMARY KEY (id);


--
-- Name: FieldInquirySession FieldInquirySession_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."FieldInquirySession"
    ADD CONSTRAINT "FieldInquirySession_pkey" PRIMARY KEY (id);


--
-- Name: FieldInquiry FieldInquiry_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."FieldInquiry"
    ADD CONSTRAINT "FieldInquiry_pkey" PRIMARY KEY (id);


--
-- Name: LeadSource LeadSource_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LeadSource"
    ADD CONSTRAINT "LeadSource_pkey" PRIMARY KEY (id);


--
-- Name: ScheduledMessage ScheduledMessage_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ScheduledMessage"
    ADD CONSTRAINT "ScheduledMessage_pkey" PRIMARY KEY (id);


--
-- Name: TestDrive TestDrive_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TestDrive"
    ADD CONSTRAINT "TestDrive_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: VehicleCategory VehicleCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VehicleCategory"
    ADD CONSTRAINT "VehicleCategory_pkey" PRIMARY KEY (id);


--
-- Name: VehicleModel VehicleModel_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VehicleModel"
    ADD CONSTRAINT "VehicleModel_pkey" PRIMARY KEY (id);


--
-- Name: VehicleVariant VehicleVariant_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VehicleVariant"
    ADD CONSTRAINT "VehicleVariant_pkey" PRIMARY KEY (id);


--
-- Name: VisitorInterest VisitorInterest_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VisitorInterest"
    ADD CONSTRAINT "VisitorInterest_pkey" PRIMARY KEY (id);


--
-- Name: VisitorSession VisitorSession_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VisitorSession"
    ADD CONSTRAINT "VisitorSession_pkey" PRIMARY KEY (id);


--
-- Name: Visitor Visitor_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Visitor"
    ADD CONSTRAINT "Visitor_pkey" PRIMARY KEY (id);


--
-- Name: WhatsAppTemplate WhatsAppTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."WhatsAppTemplate"
    ADD CONSTRAINT "WhatsAppTemplate_pkey" PRIMARY KEY (id);


--
-- Name: DeliveryTicket_dealershipId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DeliveryTicket_dealershipId_idx" ON public."DeliveryTicket" USING btree ("dealershipId");


--
-- Name: DeliveryTicket_deliveryDate_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DeliveryTicket_deliveryDate_idx" ON public."DeliveryTicket" USING btree ("deliveryDate");


--
-- Name: DeliveryTicket_modelId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DeliveryTicket_modelId_idx" ON public."DeliveryTicket" USING btree ("modelId");


--
-- Name: DeliveryTicket_whatsappNumber_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DeliveryTicket_whatsappNumber_idx" ON public."DeliveryTicket" USING btree ("whatsappNumber");


--
-- Name: DigitalEnquirySession_digitalEnquiryId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DigitalEnquirySession_digitalEnquiryId_idx" ON public."DigitalEnquirySession" USING btree ("digitalEnquiryId");


--
-- Name: DigitalEnquirySession_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DigitalEnquirySession_status_idx" ON public."DigitalEnquirySession" USING btree (status);


--
-- Name: DigitalEnquiry_dealershipId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DigitalEnquiry_dealershipId_idx" ON public."DigitalEnquiry" USING btree ("dealershipId");


--
-- Name: DigitalEnquiry_leadSourceId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DigitalEnquiry_leadSourceId_idx" ON public."DigitalEnquiry" USING btree ("leadSourceId");


--
-- Name: DigitalEnquiry_whatsappNumber_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "DigitalEnquiry_whatsappNumber_idx" ON public."DigitalEnquiry" USING btree ("whatsappNumber");


--
-- Name: FieldInquirySession_fieldInquiryId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "FieldInquirySession_fieldInquiryId_idx" ON public."FieldInquirySession" USING btree ("fieldInquiryId");


--
-- Name: FieldInquirySession_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "FieldInquirySession_status_idx" ON public."FieldInquirySession" USING btree (status);


--
-- Name: FieldInquiry_dealershipId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "FieldInquiry_dealershipId_idx" ON public."FieldInquiry" USING btree ("dealershipId");


--
-- Name: FieldInquiry_leadSourceId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "FieldInquiry_leadSourceId_idx" ON public."FieldInquiry" USING btree ("leadSourceId");


--
-- Name: FieldInquiry_whatsappNumber_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "FieldInquiry_whatsappNumber_idx" ON public."FieldInquiry" USING btree ("whatsappNumber");


--
-- Name: LeadSource_dealershipId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "LeadSource_dealershipId_idx" ON public."LeadSource" USING btree ("dealershipId");


--
-- Name: LeadSource_dealershipId_name_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "LeadSource_dealershipId_name_key" ON public."LeadSource" USING btree ("dealershipId", name);


--
-- Name: ScheduledMessage_deliveryTicketId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ScheduledMessage_deliveryTicketId_idx" ON public."ScheduledMessage" USING btree ("deliveryTicketId");


--
-- Name: ScheduledMessage_scheduledFor_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ScheduledMessage_scheduledFor_idx" ON public."ScheduledMessage" USING btree ("scheduledFor");


--
-- Name: ScheduledMessage_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "ScheduledMessage_status_idx" ON public."ScheduledMessage" USING btree (status);


--
-- Name: TestDrive_modelId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TestDrive_modelId_idx" ON public."TestDrive" USING btree ("modelId");


--
-- Name: TestDrive_sessionId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TestDrive_sessionId_idx" ON public."TestDrive" USING btree ("sessionId");


--
-- Name: TestDrive_variantId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "TestDrive_variantId_idx" ON public."TestDrive" USING btree ("variantId");


--
-- Name: User_dealershipId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "User_dealershipId_idx" ON public."User" USING btree ("dealershipId");


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: VehicleCategory_dealershipId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VehicleCategory_dealershipId_idx" ON public."VehicleCategory" USING btree ("dealershipId");


--
-- Name: VehicleCategory_dealershipId_name_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "VehicleCategory_dealershipId_name_key" ON public."VehicleCategory" USING btree ("dealershipId", name);


--
-- Name: VehicleModel_categoryId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VehicleModel_categoryId_idx" ON public."VehicleModel" USING btree ("categoryId");


--
-- Name: VehicleVariant_modelId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VehicleVariant_modelId_idx" ON public."VehicleVariant" USING btree ("modelId");


--
-- Name: VehicleVariant_modelId_name_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "VehicleVariant_modelId_name_key" ON public."VehicleVariant" USING btree ("modelId", name);


--
-- Name: VisitorInterest_modelId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VisitorInterest_modelId_idx" ON public."VisitorInterest" USING btree ("modelId");


--
-- Name: VisitorInterest_sessionId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VisitorInterest_sessionId_idx" ON public."VisitorInterest" USING btree ("sessionId");


--
-- Name: VisitorInterest_variantId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VisitorInterest_variantId_idx" ON public."VisitorInterest" USING btree ("variantId");


--
-- Name: VisitorInterest_visitorId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VisitorInterest_visitorId_idx" ON public."VisitorInterest" USING btree ("visitorId");


--
-- Name: VisitorInterest_visitorId_modelId_variantId_sessionId_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "VisitorInterest_visitorId_modelId_variantId_sessionId_key" ON public."VisitorInterest" USING btree ("visitorId", "modelId", "variantId", "sessionId");


--
-- Name: VisitorSession_status_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VisitorSession_status_idx" ON public."VisitorSession" USING btree (status);


--
-- Name: VisitorSession_visitorId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "VisitorSession_visitorId_idx" ON public."VisitorSession" USING btree ("visitorId");


--
-- Name: Visitor_dealershipId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Visitor_dealershipId_idx" ON public."Visitor" USING btree ("dealershipId");


--
-- Name: Visitor_whatsappNumber_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "Visitor_whatsappNumber_idx" ON public."Visitor" USING btree ("whatsappNumber");


--
-- Name: WhatsAppTemplate_dealershipId_idx; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE INDEX "WhatsAppTemplate_dealershipId_idx" ON public."WhatsAppTemplate" USING btree ("dealershipId");


--
-- Name: WhatsAppTemplate_dealershipId_type_section_key; Type: INDEX; Schema: public; Owner: neondb_owner
--

CREATE UNIQUE INDEX "WhatsAppTemplate_dealershipId_type_section_key" ON public."WhatsAppTemplate" USING btree ("dealershipId", type, section);


--
-- Name: DeliveryTicket DeliveryTicket_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DeliveryTicket"
    ADD CONSTRAINT "DeliveryTicket_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DeliveryTicket DeliveryTicket_modelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DeliveryTicket"
    ADD CONSTRAINT "DeliveryTicket_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DeliveryTicket DeliveryTicket_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DeliveryTicket"
    ADD CONSTRAINT "DeliveryTicket_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public."VehicleVariant"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DigitalEnquirySession DigitalEnquirySession_digitalEnquiryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DigitalEnquirySession"
    ADD CONSTRAINT "DigitalEnquirySession_digitalEnquiryId_fkey" FOREIGN KEY ("digitalEnquiryId") REFERENCES public."DigitalEnquiry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DigitalEnquiry DigitalEnquiry_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DigitalEnquiry"
    ADD CONSTRAINT "DigitalEnquiry_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DigitalEnquiry DigitalEnquiry_interestedModelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DigitalEnquiry"
    ADD CONSTRAINT "DigitalEnquiry_interestedModelId_fkey" FOREIGN KEY ("interestedModelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DigitalEnquiry DigitalEnquiry_interestedVariantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DigitalEnquiry"
    ADD CONSTRAINT "DigitalEnquiry_interestedVariantId_fkey" FOREIGN KEY ("interestedVariantId") REFERENCES public."VehicleVariant"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DigitalEnquiry DigitalEnquiry_leadSourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."DigitalEnquiry"
    ADD CONSTRAINT "DigitalEnquiry_leadSourceId_fkey" FOREIGN KEY ("leadSourceId") REFERENCES public."LeadSource"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FieldInquirySession FieldInquirySession_fieldInquiryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."FieldInquirySession"
    ADD CONSTRAINT "FieldInquirySession_fieldInquiryId_fkey" FOREIGN KEY ("fieldInquiryId") REFERENCES public."FieldInquiry"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FieldInquiry FieldInquiry_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."FieldInquiry"
    ADD CONSTRAINT "FieldInquiry_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: FieldInquiry FieldInquiry_interestedModelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."FieldInquiry"
    ADD CONSTRAINT "FieldInquiry_interestedModelId_fkey" FOREIGN KEY ("interestedModelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FieldInquiry FieldInquiry_interestedVariantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."FieldInquiry"
    ADD CONSTRAINT "FieldInquiry_interestedVariantId_fkey" FOREIGN KEY ("interestedVariantId") REFERENCES public."VehicleVariant"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: FieldInquiry FieldInquiry_leadSourceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."FieldInquiry"
    ADD CONSTRAINT "FieldInquiry_leadSourceId_fkey" FOREIGN KEY ("leadSourceId") REFERENCES public."LeadSource"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: LeadSource LeadSource_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."LeadSource"
    ADD CONSTRAINT "LeadSource_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: ScheduledMessage ScheduledMessage_deliveryTicketId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."ScheduledMessage"
    ADD CONSTRAINT "ScheduledMessage_deliveryTicketId_fkey" FOREIGN KEY ("deliveryTicketId") REFERENCES public."DeliveryTicket"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestDrive TestDrive_modelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TestDrive"
    ADD CONSTRAINT "TestDrive_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestDrive TestDrive_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TestDrive"
    ADD CONSTRAINT "TestDrive_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."VisitorSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TestDrive TestDrive_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."TestDrive"
    ADD CONSTRAINT "TestDrive_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public."VehicleVariant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: User User_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: VehicleCategory VehicleCategory_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VehicleCategory"
    ADD CONSTRAINT "VehicleCategory_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VehicleModel VehicleModel_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VehicleModel"
    ADD CONSTRAINT "VehicleModel_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public."VehicleCategory"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VehicleVariant VehicleVariant_modelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VehicleVariant"
    ADD CONSTRAINT "VehicleVariant_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisitorInterest VisitorInterest_modelId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VisitorInterest"
    ADD CONSTRAINT "VisitorInterest_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES public."VehicleModel"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisitorInterest VisitorInterest_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VisitorInterest"
    ADD CONSTRAINT "VisitorInterest_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."VisitorSession"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisitorInterest VisitorInterest_variantId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VisitorInterest"
    ADD CONSTRAINT "VisitorInterest_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES public."VehicleVariant"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisitorInterest VisitorInterest_visitorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VisitorInterest"
    ADD CONSTRAINT "VisitorInterest_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES public."Visitor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: VisitorSession VisitorSession_visitorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."VisitorSession"
    ADD CONSTRAINT "VisitorSession_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES public."Visitor"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Visitor Visitor_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."Visitor"
    ADD CONSTRAINT "Visitor_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: WhatsAppTemplate WhatsAppTemplate_dealershipId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public."WhatsAppTemplate"
    ADD CONSTRAINT "WhatsAppTemplate_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES public."Dealership"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

\unrestrict kpat3eK88YlBlHsuFN5wEbnRZvd8pFbfSRzGM3wI9h4qTwbCYkCwoY4Z1cC3uie

