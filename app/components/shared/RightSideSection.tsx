import { currentUser } from "@clerk/nextjs";

const RightSidebar = async () => {
  return (
    <section className="custom-scrollbar rightsideSection">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Trending Communities
        </h3>

        <div className="mt-7 flex w-[350px] flex-col gap-9"></div>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Similar Minds</h3>
      </div>
    </section>
  );
};

export default RightSidebar;
