const express = require('express')
const app = express()
const morgan = require('morgan')

const rateLimit = require('express-rate-limit')

app.use(express.json())
app.use(morgan('combined'))

//conversion logic
const converUnits = (value, fromUnit, toUnit) => {
   // define the conversion rates
   const conversions = {
      mm: { m: 0.001, cm: 0.1, km: 1e-6, in: 0.0393701, ft: 0.00328084, yd: 0.00109361, mi: 6.2137e-7 },
      cm: { m: 0.01, mm: 10, km: 1e-5, in: 0.393701, ft: 0.0328084, yd: 0.0109361, mi: 6.2137e-6 },
      m: { km: 0.001, mm: 1000, cm: 100, in: 39.3701, ft: 3.28084, yd: 1.09361, mi: 0.000621371 },
      km: { m: 1000, mm: 1e6, cm: 100000, in: 39370.1, ft: 3280.84, yd: 1093.61, mi: 0.621371 },
      // Add other units...
      mg: { g: 0.001, kg: 1e-6, lb: 0.00000220462, oz: 0.000035274 },
        g: { mg: 1000, kg: 0.001, lb: 0.00220462, oz: 0.035274 },
        kg: { mg: 1e6, g: 1000, lb: 2.20462, oz: 35.274 },
        lb: { mg: 453592, g: 453.592, kg: 0.453592, oz: 16 },
        oz: { mg: 28349.5, g: 28.3495, kg: 0.0283495, lb: 0.0625 },
        // Temperature
        C: (value) => (value * 9/5) + 32, // Celsius to Fahrenheit
        F: (value) => (value - 32) * 5/9, // Fahrenheit to Celsius
        K: (value) => value - 273.15 // Kelvin to Celsius
   }

   // perform conversion
   if(conversions[fromUnit] && conversions[fromUnit][toUnit]){
      return value * conversions[fromUnit][toUnit]
   }else if (fromUnit === "C" && toUnit === "F") {
      return conversions.C(value);
  } else if (fromUnit === "F" && toUnit === "C") {
      return conversions.F(value);
  } else if (fromUnit === "C" && toUnit === "K") {
      return value + 273.15;
  } else if (fromUnit === "K" && toUnit === "C") {
      return conversions.K(value);
  }
   return null // conversion not found
}

//endpoint to conver units
app.post('/convert', (req, res) => {
   const {value, fromUnit, toUnit } = req.body

   if(typeof value !== 'number' || !fromUnit || !toUnit){
      return res.status(400).json({error: 'Invalid input'})
   }
   const convertedValue = converUnits(value, fromUnit, toUnit)

   if(convertedValue === null){
      return res.status(400).json({error: 'Conversion not possible'})
   }

   res.json({convertedValue})
})

const limiter = rateLimit({
   windowMs: 1*60*100, //1 minutes
   max: 100, // limit each IP to 100 request per windows
   message: 'To many request from theis IP, please try again later'
})

app.use(limiter)

const PORT = process.env.PORT || 3000
app.listen(PORT , () => {
   console.log(`Server is running at http://localhost:${PORT}`)
})