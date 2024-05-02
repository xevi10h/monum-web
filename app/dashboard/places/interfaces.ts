interface Coordinates {
  lat: number;
  lng: number;
}
interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
  province: string;
  coordinates?: Coordinates;
}

interface Place {
  id: string;
  name: string;
  description?: string;
  address: Address;
  importance: number;
  coordinates?: Coordinates;
  createdAt: Date;
  updatedAt: Date;
}
