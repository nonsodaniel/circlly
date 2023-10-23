"use server";

import Community from "../models/communityModels";
import Post from "../models/postModel";
import User from "../models/userModels";
import { DBConnection } from "../mongoose";
import { revalidatePath } from "next/cache";
import { FilterQuery, SortOrder } from "mongoose";

interface Params {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
}

export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    DBConnection();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true }
    );
    if (path === "/profile/edit") {
      revalidatePath(path);
    }
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUser(userId: string) {
  try {
    DBConnection();

    return await User.findOne({ id: userId }).populate({
      path: "communities",
      model: Community,
    });
  } catch (error: any) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }
}

export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    DBConnection();

    // Calculate the number of users to skip based on the page number and page size.
    const skipAmount = (pageNumber - 1) * pageSize;

    // Create a case-insensitive regular expression for the provided search string.
    const regex = new RegExp(searchString, "i");

    // Create an initial query object to filter users.
    const query: FilterQuery<typeof User> = {
      id: { $ne: userId }, // Exclude the current user from the results.
    };

    // If the search string is not empty, add the $or operator to match either username or name fields.
    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    // Define the sort options for the fetched users based on createdAt field and provided sort order.
    const sortOptions = { createdAt: sortBy };

    const usersQuery = User.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize);

    // Count the total number of users that match the search criteria (without pagination).
    const totalUsersCount = await User.countDocuments(query);

    const users = await usersQuery.exec();

    // Check if there are more users beyond the current page.
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    DBConnection();

    const posts = await User.findOne({ id: userId }).populate({
      path: "posts",
      model: Post,
      populate: [
        {
          path: "community",
          model: Community,
          select: "name id image _id",
        },
        {
          path: "children",
          model: Post,
          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      ],
    });
    return posts;
  } catch (error) {
    console.error("Error fetching user posts:", error);
    throw error;
  }
}
export async function getActivity(userId: string) {
  try {
    DBConnection();

    // Find all posts created by the user
    const userPosts = await Post.find({ author: userId });

    // Collect all the child Post ids (replies) from the 'children' field of each user Post
    const childPostIds = userPosts.reduce((acc, userPost) => {
      return acc.concat(userPost.children);
    }, []);

    // Find and return the child Posts (replies) excluding the ones created by the same user
    const replies = await Post.find({
      _id: { $in: childPostIds },
      author: { $ne: userId }, // Exclude posts authored by the same user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    // Find the user's liked posts
    const likedPosts = await Post.find({
      _id: { $in: childPostIds },
      likes: userId,
    }).populate({
      path: "author",
      model: User,
      select: "name image _id",
    });

    // Find posts liked by others (excluding the user's own posts and posts they liked)
    const postsLikedByOthers = await Post.find({
      _id: { $nin: userPosts.map((post) => post._id) }, // Exclude the user's own posts
      likes: { $ne: userId }, // Exclude posts liked by the user
    }).populate({
      path: "author",
      model: User,
      select: "name image _id createdAt",
    });

    // Combine all activities into a single array with activityType and createdAt properties
    const allActivities = [
      ...replies.map((activity) => ({
        ...activity._doc,
        activityType: "replied",
        createdAt: activity.createdAt,
      })),
      ...likedPosts.map((activity) => ({
        ...activity._doc,
        activityType: "liked",
        createdAt: activity.createdAt,
      })),
      ...postsLikedByOthers.map((activity) => ({
        ...activity._doc,
        activityType: "liked",
        createdAt: activity.createdAt,
      })),
    ];
    // Sort activities by date created (newest first)
    allActivities.sort((a, b) => b.createdAt - a.createdAt);
    return allActivities;
  } catch (error) {
    console.error("Error fetching activities: ", error);
    throw error;
  }
}
