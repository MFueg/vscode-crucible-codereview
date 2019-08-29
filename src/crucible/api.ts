/**
 * CRUCIBLE REST API Documentation
 * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html
 * 
 * TS REST CLIENT Documentation
 * https://github.com/Microsoft/typed-rest-client/tree/db388ca114dffc1e241ae81e6f3b9cd022c5b281/samples
 */

import { RestClient } from 'typed-rest-client';
import { BasicCredentialHandler } from 'typed-rest-client/Handlers';
import { IRequestOptions } from 'typed-rest-client/Interfaces';
import { RestUri } from '../util/restUri';
import { HttpCodes } from 'typed-rest-client/HttpClient';
import { User, UserProfile } from './interfaces/User';
import { Review } from './interfaces/Review';

export class CrucibleApi {
	public constructor(
		private readonly host: string,
		private readonly username: string,
		private readonly password: string
	) {}

	private get authHandler() {
		return new BasicCredentialHandler(this.username, this.password);
	}

	private get queryOptions(): IRequestOptions {
		return {
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			}
		};
	}

	private get uriUsers() {
		return new RestUri('/rest-service/users-v1');
	}

	private get uriSearch() {
		return new RestUri('/rest-service/search-v1');
	}

	private get uriRepositories() {
		return new RestUri('/rest-service/repositories-v1');
	}

	/* private get<T>(id: string, uri: RestUri): Promise<T> {
		return uri.get<T>(id, this.host, [ this.authHandler ], this.queryOptions);
	} */

	/********************** USER API **********************/

	/**
	 * Get a list of all the users. You can also ask for a set of users.
	 * @param usernameFilter a username (or a few) to limit the number of returned entries. It will return only existing users.
	 */
	public getUsers(usernameFilter: string[] = []): Promise<User[]> {
		return this.uriUsers
			.setArg('username', usernameFilter)
			.get<User[]>('get-users', this.host, [ this.authHandler ], this.queryOptions);

		// return this.get<User[]>('get-users', this.uriUsers.setArg('username', usernameFilter));
	}

	/**
	 * Returns the user details of the user mapped to a committer in a repository.
	 * @param repository the key of the repository
	 * @param username the username of the committer
	 */
	public getUserCommitter(repository: string, username: string): Promise<User> {
		return this.uriUsers
			.addPart(repository)
			.addPart(username)
			.get<User>('get-user-committer', this.host, [ this.authHandler ], this.queryOptions);
	}

	/**
	 * Returns the user's profile details
	 * @param username the username of the user
	 */
	public getUserProfile(username: string): Promise<UserProfile> {
		return this.uriUsers
			.addPart(username)
			.get<UserProfile>('get-user-profile', this.host, [ this.authHandler ], this.queryOptions);
	}

	/********************** SEARCH API **********************/

	/**
	 * Search for reviews where the name, description, state or permaId contain the specified term.
	 * @param term search term
	 * @param maxReturn the maximum number of reviews to return.
	 */
	public searchReview(term: string, maxReturn: number): Promise<Review[]> {
		return this.uriSearch
			.setArg('term', term)
			.setArg('maxReturn', maxReturn)
			.get<Review[]>('search-review', this.host, [ this.authHandler ], this.queryOptions);
	}

	/**
	 * Get a list of all reviews that have been linked to the specified JIRA issue key.
	 * @param jiraKey a Jira issue key (e.g. "FOO-3453")
	 * @param maxReturn the maximum number of reviews to return.
	 */
	public getReviewsForIssue(jiraKey: string, maxReturn: number): Promise<Review[]> {
		return this.uriSearch
			.setArg('jiraKey', jiraKey)
			.setArg('maxReturn', maxReturn)
			.get<Review[]>('get-review-for-issue', this.host, [ this.authHandler ], this.queryOptions);
	}

	/**
	 * Returns a list of all repositories. This includes plugin provided repositories
	 * @param name filter repositories by the repository key, only repositories of keys containing this value would be returned if value was provided. Case insensitive.
	 * @param enabled filter repositories by enabled flag. Only enabled/disabled repositories would be returned accordingly if value was provided.
	 * @param available filter repositories by its availability. Only available/unavailable repositories would be returned accordingly if value was provided.
	 * @param type filter repositories by type. Allowed values: cvs, svn, p4, git, hg, plugin (for light SCM repositories). Parameter can be specified more than once.
	 * @param limit maximum number of repositories to be returned (default:1000).
	 */
	public searchRepositories(
		name: string,
		enabled: boolean,
		available: boolean,
		type: string,
		limit: number
	): Promise<Review[]> {
		return this.uriRepositories
			.setArg('name', name)
			.setArg('enabled', enabled)
			.setArg('available', available)
			.setArg('type', type)
			.setArg('limit', limit)
			.get<Review[]>('get-review-for-issue', this.host, [ this.authHandler ], this.queryOptions);
	}
}
