export interface AirbnbList {
  _id : string,
  id: number;
  listing_url: string;
  scrape_id: number;
  last_scraped: string;
  source: string;
  name: string;
  description: string;
  neighborhood_overview: string;
  picture_url: string;
  host_id: number;
  host_url: string;
  host_name: string;
  host_since: string;
  host_location: string;
  host_about: string;
  host_response_time: string;
  host_response_rate: string;
  host_acceptance_rate: string;
  host_is_superhost: string;
  host_thumbnail_url: string;
  host_picture_url: string;
  host_neighbourhood: string;
  host_listings_count: number;
  host_total_listings_count: number;
  host_verifications: string;
  host_has_profile_pic: string;
  host_identity_verified: string;
  neighbourhood: string;
  neighbourhood_cleansed: string;
  neighbourhood_group_cleansed: string;
  latitude: number;
  longitude: number;
  property_type: string;
  room_type: string;
  accommodates: number;
  bathrooms: null;
  bathrooms_text: string;
  bedrooms: null;
  beds: null;
  amenities: string;
  price: string;
  minimum_nights: number;
  maximum_nights: number;
  minimum_minimum_nights: number;
  maximum_minimum_nights: number;
  minimum_maximum_nights: number;
  maximum_maximum_nights: number;
  minimum_nights_avg_ntm: number;
  maximum_nights_avg_ntm: number;
  calendar_updated: string;
  has_availability: string;
  availability_30: number;
  availability_60: number;
  availability_90: number;
  availability_365: number;
  calendar_last_scraped: string;
  number_of_reviews: number;
  number_of_reviews_ltm: number;
  number_of_reviews_l30d: number;
  first_review: string;
  last_review: string;
  review_scores_rating: number;
  review_scores_accuracy: number;
  review_scores_cleanliness: number;
  review_scores_checkin: number;
  review_scores_communication: number;
  review_scores_location: number;
  review_scores_value: number;
  license: string;
  instant_bookable: string;
  calculated_host_listings_count: number;
  calculated_host_listings_count_entire_homes: number;
  calculated_host_listings_count_private_rooms: number;
  calculated_host_listings_count_shared_rooms: number;
  reviews_per_month: number;
}
