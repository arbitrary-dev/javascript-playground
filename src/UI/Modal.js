export class Modal {

  constructor(id) {
    this.contentTempl = document.getElementById(id)
    this.modalTempl = document.getElementById('modal-template')
  }

  show() {
    if ('content' in document.createElement('template')) {
      const wrapper = document.importNode(this.modalTempl.content, true)
      this.modal = wrapper.querySelector('.modal')
      this.backdrop = wrapper.querySelector('.backdrop')
      const content = document.importNode(this.contentTempl.content, true)

      this.modal.appendChild(content)

      document.body.insertAdjacentElement('afterbegin', this.modal)
      document.body.insertAdjacentElement('afterbegin', this.backdrop)
    } else {
      alert("Templating is not supported in this browser!")
    }
  }

  hide() {
    if (this.modal) {
      document.body.removeChild(this.modal)
      this.modal = null
      document.body.removeChild(this.backdrop)
      this.backdrop = null
    }
  }
}
