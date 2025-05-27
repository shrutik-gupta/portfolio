import React, { useState } from 'react';
import { Check, Moon, Sun, RotateCcw, Smartphone } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import Navbar from '../components/Navbar';

const Preference = () => {
  const { 
    theme, 
    updateTheme, 
    resetToSystem
  } = useTheme();

  const [showSaveMessage, setShowSaveMessage] = useState(false);

  const themes = [
    { 
      id: 'dark', 
      name: 'Dark', 
      icon: Moon, 
      bg: 'bg-bg-surface', 
      hoverBg: 'hover:bg-bg-hover',
      textColor: 'text-text-primary'
    },
    { 
      id: 'light', 
      name: 'Light', 
      icon: Sun, 
      bg: 'bg-bg-tertiary', 
      hoverBg: 'hover:bg-bg-hover',
      textColor: 'text-text-primary'
    }
  ];

  const handleReset = () => {
    resetToSystem();
    setShowSaveMessage(true);
    setTimeout(() => setShowSaveMessage(false), 2000);
  };

  return (
    <div>
      <Navbar />
      <div className="bg-gradient-bg text-text-primary min-h-screen flex flex-col gap-6 px-[5vw] py-[5vh] items-center transition-colors duration-300">
        <div className="w-full max-w-md animate-fade-in">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-primary bg-clip-text">
            Preferences
          </h1>

          {showSaveMessage && (
            <div className="mb-6 p-4 bg-success/20 border border-success/30 rounded-xl text-center animate-fade-in">
              <p className="text-success font-medium">✓ Preferences saved successfully!</p>
            </div>
          )}

          <div className="p-8 bg-bg-card border border-border-default rounded-2xl shadow-custom-medium mb-6 backdrop-blur-sm transition-all duration-300 animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent-primary/20 rounded-lg">
                <Moon className="w-5 h-5 text-accent-primary" />
              </div>
              <h2 className="text-xl font-semibold text-text-primary">Theme</h2>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isSelected = theme === themeOption.id;

                return (
                  <button
                    key={themeOption.id}
                    onClick={() => updateTheme(themeOption.id)}
                    className={`
                      relative p-4 rounded-xl transition-all duration-300 border-1
                      ${themeOption.bg} ${themeOption.hoverBg} ${themeOption.textColor}
                      ${isSelected
                        ? 'border-accent-primary shadow-accent-primary scale-105'
                        : 'border-transparent hover:border-border-hover'
                      }
                      group
                    `}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{themeOption.name}</span>
                    </div>

                    {isSelected && (
                      <div className="absolute -top-1 -right-1 bg-accent-primary rounded-full p-1">
                        <Check className="w-3 h-3 text-text-inverse" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 space-y-3">
            <button
              onClick={handleReset}
              className="w-full bg-bg-surface hover:bg-bg-hover text-text-secondary hover:text-text-primary border border-border-default hover:border-border-hover font-medium py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset to System Default
            </button>
          </div>

          <div className="mt-6 p-4 bg-bg-surface rounded-xl border border-border-default transition-all duration-300">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Smartphone className="w-4 h-4 text-text-secondary" />
              <span className="text-sm text-text-secondary">Current Settings</span>
            </div>
            <p className="text-sm text-text-secondary text-center">
              <span className="text-text-primary font-medium capitalize">{theme}</span> theme
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preference;
