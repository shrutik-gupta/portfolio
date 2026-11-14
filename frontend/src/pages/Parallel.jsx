import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Arrow, ArrowRight } from '../components/Doodles';
import cricket1 from '../assets/bad-cricket.mp4';
import cricket2 from '../assets/good-cricket.mp4';
import piano1 from '../assets/bad-piano.mp4';
import piano2 from '../assets/good-piano.mp4';
import vlog from '../assets/vlog.mp4';

/** A video shown as a print: paper border, tape, handwritten caption. */
const Print = ({ caption, tilt = '-rotate-1', children }) => (
  <figure className={`paper relative flex-1 animate-pop-in p-2.5 pb-3 shadow-print ${tilt}`}>
    <span className="tape -top-3 left-8 -rotate-6" aria-hidden="true" />
    {children}
    {caption && <figcaption className="hand mt-2 min-h-[1.2em] text-text-secondary">{caption}</figcaption>}
  </figure>
);

const Exhibit = ({ number, children }) => (
  <section className="grid gap-x-10 gap-y-5 border-t-2 border-text-primary py-10 sm:grid-cols-[auto_1fr]">
    <p className="label pt-2 tabular-nums text-text-muted">Confession {number}</p>
    <div className="flex flex-col gap-6">{children}</div>
  </section>
);

const VIDEO = 'aspect-video w-full bg-text-primary object-cover';

/**
 * Off the record. Three confessions, each hidden until asked for.
 * The reveal logic is unchanged: the first clip plays, and when it ends
 * the second one appears beside it.
 */
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
      <main className="page">
        <div className="shell pb-24 pt-24 lg:pt-16">
          <div className="mx-auto max-w-4xl">
            <header className="mb-14 flex flex-col gap-4">
              <p className="label text-accent-primary">Off the record</p>
              <h1 className="text-fluid-7 text-text-primary">
                So you made it <span className="display-i text-accent-primary">here…</span>
              </h1>
              <p className="flex items-center gap-3 text-fluid-1 text-text-secondary">
                Ready to learn something that isn’t on the résumé?
                <Arrow className="hidden h-8 w-10 rotate-[60deg] text-accent-secondary sm:block" />
              </p>
            </header>

            {/* --- Cricket --- */}
            <Exhibit number="01">
              <h2 className="text-fluid-4">
                I play cricket <span className="display-i text-accent-primary">very well.</span>
              </h2>

              {cricketStep === 0 && (
                <button onClick={handleCricketReveal} className="stamp w-fit">
                  Click to reveal
                  <ArrowRight className="h-4 w-6" />
                </button>
              )}

              {cricketStep >= 1 && (
                <div className="flex flex-col gap-6 sm:flex-row">
                  <Print caption={cricketStep === 1 ? 'Oh no no.. not this' : ''}>
                    <video
                      src={cricket1}
                      autoPlay
                      muted
                      playsInline
                      onEnded={handleCricketFirstEnd}
                      className={VIDEO}
                    />
                  </Print>
                  {cricketStep === 2 && (
                    <Print caption="Yeah this is how I play" tilt="rotate-1">
                      <video src={cricket2} autoPlay muted loop playsInline className={VIDEO} />
                    </Print>
                  )}
                </div>
              )}
            </Exhibit>

            {/* --- Piano --- */}
            <Exhibit number="02">
              <h2 className="text-fluid-4">
                <span className="display-i text-accent-primary">Sometimes,</span> I also play piano
              </h2>

              {pianoStep === 0 && (
                <button onClick={handlePianoReveal} className="stamp w-fit">
                  Click to listen
                  <ArrowRight className="h-4 w-6" />
                </button>
              )}

              {pianoStep >= 1 && (
                <div className="flex flex-col gap-6 sm:flex-row">
                  <Print caption={pianoStep === 1 ? 'Like this' : ''} tilt="rotate-1">
                    <video
                      src={piano2}
                      autoPlay
                      controls
                      playsInline
                      onEnded={handlePianoFirstEnd}
                      className={VIDEO}
                    />
                  </Print>
                  {pianoStep === 2 && (
                    <Print caption="But things don’t go well all the time">
                      <video src={piano1} autoPlay controls playsInline className={VIDEO} />
                    </Print>
                  )}
                </div>
              )}
            </Exhibit>

            {/* --- Vlog --- */}
            <Exhibit number="03">
              <h2 className="text-fluid-4">
                Oh, and sometimes I <span className="display-i text-accent-primary">vlog.</span>
              </h2>

              {!showVlog && (
                <button onClick={handleVlogReveal} className="stamp w-fit">
                  Click to watch
                  <ArrowRight className="h-4 w-6" />
                </button>
              )}

              {showVlog && (
                <div className="flex flex-col gap-4">
                  <Print caption="Capturing moments, one clip at a time.">
                    <video src={vlog} autoPlay loop playsInline className={VIDEO} />
                  </Print>
                  <a
                    className="link-ink w-fit text-fluid-0 font-semibold"
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://youtu.be/LlimX_jKtSM?feature=shared"
                  >
                    Watch the full video ↗
                  </a>
                </div>
              )}
            </Exhibit>

            <div className="border-t-2 border-text-primary pt-8">
              <Link to="/" className="hand flex w-fit items-center gap-2 text-text-secondary hover:text-accent-primary">
                <Arrow className="h-6 w-8 -rotate-[140deg]" />
                back to the official version
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
