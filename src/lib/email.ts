import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM_EMAIL ?? "noreply@verifyindia.com";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://verify-business-india.vercel.app";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "VerifyIndia";

// --------------- Shared layout wrapper ---------------
function emailHtml(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f5f3ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f3ef;padding:40px 20px;">
    <tr><td align="center">
      <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e8e4dc;">
        <!-- Header -->
        <tr>
          <td style="background:#1a2332;padding:24px 32px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#c8a951;border-radius:8px;width:36px;height:36px;text-align:center;vertical-align:middle;">
                  <span style="color:#1a2332;font-size:20px;font-weight:bold;">✓</span>
                </td>
                <td style="padding-left:10px;">
                  <span style="color:#ffffff;font-size:18px;font-weight:700;letter-spacing:-0.3px;">
                    Verify<span style="color:#c8a951;">India</span>
                  </span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:32px;">
            ${body}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f5f3ef;padding:20px 32px;border-top:1px solid #e8e4dc;">
            <p style="margin:0;color:#9ca3af;font-size:12px;line-height:1.6;">
              You received this email because you have an account on <a href="${APP_URL}" style="color:#1a2332;">VerifyIndia</a>. 
              Gujarat Supplier Verification Platform.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function kv(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;border-bottom:1px solid #f3f4f6;">
      <span style="color:#6b7280;font-size:13px;">${label}</span><br/>
      <span style="color:#111827;font-size:14px;font-weight:600;">${value}</span>
    </td>
  </tr>`;
}

// --------------- Email: New inquiry → supplier ---------------
export interface NewInquiryEmailParams {
  supplierEmail: string;
  supplierName: string;
  buyerName: string;
  buyerCompany: string;
  buyerCountry: string;
  subject: string;
  sourcing: string;
  quantity: string;
  budget: string;
  timeline: string;
  inquiryId: string;
}

export async function sendNewInquiryEmail(params: NewInquiryEmailParams) {
  const {
    supplierEmail, supplierName, buyerName, buyerCompany,
    buyerCountry, subject, sourcing, quantity, budget, timeline, inquiryId,
  } = params;

  const body = `
    <h2 style="margin:0 0 4px;color:#1a2332;font-size:22px;font-weight:700;">New Buyer Inquiry</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">A buyer wants to source from your factory.</p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#166534;font-size:14px;font-weight:600;">📦 ${subject}</p>
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      ${kv("Buyer", buyerName)}
      ${kv("Company", buyerCompany)}
      ${kv("Country", buyerCountry)}
      ${kv("What they need", sourcing)}
      ${kv("Estimated Quantity", quantity || "Not specified")}
      ${kv("Budget Range", budget)}
      ${kv("Timeline", timeline)}
    </table>

    <a href="${APP_URL}/dashboard/supplier/inquiries?id=${inquiryId}"
       style="display:inline-block;background:#1a2332;color:#ffffff;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
      View &amp; Respond to Inquiry →
    </a>

    <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;">
      Respond within 24 hours to maintain your response rating on ${APP_NAME}.
    </p>
  `;

  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: supplierEmail,
    subject: `New inquiry from ${buyerCompany} on ${APP_NAME}`,
    html: emailHtml(`New inquiry from ${buyerCompany}`, body),
  });
}

// --------------- Email: Supplier responded → buyer ---------------
export interface InquiryResponseEmailParams {
  buyerEmail: string;
  buyerName: string;
  supplierName: string;
  supplierCity: string;
  subject: string;
  responseText: string;
  inquiryId: string;
}

export async function sendInquiryResponseEmail(params: InquiryResponseEmailParams) {
  const {
    buyerEmail, buyerName, supplierName, supplierCity,
    subject, responseText, inquiryId,
  } = params;

  const body = `
    <h2 style="margin:0 0 4px;color:#1a2332;font-size:22px;font-weight:700;">
      ${supplierName} responded to your inquiry
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Hi ${buyerName}, your inquiry has received a reply from ${supplierName}, ${supplierCity}.
    </p>

    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-left:4px solid #0ea5e9;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0 0 6px;color:#0c4a6e;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">
        Re: ${subject}
      </p>
      <p style="margin:0;color:#1e3a5f;font-size:14px;line-height:1.7;">${responseText.replace(/\n/g, "<br/>")}</p>
    </div>

    <a href="${APP_URL}/dashboard/buyer/inquiries?id=${inquiryId}"
       style="display:inline-block;background:#1a2332;color:#ffffff;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
      View Full Conversation →
    </a>

    <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;">
      You can continue the conversation directly with the supplier from your buyer dashboard.
    </p>
  `;

  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: buyerEmail,
    subject: `${supplierName} replied to your inquiry on ${APP_NAME}`,
    html: emailHtml(`${supplierName} replied to your inquiry`, body),
  });
}
