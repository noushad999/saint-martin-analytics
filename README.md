#  Saint Martin's Coastal Erosion Monitoring System

[![GEE](https://img.shields.io/badge/Google%20Earth%20Engine-4285F4?style=for-the-badge&logo=google-earth&logoColor=white)](https://earthengine.google.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

An interactive, real-time satellite monitoring system quantifying the coastal morphological changes of Saint Martin's Island, Bangladesh. Powered by **Google Earth Engine (GEE)** and **NASA Landsat** archival data (2000-2024).

🔗 **Live Dashboard:** [CLICK HERE TO VIEW APP]([তোমার_অ্যাপের_লিংক_এখানে_দাও](https://gen-lang-client-0049500756.projects.earthengine.app/view/saint-martin-coastal-analytics))

---

##  Key Findings (2000-2024)
Using multi-temporal satellite imagery and automated water masking algorithms, this project identified:
- **Land/Reef Loss:** Approximately **~1300 Hectares** of land mass and coral reef area have been submerged/eroded over the last 24 years.
- **Critical Zone:** The northern tip of the island exhibits the highest volatility due to shifting sandbars and rising sea levels.

##  Features
- **Real-time Analytics:** Interactive slider to visualize year-to-year changes.
- **Automated Calculation:** Dynamic computation of land area in hectares using server-side processing.
- **Cross-Sensor Harmonization:** Seamless integration of Landsat 5, 7, 8, and 9 data.
- **Robust Algorithm:** Implements NDWI (Normalized Difference Water Index) with cloud masking and gap-filling techniques.

## Tech Stack
- **Platform:** Google Earth Engine (JavaScript API)
- **Data Source:** NASA USGS Landsat Collection 2 Tier 1
- **Algorithms:** NDWI, Median Compositing, Reducer Statistics.

##  Methodology
1. **Data Acquisition:** Filtered Landsat SR collection for the dry season (Nov-March) to minimize cloud cover.
2. **Preprocessing:** Applied cloud masking and harmonized bands across different sensors (L5/7 vs L8/9).
3. **Water Masking:** Calculated NDWI `(Green - NIR) / (Green + NIR)` to classify land vs. water pixels.
4. **Area Computation:** `pixelArea()` function used to calculate total land surface in real-time.

##  How to Run
1. Sign up for [Google Earth Engine](https://signup.earthengine.google.com/).
2. Copy the code from `script.js`.
3. Paste it into the GEE Code Editor.
4. Click **Run**.

##  Author
**Md Noushad Jahan Ramim** AI Developer & Researcher  

---
*This project is open-sourced under the MIT License. Feel free to use it for research and educational purposes with proper citation.*
