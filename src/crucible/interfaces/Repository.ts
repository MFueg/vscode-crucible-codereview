import { Link } from './Version';
import { Revision } from './ChangeSet';

export interface RepositoryQuery {
	repoData: Repository[];
}

export interface RepositoryShort {
	available: boolean;
	displayName: string;
	enabled: boolean;
	name: string;
	path: string;
	type: string;
	url: string;
}

export interface Repository {
	available: boolean;
	description?: string;
	displayName: string;
	enabled: boolean;
	hasChangelogBrowser?: boolean;
	hasDirectoryBrowser?: boolean;
	name: string;
	path?: string;
	pluginKey?: string;
	stateDescription?: string;
	type: string;
	url?: string;
}
