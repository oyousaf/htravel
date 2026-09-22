import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const COLORS = {
  navyDark: "#0a1424",
  navy: "#0f1e33",
  navyLight: "#16304f",
  teal: "#3fd9c7",
};

function renderEmailHtml({
  name,
  email,
  phone,
  message,
}: {
  name: string;
  email: string;
  phone: string;
  message: string;
}) {
  const escape = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:12px 0;border-bottom:1px solid #223655;">
        <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.teal};font-weight:600;">${label}</p>
        <p style="margin:0;font-size:15px;color:#ffffff;">${escape(value) || "—"}</p>
      </td>
    </tr>`;

  return `
<!doctype html>
<html>
  <head>
    <meta name="color-scheme" content="dark light" />
    <meta name="supported-color-schemes" content="dark light" />
  </head>
  <body style="margin:0;padding:0;background-color:${COLORS.navyDark};font-family:'Segoe UI',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${COLORS.navyDark};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background-color:${COLORS.navy};border-radius:16px;overflow:hidden;border:1px solid #223655;">
            <tr>
              <td style="background-color:${COLORS.navyDark};padding:24px 28px;">
                <table role="presentation" cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="background-color:${COLORS.teal};border-radius:999px;padding:8px 16px;">
                      <span style="display:block;font-size:9px;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.navyDark};font-weight:600;">Heckmondwike</span>
                      <span style="display:block;font-size:12px;letter-spacing:-0.01em;text-transform:uppercase;color:${COLORS.navyDark};font-weight:800;margin-top:-2px;">Travel &amp; Tours</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:28px;">
                <h1 style="margin:0 0 4px;font-size:20px;color:#ffffff;">New website enquiry</h1>
                <p style="margin:0 0 20px;font-size:13px;color:#8fa1bd;">Submitted via the contact form on heckytravel.uk</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${row("Name", name)}
                  ${row("Email", email)}
                  ${row("Phone", phone)}
                </table>
                <p style="margin:20px 0 6px;font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:${COLORS.teal};font-weight:600;">Message</p>
                <p style="margin:0;font-size:15px;line-height:1.6;color:#ffffff;white-space:pre-wrap;">${escape(message)}</p>
              </td>
            </tr>
            <tr>
              <td style="background-color:${COLORS.navyDark};padding:16px 28px;">
                <p style="margin:0;font-size:12px;color:#8fa1bd;">Reply directly to this email to respond to ${escape(name)}.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.CONTACT_TO_EMAIL;
  const fromEmail = import.meta.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey || !toEmail) {
    return new Response(JSON.stringify({ error: "Contact form is not configured yet." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const form = await request.formData();
  const name = String(form.get("name") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  const phone = String(form.get("phone") ?? "").trim();
  const message = String(form.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return new Response(JSON.stringify({ error: "Please fill in your name, email, and message." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: `Heckmondwike Travel & Tours <${fromEmail}>`,
    to: toEmail,
    replyTo: email,
    subject: `New enquiry from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || "—"}\n\n${message}`,
    html: renderEmailHtml({ name, email, phone, message }),
  });

  if (error) {
    return new Response(JSON.stringify({ error: "Could not send your enquiry — please call or WhatsApp us instead." }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return Response.json({ ok: true });
};
