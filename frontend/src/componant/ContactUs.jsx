import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PageTitle from "./PageTitle";
import { Phone, Email, LocationOn, Facebook, Instagram, Twitter } from "@mui/icons-material";
import { toast } from "react-toastify";
import useFormValidation from "../utils/useFormValidation";

const faqs = [
  { q: "How long does delivery take?", a: "Standard delivery takes 3–5 business days. Express delivery is available at checkout for 1–2 business days." },
  { q: "Can I return a product?", a: "Yes, we offer a 7-day return policy on all products. The item must be in original condition and packaging." },
  { q: "Do you offer warranty on phones?", a: "All phones come with a manufacturer's warranty. Duration varies by brand — typically 12 months." },
  { q: "How do I track my order?", a: "Once your order is shipped, you'll receive a tracking link via email and SMS." },
  { q: "Is Cash on Delivery available?", a: "Yes, COD is available for orders under ₹50,000 in select pin codes." },
];

const contactInfo = [
  { label: "Phone", value: "+91 98765 43210", sub: "Mon–Sat, 10 AM – 7 PM", href: "tel:+919876543210", icon: <Phone style={{ fontSize: 20 }} /> },
  { label: "Email", value: "support@planthouse.in", sub: "We reply within 24 hours", href: "mailto:support@planthouse.in", icon: <Email style={{ fontSize: 20 }} /> },
  { label: "Address", value: "Shop 12, Tech Plaza, Rajkot", sub: "Gujarat, India — 360001", href: "https://maps.google.com", icon: <LocationOn style={{ fontSize: 20 }} /> },
];

const socials = [
  { name: "Facebook", href: "https://facebook.com", icon: <Facebook style={{ fontSize: 18 }} /> },
  { name: "Instagram", href: "https://instagram.com", icon: <Instagram style={{ fontSize: 18 }} /> },
  { name: "Twitter / X", href: "https://twitter.com", icon: <Twitter style={{ fontSize: 18 }} /> },
];

const FaqItem = ({ q, a }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      onClick={() => setOpen(!open)}
      className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl px-6 py-4 cursor-pointer hover:border-[#03541e]/40 transition-all duration-200"
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-[#12351f]">{q}</p>
        <span className={`text-[#03541e] text-lg font-bold transition-transform duration-200 ${open ? "rotate-45" : ""}`}>+</span>
      </div>
      {open && <p className="text-sm text-[#12351f] mt-3 leading-relaxed border-t border-[#d7eadb] pt-3">{a}</p>}
    </div>
  );
};

const ContactUs = () => {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const contactValidationRules = {
    rules: {
      name: {
        required: true,
        minlength: 3
      },
      email: {
        required: true,
        email: true
      },
      subject: {
        required: true
      },
      message: {
        required: true,
        minlength: 10
      }
    },
    messages: {
      name: {
        required: "Please enter your name",
        minlength: "Name must be at least 3 characters"
      },
      email: {
        required: "Email is required",
        email: "Please enter a valid email address"
      },
      subject: {
        required: "Please select a subject"
      },
      message: {
        required: "Please enter your message",
        minlength: "Message must be at least 10 characters"
      }
    }
  };

  const contactSubmitHandler = () => {
    setForm((prev) => ({
      ...prev,
      name: prev.name.trim(),
      email: prev.email.trim(),
      message: prev.message.trim(),
    }));
    setStatus("sending");
    setTimeout(() => setStatus("sent"), 1500);
  };

  return (
    <>
      <Navbar />
      <PageTitle title="Contact Us" />

      <div
        className="min-h-screen bg-gradient-to-br from-[#f4fbf6] via-[#eaf7ed] to-[#f4fbf6]"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:wght@700;900&display=swap');
          .playfair { font-family: 'Playfair Display', serif; }

          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .fade-up { animation: fadeUp 0.6s cubic-bezier(.22,1,.36,1) both; }

          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position:  200% center; }
          }
          .shimmer-text {
            background: linear-gradient(90deg, #03541e, #f0c97a, #03541e);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            animation: shimmer 3s linear infinite;
          }

          .contact-input {
            width: 100%;
            background: #ffffff;
            border: 1px solid #d7eadb;
            border-radius: 12px;
            padding: 11px 14px;
            color: #12351f;
            font-size: 14px;
            outline: none;
            transition: border-color 0.2s, box-shadow 0.2s;
            font-family: 'DM Sans', sans-serif;
          }
          .contact-input::placeholder { color: #55705f; opacity: 0.5; }
          .contact-input:focus {
            border-color: rgba(201,151,58,0.6);
            box-shadow: 0 0 0 3px rgba(201,151,58,0.08);
          }

          .card-lift {
            transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
          }
          .card-lift:hover {
            transform: translateY(-3px);
            border-color: rgba(201,151,58,0.35) !important;
            box-shadow: 0 12px 32px rgba(61,43,31,0.10);
          }

          @keyframes checkPop {
            0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
            70%  { transform: scale(1.15) rotate(3deg); opacity: 1; }
            100% { transform: scale(1) rotate(0deg); opacity: 1; }
          }
          .check-pop { animation: checkPop 0.5s cubic-bezier(.22,1,.36,1) both; }

          @keyframes spin-slow { to { transform: rotate(360deg); } }
          .spin-slow { animation: spin-slow 14s linear infinite; }

          @keyframes pulse-dot {
            0%, 100% { opacity: 1; transform: scale(1); }
            50%       { opacity: 0.5; transform: scale(1.3); }
          }
          .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }

          select option { background: #ffffff; color: #12351f; }
        `}</style>

        {/* ── HERO ── */}
        <section className="relative pt-24 pb-16 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-80 h-80 bg-[#03541e]/10 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#03541e]/8 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />
          <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
            <div
              className="fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#03541e]/10 border border-[#03541e]/20 text-[#03541e] text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ animationDelay: "0ms" }}
            >
              <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-[#03541e] inline-block" />
              We're Here to Help
            </div>
            <h1
              className="playfair fade-up text-5xl sm:text-6xl font-black leading-tight mb-4 text-[#12351f]"
              style={{ animationDelay: "80ms" }}
            >
              Let's <span className="shimmer-text">Talk.</span>
            </h1>
            <p
              className="fade-up text-[#55705f] text-base leading-relaxed max-w-lg mx-auto"
              style={{ animationDelay: "160ms" }}
            >
              Questions, feedback, or just want to say hi? Our team is always a message away.
            </p>
          </div>
        </section>

        {/* ── CONTACT CARDS ── */}
        <section className="pb-12">
          <div className="max-w-5xl mx-auto px-6 grid sm:grid-cols-3 gap-4">
            {contactInfo.map((c, i) => (
              <a
                key={c.label}
                href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className="card-lift relative p-5 rounded-2xl bg-[#ffffff] border border-[#d7eadb] flex flex-col gap-3 overflow-hidden no-underline"
              >
                <div className="w-10 h-10 rounded-xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center text-[#03541e]">
                  {c.icon}
                </div>
                <div>
                  <p className="text-[#55705f] text-xs uppercase tracking-widest font-semibold mb-0.5">{c.label}</p>
                  <p className="text-[#12351f] font-bold text-sm">{c.value}</p>
                  <p className="text-[#55705f] text-xs mt-0.5">{c.sub}</p>
                </div>
                <div className="absolute -bottom-3 -right-3 w-12 h-12 rounded-full bg-[#03541e]/5 border border-[#03541e]/10" />
              </a>
            ))}
          </div>
        </section>

        {/* ── FORM + SIDEBAR ── */}
        <section className="pb-16">
          <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-5 gap-8 items-start">

            {/* Form */}
            <div className="lg:col-span-3">
              <div className="relative bg-[#ffffff] border border-[#d7eadb] rounded-3xl p-8 overflow-hidden">
                <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#03541e]/30 to-transparent" />

                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 text-[#03541e] text-xs font-semibold uppercase tracking-widest mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#03541e] inline-block" />
                    Send a Message
                  </div>
                  <h2 className="playfair text-2xl font-black text-[#12351f]">Drop us a line</h2>
                  <p className="text-[#55705f] text-sm mt-1">We'll get back to you within 24 hours.</p>
                </div>

                {status === "sent" ? (
                  <div className="flex flex-col items-center justify-center py-14 gap-4 text-center">
                    <div className="check-pop w-14 h-14 rounded-2xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="none" stroke="#03541e" strokeWidth={2.5} className="w-7 h-7">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <div>
                      <p className="playfair text-xl font-black text-[#12351f] mb-1">Message Sent!</p>
                      <p className="text-[#55705f] text-sm">
                        Thanks, <span className="text-[#12351f] font-semibold">{form.name}</span>. We'll be in touch shortly.
                      </p>
                    </div>
                    <button
                      onClick={() => { setStatus(null); setForm({ name: "", email: "", subject: "", message: "" }); }}
                      className="mt-1 px-5 py-2 rounded-xl border border-[#d7eadb] text-[#55705f] text-sm hover:border-[#03541e]/40 hover:text-[#12351f] transition-all duration-200"
                    >
                      Send another
                    </button>
                  </div>
                ) : (
                  <form ref={formRef} onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#55705f] uppercase tracking-wider">
                          Your Name <span className="text-[#03541e]">*</span>
                        </label>
                        <input name="name" value={form.name} onChange={handleChange} placeholder="Aryan Mehta" required className="contact-input" />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold text-[#55705f] uppercase tracking-wider">
                          Email <span className="text-[#03541e]">*</span>
                        </label>
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="aryan@email.com" required className="contact-input" />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#55705f] uppercase tracking-wider">Subject</label>
                      <select
                        name="subject" value={form.subject} onChange={handleChange}
                        className="contact-input"
                        style={{ appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%238B5E3C' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px" }}
                      >
                        <option value="">Select a topic…</option>
                        <option value="order">Order Issue</option>
                        <option value="return">Return / Refund</option>
                        <option value="product">Product Query</option>
                        <option value="partnership">Brand Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-[#55705f] uppercase tracking-wider">
                        Message <span className="text-[#03541e]">*</span>
                      </label>
                      <textarea name="message" value={form.message} onChange={handleChange} rows={5} placeholder="Tell us how we can help…" required className="contact-input resize-none" />
                    </div>

                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="w-full py-3 rounded-xl bg-[#03541e] hover:bg-[#12351f] text-[#f4fbf6] text-sm font-bold tracking-widest uppercase transition-all duration-200 shadow-lg shadow-[#03541e]/20 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {status === "sending" ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                          </svg>
                          Sending…
                        </>
                      ) : (
                        <>
                          Send Message
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                          </svg>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* Business Hours */}
              <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-[#03541e]/10 border border-[#03541e]/20 flex items-center justify-center text-[#03541e]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[#12351f] font-bold text-sm">Business Hours</p>
                    <p className="text-[#55705f] text-xs">IST (UTC +5:30)</p>
                  </div>
                </div>
                <div className="flex flex-col gap-2.5">
                  {[
                    { day: "Mon – Fri", time: "10:00 AM – 7:00 PM", active: true },
                    { day: "Saturday", time: "11:00 AM – 5:00 PM", active: true },
                    { day: "Sunday", time: "Closed", active: false },
                  ].map((row) => (
                    <div key={row.day} className="flex items-center justify-between border-b border-[#d7eadb] last:border-0 pb-2 last:pb-0">
                      <span className="text-[#55705f] text-sm">{row.day}</span>
                      <span className={`text-sm font-semibold ${row.active ? "text-[#12351f]" : "text-[#55705f]/40"}`}>{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="bg-[#ffffff] border border-[#d7eadb] rounded-2xl p-6">
                <p className="text-[#12351f] font-bold text-sm mb-4">Follow Plant House</p>
                <div className="flex flex-col gap-2">
                  {socials.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl border border-[#d7eadb] hover:border-[#03541e]/30 hover:bg-[#f4fbf6] text-[#55705f] hover:text-[#03541e] transition-all duration-150 group no-underline"
                    >
                      <span>{s.icon}</span>
                      <span className="text-sm font-medium text-[#12351f] group-hover:text-[#12351f] transition-colors duration-150">{s.name}</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick Response */}
              <div className="relative bg-[#03541e]/5 border border-[#03541e]/20 rounded-2xl p-5 overflow-hidden">
                <div className="absolute top-3 right-3 flex items-center justify-center w-7 h-7">
                  <span className="absolute inset-0 rounded-full border border-[#03541e]/30 animate-ping opacity-40" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#03541e]" />
                </div>
                <p className="text-[#03541e] font-bold text-sm mb-1">Quick Response</p>
                <p className="text-[#55705f] text-xs leading-relaxed">
                  Our support team replies within <span className="text-[#12351f] font-semibold">2–4 hours</span> during business hours.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="pb-16">
          <div className="max-w-3xl mx-auto px-6">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 text-[#03541e] text-xs font-semibold uppercase tracking-widest mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#03541e] inline-block" />
                Common Questions
              </div>
              <h2 className="playfair text-3xl font-black text-[#12351f]">FAQ</h2>
            </div>
            <div className="flex flex-col gap-3">
              {faqs.map((faq) => (
                <FaqItem key={faq.q} q={faq.q} a={faq.a} />
              ))}
            </div>
            <p className="text-center text-[#55705f] text-sm mt-7">
              Still have questions?{" "}
              <a href="mailto:support@planthouse.in" className="text-[#03541e] hover:text-[#55705f] font-semibold transition-colors duration-150">
                Email us directly →
              </a>
            </p>
          </div>
        </section>

        {/* ── BOTTOM CTA ── */}
        <section className="pb-16">
          <div className="max-w-5xl mx-auto px-6">
            <div className="relative overflow-hidden rounded-3xl border border-[#03541e]/20 bg-[#eaf7ed] p-12 text-center">
              <div className="absolute top-0 left-0 w-56 h-56 bg-[#03541e]/8 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-56 h-56 bg-[#03541e]/8 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full border border-dashed border-[#03541e]/10 spin-slow pointer-events-none" />

              <div className="relative z-10 flex flex-col items-center gap-5">
                <div className="inline-flex items-center gap-2 text-[#03541e] text-xs font-semibold uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#03541e] inline-block" />
                  Not sure where to start?
                </div>
                <h2 className="playfair text-2xl lg:text-3xl font-black max-w-md leading-tight text-[#12351f]">
                  Explore our collection while we get back to you.
                </h2>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link
                    to="/products"
                    className="px-6 py-3 rounded-xl bg-[#03541e] hover:bg-[#12351f] text-[#f4fbf6] text-sm font-bold transition-colors duration-200 shadow-lg shadow-[#03541e]/20"
                  >
                    Browse Products
                  </Link>
                  <Link
                    to="/about-us"
                    className="px-6 py-3 rounded-xl border border-[#d7eadb] bg-[#ffffff] text-[#12351f] text-sm font-medium hover:border-[#03541e]/50 hover:text-[#12351f] transition-all duration-200"
                  >
                    About Plant House
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ContactUs;