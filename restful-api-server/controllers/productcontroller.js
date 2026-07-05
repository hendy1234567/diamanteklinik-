let products = [
  { id: 1, name: 'Laptop', category: 'Elektronik', price: 10000000 },
  { id: 2, name: 'Mouse', category: 'Elektronik', price: 150000 },
  { id: 3, name: 'Keyboard', category: 'Elektronik', price: 300000 },
  { id: 4, name: 'PC GAMING', category: 'Elektronik', price: 3000000 }
];

exports.getAllProducts = (req, res) => {
  res.json(products);
};

exports.getProductById = (req, res) => {
  const productId = parseInt(req.params.id);
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }
  res.json(product);
};

exports.createProduct = (req, res) => {
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
    name: req.body.name,
    category: req.body.category,
    price: req.body.price
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
};

exports.updateProduct = (req, res) => {
  const index = products.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Produk tidak ditemukan' });

  products[index] = {
    ...products[index],
    name: req.body.name || products[index].name,
    category: req.body.category || products[index].category,
    price: req.body.price || products[index].price
  };

  res.json(products[index]);
};

exports.deleteProduct = (req, res) => {
  const initialLength = products.length;
  products = products.filter(p => p.id !== parseInt(req.params.id));
  
  if (products.length === initialLength) {
    return res.status(404).json({ message: 'Produk tidak ditemukan' });
  }

  res.json({ message: 'Produk berhasil dihapus' });
};