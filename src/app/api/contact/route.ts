import nodemailer from "nodemailer";

export async function POST(req: Request) {
    const { name, email, message, company } = await req.json();

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // ✅ 1. ALWAYS send email to YOU (critical)
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: process.env.EMAIL_USER,
            subject: `New Contact - ${name}`,
            text: `
New lead received:

Name: ${name}
Email: ${email}
Company: ${company}
Message: ${message}
      `,
        });

        // ✅ 2. Try sending auto-reply (non-critical)
        try {
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "We received your message",
                text: `Hi ${name},

Thanks for reaching out to Frames n Spaces.
Our team will get back to you shortly.

— Team Frames n Spaces`,
            });
        } catch (err) {
            console.warn("Auto-reply failed (invalid email likely):", err);
        }

        return Response.json({ success: true });

    } catch (error) {
        console.error("Main email failed:", error);
        return Response.json({ success: false }, { status: 500 });
    }
}