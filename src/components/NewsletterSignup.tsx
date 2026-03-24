import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "../lib/supabase";

export default function NewsletterSignup() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setStatus(null);

    const supabase = getSupabaseBrowserClient();
    const { error: insertError } = await supabase.from("newsletter_subscribers").insert({
      email: email.trim().toLowerCase(),
      first_name: firstName.trim() || null,
      source: "website",
      status: "active",
    });

    if (insertError) {
      if (insertError.message.toLowerCase().includes("duplicate")) {
        setStatus("That email is already on the list.");
      } else {
        setError("Newsletter signup failed. Please try again.");
      }
      setIsSubmitting(false);
      return;
    }

    setStatus("You are subscribed. Future updates will go straight to your inbox.");
    setFirstName("");
    setEmail("");
    setIsSubmitting(false);
  }

  return (
    <form className="press-form" onSubmit={handleSubmit}>
      <label>
        <span>First name</span>
        <input
          type="text"
          name="firstName"
          autoComplete="given-name"
          value={firstName}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="Garreth"
        />
      </label>
      <label>
        <span>Email</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          required
        />
      </label>
      <button className="button button--primary" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Joining..." : "Join The Dispatch"}
      </button>
      {status ? <p className="form-feedback form-feedback--success">{status}</p> : null}
      {error ? <p className="form-feedback form-feedback--error">{error}</p> : null}
    </form>
  );
}
