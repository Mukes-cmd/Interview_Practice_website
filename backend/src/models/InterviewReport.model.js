const mongoose = require('mongoose')

const Technicalquestion = new mongoose.Schema({
     question :{
        type: String,
        required : [ true, 'Technical question is required']
     },
     intention :{
        type: String,
        required : [true, "Intention is requied"]
     },
     answer : {
        type: String,
        required :[true, 'answer is required']
     }
},{
    _id: false
})

const BehaviourQuestion = new mongoose.Schema({
     question :{
        type: String,
        required : [ true, 'behaviourQuestions question is required']
     },
     intention :{
        type: String,
        required : [true, "Intention is requied"]
     },
     answer : {
        type: String,
        required :[true, 'answer is required']
     }
},{
    _id: false
})


const Skillsgaps = new mongoose.Schema({
    skill :{
        type: String,
        required :[true, "skill is required"]
    },
    severity : {
        type: String,
        enum : ["low", "medium", "high"],
        required :[true, "severity is required"]
    }
},{
    _id : false
})


const prepartionplan = new mongoose.Schema({
    day : {
        type: Number,
        required :[true, "day is required"]
    },
    focus : {
        type: String,
        required :[true, "focus is required"]
    },
    tasks: [{
        type: String,
        required: [true, 'tasks is required']
    }]
})

const interviewReportSchema = new mongoose.Schema({
      jobDescription :{
        type: String,
        required: [true, 'job description is requied']
      },
      resume : {
        type: String
      },
      selfDescription : {
        type: String
      },
      matchscore : {
        type: Number,
        min :0,
        max : 100,
      },
     

      technicalQuestion : [Technicalquestion],
      behaviourQuestion :[BehaviourQuestion],
      skillgaps :[Skillsgaps],
      plan : [prepartionplan],
      user : {
        type : mongoose.Schema.Types.ObjectId,
        ref :"users"
       }

      



},{
    timestamps: true
})


const interviewReportmodel = mongoose.model("interviewReport", interviewReportSchema)
module.exports = interviewReportmodel