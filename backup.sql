--
-- PostgreSQL database dump
--

\restrict zXcE9cdadsAHidXe3dEYRbk6Y9MVk6QmXssZHsKpmMdh37P5OgqlWHajCdTXZNN

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

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
-- Name: admin_login_otps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_login_otps (
    id uuid NOT NULL,
    username character varying(100) NOT NULL,
    hashed_otp text NOT NULL,
    ip_address character varying(50),
    user_agent text,
    expires_at timestamp without time zone NOT NULL,
    consumed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.admin_login_otps OWNER TO postgres;

--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    hashed_password text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.admin_users OWNER TO postgres;

--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admin_users_id_seq OWNER TO postgres;

--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    event_category character varying(20) NOT NULL,
    admin_username character varying(100),
    action character varying(50) NOT NULL,
    section character varying(100),
    old_value jsonb,
    new_value jsonb,
    ip_address character varying(50),
    user_agent text,
    status character varying(20),
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: portfolio_backups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_backups (
    id integer NOT NULL,
    section_name character varying(100),
    snapshot jsonb NOT NULL,
    saved_by character varying(100),
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.portfolio_backups OWNER TO postgres;

--
-- Name: portfolio_backups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.portfolio_backups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portfolio_backups_id_seq OWNER TO postgres;

--
-- Name: portfolio_backups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.portfolio_backups_id_seq OWNED BY public.portfolio_backups.id;


--
-- Name: portfolio_sections; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portfolio_sections (
    id integer NOT NULL,
    section_name character varying(100) NOT NULL,
    content jsonb NOT NULL,
    updated_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.portfolio_sections OWNER TO postgres;

--
-- Name: portfolio_sections_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.portfolio_sections_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portfolio_sections_id_seq OWNER TO postgres;

--
-- Name: portfolio_sections_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.portfolio_sections_id_seq OWNED BY public.portfolio_sections.id;


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: portfolio_backups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_backups ALTER COLUMN id SET DEFAULT nextval('public.portfolio_backups_id_seq'::regclass);


--
-- Name: portfolio_sections id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_sections ALTER COLUMN id SET DEFAULT nextval('public.portfolio_sections_id_seq'::regclass);


--
-- Data for Name: admin_login_otps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_login_otps (id, username, hashed_otp, ip_address, user_agent, expires_at, consumed_at, created_at) FROM stdin;
0a7e210f-d272-42c2-bc26-ef9922655dca	sampc4469@gmail.com	$2b$12$E3fjEh2WhKnHkK26oBth2uUAJbzSHyYsPk9Lprli9qh5Pmr4q6RSC	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-06-12 01:15:47.193	2026-06-12 01:07:19.044185	2026-06-12 01:05:47.194779
\.


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin_users (id, username, hashed_password, created_at) FROM stdin;
1	sampc4469@gmail.com	$2b$12$.W5qWwVI7s8KqTHTFoe0N.GXUZHxa.TmQNSX.MXKJBm14m5pEnb5m	2026-06-11 20:52:19.53411
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, event_category, admin_username, action, section, old_value, new_value, ip_address, user_agent, status, "timestamp") FROM stdin;
1	ACCESS	sampc4469@gmail.com	LOGIN_SUCCESS	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-11 20:58:16.416778
2	ACCESS	sampc4469@gmail.com	LOGOUT	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-11 21:58:46.436171
3	ACCESS	sampc4469@gmail.com	LOGIN_SUCCESS	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-11 21:59:11.783092
4	ACTION	sampc4469@gmail.com	UPDATE	skills	[{"id": 1, "icon": "fa-desktop", "name": "IT Support & Troubleshooting", "level": 85, "category": "IT Support"}, {"id": 2, "icon": "fa-users", "name": "Active Directory", "level": 75, "category": "IT Support"}, {"id": 3, "icon": "fa-network-wired", "name": "Networking (TCP/IP, DNS, DHCP)", "level": 80, "category": "Networking"}, {"id": 4, "icon": "fa-windows", "name": "Windows & macOS", "level": 85, "category": "Operating Systems"}, {"id": 5, "icon": "fa-microsoft", "name": "Microsoft 365", "level": 80, "category": "Software"}, {"id": 6, "icon": "fa-code", "name": "HTML/CSS", "level": 70, "category": "Development"}, {"id": 7, "icon": "fa-puzzle-piece", "name": "Problem Solving", "level": 90, "category": "Soft Skills"}, {"id": 8, "icon": "fa-comments", "name": "Communication", "level": 85, "category": "Soft Skills"}]	[{"id": 1, "icon": "fa-desktop", "name": "IT Support & Troubleshooting", "level": 85, "category": "IT Support"}, {"id": 2, "icon": "fa-users", "name": "Active Directory", "level": 75, "category": "IT Support"}, {"id": 3, "icon": "fa-network-wired", "name": "Networking (TCP/IP, DNS, DHCP)", "level": 80, "category": "Networking"}, {"id": 4, "icon": "fa-windows", "name": "Windows & macOS", "level": 85, "category": "Operating Systems"}, {"id": 5, "icon": "fa-microsoft", "name": "Microsoft 365", "level": 80, "category": "Software"}, {"id": 6, "icon": "fa-code", "name": "HTML/CSS", "level": 70, "category": "Development"}, {"id": 7, "icon": "fa-puzzle-piece", "name": "Problem Solving", "level": 90, "category": "Soft Skills"}, {"id": 8, "icon": "fa-comments", "name": "Communication", "level": 85, "category": "Soft Skills"}, {"id": 1781204437328, "icon": "fa-cloud", "name": "Graphics Design", "level": "75", "category": "Soft Skills"}]	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-11 22:00:38.599865
5	ACCESS	sampc4469@gmail.com	LOGOUT	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-11 22:31:02.931299
6	ACCESS	sampc4469@gmail.com	LOGIN_SUCCESS	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-11 22:31:23.392836
7	ACCESS	sampc4469@gmail.com	LOGOUT	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-11 23:51:53.584761
8	ACCESS	sampc4469@gmail.com	LOGIN_SUCCESS	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-11 23:52:16.443804
9	ACCESS	sampc4469@gmail.com	LOGOUT	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-12 01:04:54.982885
10	ACCESS	sampc4469@gmail.com	LOGIN_FAIL	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	FAILURE	2026-06-12 01:05:16.783599
11	ACCESS	sampc4469@gmail.com	LOGIN_FAIL	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	FAILURE	2026-06-12 01:05:30.446782
12	ACCESS	sampc4469@gmail.com	LOGIN_OTP_SENT	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-12 01:05:49.802586
13	ACCESS	sampc4469@gmail.com	LOGIN_SUCCESS	\N	\N	\N	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-12 01:07:19.553639
14	ACTION	sampc4469@gmail.com	UPDATE	personalInfo	{"name": "Samuel Mwambua Mbai", "about": "I'm a passionate ICT graduate from JOOUST with a strong foundation in IT support, networking, and problem-solving. I thrive on leveraging technology to create efficient solutions and am committed to continuous learning. Currently seeking opportunities in IT support and helpdesk roles where I can contribute my skills and grow professionally.", "email": "samuel.mbai@example.com", "phone": "+254 700 000 000", "title": "BSc. ICT Graduate", "github": "https://github.com/samuelmbai", "tagline": "IT Support Specialist | Tech Enthusiast | Problem Solver", "funFacts": [{"icon": "fa-location-dot", "text": "Based in Nairobi"}, {"icon": "fa-graduation-cap", "text": "JOOUST Finalist"}, {"icon": "fa-briefcase", "text": "Open to Work"}, {"icon": "fa-mug-hot", "text": "Powered by Coffee"}], "linkedin": "https://linkedin.com/in/samuel-mbai", "location": "Nairobi, Kenya"}	{"name": "Samuel Mwambua Mbai", "about": "I'm a passionate ICT graduate from JOOUST with a strong foundation in IT support, networking, and problem-solving. I thrive on leveraging technology to create efficient solutions and am committed to continuous learning. Currently seeking opportunities in IT support and helpdesk roles where I can contribute my skills and grow professionally.", "email": "sampc4469@gmail.com", "phone": "+254 110 628 046", "title": "BSc. ICT Graduate", "github": "https://github.com/Sam44IT", "tagline": "IT Support Specialist | Tech Enthusiast | Problem Solver", "funFacts": [{"icon": "fa-location-dot", "text": "Based in Nairobi"}, {"icon": "fa-graduation-cap", "text": "JOOUST Finalist"}, {"icon": "fa-briefcase", "text": "Open to Work"}, {"icon": "fa-mug-hot", "text": "Powered by Coffee"}], "linkedin": "https://www.linkedin.com/in/sam-mwambua/", "location": "Nairobi, Kenya"}	::1	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	SUCCESS	2026-06-12 01:09:22.620253
\.


--
-- Data for Name: portfolio_backups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolio_backups (id, section_name, snapshot, saved_by, created_at) FROM stdin;
1	skills	[{"id": 1, "icon": "fa-desktop", "name": "IT Support & Troubleshooting", "level": 85, "category": "IT Support"}, {"id": 2, "icon": "fa-users", "name": "Active Directory", "level": 75, "category": "IT Support"}, {"id": 3, "icon": "fa-network-wired", "name": "Networking (TCP/IP, DNS, DHCP)", "level": 80, "category": "Networking"}, {"id": 4, "icon": "fa-windows", "name": "Windows & macOS", "level": 85, "category": "Operating Systems"}, {"id": 5, "icon": "fa-microsoft", "name": "Microsoft 365", "level": 80, "category": "Software"}, {"id": 6, "icon": "fa-code", "name": "HTML/CSS", "level": 70, "category": "Development"}, {"id": 7, "icon": "fa-puzzle-piece", "name": "Problem Solving", "level": 90, "category": "Soft Skills"}, {"id": 8, "icon": "fa-comments", "name": "Communication", "level": 85, "category": "Soft Skills"}]	sampc4469@gmail.com	2026-06-11 22:00:38.599865
2	personalInfo	{"name": "Samuel Mwambua Mbai", "about": "I'm a passionate ICT graduate from JOOUST with a strong foundation in IT support, networking, and problem-solving. I thrive on leveraging technology to create efficient solutions and am committed to continuous learning. Currently seeking opportunities in IT support and helpdesk roles where I can contribute my skills and grow professionally.", "email": "samuel.mbai@example.com", "phone": "+254 700 000 000", "title": "BSc. ICT Graduate", "github": "https://github.com/samuelmbai", "tagline": "IT Support Specialist | Tech Enthusiast | Problem Solver", "funFacts": [{"icon": "fa-location-dot", "text": "Based in Nairobi"}, {"icon": "fa-graduation-cap", "text": "JOOUST Finalist"}, {"icon": "fa-briefcase", "text": "Open to Work"}, {"icon": "fa-mug-hot", "text": "Powered by Coffee"}], "linkedin": "https://linkedin.com/in/samuel-mbai", "location": "Nairobi, Kenya"}	sampc4469@gmail.com	2026-06-12 01:09:22.620253
\.


--
-- Data for Name: portfolio_sections; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portfolio_sections (id, section_name, content, updated_at) FROM stdin;
3	education	[{"id": 1, "degree": "Bachelor of Science in Information Communication Technology", "period": "2022 - 2026", "courses": ["Network Administration", "IT Support Fundamentals", "Database Management", "Web Technologies"], "description": "Focus on IT Support, Networking, and Systems Administration", "institution": "Jaramogi Oginga Odinga University of Science and Technology (JOOUST)"}]	2026-06-11 21:53:45.678539
4	experience	[{"id": 1, "role": "ICT Intern", "type": "Internship", "period": "2025 - Present", "company": "JOOUST - School of Informatics", "skillsGained": ["Helpdesk Support", "Hardware Troubleshooting", "Customer Service"], "responsibilities": ["Provided technical support to 200+ students and staff members", "Troubleshot hardware and software issues across Windows and macOS", "Assisted in network maintenance and user account management", "Documented IT procedures and created user guides"]}]	2026-06-11 21:53:45.681314
5	projects	[{"id": 1, "title": "Student IT Support Portal", "category": "Academic", "liveDemo": "#", "techStack": ["HTML", "CSS", "JavaScript", "LocalStorage"], "githubLink": "https://github.com/samuelmbai/support-portal", "description": "A web-based ticketing system for students to request IT support"}, {"id": 2, "title": "Network Monitoring Dashboard", "category": "Academic", "liveDemo": "#", "techStack": ["Python", "Flask", "Socket.io"], "githubLink": "https://github.com/samuelmbai/network-monitor", "description": "Simple dashboard to monitor network devices and alerts"}]	2026-06-11 21:53:45.684872
6	certifications	[{"id": 1, "date": "2024", "name": "Google IT Support Professional Certificate", "issuer": "Google", "badgeUrl": "#", "verifyUrl": "#"}, {"id": 2, "date": "2024", "name": "Cisco Networking Basics", "issuer": "Cisco", "badgeUrl": "#", "verifyUrl": "#"}]	2026-06-11 21:53:45.687716
7	volunteer	[{"id": 1, "role": "Volunteer IT Assistant", "impact": "Helped set up computer labs in 3 local schools", "period": "2024 - Present", "skills": ["Basic Networking", "Computer Setup", "Training"], "organization": "Tech Community Kenya"}]	2026-06-11 21:53:45.689837
8	hobbies	[{"id": 1, "icon": "fa-gamepad", "name": "Gaming", "description": "Strategy & RPG games"}, {"id": 2, "icon": "fa-blog", "name": "Tech Blogging", "description": "Writing about IT trends"}, {"id": 3, "icon": "fa-futbol", "name": "Football", "description": "Local league player"}, {"id": 4, "icon": "fa-headphones", "name": "Music", "description": "Afrobeat & Hip-Hop"}]	2026-06-11 21:53:45.692814
2	skills	[{"id": 1, "icon": "fa-desktop", "name": "IT Support & Troubleshooting", "level": 85, "category": "IT Support"}, {"id": 2, "icon": "fa-users", "name": "Active Directory", "level": 75, "category": "IT Support"}, {"id": 3, "icon": "fa-network-wired", "name": "Networking (TCP/IP, DNS, DHCP)", "level": 80, "category": "Networking"}, {"id": 4, "icon": "fa-windows", "name": "Windows & macOS", "level": 85, "category": "Operating Systems"}, {"id": 5, "icon": "fa-microsoft", "name": "Microsoft 365", "level": 80, "category": "Software"}, {"id": 6, "icon": "fa-code", "name": "HTML/CSS", "level": 70, "category": "Development"}, {"id": 7, "icon": "fa-puzzle-piece", "name": "Problem Solving", "level": 90, "category": "Soft Skills"}, {"id": 8, "icon": "fa-comments", "name": "Communication", "level": 85, "category": "Soft Skills"}, {"id": 1781204437328, "icon": "fa-cloud", "name": "Graphics Design", "level": "75", "category": "Soft Skills"}]	2026-06-11 22:00:38.599865
1	personalInfo	{"name": "Samuel Mwambua Mbai", "about": "I'm a passionate ICT graduate from JOOUST with a strong foundation in IT support, networking, and problem-solving. I thrive on leveraging technology to create efficient solutions and am committed to continuous learning. Currently seeking opportunities in IT support and helpdesk roles where I can contribute my skills and grow professionally.", "email": "sampc4469@gmail.com", "phone": "+254 110 628 046", "title": "BSc. ICT Graduate", "github": "https://github.com/Sam44IT", "tagline": "IT Support Specialist | Tech Enthusiast | Problem Solver", "funFacts": [{"icon": "fa-location-dot", "text": "Based in Nairobi"}, {"icon": "fa-graduation-cap", "text": "JOOUST Finalist"}, {"icon": "fa-briefcase", "text": "Open to Work"}, {"icon": "fa-mug-hot", "text": "Powered by Coffee"}], "linkedin": "https://www.linkedin.com/in/sam-mwambua/", "location": "Nairobi, Kenya"}	2026-06-12 01:09:22.620253
\.


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 1, true);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 14, true);


--
-- Name: portfolio_backups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.portfolio_backups_id_seq', 2, true);


--
-- Name: portfolio_sections_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.portfolio_sections_id_seq', 32, true);


--
-- Name: admin_login_otps admin_login_otps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_login_otps
    ADD CONSTRAINT admin_login_otps_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_username_key UNIQUE (username);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: portfolio_backups portfolio_backups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_backups
    ADD CONSTRAINT portfolio_backups_pkey PRIMARY KEY (id);


--
-- Name: portfolio_sections portfolio_sections_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_sections
    ADD CONSTRAINT portfolio_sections_pkey PRIMARY KEY (id);


--
-- Name: portfolio_sections portfolio_sections_section_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portfolio_sections
    ADD CONSTRAINT portfolio_sections_section_name_key UNIQUE (section_name);


--
-- Name: idx_admin_login_otps_username_created; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admin_login_otps_username_created ON public.admin_login_otps USING btree (username, created_at DESC);


--
-- Name: idx_audit_logs_event_action; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_event_action ON public.audit_logs USING btree (event_category, action);


--
-- Name: idx_audit_logs_timestamp; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_timestamp ON public.audit_logs USING btree ("timestamp" DESC);


--
-- PostgreSQL database dump complete
--

\unrestrict zXcE9cdadsAHidXe3dEYRbk6Y9MVk6QmXssZHsKpmMdh37P5OgqlWHajCdTXZNN

