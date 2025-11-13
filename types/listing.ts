export interface ListingData {
  id: string;
  title: string;
  description?: string;
  price: number;
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  specs?: string; // Formatted string of all available attributes
}

export interface ApiError {
  error: string;
}

