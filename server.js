const express = require('express');
const app = express();
const PORT = 3013;

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
