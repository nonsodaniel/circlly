import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { fetchUser, getActivity } from "@/lib/actions/userActions";
import { formatDateString } from "@/lib/utils";

async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const activity = await getActivity(userInfo._id);
  const isActivity = !!activity.length;

  return (
    <>
      <h1 className="head-text">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {isActivity ? (
          <>
            {activity.map((details) => {
              const author = details.author;
              if (author) {
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
                        </span>
                        {details.activityType} to your post
                        <span className="text-subtle-medium text-gray-1 px-4">
                          on {formatDateString(details.createdAt)}
                        </span>
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
