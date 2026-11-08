import { error } from '@sveltejs/kit';

import { getTemplate } from '../../../lib/course/data';

export const load = ({ params }) => {
	const template = getTemplate(params.id);
	if (!template) {
		throw error(404, 'Template not found');
	}

	return { template };
};
