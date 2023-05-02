const puppeteer = require('puppeteer');
const fs = require("fs");
const {
    title
} = require('process');


(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    //CAMBIAR URL COMPLETA SIN "START"
    //await page.goto('https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d1951897-Reviews-Insu_Sky_Bar-Nuevo_Vallarta_Pacific_Coast.html');
    //await page.goto('https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d15115405-Reviews-Sabrosa_Italia-Nuevo_Vallarta_Pacific_Coast.html');
    //await page.goto('https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d15337144-Reviews-Maizul-Nuevo_Vallarta_Pacific_Coast.html');
    //await page.goto('https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d2027208-Reviews-La_Casona-Nuevo_Vallarta_Pacific_Coast.html');
    //await page.goto('https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d7811232-Reviews-Bistro_Bleu-Nuevo_Vallarta_Pacific_Coast.html');
    await page.addScriptTag({
        url: 'https://code.jquery.com/jquery-3.2.1.min.js'
    });


    //titulo del negocio
    const titlePage = await page.evaluate(async () => {
        var $ = window.$;


        return $('h1._3a1XQ88S').text()
    })
    //SIEMPRE INICIA EN LA PAGINA 0
    var start = 0;
    //FIN ES EL NUMERO TOTAL DE PAGINAS -1
    var fin = 28;
    var datosReview = [];
    for (let inicio = 0; inicio <= fin; inicio++) {

        //CAMBIAR ENLACE RESPETANDO EL FORMATO
        //var link = "https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d9974571-Reviews-or" + start + "-Samba-Nuevo_Vallarta_Pacific_Coast.html"
        //var link = "https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d1951897-Reviews-or" + start + "-Insu_Sky_Bar-Nuevo_Vallarta_Pacific_Coast.html"
        //var link = "https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d15115405-Reviews-or" + start + "-Sabrosa_Italia-Nuevo_Vallarta_Pacific_Coast.html"
        //var link = "https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d15337144-Reviews-or" + start + "-Maizul-Nuevo_Vallarta_Pacific_Coast.html"
        //var link = "https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d2027208-Reviews-or" + start + "-La_Casona-Nuevo_Vallarta_Pacific_Coast.html"
        var link = "https://www.tripadvisor.com.mx/Restaurant_Review-g154267-d7811232-Reviews-or" + start + "-Bistro_Bleu-Nuevo_Vallarta_Pacific_Coast.html"

        start = start + 10;
        await page.goto(link);
        //await page.waitForTimeout(1500);
        await page.addScriptTag({
            url: 'https://code.jquery.com/jquery-3.2.1.min.js'
        });
        await page.waitForTimeout(1000);
        console.log("comenzando pagina ", inicio + 1, " de ", fin + 1);
        const btnReviewsReadMore = await page.$$('span.taLnk.ulBlueLinks')
        //click en botones read more en criticas largas
        if (btnReviewsReadMore) {
            try {
                btnReviewsReadMore[0].click()
                await page.waitForTimeout(1000);
            } catch {
                console.log("error");
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
            var rDate = msg.querySelector('span.ratingDate').title
            if (rDate) {
                return rDate
            } else {
                return "Dato no disponible"
            }
        }));

        //obtener fecha de visita al restaurant
        const reviewStayDate = await page.$$eval('div.review-container', (msgs) => msgs.map((msg) => {
            var stayDate = msg.querySelector('div.prw_rup.prw_reviews_stay_date_hsx').innerText
            if (stayDate) {
                var stayDate = stayDate.split(":")
                stayDate = stayDate[1]
                return stayDate
            } else {
                return "Dato no disponible"
            }


        }));


        //obtiene la calificacion
        const reviewScore = await page.$$eval('div.review-container', (msgs) => msgs.map((msg) => {

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
                await buttons[index].click();
            }
            await page.waitForTimeout(2000);
            var name = await page.evaluate(async () => {
                var $ = window.$
                return $('.username.reviewsEnhancements').text()
            })
            var city = await page.evaluate(async () => {
                var $ = window.$
                var cty = $('.memberdescriptionReviewEnhancements li:last-child').text()

                if (cty.includes("Miembro de Tripadvisor desde")) {
                    return "Dato no dispomible"
                } else {
                    return cty
                }

            })

            datosReview.push({
                "Autor": name,
                "Ciudad": city,
                "Puntaje": reviewScore[index],
                "Fecha de visita": reviewStayDate[index],
                "Fecha de reseña": reviewDate[index],
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
    fs.writeFileSync("restaurantes/"+titlePage + ".json", testlistJson, "utf8");

    await browser.close();
})();