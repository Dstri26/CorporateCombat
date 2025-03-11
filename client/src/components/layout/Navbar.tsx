import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/">
          <span className="text-xl font-semibold cursor-pointer">
            Corporate Combat™
          </span>
        </Link>
        <div className="flex gap-4">
          <Link href="/game">
            <Button variant="ghost">Play</Button>
          </Link>
          <Link href="/tutorial">
            <Button variant="ghost">Tutorial</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
