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
			guides: "гайды",
			image: "изображение-макет",
			size: "выберите размер",
			grid: {
				all: "сетка",
				font: "шрифтовая",
				vertical: "вертикальная",
				horizontal: "горизонтальная"
			},
			opacity: "прозрачность"
		}
	}

};