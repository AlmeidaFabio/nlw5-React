import { createContext, ReactNode, useContext, useState } from "react";

type Episode = {
    title:string;
    members:string;
    thumbnail:string;
    duration:number;
    url:string;
}

type PlayerContextData = {
    episodes:Episode[];
    currentEpisodeIndex: number;
    isPlaying:boolean;
    play: (episode:Episode) => void;
    playlist:(list: Episode[], index:number) => void;
    tooglePlay:() => void;
    setPlayState:(state:boolean) => void;
    playNext:() => void;
    playPrevious:() => void;
    hasNext:boolean,
    hasPrevious:boolean;
    isLooping:boolean;
    toogleLoop:() => void;
    isShuffling:boolean;
    toogleShuffle:() => void;
    clearPlayerState:() => void;
}

type PlayerContextProviderProps = {
  children:ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodes, setEpisodes] = useState([]);
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLooping, setIsLooping] = useState(false);
    const [isShuffling, setIsShuffling] = useState(false);
  
    function play(episode: Episode) {
      setEpisodes([episode]);
      setCurrentEpisodeIndex(0);
      setIsPlaying(true);
    }

    function playlist(list:Episode[], index:number) {
      setEpisodes(list);
      setCurrentEpisodeIndex(index);
      setIsPlaying(true)
    }
  
    function tooglePlay() {
      setIsPlaying(!isPlaying);
    }

    function toogleLoop() {
      setIsLooping(!isLooping);
    }

    function toogleShuffle() {
      setIsShuffling(!isShuffling)
    }
  
    function setPlayState(state: boolean) {
      setIsPlaying(state)
    }

    function clearPlayerState() {
      setEpisodes([]);
      setCurrentEpisodeIndex(0)
    }

    const hasPrevious = currentEpisodeIndex > 0;
    const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodes.length;

    function playNext() {
      if(isShuffling) {
        const nextRandonEpisodeIndex = Math.floor(Math.random() * episodes.length);

        setCurrentEpisodeIndex(nextRandonEpisodeIndex);

      } else if(hasNext) {
        setCurrentEpisodeIndex(currentEpisodeIndex + 1)
      }
    }

    function playPrevious() {     
      if(hasPrevious) {
        setCurrentEpisodeIndex(currentEpisodeIndex - 1)
      }
    }

    return (
        <PlayerContext.Provider value={{ 
          episodes, 
          currentEpisodeIndex, 
          play, 
          playlist,
          isPlaying, 
          tooglePlay, 
          setPlayState,
          playNext,
          playPrevious,
          hasNext,
          hasPrevious,
          isLooping,
          toogleLoop,
          isShuffling,
          toogleShuffle,
          clearPlayerState
        }}>
          {children}
        </PlayerContext.Provider>
    )
}

export const usePlayer = () => {
  return useContext(PlayerContext);
}