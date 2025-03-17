import { Toggle } from "@/components/ui/toggle";
import { useAudioDetailsActiveTab } from "@/hooks/atom-hooks";
import { MicVocal } from "lucide-react";

export const ToggleLyricsButton = () => {
  const [audioDetailsActiveTab, setAudioDetailsActiveTab] =
    useAudioDetailsActiveTab();
  return (
    <Toggle
      aria-label="Toggle lyrics"
      size="sm"
      className="rounded-full"
      pressed={audioDetailsActiveTab === "lyrics"}
      onClick={() => {
        if (audioDetailsActiveTab !== "lyrics") {
          setAudioDetailsActiveTab("lyrics");
        } else {
          setAudioDetailsActiveTab(null);
        }
      }}
    >
      <MicVocal size={20} />
    </Toggle>
  );
};
