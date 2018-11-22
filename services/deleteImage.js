const fs = require('fs');
const path = require('path');

const deleteImage = (tipo, file) => {
  const ruta = path.resolve(__dirname, `../upload/${tipo}/${file}`);
  if (fs.existsSync(ruta)) {
    fs.unlinkSync(ruta);
  }
};

module.exports = deleteImage;
