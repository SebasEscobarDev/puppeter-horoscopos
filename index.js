'use strict';

const puppeteer = require('puppeteer');
const express = require('express');
const morgan = require('morgan');
const app = express();

(async () => {
	const browser = await puppeteer.launch({headless:true});
	const page = await browser.newPage();
	const signos = [
		"aries","tauro","geminis","cancer","leo","virgo","libra","escorpio","sagitario","capricornio","acuario","piscis"
	];

	//Format FECHA JavaScript
	const today = new Date()
	const year = today.getFullYear()
	const month = `${today.getMonth() + 1}`.padStart(2, "0")
	const day = `${today.getDate()}`.padStart(2, "0")
	const stringDate = [day, month, year].join("/") 

	const enlaces = [];

	for (var i=0; i < signos.length;i++) {
		enlaces.push("https://www.20minutos.es/horoscopo/solar/prediccion/"+signos[i]+"/"+stringDate+ "/");
	}

	//await page.screenshot({path: 'prueba1.jpg'});

	const predicciones = [];
	for ( let enlace of enlaces ){
		await page.goto(enlace);
		await page.waitForSelector(".prediction p")
		const prediccion = await page.evaluate(()=>{
			const tmp = {};
			tmp.signo = document.querySelector('.prediction h2').innerText;
			var count = 0;
			do{
				count++;
				tmp.prediccion = document.querySelector('.prediction p:nth-of-type('+count+')').innerText;
			}while( tmp.prediccion == '' || tmp.prediccion.includes('2021') )
			return tmp;
		})
		predicciones.push(prediccion);
	}
	
	console.log(predicciones);
	app.set('predicciones', JSON.stringify(predicciones) );

	console.log('OHHH FUCKKKKING MASTERRRR!!!!')
	await browser.close();

	app.set('port', 5000);

	//compialdo de datos
	app.use(express.json());
	//log de peticiones
	app.use(morgan('dev'));
	//use view engine, fast ajax and html write
	app.set('view engine', 'ejs')

	//routes

	app.get('/', (req, res) => {
		const predicciones = app.get('predicciones');
		res.render('index.ejs', {predicciones: predicciones});
	})

	app.use(express.static('public'));

	app.listen(app.get('port'), () => {
		console.log('Server iniciado en puerto: '+app.get('port'));
	})
})();



