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

// --------------- Email: Audit scheduled → supplier ---------------
export interface AuditScheduledEmailParams {
  supplierEmail: string;
  supplierName: string;
  auditDate: string;
  auditorName: string;
  notes?: string;
}

export async function sendAuditScheduledEmail(params: AuditScheduledEmailParams) {
  const { supplierEmail, supplierName, auditDate, auditorName, notes } = params;

  const body = `
    <h2 style="margin:0 0 4px;color:#1a2332;font-size:22px;font-weight:700;">
      Your audit has been scheduled
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Hi ${supplierName}, great news — your factory audit is now scheduled.
    </p>

    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:20px;margin-bottom:24px;">
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #dbeafe;">
            <span style="color:#6b7280;font-size:13px;">Audit Date</span><br/>
            <span style="color:#1e40af;font-size:16px;font-weight:700;">${auditDate}</span>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 0;">
            <span style="color:#6b7280;font-size:13px;">Lead Auditor</span><br/>
            <span style="color:#111827;font-size:14px;font-weight:600;">${auditorName}</span>
          </td>
        </tr>
      </table>
    </div>

    ${notes ? `<p style="margin:0 0 20px;color:#374151;font-size:14px;"><strong>Notes from our team:</strong> ${notes}</p>` : ""}

    <p style="margin:0 0 16px;color:#374151;font-size:14px;">
      <strong>How to prepare:</strong>
    </p>
    <ul style="margin:0 0 24px;padding-left:20px;color:#6b7280;font-size:14px;line-height:1.8;">
      <li>Have your GST certificate, factory license, and registration documents ready</li>
      <li>Ensure the factory floor is accessible and representative of normal operations</li>
      <li>Designate a contact person to accompany the auditor</li>
      <li>Prepare any quality certifications or test reports</li>
    </ul>

    <a href="${APP_URL}/dashboard/supplier"
       style="display:inline-block;background:#1a2332;color:#ffffff;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
      View Your Dashboard →
    </a>

    <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;">
      Questions? Reply to this email or contact us at hello@verifyindia.com
    </p>
  `;

  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: supplierEmail,
    subject: `Your VerifyIndia audit is scheduled for ${auditDate}`,
    html: emailHtml("Your audit is scheduled", body),
  });
}

// --------------- Email: Verification complete → supplier ---------------
export interface VerificationCompleteEmailParams {
  supplierEmail: string;
  supplierName: string;
  tier: "bronze" | "silver" | "gold";
  score: number;
  supplierSlug: string;
}

const TIER_COLORS = { gold: "#C9A84C", silver: "#94A3B8", bronze: "#CD7F32" };

export async function sendVerificationCompleteEmail(params: VerificationCompleteEmailParams) {
  const { supplierEmail, supplierName, tier, score, supplierSlug } = params;
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const color = TIER_COLORS[tier];

  const body = `
    <div style="text-align:center;margin-bottom:28px;">
      <div style="display:inline-block;background:${color}20;border:2px solid ${color};border-radius:50%;width:72px;height:72px;line-height:72px;font-size:32px;">
        🏆
      </div>
    </div>

    <h2 style="margin:0 0 4px;color:#1a2332;font-size:24px;font-weight:700;text-align:center;">
      Congratulations, ${supplierName}!
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;text-align:center;">
      You are now a <strong style="color:${color};">${tierLabel} Verified</strong> supplier on ${APP_NAME}.
    </p>

    <div style="background:${color}15;border:1px solid ${color}50;border-radius:12px;padding:20px;margin-bottom:24px;text-align:center;">
      <p style="margin:0 0 8px;color:#6b7280;font-size:13px;">Your Audit Score</p>
      <p style="margin:0;font-size:48px;font-weight:900;color:${color};">${score}<span style="font-size:20px;color:#9ca3af;">/100</span></p>
      <p style="margin:8px 0 0;font-size:13px;font-weight:700;color:${color};text-transform:uppercase;letter-spacing:0.08em;">${tierLabel} Verified ✓</p>
    </div>

    <p style="color:#374151;font-size:14px;line-height:1.7;">
      Your profile is now live and searchable by international buyers. Here's what this means for you:
    </p>
    <ul style="margin:12px 0 24px;padding-left:20px;color:#6b7280;font-size:14px;line-height:1.8;">
      <li>Your ${tierLabel} badge is now visible on your public profile</li>
      <li>You appear in buyer search results with "Verified" filter</li>
      <li>Buyers can view your verified audit summary</li>
      <li>You can receive and respond to buyer inquiries</li>
    </ul>

    <div style="display:flex;gap:12px;margin-bottom:20px;">
      <a href="${APP_URL}/suppliers/${supplierSlug}"
         style="display:inline-block;background:#1a2332;color:#ffffff;font-weight:700;font-size:14px;padding:14px 24px;border-radius:10px;text-decoration:none;margin-right:12px;">
        View Your Public Profile →
      </a>
      <a href="${APP_URL}/dashboard/supplier"
         style="display:inline-block;background:#f5f3ef;color:#1a2332;font-weight:600;font-size:14px;padding:14px 24px;border-radius:10px;text-decoration:none;border:1px solid #e8e4dc;">
        Go to Dashboard
      </a>
    </div>
  `;

  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: supplierEmail,
    subject: `🏆 Congratulations! You are now ${tierLabel} Verified on ${APP_NAME}`,
    html: emailHtml("You are now verified!", body),
  });
}

// --------------- Email: Account suspended → supplier ---------------
export interface SuspensionEmailParams {
  supplierEmail: string;
  supplierName: string;
  reason?: string;
}

export async function sendSuspensionEmail(params: SuspensionEmailParams) {
  const { supplierEmail, supplierName, reason } = params;

  const body = `
    <h2 style="margin:0 0 4px;color:#1a2332;font-size:22px;font-weight:700;">
      Account Suspended
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Hi ${supplierName}, your supplier account on ${APP_NAME} has been suspended.
    </p>

    ${reason ? `
    <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;color:#991b1b;font-size:14px;"><strong>Reason:</strong> ${reason}</p>
    </div>
    ` : ""}

    <p style="color:#374151;font-size:14px;line-height:1.7;">
      While your account is suspended, your public profile is hidden and buyers cannot send you new inquiries.
    </p>

    <p style="color:#374151;font-size:14px;line-height:1.7;margin-top:16px;">
      To appeal this decision or get more information, please contact our team at
      <a href="mailto:support@verifyindia.com" style="color:#1a2332;">support@verifyindia.com</a>.
    </p>
  `;

  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: supplierEmail,
    subject: `Important: Your ${APP_NAME} account has been suspended`,
    html: emailHtml("Account suspended", body),
  });
}

// --------------- Email: Subscription confirmed → supplier ---------------
export interface SubscriptionConfirmedEmailParams {
  supplierEmail: string;
  supplierName: string;
  plan: "bronze" | "silver" | "gold";
}

const PLAN_DETAILS: Record<
  string,
  { label: string; color: string; audits: number; next: string }
> = {
  bronze: {
    label: "Bronze",
    color: "#CD7F32",
    audits: 1,
    next: "Our team will contact you within 5 business days to schedule your factory audit.",
  },
  silver: {
    label: "Silver",
    color: "#94A3B8",
    audits: 2,
    next: "Our team will reach out within 3 business days to schedule your first factory audit.",
  },
  gold: {
    label: "Gold",
    color: "#C9A84C",
    audits: 4,
    next: "A senior auditor will contact you within 2 business days to begin your priority audit.",
  },
};

export async function sendSubscriptionConfirmedEmail(
  params: SubscriptionConfirmedEmailParams
) {
  const { supplierEmail, supplierName, plan } = params;
  const details = PLAN_DETAILS[plan] ?? PLAN_DETAILS.bronze;

  const body = `
    <h2 style="margin:0 0 4px;color:#1a2332;font-size:22px;font-weight:700;">
      You are now listed on ${APP_NAME}! 🎉
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Welcome, ${supplierName}. Your <strong style="color:${details.color};">${details.label} plan</strong> subscription is active
      and your profile is live in our supplier directory.
    </p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 12px;color:#166534;font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">
        What Happens Next
      </p>
      <p style="margin:0 0 12px;color:#374151;font-size:14px;">
        ${details.next}
      </p>
      <ul style="margin:0;padding-left:20px;color:#6b7280;font-size:13px;line-height:2;">
        <li>Physical factory audit by our Gujarat-based team</li>
        <li>${details.audits} audit${details.audits > 1 ? "s" : ""} included per year</li>
        <li>Score published on your public profile after verification</li>
        <li>Buyers can start sending you inquiries right now</li>
      </ul>
    </div>

    <a href="${APP_URL}/dashboard/supplier"
       style="display:inline-block;background:#1a2332;color:#ffffff;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
      Go to Your Dashboard →
    </a>

    <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;">
      Questions? Reply to this email or message us at hello@verifyindia.com
    </p>
  `;

  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: supplierEmail,
    subject: `🎉 Welcome to ${APP_NAME} — your ${details.label} plan is active`,
    html: emailHtml(`Welcome to ${APP_NAME}!`, body),
  });
}

// --------------- Email: Subscription ended → supplier ---------------
export interface SubscriptionEndedEmailParams {
  supplierEmail: string;
  supplierName: string;
}

export async function sendSubscriptionEndedEmail(
  params: SubscriptionEndedEmailParams
) {
  const { supplierEmail, supplierName } = params;

  const body = `
    <h2 style="margin:0 0 4px;color:#1a2332;font-size:22px;font-weight:700;">
      Your ${APP_NAME} subscription has ended
    </h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">
      Hi ${supplierName}, your subscription to ${APP_NAME} has been cancelled or expired.
    </p>

    <div style="background:#fef9ef;border:1px solid #fde68a;border-radius:10px;padding:20px;margin-bottom:24px;">
      <p style="margin:0 0 8px;color:#92400e;font-size:13px;font-weight:700;">What this means:</p>
      <ul style="margin:0;padding-left:20px;color:#6b7280;font-size:14px;line-height:1.9;">
        <li>Your verified badge has been removed from your public profile</li>
        <li>Buyers may no longer be able to find you in search results</li>
        <li>You will not receive new buyer inquiries</li>
        <li>Your profile data is safely saved — resubscribe any time to restore it</li>
      </ul>
    </div>

    <p style="color:#374151;font-size:14px;margin-bottom:20px;">
      Want to get back on the platform? Resubscribe to a plan and your profile will be live again immediately.
    </p>

    <a href="${APP_URL}/pricing"
       style="display:inline-block;background:#1a2332;color:#ffffff;font-weight:700;font-size:14px;padding:14px 28px;border-radius:10px;text-decoration:none;">
      View Plans & Resubscribe →
    </a>

    <p style="margin:20px 0 0;color:#9ca3af;font-size:12px;">
      Need help? Contact us at support@verifyindia.com
    </p>
  `;

  return resend.emails.send({
    from: `${APP_NAME} <${FROM}>`,
    to: supplierEmail,
    subject: `Your ${APP_NAME} subscription has ended`,
    html: emailHtml("Subscription ended", body),
  });
}
