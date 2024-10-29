import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS
	},
	host: 'smtp.gmail.com',
	port: 587,
	secure: false
});

export async function sendEmail(to: string, subject: string, html: string) {
	try {
		const result = await transporter.sendMail({
			from: process.env.GMAIL_USER,
			to,
			subject,
			html
		});
		return result;
	} catch (error) {
		console.error('Error sending email:', error);
		throw error;
	}
}
