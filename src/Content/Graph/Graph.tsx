

import React from 'react';
import './Graph.css';

import CanvasJSReact from '@canvasjs/react-charts';
 

 





export interface GraphProps {
    medicineClass: Array<Array<any>>
}
function Graph(props: GraphProps) {
    const medicineData = props.medicineClass;
    let data = new Array();
let name;
 
for (let sameMedicineGroup of medicineData) {
  	let priceList = new Array();
  	for (let medicineInstance of sameMedicineGroup) {
      	name = medicineInstance.name;
      	for (let sameMedicineGroup2 of medicineData) {
          	if (sameMedicineGroup2[0].name === name && 
                sameMedicineGroup2[0].gtin !== medicineInstance.gtin) {
             	name = name + ", " + medicineInstance.contents;
            }
        }
        priceList.push({
                x: new Date(medicineInstance.date),
                y: medicineInstance.price_per_unit
            });
        }
        data.push({
            type: "line",
            name: name,
            markerSize: 5,
            axisYType: "secondary",
            xValueFormatString: "DD.MM.YYYY",
            yValueFormatString: "#0.####\" zł\"",
            showInLegend: true,
            visible: true,
            dataPoints: priceList
        });
    }
    const options = {
        animationEnabled: true,
        title:{
            text: "Ceny leków na przestrzeni lat"  
        },
        axisX: {
            lineColor: "black",
            labelFontColor: "black",
            valueFormatString: "MM.YYYY"
        },
        axisY2: {
            gridThickness: 0,
            title: "Cena",
            suffix: " zł",
            titleFontColor: "black",
            labelFontColor: "black"
        },
        legend: {
            cursor: "pointer",
            itemmouseover: function(e:any) {
                e.dataSeries.lineThickness = e.chart.data[e.dataSeriesIndex].lineThickness * 2;
                e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize + 2;
                e.chart.render();
            },
            itemmouseout: function(e:any) {
                e.dataSeries.lineThickness = e.chart.data[e.dataSeriesIndex].lineThickness / 2;
                e.dataSeries.markerSize = e.chart.data[e.dataSeriesIndex].markerSize - 2;
                e.chart.render();
            },
            itemclick: function (e:any) {
                if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else {
                    e.dataSeries.visible = true;
                }
                e.chart.render();
            }
        },
        toolTip: {
            shared: true
        },
        data: data
    }
    const CanvasJSChart = CanvasJSReact.CanvasJSChart;
    return (
        <div className="graph">
            <CanvasJSChart options = {options} />
        </div>
    );
}
export default Graph;