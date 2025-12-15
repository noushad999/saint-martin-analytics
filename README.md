# Spatiotemporal Analysis of Coastal Erosion: Saint Martin's Island (2000–2024)

![Google Earth Engine](https://img.shields.io/badge/Platform-Google%20Earth%20Engine-4285F4?style=for-the-badge&logo=google-earth&logoColor=white)
![Landsat](https://img.shields.io/badge/Data-NASA%20Landsat-blue?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Research%20Prototype-orange?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A remote sensing framework developed to quantify the long-term morphological changes and land mass degradation of **Saint Martin's Island**, the only coral island of Bangladesh, using multi-temporal satellite imagery and machine learning.

🔗 **Live Analytics Dashboard:** [ACCESS THE WEB APP HERE](https://gen-lang-client-0049500756.projects.earthengine.app/view/saint-martin-coastal-analytics)

---

## 📝 Abstract
Saint Martin's Island is critically vulnerable to rising sea levels and geological erosion. This project leverages **Google Earth Engine (GEE)** to process 24 years of archival data from **NASA's Landsat Program**. By implementing automated water masking algorithms (NDWI) and sensor harmonization techniques, this study provides a quantitative assessment of the island's shifting coastline and core land area reduction.

## 📊 Key Research Findings (2000–2024)
Based on the **Normalized Difference Water Index (NDWI)** analysis focused on permanent sub-aerial land mass:

| Metric | Year 2000 | Year 2024 | Net Change |
| :--- | :--- | :--- | :--- |
| **Core Land Area** | **417.39 Hectares** | **375.90 Hectares** | **📉 -41.49 Ha** |
| **Rate of Loss** | - | - | ~1.7 Ha / Year |

> **Interpretation:** The data indicates a loss of approximately **~10% of the island's permanent habitable land** over the last two decades. While the core land loss is ~41.5 Ha, broader ecological observation suggests significant degradation of the surrounding intertidal coral reef ecosystem.

## 🛠️ Methodology & Algorithms
This project utilizes a cloud-native remote sensing pipeline:

### 1. Data Acquisition & Harmonization
- **Source:** USGS Landsat Collection 2 Level 2 (Surface Reflectance).
- **Sensors Used:**
  - Landsat 5 TM (2000–2011)
  - Landsat 7 ETM+ (2012, Gap-filled)
  - Landsat 8/9 OLI (2013–2024)
- **Harmonization:** Cross-calibrated spectral bands to ensure consistency between older (L5/7) and newer (L8/9) sensors.

### 2. Algorithmic Processing
- **Cloud Masking:** Implemented `QA_PIXEL` bitmasking to filter clouds and shadows (<60% threshold).
- **Median Compositing:** Generated annual cloud-free composites to minimize seasonal noise.
- **Water Extraction:** Used **NDWI** (Normalized Difference Water Index) to delineate land vs. water boundaries.
  $$NDWI = \frac{Green - NIR}{Green + NIR}$$
- **Area Calculation:** Applied `reduceRegion` with `ee.Reducer.sum()` on binary land masks to compute surface area in hectares dynamically.

## 💻 Tech Stack
- **Compute Engine:** Google Earth Engine (JavaScript API).
- **Frontend:** GEE UI Library (for the interactive dashboard).
- **Data:** NASA/USGS Earth Observation Data.

## 🚀 How to Reproduce
To replicate this study or verify the data:
1. Sign up for [Google Earth Engine](https://earthengine.google.com/).
2. Clone this repository or copy the content of `script.js`.
3. Paste the code into the GEE Code Editor.
4. Run the script to generate the timelapse and analytics.

## 👨‍💻 Author & Citation
**Md Noushad Jahan Ramim** *AI Developer & Researcher* 

If you use this code or data for your research, please cite this repository.

---
*Disclaimer: This tool uses automated satellite processing. Area calculations are approximations based on 30m resolution pixels and may vary slightly from ground surveys.*
