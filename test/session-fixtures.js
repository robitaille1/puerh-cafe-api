function makeSessionArray() {
    return [
        {
            id: 1,
            name: 'test tea 1',
            teaid: 1,
            quantity: 7,
            parameters: 'test parameters',
            notes: 'test tasting notes',
            rating: 3,
        },
        {
            id: 2,
            name: 'test tea 2',
            teaid: 2,
            quantity: 10,
            parameters: 'test parameters',
            notes: 'test tasting notes',
            rating: 4,
        },
        {
            id: 3,
            name: 'test tea 3',
            teaid: 3,
            quantity: 5,
            parameters: 'test parameters',
            notes: 'test tasting notes',
            rating: 5,
        },
    ]
  }

  module.exports = {
    makeSessionArray,
  }