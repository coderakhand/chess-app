import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to: string, otp: number) {
  await resend.emails.send({
    from: process.env.EMAIL_FROM || "",
    to,
    subject: "Your verification code",
    html: `
      <div
        style="margin:0; padding:0; font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif; background-color:#f9fafb; padding:30px;">
        <div
            style="max-width:480px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; padding:32px; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

            <h2 style="margin:0 0 12px 0; font-size:22px; font-weight:600; color:#111827;">Hi there 👋</h2>
            <p style="margin:0 0 20px 0; font-size:15px; color:#374151;">We’re excited to have you with us! Please use
                the code below to verify your email address.</p>

            <div
                style="background:#f3f4f6; border:1px dashed #d1d5db; border-radius:8px; padding:20px; text-align:center; margin:20px 0;">
                <span style="font-size:28px; letter-spacing:6px; font-weight:700; color:#111827;">{otp}</span>
            </div>

            <p style="margin:0 0 20px 0; font-size:14px; color:#4b5563;">
                This code will expire in <strong>${process.env.OTP_EXPIRY_MINUTES}
                    minute${process.env.OTP_EXPIRY_MINUTES === "1" ? "" : "s"}</strong>.
            </p>

            <p style="margin:0 0 24px 0; font-size:13px; color:#9ca3af;">
                Did you receive this email by mistake? If so, you can safely ignore it.
            </p>


            <div style="border-top:1px solid #e5e7eb; padding-top:16px; margin-top:24px;">
                <p style="margin:0; font-size:14px; color:#374151;">Thanks,</p>
                <p style="margin:0; font-size:14px; font-weight:600; color:#111827;">– The Chezz Team</p>
            </div>

        </div>
    </div>
    `,
  });
}
