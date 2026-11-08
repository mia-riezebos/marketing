import { error } from '@sveltejs/kit';

import { moduleById } from '../../../lib/course/data';
import { moduleDesignBySlug } from '../../../lib/course/learning-design';

export const load = ({ params }) => {
	const design = moduleDesignBySlug.get(params.slug);
	if (!design) {
		throw error(404, 'Module not found');
	}

	const module = moduleById.get(design.id);
	if (!module) {
		throw error(404, 'Module content not found');
	}

	return {
		module,
		design
	};
};
