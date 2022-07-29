function bolinhaStyle(position) {
	return position.split('-').reduce((acc, curr) => ({
		...acc,
		[curr]: '-16px'
	}), {
		position: 'absolute',
		backgroundColor: 'green',
		width: '32px',
		height: '32px',
		borderRadius: '50%',
		pointerEvents: 'initial'
	})
}

async function findElement(selector) {
	return new Promise((resolve, reject) => {
		const interval = setInterval(() => {
			const element = document.querySelector(selector);
			if (element) {
				resolve(element);
				clearInterval(interval);
			}
		}, 100);

		setTimeout(() => {
			reject()
		}, 3000);
	})
}

function renderClickOverlay(step) {
	return new Promise(async resolve => {
		const element = await findElement(step.selector);
		const highlight = document.createElement("div");
		const bolinha = document.createElement("div");
		bolinha.setAttribute("title", step.hint);
		document.body.appendChild(highlight);
		highlight.appendChild(bolinha);

		const interval = setInterval(() => {
			const { x, y, width, height} = element.getBoundingClientRect();
			Object.assign(highlight.style, {
				position: 'fixed',
				left: `${x}px`,
				top: `${y}px`,
				width: `${width}px`,
				height: `${height}px`,
				backgroundColor: 'rgba(255,0,0,0.1)',
				pointerEvents: 'none'
			});

			Object.assign(bolinha.style, bolinhaStyle(step.position))
		}, 1000/60)

		function next() {
			highlight.remove();
			clearInterval(interval);
			resolve();
		}
		element.addEventListener("click", next);
		bolinha.addEventListener("click", next);
	})
}

function render(step) {
	switch (step.type) {
		case 'click-overlay': return renderClickOverlay(step);
		case 'tooltip': throw new Error("Not implemented");
		default: throw new Error("Invalid type");
	}
}

async function init(name, steps) {
	for (const step of steps) {
		await render(step)
	}
}

