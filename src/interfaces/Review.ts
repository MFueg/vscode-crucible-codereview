import { User } from './User';
import { PermaID } from './Common';
import { Comments } from './Comment';

export type ReviewsQuery = Reviews;

export interface Reviews {
  reviewData: Review[];
}

export interface Review {
  actions?: Actions;
  allowReviewersToJoin: boolean;
  author: User;
  createDate: string;
  creator: User;
  description: string;
  dueDate: string;
  generalComments?: Comments;
  jiraIssueKey: string;
  metricsVersion: number;
  moderator: User;
  name: string;
  permaId: PermaID;
  permaIdHistory: string[];
  projectKey: string;
  reviewItems?: ReviewItems;
  state: string;
  summary: string;
  transitions?: Transitions;
  type: string;
}

export interface CreateReview {
  reviewData: Review;
  patch: string;
  anchor: Anchor;
  changesets: Changesets;
}

export interface ReviewItems {
  reviewItem: ReviewItem[];
}

export interface ReviewItem {
  anchorData?: Anchor;
  authorName: string;
  commitDate: number;
  commitType: string;
  expandedRevisions?: any[];
  fileType: string;
  fromContentUrl: string;
  fromPath: string;
  fromRevision: string;
  participants: Participant[];
  patchUrl?: string;
  permId: PermaID;
  repositoryName: string;
  showAsDiff: boolean;
  toContentUrl: string;
  toPath: string;
  toRevision: string;
}

export interface Anchor {
  anchorPath: string;
  anchorRepository: string;
  stripCount: number;
}

export interface Changesets {
  changesetData: PermaID[];
  repository: string;
}

export interface Actions {
  actionData: Action[];
}

export interface Action {
  name: string;
  displayName: string;
}

export interface Participant {
  user: User;
  completed: boolean;
}

export interface Transitions {
  transitionData: Transition[];
}

export interface Transition {
  name: string;
  displayName: string;
}