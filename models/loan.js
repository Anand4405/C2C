const mongoose = require('mongoose');
const loanSchema = new mongoose.Schema ({
  loanee: String,
  accNo : String,
  amount : String,
  tenure : String,
  interest : String,
  lender : String,
});