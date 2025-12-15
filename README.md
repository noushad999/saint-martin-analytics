# 🛰️ Spatio-Temporal Dynamics and Future Projection of Saint Martin's Island (2000–2050)

![Google Earth Engine](https://img.shields.io/badge/Platform-Google%20Earth%20Engine-4285F4?style=for-the-badge&logo=google-earth&logoColor=white)
![Landsat](https://img.shields.io/badge/Data-NASA%20Landsat-blue?style=for-the-badge)
![Research](https://img.shields.io/badge/Status-Q1%20Research%20Draft-red?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

A robust remote sensing framework developed to quantify the historical morphological changes and project the future vulnerability of **Saint Martin's Island** to coastal erosion and sea-level rise using multi-temporal satellite imagery.

🔗 **Live Analytics Dashboard:** [ACCESS THE WEB APP HERE](https://gen-lang-client-0049500756.projects.earthengine.app/view/saint-martin-coastal-analytics)

---

## 📝 Project Overview & Novelty
This project leverages **Google Earth Engine (GEE)** and the **Landsat archive** (2000–2024) to conduct a high-resolution analysis of coastline shifts.
The primary novelty lies in the application of a **Linear Regression Model** to forecast the island's land area up to **2050**, providing critical data for climate change adaptation and coastal policy planning in Bangladesh.

## 📊 Key Research Findings (2000–2050 Projection)
The analysis reveals a persistent negative trend in the island's sub-aerial land mass:

| Metric | Baseline (2000) | Current (2024) | Projection (2050) |
| :--- | :--- | :--- | :--- |
| **Land Area (Hectares)** | **417.39 Ha** | **375.90 Ha** | **330.95 Ha** |

### **Observed Erosion Rate:**
* **Annual Loss Rate ($m$):** **-1.73 Ha/Year**
* **Total Loss (2000-2024):** **41.49 Hectares** (Approx. 10% of land lost).

### **Future Implication:**
* If the current trend continues, the island is projected to lose a cumulative **86.44 Hectares** by 2050. This underscores the need for immediate, nature-based coastal protection strategies.

## 🧪 Methodology & Validation
- **Classification:** Land/Water separation was achieved using the **Normalized Difference Water Index (NDWI)**.
- **Change Detection:** **Post-Classification Comparison (PCC)** was used to map specific zones of Erosion and Accretion (Land Loss/Gain).
- **Model:** Future trends were forecasted using **Simple Linear Regression** model.
- **Validation:** The classification achieved an **Overall Accuracy of ~90%** (Kappa Coefficient of ~0.87), ensuring data integrity.

## 🛠️ Tech Stack
- **Platform:** Google Earth Engine (Code Editor & Apps)
- **Language:** JavaScript (GEE API)
- **Data:** Landsat 5, 8, 9 (30m Resolution)

## 💻 How to Reproduce
1.  Sign up for a [Google Earth Engine Account](https://earthengine.google.com/).
2.  Copy the full script from the repository.
3.  Paste it into the GEE Code Editor and click **Run**.
    *(The script will generate the Erosion Map, Accuracy Metrics, and the 2050 Projection Chart).*

## 👨‍💻 Author
**Md Noushad Jahan Ramim** *Researcher & AI Developer* [Your LinkedIn Profile Link] | [Portfolio Link]

---
*This work serves as a draft for a Q1 journal submission, focusing on applied remote sensing for climate change adaptation.*
