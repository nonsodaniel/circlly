import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/userActions";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);
  const isLikedPostExist = !!activity?.postsLikedByOthers.length;

  return (
    <>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {activity?.replies.length > 0 ? (
          <>
            {activity.replies.map((activity) => (
              <Link key={activity._id} href={`/post/${activity.parentId}`}>
                <article className="activity-card">
                  <Image
                    src={activity.author.image}
                    alt="user_logo"
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {activity.author.name}
                    </span>{" "}
                    replied to your post
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : null}

        {isLikedPostExist ? (
          <>
            {activity.postsLikedByOthers.map((details) => {
              if (details.author) {
                const author = details.author;
                return (
                  <Link key={details._id} href={`/post/${details.parentId}`}>
                    <article className="activity-card">
                      <Image
                        src={author.image}
                        alt="user_logo"
                        width={20}
                        height={20}
                        className="rounded-full object-cover"
                      />
                      <p className="!text-small-regular text-light-1">
                        <span className="mr-1 text-primary-500">
                          {author.name}
                        </span>{" "}
                        liked to your post
                      </p>
                    </article>
                  </Link>
                );
              }
            })}
          </>
        ) : null}
      </section>
    </>
  );
}

export default Page;
