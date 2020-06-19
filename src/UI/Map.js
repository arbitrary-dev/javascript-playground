import * as ol from 'ol'
import Point from 'ol/geom/Point'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import { Vector as VectorSource, XYZ } from 'ol/source'
import { Circle, Fill, Stroke, Style} from 'ol/style'
import { fromLonLat } from 'ol/proj'

const DEF_ZOOM = 17

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

    const element = document.createElement('DIV')
    const closer = document.createElement('A')
    const content = document.createElement('DIV')

    element.appendChild(closer)
    element.appendChild(content)
    element.className = "ol-popup"
    closer.className = "ol-popup-closer"

    closer.onclick = () => {
      this.popupOverlay.setPosition(null)
      closer.blur()
      return false
    }

    this.popupOverlay = new ol.Overlay({
      element,
      autoPan: true,
      autoPanAnimation: {duration: 250}
    })

    this.map.addOverlay(this.popupOverlay)
  }

  render(coords, text) {
    const view = this.map.getView()
    const pos = fromLonLat([coords.lon, coords.lat])

    view.setCenter(pos)
    view.setZoom(DEF_ZOOM)

    if (this.markerLayer)
      this.map.removeLayer(this.markerLayer)

    const popup = this.popupOverlay
    const marker = new ol.Feature({geometry: new Point(pos)})

    this.map.on(
      'singleclick',
      (e) => {
        const fs = this.map.getFeaturesAtPixel(
          this.map.getPixelFromCoordinate(e.coordinate),
          {layerFilter: (l) => l === this.markerLayer}
        )
        if (fs.length == 1)
          popup.setPosition(fs[0].getGeometry().getCoordinates())
        else
          popup.setPosition(null)
      }
    )

    this.markerLayer = new VectorLayer({
      source: new VectorSource({
        features: [marker]
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

    popup.getElement().querySelector("div").textContent = text
    this.map.once(
      'postrender',
      () => popup.setPosition(marker.getGeometry().getCoordinates())
    )
  }
}
