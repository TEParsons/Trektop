/**
 * Match each input to an output using `for` attribute
 */
// Iterate through all outputs
for (let outp of document.getElementsByTagName("output")) {
  // Get list of corresponding input IDs from `for` attribute
  let ids = String(outp.htmlFor).split("+");
  // Iterate through all IDs
  for (let id of ids) {
    // Get input object from ID
    let inp = document.getElementById(id);
    // Either...
    if (inp && inp.hasAttribute("outputs")) {
      // ...append this output object to existing `outputs` attribute...
      inp.outputs.push(outp);
    } else if (inp) {
      // ...or create an `outputs` attribute containing this output object
      inp.outputs = [outp];
    } 
  }
}
