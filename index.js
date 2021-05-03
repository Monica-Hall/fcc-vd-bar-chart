document.addEventListener('DOMContentLoaded',function() {
    const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json";
    req=new XMLHttpRequest();
    req.open("GET",url,true);
    req.send();
    req.onload=function(){
        
      json=JSON.parse(req.responseText);
    
      var dataset = json.data;
  
      var yearData=[];
      for (var i = 0; i<dataset.length; ++i) {
          yearData.push(new Date(dataset[i][0])); 
      }
                  
      const fullwidth = 800;
      const fullheight = 600;
      const padding = 50;
  
      const width = fullwidth - 2 * padding;
      const height = fullheight - 2 * padding;
            
      //Get the range we want to display on X axis
      var maxDate = d3.max(yearData, (d) => d);
      var minDate = d3.min(yearData, (d) => d);
      var maxDateMore = new Date (maxDate);
      var minDateLess = new Date(minDate); 
      maxDateMore.setMonth(maxDate.getMonth()+3);		
      minDateLess.setMonth(minDate.getMonth()-3);		
            
      //Get the range we want to display on the Y axis
      var maxValue = d3.max(dataset, (d) => d[1]);
      //Round up so the graph doesn't go to the very top
      var roundedUpMax = Math.ceil(maxValue/1000)*1000;		
      
      var barPadding = 5;
      var barWidth = ((width-padding) / (dataset.length+2) );	
      
      //Define scales
      var yScale = d3.scaleLinear()
          .domain([0,roundedUpMax])
          .range([height, 0]); 
          
      var xScale = d3.scaleTime()
          .domain([minDateLess, maxDateMore])
          .range([padding, width]) ;
      
     // Define the y and x axis
      var yAxis = d3.axisLeft(yScale);
      var xAxis = d3.axisBottom(xScale);	
            
      //Create SVG
      var svg = d3.select("#graph")
          .append("svg")
          .attr("width", fullwidth)
          .attr("height", fullheight);
  
        //  - User Story #3: My chart should have a g element y-axis with a corresponding id="y-axis".
        svg.append("g")
          .attr("transform", "translate("+padding+",0)")
          .attr("id", "y-axis")
          .call(yAxis);
  
        //  - User Story #2: My chart should have a g element x-axis with a corresponding id="x-axis".
        svg.append("g")
          .attr("class", "xaxis")   
          .attr("id", "x-axis")
          .attr("transform", "translate(0," + (height) + ")")
          .call(xAxis);
          
      //Add Tooltips
      var tooltip = svg.append("text")
      .attr("id", "tooltip")
      .attr("x", 0.5* width - 100)	//Put info near center of the width of the SVG
      .attr("y", height*0.5) 	// Put info at center of height of the SVG
      .attr("opacity", 0.9)
      .attr("background", "yellow")
      .attr("stroke", "black");
  
// - User Story #5: My chart should have a rect element for each data point with a corresponding class="bar" displaying the data.      
      svg.selectAll("rect")
          .data(dataset)
          .enter()
          .append("rect")
          .attr("class", "bar")
          .attr("x", (d, i) => xScale(yearData[i]))
          .attr("y", (d, i) => height - yScale(roundedUpMax-d[1]))
          .attr("width", (d, i) => barWidth) 
          .attr("height", function(d, i){
              if (yScale(roundedUpMax-d[1]) <= 0)
              { 
                  return 1;
              }
              else
              {
                  return yScale(roundedUpMax-d[1]);
              }
          })

        // - User Story #6: Each bar should have the properties data-date and data-gdp containing date and GDP values.

          // - User Story #10: The data-date attribute and its corresponding bar element should align with the corresponding value on the x-axis.
          .attr('data-date', (d,i) => (d[0]))
          // - User Story #11: The data-gdp attribute and its corresponding bar element should align with the corresponding value on the y-axis.
          .attr('data-gdp', (d,i) => (d[1]))
          .attr("fill", "LightBlue")
          
          // - User Story #12: I can mouse over an area and see a tooltip with a corresponding id="tooltip" which displays more information about the area.
          .on('mouseover', function(d, i) {
              tooltip.text(d[0] + ": $" + d[1] + " Billions of Dollars")
              // - User Story #13: My tooltip should have a data-date property that corresponds to the data-date of the active area.
              .attr('data-date', d[0])
              .attr('opacity', 0.9);
              
          })
          .on('mouseout', function(d) {
              tooltip.attr('opacity', 0);
          })

          //Add tooltips near mouse
          .append("title")
          .text ((d,i) => d[0] + ": $" + d[1] + " Billions of Dollars")
          .attr("data-date",(d,i) => (d[0]));          
    }
  });