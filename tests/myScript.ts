interface Truck {
  name: string;
  engines: string[];
}

export default async function (page) {
  await page.goto('https://somewebsite.com/');
  const trucksPageUrlList = await page
    .evaluate(async () => (
      [...document.querySelectorAll('#trucks a')]
        .map((truckLink) => truckLink.getAttribute('href'))
    ));
  const trucks: Truck[] = [];
  for (const truckUrl of trucksPageUrlList) {
    await page.goto(truckUrl);
    const truck = await page
      .evaluate(() => {
        const name = [...document.querySelectorAll('h1')][0].innerText;
        const engines = [...document.querySelectorAll('#engines ul li')]
          .map((engineLi) => engineLi.innerHTML);
        return {
          name,
          engines,
        };
      });
    trucks.push(truck);
  }
  return trucks;
}
