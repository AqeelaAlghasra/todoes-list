import { signInAction } from "@/actions/auth-action";
import Tasks from "@/components/todovex/tasks";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function Home() {
  
  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <h1>Log In</h1>
      <form action={signInAction}>

      <Button>Log In</Button>
      </form>
      
      

    </div>


  );
}
