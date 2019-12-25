var ge = elm => (typeof elm === "string" || elm instanceof String ? document.getElementById(elm) : elm)
var hookOnclick = (elm, func) => (ge(elm).onclick = func)
var ue = (elm, text) => (ge(elm).innerText = text)
