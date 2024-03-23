import Layout from "./components/layout";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const getFirstName = (fullName) => {
    return fullName?.split(" ")[0] || "";
  };
  return (
    <Layout>
      <div className="text-blue-900 items-center flex justify-between">
        <h2>
          Howdy, <b>{getFirstName(session?.user?.name)}</b>
        </h2>
        <div className="flex bg-gray-300 rounded-lg text-black overflow-hidden items-center gap-0.15">
          {/* <img src={session?.user?.image} alt="" className="w-6 h-6" /> */}
          <div className="w-6 h-6 flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
          </div>
          <span className=" px-2">{session?.user?.name}</span>
        </div>
      </div>
    </Layout>
  );
}
