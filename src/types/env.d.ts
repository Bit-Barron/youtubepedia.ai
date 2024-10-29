declare global {
	namespace App {
		interface Env {
			GOOGLE_CLIENT_ID: string;
			GOOGLE_CLIENT_SECRET: string;
			SMTP_USER: string;
			SMTP_PASS: string;
			PUBLIC_SITE_URL: string;
		}
	}
}
