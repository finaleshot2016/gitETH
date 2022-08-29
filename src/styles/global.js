const global = (theme) => ({
  '*, *::before, *::after': {
    boxSizing: 'border-box',
  },

  body: {
    overflowX: 'hidden',
    backgroundImage: 'url("https://i.imgur.com/7jNwKPx.jpg")',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroudnPosition: 'center',
    color: theme.colors.white[0],
    fontFamily: theme.fontFamily,
  },
});

export default global;
