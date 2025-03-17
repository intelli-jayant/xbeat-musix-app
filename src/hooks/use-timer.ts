import { useEffect, useState } from "react";
import { useGlobalAudioPlayer } from "react-use-audio-player";

function useTimer() {
  const { getPosition, playing } = useGlobalAudioPlayer();
  const [currentMillisecond, setCurrentMillisecond] = useState(
    getPosition() * 1000
  );

  useEffect(() => {
    if (playing) {
      const timer = window.setInterval(() => {
        setCurrentMillisecond(getPosition() * 1000);
      }, 100);
      return () => window.clearInterval(timer);
    }
  }, [playing, getPosition]);

  return { currentMillisecond };
}

export default useTimer;
