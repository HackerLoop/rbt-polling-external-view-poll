const path = require('path');
const express = require('express');

const app = express();

app.use(express.static(path.join(__dirname, './dist')));

const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log(`rbt-overlay listening on port ${PORT}`)
})
