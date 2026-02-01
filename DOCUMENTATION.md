# Project Documentation

This document provides a summary of the project and a description of each file.

## Project Overview

This project is a personal portfolio webpage. It's a single-page application that showcases projects, provides information about the developer, and includes contact information. The color scheme of the page can be dynamically changed by the user.

This project is based on the freeCodeCamp "Build a Personal Portfolio Webpage" project.

## File Descriptions

*   **`index.html`**: The main HTML file for the portfolio. It defines the structure of the webpage, including the navigation, welcome section, projects, about section, and contact information. It also links to the CSS and JavaScript files.

*   **`styles.css`**: The main stylesheet for the portfolio. It contains all the styles for the webpage, including layout, colors, fonts, and responsive design. It uses CSS variables to allow for dynamic theme changes.

*   **`reset.css`**: A CSS reset file used to reduce browser inconsistencies in things like default line heights, margins and font sizes of headings, and so on. This is based on the popular reset by Eric Meyer.

*   **`color.js`**: This JavaScript file contains the logic for dynamically changing the color theme of the webpage. It takes a color name as input, converts it to HSL, and then generates a color palette for the different sections of the page. It also calculates the contrast color for the text to ensure readability.

*   **`colors-user.js`**: This JavaScript file appears to be an updated or alternative version of `color.js`. It includes additional logic to handle light colors and apply colors to specific DOM elements. The `index.html` file is currently using this script.

*   **`README.md`**: The main README file for the project. It contains a brief description of the project and a link to the freeCodeCamp project instructions.

*   **`small-Project-1.png` - `small-Project-6.png`**: These are image files used as thumbnails or previews for the projects listed in the portfolio.

*   **`.DS_Store`**: A system file created by macOS. It contains information about the folder's display options. It is not relevant to the project itself.
