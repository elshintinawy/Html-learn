const ActivityModel = require("../Models/activity_model");
const httpStatus = require("../utils/http_status");

const AddNewActivity = async (req, res) => {
  console.log("Received request body:", req.body);
  try {
    const existingActivity = await ActivityModel.findOne({
      activityCode: req.body.activityCode.toUpperCase(),
    });
    if (existingActivity) {
      return res
        .status(400)
        .json(
          httpStatus.httpFaliureStatus("Activity with this code already exists")
        );
    }
    const newActivityData = {
      ...req.body,
      activityCode: req.body.activityCode.toUpperCase(),
    };
    const newActivity = new ActivityModel(newActivityData);
    await newActivity.save();
    res.status(201).json(httpStatus.httpSuccessStatus(newActivity));
  } catch (error) {
    res.status(500).json(httpStatus.httpErrorStatus(error.message));
  }
};

/* const GetAllActivites = async (req, res) => {
  try {
    const activities = await ActivityModel.find({}, { __v: 0, _id: 0 });
    const activityCount = await ActivityModel.countDocuments({});
    const responseData = {
      total: activityCount,
      activities: activities,
    };
    res.status(200).json(httpStatus.httpSuccessStatus(responseData));
  } catch (error) {
    res.status(500).json(httpStatus.httpErrorStatus(error));
  }
}; */

const GetActivityById = async (req, res) => {
  try {
    const { activityCode } = req.params;
    const activity = await ActivityModel.findOne({
      activityCode: activityCode.toUpperCase(),
    });

    if (!activity)
      return res
        .status(404)
        .json(httpStatus.httpFaliureStatus("Activity not found"));

    // res.json(employee);
    res.status(200).json(httpStatus.httpSuccessStatus(activity));
  } catch (error) {
    res.status(400).json(httpStatus.httpErrorStatus(error.message));
  }
};

const DeleteActivity = async (req, res) => {
  try {
    const { activityCode } = req.params;
    const activity = await ActivityModel.findOneAndDelete({
      activityCode: activityCode.toUpperCase(),
    });

    if (!activity)
      return res
        .status(404)
        .json(httpStatus.httpFaliureStatus("Activity not found"));

    res
      .status(200)
      .json(httpStatus.httpSuccessStatus("Activity deleted successfully"));
  } catch (error) {
    res.status(400).json(httpStatus.httpErrorStatus(error.message));
  }
};


const updatableFieldsByRole = {
    'admin': [
        'activityCode', 'activityName', 'executingCompany', 'consultant',
        'governorate', 'fundingType', 'projectCategory', 'estimatedValue',
        'contractualValue', 'disbursedAmount', 'assignmentDate',
        'completionDate', 'receptionDate', 'executionStatus', 'progress', 'status'
    ],
    'manager': [
        'activityName', 'executingCompany', 'consultant', 'assignmentDate',
        'completionDate', 'receptionDate', 'executionStatus', 'progress'
    ],
    'financial': [
        'estimatedValue', 'contractualValue', 'disbursedAmount', 'undisbursedAmount'
    ],
    'employee': [] 
};

/* const UpdateActivity = async (req, res) => {
  try {
    const { activityCode } = req.params;
    const UpdateActivity = await ActivityModel.findOneAndUpdate(
      { activityCode: activityCode.toUpperCase() },
      { $set: req.body },
      { new: true }
    );
    if (!UpdateActivity)
      return res
        .status(404)
        .json(httpStatus.httpFaliureStatus("Activity not found"));

    res.status(200).json(httpStatus.httpSuccessStatus(UpdateActivity));
  } catch (error) {
    res.status(400).json(httpStatus.httpErrorStatus(error.message));
  }
}; */

 const UpdateActivity = async (req, res) => {

    try {
        const { activityCode } = req.params;
        const employeeRole = req.currentEmployee.role; 

        const activityToUpdate = await ActivityModel.findOne({
            activityCode: activityCode.toUpperCase(),
        });

        if (!activityToUpdate) {
            return res.status(404).json(httpStatus.httpFaliureStatus("Activity not found"));
        }

        const allowedFields = updatableFieldsByRole[employeeRole];
        Object.keys(req.body).forEach(key => {
            if (allowedFields.includes(key)) {
                activityToUpdate[key] = req.body[key];
            }
            else {
                return res.status(403).json(
                    httpStatus.httpFaliureStatus(`You are not allowed to update the field: ${key}`)
                );
            }
        });

        const updatedActivity = await activityToUpdate.save();
        res.status(200).json(
            httpStatus.httpSuccessStatus(updatedActivity)
        );

    } catch (error) {
        res.status(400).json(httpStatus.httpErrorStatus(error.message));
    }
}; 


const GetAllActivites = async (req, res) => {
    try {
        const query = req.query;
        const filter = {};
        if (query.name) {
            filter.activityName = { $regex: query.name, $options: 'i' };
        }
        if (query.governorate && query.governorate !== 'الكل') {
            filter.governorate = query.governorate;
        }
        if (query.status && query.status !== 'الكل') {
            filter.status = query.status; 
        }
        if (query.year && query.year !== 'الكل') {
          
            const year = parseInt(query.year);
            const startDate = new Date(year, 0, 1); 
            const endDate = new Date(year, 11, 31, 23, 59, 59); 
            
            
            filter.assignmentDate = { $gte: startDate, $lte: endDate };
        }
        

        console.log("Filtering with:", filter); 


        const activities = await ActivityModel.find(filter, { __v: 0, _id: 0 });
        const activityCount = await ActivityModel.countDocuments(filter);
        
        const responseData = {
            total: activityCount,
            activities: activities,
        };

        res.status(200).json(httpStatus.httpSuccessStatus(responseData));

    } catch (error) {
        res.status(500).json(httpStatus.httpErrorStatus(error.message));
    }
};



module.exports = {
  AddNewActivity,
  GetAllActivites,
  GetActivityById,
  DeleteActivity,
  UpdateActivity,
};
