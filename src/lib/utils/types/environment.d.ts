declare namespace NodeJS {
	export interface ProcessEnv {
		DATABASE_URL: string;
		SMTP_HOST: string;
		SMTP_PORT: string;
		SMTP_SERVICE: string;
		SMTP_USER: string;
		SMTP_PASS: string;
		GOOGLE_CLIENT_ID: string;
		GOOGLE_CLIENT_SECRET: string;
		PUBLIC_SITE_URL: string;
		GROQ_API_KEY: string;
	}
}
