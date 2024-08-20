import Link from "next/link";

const UserLinks = () => {
  return (
    <>
      <Link
        href={"/user/dashboard"}
        className="mx-2 hover:text-gray-300 text-center py-2"
      >
        Dashboard
      </Link>
      <Link
        href={"/user/routines"}
        className="mx-2 hover:text-gray-300 text-center py-2"
      >
        Routines
      </Link>
    </>
  );
};

export default UserLinks;
