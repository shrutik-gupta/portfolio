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
        <div className="min-h-screen bg-bg-primary text-text-primary">
            <Navbar />
            <div className="px-gutter pb-24 pt-32">
                <div className="max-w-3xl mx-auto space-y-10">
                    <div className="text-start space-y-4">
                        <p className="eyebrow">Off the record</p>
                        <p className="serif-italic text-fluid-4 text-accent-primary">So you made it here...</p>
                        <p className="text-fluid-0 text-text-secondary">Ready to learn something that isn’t on the résumé?</p>
                    </div>

                    <div className="space-y-4 border-b border-border-default pb-10">
                        <div className="flex items-center space-x-2">
                            <span className="text-fluid-1 text-text-primary">I play cricket</span>
                            <span className="serif-italic text-fluid-1 text-accent-primary">very well.</span>
                        </div>

                        {cricketStep === 0 && (
                            <button
                                onClick={handleCricketReveal}
                                data-cursor="link"
                                className="rounded-full border border-accent-primary px-6 py-3 text-fluid--2 uppercase tracking-[0.2em] text-accent-primary transition-colors duration-500 ease-out-expo hover:bg-accent-primary hover:text-text-inverse"
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
                                            className="sm:max-h-80 object-cover "
                                        />
                                        {cricketStep === 1 && (
                                            <p className="mt-3 text-fluid--2 uppercase tracking-[0.2em] text-text-muted">Oh no no.. not this</p>
                                        )}
                                    </div>
                                    {cricketStep === 2 && (
                                        <div className="flex-1">
                                            <video
                                                src={cricket2}
                                                autoPlay
                                                muted
                                                loop
                                                className="sm:max-h-80 object-cover "
                                            />
                                            <p className="mt-3 text-fluid--2 uppercase tracking-[0.2em] text-text-muted">Yeah this is how I play</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4 border-b border-border-default pb-10">
                        <div className="flex items-center space-x-2">
                            <span className="serif-italic text-fluid-1 text-accent-primary">Sometimes,</span>
                            <span className="text-fluid-1 text-text-primary">I also play piano</span>
                        </div>

                        {pianoStep === 0 && (
                            <button
                                onClick={handlePianoReveal}
                                data-cursor="link"
                                className="rounded-full border border-accent-primary px-6 py-3 text-fluid--2 uppercase tracking-[0.2em] text-accent-primary transition-colors duration-500 ease-out-expo hover:bg-accent-primary hover:text-text-inverse"
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
                                            className="sm:max-h-80 object-cover "
                                        />
                                        {pianoStep === 1 && (
                                            <p className="mt-3 text-fluid--2 uppercase tracking-[0.2em] text-text-muted">Like this</p>
                                        )}
                                    </div>
                                    {pianoStep === 2 && (
                                        <div className="flex-1">
                                            <video
                                                src={piano1}
                                                autoPlay
                                                controls
                                                className="sm:max-h-80 object-cover "
                                            />
                                            <p className="mt-3 text-fluid--2 uppercase tracking-[0.2em] text-text-muted">
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
                            <span className="text-fluid-1 text-text-primary">Oh, and sometimes I</span>
                            <span className="serif-italic text-fluid-1 text-accent-primary">vlog.</span>
                        </div>

                        {!showVlog && (
                            <button
                                onClick={handleVlogReveal}
                                data-cursor="link"
                                className="rounded-full border border-accent-primary px-6 py-3 text-fluid--2 uppercase tracking-[0.2em] text-accent-primary transition-colors duration-500 ease-out-expo hover:bg-accent-primary hover:text-text-inverse"
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
                                    className="w-full max-h-80 object-cover "
                                />
                                <p className="mt-3 text-fluid--1 serif-italic text-text-secondary">
                                    Capturing moments, one clip at a time.
                                </p>
                                <a className="mt-3 text-fluid--1 serif-italic text-text-secondary" target='_blank' href="https://youtu.be/LlimX_jKtSM?feature=shared">[watch full video]</a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
