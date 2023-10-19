import AccountProfile from "@/app/components/forms/AccountProfile";
import { IUserProps } from "@/utils/types";
import { currentUser } from "@clerk/nextjs";

const Page = async () => {
  const user = await currentUser();
  console.log({ user });
  if (!user) return null;

  const userDetails: IUserProps = {
    id: user.id,
    objectId: "129jsdj929",
    username: user.username,
    name: user.firstName,
    bio: "A good boy",
    image: user.imageUrl,
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
