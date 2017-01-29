export default function elMap(callback) {
  return (el, $) => el.map((i, currDomEl) => callback($(currDomEl)));
}
