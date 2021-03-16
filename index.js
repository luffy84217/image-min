const fs = require('fs');
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');

const supportFormats = ['jpg', 'png', 'gif', 'svg'];

const readNames = path => {
	fs.readdir(path, (err, names) => {
		for (name of names) {
			if (new RegExp('.+\.' + supportFormats.join('|') + '|' + supportFormats.map(format => format.toUpperCase()).join('|') + '$').test(name)) {
				const destination = path.split('/').slice(1).join('/');
				imagemin([path + name], {
					destination: `build/${destination}`,
					plugins: [
						imageminMozjpeg({
							quality: 75
						}),
						imageminPngquant({
							quality: [0.6, 0.8]
						}),
						imageminGifsicle({
							optimizationLevel: 3
						}),
						imageminSvgo({
							plugins: [
								{removeViewBox: false}
							]
						})
					]
				}).then(files => {
					console.log(files[0].destinationPath + ' Optimized');
				});		
			} else {
				readNames(path + name + '/');
			}
		}
	});
}

readNames('images/');

