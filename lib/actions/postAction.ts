"use server";

import { revalidatePath } from "next/cache";

import { DBConnection } from "../mongoose";

import User from "../models/userModels";
import Community from "../models/communityModels";
import Post from "../models/postModel";

interface Params {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

export async function createPost({ text, author, communityId, path }: Params) {
  try {
    DBConnection();

    const communityIdObject = await Community.findOne(
      { id: communityId },
      { _id: 1 }
    );

    const createdPost = await Post.create({
      text,
      author,
      community: communityIdObject, // Assign communityId if provided, or leave it null for personal account
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    });

    if (communityIdObject) {
      // Update Community model
      await Community.findByIdAndUpdate(communityIdObject, {
        $push: { posts: createdPost._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
}

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  DBConnection();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level Posts) (a Post that is not a comment/reply).
  const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "community",
      model: Community,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  const totalPostsCount = await Post.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;
  console.log({ posts });

  return { posts, isNext };
}

export async function fetchPostById(postId: string) {
  DBConnection();

  try {
    const post = await Post.findById(postId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Post,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .exec();

    return post;
  } catch (err) {
    console.error("Error while fetching post:", err);
    throw new Error("Unable to fetch post");
  }
}

export const addCommentToPost = async (
  postId: string,
  commentText: string,
  userId: string,
  path: string
) => {
  DBConnection();

  try {
    // Find the original post by its ID
    const originalpost = await Post.findById(postId);

    if (!originalpost) {
      throw new Error("post not found");
    }

    // Create the new comment post
    const commentPost = new Post({
      text: commentText,
      author: userId,
      parentId: postId, // Set the parentId to the original post's ID
    });

    // Save the comment post to the database
    const savedCommentPost = await commentPost.save();

    // Add the comment post's ID to the original post's children array
    originalpost.children.push(savedCommentPost._id);

    // Save the updated original post to the database
    await originalpost.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
};

export const likePost = async (postId: string, userId: string) => {
  try {
    // Find the post by its ID
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    // Check if the user has already liked the post
    const hasLiked = post.likes.includes(userId);

    if (hasLiked) {
      // User already liked the post, so remove the like
      post.likes = post.likes.filter(
        (likeId: any) => likeId.toString() !== userId.toString()
      );
    } else {
      // User hasn't liked the post, so add the like
      post.likes.push(userId);
    }

    // Save the updated post with likes to the database
    await post.save();

    return post.likes;
  } catch (error) {
    console.error("Error while liking post:", error);
    throw new Error("Unable to like/unlike post");
  }
};
