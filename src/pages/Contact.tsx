import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import {
  contact,
  contactOrigin,
  emailHref,
  whatsappHref,
} from "../data/contact";

const interests = [
  "Tengo una idea",
  "Software a medida",
  "Modernizar un sistema",
  "Automatización / IA",
  "Avatar con IA",
  "Archivo digital",
  "Consulta o duda",
  "Otro",
];
type Field = "name" | "email" | "message";
type Errors = Partial<Record<Field | "interest", string>>;

function Icon({ type }: { type: "idea" | "whatsapp" | "email" | "linkedin" }) {
  const paths = {
    idea: (
      <>
        <path d="M9 18h6M10 22h4M8.5 14.5A6 6 0 1 1 16 15c-1.2.9-2 2-2 3H10c0-1.1-.5-2.1-1.5-3.5Z" />
        <path d="M12 2v2M4.9 5.3l1.4 1.4M19.1 5.3l-1.4 1.4" />
      </>
    ),
    whatsapp: (
      <>
        <path d="M20 11.6a8.2 8.2 0 0 1-12.1 7.2L4 20l1.2-3.7A8.2 8.2 0 1 1 20 11.6Z" />
        <path d="M8.4 8.2c.2-.5.4-.5.7-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.3 0 .5-.2.7l-.5.6c.5 1 1.3 1.8 2.3 2.3l.6-.5c.2-.2.4-.2.7-.1l1.5.7c.3.1.4.3.4.5v.5c0 .3-.2.5-.5.7-.5.2-1.1.3-1.7.1-2.9-.9-5.2-3.1-6-6-.2-.6-.1-1.2.1-1.7Z" />
      </>
    ),
    email: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m4 7 8 6 8-6" />
      </>
    ),
    linkedin: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 10v6M8 7v.1M12 16v-3.2c0-1.8 4-1.9 4 0V16M12 10v6" />
      </>
    ),
  };
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5 fill-none stroke-current stroke-[1.8]"
    >
      {paths[type]}
    </svg>
  );
}

function validate(values: Record<string, string>): Errors {
  const errors: Errors = {};
  if (values.name.trim().length < 2) errors.name = "Escribí tu nombre.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = "Revisá tu email. Parece que falta algo.";
  if (!interests.includes(values.interest))
    errors.interest = "Elegí una opción.";
  if (values.message.trim().length < 10)
    errors.message = "Contame un poquito más para poder entender tu consulta.";
  return errors;
}

export default function Contact() {
  const [params] = useSearchParams();
  const origin = contactOrigin(params.get("origen"));
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">(
    "idle",
  );
  const formRef = useRef<HTMLFormElement>(null);
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form).entries()) as Record<
      string,
      string
    >;
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      form
        .querySelector<HTMLElement>(`[name="${Object.keys(nextErrors)[0]}"]`)
        ?.focus();
      return;
    }
    setState("sending");
    try {
      const response = await fetch("/api/contacto", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...values,
          origin,
          page: window.location.pathname,
        }),
      });
      if (!response.ok) throw new Error();
      setState("success");
      form.reset();
    } catch {
      setState("error");
    }
  };
  return (
    <div data-tour-id="guide-contacto" tabIndex={-1} className="mx-auto max-w-[1120px] px-5 py-10 sm:px-6 md:px-8 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <section>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[.16em] text-clay-dark">
            <Icon type="idea" /> Contame tu idea
          </div>
          <h1 className="mt-4 font-display text-[46px] leading-[.93] tracking-[-.055em] sm:text-[58px]">
            No hace falta tener todo definido.
          </h1>
          <p className="mt-6 max-w-[58ch] text-[16px] leading-relaxed text-ink-2">
            ¿Tenés una idea, necesitás mejorar algo o simplemente querés hacerme
            una consulta? Escribime. Podemos empezar con algo pequeño y ver cómo
            hacerlo crecer.
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-ink-light">
            También podés usar este formulario para una duda o consulta breve.
          </p>
          <form
            ref={formRef}
            onSubmit={submit}
            noValidate
            className="mt-8 space-y-5 rounded-[22px] border hairline bg-white p-6 sm:p-8"
          >
            <div className="absolute -left-[9999px]" aria-hidden="true">
              <label htmlFor="website">No completar</label>
              <input
                id="website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>
            <Field
              label="Nombre"
              name="name"
              autoComplete="name"
              error={errors.name}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              error={errors.email}
            />
            <div>
              <label htmlFor="interest" className="text-[13px] font-medium">
                Qué necesitás?
              </label>
              <select
                id="interest"
                name="interest"
                required
                defaultValue="Tengo una idea"
                aria-invalid={Boolean(errors.interest)}
                aria-describedby={
                  errors.interest ? "interest-error" : undefined
                }
                className="mt-2 min-h-11 w-full rounded-[10px] border hairline bg-paper px-3 text-[14px]"
              >
                {interests.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
              {errors.interest && (
                <p
                  id="interest-error"
                  className="mt-1 text-[12px] text-clay-dark"
                >
                  {errors.interest}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="message" className="text-[13px] font-medium">
                Contame tu idea o consulta <span aria-hidden="true">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                required
                maxLength={2000}
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                className="mt-2 w-full resize-y rounded-[10px] border hairline bg-paper p-3 text-[14px] leading-relaxed"
              />
              {errors.message && (
                <p
                  id="message-error"
                  className="mt-1 text-[12px] text-clay-dark"
                >
                  {errors.message}
                </p>
              )}
            </div>
            <button
              disabled={state === "sending"}
              className="min-h-11 rounded-full bg-ink px-5 py-3 text-[13px] font-medium text-paper disabled:opacity-60"
            >
              {state === "sending" ? "Enviando..." : "Enviar consulta"}
            </button>
            <div aria-live="polite">
              {state === "success" && (
                <p className="rounded-[10px] bg-moss/10 p-3 text-[13px] text-ink">
                  <strong>Gracias, recibí tu consulta.</strong>
                  <br />
                  Te voy a responder lo antes posible.
                </p>
              )}
              {state === "error" && (
                <div className="rounded-[10px] border border-clay/30 bg-clay/10 p-3 text-[13px] text-ink">
                  <p>No pude enviar el formulario en este momento.</p>
                  <div className="mt-3 flex gap-3">
                    <a
                      className="underline"
                      href={whatsappHref(origin)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                    <a className="underline" href={emailHref()}>
                      Email
                    </a>
                  </div>
                </div>
              )}
            </div>
          </form>
        </section>
        <aside className="lg:pt-16">
          <div className="rounded-[22px] bg-ink p-6 text-paper sm:p-8">
            <div className="font-mono text-[10px] uppercase tracking-[.16em] text-brass">
              Preferís contactarme directamente?
            </div>
            <div className="mt-6 grid gap-3">
              <ContactLink
                icon="whatsapp"
                title="WhatsApp"
                detail={contact.whatsappNumber}
                href={whatsappHref(origin)}
                primary
              />
              <ContactLink
                icon="email"
                title="Email"
                detail={contact.email}
                href={emailHref()}
              />
              <ContactLink
                icon="linkedin"
                title="LinkedIn"
                detail="Perfil profesional"
                href={contact.linkedin}
                external
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  error,
}: {
  label: string;
  name: Field;
  type?: string;
  autoComplete?: string;
  error?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-[13px] font-medium">
        {label} <span aria-hidden="true">*</span>
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        autoComplete={autoComplete}
        maxLength={name === "name" ? 80 : 160}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${name}-error` : undefined}
        className="mt-2 min-h-11 w-full rounded-[10px] border hairline bg-paper px-3 text-[14px]"
      />
      {error && (
        <p id={`${name}-error`} className="mt-1 text-[12px] text-clay-dark">
          {error}
        </p>
      )}
    </div>
  );
}
function ContactLink({
  icon,
  title,
  detail,
  href,
  primary,
  external,
}: {
  icon: "whatsapp" | "email" | "linkedin";
  title: string;
  detail: string;
  href: string;
  primary?: boolean;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external || icon === "whatsapp" ? "_blank" : undefined}
      rel={external || icon === "whatsapp" ? "noopener noreferrer" : undefined}
      className={`flex min-h-16 items-center gap-4 rounded-[14px] border p-4 transition hover:-translate-y-0.5 ${primary ? "border-brass/50 bg-white text-ink" : "border-white/15 bg-white/5 text-paper"}`}
    >
      <span
        className={`grid h-9 w-9 place-items-center rounded-full ${primary ? "bg-moss text-paper" : "bg-white/10"}`}
      >
        <Icon type={icon} />
      </span>
      <span>
        <span className="block text-[14px] font-medium">{title}</span>
        <span
          className={`block text-[12px] ${primary ? "text-ink-light" : "text-paper/65"}`}
        >
          {detail}
        </span>
      </span>
    </a>
  );
}
