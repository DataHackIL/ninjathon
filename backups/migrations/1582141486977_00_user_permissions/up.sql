CREATE TABLE public.team_members (
    id integer NOT NULL,
    "teamId" integer NOT NULL,
    "userId" integer NOT NULL
);
CREATE TABLE public.teams (
    id integer NOT NULL,
    name text NOT NULL,
    description text NOT NULL
);
CREATE TABLE public.challenges (
    id integer NOT NULL,
    description text NOT NULL,
    "createdByUserId" integer NOT NULL,
    name text
);
CREATE SEQUENCE public.challenges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.challenges_id_seq OWNED BY public.challenges.id;
CREATE SEQUENCE public.team_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.team_id_seq OWNED BY public.teams.id;
CREATE SEQUENCE public.team_members_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.team_members_id_seq OWNED BY public.team_members.id;
CREATE TABLE public.teams_challenges (
    id integer NOT NULL,
    "teamId" integer NOT NULL,
    "challengeId" integer NOT NULL
);
CREATE SEQUENCE public.teams_challenges_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.teams_challenges_id_seq OWNED BY public.teams_challenges.id;
CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role text,
    name text
);
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
ALTER TABLE ONLY public.challenges ALTER COLUMN id SET DEFAULT nextval('public.challenges_id_seq'::regclass);
ALTER TABLE ONLY public.team_members ALTER COLUMN id SET DEFAULT nextval('public.team_members_id_seq'::regclass);
ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.team_id_seq'::regclass);
ALTER TABLE ONLY public.teams_challenges ALTER COLUMN id SET DEFAULT nextval('public.teams_challenges_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT challenges_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.teams
    ADD CONSTRAINT team_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.teams_challenges
    ADD CONSTRAINT teams_challenges_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.challenges
    ADD CONSTRAINT "challenges_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public.teams(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.teams_challenges
    ADD CONSTRAINT "teams_challenges_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES public.challenges(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
ALTER TABLE ONLY public.teams_challenges
    ADD CONSTRAINT "teams_challenges_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public.teams(id) ON UPDATE RESTRICT ON DELETE RESTRICT;
