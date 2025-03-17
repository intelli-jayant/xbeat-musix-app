import { Toggle } from "@/components/ui/toggle";
import { useAudioDetailsActiveTab } from "@/hooks/atom-hooks";
import { ListMusic } from "lucide-react";

export const ToggleQueueButton = () => {
  const [audioDetailsActiveTab, setAudioDetailsActiveTab] =
    useAudioDetailsActiveTab();
  return (
    <Toggle
      aria-label="Toggle queue"
      size="sm"
      className="rounded-full"
      pressed={audioDetailsActiveTab === "queue"}
      onClick={() => {
        if (audioDetailsActiveTab !== "queue") {
          setAudioDetailsActiveTab("queue");
        } else {
          setAudioDetailsActiveTab(null);
        }
      }}
    >
      <ListMusic size={20} />
    </Toggle>
  );
};
