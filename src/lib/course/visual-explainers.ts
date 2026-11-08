export type ExplainerStep = {
	id: string;
	label: string;
	title: string;
	detail: string;
	note: string;
};

export type VisualExplainer = {
	heading: string;
	intro: string;
	noticeLabel: string;
	items: ExplainerStep[];
};

export const visualExplainers: Record<string, VisualExplainer> = {
	'four-steps': {
		heading: 'The work gets wider before it gets louder',
		intro:
			'Use this model to see why “just promote it harder” is usually a step-three answer to a step-one or step-two problem.',
		noticeLabel: 'What to notice',
		items: [
			{
				id: 'invent',
				label: '01',
				title: 'Invent something worth making',
				detail:
					'Find the change, contribution, or tension that is interesting enough to earn attention in the first place.',
				note: 'This is where a product idea or angle becomes worth talking about.'
			},
			{
				id: 'build',
				label: '02',
				title: 'Build it so people benefit',
				detail:
					'Make the product or service actually relieve the problem instead of relying on story alone.',
				note: 'A strong story cannot save a painful first experience.'
			},
			{
				id: 'tell',
				label: '03',
				title: 'Tell the right people in the right way',
				detail:
					'Pages, posts, launches, and outreach belong here, after the product and angle are coherent.',
				note: 'This is the slice most teams call marketing, but it is only one step.'
			},
			{
				id: 'show-up',
				label: '04',
				title: 'Show up consistently',
				detail:
					'Support, iteration, repetition, and long-term presence are part of the job, not optional cleanup after launch.',
				note: 'Consistency is not a streak; it is sustained helpful presence.'
			}
		]
	},
	circles: {
		heading: 'When marketing feels noisy, move one circle inward',
		intro:
			'The outer layer is promotion. The deeper layers are story, experience, and product. Fixing the right layer changes the work dramatically.',
		noticeLabel: 'Use the circles this way',
		items: [
			{
				id: 'promotion',
				label: 'Outer',
				title: 'Shouting about what already exists',
				detail:
					'Posts, ads, launches, and slogans live here. Useful, but weak when the inner layers are still fuzzy.',
				note: 'Buying a louder megaphone does not repair a weak product or muddy story.'
			},
			{
				id: 'story',
				label: 'Story',
				title: 'A story for a tribe',
				detail:
					'This is where you clarify who the work is for, what struggle it names, and what change it promises.',
				note: 'If the wrong people are comparing you, the story likely needs work.'
			},
			{
				id: 'experience',
				label: 'Use',
				title: 'The surrounding experience',
				detail:
					'Onboarding, trust, proof, and moments of confusion sit here. This is often what buyers actually feel.',
				note: 'A messy journey makes every promotion look like a broken promise.'
			},
			{
				id: 'product',
				label: 'Core',
				title: 'The product itself',
				detail:
					'Some problems are product problems. If the thing does not help, positioning cannot rescue it for long.',
				note: 'Sometimes the honest fix is to improve the thing before you promote it.'
			}
		]
	},
	'channel-choice': {
		heading: 'One channel first, backup later',
		intro:
			'The early job is not variety. It is finding one channel that can repeatedly reach the right people without collapsing your focus.',
		noticeLabel: 'How to read the choice',
		items: [
			{
				id: 'match',
				label: '01',
				title: 'Pick the place your audience already uses',
				detail:
					'Start where the buyer’s attention is already trained instead of inventing a new habit for them.',
				note: 'The best channel is often the one with the shortest path to a real buyer question.'
			},
			{
				id: 'repeat',
				label: '02',
				title: 'Repeat until you learn the pattern',
				detail:
					'Stay long enough to see what message, format, and proof actually work in that one environment.',
				note: 'Adding a second channel too early often protects you from learning the first one.'
			},
			{
				id: 'backup',
				label: '03',
				title: 'Add a backup once the first one works',
				detail:
					'The second channel reduces platform dependence only after the first channel has become legible.',
				note: 'Backup is resilience, not procrastination disguised as diversification.'
			}
		]
	},
	'positioning-frame': {
		heading: 'Positioning changes what people compare you against',
		intro:
			'Your strength only looks obvious when the comparison frame is right. This explainer turns “different” into a more concrete choice.',
		noticeLabel: 'Frame the comparison',
		items: [
			{
				id: 'strength',
				label: 'Strength',
				title: 'Name the real strength',
				detail:
					'Start with the thing you genuinely do better or more cleanly than alternatives.',
				note: 'Positioning begins with reality, not with a slogan workshop.'
			},
			{
				id: 'wrong-frame',
				label: 'Wrong',
				title: 'Notice the wrong comparison',
				detail:
					'If buyers compare you to the wrong alternative, your real edge disappears before it can matter.',
				note: 'This is why strong products still sound ordinary in the wrong category.'
			},
			{
				id: 'better-frame',
				label: 'Better',
				title: 'Choose the frame that makes the strength legible',
				detail:
					'Shift the story so people evaluate you against the right baseline, problem, or substitute.',
				note: 'The goal is not novelty for its own sake; it is easier understanding.'
			}
		]
	},
	'homepage-frame': {
		heading: 'A homepage is a sequence, not a collage',
		intro:
			'The early homepage has to answer what this is, who it is for, and why to trust it before decoration tries to help.',
		noticeLabel: 'Check the first screen',
		items: [
			{
				id: 'hero',
				label: 'Hero',
				title: 'Problem, product, audience, difference',
				detail:
					'The hero should let a stranger explain the page back to you without guessing.',
				note: 'If the first screen is vague, more traffic compounds confusion.'
			},
			{
				id: 'proof',
				label: 'Proof',
				title: 'Trust arrives early',
				detail:
					'Social proof, examples, or concrete evidence belong near the opening, not buried at the bottom.',
				note: 'Believability is part of comprehension.'
			},
			{
				id: 'flow',
				label: 'Flow',
				title: 'Benefits and next step follow naturally',
				detail:
					'Once the reader understands the page, benefits and CTA should feel like continuation, not surprise.',
				note: 'Messaging comes before copy, and copy comes before decoration.'
			}
		]
	},
	'journey-stack': {
		heading: 'The journey is a stack, not a single metric',
		intro:
			'Acquisition is only one layer. Confusion, activation, trust, and retention can fail even when traffic looks fine.',
		noticeLabel: 'Read the stack top to bottom',
		items: [
			{
				id: 'find',
				label: 'Find',
				title: 'People can find you',
				detail: 'Visibility gets someone to the door, but it does not explain what happens next.',
				note: 'Traffic is the entry point, not the whole journey.'
			},
			{
				id: 'understand',
				label: 'Sense',
				title: 'They understand and start',
				detail: 'The path from first screen to first value has to make sense quickly.',
				note: 'Many leaks are understanding leaks, not demand leaks.'
			},
			{
				id: 'stay',
				label: 'Stay',
				title: 'They stay, trust, and pay',
				detail:
					'Retention, trust, and revenue reveal whether the promise actually held through the experience.',
				note: 'A journey metric matters most when it changes what you fix next.'
			}
		]
	},
	'proof-ladder': {
		heading: 'Launch proof works like a ladder',
		intro:
			'People need a reason to care and a reason to believe. Good proof climbs from story to evidence instead of stopping at excitement.',
		noticeLabel: 'Climb upward',
		items: [
			{
				id: 'care',
				label: 'Care',
				title: 'A specific story earns attention',
				detail:
					'The launch starts with a problem or tension a stranger can immediately care about.',
				note: '“We are excited to announce” is not a story.'
			},
			{
				id: 'demo',
				label: 'Show',
				title: 'An extreme true demo makes it concrete',
				detail:
					'Show the thing in action at the sharpest truthful edge so people can picture the change.',
				note: 'The demo is where the promise stops being abstract.'
			},
			{
				id: 'proof',
				label: 'Believe',
				title: 'Proof makes the claim believable',
				detail:
					'Evidence, specifics, and third-party signals help the launch survive skepticism.',
				note: 'Care gets attention; proof keeps trust.'
			}
		]
	},
	'ai-citation': {
		heading: 'AI answers follow trusted sources',
		intro:
			'When an assistant recommends someone else, the useful move is to inspect the source path and the question it trusted.',
		noticeLabel: 'Diagnose before you publish',
		items: [
			{
				id: 'question',
				label: 'Q',
				title: 'Start from the buyer question',
				detail:
					'The assistant is responding to a real buying prompt, not to your content plan in the abstract.',
				note: 'Questions shape what sources even have a chance to appear.'
			},
			{
				id: 'source',
				label: 'S',
				title: 'Trace the source it trusted',
				detail:
					'Look at which page, directory, or citation the assistant pulled into the answer.',
				note: 'The trusted source is the diagnostic clue.'
			},
			{
				id: 'gap',
				label: 'Gap',
				title: 'Fix the missing evidence or coverage',
				detail:
					'Once you know the trusted source path, improve the specific missing signal rather than publishing random filler.',
				note: 'A new blog post is not always the missing ingredient.'
			}
		]
	},
	'test-loop': {
		heading: 'A test is a written loop, not hopeful activity',
		intro:
			'Good measurement forces you to define success before you touch the lever and to save the learning after the result arrives.',
		noticeLabel: 'Close the loop',
		items: [
			{
				id: 'guess',
				label: '01',
				title: 'Write the guess',
				detail:
					'Name the change, the audience, and what result would count as success before you start.',
				note: 'Without a success line, you are hoping rather than testing.'
			},
			{
				id: 'change',
				label: '02',
				title: 'Change one thing',
				detail:
					'Keep the comparison fair enough that the result can actually teach you something.',
				note: 'Too many simultaneous changes erase the lesson.'
			},
			{
				id: 'learn',
				label: '03',
				title: 'Save the lesson, not the chaos',
				detail:
					'Write the rule and how you know it, so the next test starts from evidence instead of memory haze.',
				note: 'Learning compounds when the note is small and reusable.'
			}
		]
	},
	'agent-charter': {
		heading: 'A charter is what makes an assistant repeatable',
		intro:
			'Prompts are one-off asks. Charters define the job, the inputs, and the boundaries so the work can be repeated safely.',
		noticeLabel: 'Charter the job',
		items: [
			{
				id: 'job',
				label: 'Job',
				title: 'Name one job clearly',
				detail:
					'Give the assistant one bounded responsibility instead of a fuzzy role with shifting expectations.',
				note: 'A narrow job is easier to test and trust.'
			},
			{
				id: 'inputs',
				label: 'Inputs',
				title: 'Provide files before giving access',
				detail:
					'Give the assistant concrete source material before it touches live systems or invents context.',
				note: 'Good context is safer than broad permissions.'
			},
			{
				id: 'limits',
				label: 'Limits',
				title: 'Write what it must never do alone',
				detail:
					'Spending, sending, promising, and publishing need explicit review boundaries.',
				note: 'Safety comes from boundaries, not from optimism.'
			}
		]
	},
	'ownership-boundary': {
		heading: 'Ownership depends on the cost of being wrong',
		intro:
			'The question is not whether an assistant helped. The question is whether you still understand and own the result that leaves your hands.',
		noticeLabel: 'Hold the boundary',
		items: [
			{
				id: 'cheap',
				label: 'Cheap',
				title: 'Cheap-to-be-wrong work can move faster',
				detail:
					'Brainstorms and rough drafts are places where fast iteration matters more than perfect certainty.',
				note: 'Speed is safest where mistakes are recoverable.'
			},
			{
				id: 'review',
				label: 'Review',
				title: 'Some work can be drafted, then reviewed',
				detail:
					'Research synthesis, copy variants, and structured options often benefit from assistant help plus human review.',
				note: 'Review is still ownership if you can explain the result.'
			},
			{
				id: 'critical',
				label: 'Critical',
				title: 'High-cost answers stay human-owned',
				detail:
					'Anything that affects customers, money, or trust needs a human who can stand behind the answer.',
				note: 'If you cannot explain it, you do not yet own it.'
			}
		]
	}
};
