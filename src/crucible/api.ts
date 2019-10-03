/**
 * CRUCIBLE REST API Documentation
 * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html
 *
 * TS REST CLIENT Documentation
 * https://github.com/Microsoft/typed-rest-client/tree/db388ca114dffc1e241ae81e6f3b9cd022c5b281/samples
 */

import { BasicCredentialHandler } from 'typed-rest-client/Handlers';
import { RestUri, IRequestOptions, Response } from '../util/restUri';
import { User, UserProfile } from './interfaces/User';
import { Review, Reviews, CreateReview, ReviewItem, ReviewFilter, ReviewState } from './interfaces/Review';
import { HttpCodes } from 'typed-rest-client/HttpClient';
import { IRequestHandler } from 'typed-rest-client/Interfaces';
import { Error } from './interfaces/Error';
import { Change, Listing } from './interfaces/ChangeSet';
import { VersionedEntity } from './interfaces/Version';
import { Repository } from './interfaces/Repository';
import { ReviewMetrics } from './interfaces/ReviewMetric';
import { Comment, NewComment, Comments } from './interfaces/Comment';
import { VersionInfo } from './interfaces/Common';
import { History } from './interfaces/History';

export class CrucibleApi {
  public constructor(
    private readonly host: string,
    private readonly username: string,
    private readonly password: string
  ) {}

  private get authHandler(): IRequestHandler[] {
    return [new BasicCredentialHandler(this.username, this.password)];
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

  private get uriReviews() {
    return new RestUri('/rest-service/reviews-v1');
  }

  private getError(result: Response<any>) {
    let e = result.result as Error;
    return e ? e.message : 'unknown error';
  }

  /* private get<T>(id: string, uri: RestUri): Promise<T> {
		return uri.get<T>(id, this.host, this.authHandler, this.queryOptions);
	} */

  /********************** USER API **********************/

  /**
   * Get a list of all the users. You can also ask for a set of users.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:users-v1
   *
   * @param usernameFilter a username (or a few) to limit the number of returned entries. It will return only existing users.
   */
  public getUsers(usernameFilter: string[] = []): Promise<User[]> {
    return new Promise((resolve, reject) => {
      this.uriUsers
        .setArg('username', usernameFilter)
        .get<User[] | Error>('get-users', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let users = r.get<User[]>(HttpCodes.OK);
          if (users) {
            resolve(users);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Returns the user details of the user mapped to a committer in a repository.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:users-v1:repository:username
   *
   * @param repository the key of the repository
   * @param username the username of the committer
   */
  public getUserCommitter(repository: string, username: string): Promise<User> {
    return new Promise((resolve, reject) => {
      this.uriUsers
        .addPart(repository)
        .addPart(username)
        .get<User>('get-user-committer', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let user = r.get<User>(HttpCodes.OK);
          if (user) {
            resolve(user);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Returns the user's profile details.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:users-v1:username
   *
   * @param username the username of the user
   */
  public getUserProfile(username: string): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      this.uriUsers
        .addPart(username)
        .get<UserProfile>('get-user-profile', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let profile = r.get<UserProfile>(HttpCodes.OK);
          if (profile) {
            resolve(profile);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /********************** SEARCH API **********************/

  /**
   * Search for reviews where the name, description, state or permaId contain the specified term.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:search-v1:reviews
   *
   * @param term search term
   * @param maxReturn the maximum number of reviews to return.
   */
  public searchReview(term: string, maxReturn: number): Promise<Review[]> {
    return new Promise((resolve, reject) => {
      this.uriSearch
        .setArg('term', term)
        .setArg('maxReturn', maxReturn)
        .get<Review[] | Error>('search-review', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let reviews = r.get<Review[]>(HttpCodes.OK);
          if (reviews) {
            resolve(reviews);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Get a list of all reviews that have been linked to the specified JIRA issue key.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:search-v1:reviewsForIssue
   *
   * @param jiraKey a Jira issue key (e.g. "FOO-3453")
   * @param maxReturn the maximum number of reviews to return.
   */
  public getReviewsForIssue(jiraKey: string, maxReturn: number): Promise<Review[]> {
    return new Promise((resolve, reject) => {
      this.uriSearch
        .setArg('jiraKey', jiraKey)
        .setArg('maxReturn', maxReturn)
        .get<Review[] | Error>('get-review-for-issue', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let reviews = r.get<Review[]>(HttpCodes.OK);
          if (reviews) {
            resolve(reviews);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Returns a list of all repositories. This includes plugin provided repositories.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:repositories-v1
   *
   * @param name      filter repositories by the repository key, only repositories of keys
   *                  containing this value would be returned if value was provided. Case insensitive.
   * @param enabled   filter repositories by enabled flag.
   *                  Only enabled/disabled repositories would be returned accordingly if value was provided.
   * @param available filter repositories by its availability.
   *                  Only available/unavailable repositories would be returned accordingly if value was provided.
   * @param type      filter repositories by type. Allowed values: cvs, svn, p4, git, hg, plugin (for light SCM repositories).
   *                  Parameter can be specified more than once.
   * @param limit     maximum number of repositories to be returned (default:1000).
   */
  public searchRepositories(
    name: string,
    enabled: boolean,
    available: boolean,
    type: string,
    limit: number
  ): Promise<Review[]> {
    return new Promise((resolve, reject) => {
      this.uriRepositories
        .setArg('name', name)
        .setArg('enabled', enabled)
        .setArg('available', available)
        .setArg('type', type)
        .setArg('limit', limit)
        .get<Review[] | Error>('search-repositories', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let reviews = r.get<Review[]>(HttpCodes.OK);
          if (reviews) {
            resolve(reviews);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Returns the raw content of the specified file revision as a binary stream.
   * No attempt is made to identify the content type and no mime type is provided.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:repositories-v1:content:repository:revision:path:.*$
   *
   * @param repository the key of the Crucible SCM plugin repository.
   * @param revision the SCM revision string.
   * @param path the path of a file.
   */
  public getFileRevisionContent(repository: string, revision: string, path: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.uriRepositories
        .addPart('content')
        .addPart(repository)
        .addPart(revision)
        .addPart(path)
        .loadFile<string>('search-repositories', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<string>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Returns a particular changeset.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:repositories-v1:change:repository:revision
   *
   * @param repository the key of the Crucible SCM plugin repository.
   * @param revision the SCM revision string.
   */
  public getChangeSet(repository: string, revision: string): Promise<Change> {
    return new Promise((resolve, reject) => {
      this.uriRepositories
        .addPart('change')
        .addPart(repository)
        .addPart(revision)
        .get<Change>('get-changeset', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Change>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Represents a sorted list of changesets, newest first.
   * Note that when providing a path, use a trailing slash in the request url to indicate
   * that it is a directory (use a "/" for the root directory of the repository).
   * This may be necessary for some SCM plugins (including svn-light).
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:repositories-v1:changes:repository:path:.*$
   *
   * @param repository the key of the Crucible SCM plugin repository.
   * @param path only show change sets which contain at least one revision with a path under this path.
   *             Changesets with some revisions outside this path still include all revisions.
   *             i.e. Revisions outside the path are *not* excluded from the change set.
   * @param oldestCsid only return change sets after this change set. If omitted there is no restriction.
   * @param includeOldest include the change set with id "from" in the change sets returned.
   * @param newestCsid only return change sets before this change set. If omitted there is no restriction.
   * @param includeNewest include the change set with id "to" in the change sets returned.
   * @param max return only the newest change sets, to a maximum of maxChangesets.
   */
  public searchChangeSets(
    repository: string,
    path: string,
    oldestCsid: string,
    includeOldest: string,
    newestCsid: string,
    includeNewest: string,
    max: string
  ): Promise<Change> {
    return new Promise((resolve, reject) => {
      this.uriRepositories
        .addPart('changes')
        .addPart(repository)
        .addPart(path)
        .setArg('path', path)
        .setArg('oldestCsid', oldestCsid)
        .setArg('includeOldest', includeOldest)
        .setArg('newestCsid', newestCsid)
        .setArg('includeNewest', includeNewest)
        .setArg('max', max)
        .get<Change>('search-changesets', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Change>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Represents the details of a versioned entity (file or directory).
   * This resource can be reached by following the file's self-link from a browse result.
   *
   * Note that most responses support title expansion to minimize the costs of accessing the resources.
   * Since file meta data is not always provided by SCM plugins, it is not expanded by default in the rest responses.
   * Use title expansion to explicitly make Crucible include it.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:repositories-v1:repository:revision:path:.*$
   *
   * @param repository the key of the Crucible SCM plugin repository.
   * @param revision the SCM revision string.
   * @param path the path of a file or versioned directory (note that versioned directories are not supported by all SCM plugins).
   */
  public getVersionedEntity(repository: string, revision: string, path: string): Promise<VersionedEntity> {
    return new Promise((resolve, reject) => {
      this.uriRepositories
        .addPart(repository)
        .addPart(revision)
        .addPart(path)
        .get<VersionedEntity>('get-versioned-entity', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<VersionedEntity>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Returns the details of the repository with the specified repository key.
   * When the repository exists, but the user has no access to it (possibly because the user is not authenticated),
   * a 401 is returned.
   *
   * The supplied repository key can be either a Crucible SCM plugin repository, or a FishEye repository.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:repositories-v1:repository
   *
   * @param repository the key of the Crucible SCM plugin repository.
   */
  public getRepository(repository: string): Promise<Repository> {
    return new Promise((resolve, reject) => {
      this.uriRepositories
        .addPart(repository)
        .get<Repository>('get-repository', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Repository>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Lists the contents of the specified directory.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:repositories-v1:browse:repository:path:.*$
   *
   * @param repository the key of the Crucible SCM plugin repository.
   * @param path path to a directory. When path represents a file name, the result is unspecified.
   */
  public browseRepository(repository: string, path: string): Promise<Listing> {
    return new Promise((resolve, reject) => {
      this.uriRepositories
        .addPart('browse')
        .addPart(repository)
        .addPart(path)
        .get<Repository>('browse-repository', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Listing>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  //
  /**
   * Represents the history of a versioned entity.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:repositories-v1:history:repository:revision:path:.*$
   *
   * @param repository the key of the Crucible SCM plugin repository.
   * @param revision the SCM revision string.
   * @param path the path of a file or versioned directory (note that versioned directories are not supported by all SCM plugins)
   */
  public getVersionedEntityHistory(repository: string, revision: string, path: string): Promise<History> {
    return new Promise((resolve, reject) => {
      this.uriRepositories
        .addPart('history')
        .addPart(repository)
        .addPart(revision)
        .addPart(path)
        .get<History>('browse-repository', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<History>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Get all reviews as a list of ReviewData structures.
   * Note that this may return a lot of data, so using /reviews-v1/filter/<filter> is usually better.
   *
   * The state parameter is a comma separated list of state names from the set Draft, Approval, Review,
   * Summarize, Closed, Dead, Rejected, Unknown.
   *
   * @param state only return reviews that are in these states.
   */
  public getReviews(state: string): Promise<Reviews> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .setArg('state', state)
        .get<Reviews>('get-reviews', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Reviews>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Create a review from the given createReview element.
   *
   * The sub-elements of the createReview element determine what type of review is created and how it is populated.
   * The following rules govern which sub-elements can be present and how they are used in the review creation process
   *
   *  - If the snippet element is specified a reviewData element must be supplied and no other elements may be supplied.
   *  - At least one of reviewData and detailedReviewData must be supplied.
   *    If both are supplied, the reviewers element of the detailedReviewData element is used.
   *    All other elements of detailedReviewData are ignored.
   *  - If the state element is present and has the value of "Review" in the reviewData (or detailedReviewData if used),
   *    then the review will be approved at creation, where allowed.
   *  - The changesets and path elements can be supplied with either the reviewData or detailedReviewData elements.
   *
   * The response includes the Location header that contains the URL of the newly created entity.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1
   *
   * @param review
   * @param state only return reviews that are in these states.
   */
  public createReview(review: CreateReview, state: string): Promise<Review> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .setArg('state', state)
        .create<CreateReview, Review | Error>('create-review', review, this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Review>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Get comment metrics metadata for the specified metrics version.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:metrics:version
   *
   * @param version a metrics version.
   */
  public getReviewCommentMetric(version: string): Promise<ReviewMetrics> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .addPart('metrics')
        .addPart(version)
        .get<ReviewMetrics>('get-review-metrics', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<ReviewMetrics>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Gets the given comment.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:id:comments:cId
   *
   * @param reviewId the review perma id
   * @param commentId the comment perma id
   * @param render true if the wiki text should be rendered into html, into the field <messageAsHtml>. (Default: true)
   */
  public getReviewComment(reviewId: string, commentId: string, render: boolean = false): Promise<Comment> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .addPart(reviewId)
        .addPart('comments')
        .addPart(commentId)
        .get<Comment | Error>('get-review-comment', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Comment>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Deletes the given comment.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:id:comments:cId
   *
   * @param reviewId the review perma id
   * @param commentId the comment perma id
   */
  public deleteReviewComment(reviewId: string, commentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .addPart(reviewId)
        .addPart('comments')
        .addPart(commentId)
        .del<Comment | Error>('delete-review-comment', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          if (r.statusCode == HttpCodes.OK) {
            resolve();
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Updates the comment given by the perma id to the new comment posted.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:id:comments:cId
   *
   * @param reviewId the review perma id
   * @param commentId the comment perma id
   */
  public updateReviewComment(reviewId: string, commentId: string, comment: NewComment): Promise<void> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .addPart(reviewId)
        .addPart('comments')
        .addPart(commentId)
        .update<NewComment, void | Error>(
          'update-review-comment',
          comment,
          this.host,
          this.authHandler,
          this.queryOptions
        )
        .then((r) => {
          if (r.statusCode == HttpCodes.OK) {
            resolve();
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Adds a file to the review, optionally diff'ed to a second file.
   *
   * In contrast to a patch, files can be either binary or text.
   * Depending on the filetype, size and contents, Crucible may be able to display either parts,
   * or the entire file in the review. It is possible to upload two versions of the file, in which
   * case Crucible will display a diff and report that the file was modified.
   * When only a single file is uploaded, Crucible treats the file as newly added.
   *
   * This action returns the ReviewData document on success.
   *
   * This resources uses multipart form-data to receive the file(s), character set indication and
   * optional comments (it does not expect an XML document with embedded files, as that would require
   * the client to first encode the files in Base64). Making a multipart form-data request can be done
   * manually, but you will probably want to use a library.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:id:addFile
   *
   * @param reviewId the review perma id to add the file
   * @param stream Content to stream
   */
  public addFileToReview(reviewId: string, stream: NodeJS.ReadableStream): Promise<ReviewItem> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .addPart(reviewId)
        .addPart('addFile')
        .uploadFile<ReviewItem | Error>('upload-file-to-review', this.host, stream, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<ReviewItem>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Returns Crucible version information.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:versionInfo
   */
  public getVersionInfo(): Promise<VersionInfo> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .addPart('versionInfo')
        .get<VersionInfo>('get-version-info', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<VersionInfo>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Retrieves all reviews that are in one of the the specified states.
   * For each review all details are included (review items + comments).
   * The wiki rendered comments will be available via the <messageAsHtml> element
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:details
   *
   * @param state the review states to match.
   */
  public getReviewsDetailed(state: string): Promise<Reviews> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .addPart('details')
        .setArg('state', state)
        .get<Reviews>('get-reviews-detailed', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Reviews>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Internal method to filter reviews.
   *
   * Get all the reviews which match the given filter, for the current user.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:filter:filter
   *
   * @param detailed set to true if the detailed api should be used.
   * @param filter A predefined filter type.
   */
  private filterReviewsInternal(detailed: boolean, filter: ReviewFilter): Promise<Reviews> {
    return new Promise((resolve, reject) => {
      let id = detailed ? 'filter-reviews-detailed' : 'filter-reviews';
      let uri = this.uriReviews.addPart('filter').addPart(filter);
      if (detailed) {
        uri.addPart('details');
      }
      uri
        .get<Reviews>(id, this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Reviews>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Get all the reviews which match the given filter, for the current user.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:filter:filter
   *
   * @param filter A predefined filter type.
   */
  public filterReviews(filter: ReviewFilter): Promise<Reviews> {
    return this.filterReviewsInternal(false, filter);
  }

  /**
   * Gets a list of all the reviews that match the specified filter criteria.
   * For each review all details are included (review items + comments)
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:filter:filter:details
   *
   * @param filter A predefined filter type.
   */
  public filterReviewsDetailed(filter: ReviewFilter): Promise<Reviews> {
    return this.filterReviewsInternal(true, filter);
  }

  /**
   * Internal method to search for reviews.
   *
   * Returns all (detailed) information of all reviews that satisfy the specified filter parameters and are
   * accessible under the provided credentials.
   *
   * To ignore a property, omit it from the query string.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:filter:details
   *
   * @param detailed set to true if the detailed api should be used.
   * @param title a string that will be searched for in review titles.
   * @param author reviews authored by this user.
   * @param moderator reviews moderated by this user.
   * @param creator reviews created by this user.
   * @param states array of review states.
   * @param reviewer reviews reviewed by this user.
   * @param orRoles whether the value of author, creator, moderator and reviewer should be OR'd (orRoles=true) or AND'd (orRoles=false) together.
   * @param complete reviews that the specified reviewer has completed.
   * @param allReviewersComplete Reviews that all reviewers have completed.
   * @param project reviews for the specified project.
   * @param fromDate reviews with last activity date after the specified timestamp, in milliseconds. Inclusive.
   * @param toDate
   */
  private searchReviewsInternal(
    detailed: boolean,
    title?: string,
    author?: string,
    moderator?: string,
    creator?: string,
    states?: ReviewState[],
    reviewer?: string,
    orRoles?: boolean,
    complete?: boolean,
    allReviewersComplete?: boolean,
    project?: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Reviews> {
    return new Promise((resolve, reject) => {
      let id = detailed ? 'search-reviews-detailed' : 'search-reviews';
      let uri = this.uriReviews.addPart('filter');
      if (detailed) {
        uri.addPart('details');
      }
      uri
        .setArg('title', title)
        .setArg('author', author)
        .setArg('moderator', moderator)
        .setArg('creator', creator)
        .setArg('states', states ? states.join(',') : undefined)
        .setArg('reviewer', reviewer)
        .setArg('orRoles', orRoles)
        .setArg('complete', complete)
        .setArg('allReviewersComplete', allReviewersComplete)
        .setArg('project', project)
        .setArg('fromDate', fromDate ? fromDate.getMilliseconds() : undefined)
        .setArg('toDate', toDate ? toDate.getMilliseconds() : undefined)
        .get<Reviews>(id, this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Reviews>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Returns all reviews that satisfy the specified filter parameters and are accessible under the provided credentials.
   *
   * To ignore a property, omit it from the query string.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:filter
   *
   * @param title a string that will be searched for in review titles.
   * @param author reviews authored by this user.
   * @param moderator reviews moderated by this user.
   * @param creator reviews created by this user.
   * @param states array of review states.
   * @param reviewer reviews reviewed by this user.
   * @param orRoles whether the value of author, creator, moderator and reviewer should be OR'd (orRoles=true) or AND'd (orRoles=false) together.
   * @param complete reviews that the specified reviewer has completed.
   * @param allReviewersComplete Reviews that all reviewers have completed.
   * @param project reviews for the specified project.
   * @param fromDate reviews with last activity date after the specified timestamp, in milliseconds. Inclusive.
   * @param toDate
   */
  public searchReviews(
    title?: string,
    author?: string,
    moderator?: string,
    creator?: string,
    states?: ReviewState[],
    reviewer?: string,
    orRoles?: boolean,
    complete?: boolean,
    allReviewersComplete?: boolean,
    project?: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Reviews> {
    return this.searchReviewsInternal(
      false,
      title,
      author,
      moderator,
      creator,
      states,
      reviewer,
      orRoles,
      complete,
      allReviewersComplete,
      project,
      fromDate,
      toDate
    );
  }

  /**
   * Returns all (detailed) information of all reviews that satisfy the specified filter parameters and are
   * accessible under the provided credentials.
   *
   * To ignore a property, omit it from the query string.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:filter:details
   *
   * @param title a string that will be searched for in review titles.
   * @param author reviews authored by this user.
   * @param moderator reviews moderated by this user.
   * @param creator reviews created by this user.
   * @param states array of review states.
   * @param reviewer reviews reviewed by this user.
   * @param orRoles whether the value of author, creator, moderator and reviewer should be OR'd (orRoles=true) or AND'd (orRoles=false) together.
   * @param complete reviews that the specified reviewer has completed.
   * @param allReviewersComplete Reviews that all reviewers have completed.
   * @param project reviews for the specified project.
   * @param fromDate reviews with last activity date after the specified timestamp, in milliseconds. Inclusive.
   * @param toDate
   */
  public searchReviewsDetailed(
    title?: string,
    author?: string,
    moderator?: string,
    creator?: string,
    states?: ReviewState[],
    reviewer?: string,
    orRoles?: boolean,
    complete?: boolean,
    allReviewersComplete?: boolean,
    project?: string,
    fromDate?: Date,
    toDate?: Date
  ): Promise<Reviews> {
    return this.searchReviewsInternal(
      true,
      title,
      author,
      moderator,
      creator,
      states,
      reviewer,
      orRoles,
      complete,
      allReviewersComplete,
      project,
      fromDate,
      toDate
    );
  }

  /**
   * Gets the replies to the given comment.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:id:comments:cId:replies
   *
   * @param reviewId the review perma-id (e.g. "CR-45").
   * @param commentId the comment to reply to
   * @param render true if the comments should also be rendered into html, into the element <messageAsHtml>
   */
  public getCommentReplies(reviewId: string, commentId: string, render: boolean = false): Promise<Comments> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .addPart(reviewId)
        .addPart('comments')
        .addPart(commentId)
        .addPart('replies')
        .setArg('render', render)
        .get<Comments | Error>('get-comment-replies', this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Comments>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Adds a reply to the given comment. This call includes the Location response header that contains the URL
   * of the newly created entity.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:id:comments:cId:replies
   *
   * @param reviewId the review perma-id (e.g. "CR-45").
   * @param commentId the comment to reply to
   * @param reply new comment
   */
  public addCommentReply(reviewId: string, commentId: string, reply: NewComment): Promise<Comment> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .addPart(reviewId)
        .addPart('comments')
        .addPart(commentId)
        .addPart('replies')
        .create<NewComment, Comment | Error>('add-comment-reply', reply, this.host, this.authHandler, this.queryOptions)
        .then((r) => {
          let content = r.get<Comment>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * For the effective user, mark all comments in a review as read (except those marked as leave unread).
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:id:comments:markAllAsRead
   *
   * @param reviewId the review perma-id (e.g. "CR-45").
   */
  public markAllReviewCommentsAsRead(reviewId: string): Promise<Review> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .addPart(reviewId)
        .addPart('comments')
        .addPart('markAllAsRead')
        .create<void, Review | Error>(
          'mark-all-review-comments-as-read',
          undefined,
          this.host,
          this.authHandler,
          this.queryOptions
        )
        .then((r) => {
          let content = r.get<Review>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }

  /**
   * Mark the given comment as read for the user used to make this POST.
   *
   * https://docs.atlassian.com/fisheye-crucible/4.5.1/wadl/crucible.html#rest-service:reviews-v1:id:comments:cId:markAsRead
   *
   * @param reviewId the review perma-id (e.g. "CR-45").
   * @param commentId the comment perma id.
   */
  public markReviewCommentAsRead(reviewId: string, commentId: string): Promise<Comment> {
    return new Promise((resolve, reject) => {
      this.uriReviews
        .addPart(reviewId)
        .addPart('comments')
        .addPart(commentId)
        .addPart('markAsRead')
        .create<void, Comment | Error>(
          'mark-review-comment-as-read',
          undefined,
          this.host,
          this.authHandler,
          this.queryOptions
        )
        .then((r) => {
          let content = r.get<Comment>(HttpCodes.OK);
          if (content) {
            resolve(content);
          } else {
            reject(this.getError(r));
          }
        })
        .catch((e) => {
          reject(e);
        });
    });
  }
}
