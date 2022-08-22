import * as cheerio from 'cheerio'
import fetch from "node-fetch";
import * as fs from 'fs'

async function getSomeInfo () {

    const recipesList = [];
    let nextPage;

  try {
      let page = 1;

      let response = await fetch(`https://picantecooking.com/ua/recipes/page-${page}`);
      let body = await response.text();
      let $ = cheerio.load(body);

      const getData = (el) => {
          const img = 'https://picantecooking.com/ua/recipes/' + $(el).find('img').attr('src');
          const nameOfRec = $(el).find('h2').text();
          const textOfRec = $(el).find('p').text();
          const dataTime = $(el).find('.datetime').text();
          const path = 'https://picantecooking.com' + $(el).find('h2 a').attr('href');

          recipesList.push({
              nameOfRec,
              img,
              textOfRec,
              dataTime,
              path
          });
      }
      $('.recipes-list > .recipes-item').map((i, el) => {
          getData(el)
      });

    do {
        page++;
        let response = await fetch(`https://picantecooking.com/ua/recipes/page-${page}`);
        const body = await response.text();
        let $ = cheerio.load(body);

        $('.recipes-list > .modern-page-navigation').map((i, el) => {
            nextPage = $(el).find('.modern-page-next').attr('href')});

        $('.recipes-list > .recipes-item').map((i, el) => {

            getData(el)

        })
    } while (
        nextPage)


          fs.writeFile('recipes', JSON.stringify(recipesList), function (error) {
            if (error) {
                console.log('error');
            }
            console.log('SAVED');
        })

  }  catch (error) {
      console.log(error);
  }
}

getSomeInfo();