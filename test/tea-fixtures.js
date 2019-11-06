function makeTeaArray() {
    return [
        {
            id: 1,
            year: 2019,
            name: 'test tea 1',
            vendor: 'test vendor',
            quantity: 400,
            cost: 50,
            link: 'https://crimsonlotustea.com/',
            collectionid: 1,
        },
        {
            id: 2,
            year: 2006,
            name: 'test tea 2',
            vendor: 'test vendor 2',
            quantity: 357,
            cost: 120,
            link: 'https://crimsonlotustea.com/',
            collectionid: 2,
        },
        {
            id: 3,
            year: 2014,
            name: 'test tea 3',
            vendor: 'test vendor',
            quantity: 100,
            cost: 35,
            link: 'https://crimsonlotustea.com/',
            collectionid: 2,
        },
    ]
  }

  module.exports = {
    makeTeaArray,
  }