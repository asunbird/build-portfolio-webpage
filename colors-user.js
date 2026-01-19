document.addEventListener("DOMContentLoaded", function() {
  const colorInput = document.getElementById("color-input");
  const submitBtn = document.getElementById("color-button");

  if (!colorInput || !submitBtn) return;

  // --- HELPER: RGB to HSL ---
  function rgbToHSL(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    let cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
    let h = 0, s = 0, l = 0;
    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    return { h: h, s: +(s * 100).toFixed(1), l: +(l * 100).toFixed(1) };
  }

  // --- HELPER: HSL to RGB (Needed to check brightness) ---
  function hslToRgb(h, s, l) {
    s /= 100; l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s,
        x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
        m = l - c / 2,
        r = 0, g = 0, b = 0;
    
    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255)
    };
  }

  // --- HELPER: Decide if Text should be Black or White ---
  function getContrastColor(h, s, l) {
    const rgb = hslToRgb(h, s, l);
    // Formula for Perceived Brightness
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
    // If brightness > 128 (Light), return Black text. Else White.
    return (brightness > 128) ? '#000000' : '#ffffff';
  }

  // --- HELPER: Get RGB from Name ---
  function getRgbFromColorName(colorName) {
    const tempDiv = document.createElement("div");
    tempDiv.style.color = colorName;
    if (tempDiv.style.color === "") return null;
    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);
    const match = computedColor.match(/\d+/g);
    if (!match) return null;
    return { r: parseInt(match[0]), g: parseInt(match[1]), b: parseInt(match[2]) };
  }

  // --- MAIN FUNCTION ---
  function updateTheme() {
    const userInput = colorInput.value.trim().toLowerCase();
    const rgb = getRgbFromColorName(userInput);
    if (!rgb) { alert("Color not found!"); return; }

    const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);
    const root = document.documentElement;

    // 1. CALCULATE BACKGROUNDS
    // Main
    const mainH = hsl.h, mainS = hsl.s, mainL = hsl.l;
    
    // Welcome (Rotated 120deg, 50% Lightness)
    const welcomeH = (hsl.h + 120) % 360;
    const welcomeL = 50; 

    // About (Rotated 240deg, 40% Lightness)
    const aboutH = (hsl.h + 240) % 360;
    const aboutL = 40;

    // Projects (Same Hue, 15% Lightness - Very Dark)
    const projectsH = hsl.h;
    const projectsL = 15; 

    // 2. APPLY BACKGROUND COLORS
    root.style.setProperty('--main-color', `hsl(${mainH}, ${mainS}%, ${mainL}%)`);
    root.style.setProperty('--welcome-color', `hsl(${welcomeH}, ${hsl.s}%, ${welcomeL}%)`);
    root.style.setProperty('--about-contact', `hsl(${aboutH}, ${hsl.s}%, ${aboutL}%)`);
    root.style.setProperty('--projects-dark', `hsl(${projectsH}, 60%, ${projectsL}%)`);

    // 3. APPLY DYNAMIC TEXT COLORS (The Magic Part)
    // We calculate contrast for EACH section individually
    
    root.style.setProperty('--text-welcome', getContrastColor(welcomeH, hsl.s, welcomeL));
    root.style.setProperty('--text-about', getContrastColor(aboutH, hsl.s, aboutL));
    root.style.setProperty('--text-projects', getContrastColor(projectsH, 60, projectsL));
    
    // Also fix the button text contrast based on main color
    root.style.setProperty('--text-main-contrast', getContrastColor(mainH, mainS, mainL));
  }

  submitBtn.addEventListener("click", function(e) { e.preventDefault(); updateTheme(); });
  colorInput.addEventListener("keypress", function(e) { if (e.key === "Enter") updateTheme(); });
});