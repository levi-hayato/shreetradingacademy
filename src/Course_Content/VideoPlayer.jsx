import { useState } from 'react';
import { FaPlay, FaPause, FaExpand, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

const VideoPlayer = ({ url }) => {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  // This is a mock player - in a real app you'd use a library like react-player
  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <div className="aspect-w-16 aspect-h-9">
        <div className="flex items-center justify-center h-full bg-gray-800">
          {!playing && (
            <button 
              onClick={() => setPlaying(true)}
              className="absolute z-10 text-white hover:text-blue-400 transition-colors"
            >
              <FaPlay className="h-16 w-16" />
            </button>
          )}
          <div className="w-full h-full flex items-center justify-center text-white">
            <p>Video Player Placeholder</p>
            <p className="absolute bottom-4 left-4 text-sm">{Math.floor(progress * 100)}% watched</p>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => setPlaying(!playing)}
            className="text-white hover:text-blue-400 transition-colors"
          >
            {playing ? <FaPause /> : <FaPlay />}
          </button>
          
          <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-500" 
              style={{ width: `${progress * 100}%` }}
            ></div>
          </div>
          
          <button 
            onClick={() => setMuted(!muted)}
            className="text-white hover:text-blue-400 transition-colors"
          >
            {muted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
          
          <button className="text-white hover:text-blue-400 transition-colors">
            <FaExpand />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;