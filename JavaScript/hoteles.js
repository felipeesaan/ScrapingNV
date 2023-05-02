'use strict'
const puppeteer = require('puppeteer');
const fs = require("fs");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  var start = 0;

  var data = [];

  //let link = 'https://www.tripadvisor.com.mx/Hotel_Review-g154267-d2045818-Reviews-Grand_Luxxe_at_Vidanta_Nuevo_Vallarta-Nuevo_Vallarta_Pacific_Coast.html';
  //let link = 'https://www.tripadvisor.com.mx/Hotel_Review-g154267-d283703-Reviews-Grand_Velas_Riviera_Nayarit-Nuevo_Vallarta_Pacific_Coast.html';
  //let link = 'https://www.tripadvisor.com.mx/Hotel_Review-g154267-d154718-Reviews-Hard_Rock_Hotel_Vallarta-Nuevo_Vallarta_Pacific_Coast.html';
  //let link = 'https://www.tripadvisor.com.mx/Hotel_Review-g154267-d154855-Reviews-Marival_Distinct_Luxury_Residences-Nuevo_Vallarta_Pacific_Coast.html';
  let link = 'https://www.tripadvisor.com.mx/Hotel_Review-g154267-d1725906-Reviews-Marival_Emotions_Resort_Suites-Nuevo_Vallarta_Pacific_Coast.html';
  //let link = 'https://www.tripadvisor.com.mx/Hotel_Review-g9723540-d214251-Reviews-Samba_Vallarta_All_Inclusive-Flamingos_Nuevo_Vallarta_Pacific_Coast.html';
  //let link = 'https://www.tripadvisor.com.mx/Hotel_Review-g9723540-d320513-Reviews-or2110-Villa_Del_Palmar_Flamingos_Beach_Resort_Spa_Riviera_Nayarit-Flamingos_Nuevo_Val.html';


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
  for (let index = 0; index <= 888; index++) { 

    let link = 'https://www.tripadvisor.com.mx/Hotel_Review-g154267-d1725906-Reviews-or'+start+'-Marival_Emotions_Resort_Suites-Nuevo_Vallarta_Pacific_Coast.html';
    
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
    
    const dataReview = await page.$$eval('[data-test-target="HR_CC_CARD"]', (msgs) => msgs.map((msg) => {
      var $ = window.$;
      $('span._3maEfNCR').click()
      if (msg.querySelector('._2bVY3aT5')){
        motivo = msg.querySelector('._2bVY3aT5').innerText;
        motivo = motivo.split(":");
        motivo = motivo[1].slice(1);
        
      } else {
        motivo = "no hay"
      }
      if (msg.querySelector('span._1TuWwpYf')){
        origen = msg.querySelector('span._1TuWwpYf').innerText;
      } else {
        origen = "no hay";
      }

      if (msg.querySelector('a._1r_My98y')){
        autor = msg.querySelector('a._1r_My98y').innerText
      } else {
        autor = "no hay autor";
      }

      if (msg.querySelector('.glasR4aX')) {
        tituloR = msg.querySelector('.glasR4aX').innerText
      } else {
        tituloR = "no hay titulo"
      }
      if (msg.querySelector('._2fxQ4TOx')) {
        fecha_resena = msg.querySelector('._2fxQ4TOx').innerText
        fecha_resena = fecha_resena.split("(");
        fecha_resena = fecha_resena[1].slice(0,-1);
      } else{
        fecha_resena = "no hay fecha de reseña"
      }
      if (msg.querySelector('._2f_ruteS')) {
        resena = msg.querySelector('._2f_ruteS').innerText
      } else {
        resena = "no hay reseña"
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
      }
      if (msg.querySelector('._34Xs-BQm')) {
        fecha_hospedad = msg.querySelector('._34Xs-BQm').innerText;
        var fecha_hospedad = fecha_hospedad.split(":");
        //Pendiente quitar el espacio en la fecha hospedada
        fecha_hospedad = fecha_hospedad[1].slice(1);
      } else{
        fecha_hospedad = "no hay fecha hospedada"
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
    console.log("progreso " , index , " de 1000"  )

    reviews.push(dataReview);

  }

  data.push({
    "title": titlePage,
    "descripcion": description,
    "ubicacion" : ubicacion,
    "reseñas" : reviews
  });
  
  const testlistJson = JSON.stringify(data);
  fs.writeFileSync("hoteles/"+titlePage+"2.json", testlistJson, "utf8");

  await browser.close();

})();
