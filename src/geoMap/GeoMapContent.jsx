import React from 'react';
import { findDOMNode } from 'react-dom';
import Highcharts from 'highcharts/highmaps';
import drilldow from 'highcharts/modules/drilldown';
import dataModule from 'highcharts/modules/data';
import $ from 'jquery';
import _ from 'lodash';

import mapDataUs from './Maps/mapDataUS';
import countyData from './Maps/countyData';
import mapData from './Maps/mapData';
import dmaData from './Maps/dma';
import sample from './Maps/sample';
import MapChart from './map';


// Load Highcharts modules
require('highcharts/indicators/pivot-points.js')(Highcharts);
require('highcharts/indicators/macd.js')(Highcharts);
require('highcharts/modules/map.js')(Highcharts);


drilldow(Highcharts);
dataModule(Highcharts);

let data = mapDataUs;
data.forEach((el, i) => {
  el.drilldown = el.properties['hc-key'];
  if (el.name === 'SouthWest') {
    // el.value = 50;
  } else {
    el.value = i;
  }
  // el.value = i; // Non-random bogus data
});

window.Highcharts = Highcharts;

const options = {
  chart: {
    events: {
      drilldown: function drill(e) {
        if (!e.seriesOptions) {
          let chart = this,
            mapKey = `countries/us/${e.point.drilldown}-all`,
            // Handle error, the timeout is cleared on success
            fail = setTimeout(() => {
              if (!Highcharts.maps[mapKey]) {
                chart.showLoading(
                  `<i class="icon-frown"></i> Failed loading ${e.point.name}`
                );
                fail = setTimeout(() => {
                  chart.hideLoading();
                }, 1000);
              }
            }, 3000);

          // Show the spinner
          chart.showLoading('<i class="icon-spinner icon-spin icon-3x"></i>'); // Font Awesome spinner

          // Load the drilldown map
          $.getScript(
            `https://code.highcharts.com/mapdata/${mapKey}.js`,
            () => {
              // Highcharts.maps[mapKey] = countyData;
              data = Highcharts.geojson(Highcharts.maps[mapKey]);
              // data = Highcharts.geojson(countyData);
              // Set a non-random bogus value
              $.each(data, function (i) {
                this.value = i;
              });

              // Hide loading and add series
              chart.hideLoading();
              clearTimeout(fail);
              chart.addSeriesAsDrilldown(e.point, {
                name: e.point.name,
                data,
                dataLabels: {
                  enabled: false,
                  format: '{point.name}',
                },
              });
            }
          );
        }

        this.setTitle(null, { text: e.point.name });
      },
      drillup() {
        this.setTitle(null, { text: '' });
      },
    },
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    enabled: false,
  },

  // colorAxis: {
  //   min: 0,
  //   minColor: '#E6E7E8',
  //   maxColor: '#005645',
  // },
  colorAxis: {
    dataClasses: [{
      from: 0,
      to: 20,
      color: '#0059b3',
    }, {
      from: 20,
      to: 50,
      color: '#006600',
    }, {
      from: 50,
      to: 100,
      color: '#e67300',
    }, {
      from: 100,
      color: '#009999',
    }],
  },

  mapNavigation: {
    enabled: false,
    buttonOptions: {
      verticalAlign: 'bottom',
    },
  },

  plotOptions: {
    map: {
      states: {
        hover: {
          color: '#EEDD66',
        },
      },
    },
  },
  series: [
    {
      data,
      name: 'USA',
      // dataLabels: {
      //   enabled: true,
      //   format: "{point.properties.postal-code}"
      // },
      joinBy: 'labelrank',
    },
    // {
    //   type: 'mapline',
    //   data: separators,
    //   color: 'silver',
    //   enableMouseTracking: false,
    //   animation: {
    //     duration: 500,
    //   },
    // },
  ],

  drilldown: {
    activeDataLabelStyle: {
      color: '#FFFFFF',
      textDecoration: 'none',
      textOutline: '1px #000000',
    },
    drillUpButton: {
      relativeTo: 'spacingBox',
      position: {
        x: 0,
        y: 60,
      },
    },
  },
  //   mapNavigation: {
  //       enabled: false,
  //     },
  // legend: {
  //       enabled: false,
  //       align: 'right',
  //       verticalAlign: 'middle'
  //     },
};

const mapOptions = {
  title: {
    text: '',
  },
  colorAxis: {
    min: 0,
    stops: [
      [0, '#EFEFFF'],
      [0.67, '#4444FF'],
      [1, '#000022'],
    ],
  },
  tooltip: {
    pointFormatter() {
      // return this.properties['woe-label'].split(',')[0];
    },
  },
  legend: {
    layout: 'vertical',
    align: 'right',
    verticalAlign: 'middle',
    enabled: false,
  },
  series: [{
    mapData: dmaData,
    dataLabels: {
      formatter() {
        // return this.point.properties['woe-label'].split(',')[0];
      },
    },
    name: 'United States of America',
    data: [

    ],
  }],
};

class GeoMapContentScreen extends React.Component {
  
  componentDidMount() {
    ///* If React Version < 16
    this.chart = new Highcharts.Map(findDOMNode(this), options);
    // document.getElementsByClassName('highcharts-credits')[0].style.visibility =
    //   'hidden';
    document.getElementsByClassName('highcharts-credits')[0].style.display = 'none';
  }
  componentDidUpdate() {
    // document.getElementsByClassName('highcharts-credits')[0].style.visibility =
    //   'hidden';
    document.getElementsByClassName('highcharts-credits')[0].style.display = 'none';
  }
  componentWillUnmount() {
    // this.chart.destroy();
  }


  render() {
    return (<div className="">
      {/* If React Version > 16
        <MapChart options={options} highcharts={Highcharts} /> 
      */
     }

    </div>
    );
  }
}

export default GeoMapContentScreen;
