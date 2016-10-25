export default function elText() {
  return el => el.val() || el.text();
}
