import { course } from '../lib/course/data';

export const load = ({ url }) => ({
	pathname: url.pathname,
	courseTitle: course.title
});
