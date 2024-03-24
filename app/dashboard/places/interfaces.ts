interface Coordinates {
  latitude: number;
  longitude: number;
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
}
