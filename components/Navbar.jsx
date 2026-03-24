"use client";

import React from "react";
import { assets, CartIcon, BagIcon } from "@/assets/assets";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";

const Navbar = () => {
  const { isSeller, router, cartItems } = useAppContext();
  const { openSignIn } = useClerk();
  const { user } = useUser();

  return (
    <nav className="flex items-center justify-between px-4 md:px-10 lg:px-20 py-3 border-b text-gray-700">

      <Link href="/" className="flex items-center">
        <Image src={assets.logo} alt="logo" className="w-28 md:w-32" priority />
      </Link>

      <div className="hidden md:flex items-center gap-6">
        <Link href="/">Home</Link>
        <Link href="/all-products">Shop</Link>
        <Link href="/">About</Link>
        <Link href="/">Contact</Link>

        {isSeller && (
          <button
            onClick={() => router.push("/seller")}
            className="text-xs border px-3 py-1 rounded-full"
          >
            Seller
          </button>
        )}
      </div>

      <div className="flex items-center gap-4">

        {/* CART */}
        <button
          onClick={() => router.push("/cart")}
          className="relative"
          aria-label="Cart"
        >
          <CartIcon />
          {Array.isArray(cartItems) && cartItems.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
              {cartItems.length}
            </span>
          )}
        </button>

        {/* USER */}
        {user ? (
          <UserButton afterSignOutUrl="/">
            <UserButton.MenuItems>

              <UserButton.Action
                label="Home"
                onClick={() => window.location.href = "/"}
              />

              <UserButton.Action
                label="Products"
                onClick={() => window.location.href = "/all-products"}
              />

              <UserButton.Action
                label="Cart"
                labelIcon={<CartIcon />}
                onClick={() => window.location.href = "/cart"}
              />

              <UserButton.Action
                label="My Orders"
                labelIcon={<BagIcon />}
                onClick={() => window.location.href = "/my-orders"}
              />

            </UserButton.MenuItems>
          </UserButton>
        ) : (
          <button onClick={openSignIn} aria-label="Account">
            <Image src={assets.user_icon} alt="user" />
          </button>
        )}

      </div>
    </nav>
  );
};

export default Navbar;