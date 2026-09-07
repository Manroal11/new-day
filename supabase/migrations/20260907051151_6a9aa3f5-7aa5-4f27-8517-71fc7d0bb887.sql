-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor');
$$;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- Bootstrap: the first signed-up user becomes admin
CREATE OR REPLACE FUNCTION public.grant_first_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_grant_admin
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.grant_first_admin();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Projects
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  location text NOT NULL DEFAULT '',
  project_date date,
  summary text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  category text NOT NULL DEFAULT 'Community',
  status text NOT NULL DEFAULT 'Planning',
  image_url text,
  featured boolean NOT NULL DEFAULT false,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.projects TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published projects" ON public.projects FOR SELECT USING (published);
CREATE POLICY "Admins can view all projects" ON public.projects FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Outreach
CREATE TABLE public.outreach (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  location text NOT NULL DEFAULT '',
  activity_date date,
  description text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  people_reached integer,
  photos text[] NOT NULL DEFAULT '{}',
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.outreach TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.outreach TO authenticated;
GRANT ALL ON public.outreach TO service_role;
ALTER TABLE public.outreach ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published outreach" ON public.outreach FOR SELECT USING (published);
CREATE POLICY "Admins can view all outreach" ON public.outreach FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage outreach" ON public.outreach FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER outreach_updated_at BEFORE UPDATE ON public.outreach FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Announcements
CREATE TABLE public.announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  summary text NOT NULL DEFAULT '',
  content text NOT NULL DEFAULT '',
  image_url text,
  publish_date date NOT NULL DEFAULT current_date,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.announcements TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.announcements TO authenticated;
GRANT ALL ON public.announcements TO service_role;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published announcements" ON public.announcements FOR SELECT USING (published);
CREATE POLICY "Admins can view all announcements" ON public.announcements FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage announcements" ON public.announcements FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER announcements_updated_at BEFORE UPDATE ON public.announcements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Upcoming activities
CREATE TABLE public.upcoming_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  location text NOT NULL DEFAULT '',
  expected_date text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  participation text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Planning',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.upcoming_activities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.upcoming_activities TO authenticated;
GRANT ALL ON public.upcoming_activities TO service_role;
ALTER TABLE public.upcoming_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view published upcoming" ON public.upcoming_activities FOR SELECT USING (published);
CREATE POLICY "Admins can view all upcoming" ON public.upcoming_activities FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can manage upcoming" ON public.upcoming_activities FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER upcoming_updated_at BEFORE UPDATE ON public.upcoming_activities FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Impact stats
CREATE TABLE public.impact_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  value text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.impact_stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impact_stats TO authenticated;
GRANT ALL ON public.impact_stats TO service_role;
ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view impact stats" ON public.impact_stats FOR SELECT USING (true);
CREATE POLICY "Admins can manage impact stats" ON public.impact_stats FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER impact_updated_at BEFORE UPDATE ON public.impact_stats FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.contact_messages TO anon;
GRANT SELECT, INSERT, DELETE ON public.contact_messages TO authenticated;
GRANT ALL ON public.contact_messages TO service_role;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can send a message" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read messages" ON public.contact_messages FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete messages" ON public.contact_messages FOR DELETE TO authenticated USING (public.is_admin());

-- Newsletter
CREATE TABLE public.newsletter_subscribers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.newsletter_subscribers TO anon;
GRANT SELECT, INSERT, DELETE ON public.newsletter_subscribers TO authenticated;
GRANT ALL ON public.newsletter_subscribers TO service_role;
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read subscribers" ON public.newsletter_subscribers FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can delete subscribers" ON public.newsletter_subscribers FOR DELETE TO authenticated USING (public.is_admin());

-- Seed content (placeholder)
INSERT INTO public.impact_stats (label, value, sort_order) VALUES
  ('People Reached', '500+', 1),
  ('Training Sessions', '20+', 2),
  ('Community Projects', '10+', 3),
  ('Strategic Partners', '5+', 4);

INSERT INTO public.projects (title, slug, location, project_date, summary, content, category, status, image_url, featured, published) VALUES
  ('Community Vegetable Garden', 'community-vegetable-garden', 'Arusha, Tanzania', '2026-03-10', 'Supporting a community group to establish sustainable vegetable production for food security and income.', 'A community group was supported with training, seeds and tools to establish a shared vegetable production plot. The group now sells surplus produce at local markets and reinvests income into the next planting season.', 'Community', 'Completed', '/images/project-garden.jpg', true, true),
  ('Youth Digital Lab', 'youth-digital-lab', 'Dodoma, Tanzania', '2026-06-01', 'Introducing young people to digital tools, online work and small-scale e-commerce.', 'A practical digital lab where young people learn computer basics, online services and how to find digital work opportunities.', 'Digital', 'In Progress', '/images/project-digital.jpg', false, true),
  ('Tailoring & Textiles Cooperative', 'tailoring-textiles-cooperative', 'Moshi, Tanzania', '2026-09-01', 'A cooperative training in garment making to open retail and income opportunities.', 'Members receive vocational training in garment making and business basics, then work together as a cooperative to reach local retail markets.', 'Skills', 'Planning', '/images/project-tailoring.jpg', false, true);

INSERT INTO public.outreach (title, slug, location, activity_date, description, content, people_reached, photos, published) VALUES
  ('Community Financial Literacy Workshop', 'financial-literacy-workshop', 'Moshi, Tanzania', '2026-05-18', 'A practical workshop on saving, budgeting and building household financial confidence.', 'Participants worked through household budgeting, saving groups and simple record keeping for small businesses.', 42, ARRAY['/images/outreach-finance.jpg'], true),
  ('Youth Entrepreneurship Session', 'youth-entrepreneurship-session', 'Arusha, Tanzania', '2026-04-22', 'Young people explored business ideas, planning and how to start small with what they already have.', 'An interactive session where young people pitched ideas and received mentorship on getting started.', 65, ARRAY['/images/outreach-youth.jpg'], true),
  ('Agricultural Training Visit', 'agricultural-training-visit', 'Iringa, Tanzania', '2026-03-30', 'Hands-on sustainable farming methods to improve yield and local food security.', 'Farmers learned soil preparation, spacing and water-saving techniques directly in the field.', 38, ARRAY['/images/outreach-agri.jpg'], true);

INSERT INTO public.announcements (title, slug, summary, content, image_url, publish_date, published) VALUES
  ('New Day welcomes a new community partner', 'new-community-partner', 'We are beginning a partnership to expand skills training in the region.', 'This partnership will allow New Day to reach more participants with practical skills training over the coming year.', '/images/outreach-youth.jpg', '2026-06-02', true),
  ('Volunteer opportunities now open', 'volunteer-opportunities-open', 'We are looking for trainers, mentors and organisers to join upcoming programs.', 'If you have skills to share in teaching, business mentorship, agriculture or digital tools, we would love to hear from you.', NULL, '2026-05-12', true);

INSERT INTO public.upcoming_activities (title, slug, location, expected_date, description, participation, status, sort_order, published) VALUES
  ('Youth Digital Skills Program', 'youth-digital-skills-program', 'Arusha, Tanzania', 'October 2026', 'A practical digital skills program introducing young people to digital tools, entrepreneurship and online opportunities.', 'Open to young people aged 16-30. Register your interest through the contact form.', 'Planning', 1, true),
  ('Financial Literacy Workshop', 'financial-literacy-workshop-upcoming', 'Moshi, Tanzania', 'November 2026', 'A community workshop on saving, credit and building household financial confidence.', 'Community groups can request a session for their members.', 'Upcoming', 2, true),
  ('Agricultural Training Visit', 'agricultural-training-visit-upcoming', 'Iringa, Tanzania', 'December 2026', 'Hands-on sustainable farming methods to boost yield and local food security.', 'Farming groups and volunteers with agricultural experience are welcome.', 'Upcoming', 3, true);