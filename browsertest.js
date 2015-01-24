var Demo = require('./demo');

document.addEventListener("DOMContentLoaded", function (event) {
	console.log('as');
	var input = document.getElementById('fileinput');
	input.onchange = handleFileSelect;
});

function handleFileSelect(evt) {
	var files = evt.target.files; // FileList object

	// Loop through the FileList and render image files as thumbnails.
	for (var i = 0, f; f = files[i]; i++) {

		var reader = new FileReader();

		// Closure to capture the file information.
		reader.onload = (function (theFile) {
			return function (buffer) {
				console.log(buffer.target.result);
				var demo = new Demo(buffer.target.result);
				var parser = demo.getParser();
				var head = parser.readHeader();
				var state = parser.parseBody();
				document.getElementById('head').value = JSON.stringify(head, null, 2);
				document.getElementById('out').value = JSON.stringify(state, null, 2);
			};
		})(f);

		// Read in the image file as a data URL.
		console.log(f);
		reader.readAsArrayBuffer(f);
	}
}
