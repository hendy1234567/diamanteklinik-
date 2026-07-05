const express = require('express');
const cors = require('cors');
const app = express();

const productRoutes = require('./routes/productRoutes');

const PORT = 2411; 

app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

app.use('/products', productRoutes);

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});