/*
  Copyright 2019 Esri
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { loadModules } from 'esri-loader';

import { MapStateService } from '../services/map-state.service';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})

export class EsriMapComponent implements OnInit {

  public mapView: __esri.MapView;


  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(private msService: MapStateService) {}

  public ngOnInit() {
    // use esri-loader to load JSAPI modules
    return loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/Graphic',
      'esri/tasks/QueryTask',
      'esri/tasks/support/Query',
    ])
      .then(([
        Map,
        MapView,
        Graphic,
        QueryTask,
        Query
      ]) => {
        const map: __esri.Map = new Map({
          basemap: 'hybrid'
        });

        // this.mapView = new MapView({
        //   container: this.mapViewEl.nativeElement,
        //   center: [-12.287, -37.114],
        //   zoom: 12,
        //   map
        // });

        // this.mapView.when(
        //   () => {
        //     if (this.msService.points.length) {
        //       // add any point graphics stored in the MapStateService
        //       // from the user's clicks from previous navigations to this app route
        //       this.mapView.graphics.addMany(this.msService.points);
        //     }
        //   },
        //   (err) => {
        //     console.log(err);
        //   }
        // );

        // this.mapView.on('click', (event: __esri.MapViewClickEvent) => {
        //   const pointGraphic: __esri.Graphic = new Graphic({
        //     geometry: {
        //       type: 'point',
        //       longitude: event.mapPoint.longitude,
        //       latitude: event.mapPoint.latitude,
        //       spatialReference: event.mapPoint.spatialReference
        //     },
        //     symbol: {
        //       type: 'simple-marker',
        //       color: [119, 40, 119],
        //       outline: {
        //         color: [255, 255, 255],
        //         width: 1
        //       }
        //     }
        //   });

        //   this.msService.addPoint(pointGraphic);
        //   this.mapView.graphics.add(this.msService.points[this.msService.points.length - 1]);
        // });


        let urlProvinceFS = 'http://gis.telkom.co.za/arcgis/rest/services/Covid/Covid_Province/FeatureServer/0';
        let ProvCode = 'GT';
        // let ProvName = e.target.text;
        let queryTask = new QueryTask({
          url: urlProvinceFS
        });
        var query = new Query();
        query.returnGeometry = true;
        query.outFields = ['*'];
        if (ProvCode !== 'NAT') {
          query.where = 'PR_MDB_C = \'' + ProvCode + '\'';
        } else {
          query.where = 'PR_MDB_C like \'%\'';
        }

        // When resolved, returns features and graphics that satisfy the query.
        queryTask.execute(query).then(function(results) {
          // debugger;
          // this.mapView.extent = results.features[0].geometry.extent;
          results.features[0].geometry.extent;
          debugger;
          this.mapView = new MapView({
            container: this.mapViewEl.nativeElement,
            center: [results.features[0].geometry.extent.latitude, results.features[0].geometry.extent.longitude],
            zoom: 12,
            map
          });
          debugger;
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
}
