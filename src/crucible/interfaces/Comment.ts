import { User } from './User';
import { PermaID } from './Common';
import { ReviewMetric } from './ReviewMetric';

export interface Comments {
	comments: Comment[];
}

export interface NewComment {
	defectApproved: boolean;
	defectRaised: boolean;
	deleted: boolean;
	draft: boolean;
	message: string;
	parentCommentId: PermaID;
	permaId: PermaID;
	permId: PermaID;
}

export interface Comment {
	createDate: number | string;
	defectApproved: boolean;
	defectRaised: boolean;
	deleted: boolean;
	draft?: boolean;
	fromLineRange: string;
	message: string;
	messageAsHtml: string;
	metrics?: ReviewMetric;
	parentCommentId?: ReviewMetric;
	permaId?: PermaID;
	permId?: PermaID;
	readStatus: string;
	replies?: any[];
	reviewItemId: PermaID;
	toLineRange: string;
	user: User;
}
