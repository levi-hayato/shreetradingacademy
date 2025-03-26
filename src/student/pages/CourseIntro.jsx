import React, { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaInfoCircle, FaGraduationCap, FaSchool} from 'react-icons/fa';
import { MdOutlineSlowMotionVideo, MdOutlineHighQuality } from 'react-icons/md';
import { RiSpeedFill } from 'react-icons/ri';

const CourseIntro = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const progressRef = useRef(null);

  // Replace with your Google Drive video embed URL
  const videoUrl = "https://drive.google.com/file/d/15yyPBd9T_bbkLNKpcTqoa-JzcBuaInqj/view?usp=sharing";

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const updateProgress = () => {
        setCurrentTime(video.currentTime);
        setDuration(video.duration || 0);
      };

      video.addEventListener('timeupdate', updateProgress);
      video.addEventListener('loadedmetadata', updateProgress);
      video.addEventListener('ended', () => setIsPlaying(false));

      return () => {
        video.removeEventListener('timeupdate', updateProgress);
        video.removeEventListener('loadedmetadata', updateProgress);
        video.removeEventListener('ended', () => setIsPlaying(false));
      };
    }
  }, []);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    videoRef.current.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume == 0);
  };

  const toggleMute = () => {
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      videoRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const changePlaybackRate = (rate) => {
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="min-h-screen w-full max-w-full  bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className=" w-full">
        {/* Course Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Basic to Advance Stock Market Course</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the art of trading with our comprehensive course designed for beginners and advanced traders alike
          </p>
        </div>

        {/* Video Player Container */}
        <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
          {/* Video Wrapper */}
          <div 
            className="relative pt-[56.25%] w-full" // 16:9 aspect ratio
            onMouseEnter={() => setShowControls(true)}
            onMouseLeave={() => setShowControls(false)}
          >
            {/* Google Drive Video Iframe */}
            <iframe
              ref={videoRef}
              src={`${videoUrl}?autoplay=0&controls=0`}
              className="absolute top-0 left-0 w-full h-full"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>

            {/* Custom Controls Overlay */}
            {showControls && (
              <div 
                ref={controlsRef}
                className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300"
              >
                {/* Progress Bar */}
                <div 
                  ref={progressRef}
                  className="h-2 w-full bg-gray-600/50 rounded-full mb-3 cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div 
                    className="h-full bg-indigo-500 rounded-full relative"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Controls Bar */}
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={togglePlay}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                      {isPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
                    </button>

                    <button 
                      onClick={toggleMute}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                    >
                      {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                    </button>

                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-20 accent-indigo-500"
                    />

                    <div className="text-sm">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <button 
                        onClick={() => changePlaybackRate(playbackRate === 2 ? 1 : 2)}
                        className="flex items-center p-2 rounded-full hover:bg-white/20 transition-colors"
                        title="Playback Speed"
                      >
                        <RiSpeedFill size={18} />
                        <span className="ml-1 text-sm">{playbackRate}x</span>
                      </button>
                    </div>

                    <button 
                      onClick={toggleFullscreen}
                      className="p-2 rounded-full hover:bg-white/20 transition-colors"
                      title="Fullscreen"
                    >
                      <FaExpand size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Play Button Overlay */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-16 h-16 bg-indigo-600/90 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-indigo-700 hover:scale-110"
              >
                <FaPlay size={24} className="text-white ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Course Details */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                <FaInfoCircle className="text-indigo-500 mr-3" />
                About This Course
              </h2>
              <p className="text-gray-700 mb-4">
                This comprehensive course will take you from the basics of stock market investing to advanced trading strategies. 
                You'll learn technical analysis, fundamental analysis, risk management, and how to develop your own trading plan.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <FaGraduationCap className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Level</h3>
                    <p className="text-gray-600">Beginner to Advanced</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <MdOutlineSlowMotionVideo className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Duration</h3>
                    <p className="text-gray-600">32 hours of content</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <FaSchool className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Modules</h3>
                    <p className="text-gray-600">12 comprehensive modules</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <MdOutlineHighQuality className="text-indigo-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Access</h3>
                    <p className="text-gray-600">Lifetime access</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Features</h2>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Interactive video lessons</span>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Downloadable resources</span>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Certificate of completion</span>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Q&A support</span>
              </li>
              <li className="flex items-start">
                <div className="bg-indigo-100 p-1 rounded-full mr-3 mt-1">
                  <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                </div>
                <span className="text-gray-700">Practical exercises</span>
              </li>
            </ul>

            <button className="mt-6 w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-300 shadow-md">
              Enroll Now
            </button>

            <div className="mt-4 text-center text-sm text-gray-500">
              30-day money-back guarantee
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseIntro;