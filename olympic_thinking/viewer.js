
function start() {
    
    var CHART_X = 50;
    var CHART_Y = 20;
    var INNER_WIDTH = 800;
    var INNER_HEIGHT = 300;
    var AXIS_MARGIN = 10;
    
    var svg = d3.select('svg');

    d3.csv('olympics_2012.csv', function (data) {
        var age_range = [10, 100];
        var sport_names = d3.nest()
            .key(function (d) { return d.Sport; })
            .entries(data);
        
        var chart = svg.append('g')
            .attr('class', 'chart')
            .attr('transform', 'translate(' + CHART_X + ', '
                                            + CHART_Y + ')');

        // axis X
        var scale_x = d3.scale.linear()
            .domain([0, sport_names.length])
            .range([0, INNER_WIDTH]);
        var axis_x = d3.svg.axis()
            .scale(scale_x)
            .orient('bottom')
            .ticks(sport_names.length)
            .tickSize(10)
            .tickFormat('');
        var axis_x_g = chart.append('g')
            .attr('class', 'axis_x')
            .attr('transform', 'translate(0, ' + INNER_HEIGHT + ')');
        axis_x_g.call(axis_x);
        axis_x_g.selectAll('text.sport')
            .data(sport_names)
            .enter()
            .append('text')
            .attr('text-anchor', 'end')
            .attr('transform', function (d, i) {
                return 'translate(' + scale_x(i + 0.5) + ',20),rotate(-45)'
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
            .call(axis_y);
    });
};

// Start the viewer after all the libs load.
$(start);
