var ge = elm => (typeof elm === "string" || elm instanceof String ? document.getElementById(elm) : elm)
var hookOnclick = (elm, func) => (ge(elm).onclick = func)
var ue = (elm, text) => (ge(elm).innerText = text)
var de = (elm, bool) => (ge(elm).style.display = bool ? "" : "none")
function resetValues(names) {
  let reference = getDefaultPlayer()
  names.forEach(function(name) {
    _.set(player, name, _.get(reference, name))
  })
}
