import { Review } from '../interfaces/Review';


export interface ReviewProviderI {
  getReviews(): Promise<Review[]>;
}