interface Address {
  street: string;
  city: string;
  country: string;
  postalCode: string;
  province: string;
}

interface Place {
  id: string;
  name: string;
  address: Address;
  importance: number;
}
