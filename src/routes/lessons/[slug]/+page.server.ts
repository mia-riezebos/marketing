import { error } from '@sveltejs/kit';

import {
	getLesson,
	getNextCoreLesson,
	getNextLesson,
	getOptionalNeighbors,
	getPreviousLesson
} from '../../../lib/course/data';
import { moduleDesignById } from '../../../lib/course/learning-design';

export const load = ({ params }) => {
	const lesson = getLesson(params.slug);
	if (!lesson) {
		throw error(404, 'Lesson not found');
	}

	return {
		design: moduleDesignById.get(lesson.moduleId) ?? null,
		lesson,
		previousLesson: getPreviousLesson(lesson),
		nextLesson: getNextLesson(lesson),
		nextCoreLesson: getNextCoreLesson(lesson),
		optionalNeighbors: getOptionalNeighbors(lesson)
	};
};
