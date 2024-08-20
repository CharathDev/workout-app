"use client";
import { app, auth, firestore } from "@/firebase/firebase";
import { getApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut, type User } from "firebase/auth";
import { doc, DocumentData, getDoc } from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import UserLinks from "./UserLinks";
import AdminLinks from "./AdminLinks";

const TopNav = () => {
  const [currentUser, setUser] = useState<User | null>(null);
  const [userInfo, setUserInfo] = useState<DocumentData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  function getMenuClasses() {
    let menuClasses = [];
    if (isOpen) {
      menuClasses = [
        "flex",
        "absolute",
        "top-[60px]",
        "bg-neutral-950",
        "w-full",
        "p-10",
        "gap-10",
        "flex-col",
        "left-0",
      ];
    } else {
      menuClasses = ["hidden", "md:flex"];
    }
    return menuClasses.join(" ");
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        let temp = await getDoc(doc(firestore, "users", user.uid));
        console.log("pls");
        setUserInfo(temp.data()!);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (e) {
      console.error("Logout error: ", e);
    }
  };

  return (
    <>
      {currentUser && (
        <nav className=" bg-neutral-950 text-white p-4 sm:p-4 md:flex md:justify-between md:items-center">
          <div className="container mx-auto flex justify-between items-center">
            <a href="/dashboard" className="text-2xl font-bold">
              Workout App
            </a>
            <div className="flex">
              <div className={getMenuClasses()}>
                {userInfo && userInfo!.isAdmin ? <AdminLinks /> : <UserLinks />}
              </div>

              <div className="mx-2">
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 font-bold bg-rose-500 text-neutral-950 rounded-md hover:bg-rose-600"
                >
                  Logout
                </button>
              </div>

              <div className="md:hidden flex items-center">
                <button
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                >
                  {isOpen ? (
                    <IoCloseOutline size={24} />
                  ) : (
                    <IoIosMenu size={24} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
};

export default TopNav;
