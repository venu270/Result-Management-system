import mongoose from 'mongoose';
const { Schema } = mongoose;
const studentSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  avatar: { type: String },
  password: { type: String, required: true },
  semester: { type: Number },
  subjects: { type: Array },
  username: { type: String },
  registrationNumber: { type: String },
  gender: { type: String },
  fatherName: { type: String },
  department: { type: String },
  division: { type: String },
  batch: { type: String },
  joiningYear: { type: String },
  contactNumber: { type: Number },
  dob: { type: Date },
  passwordUpdated: { type: Boolean, default: false }
});

export default mongoose.model('Student', studentSchema);
