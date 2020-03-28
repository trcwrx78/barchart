fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
  .then(res => res.json())
  .then(res => {
    const { data } = res
  
    barChart(data.map(d => [d[0].split('-')[0], d[1], d[0].split('-')[1], d[0]]))
  //Array returns 0.year, 1.amount, 2.month#, 3.year and month
});

function barChart(data){
  const w = 700
  const h = 400
  const padding = 45
  
  const color = d3.scaleSequential(d3.interpolateInferno)
  .domain([d3.min(data, (d) => d[1]), d3.max(data, (d) => d[1])])
  
  const barWidth = w / data.length
  
  const fullDate = data.map(date => new Date(date[3]))
  
  const xMax = new Date(d3.max(fullDate))
  xMax.setMonth(xMax.getMonth() + 3)

  const xScale = d3.scaleTime()
    .domain([d3.min(fullDate), xMax])
    .range([padding, w - padding])
  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([h - padding, padding])

  const div = d3.select("body")
    .append("div")	
    .attr("id", "tooltip")				
    .style("opacity", 0)
  
  const svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)

  svg.selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('data-date', d => d[3])
    .attr('data-gdp', d => d[1])
    .attr('fill', d => color(d[1]))
    .attr('x', (d, i) => xScale(fullDate[i]))
    .attr('y', (d, i) => yScale(d[1]))
    .attr('width', barWidth)
    .attr('height', d => h - yScale(d[1]) - padding)
    .on('mouseover', (d, i) => {
      div.transition()
        .duration(200)
        .style('opacity', 0.9)
      div.html(`${d[0]} ${d[2]==='01' ? 'Q1': d[2]==='04' ? 'Q2': d[2]==='07' ? 'Q3': 'Q4'}<br>\$${d[1]} Billion`)
        .style('left', (d3.event.pageX + 10) + 'px')		
        .style('top', (h - padding) + 180 + 'px')
        .attr('data-date', d[3])
    })
        
    .on('mouseout', d => {
      div.transition()
        .duration(500)
        .style('opacity', 0)
    })
  
  const xAxis = d3.axisBottom(xScale)
  const yAxis = d3.axisLeft(yScale)
  
  svg.append('g')
    .attr('id', 'x-axis')
    .attr('transform', `translate(0, ${h - padding})`)
    .call(xAxis)
  
  svg.append('g')
    .attr('id', 'y-axis')
    .attr('transform', `translate(${padding}, 0)`)
    .call(yAxis)
  
}