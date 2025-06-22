
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  activityCode: { 
    type: String,
    required: [true, 'كود النشاط مطلوب.'],
    unique: true,
    trim: true, 
    uppercase: true 
  },
  activityName: { // اسم النشاط
    type: String,
    required: [true, 'اسم النشاط مطلوب.'],
    trim: true
  },
  executingCompany: { // الشركة المنفذة
    type: String,
    
    trim: true
  },
  consultant: { // الاستشاري
    type: String,
    trim: true, 
    default: 'N/A' 
  },
  estimatedValue: { // قيمة تقديرية
    type: Number,
    
    min: [0, 'القيمة التقديرية يجب أن تكون أكبر من أو تساوي صفر.'],
    default: 0
  },
  contractualValue: { // قيمة تعاقدية
    type: Number,
    
    min: [0, 'القيمة التعاقدية يجب أن تكون أكبر من أو تساوي صفر.'],
    default: 0
  },
  disbursedAmount: { // المنصرف
    type: Number,
    min: [0, 'المبلغ المنصرف يجب أن يكون أكبر من أو يساوي صفر.'],
    default: 0
  },
  undisbursedAmount: { // لم يتم صرفه (يمكن حسابه لاحقًا بناءً على ContractualValue - DisbursedAmount)
    type: Number,
    min: [0, 'المبلغ غير المصروف يجب أن يكون أكبر من أو يساوي صفر.'],
    default: 0
  },
  assignmentDate: { // تاريخ الاسناد
    type: Date,
    default: null 
  },
  completionDate: { // تاريخ النهو
    type: Date,
    default: null 
  },
  receptionDate: { // تاريخ الاستلام
    type: Date,
    default: null
  },
  executionStatus: { // حالة التنفيذ (ن تنفيذ)
    type: Number,
    default: 0,
    trim: true
  },
}, {
  timestamps: true 
});


activitySchema.pre('save', function(next) {
  if (this.isModified('contractualValue') || this.isModified('disbursedAmount')) {
    this.undisbursedAmount = this.contractualValue - this.disbursedAmount;
    if (this.undisbursedAmount < 0) {
      this.undisbursedAmount = 0; 
    }
  }
  next();
});

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;