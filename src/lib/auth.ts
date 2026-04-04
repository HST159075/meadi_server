import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { bearer } from "better-auth/plugins";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "https://meadi-server.onrender.com",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: process.env.BETTER_AUTH_SECRET,
  plugins: [bearer()],
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      const verificationUrl = `${process.env.APP_URL}/verify-email?token=${token}`;

      const info = await transporter.sendMail({
        from: '"MediStore" <medistore.hst@gmail.com>',
        to: user.email, 
        subject: "Verify Your Email - MediStore",
        html: `
       <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email</title>
    <style>
        /* Mobile-first styles */
        @media screen and (max-width: 600px) {
            .container {
                width: 100% !important;
                padding: 10px !important;
            }
            .button {
                display: block !important;
                width: 100% !important;
                box-sizing: border-box;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f9; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table class="container" border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #2563eb; padding: 30px 0;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">MediStore</h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <h2 style="color: #1f2937; margin-top: 0;">Verify your email address</h2>
                            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Thanks for signing up! We're excited to have you on board. To complete your registration and start exploring, please click the button below to verify your account.
                            </p>
                            
                            <!-- Action Button -->
                            <div style="padding: 30px 0; text-align: center;">
                                <a href="${verificationUrl}" target="_blank" style="background-color: #2563eb; color: #ffffff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">
                                    Verify Email Address
                                </a>
                            </div>
                            
                            <p style="color: #4b5563; font-size: 14px; line-height: 1.6;">
                                If you did not create an account, you can safely ignore this email. This link will expire in 24 hours.
                            </p>
                            
                            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                            
                            <!-- Troubleshoot -->
                            <p style="color: #9ca3af; font-size: 12px; line-height: 1.5;">
                                If you're having trouble clicking the button, copy and paste the URL below into your web browser:
                                <br>
                                <a href="${verificationUrl}" style="color: #2563eb; word-break: break-all;">${verificationUrl}</a>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 0 30px 30px 30px; text-align: center; color: #9ca3af; font-size: 12px;">
                            <p style="margin: 0;">&copy; 2026 MediStore. All rights reserved.</p>
                            <p style="margin: 5px 0 0;">123 Health Ave, Suite 456, City, Country</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
      `,
      });
    },
  },

  trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],

  session: {
    cookieCache: {
      enabled: true,
      maxAge: 20 * 60,
    },
  },
  advanced: {
    cookiePrefix: "better-auth",
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    disableCSRFCheck: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "CUSTOMER",
      },
    },
  },
});
