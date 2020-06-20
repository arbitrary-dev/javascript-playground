import { Modal } from "./UI/Modal"
import { Map } from "./UI/Map"
import * as L from "./Utils/Location"

const DEF_POPUP = "You are here!"

class PlaceFinder {

  constructor() {
    const addressForm = document.querySelector("#place-data form")
    const locateBtn = document.getElementById("locate-btn")

    addressForm.addEventListener('submit', this.onSubmit.bind(this))
    locateBtn.addEventListener('click', this.onLocate.bind(this))
  }

  onLocate() {
    const modal = new Modal('loading-modal-content')
    modal.show()
    new Promise(r => setTimeout(r, 1000 * (1 + Math.random())))
      .then(() => new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      ))
      .then(result =>
        L.getAddress({
          lon: result.coords.longitude,
          lat: result.coords.latitude,
        }))
      .then(data => {
        const { lon, lat, display_name } = data
        this.onCoordsReceived({lon, lat}, display_name)
      })
      .catch(error => {
        alert(
          `${error.message}\n\nNo location services for you, pal!\n\n` +
          "…but I can generate something randomly for you."
        )
        this.onCoordsReceived({
          lon: 24.1052 + Math.random(), // 260 * Math.random() - 180
          lat: 56.9496 + Math.random(), // 180 * Math.random() - 90
        })
      })
      .finally(() => modal.hide())
  }

  onCoordsReceived(coords, popup = DEF_POPUP) {
    if (!this.map)
      this.map = new Map()
    this.map.render(coords, popup)
  }

  async onSubmit(e) {
    e.preventDefault()

    const address = e.target.querySelector("input").value.trim()

    if (!address) {
      alert("Type address to look out first!")
      return
    }

    const modal = new Modal("loading-modal-content")
    modal.show()
    const data = await L.getCoords(address)
    modal.hide()

    if (data.length == 1) {
      const { lon, lat, display_name } = data[0]
      this.onCoordsReceived({lon, lat}, display_name)
    } else if (data.length > 1) {
      // TODO handle more results
    }
  }
}

new PlaceFinder()
