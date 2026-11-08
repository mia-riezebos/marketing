import { get, writable } from 'svelte/store';
import { z } from 'zod';

import { progressMeta } from '../generated/progress-meta';

const browser = typeof window !== 'undefined';
const lessonSlugById = progressMeta.lessonSlugById as Record<string, string>;

const STORAGE_KEY = 'marketing-course-progress-v1';

const lessonProgressSchema = z
	.object({
		status: z.enum(['unstarted', 'in_progress', 'done']).default('unstarted'),
		bookmarked: z.boolean().default(false),
		notes: z.string().default(''),
		completed_at: z.string().nullable().default(null),
		exercise_artifact: z.string().nullable().default(null),
		last_section_id: z.string().nullable().optional()
	})
	.passthrough();

const progressSnapshotSchema = z
	.object({
		version: z.literal(1),
		last_lesson_id: z.string().nullable().optional(),
		lessons: z.record(z.string(), lessonProgressSchema)
	})
	.passthrough();

export type LessonProgress = z.infer<typeof lessonProgressSchema>;
export type ProgressSnapshot = z.infer<typeof progressSnapshotSchema>;

type ProgressState = {
	snapshot: ProgressSnapshot;
	storageAvailable: boolean;
	warning: string | null;
};

type ImportResult =
	| { ok: true; message: string }
	| { ok: false; message: string };

const createEmptyLessonProgress = (): LessonProgress => ({
	status: 'unstarted',
	bookmarked: false,
	notes: '',
	completed_at: null,
	exercise_artifact: null,
	last_section_id: null
});

const createDefaultSnapshot = (): ProgressSnapshot => ({
	version: 1,
	last_lesson_id: null,
	lessons: Object.fromEntries(
		progressMeta.lessonIds.map((lessonId) => [lessonId, createEmptyLessonProgress()])
	)
});

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === 'object' && value !== null && !Array.isArray(value);

const validateBaseProgressShape = (value: unknown) => {
	const errors: string[] = [];

	if (!isRecord(value)) {
		return ['data must be an object'];
	}

	if (value.version !== 1) {
		errors.push('version must equal 1');
	}

	if (
		value.last_lesson_id !== undefined &&
		value.last_lesson_id !== null &&
		typeof value.last_lesson_id !== 'string'
	) {
		errors.push('last_lesson_id must be a string or null');
	}

	if (!isRecord(value.lessons)) {
		errors.push('lessons must be an object');
		return errors;
	}

	for (const [lessonId, lessonValue] of Object.entries(value.lessons)) {
		if (!isRecord(lessonValue)) {
			errors.push(`lessons.${lessonId} must be an object`);
			continue;
		}

		if (
			lessonValue.status !== undefined &&
			!['unstarted', 'in_progress', 'done'].includes(String(lessonValue.status))
		) {
			errors.push(`lessons.${lessonId}.status must be unstarted, in_progress, or done`);
		}

		if (
			lessonValue.bookmarked !== undefined &&
			typeof lessonValue.bookmarked !== 'boolean'
		) {
			errors.push(`lessons.${lessonId}.bookmarked must be a boolean`);
		}

		if (lessonValue.notes !== undefined && typeof lessonValue.notes !== 'string') {
			errors.push(`lessons.${lessonId}.notes must be a string`);
		}

		if (
			lessonValue.completed_at !== undefined &&
			lessonValue.completed_at !== null &&
			typeof lessonValue.completed_at !== 'string'
		) {
			errors.push(`lessons.${lessonId}.completed_at must be a string or null`);
		}

		if (
			lessonValue.exercise_artifact !== undefined &&
			lessonValue.exercise_artifact !== null &&
			typeof lessonValue.exercise_artifact !== 'string'
		) {
			errors.push(`lessons.${lessonId}.exercise_artifact must be a string or null`);
		}

		if (
			lessonValue.last_section_id !== undefined &&
			lessonValue.last_section_id !== null &&
			typeof lessonValue.last_section_id !== 'string'
		) {
			errors.push(`lessons.${lessonId}.last_section_id must be a string or null`);
		}
	}

	return errors;
};

const normalizeSnapshot = (incoming: ProgressSnapshot): ProgressSnapshot => {
	const normalized = createDefaultSnapshot();

	for (const lessonId of progressMeta.lessonIds) {
		const merged = lessonProgressSchema.parse({
			...normalized.lessons[lessonId],
			...incoming.lessons?.[lessonId]
		});
		normalized.lessons[lessonId] = {
			...merged,
			last_section_id: merged.last_section_id ?? null
		};
	}

	if (incoming.last_lesson_id && lessonSlugById[incoming.last_lesson_id]) {
		normalized.last_lesson_id = incoming.last_lesson_id;
	}

	return normalized;
};

const loadSnapshot = (): ProgressState => {
	const fallback = createDefaultSnapshot();

	if (!browser) {
		return {
			snapshot: fallback,
			storageAvailable: true,
			warning: null
		};
	}

	try {
		const raw = window.localStorage.getItem(STORAGE_KEY);
		if (!raw) {
			return {
				snapshot: fallback,
				storageAvailable: true,
				warning: null
			};
		}

		const parsed = JSON.parse(raw);
		const shapeErrors = validateBaseProgressShape(parsed);
		if (shapeErrors.length) {
			return {
				snapshot: fallback,
				storageAvailable: true,
				warning: `Unreadable saved progress was reset for this browser. ${shapeErrors.join('; ')}`
			};
		}

		const validated = progressSnapshotSchema.safeParse(parsed);
		if (!validated.success) {
			return {
				snapshot: fallback,
				storageAvailable: true,
				warning:
					'Unreadable saved progress was reset for this browser. One or more lesson entries had the wrong shape.'
			};
		}

		return {
			snapshot: normalizeSnapshot(validated.data),
			storageAvailable: true,
			warning: null
		};
	} catch (error) {
		const warning =
			error instanceof SyntaxError
				? 'Unreadable saved progress was reset for this browser.'
				: 'Browser storage is unavailable here. Progress, bookmarks, and notes will only last for this tab.';

		return {
			snapshot: fallback,
			storageAvailable: !(error instanceof Error) || error instanceof SyntaxError,
			warning
		};
	}
};

const persistSnapshot = (snapshot: ProgressSnapshot) => {
	if (!browser) return { storageAvailable: true, warning: null as string | null };

	try {
		window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
		return { storageAvailable: true, warning: null as string | null };
	} catch {
		return {
			storageAvailable: false,
			warning:
				'Browser storage is unavailable here. Progress, bookmarks, and notes will only last for this tab.'
		};
	}
};

const initialState = loadSnapshot();
const internalStore = writable<ProgressState>(initialState);

const updateSnapshot = (mutate: (snapshot: ProgressSnapshot) => ProgressSnapshot) => {
	internalStore.update((state) => {
		const nextSnapshot = mutate(state.snapshot);
		const persistence = persistSnapshot(nextSnapshot);

		return {
			snapshot: nextSnapshot,
			storageAvailable: persistence.storageAvailable,
			warning: persistence.warning ?? state.warning
		};
	});
};

const markOpened = (lessonId: string) => {
	updateSnapshot((snapshot) => {
		const lesson = snapshot.lessons[lessonId];
		if (!lesson) return snapshot;

		return {
			...snapshot,
			last_lesson_id: lessonId,
			lessons: {
				...snapshot.lessons,
				[lessonId]: {
					...lesson,
					status: lesson.status === 'unstarted' ? 'in_progress' : lesson.status
				}
			}
		};
	});
};

const setLastSection = (lessonId: string, sectionId: string | null) => {
	updateSnapshot((snapshot) => ({
		...snapshot,
		last_lesson_id: lessonId,
		lessons: {
			...snapshot.lessons,
			[lessonId]: {
				...snapshot.lessons[lessonId],
				status:
					snapshot.lessons[lessonId]?.status === 'unstarted'
						? 'in_progress'
						: snapshot.lessons[lessonId]?.status ?? 'in_progress',
				last_section_id: sectionId
			}
		}
	}));
};

const toggleDone = (lessonId: string) => {
	updateSnapshot((snapshot) => {
		const lesson = snapshot.lessons[lessonId];
		if (!lesson) return snapshot;

		const isDone = lesson.status === 'done';
		return {
			...snapshot,
			last_lesson_id: lessonId,
			lessons: {
				...snapshot.lessons,
				[lessonId]: {
					...lesson,
					status: isDone ? 'in_progress' : 'done',
					completed_at: isDone ? null : new Date().toISOString()
				}
			}
		};
	});
};

const toggleBookmark = (lessonId: string) => {
	updateSnapshot((snapshot) => ({
		...snapshot,
		last_lesson_id: lessonId,
		lessons: {
			...snapshot.lessons,
			[lessonId]: {
				...snapshot.lessons[lessonId],
				bookmarked: !snapshot.lessons[lessonId]?.bookmarked
			}
		}
	}));
};

const setNotes = (lessonId: string, notes: string) => {
	updateSnapshot((snapshot) => ({
		...snapshot,
		last_lesson_id: lessonId,
		lessons: {
			...snapshot.lessons,
			[lessonId]: {
				...snapshot.lessons[lessonId],
				status:
					snapshot.lessons[lessonId]?.status === 'unstarted'
						? 'in_progress'
						: snapshot.lessons[lessonId]?.status ?? 'in_progress',
				notes
			}
		}
	}));
};

const exportProgress = () => JSON.stringify(get(internalStore).snapshot, null, 2);

const importProgress = (rawText: string): ImportResult => {
	let parsed: unknown;

	try {
		parsed = JSON.parse(rawText);
	} catch {
		return {
			ok: false,
			message: 'Import failed because the file is not valid JSON.'
		};
	}

	const shapeErrors = validateBaseProgressShape(parsed);
	if (shapeErrors.length) {
		return {
			ok: false,
			message: `Import failed schema validation: ${shapeErrors.join('; ')}`
		};
	}

	const validated = progressSnapshotSchema.safeParse(parsed);
	if (!validated.success) {
		return {
			ok: false,
			message: 'Import failed because one or more lesson records had the wrong shape.'
		};
	}

	const normalizedImport = normalizeSnapshot(validated.data);
	updateSnapshot((snapshot) => ({
		...snapshot,
		last_lesson_id: normalizedImport.last_lesson_id ?? snapshot.last_lesson_id,
		lessons: Object.fromEntries(
			progressMeta.lessonIds.map((lessonId) => [
				lessonId,
				{
					...snapshot.lessons[lessonId],
					...normalizedImport.lessons[lessonId]
				}
			])
		)
	}));

	return {
		ok: true,
		message: 'Progress imported and merged into this browser copy.'
	};
};

const resetProgress = () => {
	const snapshot = createDefaultSnapshot();
	updateSnapshot(() => snapshot);
};

export const getProgressCounts = (snapshot: ProgressSnapshot) => {
	const entries = Object.values(snapshot.lessons);
	return {
		done: entries.filter((entry) => entry.status === 'done').length,
		bookmarked: entries.filter((entry) => entry.bookmarked).length,
		inProgress: entries.filter((entry) => entry.status === 'in_progress').length
	};
};

export const getResumeHref = (snapshot: ProgressSnapshot) => {
	const lessonId = snapshot.last_lesson_id ?? progressMeta.firstCoreLessonId;
	if (!lessonId) return '/';

	const slug = lessonSlugById[lessonId];
	if (!slug) return '/';
	const sectionId = snapshot.lessons[lessonId]?.last_section_id;
	return sectionId ? `/lessons/${slug}#${sectionId}` : `/lessons/${slug}`;
};

export const progressState = {
	subscribe: internalStore.subscribe,
	markOpened,
	setLastSection,
	toggleDone,
	toggleBookmark,
	setNotes,
	importProgress,
	exportProgress,
	resetProgress
};
