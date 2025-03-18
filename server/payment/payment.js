import express from 'express';
 const app = express();

app.get('/', (req, res) => {
    res.send('Hello World');
  });

 app.post('/payment', (req, res) => {
    try {
        const {amount, currency} = req.body;
        console.log(amount, currency);
    } catch (error) {
        
    }
 })

 app.listen(4000, () => {
   console.log("Server is running on port 4000");
 })