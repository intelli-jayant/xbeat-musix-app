"use client";
import {
  useAudioDetailsActiveTab,
  useCurrentAudioDetails,
} from "@/hooks/atom-hooks";
import AudioDetailsSidebarContent from "./audio-details-sidebar-content";
import { Skeleton } from "@/components/ui/skeleton";

const AudioDetailsSidebar = () => {
  const activeTab = useAudioDetailsActiveTab()[0];
  const currentAudioDetails = useCurrentAudioDetails()[0];
  return (
    !!activeTab && (
      <div className="h-[calc(100dvh-128px)] hidden w-1/5 min-w-[240px] max-w-[320px] lg:block p-3 pl-0">
        <div className="dark:bg-neutral-900 size-full rounded-md relative">
          {activeTab === "queue" ? (
            <AudioDetailsSidebarContent />
          ) : currentAudioDetails?.id ? (
            <AudioDetailsSidebarContent />
          ) : (
            <div className="space-y-4 p-3">
              <div className="flex justify-between items-center py-3">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-6" />
              </div>
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
            </div>
          )}
        </div>
      </div>
    )
  );
};
export default AudioDetailsSidebar;
