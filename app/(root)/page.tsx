import { fetchPosts } from "@/lib/actions/postAction";
import { fetchUser } from "@/lib/actions/userActions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import PostCard from "../components/cards/PostCard";

const Home = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const result = await fetchPosts(
    searchParams.page ? +searchParams.page : 1,
    30
  );

  console.log({ ...result });

  return (
    <>
      <h1 className="head-text text-left">Home</h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No Posts found</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <PostCard
                key={post._id}
                id={post._id}
                currentUserId={user.id}
                parentId={post.parentId}
                content={post.text}
                author={post.author || userInfo} //Todo: take a look at why post.author is null
                community={post.community || "Web community"}
                createdAt={post.createdAt}
                comments={post.children}
              />
            ))}
          </>
        )}
      </section>

      {/* <Pagination
        path="/"
        pageNumber={searchParams?.page ? +searchParams.page : 1}
        isNext={result.isNext}
      /> */}
    </>
  );
};

export default Home;
