export function verifyEmailTemplate({ username, verificationLink }: {username: string; verificationLink: string;}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Verify your Kroma account</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f5f7; -webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f5f7; padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%; background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06);">

          <tr>
            <td align="center" style="background-color:#4f46e5; padding:28px 24px;">
              <span style="font-family:Arial, Helvetica, sans-serif; font-size:24px; font-weight:bold; color:#ffffff; letter-spacing:1px;">Kroma</span>
            </td>
          </tr>

          <tr>
            <td style="padding:40px 40px 24px 40px;">
              <h1 style="margin:0 0 16px 0; font-family:Arial, Helvetica, sans-serif; font-size:22px; line-height:1.3; color:#111827;">
                Verify your email address
              </h1>
              <p style="margin:0 0 16px 0; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.6; color:#374151;">
                Hi ${username},
              </p>
              <p style="margin:0 0 24px 0; font-family:Arial, Helvetica, sans-serif; font-size:15px; line-height:1.6; color:#374151;">
                Thanks for signing up for Kroma. Please confirm your email address by clicking the button below to activate your account.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 24px auto;">
                <tr>
                  <td align="center" style="border-radius:8px; background-color:#4f46e5;">
                    <a href="${verificationLink}"
                       target="_blank"
                       style="display:inline-block; padding:14px 32px; font-family:Arial, Helvetica, sans-serif; font-size:15px; font-weight:bold; color:#ffffff; text-decoration:none; border-radius:8px;">
                      Verify Email
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px 0; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:1.6; color:#6b7280;">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p style="margin:0 0 24px 0; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:1.6; color:#4f46e5; word-break:break-all;">
                <a href="${verificationLink}" target="_blank" style="color:#4f46e5; text-decoration:underline;">${verificationLink}</a>
              </p>

              <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:13px; line-height:1.6; color:#6b7280;">
                This link will expire in 24 hours. If you didn't create a Kroma account, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:24px 40px 32px 40px; border-top:1px solid #e5e7eb;">
              <p style="margin:0; font-family:Arial, Helvetica, sans-serif; font-size:12px; line-height:1.6; color:#9ca3af; text-align:center;">
                &copy; ${new Date().getFullYear()} Kroma. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
