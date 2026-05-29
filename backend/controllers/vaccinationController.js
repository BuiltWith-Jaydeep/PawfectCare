const Vaccination = require('../models/Vaccination');

exports.createVaccination = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      petType, 
      breed,
      age,
      vaccine,
      appointmentDate,
      appointmentTime,
      estimatedPrice,
    } = req.body;

    if (
      !name || !phone || !address || !petType || !breed || !age ||
      !vaccine || !appointmentDate || !appointmentTime || !estimatedPrice
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newVaccination = new Vaccination({
      userId: req.user.id,
      name,
      phone,
      address,
      petType, 
      breed,
      age,
      vaccine,
      appointmentDate,
      appointmentTime,
      estimatedPrice,
    });

    await newVaccination.save();
    res.status(201).json({ message: 'Vaccination booked successfully!', vaccination: newVaccination });
  } catch (error) {
    console.error('Error creating vaccination:', error);
    res.status(500).json({ error: 'Server error while booking vaccination' });
  }
};

exports.getUserVaccinations = async (req, res) => {
  try {
    const { userId } = req.params;
    // TEMPORARY: Auth check disabled to allow data fetching
    // if (req.user.id !== userId) {
    //   return res.status(403).json({ error: 'Unauthorized access' });
    // }
    const vaccinations = await Vaccination.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(vaccinations || []);
  } catch (error) {
    console.error('Error fetching vaccinations:', error);
    res.status(500).json({ error: 'Server error while fetching vaccinations' });
  }
};

exports.getAllVaccinations = async (req, res) => {
  try {
    const vaccinations = await Vaccination.find().sort({ createdAt: -1 });
    res.status(200).json(vaccinations || []);
  } catch (error) {
    console.error('Error fetching all vaccinations:', error);
    res.status(500).json({ error: 'Server error while fetching vaccinations' });
  }
};

exports.updateVaccination = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedVaccination = await Vaccination.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

    if (!updatedVaccination) {
      return res.status(404).json({ error: 'Vaccination not found' });
    }

    res.status(200).json({ message: 'Vaccination updated successfully', vaccination: updatedVaccination });
  } catch (error) {
    console.error('Error updating vaccination:', error);
    res.status(500).json({ error: 'Server error while updating vaccination' });
  }
};

exports.deleteVaccination = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedVaccination = await Vaccination.findByIdAndDelete(id);

    if (!deletedVaccination) {
      return res.status(404).json({ error: 'Vaccination not found' });
    }

    res.status(200).json({ message: 'Vaccination deleted successfully' });
  } catch (error) {
    console.error('Error deleting vaccination:', error);
    res.status(500).json({ error: 'Server error while deleting vaccination' });
  }
};