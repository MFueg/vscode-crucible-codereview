import * as crucible from 'crucible-connector';

export interface ReviewProviderI {
  getReviews(): Promise<crucible.Review[]>;
}
