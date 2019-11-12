var screen = {width:1000,height:700}
var margins = {top:10,right:50,left:25,bottom:50}

var dataPromise = d3.json("/penguins/classData.json")

var success = function(data)
    {
        var newData = transformPen(data)
        console.log(newData)
        setup(newData)
    }
var fail = function(data)
    {
        console.log("fail", data)
    }
dataPromise.then(success,fail)


var transformPen = function(classroom)
{
    var newData = classroom.map(changePen)
    return newData
}

var changePen = function(penguin)
{
    var quizList = penguin.quizes.map(getGrade)
    penguin.quizGrades = quizList
    return penguin
}

var getGrade = function(quiz)
{
    return quiz.grade
}

var setup = function(classroom)
{
    d3.select("svg")
      .attr("width",screen.width)
      .attr("height",screen.height)
      .append("g")
      .attr("id","graph")
      .attr("transform","translate("+margins.left+","+margins.top+")");
    
    var width = screen.width - margins.left - margins.right;
    var height = screen.height - margins.top - margins.bottom;
    console.log(margins.left)
    var xScale = d3.scaleLinear()
                   .domain([0,38])
                   .range([0,width])
    var yScale = d3.scaleLinear()
                    .domain([0,10])
                    .range([height,0])
    var xAxis = d3.axisBottom(xScale)
    var yAxis = d3.axisLeft(yScale)
    d3.select("svg")
      .append("g")
      .classed("axis",true)
    
    d3.select(".axis")
      .append("g")
      .attr("id","xAxis")
      .attr("transform","translate("+margins.left+","+(margins.top+height)+")")
      .call(xAxis)
    
    d3.select(".axis")
      .append("g")
      .attr("id","yAxis")
      .attr("transform","translate(25, "+margins.top+")")
      .call(yAxis)
    
    drawGraph(classroom, xScale, yScale)
}
 var createImage = function(penguin)
{
    d3.select("div *").remove()
    d3.select("div")
      .append("img")
      .attr("src", function(){return "/penguins/" + penguin.picture})
}

var drawGraph = function(classroom, xScale, yScale)
{
    var arrays = d3.select("#graph")
                   .selectAll("g")
                   .data(classroom)
                   .enter()
                   .append("g")
                   .attr("fill","none")
                   .attr("stroke","black")
                   .attr("stroke-width", 3)
                   .attr("class","line")
                   .on("click", function(d,index)
                    {
                        createImage(classroom[index])

console.log(classroom[index])
                    })
    var lineGenerator = d3.line()
                          .x(function(num,index){return xScale(index)})
                          .y(function(num){return yScale(num)})
                          .curve(d3.curveNatural)
    arrays.datum(function(obj){return obj.quizGrades})
          .append("path")
          .attr("d",lineGenerator)

}