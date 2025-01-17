angular.module('myApp')
  .directive('d3circles', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div><div class="circle-graph"></div><h3 class="reference"></h3></div>',
    scope: {
      // creates a scope variable in your directive
      // called `dataset` bound to whatever was passed
      // in via the `dataset` attribute in the DOM
      dataset: '=dataset'
    },
    link: function(scope, element, attrs) {
      scope.$watch('dataset', function(dataset) {

          var w = 200,                        //width
          h = 200,                            //height
          r = 100,                            //radius
          color = d3.scale.category20c();     //builtin range of colors

    data = dataset;
    
    var vis = d3.select(element.context)
        .append("svg:svg")              //create the SVG element inside the <body>
        .data([data])                   //associate our data with the document
            .attr("width", w)           //set the width and height of our visualization (these will be attributes of the <svg> tag
            .attr("height", h)
        .append("svg:g")                //make a group to hold our pie chart
            .attr("transform", "translate(" + r + "," + r + ")")    //move the center of the pie chart from 0, 0 to radius, radius

  

        var arc = d3.svg.arc()
            .innerRadius(0)
            .outerRadius(r);


    var pie = d3.layout.pie()           //this will create arc data for us given a list of values
        .value(function(d) { return d.count; });    //we must tell it out to access the value of each element in our data array

    var arcs = vis.selectAll("g.slice")     //this selects all <g> elements with class slice (there aren't any yet)
        .data(pie)                          //associate the generated pie data (an array of arcs, each having startAngle, endAngle and value properties) 
        .enter()                            //this will create <g> elements for every "extra" data element that should be associated with a selection. The result is creating a <g> for every object in the data array
            .append("svg:g")                //create a group to hold each slice (we will have a <path> and a <text> element associated with each slice)
                .attr("class", "slice");    //allow us to style things in the slices (like text)

        arcs.append("svg:path")
                .attr("fill", function(d, i) { return color(i); } ) //set the color for each slice to be chosen from the color function defined above
                .attr("d", arc);                                    //this creates the actual SVG path using the associated data (pie) with the arc drawing function


              var $referenceLabel = $(element.context).find('h3.reference');
        arcs.on("mouseover", function(d) {
                  
                  $referenceLabel.html(d.data.name + '(' + d.data.count  +')');
                  // $('.genrelabel').hide();
                 //  d3.select(this).transition()
                 //     .duration(1000)
                 //     .attr("d", arcOver);
                 })
        .on("mouseout", function(d) {
                  $referenceLabel.html('');
                  // d3.select(this).transition()
                  //    .duration(1000)
                  //    .attr("d", arc);
                 });
        $(element.context).find('svg')[0].remove()
        

// add the text
var count = 0;
for (var i = 0; i < dataset.length; i++) {
  count += dataset[i].count;
};
arcs.append("svg:text").attr("transform", function(d){
      d.innerRadius = 0;
      d.outerRadius = r;
    return "translate(" + arc.centroid(d) + ")";}).attr("text-anchor", "middle").text( function(d, i) {
    return Math.round(data[i].count * 100 / count) + "%" ;}
    );


        arcs.append("svg:text")                                     //add a label to each slice
                .attr("transform", function(d) {                    //set the label's origin to the center of the arc
                //we have to make sure to set these before calling arc.centroid
                d.innerRadius = 0;
                d.outerRadius = r;
                return "translate(" + arc.centroid(d) + ")";        //this gives us a pair of coordinates like [50, 50]
            })
            .attr("text-anchor", "middle")                          //center the text on it's origin
            .text(function(d, i) { return data[i].label; });        //get the label from our original data array

          });
      
  
    }
  }
});





