// src/index.js

//Import section
import FusionCharts from 'fusioncharts/core';
import TimeSeries from 'fusioncharts/viz/timeseries';
import DataStore from 'fusioncharts/datastore';

//Add the div tag for the chart container
const myDiv = document.createElement('div');
myDiv.id = 'container';
document.body.appendChild(myDiv);

//Set up the schema for two table columns
let schema = [{
    "name": "Date",
    "type": "date",
    "format": "%-m/%-d/%Y %-I:%-M:%-S"
}, {
    "name": "Outflow of People",
    "type": "number"
}]

//main function read data and call renderPage
async function main() {
    //Get the data
    let response = await fetch('/UCIAPI');
    let text = await response.text();
    if (response.ok){        
        renderPage(text);
    }
    else {
        alert('Error reading data from ML repository');
    }
}

//Convert the UCI ML data to two column table and draw chart
//renders the html page when passed data as text
function renderPage(text){
    //Convert data to table
    var data = textToMatrix(text);
    //Draw teh chart with this data
    drawChart(data);
    
}

//convert text to matrix. The data read from UCI ML repository is comma separated
function textToMatrix(text){
    var matrix = [];
    var rows = text.split("\n");
    for(var i=0;i<rows.length;i++){
        var cols = rows[i].split(',');
        //7 is out flow in CalIt2.data
        if (cols.length > 1 && cols[0] == 7)
            var dataRow = [cols[1].concat(' ', cols[2]), parseInt(cols[3])]
            matrix.push(dataRow);
    }
    return matrix;
}

//Render the final chart
function drawChart(data){


    FusionCharts.addDep(TimeSeries);

    let fusionDataStore = new DataStore();
    let fusionTable = fusionDataStore.createDataTable(data, schema);

    window.charInstance = new FusionCharts({
        type: 'timeseries',
        renderAt: 'container',
        width: "90%",
        height: 650,
        dataSource: {
            data: fusionTable,
            caption: {
                text: 'Outflow Of People From CalIt2 Building At UCI, Source: UCI ML repository'
            }
        }
    });

    //Render the chart
    window.charInstance.render();
}

main();