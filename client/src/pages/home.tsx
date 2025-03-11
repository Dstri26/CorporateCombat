import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8">
      <h1 className="text-4xl font-bold text-primary">Corporate Combat™</h1>
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to the Digital Edition</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Link href="/game">
            <Button className="w-full" size="lg">
              Start Single Player Game
            </Button>
          </Link>
          <Link href="/tutorial">
            <Button className="w-full" variant="outline" size="lg">
              Tutorial
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
