import { Button } from "@/components/ui/button";
import {
  useAudioDetailsActiveTab,
  useCurrentAudioDetails,
} from "@/hooks/atom-hooks";
import { X } from "lucide-react";
import LyricsTab from "./lyrics/lyrics-tab";
import { QueueTab } from "./queue-tab";
import { ScrollArea } from "@/components/ui/scroll-area";

const AudioDetailsSidebarContent = () => {
  const [activeTab, setActiveTab] = useAudioDetailsActiveTab();
  const currentAudioDetails = useCurrentAudioDetails()[0];
  return (
    <>
      <header className="p-3 flex justify-between items-center border-b">
        <h4 className="capitalize font-heading text-xl">{activeTab}</h4>
        <Button
          onClick={() => setActiveTab(null)}
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <X />
        </Button>
      </header>

      {activeTab === "lyrics" && currentAudioDetails?.id && (
        <div className="size-full">
          <LyricsTab />
        </div>
      )}
      {activeTab === "queue" && (
        <ScrollArea className="h-[calc(100%-64px)] overflow-auto w-full">
          <QueueTab />
        </ScrollArea>
      )}
    </>
  );
};
export default AudioDetailsSidebarContent;
