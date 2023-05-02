


'use strict'
const puppeteer = require('puppeteer');
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch({
    //headless: false
  });
  const page = await browser.newPage();
  var start = 0;
  var data = [];
  let link = 'https://www.tripadvisor.com.mx/Hotel_Review-g154267-d1725906-Reviews-Marival_Emotions_Resort_Suites-Nuevo_Vallarta_Pacific_Coast.html';
  await page.goto(link);
  //titulo del hotel
  await page.waitForSelector('#HEADING');
  const titlePage = await page.evaluate(() => {

    return document.getElementById("HEADING").innerText;

  });

  const description = await page.$$eval('._2f_ruteS._1bona3Pu._2-hMril5', (msgs) => msgs.map((msg) => {

    return msg.querySelector('.cPQsENeY').innerHTML
  }));

  const ubicacion = await page.$$eval('._1lV02aLs', (msgs) => msgs.map((msg) => {

    return msg.querySelector('span._3ErVArsu').innerText
  }));

  var reviews = [];
  for (let index = 0; index <=888 ; index++) {

    let link = 'https://www.tripadvisor.com.mx/Hotel_Review-or'+start+'-g154267-d1725906-Reviews-Marival_Emotions_Resort_Suites-Nuevo_Vallarta_Pacific_Coast.html';
    start = start + 5;
    await page.goto(link);
    await page.addScriptTag({ url: 'https://code.jquery.com/jquery-3.2.1.min.js' });

    var motivo;
    var origen;
    var autor;
    var tituloR;
    var resena;
    var calificacion;
    var fecha_resena;
    var fecha_hospedad;
    
    const dataReview = await page.$$eval('.cWwQK.MC.R2.Gi.z.Z.BB.dXjiy', (msgs) => msgs.map((msg) => {
      var $ = window.$;
      $('span.eljVo._S.Z').click()
      if (msg.querySelector('.eHSjO._R.Me')){
        motivo = msg.querySelector('.eHSjO._R.Me').innerText;
        motivo = motivo.split(":");
        motivo = motivo[1].slice(1);
        
      } else {
        motivo = "no hay"
        console.log("Motivo del viaje no encontrado")
      }
      if (msg.querySelector('span.default.ShLyt.small')){
        origen = msg.querySelector('span.default.ShLyt.small').innerText;
      } else {
        origen = "no hay";
        console.log("Lugar de origen del reseñador no encontrado")
      }
      let xddd = msg.querySelector('a.ui_header_link').innerHTML;
      console.log(xddd)
      if (msg.querySelector('a.ui_header_link')){
        autor = msg.querySelector('a.ui_header_link').innerText
      } else {
        console.log("Autor no encontrado")
        autor = "no hay autor";
        
      }

      if (msg.querySelector('.fCitC')) {
        tituloR = msg.querySelector('.fCitC').innerText
      } else {
        tituloR = "no hay titulo"
        console.log("Titulo de reseña no encontrada")

      }
      if (msg.querySelector('.bcaHz')) {
        fecha_resena = msg.querySelector('.bcaHz').innerText
        fecha_resena = fecha_resena.split("(");
        fecha_resena = fecha_resena[1].slice(0,-1);
      } else{
        fecha_resena = "no hay fecha de reseña"
        console.log("Fecha de reseña no encontrada")
      }
      if (msg.querySelector('.XllAv')) {
        resena = msg.querySelector('.XllAv').innerText
      } else {
        resena = "no hay reseña"
        console.log("Reseña no encontrada")
      }

      if (msg.querySelector('.ui_bubble_rating')) {
        calificacion = msg.querySelector('.ui_bubble_rating').className
        if (calificacion === "ui_bubble_rating bubble_50"){
          calificacion = 5;
        } else if (calificacion === "ui_bubble_rating bubble_40") {
          calificacion = 4;
        } else if (calificacion === "ui_bubble_rating bubble_30") {
          calificacion = 3;
        } else if (calificacion === "ui_bubble_rating bubble_20") {
          calificacion = 2;
        } else if (calificacion === "ui_bubble_rating bubble_10") {
          calificacion = 1;
        } 
      } else{
        calificacion = "no hay calificacion"
        console.log("Calificacion de reseña no encontrada")
      }
      if (msg.querySelector('.euPKI._R.Me.S4.H3')) {
        fecha_hospedad = msg.querySelector('.euPKI._R.Me.S4.H3').innerText;
        var fecha_hospedad = fecha_hospedad.split(":");
        //Pendiente quitar el espacio en la fecha hospedada
        fecha_hospedad = fecha_hospedad[1].slice(1);
      } else{
        fecha_hospedad = "no hay fecha hospedada"
        console.log("Fecha hospedada no encontrada")
      }

      return {

        Autor: autor,
        Titulo: tituloR,
        Fecha_Reseña: fecha_resena,
        Calificacion: calificacion,
        Reseña: resena,
        Fecha_hospedada: fecha_hospedad,
        Motivo_viaje: motivo,
        Origen_de_visita: origen
      }
    }));
    console.log("progreso " , index , " de 887"  )
    reviews.push(dataReview);
  }
  data.push({
    "title": titlePage,
    "descripcion": description,
    "ubicacion" : ubicacion,
    "reseñas" : reviews
  });
  
  const testlistJson = JSON.stringify(data);
  fs.writeFileSync("hoteles/"+titlePage+".json", testlistJson, "utf8");

  await browser.close();

})();


