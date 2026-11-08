import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { toString } from 'mdast-util-to-string';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';

import { courseData } from '../src/lib/generated/course-data.ts';
import { moduleDesigns, lessonVisualKinds } from '../src/lib/course/learning-design.ts';
import { visualExplainers } from '../src/lib/course/visual-explainers.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const COURSE_ROOT = path.join(ROOT, 'course');
const REPORT_ROOT = path.join(ROOT, 'reports', 'narration');

const segmenter = new Intl.Segmenter('en', { granularity: 'word' });

const ensureDir = async (target) => fs.mkdir(target, { recursive: true });

const stripFrontmatter = (file) => {
	const lines = file.split(/\r?\n/);
	if (lines[0] !== '---') return file;

	let cursor = 1;
	while (cursor < lines.length && lines[cursor] !== '---') {
		cursor += 1;
	}

	return cursor < lines.length ? lines.slice(cursor + 1).join('\n') : file;
};

const blockToText = (node) => {
	switch (node.type) {
		case 'heading':
		case 'paragraph':
		case 'blockquote':
			return toString(node).trim();
		case 'list':
			return node.children
				.map((child) => `- ${blockToText(child).replace(/^- /, '').trim()}`)
				.filter(Boolean)
				.join('\n');
		case 'listItem':
			return (node.children ?? []).map(blockToText).filter(Boolean).join(' ');
		case 'code':
			return node.value?.trim() ?? '';
		default:
			return toString(node).trim();
	}
};

const serializeMarkdown = (markdown) => {
	const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
	return tree.children
		.map(blockToText)
		.filter(Boolean)
		.join('\n\n')
		replace(/https?:\/\/\S+/g, '')
		replace(/[ \t]+\n/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();
};

const normalizeText = (text) =>
	text
		.replace(/[ \t]+\n/g, '\n')
		.replace(/\n{3,}/g, '\n\n')
		.trim();

const stripNarrationChrome = (text, title) =>
	normalizeText(
		text
			.replace(new RegExp(`^${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\n\\n`), '')
			.replace(/^About \d+ minutes to read\..*These are estimates\.\n\n?/m, '')
	);

const getCounts = (text) => ({
	words: Array.from(segmenter.segment(text)).filter((segment) => segment.isWordLike).length,
	characters: Array.from(text).length
});

const lessonNarrationText = (lesson, bodyText) => {
	const visualKind = lessonVisualKinds[lesson.id];
	const visual = visualKind ? visualExplainers[visualKind] : null;

	const parts = [lesson.title, lesson.summary, `Takeaway: ${lesson.takeaway}`, bodyText];

	if (visual) {
		parts.push(
			'Visual explainer',
			visual.heading,
			visual.intro,
			...visual.items.flatMap((item) => [item.title, item.detail, item.note])
		);
	}

	return normalizeText(parts.filter(Boolean).join('\n\n'));
};

const templateNarrationText = (template, bodyText) =>
	normalizeText([template.title, bodyText].filter(Boolean).join('\n\n'));

const moduleNarrationText = (moduleDesign) =>
	normalizeText(
		[
			moduleDesign.title,
			moduleDesign.intro,
			moduleDesign.intent,
			'Core questions',
			...moduleDesign.questions.map((question) => `- ${question}`),
			'Practice focus',
			moduleDesign.practice,
			'Learning map',
			moduleDesign.diagramLabel,
			...moduleDesign.figureItems.flatMap((item) => [item.title, item.detail])
		].join('\n\n')
	);

const sumCounts = (entries) =>
	entries.reduce(
		(acc, entry) => ({
			words: acc.words + entry.words,
			characters: acc.characters + entry.characters
		}),
		{ words: 0, characters: 0 }
	);

const listFiles = async (directory) => {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const absolute = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await listFiles(absolute)));
		} else {
			files.push(absolute);
		}
	}

	return files;
};

await ensureDir(REPORT_ROOT);
await ensureDir(path.join(REPORT_ROOT, 'lessons'));
await ensureDir(path.join(REPORT_ROOT, 'templates'));
await ensureDir(path.join(REPORT_ROOT, 'modules'));

const lessonEntries = [];
const templateEntries = [];
const moduleEntries = [];

for (const lesson of courseData.lessons) {
	const sourcePath = path.join(COURSE_ROOT, lesson.path);
	const rawMarkdown = await fs.readFile(sourcePath, 'utf8');
	const bodyText = stripNarrationChrome(
		serializeMarkdown(stripFrontmatter(rawMarkdown)),
		lesson.title
	);
	const narrationText = lessonNarrationText(lesson, bodyText);
	const narrationPath = path.join(REPORT_ROOT, 'lessons', `${lesson.id}.txt`);

	await fs.writeFile(narrationPath, narrationText, 'utf8');

	lessonEntries.push({
		id: lesson.id,
		title: lesson.title,
		slug: lesson.slug,
		optional: lesson.optional,
		sourcePath: path.relative(ROOT, sourcePath),
		narrationPath: path.relative(ROOT, narrationPath),
		rawSource: getCounts(rawMarkdown),
		narration: getCounts(narrationText),
		visualKind: lessonVisualKinds[lesson.id] ?? null,
		creditItemIds: lesson.creditItems.map((item) => item.id),
		sourceIds: Array.from(
			new Set(
				lesson.creditItems.flatMap((item) => [
					...item.sources.map((source) => source.source_id),
					...item.informed_by.map((source) => source.source_id)
				])
			)
		)
	});
}

for (const template of courseData.templates) {
	const sourcePath = path.join(COURSE_ROOT, template.path);
	const rawMarkdown = await fs.readFile(sourcePath, 'utf8');
	const bodyText = stripNarrationChrome(serializeMarkdown(rawMarkdown), template.title);
	const narrationText = templateNarrationText(template, bodyText);
	const narrationPath = path.join(REPORT_ROOT, 'templates', `${template.id}.txt`);

	await fs.writeFile(narrationPath, narrationText, 'utf8');

	templateEntries.push({
		id: template.id,
		title: template.title,
		sourcePath: path.relative(ROOT, sourcePath),
		narrationPath: path.relative(ROOT, narrationPath),
		rawSource: getCounts(rawMarkdown),
		narration: getCounts(narrationText)
	});
}

for (const moduleDesign of moduleDesigns) {
	const narrationText = moduleNarrationText(moduleDesign);
	const narrationPath = path.join(REPORT_ROOT, 'modules', `${moduleDesign.slug}.txt`);
	await fs.writeFile(narrationPath, narrationText, 'utf8');

	moduleEntries.push({
		id: moduleDesign.id,
		slug: moduleDesign.slug,
		title: moduleDesign.title,
		narrationPath: path.relative(ROOT, narrationPath),
		narration: getCounts(narrationText)
	});
}

const courseFiles = await listFiles(COURSE_ROOT);
const courseFileCounts = [];

for (const filePath of courseFiles) {
	const raw = await fs.readFile(filePath, 'utf8');
	courseFileCounts.push({
		path: path.relative(ROOT, filePath),
		...getCounts(raw)
	});
}

const coreLessons = lessonEntries.filter((lesson) => !lesson.optional);
const optionalLessons = lessonEntries.filter((lesson) => lesson.optional);

const report = {
	generatedAt: new Date().toISOString(),
	inclusionPolicy: {
		rawSource:
			'Raw-source counts measure committed source files as written, including frontmatter and markdown markup for lesson/template files.',
		narration:
			'Narration-ready counts include title, summary, lesson body text with markdown/URLs stripped, module overview teaching text, and visual explainer text where that explainer adds new teaching copy. They exclude credits panels, source-library entries, navigation labels, timers, and repeated chrome.'
	},
	summary: {
		rawSource: {
			coreLessons: sumCounts(coreLessons.map((entry) => entry.rawSource)),
			optionalLessons: sumCounts(optionalLessons.map((entry) => entry.rawSource)),
			templates: sumCounts(templateEntries.map((entry) => entry.rawSource)),
			lessonAndTemplateTotal: sumCounts(
				[...lessonEntries, ...templateEntries].map((entry) => entry.rawSource)
			),
			fullCourseFiles: {
				...sumCounts(courseFileCounts),
				files: courseFileCounts.length
			}
		},
		narrationReady: {
			moduleOverviews: sumCounts(moduleEntries.map((entry) => entry.narration)),
			coreLessons: sumCounts(coreLessons.map((entry) => entry.narration)),
			optionalLessons: sumCounts(optionalLessons.map((entry) => entry.narration)),
			templates: sumCounts(templateEntries.map((entry) => entry.narration)),
			total: sumCounts(
				[...moduleEntries, ...lessonEntries, ...templateEntries].map((entry) => entry.narration)
			)
		}
	},
	entries: {
		modules: moduleEntries,
		lessons: lessonEntries,
		templates: templateEntries,
		courseFiles: courseFileCounts
	}
};

const markdownReport = `# Narration and source counts

Generated: ${report.generatedAt}

## Inclusion choices

- **Raw source** counts use committed files exactly as written.
- **Narration-ready** counts strip lesson/template markdown markup and URLs.
- Narration-ready counts **include** lesson titles, summaries, rendered teaching text, module overview teaching text, and new visual-explainer teaching copy.
- Narration-ready counts **exclude** navigation labels, timers, notes/bookmark UI, source-library duplication, and on-demand credits lists.

## Raw source counts

| Bucket | Words | Characters |
| --- | ---: | ---: |
| Core lessons | ${report.summary.rawSource.coreLessons.words} | ${report.summary.rawSource.coreLessons.characters} |
| Optional lessons | ${report.summary.rawSource.optionalLessons.words} | ${report.summary.rawSource.optionalLessons.characters} |
| Templates | ${report.summary.rawSource.templates.words} | ${report.summary.rawSource.templates.characters} |
| Lessons + templates total | ${report.summary.rawSource.lessonAndTemplateTotal.words} | ${report.summary.rawSource.lessonAndTemplateTotal.characters} |
| Full committed course files (${report.summary.rawSource.fullCourseFiles.files} files) | ${report.summary.rawSource.fullCourseFiles.words} | ${report.summary.rawSource.fullCourseFiles.characters} |

## Narration-ready visible-text counts

| Bucket | Words | Characters |
| --- | ---: | ---: |
| Module overviews | ${report.summary.narrationReady.moduleOverviews.words} | ${report.summary.narrationReady.moduleOverviews.characters} |
| Core lessons | ${report.summary.narrationReady.coreLessons.words} | ${report.summary.narrationReady.coreLessons.characters} |
| Optional lessons | ${report.summary.narrationReady.optionalLessons.words} | ${report.summary.narrationReady.optionalLessons.characters} |
| Templates | ${report.summary.narrationReady.templates.words} | ${report.summary.narrationReady.templates.characters} |
| Total narrated teaching | ${report.summary.narrationReady.total.words} | ${report.summary.narrationReady.total.characters} |
`;

await fs.writeFile(path.join(REPORT_ROOT, 'manifest.json'), JSON.stringify(report, null, 2), 'utf8');
await fs.writeFile(path.join(REPORT_ROOT, 'counts.md'), markdownReport, 'utf8');
await fs.writeFile(path.join(REPORT_ROOT, 'counts.json'), JSON.stringify(report.summary, null, 2), 'utf8');

console.log(`Narration exports written to ${path.relative(ROOT, REPORT_ROOT)}`);
