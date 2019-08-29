import { Review } from '../crucible/interfaces/Review';

export interface ReviewProviderI {
	getReviews(): Promise<Review[]>;
}
