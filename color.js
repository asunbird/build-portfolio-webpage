document.addEventListener("DOMContentLoaded", function() {
  // 1. Target the specific elements from your HTML
  const colorInput = document.getElementById("color-input");
  const submitBtn = document.getElementById("color-button");

  // Safety check to ensure elements exist
  if (!colorInput || !submitBtn) return;

  // --- HELPER 1: Convert Color Name to RGB ---
  // This tricks the browser into telling us the RGB numbers for a name like "Navy"
  function getRgbFromColorName(colorName) {
    const tempDiv = document.createElement("div");
    tempDiv.style.color = colorName;
    
    // If the browser doesn't understand the name, it leaves style empty
    if (tempDiv.style.color === "") return null;

    document.body.appendChild(tempDiv);
    const computedColor = window.getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);

    // Extract numbers from "rgb(r, g, b)"
    const match = computedColor.match(/\d+/g);
    if (!match) return null;

    return {
      r: parseInt(match[0]),
      g: parseInt(match[1]),
      b: parseInt(match[2])
    };
  }

  // --- HELPER 2: Convert RGB to HSL ---
  // We need HSL to rotate the color wheel
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

  // --- MAIN FUNCTION: Calculate and Apply Colors ---
  function updateTheme() {
    const userInput = colorInput.value.trim().toLowerCase();
    
    // 1. Get RGB
    const rgb = getRgbFromColorName(userInput);
    if (!rgb) {
      alert("Color not found! Try standard names like 'Crimson', 'Teal', 'Gold'.");
      return;
    }

    // 2. Convert to HSL
    const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);
    const root = document.documentElement;

    // 3. Set the Variables
    
    // A. Main Color (User's Choice)
    root.style.setProperty('--main-color', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
    
    // B. Welcome Color (Rotate 120 degrees - Triadic)
    const welcomeHue = (hsl.h + 120) % 360;
    root.style.setProperty('--welcome-color', `hsl(${welcomeHue}, ${hsl.s}%, 50%)`);
    
    // C. About/Contact Color (Rotate 240 degrees - Triadic)
    const aboutHue = (hsl.h + 240) % 360;
    root.style.setProperty('--about-contact', `hsl(${aboutHue}, ${hsl.s}%, 40%)`);
    
    // D. Projects Dark (Same Hue, but very dark)
    root.style.setProperty('--projects-dark', `hsl(${hsl.h}, 60%, 15%)`);
  }

  // --- EVENTS ---
  submitBtn.addEventListener("click", function(e) {
    e.preventDefault(); // Prevents page reload
    updateTheme();
  });
  
  // Allow pressing "Enter" key
  colorInput.addEventListener("keypress", function(e) {
    if (e.key === "Enter") updateTheme();
  });
});