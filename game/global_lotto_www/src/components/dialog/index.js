import DialogComponent from './Dialog';

const Dialog = {}

Dialog.install = (Vue) => {
  Vue.component('mydialog', DialogComponent)
}

export default Dialog