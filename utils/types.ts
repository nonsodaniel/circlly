export interface IUserProps {
  id: string;
  objectId: string;
  username: string | null;
  name: string | null;
  bio: string;
  image: string;
}

export interface IPostCardProps {
  id: string;
  currentUserId: string;
  parentId: string | null;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  community: {
    id: string;
    name: string;
    image: string;
  } | null;
  createdAt: string;
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
}
