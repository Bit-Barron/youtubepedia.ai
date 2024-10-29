export const plans = [
	{
		name: 'Basic',
		price: 9.99,
		features: ['Analyze up to 10 videos per month', 'Basic question answering', 'Email support'],
		recommended: false
	},
	{
		name: 'Pro',
		price: 19.99,
		features: [
			'Analyze up to 50 videos per month',
			'Advanced question answering',
			'Priority email support',
			'Custom video summaries'
		],
		recommended: true
	},
	{
		name: 'Enterprise',
		price: 49.99,
		features: [
			'Unlimited video analysis',
			'Advanced AI-powered insights',
			'24/7 priority support',
			'Custom integrations',
			'Dedicated account manager'
		],
		recommended: false
	}
];