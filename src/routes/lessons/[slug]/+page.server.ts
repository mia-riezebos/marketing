import { error } from '@sveltejs/kit';

import {
	getLesson,
	getNextCoreLesson,
	getNextLesson,
	getOptionalNeighbors,
	getPreviousLesson
} from '../../../lib/course/data';

export const load = ({ params }) => {
	const lesson = getLesson(params.slug);
	if (!lesson) {
		throw error(404, 'Lesson not found');
	}

	return {
		lesson,
		previousLesson: getPreviousLesson(lesson),
		nextLesson: getNextLesson(lesson),
		nextCoreLesson: getNextCoreLesson(lesson),
		optionalNeighbors: getOptionalNeighbors(lesson)
	};
};
