# LearnENABLED — Summer Coaching Registration + Admin Dashboard

- `index.html` — the public registration form. Submissions are saved
  straight into a Supabase (Postgres) database.
- `admin.html` — a password-protected page where you can view every
  registration, filter it, and download it as CSV.

No coding needed to set this up — just filling in a few values. All steps
below can be done from your phone browser.

---

## 1. Create your Supabase project

1. Go to https://supabase.com → sign up (free) → **New project**.
2. Give it a name and a database password (save this password somewhere —
   you likely won't need it day-to-day, but keep it safe).
3. Wait ~1 minute for the project to finish setting up.

## 2. Create the database table

1. In your Supabase project, open **SQL Editor** (left sidebar) → **New query**.
2. Open `supabase-schema.sql` (the file I gave you), copy all of it, paste
   it into the SQL editor.
3. Tap **Run**.

This creates a `registrations` table and sets it up so:
- anyone can *submit* a registration (needed for the public form)
- only a *logged-in admin* can *read* the data back (needed for the admin page)

## 3. Get your API keys

1. In Supabase: **Project Settings** (gear icon) → **API**.
2. Copy the **Project URL** and the **anon public** key.
3. Open `config.js` (the file I gave you) and paste them in:

   ```js
   const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
   const SUPABASE_ANON_KEY = "YOUR_ANON_PUBLIC_KEY";
   ```

   The anon key is safe to expose publicly — it's designed for use in
   frontend code like this, and the RLS policies from step 2 control what
   it's actually allowed to do.

## 4. Create your admin login

1. In Supabase: **Authentication** → **Users** → **Add user**.
2. Enter the email and password you want to use to log into `/admin.html`.
3. Set "Auto Confirm User" to on (so you don't need to click a
   confirmation email) if that option appears.

You can add more admin accounts here later the same way — anyone with a
user here can log into the admin dashboard.

## 5. Push everything to GitHub

Upload/update these files in your repo (same "edit → paste → commit"
process as before for existing files; use "Add file → Upload files" for
new ones):

- `index.html` *(updated)*
- `script.js` *(updated)*
- `style.css`
- `config.js` *(new — put your real Supabase URL/key in before uploading)*
- `admin.html` *(new)*
- `admin.css` *(new)*
- `admin.js` *(new)*
- `vercel.json`
- `supabase-schema.sql` *(reference only — doesn't need to be "run" by
  Vercel, it's just there for your records)*

Vercel will auto-redeploy once you commit.

## 6. Try it out

- Visit `your-site.vercel.app` → fill out and submit the form.
- Visit `your-site.vercel.app/admin.html` → log in with the admin account
  from step 4 → you should see the submission appear, with working filters
  and a **Download CSV** button.

---

## Using the admin dashboard

- **Search** — matches against parent name or student name(s).
- **Grade / Curriculum / Class Time filters** — narrow results, combine
  with search as needed.
- **Apply Filters** — runs the filtered query.
- **Clear** — resets all filters and reloads everything.
- **Download CSV** — exports exactly what's currently on screen (i.e. CSV
  respects whatever filters are applied).

## Keeping the admin page private

`admin.html` is reachable by anyone who knows/guesses the URL, but the
data itself is protected by Supabase — without logging in, the page can't
actually read any registrations (blocked by the RLS policy from step 2).
Still, it's worth not linking to `/admin.html` anywhere public.

## Editing fields later

If you add/remove a form field:
1. Add the column in Supabase (**Table Editor** → `registrations` → add column, or write a small `alter table` SQL statement).
2. Add the field to the form in `index.html` + validation in `script.js`'s `validate()` + the `payload` object.
3. Add it to the `COLUMNS` array near the top of `admin.js` so it shows in the dashboard table and CSV export.
