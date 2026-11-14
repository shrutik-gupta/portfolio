import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * Three kinds of visitor, one website.
 *
 * Nothing is hidden or duplicated per audience. Choosing a route only
 * adds guidance on top of the same page: a "next stop" in the route slip,
 * a few handwritten margin notes, and a contact form that opens with the
 * right question. Not choosing is fine — the page reads top to bottom.
 */

/** Section ids in the order they appear on the home page. */
export const PAGE_ORDER = [
  'hero',
  'about',
  'projects',
  'services',
  'capabilities',
  'experience',
  'offhours',
  'contact',
];

export const ROUTES = {
  hire: {
    name: 'Hiring',
    door: 'I’m hiring',
    hint: 'Résumé, skills, experience.',
    stops: [
      { id: 'about', label: 'The short version' },
      { id: 'capabilities', label: 'Skills' },
      { id: 'experience', label: 'Experience' },
      { id: 'contact', label: 'Contact' },
    ],
  },
  freelance: {
    name: 'Project',
    door: 'I have a project',
    hint: 'What I build, and how to start.',
    stops: [
      { id: 'projects', label: 'Past work' },
      { id: 'services', label: 'What I can build' },
      { id: 'capabilities', label: 'Tools I use' },
      { id: 'contact', label: 'Start a chat' },
    ],
  },
  wander: {
    name: 'Wandering',
    door: 'Just looking',
    hint: 'Go on, poke around.',
    stops: [
      { id: 'hero', label: 'Poke the blocks' },
      { id: 'projects', label: 'The wall' },
      { id: 'capabilities', label: 'Watch it stack' },
      { id: 'offhours', label: 'Off the record' },
      { id: 'contact', label: 'Say hi' },
    ],
  },
};

const STORAGE_KEY = 'visitor-route';
const AudienceContext = createContext(null);

const readStored = () => {
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    return ROUTES[v] ? v : null;
  } catch {
    return null;
  }
};

export const AudienceProvider = ({ children }) => {
  const [audience, setAudienceState] = useState(readStored);

  const setAudience = useCallback((next) => {
    const value = ROUTES[next] ? next : null;
    try {
      if (value) sessionStorage.setItem(STORAGE_KEY, value);
      else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* private mode: the choice just lasts for this page view */
    }
    setAudienceState(value);
  }, []);

  const value = useMemo(
    () => ({ audience, setAudience, route: audience ? ROUTES[audience] : null }),
    [audience, setAudience],
  );

  return <AudienceContext.Provider value={value}>{children}</AudienceContext.Provider>;
};

export const useAudience = () => {
  const ctx = useContext(AudienceContext);
  if (!ctx) throw new Error('useAudience must be used within an AudienceProvider');
  return ctx;
};

export default AudienceProvider;
