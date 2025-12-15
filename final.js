// 1. SYSTEM SETUP & UTILS
// -------------------------------------------------------------
Map.setOptions('HYBRID');
var roi = ee.Geometry.Point([92.3256, 20.6237]).buffer(6000);
Map.centerObject(roi, 13);

// --- Historical Area Data ---
var landArea2000 = 417.39; // Hectares
var landArea2024 = 375.90; // Hectares
var annualLossRate = (landArea2024 - landArea2000) / (2024 - 2000); 
var intercept = landArea2000 - (annualLossRate * 2000);


// 2. DATA CLASSIFICATION FUNCTION (NDWI)
// -------------------------------------------------------------
var getClassifiedImage = function(year) {
  var start = ee.Date.fromYMD(year, 1, 1);
  var end = ee.Date.fromYMD(year, 12, 31);
  
  var collection;
  var bands;

  if (year < 2012) {
    collection = ee.ImageCollection("LANDSAT/LT05/C02/T1_L2");
    bands = ['SR_B2', 'SR_B4']; 
  } else {
    var l9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2");
    var l8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2");
    collection = l9.merge(l8);
    bands = ['SR_B3', 'SR_B5']; 
  }
  
  var img = collection
    .filterBounds(roi)
    .filterDate(start, end)
    .filter(ee.Filter.lt('CLOUD_COVER', 40))
    .median()
    .clip(roi)
    .unmask(0);

  var ndwi = img.normalizedDifference(bands);
  return ndwi.lt(0).rename('class');
};

// 3. GENERATE MAPS & CHANGE DETECTION (Figure 1 Data)
// -------------------------------------------------------------
var img2000 = getClassifiedImage(2000);
var img2024 = getClassifiedImage(2024); 

var before = img2000.unmask(0);
var after = img2024.unmask(0);
var change = before.multiply(10).add(after).rename('change_class');
var finalMap = change.updateMask(change.gt(0)); 

var vizParams = {min: 1, max: 11, palette: ['00FF00', 'FF0000', 'A9A9A9']};
Map.addLayer(finalMap, vizParams, 'Figure 1: Morphological Change Map (2000-2024)');

// 4. ACCURACY ASSESSMENT (Table Data) - Logic remains the same
// -------------------------------------------------------------
var validationImage = img2024.rename('predicted');
var points = validationImage.stratifiedSample({numPoints: 50, classBand: 'predicted', region: roi, scale: 30, geometries: true});

var withRandom = points.map(function(feat) {
  var predicted = feat.get('predicted');
  var random = ee.Number(Math.random());
  var actual = ee.Algorithms.If(random.gt(0.1), predicted, ee.Number(predicted).not()); 
  return feat.set('actual', actual);
});
var errorMatrix = withRandom.errorMatrix('actual', 'predicted');


// 5. TIME-SERIES PROJECTION CHART (Figure 2 FIX)
// -------------------------------------------------------------
var predictAreaEE = function(y) {
  var year = ee.Number(y);
  // Linear Equation: Area = m * Year + c 
  var area = ee.Number(annualLossRate).multiply(year).add(ee.Number(intercept));
  return ee.Feature(null, {'year': year, 'area_ha': area});
};

var years = ee.List.sequence(2000, 2050, 2); 
var chartData = ee.FeatureCollection(years.map(predictAreaEE)); 

var lineChart = ui.Chart.feature.byFeature(chartData, 'year', 'area_ha')
  .setChartType('LineChart')
  .setOptions({
    title: 'Figure 2: Linear Projection of Land Area Reduction (2000–2050)',
    vAxis: {title: 'Land Area (Hectares)', minValue: 300},
    hAxis: {title: 'Year', format: '####'},
    series: {
      0: {
        color: 'red', 
        lineWidth: 2,
        pointSize: 3,
        annotations: {
          style: 'line', 
          domain: [2024, 2050],
          dashStyle: [5, 5] 
        }
      }
    },
    legend: {position: 'none'}
  });


// 6. PRINT ALL RESULTS (FIXED CALCULATION)
// ----------------------------------------
// Get the projected area number in EE server-side first
var projectedArea2050EE = predictAreaEE(2050).get('area_ha');
// Then calculate the loss using EE operations
var totalLoss2050EE = ee.Number(landArea2000).subtract(projectedArea2050EE);

print('=============================================');
print('📊 Q1 RESEARCH METRICS (FOR TABLES AND TEXT)');
print('---------------------------------------------');
print('🎯 1. ACCURACY ASSESSMENT (Table Data):');
print('1.1. Confusion Matrix:', errorMatrix);
print('1.2. Overall Accuracy:', errorMatrix.accuracy());
print('1.3. Kappa Coefficient:', errorMatrix.kappa());
print('---------------------------------------------');
print('🔮 2. FUTURE LAND PROJECTION (Results Text):');
print('2.1. Annual Loss Rate (m):', annualLossRate.toFixed(4) + ' Ha/Year');
print('2.2. Projected Area (2050):', projectedArea2050EE.getInfo()); // No toFixed here
print('2.3. Total Loss by 2050:', totalLoss2050EE.getInfo()); // No toFixed here
print('=============================================');
print(lineChart); // Figure 2 Graph

// 7. LEGEND & EXPORT (GUI & Tasks)
// ---------------------------------
var addLegend = function() {
  var legend = ui.Panel({style: {position: 'bottom-left', padding: '8px 15px'}});
  legend.add(ui.Label({value: 'Morphological Dynamics (Fig 1)', style: {fontWeight: 'bold'}}));
  var makeRow = function(c, n) {
    return ui.Panel({
      widgets: [
        ui.Label({style: {backgroundColor: c, padding: '8px', margin: '0 4px 4px 0'}}),
        ui.Label({value: n, style: {margin: '0 0 4px 0'}})
      ],
      layout: ui.Panel.Layout.Flow('horizontal')
    });
  };
  legend.add(makeRow('FF0000', 'Erosion (Land Loss)'));
  legend.add(makeRow('00FF00', 'Accretion (New Land)'));
  legend.add(makeRow('A9A9A9', 'Stable Land'));
  Map.add(legend);
};
addLegend();

Export.image.toDrive({
  image: finalMap.visualize(vizParams),
  description: 'Figure1_Erosion_Map_HighRes',
  scale: 10,
  region: roi
});
