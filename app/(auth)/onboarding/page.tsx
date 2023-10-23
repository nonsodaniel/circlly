import AccountProfile from "@/app/components/forms/AccountProfile";
import { fetchUser } from "@/lib/actions/userActions";
import { IUserProps } from "@/utils/types";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await currentUser();
  console.log({ user });
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (userInfo?.onboarded) redirect("/");

  const userDetails: IUserProps = {
    id: user.id,
    objectId: userInfo?._id,
    username: userInfo ? userInfo?.username : user.username,
    name: userInfo ? userInfo?.name : user.firstName ?? "",
    bio: userInfo ? userInfo?.bio : "",
    image: userInfo ? userInfo?.image : user.imageUrl,
  };

  return (
    <main className="mx-auto flex max-w-3xl flex-col justify-start px-10 py-20">
      <h1 className="head-text">Onboarding</h1>
      <p className="mt-3 text-base-regular text-light-2">
        Complete your profile now, to use Circlly.
      </p>

      <section className="mt-9 bg-dark-2 p-10">
        <AccountProfile user={userDetails} title="Continue" />
      </section>
    </main>
  );
};

export default Page;
