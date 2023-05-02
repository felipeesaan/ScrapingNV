const puppeteer = require('puppeteer');
const fs = require("fs");
const {
    title
} = require('process');


(async () => {
    const browser = await puppeteer.launch({
        //headless: false
    });
    const page = await browser.newPage();
    //CAMBIAR URL COMPLETA SIN "START"
    await page.goto('https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d2660587-Reviews-Sonora_Al_Sur-Nuevo_Vallarta_Pacific_Coast.html');
    await page.addScriptTag({
        url: 'https://code.jquery.com/jquery-3.2.1.min.js'
    });


    //titulo del negocio
    const titlePage = await page.evaluate(async () => {
        var $ = window.$;
        try {
            return $('h1.fHibz').text()
        } catch (error) {

        }


    })

    console.log("Titulo del negocio: " + titlePage);
    //SIEMPRE INICIA EN LA PAGINA 0
    var start = 0;
    //FIN ES EL NUMERO TOTAL DE PAGINAS -1
    var fin = 73;
    var datosReview = [];
    for (let inicio = 0; inicio <= fin; inicio++) {

        //CAMBIAR ENLACE RESPETANDO EL FORMATO
        //let link = 'https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d1116494-Reviews-or' + start + '-Eddie_s_Place_Nopal_Beach-Nuevo_Vallarta_Pacific_Coast.html#REVIEWS';
        let link = 'https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d2660587-Reviews-or'+start+'-Sonora_Al_Sur-Nuevo_Vallarta_Pacific_Coast.html';



        start = start + 10;
        await page.goto(link);
        //await page.waitForTimeout(1500);
        await page.addScriptTag({
            url: 'https://code.jquery.com/jquery-3.2.1.min.js'
        });
        await page.waitForTimeout(1000);

        //obtener titulo de reseña 
        const reviewTitle = await page.$$eval('div.review-container', (msgs) => msgs.map((msg) => {
            try {
                var rTitle = msg.querySelector('span.noQuotes').innerText;
                if (rTitle) {
                    return rTitle
                } else {
                    return "NO DATA"
                }
            } catch (error) {
                return "no se pudo capturar review title"
            }


        }));


        console.log("comenzando pagina ", inicio + 1, " de ", fin + 1);
        const btnReviewsReadMore = await page.$$('span.taLnk.ulBlueLinks')
        //click en botones read more en criticas largas
        if (btnReviewsReadMore) {
            try {
                btnReviewsReadMore[0].click()
                await page.waitForTimeout(1000);
            } catch {
                console.log("error: btn leer mas no existe");
            }

        }

        await page.waitForTimeout(1000);



        //obtener reseña 
        const reviewEntry = await page.$$eval('div.review-container', (msgs) => msgs.map((msg) => {
            var contentReview = msg.querySelector('p.partial_entry').innerText;
            if (contentReview) {
                return contentReview
            } else {
                return "NO DATA"
            }
        }));

        //obtener fecha de reseña
        const reviewDate = await page.$$eval('div.review-container', (msgs) => msgs.map((msg) => {
            try {
                var rDate = msg.querySelector('span.ratingDate').title
                if (rDate) {
                    return rDate
                } else {
                    return "Dato no disponible"
                }
            } catch (error) {
                return "Dato no disponible"
            }

        }));

        //obtener fecha de visita al restaurant
        const reviewStayDate = await page.$$eval('div.review-container', (msgs) => msgs.map((msg) => {
            try {
                var stayDate = msg.querySelector('div.prw_rup.prw_reviews_stay_date_hsx').innerText
                if (stayDate) {
                    var stayDate = stayDate.split(":")
                    stayDate = stayDate[1]
                    return stayDate
                } else {
                    return "Dato no disponible"
                }
            } catch (error) {
                return "dato no disponible"
            }


        }));


        //obtiene la calificacion
        const reviewScore = await page.$$eval('div.review-container', (msgs) => msgs.map((msg) => {
            try {
                let calificacion = msg.querySelector('span.ui_bubble_rating').classList
                if (calificacion) {
                    calificacion = calificacion[1]
                    if (calificacion === "bubble_50") {
                        calificacion = 5
                    } else if (calificacion === "bubble_40") {
                        calificacion = 4
                    } else if (calificacion === "bubble_30") {
                        calificacion = 3
                    } else if (calificacion === "bubble_20") {
                        calificacion = 2
                    } else if (calificacion === "bubble_10") {
                        calificacion = 1
                    } else {
                        calificacion = "no hay calificacion"
                    }
                    return calificacion;
                } else {
                    return "NO DATA"
                }
            } catch (error) {
                return "dato no disponible"
            }



        }));
        //cuadro de perfil que funciona como boton para la info del autor
        const buttons = await page.$$('div.member_info')
        if (buttons) {
            try {
                await buttons[0].click();
            } catch {
                console.log("error");
            }
        }
        //console.log(reviewsList.length);
        await page.waitForTimeout(1000);
        for (let index = 0; index < buttons.length; index++) {
            console.log("reseña capturada ", inicio, index + 1);
            if (index > 0) {
                try {
                    await buttons[index].click();
                } catch (error) {
                    console.log("no se pudo hacer click en el boton")
                }

            }
            await page.waitForTimeout(2000);
            var name = await page.evaluate(async () => {
                var $ = window.$
                try {
                    return $('.username.reviewsEnhancements').text()
                } catch (error) {
                    return "no disponible"
                }
            })
            var city = await page.evaluate(async () => {
                var $ = window.$
                try {
                    var cty = $('.memberdescriptionReviewEnhancements li:last-child').text()

                    if (cty.includes("Miembro de Tripadvisor desde")) {
                        return "Dato no dispomible"
                    } else {
                        return cty
                    }
                } catch (error) {
                    return "no disponible"
                }

            })

            datosReview.push({
                "Autor": name,
                "Ciudad": city,
                "Puntaje": reviewScore[index],
                "Fecha de visita": reviewStayDate[index],
                "Fecha de reseña": reviewDate[index],
                "Titulo de reseña": reviewTitle[index],
                "Reseña": reviewEntry[index]
            })
            if (buttons.length > 0) {
                try {
                    await buttons[index].click();
                } catch {
                    console.log("error al clickear perfil")
                }
            }

            await page.waitForTimeout(2000);
        }
    }

    const testlistJson = JSON.stringify(datosReview);
    fs.writeFileSync("restaurantes/" + titlePage + ".json", testlistJson, "utf8");

    await browser.close();
})();