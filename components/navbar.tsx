import React from "react";
import Image from "next/image";

import { ModeToggle } from "./ui/toggle-mode";
function Navbar() {
  return (
    <nav className=" flex items-center justify-between w-full lg:max-w-5xl lg:w-full">
      <div>
        <Image
          src="/logo.svg"
          width={100}
          height={24}
          alt="app logo"
          className="dark:invert"
        />
      </div>
      <div>
        <ModeToggle />
      </div>
    </nav>
  );
}

export default Navbar;
