export default interface IPhoto {
  id?: string;
  url: string;
  sizes: {
    [key: string]: string;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  createdBy?: string;
  order?: number;
  deleteBy?: string;
  name?: string;
}

export interface IPhotoExisting extends Omit<IPhoto, 'order'> {
  order: number;
}
