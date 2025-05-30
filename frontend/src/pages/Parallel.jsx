import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import cricket1 from '../assets/bad-cricket.mp4';
import cricket2 from '../assets/good-cricket.mp4';
import piano1 from '../assets/bad-piano.mp4';
import piano2 from '../assets/good-piano.mp4';
import vlog from '../assets/vlog.mp4'; 

export default function Parallel() {
    const [cricketStep, setCricketStep] = useState(0);
    const [pianoStep, setPianoStep] = useState(0);
    const [showVlog, setShowVlog] = useState(false); 

    const handleCricketReveal = () => setCricketStep(1);
    const handleCricketFirstEnd = () => setCricketStep(2);

    const handlePianoReveal = () => setPianoStep(1);
    const handlePianoFirstEnd = () => setPianoStep(2);

    const handleVlogReveal = () => setShowVlog(true); 

    return (
        <div className="min-h-screen bg-bg-secondary text-text-primary">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-start space-y-2">
                        <p className="text-lg font-semibold italic text-accent-primary">So you made it here...</p>
                        <p className="text-base font-medium">Ready to learn something off-the-record?</p>
                    </div>

                    <div className="space-y-4 border-b border-gray-300 pb-8">
                        <div className="flex items-center space-x-2">
                            <span className="text-base">I play cricket</span>
                            <span className="text-base italic text-accent-primary font-semibold">very well.</span>
                        </div>

                        {cricketStep === 0 && (
                            <button
                                onClick={handleCricketReveal}
                                className="px-4 py-2 bg-accent-primary text-white rounded-lg shadow hover:bg-opacity-90 transition text-sm"
                            >
                                Click to reveal
                            </button>
                        )}

                        {cricketStep >= 1 && (
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <video
                                            src={cricket1}
                                            autoPlay
                                            muted
                                            onEnded={handleCricketFirstEnd}
                                            className="sm:max-h-80 object-cover rounded-lg shadow"
                                        />
                                        {cricketStep === 1 && (
                                            <p className="text-sm text-text-secondary mt-1">Oh no no.. not this</p>
                                        )}
                                    </div>
                                    {cricketStep === 2 && (
                                        <div className="flex-1">
                                            <video
                                                src={cricket2}
                                                autoPlay
                                                muted
                                                loop
                                                className="sm:max-h-80 object-cover rounded-lg shadow"
                                            />
                                            <p className="text-sm text-text-secondary mt-1">Yeah this is how I play</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 border-b border-gray-300 pb-8">
                        <div className="flex items-center space-x-2">
                            <span className="text-base italic text-accent-primary font-semibold">Sometimes,</span>
                            <span className="text-base">I also play piano</span>
                        </div>

                        {pianoStep === 0 && (
                            <button
                                onClick={handlePianoReveal}
                                className="px-4 py-2 bg-accent-primary text-white rounded-lg shadow hover:bg-opacity-90 transition text-sm"
                            >
                                Click to listen
                            </button>
                        )}

                        {pianoStep >= 1 && (
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <video
                                            src={piano2}
                                            autoPlay
                                            controls
                                            onEnded={handlePianoFirstEnd}
                                            className="sm:max-h-80 object-cover rounded-lg shadow"
                                        />
                                        {pianoStep === 1 && (
                                            <p className="text-sm text-text-secondary mt-1">Like this</p>
                                        )}
                                    </div>
                                    {pianoStep === 2 && (
                                        <div className="flex-1">
                                            <video
                                                src={piano1}
                                                autoPlay
                                                controls
                                                className="sm:max-h-80 object-cover rounded-lg shadow"
                                            />
                                            <p className="text-sm text-text-secondary mt-1">
                                                But things don’t go well all the time
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <span className="text-base">Oh, and sometimes I</span>
                            <span className="text-base italic text-accent-primary font-semibold">vlog.</span>
                        </div>

                        {!showVlog && (
                            <button
                                onClick={handleVlogReveal}
                                className="px-4 py-2 bg-accent-primary text-white rounded-lg shadow hover:bg-opacity-90 transition text-sm"
                            >
                                Click to watch
                            </button>
                        )}

                        {showVlog && (
                            <div>
                                <video
                                    src={vlog}
                                    autoPlay
                                    loop
                                    className="w-full max-h-80 object-cover rounded-lg shadow"
                                />
                                <p className="text-sm text-text-secondary mt-1 italic">
                                    Capturing moments, one clip at a time.
                                </p>
                                <a className="text-sm text-text-secondary mt-1 italic" href="https://youtu.be/LlimX_jKtSM?feature=shared">[watch full video]</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
