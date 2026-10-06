/* ============================================================================
   Tailwind (Play CDN) theme configuration - Hotel Anantashram.
   Token-for-token mirror of DESIGN.md: colours, type scale, spacing, radius.
   Load order: Tailwind CDN script -> this file -> <body> markup.
   ============================================================================ */

tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      "screens": {
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "nav": "1200px",
        "xl": "1280px",
        "2xl": "1536px"
      },
      "colors": {
        "outline": "#8a726c",
        "primary-fixed-dim": "#ffb4a2",
        "on-secondary-fixed-variant": "#384668",
        "surface-tint": "#a13f26",
        "surface-container-high": "#ebe8e2",
        "on-tertiary-fixed": "#291800",
        "error-container": "#ffdad6",
        "primary-fixed": "#ffdbd2",
        "surface-container-low": "#f6f3ed",
        "tertiary-fixed-dim": "#f7bc63",
        "on-tertiary-fixed-variant": "#614000",
        "surface-dim": "#dcdad4",
        "primary-container": "#9e3d24",
        "inverse-surface": "#31312d",
        "tertiary-container": "#7e5400",
        "on-primary-container": "#ffc9bc",
        "surface": "#fcf9f3",
        "background": "#fcf9f3",
        "on-secondary-fixed": "#0a1a3a",
        "surface-variant": "#e5e2dc",
        "on-error": "#ffffff",
        "tertiary-fixed": "#ffddb1",
        "on-primary-fixed": "#3c0800",
        "surface-container-highest": "#e5e2dc",
        "secondary-fixed": "#d9e2ff",
        "inverse-on-surface": "#f3f0ea",
        "on-primary-fixed-variant": "#812811",
        "on-surface-variant": "#56423d",
        "on-background": "#1c1c18",
        "surface-bright": "#fcf9f3",
        "on-error-container": "#93000a",
        "on-tertiary-container": "#ffcd85",
        "secondary-container": "#c5d4fd",
        "on-surface": "#1c1c18",
        "on-tertiary": "#ffffff",
        "surface-container": "#f0eee8",
        "secondary-fixed-dim": "#b7c6ee",
        "on-secondary": "#ffffff",
        "inverse-primary": "#ffb4a2",
        "outline-variant": "#ddc0b9",
        "on-secondary-container": "#4d5b7e",
        "primary": "#7e260f",
        "tertiary": "#5f3e00",
        "error": "#ba1a1a",
        "on-primary": "#ffffff",
        "surface-container-lowest": "#ffffff",
        "secondary": "#4f5e81"
      },
      "borderRadius": {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem"
      },
      "spacing": {
        "space-sm": "0.5rem",
        "space-lg": "1.5rem",
        "gutter": "1.5rem",
        "space-xl": "2.5rem",
        "space-xs": "0.25rem",
        "margin-mobile": "1.25rem",
        "margin": "4rem",
        "space-md": "1rem",
        "gutter-mobile": "1rem"
      },
      "fontFamily": {
        "headline-lg-mobile": ["Playfair Display"],
        "title-md": ["Plus Jakarta Sans"],
        "body-lg": ["Plus Jakarta Sans"],
        "display-mobile": ["Playfair Display"],
        "headline-md": ["Playfair Display"],
        "headline-sm": ["Playfair Display"],
        "label-md": ["Plus Jakarta Sans"],
        "body-sm": ["Plus Jakarta Sans"],
        "label-lg": ["Plus Jakarta Sans"],
        "title-lg": ["Plus Jakarta Sans"],
        "label-sm": ["Plus Jakarta Sans"],
        "display": ["Playfair Display"],
        "body-md": ["Plus Jakarta Sans"],
        "headline-lg": ["Playfair Display"]
      },
      "fontSize": {
        "headline-lg-mobile": ["30px", {"lineHeight": "38px", "fontWeight": "600"}],
        "title-md": ["16px", {"lineHeight": "24px", "fontWeight": "600"}],
        "body-lg": ["18px", {"lineHeight": "28px", "fontWeight": "400"}],
        "display-mobile": ["38px", {"lineHeight": "46px", "letterSpacing": "-0.01em", "fontWeight": "600"}],
        "headline-md": ["28px", {"lineHeight": "36px", "fontWeight": "500"}],
        "headline-sm": ["22px", {"lineHeight": "30px", "fontWeight": "500"}],
        "label-md": ["12px", {"lineHeight": "16px", "letterSpacing": "0.06em", "fontWeight": "600"}],
        "body-sm": ["13px", {"lineHeight": "20px", "fontWeight": "400"}],
        "label-lg": ["14px", {"lineHeight": "20px", "letterSpacing": "0.04em", "fontWeight": "600"}],
        "title-lg": ["18px", {"lineHeight": "26px", "fontWeight": "700"}],
        "label-sm": ["11px", {"lineHeight": "14px", "letterSpacing": "0.08em", "fontWeight": "700"}],
        "display": ["56px", {"lineHeight": "64px", "letterSpacing": "-0.02em", "fontWeight": "600"}],
        "body-md": ["15px", {"lineHeight": "24px", "fontWeight": "400"}],
        "headline-lg": ["40px", {"lineHeight": "48px", "letterSpacing": "-0.01em", "fontWeight": "600"}]
      }
    }
  }
};
