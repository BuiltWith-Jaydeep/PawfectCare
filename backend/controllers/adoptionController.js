const Adoption = require('../models/Adoption');

exports.createAdoption = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      housingType,
      landlordApproval,
      petType,
      petExperience,
      homeVisitAgreement,
      appointmentDate,
      appointmentTime,
    } = req.body;

    if (
      !name || !phone || !address || !housingType || !petType || 
      !petExperience || homeVisitAgreement === undefined || 
      !appointmentDate || !appointmentTime
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (housingType === 'Rent' && !landlordApproval) {
      return res.status(400).json({ error: 'Landlord approval is required for renters' });
    }

    const newAdoption = new Adoption({
      userId: req.user.id,
      name,
      phone,
      address,
      housingType,
      landlordApproval,
      petType,
      petExperience,
      homeVisitAgreement,
      appointmentDate,
      appointmentTime,
    });

    await newAdoption.save();
    res.status(201).json({ message: 'Adoption request submitted successfully!', adoption: newAdoption });
  } catch (error) {
    console.error('Error creating adoption:', error);
    res.status(500).json({ error: 'Server error while submitting adoption request' });
  }
};

exports.getUserAdoptions = async (req, res) => {
  try {
    const { userId } = req.params;

    // TEMPORARY: Commented out
    // if (req.user.id !== userId) {
    //   return res.status(403).json({ error: 'Unauthorized access' });
    // }

    const adoptionRequests = await Adoption.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(adoptionRequests || []);
  } catch (error) {
    console.error('Error fetching adoption requests:', error);
    res.status(500).json({ error: 'Server error while fetching adoption requests' });
  }
};

exports.getAllAdoptions = async (req, res) => {
  try {
    const adoptions = await Adoption.find().sort({ createdAt: -1 });
    res.status(200).json(adoptions || []);
  } catch (error) {
    console.error('Error fetching all adoptions:', error);
    res.status(500).json({ error: 'Server error while fetching adoptions' });
  }
};

exports.updateAdoption = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedAdoption = await Adoption.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedAdoption) {
      return res.status(404).json({ error: 'Adoption request not found' });
    }

    res.status(200).json({ message: 'Adoption request updated successfully', adoption: updatedAdoption });
  } catch (error) {
    console.error('Error updating adoption:', error);
    res.status(500).json({ error: 'Server error while updating adoption request' });
  }
};

exports.deleteAdoption = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedAdoption = await Adoption.findByIdAndDelete(id);

    if (!deletedAdoption) {
      return res.status(404).json({ error: 'Adoption request not found' });
    }

    res.status(200).json({ message: 'Adoption request deleted successfully' });
  } catch (error) {
    console.error('Error deleting adoption:', error);
    res.status(500).json({ error: 'Server error while deleting adoption request' });
  }
};