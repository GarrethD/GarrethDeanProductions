import { FormEvent, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "../lib/supabase";

type PressProfile = {
  user_id: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  country: string | null;
  coverage_type: string | null;
  coverage_links: string | null;
  reason: string | null;
  is_approved: boolean;
  approval_notes: string | null;
};

type PressAsset = {
  id: string;
  slug: string;
  title: string;
  asset_type: string;
  description: string | null;
  url: string;
};

const defaultRegisterState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  company: "",
  country: "",
  coverageType: "Press / Editorial",
  coverageLinks: "",
  reason: "",
};

const dashboardTabs = ["Overview", "Assets", "Profile"] as const;
type DashboardTab = (typeof dashboardTabs)[number];

export default function PressPortal() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<PressProfile | null>(null);
  const [assets, setAssets] = useState<PressAsset[]>([]);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerState, setRegisterState] = useState(defaultRegisterState);
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [needsPasswordReset, setNeedsPasswordReset] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<DashboardTab>("Overview");

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      if (event === "PASSWORD_RECOVERY") {
        setNeedsPasswordReset(true);
        setMessage("Choose a new password below to finish the reset.");
      }
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setAssets([]);
        setActiveTab("Overview");
      }
      if (event === "SIGNED_IN") {
        setNeedsPasswordReset(false);
        setActiveTab("Overview");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    async function loadPortalData() {
      if (!session?.user) {
        setProfile(null);
        setAssets([]);
        return;
      }

      const supabase = getSupabaseBrowserClient();
      const { data: profileData, error: profileError } = await supabase
        .from("press_profiles")
        .select("*")
        .eq("user_id", session.user.id)
        .single();

      if (profileError) {
        setError("We could not load your press profile.");
        return;
      }

      setProfile(profileData as PressProfile);

      if (profileData.is_approved) {
        const { data: assetData, error: assetError } = await supabase
          .from("press_assets")
          .select("id, slug, title, asset_type, description, url")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (assetError) {
          setError("Your account is approved, but assets could not be loaded.");
          return;
        }

        setAssets((assetData ?? []) as PressAsset[]);
        setActiveTab("Overview");
      } else {
        setAssets([]);
        setActiveTab("Overview");
      }
    }

    loadPortalData();
  }, [session]);

  function clearNotices() {
    setMessage(null);
    setError(null);
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearNotices();
    setBusyAction("login");
    const supabase = getSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: loginEmail.trim(),
      password: loginPassword,
    });

    if (signInError) {
      setError(signInError.message);
    } else {
      setMessage("You are signed in.");
      setLoginPassword("");
    }
    setBusyAction(null);
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearNotices();
    setBusyAction("register");
    const supabase = getSupabaseBrowserClient();
    const redirectBase = window.location.origin.includes("localhost")
      ? window.location.origin
      : "https://garrethdean.com";

    const { error: signUpError } = await supabase.auth.signUp({
      email: registerState.email.trim(),
      password: registerState.password,
      options: {
        emailRedirectTo: `${redirectBase}/press`,
        data: {
          first_name: registerState.firstName.trim(),
          last_name: registerState.lastName.trim(),
          company: registerState.company.trim(),
          country: registerState.country.trim(),
          coverage_type: registerState.coverageType,
          coverage_links: registerState.coverageLinks.trim(),
          reason: registerState.reason.trim(),
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
    } else {
      setMessage("Registration received. Check your inbox to confirm your email before signing in.");
      setRegisterState(defaultRegisterState);
    }
    setBusyAction(null);
  }

  async function handlePasswordResetEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearNotices();
    setBusyAction("reset-request");
    const supabase = getSupabaseBrowserClient();
    const redirectBase = window.location.origin.includes("localhost")
      ? window.location.origin
      : "https://garrethdean.com";

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: `${redirectBase}/press`,
    });

    if (resetError) {
      setError(resetError.message);
    } else {
      setMessage("Reset instructions sent. Follow the email link to choose a new password.");
      setResetEmail("");
    }
    setBusyAction(null);
  }

  async function handlePasswordUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearNotices();
    setBusyAction("reset-finish");
    const supabase = getSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });

    if (updateError) {
      setError(updateError.message);
    } else {
      setMessage("Password updated. You can continue into the press portal.");
      setNeedsPasswordReset(false);
      setNewPassword("");
    }
    setBusyAction(null);
  }

  async function handleSignOut() {
    clearNotices();
    setBusyAction("logout");
    const supabase = getSupabaseBrowserClient();
    const { error: signOutError } = await supabase.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
    } else {
      setMessage("You have been signed out.");
    }
    setBusyAction(null);
  }

  const isApproved = Boolean(profile?.is_approved);
  const isPending = Boolean(session?.user && profile && !profile.is_approved);
  const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || session?.user?.email || "Press user";

  return (
    <div className="press-portal">
      <section className="section-grid">
        <article className="panel panel--statement press-panel press-panel--dark">
          <p className="section-label">Portal Status</p>
          <h2>{loading ? "Checking access..." : session ? "Press account" : "Sign in"}</h2>
          {session ? (
            <div className="press-status">
              <div className="press-status__row">
                <span>Account</span>
                <strong>{session.user.email}</strong>
              </div>
              <div className="press-status__row">
                <span>Access</span>
                <strong>{isApproved ? "Approved" : "Pending review"}</strong>
              </div>
              <button className="button button--ghost" type="button" onClick={handleSignOut} disabled={busyAction === "logout"}>
                {busyAction === "logout" ? "Signing Out..." : "Sign Out"}
              </button>
            </div>
          ) : needsPasswordReset ? (
            <form className="press-form" onSubmit={handlePasswordUpdate}>
              <label>
                <span>New password</span>
                <input
                  type="password"
                  name="newPassword"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                />
              </label>
              <button className="button button--primary" type="submit" disabled={busyAction === "reset-finish"}>
                {busyAction === "reset-finish" ? "Saving..." : "Update Password"}
              </button>
            </form>
          ) : (
            <form className="press-form" onSubmit={handleLogin}>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="loginEmail"
                  autoComplete="email"
                  placeholder="name@outlet.com"
                  value={loginEmail}
                  onChange={(event) => setLoginEmail(event.target.value)}
                  required
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  type="password"
                  name="loginPassword"
                  autoComplete="current-password"
                  placeholder="Password"
                  value={loginPassword}
                  onChange={(event) => setLoginPassword(event.target.value)}
                  required
                />
              </label>
              <button className="button button--primary" type="submit" disabled={busyAction === "login"}>
                {busyAction === "login" ? "Signing In..." : "Sign In"}
              </button>
            </form>
          )}
          {message ? <p className="form-feedback form-feedback--success">{message}</p> : null}
          {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}
        </article>

        <article className="panel panel--statement">
          <p className="section-label">Registration</p>
          <h2>Request press access.</h2>
          <form className="press-form press-form--grid" onSubmit={handleRegister}>
            <label>
              <span>First name</span>
              <input
                type="text"
                autoComplete="given-name"
                value={registerState.firstName}
                onChange={(event) => setRegisterState({ ...registerState, firstName: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Last name</span>
              <input
                type="text"
                autoComplete="family-name"
                value={registerState.lastName}
                onChange={(event) => setRegisterState({ ...registerState, lastName: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={registerState.email}
                onChange={(event) => setRegisterState({ ...registerState, email: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                autoComplete="new-password"
                value={registerState.password}
                onChange={(event) => setRegisterState({ ...registerState, password: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Outlet or company</span>
              <input
                type="text"
                autoComplete="organization"
                value={registerState.company}
                onChange={(event) => setRegisterState({ ...registerState, company: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Country or region</span>
              <input
                type="text"
                autoComplete="country-name"
                value={registerState.country}
                onChange={(event) => setRegisterState({ ...registerState, country: event.target.value })}
                required
              />
            </label>
            <label>
              <span>Coverage type</span>
              <select
                value={registerState.coverageType}
                onChange={(event) => setRegisterState({ ...registerState, coverageType: event.target.value })}
              >
                <option>Press / Editorial</option>
                <option>Creator / Streaming</option>
                <option>Partner / Business</option>
              </select>
            </label>
            <label className="press-form__full">
              <span>Coverage links</span>
              <textarea
                rows={4}
                value={registerState.coverageLinks}
                onChange={(event) => setRegisterState({ ...registerState, coverageLinks: event.target.value })}
                placeholder="Website, channel, articles, or social links"
                required
              />
            </label>
            <label className="press-form__full">
              <span>Reason for access</span>
              <textarea
                rows={4}
                value={registerState.reason}
                onChange={(event) => setRegisterState({ ...registerState, reason: event.target.value })}
                placeholder="Which project, materials, or coverage do you need?"
                required
              />
            </label>
            <button className="button button--ghost press-form__full" type="submit" disabled={busyAction === "register"}>
              {busyAction === "register" ? "Submitting..." : "Submit Request"}
            </button>
          </form>
        </article>
      </section>

      <section className="grid-panel">
        <article className="panel panel--statement">
          <p className="section-label">Password Help</p>
          <h2>Forgot your password?</h2>
          <form className="press-form" onSubmit={handlePasswordResetEmail}>
            <label>
              <span>Email</span>
              <input
                type="email"
                autoComplete="email"
                value={resetEmail}
                onChange={(event) => setResetEmail(event.target.value)}
                placeholder="name@outlet.com"
                required
              />
            </label>
            <button className="button button--ghost" type="submit" disabled={busyAction === "reset-request"}>
              {busyAction === "reset-request" ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </article>

        <article className="panel panel--statement">
          <p className="section-label">Approval</p>
          <h2>How access works.</h2>
          <ul className="sharp-list">
            <li>Create an account with your coverage details</li>
            <li>Confirm your email address</li>
            <li>Wait for approval inside the press profile table</li>
            <li>Approved accounts can read the protected asset records</li>
          </ul>
        </article>
      </section>

      {session ? (
        <section className="panel panel--statement press-dashboard">
          <div className="press-dashboard__head">
            <div>
              <p className="section-label">Press Dashboard</p>
              <h2>{isApproved ? `Welcome, ${displayName}.` : `Press request for ${displayName}.`}</h2>
              <p>
                {isApproved
                  ? "This is the private landing area for press materials, project details, and your submitted profile."
                  : "Your account is registered. This dashboard shows your current status and what will unlock after approval."}
              </p>
            </div>
            <div className="press-dashboard__tabs" role="tablist" aria-label="Press dashboard sections">
              {dashboardTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={tab === activeTab ? "is-active" : ""}
                  onClick={() => setActiveTab(tab)}
                  role="tab"
                  aria-selected={tab === activeTab}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {activeTab === "Overview" ? (
            <div className="press-dashboard__grid">
              <article className="press-asset-card">
                <p className="section-label">Access</p>
                <h3>{isApproved ? "Approved" : "Pending Review"}</h3>
                <p>
                  {isApproved
                    ? "Your account is approved. Press records, decks, and future media uploads are available from this portal."
                    : "Your registration is stored in Supabase and waiting for approval. Once approved, this dashboard will unlock the asset library automatically."}
                </p>
              </article>
              <article className="press-asset-card">
                <p className="section-label">Cloaked Protocol</p>
                <h3>Flagship Coverage</h3>
                <p>
                  The main project lead for interviews, decks, trailers, and official outward-facing studio materials.
                </p>
              </article>
              <article className="press-asset-card">
                <p className="section-label">Project Augment</p>
                <h3>Companion Coverage</h3>
                <p>
                  Companion project coverage for the shared universe, feature iteration, and supporting media beats between larger milestones.
                </p>
              </article>
              <article className="press-asset-card">
                <p className="section-label">Portal Scope</p>
                <h3>What belongs here</h3>
                <p>
                  Pitch decks, fact sheets, approved art, screenshots, trailers, and project context should all live in this area.
                </p>
              </article>
            </div>
          ) : null}

          {activeTab === "Assets" ? (
            <>
              <p className="section-label">Private Assets</p>
              <h2>{isApproved ? "Approved materials" : "Approval pending"}</h2>
              {isApproved ? (
                <div className="press-assets">
                  {assets.map((asset) => (
                    <article className="press-asset-card" key={asset.id}>
                      <p className="section-label">{asset.asset_type}</p>
                      <h3>{asset.title}</h3>
                      <p>{asset.description}</p>
                      <a className="button button--primary" href={asset.url} target="_blank" rel="noreferrer">
                        Open Asset
                      </a>
                    </article>
                  ))}
                </div>
              ) : (
                <p>
                  This tab will unlock decks, key art, screenshots, and future press materials after approval.
                </p>
              )}
            </>
          ) : null}

          {activeTab === "Profile" ? (
            <div className="press-profile-grid">
              <article className="press-status__row">
                <span>Name</span>
                <strong>{displayName}</strong>
              </article>
              <article className="press-status__row">
                <span>Email</span>
                <strong>{profile?.email ?? session.user.email}</strong>
              </article>
              <article className="press-status__row">
                <span>Outlet / Company</span>
                <strong>{profile?.company || "Not provided"}</strong>
              </article>
              <article className="press-status__row">
                <span>Coverage Type</span>
                <strong>{profile?.coverage_type || "Not provided"}</strong>
              </article>
              <article className="press-status__row">
                <span>Country / Region</span>
                <strong>{profile?.country || "Not provided"}</strong>
              </article>
              <article className="press-status__row">
                <span>Status</span>
                <strong>{isApproved ? "Approved" : "Pending review"}</strong>
              </article>
              <article className="press-status__row press-status__row--full">
                <span>Coverage Links</span>
                <strong>{profile?.coverage_links || "No links submitted yet."}</strong>
              </article>
              <article className="press-status__row press-status__row--full">
                <span>Reason For Access</span>
                <strong>{profile?.reason || "No reason submitted."}</strong>
              </article>
              {profile?.approval_notes ? (
                <article className="press-status__row press-status__row--full">
                  <span>Approval Notes</span>
                  <strong>{profile.approval_notes}</strong>
                </article>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : (
        <section className="panel panel--statement">
          <p className="section-label">Private Assets</p>
          <h2>Sign in for approved materials.</h2>
          <p>Protected decks, key art, screenshots, and future press materials appear here after sign-in and approval.</p>
        </section>
      )}
    </div>
  );
}
