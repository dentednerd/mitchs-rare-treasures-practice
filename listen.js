const app = require('./app');

const PORT = 9090;

app.listen(PORT, () => {
  console.log(`server listening on PORT ${PORT}...`);
});
