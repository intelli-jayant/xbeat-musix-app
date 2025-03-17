import SyncLyrics from "./sync-lyrics";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Label } from "@/components/ui/label";
const LyricsTab = () => {
  const [isSync, setIsSync] = useState(true);
  return (
    <>
      <div className="flex justify-end">
        <div className="flex items-center gap-2 p-3">
          <Switch
            id="lyrics-mode"
            checked={isSync}
            onCheckedChange={setIsSync}
          />
          <Label htmlFor="lyrics-mode">Sync</Label>
        </div>
      </div>

      <SyncLyrics view={isSync ? "sync" : "plain"} setIsSync={setIsSync} />
    </>
  );
};
LyricsTab.displayName = "LyricsTab";

export default LyricsTab;
