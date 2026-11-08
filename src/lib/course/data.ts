import { courseData } from '../generated/course-data';
import { normalizeSearchText } from './text';

export type Course = typeof courseData.course;
export type Module = (typeof courseData.modules)[number];
export type Lesson = (typeof courseData.lessons)[number];
export type Template = (typeof courseData.templates)[number];
export type Source = (typeof courseData.sources)[number];
export type CreditItem = (typeof courseData.itemCredits)[number];

export const course: Course = courseData.course;
export const modules: Module[] = [...courseData.modules];
export const lessons: Lesson[] = [...courseData.lessons];
export const templates: Template[] = [...courseData.templates];
export const sources: Source[] = [...courseData.sources];
export const itemCredits: CreditItem[] = [...courseData.itemCredits];
export const progressSchema = courseData.progressSchema;
export const searchDocuments = courseData.searchDocuments;

export const lessonBySlug = new Map<string, Lesson>(lessons.map((lesson) => [lesson.slug, lesson]));
export const lessonById = new Map<string, Lesson>(lessons.map((lesson) => [lesson.id, lesson]));
export const moduleById = new Map<string, Module>(modules.map((module) => [module.id, module]));
export const templateById = new Map<string, Template>(templates.map((template) => [template.id, template]));
export const sourceById = new Map<string, Source>(sources.map((source) => [source.id, source]));

export const coreLessons = lessons.filter((lesson) => !lesson.optional);
export const optionalLessons = lessons.filter((lesson) => lesson.optional);

export const searchCourse = (query: string) => {
	const normalizedQuery = normalizeSearchText(query);
	if (!normalizedQuery) {
		return [];
	}

	const terms = normalizedQuery.split(' ').filter(Boolean);
	const allDocuments = [
		...searchDocuments.lessons,
		...searchDocuments.templates,
		...searchDocuments.sources
	];

	return allDocuments
		.map((document) => {
			const haystack = normalizeSearchText(document.searchText);
			let score = 0;

			for (const term of terms) {
				if (!haystack.includes(term)) {
					score -= 3;
					continue;
				}

				score += 2;
				if (normalizeSearchText(document.title).includes(term)) {
					score += 3;
				}
			}

			return { ...document, score };
		})
		.filter((document) => document.score > 0)
		.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
};

export const getLesson = (slug: string) => lessonBySlug.get(slug) ?? null;
export const getTemplate = (id: string) => templateById.get(id) ?? null;

export const getPreviousLesson = (lesson: Lesson) =>
	lesson.previousLessonId ? lessonById.get(lesson.previousLessonId) ?? null : null;

export const getNextLesson = (lesson: Lesson) =>
	lesson.nextLessonId ? lessonById.get(lesson.nextLessonId) ?? null : null;

export const getNextCoreLesson = (lesson: Lesson) => {
	const currentIndex = coreLessons.findIndex((candidate) => candidate.id === lesson.id);
	return currentIndex === -1 ? null : coreLessons[currentIndex + 1] ?? null;
};

export const getOptionalNeighbors = (lesson: Lesson) => {
	const siblings = optionalLessons.filter((candidate) => candidate.moduleId === lesson.moduleId);
	const currentIndex = siblings.findIndex((candidate) => candidate.id === lesson.id);

	return {
		previous: currentIndex > 0 ? siblings[currentIndex - 1] : null,
		next: currentIndex === -1 ? null : siblings[currentIndex + 1] ?? null
	};
};
