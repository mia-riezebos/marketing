import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import GithubSlugger from 'github-slugger';
import { toString } from 'mdast-util-to-string';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const COURSE_ROOT = path.join(ROOT, 'course');
const GENERATED_DIR = path.join(ROOT, 'src', 'lib', 'generated');
const OUTPUT_FILE = path.join(GENERATED_DIR, 'course-data.ts');
const PROGRESS_META_FILE = path.join(GENERATED_DIR, 'progress-meta.ts');

const COURSE_JSON_PATH = path.join(COURSE_ROOT, 'data', 'COURSE.json');
const SOURCES_JSON_PATH = path.join(COURSE_ROOT, 'data', 'sources.json');
const ITEM_CREDITS_JSON_PATH = path.join(COURSE_ROOT, 'data', 'item-credits.json');
const PROGRESS_SCHEMA_PATH = path.join(COURSE_ROOT, 'data', 'progress.schema.json');

const requiredLessonFields = [
	'id',
	'slug',
	'part',
	'part_title',
	'order',
	'title',
	'summary',
	'read_min',
	'action_min',
	'takeaway',
	'min_action',
	'min_action_output',
	'exercise',
	'exercise_min',
	'exercise_output',
	'stop_when',
	'optional'
];

const numericFields = new Set(['order', 'read_min', 'action_min', 'exercise_min']);
const booleanFields = new Set(['optional']);

const sanitizeSchema = structuredClone(defaultSchema);
sanitizeSchema.attributes = {
	...sanitizeSchema.attributes,
	a: [...(sanitizeSchema.attributes?.a ?? []), 'target', 'rel'],
	h1: [...(sanitizeSchema.attributes?.h1 ?? []), 'id'],
	h2: [...(sanitizeSchema.attributes?.h2 ?? []), 'id'],
	h3: [...(sanitizeSchema.attributes?.h3 ?? []), 'id'],
	h4: [...(sanitizeSchema.attributes?.h4 ?? []), 'id'],
	h5: [...(sanitizeSchema.attributes?.h5 ?? []), 'id'],
	h6: [...(sanitizeSchema.attributes?.h6 ?? []), 'id'],
	code: [...(sanitizeSchema.attributes?.code ?? []), 'className'],
	pre: [...(sanitizeSchema.attributes?.pre ?? []), 'className']
};

const readJson = async (filePath) => JSON.parse(await fs.readFile(filePath, 'utf8'));

const parseScalar = (key, rawValue) => {
	const value = rawValue?.trim() ?? '';

	if (booleanFields.has(key)) {
		return value === 'true';
	}

	if (numericFields.has(key)) {
		return Number.parseInt(value, 10);
	}

	if (value === '[]') {
		return [];
	}

	if (value.startsWith('[') && value.endsWith(']')) {
		return value
			.slice(1, -1)
			.split(',')
			.map((part) => part.trim())
			.filter(Boolean);
	}

	return value;
};

const parseLessonMarkdown = (file, lessonId) => {
	const lines = file.split(/\r?\n/);
	if (lines[0] !== '---') {
		throw new Error(`Lesson ${lessonId} does not begin with frontmatter`);
	}

	let cursor = 1;
	const frontmatterLines = [];

	while (cursor < lines.length && lines[cursor] !== '---') {
		frontmatterLines.push(lines[cursor]);
		cursor += 1;
	}

	if (cursor >= lines.length) {
		throw new Error(`Lesson ${lessonId} is missing a closing frontmatter fence`);
	}

	const frontmatter = {};
	for (const line of frontmatterLines) {
		if (!line.trim() || line.startsWith('  ')) continue;
		if (line === 'items:') break;

		const separatorIndex = line.indexOf(':');
		if (separatorIndex === -1) continue;

		const key = line.slice(0, separatorIndex).trim();
		const rawValue = line.slice(separatorIndex + 1);
		frontmatter[key] = parseScalar(key, rawValue);
	}

	return {
		data: frontmatter,
		content: lines.slice(cursor + 1).join('\n')
	};
};

const ensureFileExists = async (relativePath) => {
	try {
		await fs.access(path.join(COURSE_ROOT, relativePath));
	} catch (error) {
		throw new Error(`Missing course file: ${relativePath}`, { cause: error });
	}
};

const buildPathMaps = (course) => {
	const lessonRouteByPath = new Map();
	const templateRouteByPath = new Map();

	for (const module of course.modules) {
		for (const lesson of module.lessons) {
			lessonRouteByPath.set(path.posix.normalize(lesson.path), `/lessons/${lesson.slug}`);
		}
	}

	for (const template of course.templates) {
		templateRouteByPath.set(path.posix.normalize(template.path), `/templates/${template.id}`);
	}

	return { lessonRouteByPath, templateRouteByPath };
};

const createMarkdownProcessor = (currentFile, pathMaps) =>
	unified()
		.use(remarkParse)
		.use(remarkGfm)
		.use(() => (tree) => {
			visit(tree, 'link', (node) => {
				if (!node.url) return;

				const url = node.url.trim();
				if (/^(https?:|mailto:|tel:|#)/i.test(url)) return;

				const resolved = path.posix.normalize(path.posix.join(path.posix.dirname(currentFile), url));
				const lessonRoute = pathMaps.lessonRouteByPath.get(resolved);
				const templateRoute = pathMaps.templateRouteByPath.get(resolved);

				if (lessonRoute) {
					node.url = lessonRoute;
					return;
				}

				if (templateRoute) {
					node.url = templateRoute;
					return;
				}

				if (node.url.endsWith('.md')) {
					node.url = '#';
				}
			});

			visit(tree, 'link', (node) => {
				if (/^https?:\/\//i.test(node.url)) {
					node.data ??= {};
					node.data.hProperties = {
						...(node.data.hProperties ?? {}),
						target: '_blank',
						rel: 'noreferrer noopener'
					};
				}
			});
		})
		.use(remarkRehype)
		.use(rehypeSlug)
		.use(rehypeSanitize, sanitizeSchema)
		.use(rehypeStringify);

const collectSections = (markdown) => {
	const slugger = new GithubSlugger();
	const tree = unified().use(remarkParse).use(remarkGfm).parse(markdown);
	const sections = [];

	visit(tree, 'heading', (node) => {
		const text = toString(node).trim();
		if (!text) return;

		const id = slugger.slug(text);
		if (node.depth === 2) {
			sections.push({ id, title: text });
		}
	});

	return sections;
};

const renderMarkdown = async (relativePath, markdown, pathMaps) => {
	const processor = createMarkdownProcessor(relativePath, pathMaps);
	return String(await processor.process(markdown)).trim();
};

const buildLessons = async (course, creditsByItemId, pathMaps) => {
	const lessons = [];
	const itemsByLessonId = new Map();

	for (const module of course.modules) {
		for (const lessonMeta of module.lessons) {
			await ensureFileExists(lessonMeta.path);
			const lessonPath = path.join(COURSE_ROOT, lessonMeta.path);
			const file = await fs.readFile(lessonPath, 'utf8');
			const { data, content } = parseLessonMarkdown(file, lessonMeta.id);

			for (const field of requiredLessonFields) {
				if (!(field in data)) {
					throw new Error(`Lesson ${lessonMeta.id} is missing frontmatter field "${field}"`);
				}
			}

			const html = await renderMarkdown(lessonMeta.path, content, pathMaps);
			const sections = collectSections(content);
			const creditItems = (lessonMeta.item_ids ?? []).map((itemId) => {
				const credit = creditsByItemId.get(itemId);
				if (!credit) {
					throw new Error(`Lesson ${lessonMeta.id} references missing credit item ${itemId}`);
				}
				return credit;
			});

			const lesson = {
				id: data.id,
				slug: data.slug,
				part: data.part,
				partTitle: data.part_title,
				order: data.order,
				title: data.title,
				summary: data.summary,
				readMin: data.read_min,
				actionMin: data.action_min,
				takeaway: data.takeaway,
				minAction: data.min_action,
				minActionOutput: data.min_action_output,
				exercise: data.exercise,
				exerciseMin: data.exercise_min,
				exerciseOutput: data.exercise_output,
				stopWhen: data.stop_when,
				optional: data.optional,
				path: lessonMeta.path,
				moduleId: module.id,
				moduleTitle: module.title,
				html,
				sections,
				itemIds: [...(lessonMeta.item_ids ?? [])],
				creditItems
			};

			lessons.push(lesson);
			itemsByLessonId.set(lesson.id, creditItems);
		}
	}

	lessons.sort((a, b) => a.order - b.order);

	return {
		lessons: lessons.map((lesson, index) => ({
			...lesson,
			previousLessonId: lessons[index - 1]?.id ?? null,
			previousLessonSlug: lessons[index - 1]?.slug ?? null,
			nextLessonId: lessons[index + 1]?.id ?? null,
			nextLessonSlug: lessons[index + 1]?.slug ?? null
		})),
		itemsByLessonId
	};
};

const buildTemplates = async (course, pathMaps) => {
	const templates = [];

	for (const templateMeta of course.templates) {
		await ensureFileExists(templateMeta.path);
		const templatePath = path.join(COURSE_ROOT, templateMeta.path);
		const markdown = await fs.readFile(templatePath, 'utf8');
		const html = await renderMarkdown(templateMeta.path, markdown, pathMaps);

		templates.push({
			id: templateMeta.id,
			title: templateMeta.title,
			path: templateMeta.path,
			markdown,
			html,
			downloadName: `${templateMeta.id}.md`
		});
	}

	return templates;
};

const buildModules = (course, lessonLookup) =>
	course.modules.map((module) => ({
		id: module.id,
		title: module.title,
		optional: module.optional,
		lessons: module.lessons.map((lesson) => {
			const fullLesson = lessonLookup.get(lesson.id);
			if (!fullLesson) {
				throw new Error(`Module ${module.id} references missing lesson ${lesson.id}`);
			}

			return {
				id: fullLesson.id,
				slug: fullLesson.slug,
				title: fullLesson.title,
				summary: fullLesson.summary,
				readMin: fullLesson.readMin,
				actionMin: fullLesson.actionMin,
				takeaway: fullLesson.takeaway,
				optional: fullLesson.optional,
				part: fullLesson.part
			};
		})
	}));

const buildSources = (sourceJson, lessonLookup, itemCredits) => {
	const sources = sourceJson.sources ?? [];
	const backlinksBySourceId = new Map();

	for (const credit of itemCredits) {
		const lesson = lessonLookup.get(credit.lesson_id);
		if (!lesson) {
			throw new Error(`Credit item ${credit.id} points to unknown lesson ${credit.lesson_id}`);
		}

		for (const source of credit.sources) {
			const existing = backlinksBySourceId.get(source.source_id) ?? [];
			existing.push({
				lessonId: lesson.id,
				lessonSlug: lesson.slug,
				lessonTitle: lesson.title,
				itemId: credit.id,
				itemKind: credit.kind,
				attribution: credit.attribution,
				statement: credit.statement
			});
			backlinksBySourceId.set(source.source_id, existing);
		}
	}

	return sources.map((source) => ({
		...source,
		backlinks: backlinksBySourceId.get(source.id) ?? []
	}));
};

const buildSearchDocuments = (lessons, templates, sources) => ({
	lessons: lessons.map((lesson) => ({
		id: lesson.id,
		slug: lesson.slug,
		title: lesson.title,
		kind: lesson.optional ? 'optional-lesson' : 'lesson',
		url: `/lessons/${lesson.slug}`,
		excerpt: lesson.summary,
		searchText: [
			lesson.title,
			lesson.summary,
			lesson.takeaway,
			lesson.minAction,
			lesson.exercise,
			lesson.stopWhen,
			...lesson.sections.map((section) => section.title),
			...lesson.creditItems.map((item) => item.statement)
		]
			.filter(Boolean)
			.join(' ')
	})),
	templates: templates.map((template) => ({
		id: template.id,
		title: template.title,
		kind: 'template',
		url: `/templates/${template.id}`,
		excerpt: template.title,
		searchText: `${template.title} ${template.markdown}`
	})),
	sources: sources.map((source) => ({
		id: source.id,
		title: source.title,
		kind: 'source',
		url: `/sources#${source.id}`,
		excerpt: `${source.creator}${source.handle ? ` (${source.handle})` : ''}`,
		searchText: [
			source.title,
			source.creator,
			source.handle,
			source.kind,
			...(source.limitations ?? []),
			...source.backlinks.map((backlink) => `${backlink.lessonTitle} ${backlink.statement}`)
		]
			.filter(Boolean)
			.join(' ')
	}))
});

const assertCounts = (course, lessons, templates, sources, itemCredits) => {
	const expected = course.counts;
	const counts = {
		modules: course.modules.length,
		core_lessons: lessons.filter((lesson) => !lesson.optional).length,
		optional_lessons: lessons.filter((lesson) => lesson.optional).length,
		total_lessons: lessons.length,
		templates: templates.length,
		sources: sources.length,
		items: itemCredits.length
	};

	for (const [key, value] of Object.entries(expected)) {
		if (counts[key] !== value) {
			throw new Error(`Count mismatch for ${key}: expected ${value}, got ${counts[key]}`);
		}
	}
};

const main = async () => {
	const [course, sourceJson, itemCreditsJson, progressSchema] = await Promise.all([
		readJson(COURSE_JSON_PATH),
		readJson(SOURCES_JSON_PATH),
		readJson(ITEM_CREDITS_JSON_PATH),
		readJson(PROGRESS_SCHEMA_PATH)
	]);

	const itemCredits = itemCreditsJson.items ?? [];
	const creditsByItemId = new Map(itemCredits.map((item) => [item.id, item]));
	const pathMaps = buildPathMaps(course);
	const { lessons } = await buildLessons(course, creditsByItemId, pathMaps);
	const lessonLookup = new Map(lessons.map((lesson) => [lesson.id, lesson]));
	const templates = await buildTemplates(course, pathMaps);
	const modules = buildModules(course, lessonLookup);
	const sources = buildSources(sourceJson, lessonLookup, itemCredits);
	const searchDocuments = buildSearchDocuments(lessons, templates, sources);

	assertCounts(course, lessons, templates, sources, itemCredits);

	for (const source of sources) {
		for (const backlink of source.backlinks) {
			if (!lessonLookup.has(backlink.lessonId)) {
				throw new Error(`Source ${source.id} backlink references missing lesson ${backlink.lessonId}`);
			}
		}
	}

	await fs.mkdir(GENERATED_DIR, { recursive: true });

	const generated = {
		course: {
			id: course.id,
			title: course.title,
			description: course.description,
			written: course.written,
			timezoneLabel: course.timezone_label,
			counts: course.counts
		},
		modules,
		lessons,
		templates,
		sources,
		itemCredits,
		progressSchema,
		searchDocuments
	};

	const progressMeta = {
		lessonIds: lessons.map((lesson) => lesson.id),
		lessonSlugById: Object.fromEntries(lessons.map((lesson) => [lesson.id, lesson.slug])),
		coreLessonIds: lessons.filter((lesson) => !lesson.optional).map((lesson) => lesson.id),
		firstCoreLessonId: lessons.find((lesson) => !lesson.optional)?.id ?? null,
		firstCoreLessonSlug: lessons.find((lesson) => !lesson.optional)?.slug ?? null,
		progressSchema
	};

	const banner = [
		'/* eslint-disable */',
		'// This file is generated by scripts/build-course-data.mjs.',
		'// Edit the files in /course and rerun `pnpm run course:build`.'
	].join('\n');

	await fs.writeFile(
		OUTPUT_FILE,
		`${banner}\n\nexport const courseData = ${JSON.stringify(generated, null, 2)} as const;\n`,
		'utf8'
	);
	await fs.writeFile(
		PROGRESS_META_FILE,
		`${banner}\n\nexport const progressMeta = ${JSON.stringify(progressMeta, null, 2)} as const;\n`,
		'utf8'
	);
};

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
