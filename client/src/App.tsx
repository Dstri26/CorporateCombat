import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Game from "@/pages/game";
import Tutorial from "@/pages/tutorial";
import Navbar from "@/components/layout/Navbar";

function Router() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/game" component={Game} />
          <Route path="/tutorial" component={Tutorial} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
