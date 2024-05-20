export interface Coordinates {
  lat: number;
  lng: number;
}
export interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
  province: string;
  coordinates: Coordinates;
}

export interface Place {
  id: string;
  name: string;
  description?: string;
  address: Address;
  importance: number;
  coordinates?: Coordinates;
  createdAt: Date;
  updatedAt: Date;
}

export interface PlaceMap {
  id: string;
  name: string;
  address: {
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  importance: number;
}
