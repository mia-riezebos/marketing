import { searchCourse } from '../../lib/course/data';

export const load = ({ url }) => {
	const query = url.searchParams.get('q') ?? '';
	return {
		query,
		results: searchCourse(query)
	};
};
