function adjusted_sport_names(d){
        var str = ""
        if (d.Sport.indexOf("Cycling") > -1) {
            str = "Cycling"
        }    
        else {str = d.Sport}
        return str;
}

function nesting (data){
    var newdata = d3.nest()
        .key(function(d){
            return adjusted_sport_names(d);
        })
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
        
        var age_range = [10, 70];
        var sport_names = d3.nest()
            .key(function(d){
                return adjusted_sport_names(d);
            })
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
            .ticks(7)
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
        
        var age_groups = sports.selectAll('g.cluster')
            .data(function(d){
                 return d.values;
            })
            .enter()
            .append('g')
            .attr('class', 'cluster')
            .attr('transform', function (d, i) {
                return 'translate(0, ' + scale_y(d.key) + ')';
            });
        
        //gender
        var genders = age_groups.selectAll('g.gender')
            .data(function (d) {
                return d.values;
            })
            .enter()
            .append('g')
            .attr('class', 'g.gender')
            
        // red = female, blue = male           
        var people = genders.selectAll('circle')
            .data(function (d) {
                console.log(d.values.length);
                return d.values;
            })
            .enter()
            .append('circle')
            .attr('class', 'person')
            .attr('r', 1)
            .attr('cx', function (d, i) { 
                if (d.Sex == ('F')){
                    return i+5;
                }
                else {
                    return i;
                } 
            })
            .attr('cy', function (d, i) { return i*2; })
            .style('fill', function (d, i) {
                if (d.Sex == ('F')){
                    return 'red';
                }
                else {
                    return 'blue';
                }
            })
    });
};

        /*var genders = age_groups.selectAll('g.gender')
            .data(function (d) {
                return d.values;
            })
            .enter()
            .append('g')
            .attr('class', 'g.gender')
            .attr('transform', function (d, i) {
                var dx = (d.key == 'F') ? -10 : 10;
                return 'translate(' + dx + ', 0)';
            });
                    
        var people = genders.selectAll('circle.person')
            .data(function (d) {
                console.log(d.values.length);
                return d.values;
            })
            .enter()
            .append('circle')
            .attr('class', 'person')
            .attr('r', 1)
            .attr('cx', 0)
            .attr('cy', function (d, i) { return i * 2; });
    });
};
*/
// Start the viewer after all the libs load.
$(start);
