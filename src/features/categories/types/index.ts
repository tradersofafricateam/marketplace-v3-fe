export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId: string | null;
  icon?: string;
  image?: string;
  children: Category[];
};
