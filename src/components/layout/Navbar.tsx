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
          border-b border-white/10
          bg-black
          shadow-[0_4px_20px_rgba(0,0,0,0.5)]
        "
      >

        {/* =====================================================
            BACKGROUND (clean pure black)
        ====================================================== */}

        <div className="absolute inset-0 pointer-events-none bg-black" />


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
    text-sky-400
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
                  text-white/40
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
                  text-white/90
                  hover:text-white
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

                {/* CART BADGE */}
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
                      bg-white
                      text-[8px]
                      font-bold
                      leading-none
                      text-black
                      border
                      border-black
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
                  text-white/90
                  hover:text-white
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
                  text-white/90
                  hover:text-white
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
                  border-white/15

                  bg-white/[0.04]

                  backdrop-blur-md

                  transition-all
                  duration-300

                  focus-within:border-white/30

                  focus-within:bg-white/[0.06]
                "
              >

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
                    className="text-white/50"
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
                    placeholder-white/40
                    focus:outline-none
                  "
                />

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
              bg-black/80
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
              bg-black
              border-r
              border-white/10
              shadow-[15px_0_40px_rgba(0,0,0,0.6)]
              animate-sidebar
            "
          >

            {/* Header */}
            <div
              className="
                relative z-10
                flex
                items-center
                justify-between
                p-5
                border-b
                border-white/10
              "
            >

              <div>
                <div
                  className="
                    text-white/40
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
                  border-white/10
                  bg-white/[0.03]
                  text-white/50
                  hover:text-white
                  hover:border-white/25
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
                  border-white/15
                  bg-white/[0.04]
                  text-white/90
                  hover:bg-white/[0.07]
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
                    bg-white
                    text-black
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
                  via-white/15
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
          color: rgba(255,255,255,0.35);
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
          color: rgba(255,255,255,0.75);
          font-size: 14px;
          transition:
            background .2s ease,
            color .2s ease,
            transform .2s ease;
        }

        .menu-link:hover {
          color: white;
          background: rgba(255,255,255,0.06);
          transform: translateX(3px);
        }

        .secondary-link {
          display: block;
          padding: 7px 12px;
          color: rgba(255,255,255,0.4);
          font-size: 13px;
          transition: all .2s ease;
        }

        .secondary-link:hover {
          color: rgba(255,255,255,0.85);
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