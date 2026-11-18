import { useState } from "react";
import { Link } from "react-router-dom";
import Ghost from "../components/Ghost.jsx";
import {
  SCHOOL,
  CLASSES,
  ADMISSION_STEPS,
  DOCUMENTS,
} from "../content/site.js";
import api, { errorMessage } from "../lib/api.js";

const EMPTY_FORM = {
  parentName: "",
  phone: "",
  email: "",
  childName: "",
  childDob: "",
  classApplying: CLASSES[0].name,
  message: "",
  website: "", // honeypot, hidden from users
};

export default function Landing() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState({ type: "", text: "" });

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSending(true);
    setResult({ type: "", text: "" });
    try {
      await api.post("/enquiries", form);
      setForm(EMPTY_FORM);
      setResult({
        type: "ok",
        text: "Thank you! We have received your enquiry and will contact you soon.",
      });
    } catch (err) {
      setResult({ type: "error", text: errorMessage(err) });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="landing">
      <header className="site-header">
        <div className="container nav-row">
          <a href="#top" className="brand">
            {SCHOOL.name}
          </a>
          <nav className="nav-links">
            <a href="#about">About</a>
            <a href="#classes">Classes</a>
            <a href="#admissions">Admissions</a>
            <a href="#fees">Fees</a>
            <a href="#contact">Contact</a>
          </nav>
          <div className="nav-actions">
            <Link to="/login" className="btn btn-ghost">
              Staff login
            </Link>
            <a href="#enquiry" className="btn btn-primary">
              Enquire now
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="top">
        <div className="container hero-grid">
          <div>
            <Ghost id="admissionsOpen" />
            <h1>{SCHOOL.name}</h1>
            <Ghost id="tagline" />
            <Ghost id="heroSubtext" />
            <div className="cta-row">
              <a href="#enquiry" className="btn btn-primary">
                Enquire now
              </a>
              <a href="#contact" className="btn btn-ghost">
                Book a school visit
              </a>
            </div>
          </div>
          <div className="hero-photo">
            <Ghost id="schoolPhotos" />
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="section" id="about">
        <div className="container">
          <h2>About {SCHOOL.name}</h2>
          <Ghost id="aboutText" />
        </div>
      </section>

      {/* CLASSES */}
      <section className="section alt" id="classes">
        <div className="container">
          <h2>Classes we offer</h2>
          <Ghost id="ageCutoff" />
          <div className="class-grid">
            {CLASSES.map((c) => (
              <article className="card" key={c.key}>
                <h3>{c.name}</h3>
                <p className="muted">Age {c.age}</p>
                <Ghost id={`syllabus-${c.key}`} />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ADMISSIONS */}
      <section className="section" id="admissions">
        <div className="container">
          <h2>Admission process</h2>
          <ol className="steps">
            {ADMISSION_STEPS.map((s, i) => (
              <li key={s.title}>
                <span className="step-no">{i + 1}</span>
                <div>
                  <strong>{s.title}</strong>
                  <p className="muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <h3>Documents required</h3>
          <ul className="doc-list">
            {DOCUMENTS.map((d) => (
              <li key={d}>{d}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* FEES */}
      <section className="section alt" id="fees">
        <div className="container">
          <h2>Fee structure</h2>
          <Ghost id="feeTable" />
        </div>
      </section>

      {/* FACILITIES */}
      <section className="section" id="facilities">
        <div className="container two-col">
          <div>
            <h2>Facilities</h2>
            <Ghost id="facilities" />
          </div>
          <div>
            <h2>Daily routine</h2>
            <Ghost id="dailyRoutine" />
          </div>
        </div>
      </section>

      {/* ENQUIRY */}
      <section className="section alt" id="enquiry">
        <div className="container narrow">
          <h2>Enquire about admission</h2>
          <p className="muted">Fill in the form and we will get back to you.</p>
          <form className="form" onSubmit={submit}>
            <div className="field">
              <label htmlFor="parentName">Parent's name</label>
              <input
                id="parentName"
                name="parentName"
                required
                value={form.parentName}
                onChange={update}
              />
            </div>
            <div className="field">
              <label htmlFor="phone">Phone number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={form.phone}
                onChange={update}
              />
            </div>
            <div className="field">
              <label htmlFor="email">Email (optional)</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={update}
              />
            </div>
            <div className="field">
              <label htmlFor="childName">Child's name</label>
              <input
                id="childName"
                name="childName"
                required
                value={form.childName}
                onChange={update}
              />
            </div>
            <div className="field">
              <label htmlFor="childDob">Child's date of birth</label>
              <input
                id="childDob"
                name="childDob"
                type="date"
                required
                value={form.childDob}
                onChange={update}
              />
            </div>
            <div className="field">
              <label htmlFor="classApplying">Class applying for</label>
              <select
                id="classApplying"
                name="classApplying"
                value={form.classApplying}
                onChange={update}
              >
                {CLASSES.map((c) => (
                  <option key={c.key} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="field full">
              <label htmlFor="message">Message (optional)</label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={form.message}
                onChange={update}
              />
            </div>
            <div className="field full">
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={update}
                tabIndex={-1}
                autoComplete="off"
                style={{ display: "none" }}
                aria-hidden="true"
              />
            </div>
            <div className="full">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={sending}
              >
                {sending ? "Sending…" : "Send enquiry"}
              </button>
            </div>
          </form>
          {result.text && (
            <p className={result.type === "ok" ? "alert info" : "alert"}>
              {result.text}
            </p>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="section" id="contact">
        <div className="container two-col">
          <div>
            <h2>Contact us</h2>
            <p>
              <strong>Phone:</strong> <Ghost id="phone" />
            </p>
            <p>
              <strong>Email:</strong> <Ghost id="email" />
            </p>
            <p>
              <strong>Address:</strong> <Ghost id="address" />
            </p>
            <p>
              <strong>Office hours:</strong> <Ghost id="officeHours" />
            </p>
          </div>
          <div>
            <Ghost id="mapEmbed" />
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-row">
          <div>
            <strong>{SCHOOL.name}</strong>
            <p className="muted">
              © {new Date().getFullYear()} {SCHOOL.name}. All rights reserved.
            </p>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#admissions">Admissions</a>
            <a href="#fees">Fees</a>
            <a href="#contact">Contact</a>
            <Link to="/login">Staff login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
