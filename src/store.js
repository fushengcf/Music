const STORAGE_KEY = 'zhx'

export default {

  fetch: function () {
    return window.JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
  },
  save: function (item) {
    window.localStorage.setItem(STORAGE_KEY, window.JSON.stringify(item))
  },
  clear: function () {
    window.localStorage.removeItem(STORAGE_KEY)
  }
}
