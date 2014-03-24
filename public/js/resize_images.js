// Once files have been selected
document.querySelector('form input[type=file]').addEventListener('change', function(event){

	// Read files
	var files = event.target.files;

	// Iterate through files
	for (var i = 0; i < files.length; i++) {

		// Ensure it's an image
		if (files[i].type.match(/image.*/)) {

			// Load image
			var reader = new FileReader();
			reader.onload = function (readerEvent) {
				var image = new Image();
				image.onload = function (imageEvent) {

					// Resize image
					var canvas = document.createElement('canvas'),
						max_size = 1200,
						width = image.width,
						height = image.height;
					if (width > height) {
						if (width > max_size) {
							height *= max_size / width;
							width = max_size;
						}
					} else {
						if (height > max_size) {
							width *= max_size / height;
							height = max_size;
						}
					}
					canvas.width = width;
					canvas.height = height;
					canvas.getContext('2d').drawImage(image, 0, 0, width, height);
				}

				image.src = readerEvent.target.result;
                // Add elemnt to page
				var imageElement = document.createElement('div');
				imageElement.innerHTML = '< class="progress"><span>Image Added</span></span>';
				document.querySelector('form div.photos').appendChild(imageElement);


			}
			reader.readAsDataURL(files[i]);
		}

	}

	// Clear files
	event.target.value = '';

});
