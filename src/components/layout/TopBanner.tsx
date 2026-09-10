import React, { useEffect, useMemo, useState } from 'react';

interface BannerItem {
  sticker: string;
  text: string;
}

interface ThemeConfig {
  bg: string;
  border: string;
  text: string;
  separator: string;
  items: BannerItem[];
}

interface BannerConfig {
  activeMode: string;
  forcedTheme: string;
  themes: Record<string, ThemeConfig>;
}

const TopBanner: React.FC = () => {
  const [bannerConfig, setBannerConfig] =
    useState<BannerConfig | null>(null);

  /* =========================================================
     FETCH BANNER CONFIGURATION
  ========================================================= */

  useEffect(() => {
    let mounted = true;

    const fetchBannerSettings = async () => {
      try {
        const res = await fetch(
          'https://cc-backend-yc-team.onrender.com/api/v1/parts/'
        );

        if (!res.ok) {
          throw new Error(
            `Server returned ${res.status}`
          );
        }

        const data = await res.json();
        const validConfig = data?.config || data;

        if (
          mounted &&
          validConfig?.banner
        ) {
          setBannerConfig(
            validConfig.banner
          );
        }
      } catch (error) {
        console.error(
          'Failed to load banner configuration:',
          error
        );
      }
    };

    fetchBannerSettings();

    return () => {
      mounted = false;
    };
  }, []);

  /* =========================================================
     DETERMINE ACTIVE THEME
  ========================================================= */

  const activeThemeKey = useMemo(() => {
    if (
      !bannerConfig?.themes ||
      Object.keys(bannerConfig.themes).length === 0
    ) {
      return '';
    }

    /*
     * MANUAL THEME
     */
    if (
      bannerConfig.activeMode === 'manual' &&
      bannerConfig.forcedTheme &&
      bannerConfig.themes[
        bannerConfig.forcedTheme
      ]
    ) {
      return bannerConfig.forcedTheme;
    }

    /*
     * FORCED THEME
     */
    if (
      bannerConfig.forcedTheme &&
      bannerConfig.themes[
        bannerConfig.forcedTheme
      ]
    ) {
      return bannerConfig.forcedTheme;
    }

    /*
     * AUTOMATIC SEASONAL THEME
     */
    const now = new Date();

    const month =
      now.getMonth() + 1;

    const day =
      now.getDate();

    let targetKey = 'default';

    /*
     * Christmas
     */
    if (
      (month === 12 && day >= 1) ||
      (month === 1 && day <= 5)
    ) {
      targetKey = 'christmas';
    }

    /*
     * Halloween
     */
    else if (
      (month === 10 && day >= 1) ||
      (month === 11 && day <= 5)
    ) {
      targetKey = 'halloween';
    }

    /*
     * Use seasonal theme
     */
    if (
      bannerConfig.themes[targetKey]
    ) {
      return targetKey;
    }

    /*
     * Fallback
     */
    const availableThemes =
      Object.keys(
        bannerConfig.themes
      );

    return availableThemes[0] || '';
  }, [bannerConfig]);

  const theme =
    bannerConfig?.themes?.[
      activeThemeKey
    ];

  /* =========================================================
     EMPTY STATE
  ========================================================= */

  if (
    !bannerConfig ||
    !theme ||
    !Array.isArray(theme.items) ||
    theme.items.length === 0
  ) {
    return null;
  }

  /* =========================================================
     COLOR DETECTION
  ========================================================= */

  const isColorValue = (
    value?: string
  ) => {
    if (!value) return false;

    return (
      value.startsWith('#') ||
      value.startsWith('rgb') ||
      value.startsWith('hsl')
    );
  };

  /* =========================================================
     BANNER ITEM
  ========================================================= */

  const renderItems = (
    sequence: string
  ) => {
    return (
      <div
        key={sequence}
        className="
          top-banner-sequence
          flex
          items-center
          shrink-0
        "
        aria-hidden={
          sequence === 'duplicate'
        }
      >
        {theme.items.map(
          (item, index) => (
            <div
              key={`${sequence}-${index}`}
              className="
                top-banner-item
                flex
                items-center
                shrink-0
              "
            >
              {/* STICKER */}

              <span
                className="
                  top-banner-sticker
                  select-none
                  shrink-0
                "
              >
                {item.sticker}
              </span>

              {/* TEXT */}

              <span
                style={
                  isColorValue(
                    theme.text
                  )
                    ? {
                        color:
                          theme.text,
                      }
                    : undefined
                }
                className={`
                  top-banner-text
                  ${
                    !isColorValue(
                      theme.text
                    )
                      ? theme.text
                      : ''
                  }
                `}
              >
                {item.text}
              </span>

              {/* SEPARATOR */}

              <span
                style={
                  isColorValue(
                    theme.separator
                  )
                    ? {
                        backgroundColor:
                          theme.separator,
                      }
                    : undefined
                }
                className={`
                  top-banner-separator
                  ${
                    !isColorValue(
                      theme.separator
                    )
                      ? theme.separator
                      : 'bg-sky-500'
                  }
                `}
              />
            </div>
          )
        )}
      </div>
    );
  };

  /* =========================================================
     COMPONENT
  ========================================================= */

  return (
    <>
      <style>{`

        /* =====================================================
           BANNER CONTAINER
        ===================================================== */

        .top-banner {
          width: 100%;
          max-width: 100%;
          height: clamp(
            18px,
            2vw,
            22px
          );

          overflow: hidden;
          position: relative;

          display: flex;
          align-items: center;

          border-bottom-width: 1px;

          contain: layout paint;
        }


        /* =====================================================
           MOVING TRACK
        ===================================================== */

        .top-banner-track {
          display: flex;
          align-items: center;

          width: max-content;
          min-width: max-content;

          height: 100%;

          flex-shrink: 0;

          /*
           * The track contains TWO identical sequences.
           *
           * Moving -50% means the second sequence
           * reaches exactly where the first started.
           */

          animation:
            top-banner-marquee
            26s
            linear
            infinite;

          will-change: transform;

          transform:
            translate3d(
              0,
              0,
              0
            );

          backface-visibility: hidden;

          perspective: 1000px;
        }


        /* =====================================================
           SEQUENCE
        ===================================================== */

        .top-banner-sequence {
          height: 100%;
          flex-shrink: 0;
        }


        /* =====================================================
           ITEM
        ===================================================== */

        .top-banner-item {
          height: 100%;

          gap: clamp(
            4px,
            0.5vw,
            7px
          );

          padding-left: clamp(
            10px,
            1.2vw,
            18px
          );

          padding-right: clamp(
            10px,
            1.2vw,
            18px
          );

          white-space: nowrap;
        }


        /* =====================================================
           STICKER
        ===================================================== */

        .top-banner-sticker {
          font-size: clamp(
            9px,
            1vw,
            12px
          );

          line-height: 1;

          display: inline-flex;
          align-items: center;
        }


        /* =====================================================
           TEXT
        ===================================================== */

        .top-banner-text {
          font-size: clamp(
            7px,
            0.7vw,
            9px
          );

          line-height: 1;

          font-weight: 600;

          letter-spacing: clamp(
            0.06em,
            0.1vw,
            0.14em
          );

          text-transform: uppercase;

          white-space: nowrap;

          display: inline-block;
        }


        /* =====================================================
           SEPARATOR
        ===================================================== */

        .top-banner-separator {
          width: 3px;
          height: 3px;

          border-radius: 9999px;

          margin-left: clamp(
            2px,
            0.4vw,
            6px
          );

          flex-shrink: 0;
        }


        /* =====================================================
           MARQUEE ANIMATION
        ===================================================== */

        @keyframes top-banner-marquee {

          from {
            transform:
              translate3d(
                0,
                0,
                0
              );
          }

          to {
            transform:
              translate3d(
                -50%,
                0,
                0
              );
          }

        }


        /* =====================================================
           DESKTOP HOVER
        ===================================================== */

        @media (hover: hover) and (pointer: fine) {

          .top-banner-track:hover {
            animation-play-state: paused;
          }

        }


        /* =====================================================
           MOBILE
        ===================================================== */

        @media (max-width: 480px) {

          .top-banner {
            height: 18px;
          }

          .top-banner-track {
            animation-duration: 22s;
          }

          .top-banner-item {
            padding-left: 9px;
            padding-right: 9px;
            gap: 4px;
          }

          .top-banner-text {
            font-size: 7px;
            letter-spacing: 0.08em;
          }

          .top-banner-sticker {
            font-size: 9px;
          }

          .top-banner-separator {
            width: 2px;
            height: 2px;
            margin-left: 2px;
          }

        }


        /* =====================================================
           SMALL TABLETS
        ===================================================== */

        @media (
          min-width: 481px
        ) and (
          max-width: 768px
        ) {

          .top-banner {
            height: 19px;
          }

          .top-banner-track {
            animation-duration: 24s;
          }

        }


        /* =====================================================
           TABLETS
        ===================================================== */

        @media (
          min-width: 769px
        ) and (
          max-width: 1024px
        ) {

          .top-banner {
            height: 20px;
          }

        }


        /* =====================================================
           LARGE DESKTOP
        ===================================================== */

        @media (min-width: 1440px) {

          .top-banner {
            height: 21px;
          }

          .top-banner-track {
            animation-duration: 30s;
          }

        }


        /* =====================================================
           REDUCED MOTION
        ===================================================== */

        @media (
          prefers-reduced-motion: reduce
        ) {

          .top-banner-track {
            animation-play-state: paused;
          }

        }

      `}</style>

      <div
        className="top-banner"
        style={{
          ...(isColorValue(theme.bg)
            ? {
                backgroundColor:
                  theme.bg,
              }
            : {}),

          ...(isColorValue(
            theme.border
          )
            ? {
                borderColor:
                  theme.border,
              }
            : {}),
        }}
      >
        {!isColorValue(theme.bg) && (
          <div
            className={`
              absolute
              inset-0
              pointer-events-none
              ${theme.bg || ''}
            `}
          />
        )}

        <div
          className="
            top-banner-track
            relative
            z-10
          "
        >
          {/* ORIGINAL */}

          {renderItems('original')}

          {/* EXACT DUPLICATE */}

          {renderItems('duplicate')}
        </div>
      </div>
    </>
  );
};

export default TopBanner;