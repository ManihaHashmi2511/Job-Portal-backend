const Application = require("../Models/Application.model");
const Job = require("../Models/Job.model");

const applyJob = async (req, res) => {

    try {
        // Add safety check for req.user
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const userId = req.user._id; // Fixed: use req.user._id instead of req.user.id
        const { id: jobId } = req.params; // ✅ Destructure properly
       
        
        if(!jobId) {
            return res.status(400).json({ message: 'Job ID is required' });
        }

        // Check if the user has already applied for the job
        const existingApplication = await Application.findOne({ 
            job: jobId, 
            applicants: userId 
        });
        if (existingApplication) {
            return res.status(400).json({ message: 'You have already applied for this job' });
        }
        // if job does not exist
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Create a new application
        const newApplication = await Application.create({
            job: jobId,
            applicants: userId,
        });

        job.application.push(newApplication._id);
        await job.save();

        res.status(201).json({ message: 'Job Applied successfully' });
    }

    catch (error) {
        console.error('Error applying for job:', error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
};

// user's applied jobs on which they are waiting for response
const getAppliedJobs = async (req, res) => {

     try {
        // Add safety check for req.user
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        const userId = req.user._id; // Fixed: use req.user._id instead of req.id
        const appliedJobs = await Application.find({ applicants: userId }).sort({ createdAt: -1 })
            .populate({ 
            path: 'job',
            options: { sort: { createdAt: -1 } },
            populate: { path: 'companyId', sort: { createdAt: -1 } }
        })

        if (!appliedJobs) {
            return res.status(404).json({ message: 'No applied jobs found' });
        }
         
        res.status(200).json(appliedJobs);
     } 
     
     catch (error) {
        console.error('Error fetching applied jobs:', error);
        res.status(500).json({ message: 'Internal server error' });
     }

}

// admin can see applicants mean users who have applied for the job

const getApplicants = async (req, res) => {

    try {
        // Add safety check for req.user
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
    
      const jobId = req.params.id;
      const applications = await Application.find({job: jobId}).populate({ // Fixed: find applications by job ID
        path : 'applicants', // Fixed: populate applicants directly
        options: { sort: { createdAt: -1 } }
      });
      if (!applications || applications.length === 0) { // Fixed: check if applications exist
        return res.status(200).json([]);
        }   
        res.status(200).json(applications);
        
    } 
    
    catch (error) {
        console.error('Error fetching applicants:', error);
       return res.status(500).json({ message: 'Internal server error' });
    }

}


const updateJobStatus = async (req, res) => { // Fixed: make function async
     
    try {
        // Add safety check for req.user
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }
        
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status) {
            return res.status(404).json({message: 'Status is required'});
        }

        // find appliants by appliant Id
        const application = await Application.findById(applicationId); // Fixed: add await
        if(!application){
            return res.status(404).json({message: 'Application not found'})
        }

        //update status

         application.status = status.toLowerCase(); // Fixed: add parentheses to toLowerCase()
         await application.save(); // Fixed: add await
         res.status(200).json({message: 'Status updated successfully'});
    } 
    
    catch (error) {
     console.error('Error updating status:', error);
     res.status(500).json({ message: 'Internal server error' });
    }

}


module.exports = {
    applyJob,
    getAppliedJobs,
    getApplicants,
    updateJobStatus
};
