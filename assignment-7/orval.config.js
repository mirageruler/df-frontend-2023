module.exports = {
    'bookstore-file': {
      input: 'https://develop-api.bookstore.dwarvesf.com/swagger/doc.json',
      output: {
        mode: 'tags-split',
        target: 'src/_generated/bookstore.ts',
        schemas: 'src/_generated/model',
        client: 'swr',
        mock: true,
        override: {
          mutator: {
            path: 'src/_libs/custom-instance.ts',
            name: 'customInstance',
          },
        },
      },
    },
};
