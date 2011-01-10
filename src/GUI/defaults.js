/** @include "index.js */

ModularGrid.GUI.defaults = {

	toggler: {
		style: {
			position: "absolute",
			right: '10px',
			top: '10px',
			'z-index': 1000
		},

		label: "Настройки сетки"
	},

	pane: {
		style: {
			position: "absolute",
			right: '10px',
			top: '35px',

			width: 'auto',
			height: 'auto',

			margin: '0',
			padding: '7px 5px',

			background: '#FFF',
			border: '2px solid #CCC',

			'z-index': 1000
		},

		labels: {
			guides: 'гайды <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + ;</span>',
			size: 'выберите размер (Shift + r)',
			grid: {
				all: 'сетка <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + \'</span>',
				font: 'шрифтовая <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + f</span>',
				vertical: 'вертикальная <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + v</span>',
				horizontal: 'горизонтальная <span style="color:#555;font-size:80%;margin-left:0.75em">Shift + h</span>'
			},
			image: 'изображение-макет <span style="color:#555;font-size:80%;margin-left:0.75em">Ctrl + \\</span>',
			opacity: 'прозрачность'
		}
	}

};