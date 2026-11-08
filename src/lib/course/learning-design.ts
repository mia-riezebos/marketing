export type ModuleAccent = {
	accent: string;
	soft: string;
	deep: string;
	glow: string;
};

export type ModuleDesign = {
	id: string;
	slug: string;
	kicker: string;
	title: string;
	intro: string;
	intent: string;
	questions: string[];
	practice: string;
	diagramLabel: string;
	figureMode: 'path' | 'grid' | 'rail';
	figureItems: { title: string; detail: string }[];
	accent: ModuleAccent;
};

export const moduleDesigns: ModuleDesign[] = [
	{
		id: 'start',
		slug: 'start-here',
		kicker: 'How to use the course',
		title: 'Start here',
		intro: 'Orient the reader around pacing, labels, and what counts as done.',
		intent: 'Lower pressure, explain the rules of evidence, and make stopping safe from the start.',
		questions: [
			'What does this course count as done?',
			'How are claims, methods, findings, and synthesis labeled?',
			'What practice object are you using while you learn?'
		],
		practice: 'Pick one product or imaginary idea and commit to learning without publishing or spending.',
		diagramLabel: 'A low-pressure lesson rhythm from read to action to done.',
		figureMode: 'path',
		figureItems: [
			{ title: 'Read one lesson', detail: 'Take the takeaway first.' },
			{ title: 'Do the smallest action', detail: 'Keep the activity bounded.' },
			{ title: 'Stop at done', detail: 'No guilt, no quota, no streak.' }
		],
		accent: {
			accent: '#4a5bdc',
			soft: '#eef1ff',
			deep: '#23308f',
			glow: 'rgba(74, 91, 220, 0.12)'
		}
	},
	{
		id: 'I',
		slug: 'see-clearly',
		kicker: 'Part I',
		title: 'See clearly',
		intro: 'Build the mental model before you reach for channels, copy, or tools.',
		intent: 'This module reframes marketing as product, story, channel, and learning discipline rather than noise.',
		questions: [
			'What job is marketing actually doing?',
			'Which level of the problem needs attention first?',
			'What changes once you define the audience, difference, and channel together?'
		],
		practice: 'Use the lessons here to clarify the change you create before you publish or optimize.',
		diagramLabel: 'A concept map linking the four-step model, inner circles, and positioning work.',
		figureMode: 'grid',
		figureItems: [
			{ title: 'See the job', detail: 'Marketing is wider than promotion.' },
			{ title: 'See the layer', detail: 'Move inward when shouting is the wrong fix.' },
			{ title: 'See the difference', detail: 'Clarify audience, channel, and positioning together.' }
		],
		accent: {
			accent: '#6f59d9',
			soft: '#f1edff',
			deep: '#34206d',
			glow: 'rgba(111, 89, 217, 0.14)'
		}
	},
	{
		id: 'II',
		slug: 'make-the-thing-make-sense',
		kicker: 'Part II',
		title: 'Make the thing make sense',
		intro: 'Translate the strategy into an experience a stranger can quickly understand.',
		intent: 'This is where messaging, proof, and the whole journey become legible instead of decorative.',
		questions: [
			'Can a stranger explain what you do after the first screen?',
			'Where does confusion enter the journey?',
			'What evidence makes your launch believable?'
		],
		practice: 'Audit the path from first impression to trust signal before you ask for more traffic.',
		diagramLabel: 'A journey stack showing message, proof, and path as one system.',
		figureMode: 'path',
		figureItems: [
			{ title: 'Make sense fast', detail: 'Homepage clarity before decoration.' },
			{ title: 'Follow the full journey', detail: 'Acquisition is only one layer.' },
			{ title: 'Show believable proof', detail: 'Trust closes the gap between interest and action.' }
		],
		accent: {
			accent: '#d86c4d',
			soft: '#fff0eb',
			deep: '#8f3d22',
			glow: 'rgba(216, 108, 77, 0.14)'
		}
	},
	{
		id: 'III',
		slug: 'get-found-by-people',
		kicker: 'Part III',
		title: 'Get found by people',
		intro: 'Pick a vehicle, then make individual ideas easy to finish and repeat.',
		intent: 'The module turns distribution from “be everywhere” into a manageable story cadence.',
		questions: [
			'Where does your audience already spend time?',
			'What one idea can a tired person finish?',
			'What part of the vehicle do you own versus rent?'
		],
		practice: 'Choose the smallest durable publishing habit that still carries a clear story.',
		diagramLabel: 'A story vehicle moving one clear idea at a time through owned and rented surfaces.',
		figureMode: 'rail',
		figureItems: [
			{ title: 'Pick a vehicle', detail: 'Choose a place you can keep showing up in.' },
			{ title: 'Ship one finishable idea', detail: 'Clarity beats cleverness when attention is thin.' }
		],
		accent: {
			accent: '#1d8a7a',
			soft: '#e9fbf6',
			deep: '#0f4c43',
			glow: 'rgba(29, 138, 122, 0.14)'
		}
	},
	{
		id: 'IV',
		slug: 'be-findable',
		kicker: 'Part IV',
		title: 'Be findable',
		intro: 'Treat search, assistants, and directories as overlapping visibility systems.',
		intent: 'This module helps the learner diagnose discoverability before adding more content.',
		questions: [
			'Can machines clearly read the page you already have?',
			'What source or listing is shaping recommendations?',
			'Which buyer rooms are worth an honest presence?'
		],
		practice: 'Start with technical clarity and source trust before chasing volume.',
		diagramLabel: 'A visibility ecosystem spanning your site, search, AI answers, and buyer directories.',
		figureMode: 'grid',
		figureItems: [
			{ title: 'Your site', detail: 'Readable, crawlable, consistent.' },
			{ title: 'Search + AI', detail: 'Earn trust where buying questions are answered.' },
			{ title: 'Buyer rooms', detail: 'Show up in directories and marketplaces people already consult.' }
		],
		accent: {
			accent: '#2f6fed',
			soft: '#eaf3ff',
			deep: '#163c8c',
			glow: 'rgba(47, 111, 237, 0.14)'
		}
	},
	{
		id: 'V',
		slug: 'learn-what-worked',
		kicker: 'Part V',
		title: 'Learn what worked',
		intro: 'Reduce guesswork into a clear test, a fair comparison, and a written lesson.',
		intent: 'This module keeps measurement honest so activity does not masquerade as evidence.',
		questions: [
			'What exactly changed?',
			'What would success have looked like before you ran it?',
			'What part of the result can you trust?'
		],
		practice: 'Write success lines before touching the lever.',
		diagramLabel: 'A small experiment loop from written hypothesis to reusable learning.',
		figureMode: 'path',
		figureItems: [
			{ title: 'Write the guess', detail: 'Name the success line before you start.' },
			{ title: 'Change one thing', detail: 'Keep the comparison fair.' },
			{ title: 'Save the learning', detail: 'Carry forward the rule, not a pile of noise.' }
		],
		accent: {
			accent: '#b78916',
			soft: '#fff6dc',
			deep: '#6b4e05',
			glow: 'rgba(183, 137, 22, 0.16)'
		}
	},
	{
		id: 'VI',
		slug: 'work-with-agents',
		kicker: 'Part VI',
		title: 'Work with agents without giving up judgment',
		intro: 'Use assistants as bounded collaborators, not autonomous truth machines.',
		intent: 'This module turns AI work into ownership, charters, and judgment rather than magical delegation.',
		questions: [
			'What is the bot allowed to do without asking?',
			'Where does ownership of the answer stay human?',
			'What should be remembered as a lesson rather than a log?'
		],
		practice: 'Define authority boundaries before you automate.',
		diagramLabel: 'A boundary map of human judgment, assistant drafting, and reusable memory.',
		figureMode: 'grid',
		figureItems: [
			{ title: 'Charter the assistant', detail: 'Give one job with explicit boundaries.' },
			{ title: 'Keep human ownership', detail: 'Drafting can be delegated; judgment cannot.' },
			{ title: 'Save reusable lessons', detail: 'Memory should store what stays true.' }
		],
		accent: {
			accent: '#4f6b86',
			soft: '#edf4fb',
			deep: '#233345',
			glow: 'rgba(79, 107, 134, 0.16)'
		}
	},
	{
		id: 'optional',
		slug: 'optional-depth',
		kicker: 'Optional depth',
		title: 'Optional depth',
		intro: 'Use these branches for extra texture, sharper edge cases, and more advanced interpretations.',
		intent: 'These lessons are reference detours, not prerequisites.',
		questions: [
			'Which topic needs extra nuance for your situation?',
			'What tactic is interesting but risky?',
			'What concept belongs in your mental map, not your to-do list?'
		],
		practice: 'Treat optional lessons like a reference shelf rather than a sequence you owe.',
		diagramLabel: 'A branching shelf of optional topics that can be opened without breaking the core path.',
		figureMode: 'grid',
		figureItems: [
			{ title: 'Interpret the edge case', detail: 'Use optional lessons for nuance, not guilt.' },
			{ title: 'Take the map, not the dare', detail: 'Some lessons sharpen judgment without becoming homework.' },
			{ title: 'Return to the core path', detail: 'Optional depth should enrich the journey, not fragment it.' }
		],
		accent: {
			accent: '#8d5a7a',
			soft: '#fbecf5',
			deep: '#50263d',
			glow: 'rgba(141, 90, 122, 0.16)'
		}
	}
];

export const moduleDesignById = new Map(moduleDesigns.map((design) => [design.id, design]));
export const moduleDesignBySlug = new Map(moduleDesigns.map((design) => [design.slug, design]));

export const lessonVisualKinds: Record<string, string> = {
	'01-what-marketing-is': 'four-steps',
	'02-go-one-circle-in': 'circles',
	'04-one-channel-first': 'channel-choice',
	'07-make-the-difference-obvious': 'positioning-frame',
	'11-homepage-that-makes-sense': 'homepage-frame',
	'12-the-whole-journey': 'journey-stack',
	'13-show-proof-when-you-launch': 'proof-ladder',
	'18-show-up-in-ai-answers': 'ai-citation',
	'20-trust-what-you-measure': 'test-loop',
	'21-give-a-bot-one-job': 'agent-charter',
	'22-keep-ownership': 'ownership-boundary'
};

export const moduleStyle = (design: ModuleDesign) =>
	`--module-accent:${design.accent.accent};--module-soft:${design.accent.soft};--module-deep:${design.accent.deep};--module-glow:${design.accent.glow};`;
