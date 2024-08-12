import Link from "next/link";

const AdminLinks = () => {
  return (
    <>
      <Link
        href={"/admin/dashboard"}
        className="mx-2 hover:text-gray-300 text-center py-2"
      >
        Dashboard
      </Link>
    </>
  );
};

export default AdminLinks;
