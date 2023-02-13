function init() {
  // Grab a reference to the dropdown select element
  let selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    let sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    let firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Deliverable 1: 1. Create the buildChart function.
function buildCharts(sample) {
  // Deliverable 1: 2. Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
   

    // Deliverable 1: 3. Create a variable that holds the samples array. 
    let  allSamples = data.samples;
    console.log(allSamples);
    // Deliverable 1: 4. Create a variable that filters the samples for the object with the desired sample number.
    //let sampleResults = allSamples.filter(newSample => newSample.id == sample.id);
    let sampleResults = allSamples.filter(sampleObj => sampleObj.id == sample);
    console.log(sampleResults);
   
    // Deliverable 3: 1. Create a variable that filters the metadata array for the object with the desired sample number.
    let metaSamples = data.metadata;
    let bubbleSamples = metaSamples.filter(sampleObj => sampleObj.id == sample);
    console.log(bubbleSamples);
   
    // Deliverable 1: 5. Create a variable that holds the first sample in the array.
    let  sample1 = sampleResults[0];
    console.log(sample1);

    // Deliverable 3: 2. Create a variable that holds the first sample in the metadata array.
    let sample2 = bubbleSamples[0];
    console.log(sample2);

    // Deliverable 1: 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    let sample_ids = sampleResults.map(ids => ids.otu_ids);
    let sample_labels = sampleResults.map(labels => labels.otu_labels);
    let sampleValue = sampleResults.map(values => values.sample_values);
    
    console.log(sample_ids, sample_labels, sampleValue);

    // Deliverable 3: 3. Create a variable that holds the washing frequency.
    let frequency = bubbleSamples.map(person => person.wfreq);
    let wfrequency = parseFloat(frequency)
    console.log(wfrequency); 
  

    // Deliverable 1: 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    let yticks = sample_ids[0].sort().reverse().slice(0,10);
    console.log(yticks)
  
        
    // Deliverable 1: 8. Create the trace for the bar chart. 
    var barData = [{
      x: sampleValue[0].sort().reverse().slice(0,10),
      y: sample_ids[0].sort().reverse().slice(0,10),
      type: 'bar',
      orientation: 'h'
      }
    ];
    
    // Deliverable 1: 9. Create the layout for the bar chart. 
    var barLayout = {
      title: 'Top 10 Bacteria Cultures Found'
    };

    // Deliverable 1: 10. Use Plotly to plot the data with the layout. 
Plotly.newPlot("bar", barData, barLayout);


    // Deliverable 2: 1. Create the trace for the bubble chart.
    let trace_Bubble = [
      {
      x: d3.select(sample_ids[0]),
      y: d3.select(sampleValue[0]),
      text: sample_labels[0],
      mode: 'markers',
      marker: {
      size: [sampleValue[0]],
      color: [sample_ids[0]]
      }
    }];
    

    // Deliverable 2: 2. Create the layout for the bubble chart.
    let bubbleLayout = {
      title: 'Bacteria Cultures per Sample',
      showlegend: false,
      height: 600,
      width: 600,
      xaxis:'OTU ID'
      };    
    // Deliverable 2: 3. Use Plotly to plot the data with the layout.
Plotly.newPlot("bubble", trace_Bubble, bubbleLayout);
    

    // Deliverable 3: 4. Create the trace for the gauge chart.
    let trace_Gauge = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: 270,
        title: { text:  "Belly Button Washing Frequency" },
        type: "indicator",
        mode: "gauge+number"
      }
    ];

    
    // Deliverable 3: 5. Create the layout for the gauge chart.
    let gaugeLayout = {width: 600, height: 500, margin: { t: 0, b: 0 }
    }
    // Deliverable 3: 6. Use Plotly to plot the gauge data and layout.
Plotly.newPlot("gauge", trace_Gauge, gaugeLayout);
  }
  );
}    

