import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Moon, Sun, Settings, Home, Info, Briefcase, User, Mail, Menu, X, AppWindow, AppWindowIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import logo from '../assets/logo.png'

const Navbar = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavigation = (path, sectionId = null) => {
    setIsMobileMenuOpen(false);

    if (path === '/' && sectionId === null) {
      if (location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        navigate('/');
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    } else if (sectionId) {
      if (location.pathname === '/') {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const element = document.getElementById(sectionId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(path);
    }
  };

  const linkClass =
    'flex items-center gap-2 relative px-4 py-2 text-text-primary font-medium ' +
    'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-accent-primary ' +
    'after:transition-all after:duration-300 hover:after:w-full';

  const mobileLinkClass =
    'flex items-center gap-3 relative px-4 py-3 text-text-primary font-medium text-left ' +
    'after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-accent-primary ' +
    'after:transition-all after:duration-300 hover:after:w-full';

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-md transition-all duration-300 py-[1%]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-fit">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center cursor-pointer">
            <img onClick={() => handleNavigation('/')}
              src={logo}
              alt="Logo"
              className="h-6 object-contain"
            />
          </div>

          <div className="hidden md:flex items-center gap-1">
            <button onClick={() => handleNavigation('/')} className={linkClass}>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            <button onClick={() => handleNavigation('/about', 'about')} className={linkClass}>
              <User className="w-4 h-4" />
              <span>About</span>
            </button>

            <button onClick={() => handleNavigation('/projects', 'projects')} className={linkClass}>
              <AppWindow className="w-4 h-4" />
              <span>Projects</span>
            </button>

            <button onClick={() => handleNavigation('/experience', 'experience')} className={linkClass}>
              <Briefcase className="w-4 h-4" />
              <span>Experience</span>
            </button>

            <button onClick={() => handleNavigation('/contact', 'contact')} className={linkClass}>
              <Mail className="w-4 h-4" />
              <span>Contact</span>
            </button>

            <Link to="/preferences" className={linkClass}>
              <Settings className="w-4 h-4" />
              <span>Preference</span>
            </Link>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-text-primary"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2 px-2 pt-2">
              <button onClick={() => handleNavigation('/')} className={mobileLinkClass}>
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>

              <button onClick={() => handleNavigation('/about', 'about')} className={mobileLinkClass}>
                <User className="w-5 h-5" />
                <span>About</span>
              </button>

              <button onClick={() => handleNavigation('/projects', 'projects')} className={mobileLinkClass}>
                <AppWindow className="w-5 h-5" />
                <span>Projects</span>
              </button>

              <button onClick={() => handleNavigation('/experience', 'experience')} className={mobileLinkClass}>
                <Briefcase className="w-5 h-5" />
                <span>Experience</span>
              </button>

              <button onClick={() => handleNavigation('/contact', 'contact')} className={mobileLinkClass}>
                <Mail className="w-5 h-5" />
                <span>Contact</span>
              </button>

              <Link
                to="/preferences"
                onClick={() => setIsMobileMenuOpen(false)}
                className={mobileLinkClass}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;