const svg = d3.select("#scatterplot");
const tooltip = d3.select("#tooltip");

const margin = { top: 20, right: 30, bottom: 40, left: 50 };
const width = +svg.attr("width") - margin.left - margin.right;
const height = +svg.attr("height") - margin.top - margin.bottom;

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleTime().range([height, 0]);

const xAxis = d3.axisBottom(x).tickFormat(d3.format("d"));
const yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));

const g = svg.append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json").then(data => {
    data.forEach(d => {
        d.Year = +d.Year;
        d.Time = new Date(0, 0, 0, 0, d.Time.split(':')[0], d.Time.split(':')[1]);
    });

    x.domain(d3.extent(data, d => d.Year));
    y.domain([d3.min(data, d => d.Time), d3.max(data, d => d.Time)]);

    g.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    g.append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    g.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.Year))
        .attr("cy", d => y(d.Time))
        .attr("r", 5)
        .attr("data-xvalue", d => d.Year)
        .attr("data-yvalue", d => d.Time)
        .on("mouseover", (event, d) => {
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`Year: ${d.Year}<br>Time: ${d.Time.getMinutes()}:${d.Time.getSeconds()}`)
                .attr("data-year", d.Year)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", () => {
            tooltip.transition().duration(500).style("opacity", 0);
        });

    // Legend (optional)
    d3.select("#legend").text("Legend: Each dot represents a cyclist's time in a race.");
});
