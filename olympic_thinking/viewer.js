function nesting (data){
    var newdata = d3.nest()
        .key(function(d) { return d.Sport; })
        .sortKeys(d3.ascending)
        .key(function(d) { 
            return 10*Math.floor(d.Age/10); 
        })
        .sortKeys(d3.ascending)
        .key(function(d) { return d.Sex; })
        .entries(data);
    return newdata;
}
           
function start() {
    
    var CHART_X = 50;
    var CHART_Y = 20;
    var INNER_WIDTH = 800;
    var INNER_HEIGHT = 300;
    var AXIS_MARGIN = 10;
    
    var svg = d3.select('svg');

    d3.csv('olympics_2012.csv', function (raw_data) {
        
        var nested_data = nesting(raw_data);
        console.log(nested_data);
        
        var age_range = [10, 80];
        var sport_names = d3.nest()
            .key(function (d) { return d.Sport; })
            .entries(raw_data);
        
        var chart = svg.append('g')
            .attr('class', 'chart')
            .attr('transform', 'translate(' + CHART_X + ', '
                                            + CHART_Y + ')');

        // axis X
        var scale_x = d3.scale.linear()
            .domain([0, sport_names.length - 1])
            .range([0, INNER_WIDTH]);
        var axis_x = d3.svg.axis()
            .scale(scale_x)
            .orient('bottom')
            .ticks(sport_names.length)
            .tickSize(10)
            .tickFormat('');
        var axis_x_g = chart.append('g')
            .attr('class', 'axis_x')
            .attr('transform', 'translate(0, ' + (INNER_HEIGHT + AXIS_MARGIN) + ')');
        axis_x_g.call(axis_x);
        axis_x_g.selectAll('text.sport')
            .data(sport_names)
            .enter()
            .append('text')
            .attr('text-anchor', 'end')
            .attr('transform', function (d, i) {
                return 'translate(' + scale_x(i + 0.3) + ',20),rotate(-45)'
            })
            .attr('class', 'sport')
            .text(function (d, i) { return d.key; })
            .attr('y', 0);
        
        // axis Y
        var scale_y = d3.scale.linear()
            .domain(age_range)
            // Put 0 on the bottom.
            .range([INNER_HEIGHT, 0]);
        var axis_y = d3.svg.axis()
            .scale(scale_y)
            .orient('left');
        
        chart.append('g')
            .attr('class', 'axis_y')
            .attr('transform', 'translate(' + (-AXIS_MARGIN) + ',0)')
            .call(axis_y);
        
        var sports = chart.selectAll('g.cluster-column')
            .data(nested_data)
            .enter()
            .append('g').attr('class', 'cluster-column')
            .attr('transform', function (d, i) {
                return 'translate(' + scale_x(i) + ', 0)';
            });
        
        var ages = sports.selectAll('g.cluster')
            .data(function(d){
                 return d.values;
            })
            .enter()
            .append('g')
            .attr('class', 'cluster')
            .attr('transform', function (d, i) {
                return 'translate(0, ' + scale_y(d.key) + ')';
            })
            .append('rect')
            .attr('x', -5)
            .attr('y', -5)
            .attr('width', 10)
            .attr('height', 10)
        ;
    });
};

// Start the viewer after all the libs load.
$(start);
