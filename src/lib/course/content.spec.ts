import { describe, expect, it } from 'vitest';

import { courseData } from '../generated/course-data';

describe('course corpus integrity', () => {
	it('matches the promised counts', () => {
		expect(courseData.course.counts).toEqual({
			modules: 8,
			core_lessons: 24,
			optional_lessons: 17,
			total_lessons: 41,
			templates: 12,
			sources: 137,
			items: 152
		});
		expect(courseData.modules).toHaveLength(8);
		expect(courseData.lessons).toHaveLength(41);
		expect(courseData.templates).toHaveLength(12);
		expect(courseData.sources).toHaveLength(137);
		expect(courseData.itemCredits).toHaveLength(152);
	});

	it('keeps every lesson and template uniquely addressable', () => {
		const lessonSlugs = new Set(courseData.lessons.map((lesson) => lesson.slug));
		const templateIds = new Set(courseData.templates.map((template) => template.id));
		const moduleLessonIds = courseData.modules.flatMap((module) => module.lessons.map((lesson) => lesson.id));

		expect(lessonSlugs.size).toBe(41);
		expect(templateIds.size).toBe(12);
		expect(moduleLessonIds).toHaveLength(41);
		expect(new Set(moduleLessonIds).size).toBe(41);

		for (const lesson of courseData.lessons) {
			expect(lesson.html).toContain('<');
			expect(lesson.html).not.toContain('id:');
			expect(lesson.sections.length).toBeGreaterThan(0);
		}
	});

	it('resolves every credit source and keeps every source record', () => {
		const sourceIds = new Set(courseData.sources.map((source) => source.id));

		for (const item of courseData.itemCredits) {
			expect(item.lesson_id).toBeTruthy();
			expect(item.statement).toBeTruthy();

			for (const source of item.sources) {
				if (source.source_id === 'firstparty-course-design') continue;
				expect(sourceIds.has(source.source_id)).toBe(true);
			}

			for (const source of item.informed_by) {
				expect(sourceIds.has(source.source_id)).toBe(true);
			}
		}
	});
});
