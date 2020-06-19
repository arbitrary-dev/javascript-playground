import * as ol from 'ol'
import Point from 'ol/geom/Point'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource, XYZ } from 'ol/source'
import { Circle, Fill, Stroke, Style} from 'ol/style'
import { fromLonLat } from 'ol/proj'

const DEF_ZOOM = 15

export class Map {

  constructor() {
    document.getElementById("map").innerHTML = ""
    this.map = new ol.Map({
      target: "map",
      layers: [
        new TileLayer({
          source: new XYZ({
            url: "https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          })
        })
      ],
      view: new ol.View({
        center: [0, 0],
        zoom: DEF_ZOOM
      })
    })
  }

  render(coords, text) {
    const view = this.map.getView()
    view.setCenter(fromLonLat([coords.lon, coords.lat]))
    view.setZoom(DEF_ZOOM)

    if (this.markerLayer)
      this.map.removeLayer(this.markerLayer)
    this.markerLayer = new VectorLayer({
      source: new VectorSource({
        features: [
          new ol.Feature({
            geometry: new Point(fromLonLat([coords.lon, coords.lat]))
          })
        ]
      }),
      style: new Style({
        image: new Circle({
          radius: 7,
          fill: new Fill({color: 'black'}),
          stroke: new Stroke({color: 'white', width: 2})
        })
      })
    })
    this.map.addLayer(this.markerLayer)

    if (this.hintOverlay)
      this.map.removeOverlay(this.hintOverlay)
    // TODO add a popup
  }
}
