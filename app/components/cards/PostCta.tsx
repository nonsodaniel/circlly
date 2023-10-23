"use client";

import React, { useState } from "react";
import Image from "next/image";
import { likePost } from "@/lib/actions/postAction";
import Link from "next/link";

interface IPostCtaProps {
  postId: string;
  currentUserId: string;
  likes: any;
}

const PostCta = ({ postId, currentUserId, likes }: IPostCtaProps) => {
  const isLiked = !!likes?.length ? likes.includes(currentUserId) : false;
  const [like, setLike] = useState(isLiked);
  const handleLikePost = () => {
    setLike(!like);

    likePost(postId, currentUserId);
  };
  return (
    <div className="flex gap-3.5">
      <span className="flex items-center">
        <Image
          src={`/assets/heart-${like ? "filled" : "gray"}.svg`}
          alt="heart"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
          onClick={handleLikePost}
        />
        <span className="text-subtle-medium text-gray-1">
          {likes?.length || ""}
        </span>
      </span>

      <Link href={`/post/${postId}`}>
        <Image
          src="/assets/reply.svg"
          alt="heart"
          width={24}
          height={24}
          className="cursor-pointer object-contain"
        />
      </Link>
      <Image
        src="/assets/repost.svg"
        alt="heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
      />
      <Image
        src="/assets/share.svg"
        alt="heart"
        width={24}
        height={24}
        className="cursor-pointer object-contain"
      />
    </div>
  );
};

export default PostCta;
