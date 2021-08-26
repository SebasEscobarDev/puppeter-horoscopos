"use strict";

const puppeteer = require('puppeteer');


(async () => {
	const browser = await puppeteer.launch({headless:true});
	const page = await browser.newPage();

	//await page.goto('https://www.20minutos.es/horoscopo/');
	//await page.click('#didomi-notice-agree-button')

	//await page.waitForSelector('#content > ul > li.item.aries > a:nth-child(5)')

	const d = new Date();


/*
	const signos = [
		"aries",
		"tauro",
		"geminis",
		"cancer",
		"leo",
		"virgo",
		"libra",
		"escorpio",
		"sagitario"
	];
	*/

	//const signos = ["sagitario"]

	const signos = ["aries",
						"tauro",
						"geminis",
						"cancer",
						"leo",
						"virgo",
						"libra"];

	const signos2 = [
		"escorpio",
		"sagitario",
		"capricornio",
		"acuario",
		"piscis"
		];

	//Format FECHA JavaScript
	const today = new Date()
	const year = today.getFullYear()
	const month = `${today.getMonth() + 1}`.padStart(2, "0")
	const day = `${today.getDate()}`.padStart(2, "0")
	const stringDate = [day, month, year].join("/") 

	const links = [];

	for (var i=0; i < signos.length;i++) {
		links.push("https://www.20minutos.es/horoscopo/solar/prediccion/"+signos[i]+"/"+stringDate+"/");
	}


	//await page.screenshot({path: 'prueba1.jpg'});

	const predicciones = [];

	for ( var enlace of links ){
		await page.goto(enlace);
		page.waitForSelector(".prediction p:nth-of-type(3)");
		const prediccion = await page.evaluate(()=>{
			const tmp = {};
			tmp.signo = document.querySelector('.prediction h2').innerText;
			tmp.prediccion = document.querySelector('.prediction p:nth-of-type(3)').innerText;
			return tmp;
		});
		predicciones.push(prediccion);

	}

	console.log(predicciones);


/*
	const url = 'https://localhost:8000/api/horoscopo/create';

	const axios = require('axios');
	// Send a POST request
	axios({
	  method: 'post',
	  url: url,
	  data: predicciones,
	  headers: {
	  	mode : 'no-cors'
	  }
	});
	*/


	await browser.close();

})();