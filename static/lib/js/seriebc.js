   var prediccion = [   
        [1589214037000, 10, 10],
        [1589818756000, 6, 10] // cambiar valores
    ],
    regresion = [
        [1586139016000, 2],
        [1589818756000, 8]
        ],
    observado = [
        [1586139016000, 3],
        [1586743816000, 3],
        [1587348616000, 5],
        [1587953416000, 2],
        [1588609237000, 4],
        [1589214037000, 10] //CAMBIAR fecha
    ];



Highcharts.chart('bajacalifornia', {

    title: {
        text: null
    },

    xAxis: {
        type: 'datetime',
        accessibility: {
            rangeDescription: 'Range: Jul 1st 2009 to Jul 31st 2009.'
        }
    },

    yAxis: {
        title: {
            text: null
        }
    },

    tooltip: {
        crosshairs: true,
        shared: true,
        valueSuffix: null
    },

    exporting: {
      enabled: false
    },

    series: [{
        name: 'Solicitudes de apoyo',
        data: observado,
        zIndex: 1,
        marker: {
            fillColor: 'white',
            lineWidth: 2,
            lineColor: Highcharts.getOptions().colors[0]
        }
    },
    {
        name: 'Linea de tendencia',
        data: regresion,
        zIndex: 1,
        lineColor: Highcharts.getOptions().colors[2],
        marker: {
            fillColor: 'white',
            lineWidth: 1,
            lineColor: Highcharts.getOptions().colors[2]
        }
    },
     {
        name: 'Valores pronosticados',
        data: prediccion,
        type: 'arearange',
        lineWidth: 0,
        linkedTo: ':previous',
        color: Highcharts.getOptions().colors[0],
        fillOpacity: 0.3,
        zIndex: 0,
        marker: {
            enabled: false
        }
    }]
});