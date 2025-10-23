const express = require('express');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const methodOverride = require('method-override');


const app = express();
const port = 3002;
app.use(express.json()); // Add this line to parse JSON data in the body

 
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: true }));

 
 

 
app.use(express.static(path.join(__dirname, '/public')));
 

 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

 
app.get('/', (req, res) => {
  res.send('It\'s Working');
});

app.get('/Home', (req, res) => {
  res.render('Home');
});

app.get('/Home/about_us', (req, res) => {
  res.render('about');
});

app.get('/Home/contact', (req, res) => {
  res.render('contact');
});

app.get('/Home/donate', (req, res) => {
  res.render('donate');
});

 
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '@Suraj123',  
  database: 'minorproject',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    process.exit(1);  
  }
  console.log('Connected to database.');
});

 
const storage = multer.memoryStorage();
const upload = multer({ storage });

 
app.post('/uploaded', upload.single('document'), (req, res) => {
  const { name, age, email, mobile, description,problem,address } = req.body;
  const file = req.file;

   
  if (!name || !age || !email || !mobile || !description) {
    return res.status(400).send('All fields are required.');
  }

  
  const documentName = file ? file.originalname : "Not Uploaded";
  const documentBuffer = file ? file.buffer : null;


   
  const sql = `
    INSERT INTO Temp (name, age, email, mobile_number, description, document_name, document,problem,address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [name, age, email, mobile, description, documentName, documentBuffer,problem,address];

  
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error saving beneficiary details.');
    }
    res.render("thankyou");
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


app.get('/private',(req,res)=>{
  res.render("login.ejs");
})

app.post('/private/login', (req, res) => {
   
let {username,password}=req.body;


const sql = 'SELECT * FROM log WHERE username = ? AND password = ?';

 
db.query(sql, [username, password], (err, results) => {
    if (err) {
        console.error('Error retrieving data:', err);
        return res.status(500).send('Error retrieving beneficiary details.');
    }
    // console.log(results);
    // console.log(results.length)
    // console.log(username);
    // console.log(password);

    if(results.length==0){
      res.send("login invalid");
    }


    else{
      const query = 'SELECT * FROM Temp';

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error retrieving data:', err);
          return res.status(500).send('Error retrieving beneficiary details.');
      }

       
      res.render('private', { beneficiaries: results });
  });
    }
  
});
});



app.get('/private/view/:id', (req, res) => {
   
  const id = req.params.id;

   
  const query = `SELECT * FROM Temp WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      return res.status(500).send('Error retrieving beneficiary details.');
    }

   
    res.render('fulldetails', { beneficiary: results[0] });
    
    
  });
});

app.post('/view/:id', (req, res) => {
  
  let amount=req.body.amount;
   
  const id = req.params.id;
 
  const query = `SELECT * FROM Temp WHERE id = ?`;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      return res.status(500).send('Error retrieving beneficiary details.');
    }
    else{

      let permanent=results[0];
      
    const sql = `INSERT INTO permanent (name, age, email, mobile_number,problem,address, description, document, document_name,amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  const values = [permanent.name, permanent.age, permanent.email, permanent.mobile_number,permanent.problem,permanent.address, permanent.description, permanent.document, permanent.document_name,amount];

  db.query(sql, values, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      return res.status(500).send('Error retrieving beneficiary details.');
    }
    else{

      const sql = `DELETE FROM Temp WHERE id = ?`;

      const values = [id];  
      
      db.query(sql, values, (err, results) => {
        if (err) {
          console.error('Error deleting data:', err);
          return res.status(500).send('Error deleting beneficiary details.');
        }
        res.redirect("/Home");
      });
      


    }
    
     
  });
   
}
});
});





app.get('/Home/beneficiaries', (req, res) => {
  
  const query = 'SELECT * FROM permanent';

  db.query(query, (err, results) => {
      if (err) {
          console.error('Error retrieving data:', err);
          return res.status(500).send('Error retrieving beneficiary details.');
      }

      
      res.render('beneficiaries', { beneficiaries: results });
      //console.log(results);
  });
});



// Route to handle file download
app.get('/download-file/:id', (req, res) => {
  const beneficiaryId = req.params.id;

  // Query to get the file data from the database based on the beneficiary ID
  const query = 'SELECT document_name, document FROM Temp WHERE id = ?';

  db.query(query, [beneficiaryId], (err, results) => {
    if (err) {
      console.error('Error retrieving file:', err);
      return res.status(500).send('Error retrieving file.');
    }

    if (results.length === 0) {
      return res.status(404).send('File not found.');
    }

    const file = results[0];

    // Set the response headers for file download
    res.setHeader('Content-Disposition', `attachment; filename=${file.document_name}`);
    res.setHeader('Content-Type', 'application/octet-stream');  // Generic content type for binary data

     
    res.send(file.document);
  });
});

app.get('/Home/form',(req,res)=>{
  res.render("apply");
})

app.post('/submit-donation', (req, res) => {
  const { amount, transactionId } = req.body;
  console.log(amount);
  console.log(transactionId);
  if (!amount || !transactionId) {
      return res.status(400).json({ message: 'Amount and Transaction ID are required' });
  }

  // You can store the donation in your database, for example in a donations table.
  const sql = 'INSERT INTO donations (amount, transaction_id) VALUES (?, ?)';
  const values = [amount, transactionId];

  db.query(sql, values, (err, result) => {
      if (err) {
          console.error('Error saving donation:', err);
          return res.status(500).json({ message: 'Error saving donation' });
      }

      // Respond with a success message
      res.status(200).json({ message: 'Donation submitted successfully!' });
  });
});
