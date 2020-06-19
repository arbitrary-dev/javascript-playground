import { Modal } from "./UI/Modal"
import { Map } from "./UI/Map"
import axios from "axios"

class PlaceFinder {

  constructor() {
    const addressForm = document.querySelector("#place-data form")
    const locateBtn = document.getElementById("locate-btn")

    addressForm.addEventListener('submit', this.onSubmit.bind(this))
    locateBtn.addEventListener('click', this.onLocate.bind(this))
  }

  async onLocate() {
    const modal = new Modal('loading-modal-content')
    modal.show()
    await new Promise(r => setTimeout(r, 1000 * (1 + Math.random())))
    try {
      const result = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      )
      this.onCoordsReceived(
        result.coords.longitude,
        result.coords.latitude
      )
    } catch (error) {
      alert(
        `${error.message}\n\nNo location services for you, pal!\n\n` +
        "…but I can generate something randomly for you."
      )
      const lon = 24.1052 + Math.random() // 260 * Math.random() - 180
      const lat = 56.9496 + Math.random() // 180 * Math.random() - 90
      this.onCoordsReceived(lon, lat)
    } finally {
      modal.hide()
    }
  }

  onCoordsReceived(lon, lat) {
    const coords = { lon, lat }
    console.log(coords)
    if (!this.map)
      this.map = new Map()
    this.map.render(coords)
  }

  async onSubmit(e) {
    e.preventDefault()

    const address = encodeURIComponent(e.target.querySelector("input").value.trim())

    if (!address) {
      alert("Type address to look out first!")
      return
    }

    const modal = new Modal("loading-modal-content")
    modal.show()
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search.php?q=${address}&format=json`
    )
    modal.hide()

    const data = response.data
    console.log(data)
    if (data.length == 1) {
      const d = data[0]
      alert(d.display_name)
      this.onCoordsReceived(d.lon, d.lat)
    } else if (data.length > 1) {
      // TODO handle more results
    }
  }
}

new PlaceFinder()