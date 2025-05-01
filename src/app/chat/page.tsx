'use client';
import ChatInterface from "@/components/features/chat-interface"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function ChatPage() {
  return (
    <TooltipProvider>
      <ChatInterface />
    </TooltipProvider>
  )
}