import { useState, useEffect } from "react";
import { socket } from "@/lib/socket";
import { api } from "@/lib/api";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";

export function CommandCenter() {
  const [input, setInput] = useState("");

  useEffect(() => {
    const handleAdminMsg = (data: { message: string }) => {
      if (data && typeof data.message === "string") {
        toast.info(data.message);
      }
    };

    socket.on("admin_message", handleAdminMsg);

    return () => {
      socket.off("admin_message", handleAdminMsg);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const msg = input;

    setInput("");

    try {
      await api.post("/tickets", { message: msg });

      socket.emit("ticket_created", msg);
      toast.success("Sent to HQ");
    } catch {
      toast.error("Failed to send");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-0 w-full bg-white border-t p-4 flex justify-center gap-2"
    >
      <div className="max-w-4xl w-full flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Command Center..."
        />

        <Button type="submit">
          <Send className="h-4 w-4 mr-2" /> Send
        </Button>
      </div>
    </form>
  );
}
