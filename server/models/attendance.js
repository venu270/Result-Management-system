import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  name:{type:String,required:true},
  email:{type:String,required:true},
  date: { type: Date, default: Date.now },
  status: { type: String, required: true }
});

export default mongoose.model('Attendance', attendanceSchema);
