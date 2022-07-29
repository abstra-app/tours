init("Criando seu primeiro form", [
	{
		selector: "main article h1",
		type: "click-overlay",
		position: 'top-right',
		hint: "Hello World!"
	},
	{
		selector: "#content > article > section:nth-child(5) > div > p:nth-child(5)",
		type: "click-overlay",
		position: 'bottom-left',
		hint: "Foooooo"
	}
])
