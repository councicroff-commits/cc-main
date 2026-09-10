import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const Navbar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { totalItems: cartCount } = useCart() as any;

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const query = searchQuery.trim();

    if (query) {
      navigate(`/shop?search=${encodeURIComponent(query)}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* =========================================================
          NAVBAR
      ========================================================== */}

      <header
        className="
          sticky top-0 z-40
          w-full
          overflow-hidden
          text-white
          font-sans
          border-b border-cyan-400/15
          bg-[#07080f]
          shadow-[0_8px_30px_rgba(0,0,0,0.4)]
        "
      >

        {/* =====================================================
            BACKGROUND
        ====================================================== */}

        <div className="absolute inset-0 pointer-events-none">

          {/* Main background - stronger cyan + purple highlights */}
          <div
            className="
              absolute inset-0
              bg-[radial-gradient(circle_at_12%_0%,rgba(34,211,238,0.18),transparent_38%),radial-gradient(circle_at_88%_8%,rgba(167,139,250,0.14),transparent_32%),radial-gradient(circle_at_50%_100%,rgba(56,189,248,0.08),transparent_45%),linear-gradient(145deg,#06070e,#0a0f1c,#07080f)]
            "
          />

          {/* Subtle grid - slightly brighter */}
          <div
            className="
              absolute inset-0
              opacity-[0.14]
              bg-[linear-gradient(rgba(34,211,238,0.28)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.28)_1px,transparent_1px)]
              bg-[size:32px_32px]
            "
          />

          {/* Cyan glow left */}
          <div
            className="
              absolute
              -top-28
              -left-28
              w-[420px]
              h-[260px]
              rounded-full
              border border-cyan-400/25
              rotate-[-18deg]
              shadow-[0_0_60px_rgba(34,211,238,0.12)]
            "
          />

          {/* Purple/pink glow right */}
          <div
            className="
              absolute
              -top-36
              -right-36
              w-[480px]
              h-[290px]
              rounded-full
              border border-purple-400/20
              rotate-[-18deg]
              shadow-[0_0_50px_rgba(167,139,250,0.10)]
            "
          />

          {/* Top accent line */}
          <div
            className="
              absolute top-0 left-0 right-0
              h-px
              bg-gradient-to-r
              from-transparent
              via-cyan-400/50
              to-transparent
            "
          />

          {/* Decorative dots - desktop only */}
          <div className="absolute top-4 right-6 hidden lg:flex gap-1.5 opacity-50">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-300/70" />
            <span className="w-1.5 h-1.5 rounded-full bg-purple-300/40" />
          </div>

        </div>


        {/* =====================================================
            NAV CONTENT
        ====================================================== */}

        <div className="relative z-10 w-full max-w-[1600px] mx-auto">

          {/* ===================================================
              TOP ROW
          ==================================================== */}

          <div
            className="
              flex items-center justify-between
              px-[clamp(16px,4vw,48px)]
              pt-[clamp(10px,1.6vw,16px)]
              pb-[clamp(6px,1vw,10px)]
            "
          >

            {/* =================================================
                LOGO
            ================================================== */}

            <Link
              to="/"
              onClick={closeSidebar}
              className="
                flex flex-col
                min-w-0
                select-none
                transition-transform
                duration-300
                hover:scale-[1.015]
              "
            >

              <div
                className="
                  flex
                  items-center
                  whitespace-nowrap
                  leading-none
                "
              >

                <span
                  className="
                    font-black
                    text-white
                    text-[clamp(22px,3.8vw,34px)]
                    tracking-[-0.055em]
                  "
                >
                  CC
                </span>

                <span
                  className="
                    ml-[2px]
                    font-normal
                    text-[clamp(22px,3.8vw,34px)]
                    tracking-[-0.055em]
                    text-cyan-400
                  "
                >
                  Ecom
                </span>

              </div>

              {/* Counci Croff */}
              <div
                className="
                  mt-[2px]
                  text-[clamp(6px,0.7vw,9px)]
                  tracking-[0.32em]
                  text-slate-400
                  uppercase
                  font-semibold
                  w-full
                  text-center
                  whitespace-nowrap
                "
                style={{
                  letterSpacing: '0.32em',
                }}
              >
                Counci Croff
              </div>

            </Link>


            {/* =================================================
                ICONS
            ================================================== */}

            <div
              className="
                flex
                items-center
                gap-[clamp(14px,2.8vw,32px)]
              "
            >

              {/* CART */}

              <Link
                to="/cart"
                aria-label="Shopping cart"
                className="
                  relative
                  flex items-center justify-center
                  text-white
                  hover:text-cyan-300
                  transition-all
                  duration-300
                "
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="clamp(22px,2.8vw,28px)"
                  height="clamp(22px,2.8vw,28px)"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 0 1-8 0" />
                </svg>

                {/* CART BADGE - sky blue */}
                {cartCount > 0 && (
                  <span
                    className="
                      absolute
                      -top-1.5
                      -right-1.5
                      min-w-[16px]
                      h-[16px]
                      px-[3px]
                      flex
                      items-center
                      justify-center
                      rounded-full
                      bg-cyan-400
                      text-[8px]
                      font-bold
                      leading-none
                      text-[#0a0f1c]
                      border
                      border-[#07080f]
                    "
                  >
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}

              </Link>


              {/* PROFILE */}

              <Link
                to="/profile"
                aria-label="Profile"
                className="
                  flex items-center justify-center
                  text-white
                  hover:text-cyan-300
                  transition-all
                  duration-300
                "
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="clamp(23px,2.9vw,29px)"
                  height="clamp(23px,2.9vw,29px)"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>

              </Link>


              {/* MENU */}

              <button
                onClick={toggleSidebar}
                aria-label="Open menu"
                className="
                  flex items-center justify-center
                  text-white
                  hover:text-cyan-300
                  transition-all
                  duration-300
                  focus:outline-none
                "
              >

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="clamp(26px,3.2vw,34px)"
                  height="clamp(26px,3.2vw,34px)"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                >
                  <line x1="4" y1="6" x2="20" y2="6" />
                  <line x1="4" y1="12" x2="20" y2="12" />
                  <line x1="4" y1="18" x2="20" y2="18" />
                </svg>

              </button>

            </div>

          </div>


          {/* ===================================================
              SEARCH
          ==================================================== */}

          <div
            className="
              px-[clamp(16px,4vw,48px)]
              pb-[clamp(10px,1.6vw,16px)]
            "
          >

            <form
              onSubmit={handleSearch}
              className="relative w-full"
            >

              <div
                className="
                  relative
                  flex items-center
                  w-full

                  h-[42px]
                  sm:h-[44px]
                  md:h-[46px]
                  lg:h-[48px]

                  rounded-[14px]

                  border
                  border-cyan-400/25

                  bg-white/[0.04]

                  backdrop-blur-md

                  transition-all
                  duration-300

                  focus-within:border-cyan-400/55

                  focus-within:bg-cyan-400/[0.04]

                  focus-within:shadow-[0_0_28px_rgba(34,211,238,0.12)]
                "
              >

                {/* Search internal grid */}
                <div
                  className="
                    absolute
                    inset-0
                    rounded-[14px]
                    pointer-events-none
                    opacity-[0.08]
                    bg-[linear-gradient(rgba(34,211,238,0.45)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.45)_1px,transparent_1px)]
                    bg-[size:22px_22px]
                  "
                />


                {/* Search icon */}
                <div
                  className="
                    relative
                    z-10
                    flex items-center
                    pl-[14px]
                    sm:pl-[16px]
                    md:pl-[18px]
                    pointer-events-none
                  "
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-cyan-300/70"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line
                      x1="21"
                      y1="21"
                      x2="16.65"
                      y2="16.65"
                    />
                  </svg>

                </div>


                {/* Input */}
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search collections and stocks"
                  className="
                    relative
                    z-10
                    min-w-0
                    flex-1
                    h-full
                    bg-transparent
                    px-3
                    text-[13px]
                    sm:text-[14px]
                    md:text-[15px]
                    text-white
                    placeholder-slate-500
                    focus:outline-none
                  "
                />


                {/* Decorative marks - desktop */}
                <div
                  className="
                    hidden
                    md:flex
                    items-center
                    gap-1.5
                    mr-4
                    opacity-50
                  "
                >
                  <span className="w-3.5 h-[2.5px] bg-cyan-400 skew-x-[-35deg]" />
                  <span className="w-3.5 h-[2.5px] bg-cyan-300 skew-x-[-35deg]" />
                  <span className="w-3.5 h-[2.5px] bg-purple-300 skew-x-[-35deg]" />
                </div>

              </div>

            </form>

          </div>

        </div>

      </header>


      {/* =========================================================
          SIDEBAR
      ========================================================== */}

      {isSidebarOpen && (

        <div className="fixed inset-0 z-50">

          {/* Overlay */}
          <div
            className="
              absolute
              inset-0
              bg-black/70
              backdrop-blur-sm
            "
            onClick={closeSidebar}
          />


          {/* Sidebar */}
          <aside
            className="
              relative
              w-[280px]
              sm:w-[320px]
              max-w-[85vw]
              h-full
              overflow-y-auto
              bg-[#07080f]
              border-r
              border-cyan-400/15
              shadow-[15px_0_50px_rgba(0,0,0,0.7)]
              animate-sidebar
            "
          >

            {/* Sidebar grid */}
            <div
              className="
                absolute inset-0
                pointer-events-none
                opacity-[0.11]
                bg-[linear-gradient(rgba(34,211,238,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(34,211,238,0.35)_1px,transparent_1px)]
                bg-[size:28px_28px]
              "
            />


            {/* Sidebar glow */}
            <div
              className="
                absolute
                top-0
                left-0
                right-0
                h-[180px]
                pointer-events-none
                bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_65%)]
              "
            />


            {/* Header */}
            <div
              className="
                relative z-10
                flex
                items-center
                justify-between
                p-5
                border-b
                border-cyan-400/10
              "
            >

              <div>
                <div
                  className="
                    text-cyan-400
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.22em]
                  "
                >
                  Navigation
                </div>

                <div
                  className="
                    text-white
                    font-bold
                    text-lg
                    mt-1
                  "
                >
                  Menu
                </div>
              </div>


              <button
                onClick={closeSidebar}
                aria-label="Close menu"
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-cyan-400/10
                  bg-white/[0.03]
                  text-slate-400
                  hover:text-cyan-300
                  hover:border-cyan-400/30
                  transition-all
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>

            </div>


            {/* Navigation */}
            <nav className="relative z-10 p-4">

              <div className="section-title">
                Explore
              </div>

              <Link to="/" onClick={closeSidebar} className="menu-link">
                Home
              </Link>

              <Link to="/shop" onClick={closeSidebar} className="menu-link">
                Shop All
              </Link>


              <div className="section-title mt-7">
                Categories
              </div>

              <Link to="/clothes" onClick={closeSidebar} className="menu-link">
                Clothes
              </Link>

              <Link to="/perfume" onClick={closeSidebar} className="menu-link">
                Perfume
              </Link>

              <Link to="/lifestyle" onClick={closeSidebar} className="menu-link">
                Lifestyle
              </Link>


              <div className="section-title mt-7">
                Entertainment
              </div>

              <Link
                to="/mini-game"
                onClick={closeSidebar}
                className="
                  flex
                  items-center
                  justify-between
                  px-4
                  py-3
                  rounded-xl
                  border
                  border-cyan-400/20
                  bg-cyan-400/[0.06]
                  text-cyan-200
                  hover:bg-cyan-400/[0.10]
                  transition-all
                "
              >
                <span>
                  Play Mini-Game
                </span>

                <span
                  className="
                    text-[9px]
                    px-2
                    py-1
                    rounded-full
                    bg-cyan-400
                    text-[#0a0f1c]
                    font-black
                  "
                >
                  NEW
                </span>
              </Link>


              <div className="section-title mt-7">
                Account
              </div>

              <Link to="/profile" onClick={closeSidebar} className="menu-link">
                Profile
              </Link>

              <Link to="/orders" onClick={closeSidebar} className="menu-link">
                My Orders
              </Link>


              <div
                className="
                  h-px
                  my-5
                  bg-gradient-to-r
                  from-transparent
                  via-cyan-400/25
                  to-transparent
                "
              />


              <Link to="/about" onClick={closeSidebar} className="secondary-link">
                About Us
              </Link>

              <Link to="/Collab" onClick={closeSidebar} className="secondary-link">
                Collab
              </Link>

              <Link to="/support" onClick={closeSidebar} className="secondary-link">
                Support
              </Link>

              <Link to="/Legal" onClick={closeSidebar} className="secondary-link">
                Legal
              </Link>

            </nav>

          </aside>

        </div>
      )}


      {/* =========================================================
          ANIMATIONS + MENU STYLES
      ========================================================== */}

      <style>{`
        @keyframes sidebarIn {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        .animate-sidebar {
          animation: sidebarIn .28s cubic-bezier(.22,1,.36,1);
        }

        .section-title {
          padding: 0 12px;
          margin-bottom: 7px;
          color: rgb(100 116 139);
          font-size: 10px;
          font-weight: 800;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .menu-link {
          display: block;
          padding: 10px 14px;
          margin-bottom: 3px;
          border-radius: 10px;
          color: rgb(203 213 225);
          font-size: 14px;
          transition:
            background .2s ease,
            color .2s ease,
            transform .2s ease;
        }

        .menu-link:hover {
          color: white;
          background: linear-gradient(
            90deg,
            rgba(34,211,238,.10),
            rgba(167,139,250,.05)
          );
          transform: translateX(3px);
        }

        .secondary-link {
          display: block;
          padding: 7px 12px;
          color: rgb(100 116 139);
          font-size: 13px;
          transition: all .2s ease;
        }

        .secondary-link:hover {
          color: rgb(103 232 249);
          transform: translateX(3px);
        }

        header,
        header * {
          max-width: 100%;
        }

        @media (max-width: 420px) {
          .section-title {
            font-size: 9px;
          }
        }

        @media (max-width: 350px) {
          .menu-link {
            padding: 9px 12px;
          }
        }
      `}</style>

    </>
  );
};

export default Navbar;