import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: 'dzpw9bihb',
  api_key: '746919843845213',
  api_secret: '6aH_ajNRqyhpPvPTuJrc7Brh0Nc'
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.use(express.json());

app.post('/upload-file', upload.single('file'), (req, res) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Không có tệp được tải lên.' });
  }

  // Convert file buffer to a base64 string
  const dataUrl = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  const fileName = file.originalname.split('.')[0];

  cloudinary.uploader.upload(dataUrl, {
    public_id: fileName,
    resource_type: 'auto'
  }, (err, result) => {
    if (err) {
      console.error('Cloudinary upload error:', err);
      return res.status(500).json({ error: 'Tải lên thất bại.' });
    }

    console.log(result.secure_url);
    res.json({
      message: 'Tệp được tải lên thành công.',
      url: result
    });
  });
});

app.listen(8080, () => {
  console.log('Server is running!');
});


