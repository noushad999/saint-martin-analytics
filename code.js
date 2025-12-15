Map.setOptions('HYBRID');
var roi = ee.Geometry.Point([92.3256, 20.6237]).buffer(6000);
Map.centerObject(roi, 13);

// --- UI SETUP ---
var panel = ui.Panel();
panel.style().set({
  width: '350px',
  position: 'bottom-right',
  padding: '10px',
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  border: '1px solid lightgray'
});
Map.add(panel);

panel.add(ui.Label({
  value: '📊 Saint Martin Analytics',
  style: {fontSize: '24px', fontWeight: 'bold', color: '#003366'}
}));
panel.add(ui.Label('Real-time Erosion Monitoring System', {color: 'gray'}));
panel.add(ui.Label('___________________________________________'));

var getProcessedLayer = function(y) {
  var year = ee.Number(y);
  var start = ee.Date.fromYMD(year, 1, 1);
  var end = ee.Date.fromYMD(year, 12, 31);
  
  var l5 = ee.ImageCollection("LANDSAT/LT05/C02/T1_L2").filterBounds(roi).filterDate(start, end);
  var l7 = ee.ImageCollection("LANDSAT/LE07/C02/T1_L2").filterBounds(roi).filterDate(start, end);
  var l8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2").filterBounds(roi).filterDate(start, end);
  var l9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2").filterBounds(roi).filterDate(start, end);

  var collection = ee.ImageCollection(ee.Algorithms.If(
    year.lt(2012), l5, // ১৯৮০-২০১১: L5
    ee.Algorithms.If(year.eq(2012), l7, // ২০১২: L7
    l8.merge(l9)) // ২০১৩+: L8/9 )
    ));
  

var img = collection.filter(ee.Filter.lt('CLOUD_COVER', 60)).median().clip(roi);

  
  return ee.Algorithms.If(
    img.bandNames().size().gt(0),
    calculateNDWI(img, year), 
    ee.Image(0).selfMask().rename('land_area') 
  );
};


var calculateNDWI = function(img, year) {
  var ndwi;
  
  // Landsat 8/9 (New) -> Green=B3, NIR=B5
  var ndwiNew = img.normalizedDifference(['SR_B3', 'SR_B5']);
  
  // Landsat 5/7 (Old) -> Green=B2, NIR=B4
  var ndwiOld = img.normalizedDifference(['SR_B2', 'SR_B4']);
  
  
  ndwi = ee.Image(ee.Algorithms.If(year.gte(2013), ndwiNew, ndwiOld));
  
  
  // NDWI: Water is positive, Land is negative. So Land = NDWI < 0
  return ndwi.lt(0).selfMask().rename('land_area');
};

// --- INTERACTIVE SLIDER ---
panel.add(ui.Label({value: 'Select Year to Analyze:', style: {fontWeight: 'bold'}}));

var yearSlider = ui.Slider({
  min: 2000,
  max: 2024,
  step: 1,
  value: 2024,
  style: {width: '300px', color: '#003366'},
  onChange: function(value) {
    updateDashboard(value);
  }
});
panel.add(yearSlider);

var statsLabel = ui.Label({
  value: 'Initializing System...',
  style: {fontSize: '18px', fontWeight: 'bold', color: '#D32F2F', margin: '15px 0'}
});
panel.add(statsLabel);

// --- UPDATE DASHBOARD ---
function updateDashboard(year) {
  Map.layers().reset();
  
  var landLayer = ee.Image(getProcessedLayer(year)); 
  
  Map.addLayer(landLayer, {palette: ['#FFA726']}, year + ' Land Surface');
  
  var areaImage = landLayer.multiply(ee.Image.pixelArea());
  
  areaImage.reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e9
  }).evaluate(function(result) {
    var areaSqM = result.land_area;
    if (areaSqM && areaSqM > 0) {
       var areaHectares = (areaSqM / 10000).toFixed(2);
       statsLabel.setValue('YEAR ' + year + ': ' + areaHectares + ' Hectares');
       statsLabel.style().set('color', 'black');
    } else {
       statsLabel.setValue('YEAR ' + year + ': Data Not Available');
       statsLabel.style().set('color', 'red');
    }
  });
}

// --- TREND CHART ---
panel.add(ui.Label('___________________________________________'));
panel.add(ui.Label({value: '📉 24-Year Erosion Trend', style: {fontWeight: 'bold', fontSize: '16px'}}));

// চার্ট জেনারেশন (এরর ফ্রি লুপ)
var yearsList = ee.List.sequence(2000, 2024, 2);

var chartData = ee.FeatureCollection(yearsList.map(function(y) {
  var year = ee.Number(y);
  var land = ee.Image(getProcessedLayer(year));
  
  var area = land.multiply(ee.Image.pixelArea()).reduceRegion({
    reducer: ee.Reducer.sum(),
    geometry: roi,
    scale: 30,
    maxPixels: 1e9
  }).get('land_area');
  
  var finalArea = ee.Algorithms.If(area, area, 0);
  
  return ee.Feature(null, {
    'year': year, 
    'area_ha': ee.Number(finalArea).divide(10000)
  });
}));

var chart = ui.Chart.feature.byFeature(chartData, 'year', 'area_ha')
  .setChartType('AreaChart')
  .setOptions({
    title: 'Land Area Loss (Hectares)',
    hAxis: {title: 'Year', format: '####'},
    vAxis: {title: 'Area (Ha)'},
    colors: ['#EF5350'],
    legend: {position: 'none'},
    areaOpacity: 0.3
  });

panel.add(chart);

// --- INITIALIZE ---
updateDashboard(2024);

panel.add(ui.Label({
  value: 'System: Google Earth Engine | Enterprise Solution',
  style: {fontSize: '10px', color: 'gray', margin: '30px 0 0 0', textAlign: 'center'}
}));
