import { ChatBox } from "@/components/chatbox";
import { TreeVisualization } from "@/components/tree";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      <div className="flex flex-row w-full">
        <ChatBox/>
      </div>
    </main>
  );
}
