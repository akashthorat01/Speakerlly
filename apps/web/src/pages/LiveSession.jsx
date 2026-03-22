import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { Mic, MicOff, Video, VideoOff, PhoneOff, MessageSquare, Maximize, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const LiveSession = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [stream, setStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const myVideoRef = useRef();
  const peerVideoRef = useRef();
  
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (myVideoRef.current) {
          myVideoRef.current.srcObject = mediaStream;
        }
      })
      .catch((error) => console.error("Media Error:", error));

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const toggleMute = () => {
    if (stream) {
        stream.getAudioTracks()[0].enabled = !stream.getAudioTracks()[0].enabled;
        setIsMuted(!stream.getAudioTracks()[0].enabled);
    }
  };

  const toggleVideo = () => {
    if (stream) {
        stream.getVideoTracks()[0].enabled = !stream.getVideoTracks()[0].enabled;
        setIsVideoOff(!stream.getVideoTracks()[0].enabled);
    }
  };

  const endCall = () => {
      // Logic to send session duration to backend goes here
      navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Top Bar */}
        <div className="absolute top-0 w-full px-6 py-8 flex justify-between items-center z-10">
            <div className="text-white font-bold text-xl drop-shadow-md">Training Room <span className="opacity-50 text-sm ml-2">#{roomId || 'ABC-123'}</span></div>
            <div className="bg-red-500/20 border border-red-500 text-white px-4 py-1.5 rounded-full font-bold text-sm flex items-center gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div> Live
            </div>
        </div>

        {/* Video Grid */}
        <div className="w-full h-[80vh] flex flex-col md:flex-row gap-4 items-center justify-center py-24 px-4 relative z-0">
            
            {/* Peer Video */}
            <div className="relative w-full md:w-2/3 h-[50vh] md:h-full bg-slate-800/50 rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/10 border border-slate-700/50 flex flex-col items-center justify-center backdrop-blur-sm">
                <video 
                    ref={peerVideoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <Loader2 size={36} className="text-blue-500 animate-spin mb-4" />
                    <p className="text-slate-400 font-semibold tracking-wide">Waiting for trainer to connect...</p>
                </div>
                <div className="absolute bottom-6 left-6 bg-slate-900/60 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-semibold border border-white/10 shadow-lg">Speaker View</div>
            </div>

            {/* My Video */}
            <div className="relative w-1/3 md:w-1/3 min-w-[200px] h-[30vh] md:h-[40vh] max-h-[500px] bg-slate-800 rounded-[2rem] overflow-hidden shadow-2xl border border-slate-700 right-4 md:right-0 absolute md:relative bottom-32 md:bottom-0 self-end md:self-auto">
                <video 
                    ref={myVideoRef} 
                    autoPlay 
                    muted 
                    playsInline 
                    className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${isVideoOff ? 'opacity-0' : 'opacity-100'}`}
                />
                {isVideoOff && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 border border-slate-700">
                            <VideoOff size={32} />
                        </div>
                    </div>
                )}
                <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/10 shadow-lg">You</div>
            </div>
        </div>

        {/* Floating Controls */}
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-xl px-10 py-5 rounded-full border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
            <button onClick={toggleMute} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${isMuted ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
                {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
            </button>
            <button onClick={toggleVideo} className={`w-14 h-14 rounded-full flex items-center justify-center transition-all cursor-pointer ${isVideoOff ? 'bg-red-500 text-white' : 'bg-white/20 hover:bg-white/30 text-white'}`}>
                {isVideoOff ? <VideoOff size={24} /> : <Video size={24} />}
            </button>
            <button className="w-14 h-14 rounded-full flex items-center justify-center transition-all bg-white/20 hover:bg-white/30 text-white cursor-pointer hidden sm:flex">
                <MessageSquare size={24} />
            </button>
            <div className="w-px h-10 bg-white/20 mx-2"></div>
            <button onClick={endCall} className="w-16 h-16 rounded-full flex items-center justify-center transition-all bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/40 cursor-pointer group">
                <PhoneOff size={28} className="group-hover:scale-110 transition-transform" />
            </button>
        </motion.div>
    </div>
  );
};

export default LiveSession;
