// 1. Helper: Convert "Color Name" (or Hex) to RGB Numbers
function getRgbValues(colorString) {
    // Create a temporary element
    const tempDiv = document.createElement("div");
    
    // Set the color to whatever the user typed
    tempDiv.style.color = colorString;
    
    // If the browser doesn't recognize the color, it won't set the style.
    // We can check this to handle bad inputs.
    if (tempDiv.style.color === "") {
        return null; // Invalid color
    }

    // Add to DOM briefly to get computed styles (required by some browsers)
    document.body.appendChild(tempDiv);
    
    // Get the computed "rgb(r, g, b)" string
    const computedColor = window.getComputedStyle(tempDiv).color;
    
    // Remove the temp element
    document.body.removeChild(tempDiv);

    // Extract the numbers using Regex
    const match = computedColor.match(/\d+/g);
    
    if (!match) return null;

    return {
        r: parseInt(match[0]),
        g: parseInt(match[1]),
        b: parseInt(match[2])
    };
}

// 2. Helper: Convert RGB to HSL
// We need this to rotate the Hue for your palette
function rgbToHSL(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    let cmin = Math.min(r, g, b),
        cmax = Math.max(r, g, b),
        delta = cmax - cmin,
        h = 0,
        s = 0,
        l = 0;

    if (delta == 0) h = 0;
    else if (cmax == r) h = ((g - b) / delta) % 6;
    else if (cmax == g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);
    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    
    // Return numeric values
    return { 
        h: h, 
        s: +(s * 100).toFixed(1), 
        l: +(l * 100).toFixed(1) 
    };
}

// 3. Main Function: Apply the Theme
function updateColorScheme(userInput) {
    const root = document.documentElement;

    // A. Get RGB from the name (e.g., "HotPink")
    const rgb = getRgbValues(userInput);

    if (!rgb) {
        alert("Sorry, I don't recognize that color! Try 'Red', 'Navy', or 'Tomato'.");
        return;
    }

    // B. Convert to HSL so we can do math
    const hsl = rgbToHSL(rgb.r, rgb.g, rgb.b);

    // --- C. CALCULATE THE PALETTE ---

    // 1. Main Color (The User's Color)
    const mainColor = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    // 2. Welcome Color (Triadic + 120 degrees)
    // We adjust L (Lightness) slightly to ensure it's not too dark for a header
    const welcomeHue = (hsl.h + 120) % 360;
    const welcomeColor = `hsl(${welcomeHue}, ${hsl.s}%, 50%)`; 

    // 3. About/Contact Color (Triadic + 240 degrees)
    const aboutHue = (hsl.h + 240) % 360;
    const aboutColor = `hsl(${aboutHue}, ${hsl.s}%, 40%)`;

    // 4. Projects Color (Deep Dark version of the Main Hue)
    // We force Lightness to 15% to make it a dark background
    const projectsColor = `hsl(${hsl.h}, 60%, 15%)`;

    // --- D. APPLY TO CSS ---
    root.style.setProperty('--main-color', mainColor);
    root.style.setProperty('--welcome-color', welcomeColor);
    root.style.setProperty('--about-contact', aboutColor);
    root.style.setProperty('--projects-dark', projectsColor);
}

// 4. Event Listener
// Assuming your text input has class="color-text-input" and button class="btn-submit"
const submitBtn = document.querySelector('.btn-submit'); 
const textInput = document.querySelector('input[type="text"]'); // Be sure to target the text field

if(submitBtn && textInput) {
    submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        // Clean up the input (remove spaces, make lowercase)
        const colorName = textInput.value.trim().toLowerCase();
        updateColorScheme(colorName);
    });
}