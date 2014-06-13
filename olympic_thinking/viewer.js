function adjusted_sport_names(d){
        if (d.Sport.indexOf("Cycling") > -1) {
            return "Cycling"
        } else if (d.Sport == "Athletics, Triathlon") {
            return "Athletics";
        } else {
            return d.Sport;
        }
}

function nesting (data){
    var newdata = d3.nest()
        .key(function(d){
            return adjusted_sport_names(d);
        })
        .sortKeys(d3.ascending)
        .key(function(d) { 
            return d.Age;
        })
        .sortKeys(d3.ascending)
        .key(function(d) { return d.Sex; })
        .entries(data);
    return newdata;
}


function start() {
    
    var CHART_X = 50;
    var CHART_Y = 20;
    var INNER_WIDTH = 900;
    var INNER_HEIGHT = 550;
    var AXIS_MARGIN = 10;
    
    var svg = d3.select('svg');

    d3.csv('olympics_2012.csv', function (raw_data) {
        
        var nested_data = nesting(raw_data);
//        console.log(nested_data);
        
        var age_range = [10, 80];
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
        
        
        var MAX_PEOPLE = 111;
        
        var scale_opacity = d3.scale.log()
            .domain([1, MAX_PEOPLE])
            .range([0.6, 1]);
        var scale_rad_x = d3.scale.log()
            .domain([1, MAX_PEOPLE])
            .range([2, 15]);
        
        var max = 0;

        function count_medals(people) {
            var medals = {Bronze: 0,
                          Silver: 0,
                          Gold: 0};
            people.forEach(function (person) {
                medals.Bronze += parseFloat(person.Bronze) || 0;
                medals.Silver += parseFloat(person.Silver) || 0;
                medals.Gold += parseFloat(person.Gold) || 0;
            });
            return Math.ceil(medals.Gold);
        }
        
        //gender
        var genders = age_groups.selectAll('circle')
            .data(function (d) {
                return d.values;
            })
            .enter()
            .append('g');
        
        genders.append('rect')
        .attr('x', function (d, i) {
                if (d.key == 'F'){
                    return -scale_rad_x(d.values.length) - 3;
                }
                else {
                    return 0;
                }
            })
            .attr('y', 0)
            .attr('width', function (d, i) {
                return scale_rad_x(d.values.length);
            })
            .attr('height', function (d, i) {
                return 8;
            })
            .attr('fill', function (d, i) {
                if (d.key == 'F'){
                    return '#d6e3a0';
                }
                else {
                    return '#f9cc8e';
                }
            })
//            .style('stroke', function (d, i) {
//                if (count_medals(d.values) > 0) {
//                    return 'black';
//                } else {
//                    return 'none';
//                }
//            })
//            .style('stroke-width', 2)
            .style('opacity', function (d, i) {
                return 1; //scale_opacity(d.values.length);
            });
            ;
            
        genders
            .append('rect')
            .attr('x', function (d, i) { 
                if (d.key == ('F')){
                    return -count_medals(d.values) - 3;
                }
                else {
                    return 1;
                } 
            })
            .attr('y', function (d, i) { return 1; })
            .attr('width', function (d, i) {
                var cnt = count_medals(d.values);
                if (cnt > 0) {
                    return cnt + 1;
                } else {
                    return 0;
                }
//                return scale_rad_x(count_medals(d.values));
            })
            .attr('height', 2)
            .style('fill', function (d, i) {
                return "black";
            });
        
        // red = female, blue = male           
//        var people = genders.selectAll('circle')
//            .data(function (d) {
//                return d.values;
//            })
//            .enter()
//            .append('rect')
//            .attr('class', 'person')
//            .attr('r', 1)
//            .attr('x', function (d, i) { 
//                if (d.Sex == ('F')){
//                    return -6;
//                }
//                else {
//                    return 1;
//                } 
//            })
//            .attr('y', function (d, i) { return 1; })
//            .attr('width', function (d, i) {
//                return 3;
//            })
//            .attr('height', 2)
//            .style('fill', function (d, i) {
//                if (d.Gold){
//                    return 'black';
//                }
//                else {
//                    return 'none';
//                }
//            })
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
                var dx = (d.key == 'F') ? -2 : 2;
                return 'translate(' + dx + ', 0)';
            });

        var max = 0;
        var people = genders.selectAll('circle.person')
            .data(function (d) {
                if (d.values.length > max) {
                    max = d.values.length;
                    console.log(max);
                }
                return d.values;
            })
            .enter()
            .append('circle')
            .attr('class', 'person')
            .attr('r', 1)
            .attr('cx', 0)
            .attr('cy', function (d, i) { return 0; });
    });
};
*/
// Start the viewer after all the libs load.
$(start);
