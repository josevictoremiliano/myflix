import Link from "next/link";
import { Button } from "./ui/button";

export default function Navbar() {
    return (
        <header className="fixed top-0 w-full z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black to-transparent text-white">
        <h1 className="text-4xl font-bold text-red-600">MyFlix</h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="hover:bg-gray-300 hover:text-zinc-950 py-2 px-6 rounded-2xl">
                Home
              </Link>
            </li>
            <li>
              <Link href="/newvideo" className="hover:bg-red-600 hover:text-zinc-50 py-2 px-6 rounded-2xl">
                Novo video
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
}
