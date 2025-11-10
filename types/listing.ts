export interface ListingData {
  id: string;
  title: string;
  description?: string;
  price: number;
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
}

export interface ApiError {
  error: string;
}

