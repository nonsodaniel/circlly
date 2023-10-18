import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div>
      <UserButton afterSignOutUrl="/" />
      <h1 className="head-text text-left">Home page</h1>
    </div>
  );
}
