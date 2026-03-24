# GarrethDeanProductions

Astro site for `GarrethDean.com`, built as the public home for `Garreth Dean Production`.

## Stack

- `Astro 5`
- `React`
- `Supabase`
- `GitHub Pages` for static hosting

## Local Development

Install dependencies and run the site:

```powershell
npm install
npm run dev
```

Open `http://localhost:4321`.

To test the production build:

```powershell
npm run build
npm run preview
```

## Environment Variables

Create a local `.env` file from [.env.example](C:/Users/Garreth/Documents/GitHub/NeonSpires.com/.env.example).

Required values:

```env
PUBLIC_SUPABASE_URL=https://zxrboenwwbrmkwksswji.supabase.co
PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_hNZjQUcZvVs8LhW3zNH79A_8NvfqKXw
```

These are public client-side values. Do not put your service-role key in the website.

## Site Structure

Main pages:

- [src/pages/index.astro](C:/Users/Garreth/Documents/GitHub/NeonSpires.com/src/pages/index.astro)
- [src/pages/games.astro](C:/Users/Garreth/Documents/GitHub/NeonSpires.com/src/pages/games.astro)
- [src/pages/press.astro](C:/Users/Garreth/Documents/GitHub/NeonSpires.com/src/pages/press.astro)
- [src/pages/newsletter.astro](C:/Users/Garreth/Documents/GitHub/NeonSpires.com/src/pages/newsletter.astro)

Supabase-connected frontend pieces:

- [src/components/PressPortal.tsx](C:/Users/Garreth/Documents/GitHub/NeonSpires.com/src/components/PressPortal.tsx)
- [src/components/NewsletterSignup.tsx](C:/Users/Garreth/Documents/GitHub/NeonSpires.com/src/components/NewsletterSignup.tsx)
- [src/lib/supabase.ts](C:/Users/Garreth/Documents/GitHub/NeonSpires.com/src/lib/supabase.ts)

## How Press Works

The press page now uses Supabase Auth and the database.

Current flow:

1. A press user registers on `/press` with email, password, and coverage details.
2. Supabase creates the auth user.
3. A database trigger creates or updates a row in `public.press_profiles`.
4. The user confirms their email through Supabase.
5. The user can sign in on `/press`.
6. Access stays pending until you approve them.
7. When `is_approved = true`, the user can read records from `public.press_assets`.

What the press portal currently supports:

- sign up
- sign in
- forgot password
- password reset
- approved vs pending access state
- protected press asset records through RLS

## How To Approve Press Users

The approval flag lives in:

- `public.press_profiles.is_approved`

You can approve someone in Supabase by updating that field to `true`.

Example SQL:

```sql
update public.press_profiles
set is_approved = true
where email = 'name@outlet.com';
```

After approval, the user can sign in and the protected asset list on `/press` will unlock.

## Press Database Tables

Current tables:

- `public.press_profiles`
- `public.press_assets`
- `public.newsletter_subscribers`

Purpose:

- `press_profiles`: one row per auth user, stores coverage details and approval state
- `press_assets`: press material records shown only to approved users
- `newsletter_subscribers`: email list collected from the website

## Important Press Note

The portal is now real, but the seeded deck links currently point to Google Docs URLs.

That means:

- the portal protects the database records
- but Google Docs sharing rules still control the actual file privacy

If you want truly private decks, screenshots, and files, the next step is:

1. upload press files into private Supabase Storage
2. serve them only to approved users
3. replace public Google Docs links with signed/private asset access

## How Newsletter Signup Works

The newsletter page writes directly to:

- `public.newsletter_subscribers`

Current behavior:

- users submit name and email
- the site inserts the row with `source = 'website'`
- duplicate emails are prevented by a unique constraint

Right now this is a simple owned mailing list database, not a full email campaign system.

If you want to actually send newsletters later, common next steps are:

- keep Supabase as the subscriber source of truth
- connect it to Buttondown, MailerLite, ConvertKit, Resend, or another sending tool
- or build a custom outbound flow with Edge Functions

## Supabase Dashboard Settings You Still Need

In Supabase Auth, set these URLs:

- Site URL:
  - `https://garrethdean.com`
- Additional Redirect URLs:
  - `http://localhost:4321/press`
  - `https://garrethdean.com/press`

If you want password reset and email confirmation to behave correctly on local and production, these URLs matter.

## Deployment

Build output is `dist/`.

GitHub Pages workflow:

- [.github/workflows/SimpleWorkflowBasic.yml](C:/Users/Garreth/Documents/GitHub/NeonSpires.com/.github/workflows/SimpleWorkflowBasic.yml)

Custom domain file:

- [public/CNAME](C:/Users/Garreth/Documents/GitHub/NeonSpires.com/public/CNAME)

## Current Limits

Because the site is still deployed as a static Astro site:

- auth is client-side
- approval gating is database-driven
- there is no server-rendered protected route middleware yet

That is fine for the current setup, but if you want deeper protected flows later, a move to a more app-like hosting setup can help.

## Good Next Steps

- move press files into private Supabase Storage
- add an admin approval view or admin script
- add unsubscribe handling for newsletter contacts
- add richer press asset categories and downloadable fact sheets
- add branded auth confirmation and reset email templates in Supabase
